const assert = require('assert'), fs = require('fs'), path = require('path');
const { EXAMPLES, KINDS, compute, fmt, assumption, savedLine, flowStats, shape, order } = require('../examples.js');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// ---- time-saved maths: expected values typed independently of the code under test: [by hand, with it, saved, hours/month]
const EXPECT = {
  'w-enquiries': ['2 h', '20 min', '1 h 40 min', 7.2], 'w-invoices': ['2 h', '30 min', '1 h 30 min', 6.5],
  'w-chat': ['2 h', '40 min', '1 h 20 min', 5.8],      'w-calendar': ['2 h', '30 min', '1 h 30 min', 6.5],
  'w-tracker': ['1 h 40 min', '25 min', '1 h 15 min', 5.4], 'w-email': ['2 h', '30 min', '1 h 30 min', 6.5],
  'w-sheets': ['3 h', '45 min', '2 h 15 min', 9.7],
};
for (const id of Object.keys(EXPECT)) {
  const e = EXAMPLES[id], c = compute(e), x = EXPECT[id];
  assert.deepStrictEqual([fmt(c.before), fmt(c.after), fmt(c.saved), c.monthlyHours], x, id);
  assert(c.saved > 0, id + ' must save time');
  assert(!/\$|R\s?\d|%/.test(JSON.stringify(e)), id + ' no currency or percentages');
}
assert.strictEqual(fmt(0), '0 min'); assert.strictEqual(fmt(59.6), '1 h');
assert(EXAMPLES['w-team'] && !EXAMPLES['w-team'].perWeek, 'Your team card has no numbers');
assert.strictEqual(assumption(EXAMPLES['w-enquiries']),
  'Assumes 20 enquiries a week at 6 min each by hand, and about 1 min each to review what is flagged.');
assert.strictEqual(assumption(EXAMPLES['w-sheets']),
  'Assumes one weekly reconcile at 3 h by hand, and about 45 min to check the differences it lists.');
assert.strictEqual(savedLine(EXAMPLES['w-enquiries']), 'About 1 h 40 min back each week');
assert.strictEqual(savedLine(EXAMPLES['w-team']), '');
for (const id of Object.keys(EXPECT)) {
  const e = EXAMPLES[id], a = assumption(e);
  assert(a.includes(fmt(e.minByHand)), id + ' assumption states the by-hand time');
  if (e.perWeek > 1) assert(a.includes(String(e.perWeek)), id + ' assumption states the weekly volume');
}

// ---- one workflow per node on the hero web, drawn as nodes and edges (the n8n-style canvas)
const IDS = ['w-calendar', 'w-chat', 'w-email', 'w-enquiries', 'w-invoices', 'w-sheets', 'w-team', 'w-tracker'];
assert.deepStrictEqual(Object.keys(EXAMPLES).sort(), IDS, 'one workflow per node on the web');
assert.deepStrictEqual(KINDS.slice().sort(), ['ai', 'done', 'hub', 'human', 'step', 'trigger']);
const heroHtml = html.slice(html.indexOf('class="web"'), html.indexOf('</svg>', html.indexOf('class="web"')));
for (const id of IDS) {
  const e = EXAMPLES[id], N = e.flow.nodes, byId = {};
  assert(new RegExp('id="' + id + '"').test(heroHtml), id + ' must be a node on the hero web in index.html');
  assert(heroHtml.includes('>' + e.title + '<'), id + ' title must match the hero node label');
  assert(N.length >= 4 && N.length <= 8, id + ': 4 to 8 nodes, got ' + N.length);
  N.forEach((n) => {
    assert(!byId[n.id], id + ': duplicate node id ' + n.id); byId[n.id] = n;
    assert(KINDS.includes(n.k), id + ': unknown kind ' + n.k);
    assert(Number.isInteger(n.c) && n.c >= 0 && n.c <= 5, id + ': column 0-5 for ' + n.id);
    assert(Number.isInteger(n.r) && n.r >= 0 && n.r <= 2, id + ': row 0-2 for ' + n.id);
    assert(n.t && n.t.length <= 26, id + ': title fits the node (<=26 chars): "' + n.t + '" is ' + n.t.length);
    assert(n.s && n.s.length <= 52, id + ': sub-line fits the node (<=52 chars): "' + n.s + '"');
    assert(!/[\u2014\u2013]/.test(n.t + n.s), id + ': no dashes in copy');
  });
  const seen = {};
  N.forEach((n) => { const k = n.c + ',' + n.r; assert(!seen[k], id + ': two nodes share the cell ' + k); seen[k] = 1; });
  const inc = {}, out = {};
  e.flow.edges.forEach((x) => {
    assert(byId[x[0]] && byId[x[1]], id + ': edge points at a missing node ' + x);
    assert(byId[x[0]].c < byId[x[1]].c, id + ': edges run left to right: ' + x[0] + ' to ' + x[1]);
    inc[x[1]] = (inc[x[1]] || 0) + 1; out[x[0]] = (out[x[0]] || 0) + 1;
    if (x[2] != null) assert(x[2].length <= 10, id + ': edge label short: ' + x[2]);
  });
  N.forEach((n) => {
    if (!inc[n.id]) assert(n.k === 'trigger' || n.k === 'hub', id + ': "' + n.t + '" has nothing before it so it must be a trigger');
    if (n.k === 'trigger' || n.k === 'hub') assert(!inc[n.id], id + ': a trigger has nothing before it');
    if (!out[n.id]) assert(n.k === 'done' || n.k === 'human', id + ': "' + n.t + '" ends the flow so it must be an outcome or a person');
    if (n.k === 'done') assert(!out[n.id], id + ': a result has nothing after it');
  });
  assert.strictEqual(N.filter((n) => n.k === 'trigger' || n.k === 'hub').length, 1, id + ': exactly one start');
  const sh = shape(e);
  assert(sh.cols <= 6 && sh.rows <= 3, id + ': shape ' + JSON.stringify(sh));
  // reading order (used for the page list, the screen-reader order and the run animation): by column, then row
  const o = order(e).map((n) => n.id);
  assert.strictEqual(o.length, N.length);
  for (let i = 1; i < o.length; i++) { const a = byId[o[i - 1]], b = byId[o[i]]; assert(a.c < b.c || (a.c === b.c && a.r < b.r), id + ': order is by column then row'); }
}
assert.deepStrictEqual(shape(EXAMPLES['w-enquiries']), { cols: 5, rows: 3 });
assert.deepStrictEqual(shape(EXAMPLES['w-sheets']), { cols: 6, rows: 3 });
assert.deepStrictEqual(shape(EXAMPLES['w-team']), { cols: 2, rows: 3 });
assert.deepStrictEqual(order(EXAMPLES['w-enquiries']).map((n) => n.t),
  ['New enquiry', 'Check the details', 'Flag what is unclear', 'Update the tracker', 'A person reviews', 'Team sees one view']);

// ---- stats shown on the card
assert.deepStrictEqual(flowStats(EXAMPLES['w-enquiries']), { nodes: 6, ai: 1, human: 1 });
assert.deepStrictEqual(flowStats(EXAMPLES['w-invoices']), { nodes: 6, ai: 0, human: 1 });
assert.deepStrictEqual(flowStats(EXAMPLES['w-sheets']), { nodes: 8, ai: 0, human: 1 });
for (const id of IDS) assert(flowStats(EXAMPLES[id]).ai <= 1, id + ': at most one AI step');

// ---- safety: nothing reaches a customer without a person first (money, messages). A node is "out" if it leaves the business.
function reachable(e, blocked) {
  const f = e.flow, adj = {}, byId = {}; f.nodes.forEach((n) => { byId[n.id] = n; });
  f.edges.forEach((x) => { (adj[x[0]] = adj[x[0]] || []).push(x[1]); });
  const q = f.nodes.filter((n) => (n.k === 'trigger' || n.k === 'hub') && !blocked(n)).map((n) => n.id), seen = new Set(q);
  while (q.length) (adj[q.shift()] || []).forEach((t) => { if (!seen.has(t) && !blocked(byId[t])) { seen.add(t); q.push(t); } });
  return seen;
}
const outs = { 'w-invoices': 'Send to the client', 'w-chat': 'Send the reply', 'w-calendar': 'Offer the times' };
for (const id of Object.keys(outs)) {
  const e = EXAMPLES[id], n = e.flow.nodes.find((x) => x.t === outs[id]);
  assert(n && n.out, id + ': "' + outs[id] + '" is marked as leaving the business');
  assert(!reachable(e, (x) => x.k === 'human').has(n.id), id + ': "' + n.t + '" must be unreachable without passing a person');
}
for (const id of IDS) EXAMPLES[id].flow.nodes.filter((n) => n.out).forEach((n) =>
  assert(!reachable(EXAMPLES[id], (x) => x.k === 'human').has(n.id), id + ': "' + n.t + '" leaves the business, so a person comes first'));
assert.strictEqual(flowStats(EXAMPLES['w-invoices']).ai, 0, 'money steps stay human-reviewed: no AI in Invoices');
assert(EXAMPLES['w-invoices'].flow.nodes.some((n) => n.k === 'human' && /approve/i.test(n.t)), 'Invoices has a visible approve step');
assert(EXAMPLES['w-team'].flow.nodes.every((n) => n.k === 'human' || n.k === 'hub'), 'Your team is all people');

// ---- the page keeps a no-JavaScript list that says the same thing as the data (no drift)
const list = html.slice(html.indexOf('<ul class="wf-list"'), html.indexOf('</ul>\n', html.indexOf('<ul class="wf-list"')) + 5);
assert(list.length > 200, 'index.html has the static workflow list');
for (const id of IDS) {
  const e = EXAMPLES[id], at = list.indexOf('<h3>' + e.title + '</h3>');
  assert(at > -1, id + ': static list has the heading ' + e.title);
  let from = at;
  order(e).forEach((n) => {
    const i = list.indexOf('<li>' + n.t + '</li>', from);
    assert(i > -1, id + ': static list is missing "' + n.t + '" in order'); from = i;
  });
}
assert(html.includes('id="workflows"') && html.includes('aria-labelledby="workflows-title"'), 'section is labelled');
assert(!/<script[^>]*hero-cards/.test(html), 'v4 does not load the hero card script: the hero web stays as in v2');

// ---- popup placement (v5): the workflow opens right beside the tool you point at
const { place } = require('../examples.js');
assert.strictEqual(typeof place, 'function', 'place() is exported');
{
  const hero = html.slice(html.indexOf('<svg class="web"'), html.indexOf('</svg>', html.indexOf('<svg class="web"')));
  const nodes = [];
  hero.replace(/<g\b[^>]*>/g, (tag) => {
    const id = /\bid="(w-[a-z]+)"/.exec(tag), tr = /transform="translate\(([-\d.]+),([-\d.]+)\)"/.exec(tag);
    if (id && tr && EXAMPLES[id[1]]) nodes.push({ id: id[1], x: +tr[1], y: +tr[2] });
    return tag;
  });
  assert.strictEqual(nodes.length, 8, 'the hero web has the 8 nodes (found ' + nodes.length + ')');
  const labelLeft = { 'w-sheets': 1, 'w-enquiries': 1, 'w-email': 1, 'w-tracker': 1 };
  let checked = 0;
  [960, 1024, 1100, 1280, 1440, 1920].forEach((vw) => {
    const f = { w: Math.min(1116, vw - 64 - 50), h: Math.max(620, Math.min(700, vw * 0.54)) };
    nodes.forEach((n) => {
      const nx = (n.x - 40) / 520 * f.w, ny = (n.y - 100) / 350 * f.h, lw = 8 + EXAMPLES[n.id].title.length * 7.4;   // dot + label, like the button
      const r = labelLeft[n.id] ? { left: nx - 6 - lw, right: nx + 6, top: ny - 22, bottom: ny + 22 } : { left: nx - 6, right: nx + 6 + lw, top: ny - 22, bottom: ny + 22 };
      const want = { w: Math.min(640, Math.max(380, f.w * 0.54)), h: 600 }, p = place(r, want, f, 10, 8, 340), tag = n.id + ' @' + vw;
      assert(p.left >= 8 - 1e-6 && p.left + p.w <= f.w - 8 + 1e-6, tag + ': popup inside the field horizontally');
      assert(p.top >= 8 - 1e-6 && p.top + want.h <= f.h - 8 + 1e-6, tag + ': popup inside the field vertically');
      assert(p.w >= 340 && p.w <= want.w, tag + ': width stays between the minimum and the wanted width');
      const overlap = p.left < r.right && p.left + p.w > r.left && p.top < r.bottom && p.top + want.h > r.top;
      assert(!overlap, tag + ': popup does not cover the tool it belongs to');
      const gap = p.side === 'r' ? p.left - r.right : r.left - (p.left + p.w);
      assert(gap >= 0 && gap <= 12, tag + ': popup sits within 12px of the tool (gap ' + gap.toFixed(1) + ')');
      assert((r.top + r.bottom) / 2 > p.top + 20 && (r.top + r.bottom) / 2 < p.top + want.h - 20, tag + ': the pointer can cross straight into the popup (same height)');
      checked++;
    });
  });
  assert.strictEqual(checked, 48, 'every tool at every width was checked');
}
console.log('examples.test.js: all passed');
