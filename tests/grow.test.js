// Tests for the web that grows down the page (the pure core of weave-grow.js; the DOM part is checked in a real browser).
// Scene = a page-shaped set of text/card boxes in a 1440 x 6600 page. The web must live in the free space around them.
const assert = require('assert');
const G = require('../weave-grow.js');

function scene(W, H) {
  const blocks = [], col = [162, W - 162];
  // sections of ~1000px, the first one starting below the hero (as on the real page): kicker + heading + lede (narrow, so there is
  // a pocket on the right), then a full-width card. The roots sit at the bottom of the hero web, in clear space above section one.
  for (let y = 900; y < H - 900; y += 1000) {
    blocks.push([col[0], y, col[0] + 120, y + 16]);          // kicker
    blocks.push([col[0], y + 30, col[0] + 560, y + 100]);    // heading
    blocks.push([col[0], y + 116, col[0] + 640, y + 200]);   // lede
    blocks.push([col[0], y + 260, col[1], y + 760]);         // full-width card
  }
  blocks.push([W - 560, 40, W - 40, 560]);                   // the hero web box, top right
  return { blocks, col };
}
const W = 1440, H = 6600, S = scene(W, H);
const cfg = (o) => Object.assign({ W, H, blocks: S.blocks, col: S.col, seed: 7, margin: 14,
  roots: [{ x: 1000, y: 640 }, { x: 1150, y: 640 }], targets: [{ x: 400, y: H - 300, main: true }] }, o || {});

const t0 = Date.now(), R = G.grow(cfg()), ms = Date.now() - t0;
assert(R.branches.length > 10, 'grows a network: ' + R.branches.length + ' branches');

// 1. Never touches content: every point along the smooth curve keeps clear of every box (the page checker pads 4px; we demand 8+).
function dist(p, b) { const dx = Math.max(b[0] - p[0], 0, p[0] - b[2]), dy = Math.max(b[1] - p[1], 0, p[1] - b[3]); return Math.hypot(dx, dy); }
let worst = Infinity, samples = 0;
for (const br of R.branches) for (const p of G.curvePoints(br.pts, 2)) {
  samples++;
  for (const b of S.blocks) { const d = dist(p, b); if (d < worst) worst = d; }
  assert(p[0] >= 1.5 && p[0] <= W - 1.5 && p[1] >= 0 && p[1] <= H, 'inside the page (a 1.5px line centred 1.5px in is not clipped by the svg edge): ' + p);
}
assert(worst >= 8, 'closest approach to any box is ' + worst.toFixed(1) + 'px (need >= 8)');

// 2. One connected web: every branch starts on a root or on a point of another branch (junction points are shared exactly).
const key = (p) => p[0].toFixed(1) + ',' + p[1].toFixed(1);
const rootKeys = new Set(R.roots.filter(Boolean).map(key));
const ends = new Map();                       // key -> branches touching it
R.branches.forEach((b, i) => [b.pts[0], b.pts[b.pts.length - 1]].forEach((p) => { const k = key(p); (ends.get(k) || ends.set(k, []).get(k)).push(i); }));
const seen = new Set(), queue = [];
R.branches.forEach((b, i) => { if (rootKeys.has(key(b.pts[0]))) { seen.add(i); queue.push(i); } });
while (queue.length) { const b = R.branches[queue.shift()]; for (const p of [b.pts[0], b.pts[b.pts.length - 1]]) for (const j of ends.get(key(p))) if (!seen.has(j)) { seen.add(j); queue.push(j); } }
assert.strictEqual(seen.size, R.branches.length, 'every branch is joined to the roots (' + seen.size + ' of ' + R.branches.length + ')');

// 3. Same seed, same web; another seed, another web.
assert.deepStrictEqual(G.grow(cfg()).branches.map((b) => b.pts.length), R.branches.map((b) => b.pts.length), 'deterministic');
assert.notDeepStrictEqual(G.grow(cfg({ seed: 8 })).branches.map((b) => b.pts.length), R.branches.map((b) => b.pts.length), 'seed changes the web');

// 4. It gets more complex as you go down: more knots per 1000px in the last third than in the first third.
const third = (lo, hi) => R.knots.filter((k) => k.y >= lo && k.y < hi).length;
const top = third(600, 2800), bottom = third(H - 2800, H);
assert(bottom >= top * 1.4, 'denser lower down: top third ' + top + ' knots, bottom third ' + bottom);

// 5. Growth order: thresholds never go backwards along a branch, and a branch never appears before the branch it grows from.
const startThr = new Map();
R.branches.forEach((b) => b.thr.forEach((t, i) => { const k = key(b.pts[i]); if (!startThr.has(k) || t < startThr.get(k)) startThr.set(k, t); }));
R.branches.forEach((b, i) => {
  for (let k = 1; k < b.thr.length; k++) assert(b.thr[k] >= b.thr[k - 1], 'thr monotone on branch ' + i);
  if (!rootKeys.has(key(b.pts[0]))) {
    const parent = Math.min(...(ends.get(key(b.pts[0])) || []).filter((j) => j !== i).map((j) => R.branches[j].thr[R.branches[j].thr.length - 1] === undefined ? Infinity : Math.min.apply(null, R.branches[j].thr)));
    assert(b.thr[0] >= parent - 1e-6, 'branch ' + i + ' does not appear before what it grows from');
  }
});
// no pop: a branch takes some scroll to draw, even a flat one
R.branches.forEach((b, i) => { const len = G.length(b.pts); if (len > 60) assert(b.thr[b.thr.length - 1] - b.thr[0] >= len * 0.4 - 1e-6, 'branch ' + i + ' grows over scroll, not all at once'); });

// 6. The route to the end target is flagged and runs from a root to that target, and reaches the far side of the page.
const mains = R.branches.filter((b) => b.main);
assert(mains.length >= 1, 'a main route exists');
const endHit = mains.some((b) => Math.hypot(b.pts[b.pts.length - 1][0] - R.targets[0].x, b.pts[b.pts.length - 1][1] - R.targets[0].y) < 1);
assert(endHit, 'the main route ends on the end target');
assert(R.targets[0].reached, 'end target was reachable');

// 7. Reveal maths: nothing drawn before the first threshold, everything after the last, monotone in between.
const b0 = R.branches.find((b) => G.length(b.pts) > 100);
assert.strictEqual(G.frac(b0, b0.thr[0] - 1), 0); assert.strictEqual(G.frac(b0, b0.thr[b0.thr.length - 1] + 1), 1);
let prev = 0; for (let r = b0.thr[0]; r <= b0.thr[b0.thr.length - 1]; r += 10) { const f = G.frac(b0, r); assert(f >= prev - 1e-9); prev = f; }

// 8. A target nobody can reach (sealed in by boxes) is reported, not drawn through the boxes.
const sealed = G.grow(cfg({ blocks: S.blocks.concat([[300, H - 400, 500, H - 200]]), targets: [{ x: 400, y: H - 300, main: true }] }));
assert.strictEqual(sealed.targets[0].reached, false, 'unreachable target is reported');

// 9. Fast enough to rebuild on resize (Node here; phones are slower, so the budget is generous but real).
assert(ms < 700, 'build took ' + ms + 'ms for a 1440 x 6600 page');

// 10. Roots INSIDE a block (the hero web's lowest nodes). Each leaves its dot on a straight stem, exactly vertical, long enough to
// clear the block; nothing else wanders into that block (it would cross the hero's own threads).
const HB = [900, 40, 1300, 520, 0];                                  // x0, y0, x1, y1, own margin 0
const noHero = S.blocks.filter((b) => !(b[0] === W - 560 && b[1] === 40));
const RT = [{ x: 960, y: 470, stem: 90 }, { x: 1100, y: 500, stem: 60 }, { x: 1240, y: 484, stem: 76 }];
const inside = G.grow(cfg({ blocks: noHero.concat([HB]), roots: RT }));
assert(inside.branches.length > 10, 'web grows out of roots that start inside a block: ' + inside.branches.length);
let strays = 0;
for (const br of inside.branches) for (const p of G.curvePoints(br.pts, 2))
  if (p[0] > HB[0] + 1 && p[0] < HB[2] - 1 && p[1] > HB[1] + 1 && p[1] < HB[3] - 1 && !RT.some((r) => Math.abs(p[0] - r.x) < 0.01)) strays++;
assert.strictEqual(strays, 0, 'nothing but the stems enters the hero block (' + strays + ' stray points)');
for (const r of RT) {
  const st = inside.branches.find((b) => b.pts.length === 2 && b.pts[0][0] === r.x && b.pts[0][1] === r.y);
  assert(st, 'root at ' + r.x + ' has a stem branch');
  assert.strictEqual(st.pts[1][0], r.x, 'stem is exactly vertical'); assert.strictEqual(st.pts[1][1], r.y + r.stem, 'stem has the asked length');
  assert(st.thr[1] > st.thr[0], 'stem takes some scroll to draw');
  assert(inside.branches.some((b) => b !== st && (b.pts[0][0] === r.x && b.pts[0][1] === r.y + r.stem || b.pts[b.pts.length - 1][0] === r.x && b.pts[b.pts.length - 1][1] === r.y + r.stem)), 'the web carries on from the end of the stem at ' + r.x);
}
const rk = new Set(inside.roots.map(key)), ek = new Map();
inside.branches.forEach((b, i) => [b.pts[0], b.pts[b.pts.length - 1]].forEach((p) => { const k = key(p); (ek.get(k) || ek.set(k, []).get(k)).push(i); }));
const seen2 = new Set(), q2 = [];
inside.branches.forEach((b, i) => { if (rk.has(key(b.pts[0]))) { seen2.add(i); q2.push(i); } });
while (q2.length) { const b = inside.branches[q2.shift()]; for (const p of [b.pts[0], b.pts[b.pts.length - 1]]) for (const j of ek.get(key(p))) if (!seen2.has(j)) { seen2.add(j); q2.push(j); } }
assert.strictEqual(seen2.size, inside.branches.length, 'with stems the web is still one piece (' + seen2.size + ' of ' + inside.branches.length + ')');

// 11. A root whose stem would run through text is skipped, not drawn through it (a phone's hero web is small and its labels are big).
const LABEL = [940, 520, 1000, 548];                                 // a label just under the first root's stem (x = 960, y 470 to 560)
const blocked = G.grow(cfg({ blocks: noHero.concat([HB, LABEL]), roots: RT }));
assert.strictEqual(blocked.roots.length, 2, 'the root whose stem hits a label is skipped: ' + blocked.roots.length + ' roots');
assert(!blocked.roots.some((r) => r[0] === 960), 'it is the root at x = 960 that is skipped');
let thru = 0;
for (const br of blocked.branches) for (const p of G.curvePoints(br.pts, 2)) if (dist(p, LABEL) < 8) thru++;
assert.strictEqual(thru, 0, 'nothing is drawn through the label (' + thru + ' points within 8px)');
assert(blocked.branches.length > 10, 'the other two roots still grow the web');
const none = G.grow(cfg({ blocks: noHero.concat([HB, [900, 520, 1300, 560]]), roots: RT }));
assert.strictEqual(none.branches.length, 0, 'no usable root, no web (and no crash)');

// 12. A dot's own label (7px beside it, as on a phone) and the block it sits in are ignored for its own stem; any OTHER label is not.
// The stem is grown just long enough to leave its block and stand clear (margin + 1).
const small = (blocks, roots) => G.grow({ W: 400, H: 1000, blocks, roots, targets: [{ x: 60, y: 900, main: true }], seed: 3, margin: 14 });
const heroBox = [60, 60, 300, 130], ownLabel = [207, 90, 260, 110], otherLabel = [90, 150, 140, 170];
const r12 = small([heroBox, ownLabel, otherLabel], [{ x: 200, y: 100, stem: 24 }, { x: 100, y: 100, stem: 24 }]);
assert.strictEqual(r12.roots.length, 1, 'the stem through another label is skipped, the one beside its own label is kept: ' + r12.roots.length);
assert.strictEqual(r12.roots[0][0], 200, 'the kept root is the one at x = 200');
const st12 = r12.branches.find((b) => b.pts.length === 2 && b.pts[0][0] === 200 && b.pts[0][1] === 100);
assert(st12 && st12.pts[1][0] === 200, 'stem is exactly vertical');
assert(st12.pts[1][1] >= 130 + 15 && st12.pts[1][1] <= 130 + 15 + 6, 'stem is just long enough to leave the block (ends at y = ' + st12.pts[1][1] + ')');
// a root that is not inside anything keeps the asked length
const free12 = small([[300, 500, 380, 520]], [{ x: 100, y: 100, stem: 30 }]);
const fs12 = free12.branches.find((b) => b.pts.length === 2 && b.pts[0][0] === 100 && b.pts[0][1] === 100);
assert(fs12 && fs12.pts[1][1] === 130, 'a free root keeps the asked stem length');
// 13. A narrow gap beside the content must not depend on the viewport width. On a phone the only way down is a ~5px gap between the
// content and the page edge; a 10px routing grid finds it or misses it depending on width mod 10 (375px worked, 360px did not).
const gapScene = (W) => ({
  W, H: 3000, seed: 5, margin: 10,
  blocks: [[20, 200, W - 19, 2900], [0, 200, 8, 2900], [60, 40, 260, 120]],      // the content, the Thread rail on the left (closes that side), a hero block
  roots: [{ x: 160, y: 80, stem: 60 }],
  targets: [{ x: 160, y: 2960, main: true, alts: [{ x: W - 5, y: 2960 }] }],
});
// the right-hand gap is (W-19+10, W-4] = (W-9, W-4]: 5px wide, wherever W falls on the grid
const missed = [];
for (let W = 300; W <= 420; W += 3) {
  const r = G.grow(gapScene(W));
  if (!r.targets[0].reached) missed.push(W);
}
assert.strictEqual(missed.length, 0, 'the web finds a 5px gap at every width, but missed W = ' + missed.join(', '));
// and the web in that gap is drawn clear of the content and inside the page
const g13 = G.grow(gapScene(345));
assert(g13.branches.some((b) => b.main), 'a main route runs down the gap');
for (const br of g13.branches) for (const p of G.curvePoints(br.pts, 2)) assert(p[0] >= 1.5 && p[0] <= 345 - 1.5, 'stays inside the page: ' + p);
console.log('grow.test.js: all passed | ' + R.branches.length + ' branches, ' + R.knots.length + ' knots, ' + samples + ' samples, closest ' + worst.toFixed(1) + 'px, ' + ms + 'ms');
