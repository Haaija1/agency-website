/* BPR site: "Example workflows". The hero web, bigger and alive: it drifts, leans toward the pointer and sends small signals along its threads.
   Point at a tool and its workflow opens in a popup right beside it, as an n8n-style canvas that is wider than the popup. The wheel over the popup
   (or a drag, a swipe, the arrow keys) moves the canvas sideways. Two blue stems leave the web at its foot: that is where the page web joins it.
   Progressive enhancement: without this file the page shows the same workflows as a list. Numbers come from examples.js and are illustrative
   placeholders. Node positions and links are read from the hero web, so the two can never drift apart. */
(function () {
  'use strict';
  var X = window.SITE_EXAMPLES, host = document.getElementById('wfx');
  if (!X || !host) return;
  var NS = 'http://www.w3.org/2000/svg', E = X.EXAMPLES, slice = Array.prototype.slice, mm = window.matchMedia;
  var reduce = mm && mm('(prefers-reduced-motion: reduce)').matches, desk = mm('(min-width:960px)'), fine = mm('(hover:hover) and (pointer:fine)').matches;
  var hero = document.querySelector('.web'), POS = {}, LINKS = [], IDS = [];
  if (!hero) return;
  slice.call(hero.querySelectorAll('.node')).forEach(function (g) {      /* [x, y, 'e' = label to the left of the dot, 's' = to the right] */
    var m = /translate\(([-\d.]+),([-\d.]+)\)/.exec(g.getAttribute('transform')), n = g.querySelector('.node-name');
    if (m && n && E[g.id]) { IDS.push(g.id); POS[g.id] = [+m[1], +m[2], n.getAttribute('text-anchor') === 'end' ? 'e' : 's']; }
  });
  slice.call(hero.querySelectorAll('.link')).forEach(function (p) { var e = p.getAttribute('data-ends').split(' '); if (POS[e[0]] && POS[e[1]]) LINKS.push([e[0], e[1], +p.getAttribute('stroke-width')]); });
  if (IDS.length < 2) return;
  var VB = [40, 100, 520, 350];                                  /* the part of the hero web that holds the nodes and labels */
  var NW = 212, NH = 112, PX = 288, PY = 132, PAD = 18, CH = PAD * 2 + 2 * PY + NH;   /* node size, column and row pitch, padding, fixed height (the popup never jumps between tools) */
  var GLYPH = { trigger: 'M13 3L5 14h6l-1 7 8-11h-6z', step: 'M5 12h13M13 6l6 6-6 6', ai: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
                human: 'M12 11a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2zM5 20c0-3.9 3.1-6 7-6s7 2.1 7 6', done: 'M5 12.5l4.2 4.2L19 7', hub: 'M12 11a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2zM5 20c0-3.9 3.1-6 7-6s7 2.1 7 6' };
  var TAG = { trigger: 'Starts it', step: 'Automatic', ai: 'AI', human: 'A person', done: 'Result', hub: 'People' };
  var PILL = { trigger: 'deterministic', step: 'deterministic', ai: 'agentic', human: 'human', done: 'done', hub: 'human' };
  var STEMS = { 'w-sheets': 'in', 'w-tracker': 'a', 'w-calendar': 'b' };   /* where the page web joins: it comes in above Spreadsheets, runs through Your team and leaves below Tracker */
  var ROUTE = { 'w-sheets w-team': 1, 'w-team w-sheets': 1, 'w-team w-tracker': 1, 'w-tracker w-team': 1 };

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function sv(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function f1(n) { return n.toFixed(1); }

  /* ---------- the web ---------- */
  var field = el('div', 'wx-field'), web = el('div', 'wx-web'), links = sv('svg', { 'class': 'wx-links', 'aria-hidden': 'true', focusable: 'false' });
  var linkEls = [], lp = [], buttons = [], btn = {}, base = {}, off = {}, stemEls = {}, ports = [], sg = [], fw = 0, fh = 0;
  web.appendChild(links);
  LINKS.forEach(function (l, i) {
    var p = sv('path', { 'class': 'wx-link', 'stroke-width': l[2], pathLength: 1 });
    p.style.setProperty('--i', i); p.setAttribute('data-ends', l[0] + ' ' + l[1]); if (ROUTE[l[0] + ' ' + l[1]]) p.classList.add('route');
    links.appendChild(p); linkEls.push(p); lp.push({ a: l[0], b: l[1], ax: 0, ay: 0, qx: 0, qy: 0, bx: 0, by: 0 });
  });
  Object.keys(STEMS).forEach(function (id) {
    if (!POS[id]) return;
    var p = sv('path', { 'class': 'wx-link wx-stem', pathLength: 1 }), port = el('i', 'wx-port');
    p.style.setProperty('--i', LINKS.length + 2); if (STEMS[id] === 'in') p.classList.add('wx-in'); links.appendChild(p); stemEls[id] = p;
    port.setAttribute('data-port', STEMS[id]); port.setAttribute('data-for', id); port.setAttribute('aria-hidden', 'true'); web.appendChild(port); ports.push(port);
  });
  for (var s = 0; s < 3; s++) { var dot = sv('circle', { 'class': 'wx-sig', r: 2.6, opacity: 0 }); links.appendChild(dot); sg.push({ c: dot, l: -1, t: 0, v: 0, rev: false, wait: 0.6 + s * 1.3 }); }
  IDS.forEach(function (id, i) {
    var p = POS[id], b = el('button', 'wx-node lab-' + (p[2] === 'e' ? 'l' : 'r') + (id === 'w-team' ? ' team' : ''));
    b.type = 'button'; b.setAttribute('data-id', id); b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-controls', 'wx-stage'); b.style.setProperty('--i', i);
    b.appendChild(el('i', 'wx-dot')); b.appendChild(el('span', 'wx-name', E[id].title));
    web.appendChild(b); buttons.push(b); btn[id] = b; off[id] = [0, 0];
  });

  /* ---------- the popup ---------- */
  var stage = el('div', 'wx-stage'); stage.id = 'wx-stage'; stage.setAttribute('role', 'region'); stage.setAttribute('aria-labelledby', 'wx-title');   /* a div: the page styles every <section> with big padding */
  var head = el('div', 'wx-head'), title = el('h3', 'wx-title'), ai = el('span', 'pill agentic wx-ai'), hint = el('span', 'wx-hint', 'Scroll sideways');
  title.id = 'wx-title'; head.appendChild(title); head.appendChild(ai); head.appendChild(hint);
  var vp = el('div', 'wx-viewport'), canvas = el('div', 'wx-canvas'), vpw = el('div', 'wx-vpw'), rail = el('div', 'wx-rail'), thumb = el('i');
  rail.setAttribute('aria-hidden', 'true'); rail.appendChild(thumb);
  vp.tabIndex = 0; vp.setAttribute('role', 'group'); vp.setAttribute('aria-label', 'Workflow steps. Scrolls sideways.'); vp.appendChild(canvas); vpw.appendChild(vp); vpw.appendChild(rail);
  var time = el('div', 'wx-time'), status = el('p', 'visually-hidden'); status.setAttribute('role', 'status');
  stage.appendChild(head); stage.appendChild(vpw); stage.appendChild(time); stage.appendChild(status);
  field.appendChild(web); field.appendChild(stage);
  host.textContent = ''; host.appendChild(field);
  host.parentNode.classList.add('wfx-on');
  var curLab = el('div', 'wx-cur', 'Scroll'); curLab.setAttribute('aria-hidden', 'true'); document.body.appendChild(curLab);   /* follows the pointer over the popup, like a cursor label */

  var cur = '', cards = [], edgeEls = [], cols = 0, timer = 0, visible = false, manual = false, gen = 0, open = false, pinned = false, rowMin = 0, rowOff = 0;
  function nodeXY(n) { return [PAD + n.c * PX, rowOff + (n.r - rowMin) * PY]; }
  function icon(k) { var s = sv('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' }); s.appendChild(sv('path', { d: GLYPH[k] })); return s; }
  function draw(e) {
    var f = e.flow, sh = X.shape(e), W = PAD * 2 + (sh.cols - 1) * PX + NW, byId = {}, edges = sv('svg', { 'class': 'wx-edges', width: W, height: CH, 'aria-hidden': 'true', focusable: 'false' });
    rowMin = Math.min.apply(null, f.nodes.map(function (n) { return n.r; }));
    rowOff = (CH - (Math.max.apply(null, f.nodes.map(function (n) { return n.r; })) - rowMin) * PY - NH) / 2;
    cols = sh.cols; cards = []; edgeEls = []; canvas.textContent = '';
    canvas.style.width = W + 'px'; canvas.style.height = CH + 'px'; canvas.appendChild(edges);
    canvas.setAttribute('role', 'list'); canvas.setAttribute('aria-label', e.title + ' workflow, in order');
    X.order(e).forEach(function (n) {
      var xy = nodeXY(n), c = el('div', 'wx-n k-' + n.k + (n.out ? ' out' : ''));
      c.setAttribute('role', 'listitem'); c.style.left = xy[0] + 'px'; c.style.top = xy[1] + 'px'; c.setAttribute('data-c', n.c);
      var h = el('div', 'wx-n-head'), g = el('span', 'wx-glyph'), foot = el('div', 'wx-n-foot'); g.appendChild(icon(n.k));
      h.appendChild(g); h.appendChild(el('span', 'wx-n-title', n.t)); c.appendChild(h);
      c.appendChild(el('div', 'wx-n-sub', n.s));
      foot.appendChild(el('span', 'pill ' + PILL[n.k], TAG[n.k])); if (n.out) foot.appendChild(el('span', 'pill goes', 'Goes out')); c.appendChild(foot);
      canvas.appendChild(c); cards.push(c); byId[n.id] = n;
    });
    f.edges.forEach(function (ed) {
      var a = byId[ed[0]], b = byId[ed[1]], p1 = nodeXY(a), p2 = nodeXY(b), x1 = p1[0] + NW, y1 = p1[1] + NH / 2, x2 = p2[0], y2 = p2[1] + NH / 2, dx = Math.max(26, (x2 - x1) * 0.5);
      var d = 'M' + x1 + ' ' + y1 + 'C' + (x1 + dx) + ' ' + y1 + ' ' + (x2 - dx) + ' ' + y2 + ' ' + x2 + ' ' + y2;
      edges.appendChild(sv('path', { 'class': 'wx-edge', d: d }));
      var p = sv('path', { 'class': 'wx-edge fx', d: d, pathLength: 1 });
      edges.appendChild(p); edgeEls.push({ p: p, from: a.c, to: b.c });
      if (ed[2]) { var l = el('span', 'wx-elabel', ed[2]); l.style.left = ((x1 + x2) / 2) + 'px'; l.style.top = ((y1 + y2) / 2) + 'px'; l.setAttribute('aria-hidden', 'true'); canvas.appendChild(l); }
    });
  }
  function bar(label, mins, max, cls) {
    var row = el('div', 'wx-row ' + cls), v = el('span', 'wx-val', X.fmt(mins)), t = el('div', 'bar-track'), b = el('span', 'bar');
    var lab = el('span', 'wx-lab', label); row.appendChild(lab); row.appendChild(v); b.style.setProperty('--w', (mins / max).toFixed(3)); t.appendChild(b);
    var w = el('div', 'wx-bar'); w.appendChild(row); w.appendChild(t); return w;
  }
  function drawTime(e) {
    time.textContent = '';
    if (!e.perWeek) { time.appendChild(el('p', 'wx-line', e.line)); time.appendChild(el('p', 'wx-assume', 'A workflow can start, check and prepare. People decide, approve and step in. No time is claimed for this one.')); return; }
    var c = X.compute(e), saved = el('p', 'wx-saved');
    saved.appendChild(document.createTextNode(X.savedLine(e) + ' ')); saved.appendChild(el('span', null, 'about ' + c.monthlyHours + ' h a month'));
    time.appendChild(bar('By hand', c.before, c.before, 'by')); time.appendChild(bar('With the workflow', c.after, c.before, 'with'));
    time.appendChild(saved); time.appendChild(el('p', 'wx-assume', X.assumption(e) + ' Illustrative, not a client result.'));
  }

  /* the run: a blue pulse goes node to node and the canvas follows it */
  function later(fn, ms) { timer = setTimeout(fn, ms); }
  function clearRun() { clearTimeout(timer); cards.forEach(function (c) { c.classList.remove('active'); }); edgeEls.forEach(function (x) { x.p.classList.remove('run'); }); }
  function slide(x) { tgt = x; if (reduce || !vp.scrollTo) { vp.scrollLeft = x; return; } vp.scrollTo({ left: x, behavior: 'smooth' }); }
  function follow(col) {
    if (manual || reduce) return;
    var over = vp.scrollWidth - vp.clientWidth;
    if (over < 6) return;
    slide(Math.max(0, Math.min(over, PAD + col * PX + NW / 2 - vp.clientWidth / 2)));
  }
  function run(g) {
    if (reduce || !visible || g !== gen) return;
    clearRun(); var c = 0;
    (function step() {
      if (!visible || g !== gen) return;
      cards.forEach(function (n) { if (+n.getAttribute('data-c') === c) n.classList.add('active'); });
      follow(c);
      if (c < cols - 1) {
        later(function () {
          edgeEls.forEach(function (x) { if (x.from === c) x.p.classList.add('run'); });
          later(function () { c++; step(); }, 700);
        }, 420);
      } else later(function () { clearRun(); if (!manual) slide(0); later(function () { run(g); }, 2600); }, 2400);
    })();
  }

  function select(id) {
    if (id === cur || !E[id]) return;
    cur = id; gen++; manual = false; clearRun();
    var e = E[id], st = X.flowStats(e);
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-id') === id ? 'true' : 'false'); });
    linkEls.forEach(function (l) { l.classList.toggle('hot', (' ' + l.getAttribute('data-ends') + ' ').indexOf(' ' + id + ' ') > -1); });
    web.setAttribute('data-sel', id);
    title.textContent = e.title;
    ai.textContent = ''; ai.hidden = !st.ai;
    if (st.ai) { var s = sv('svg', { 'class': 'icon', 'aria-hidden': 'true', viewBox: '0 0 24 24' }); s.appendChild(sv('path', { d: GLYPH.ai })); ai.appendChild(s); ai.appendChild(document.createTextNode(st.ai + ' of ' + st.nodes + ' steps use AI')); }
    draw(e); drawTime(e); vp.scrollLeft = 0; tgt = 0; edgeOverflow();
    stage.classList.remove('swap'); void stage.offsetWidth; stage.classList.add('swap');
    clearTimeout(select.t);
    select.t = setTimeout(function () {                  /* announced once, after a pause */
      status.textContent = e.title + ' workflow: ' + st.nodes + ' steps' + (st.ai ? ', ' + st.ai + ' uses AI' : ', none use AI') + '. ' + (e.perWeek ? X.savedLine(e) + ', illustrative.' : e.line);
    }, 500);
    run(gen);
  }
  function edgeOverflow() {
    var over = vp.scrollWidth - vp.clientWidth, can = over > 6;
    stage.classList.toggle('can-scroll', can);
    stage.classList.toggle('at-start', vp.scrollLeft < 4);
    stage.classList.toggle('at-end', vp.scrollLeft > over - 4);
    if (can) { var w = Math.max(14, vp.clientWidth / vp.scrollWidth * 100); thumb.style.width = w.toFixed(1) + '%'; thumb.style.left = ((100 - w) * Math.min(1, Math.max(0, vp.scrollLeft / over))).toFixed(1) + '%'; }
  }

  /* ---------- open, move and close the popup ---------- */
  var intent = 0, closeT = 0;
  function place(id) {                                   /* right beside the tool: on the side with room, as high as the tool, inside the field */
    if (!desk.matches) { stage.style.left = stage.style.top = stage.style.width = ''; return; }
    var fr = web.getBoundingClientRect(), b = btn[id].getBoundingClientRect(), n = { left: b.left - fr.left, right: b.right - fr.left, top: b.top - fr.top, bottom: b.bottom - fr.top };
    var want = { w: Math.round(Math.min(620, Math.max(400, fr.width * 0.5))), h: 0 };
    stage.style.width = want.w + 'px'; want.h = stage.offsetHeight;
    var p = X.place(n, want, { w: fr.width, h: fr.height }, 10, 8, 360), cy = (n.top + n.bottom) / 2;
    stage.style.width = p.w + 'px'; stage.style.left = Math.round(p.left) + 'px'; stage.style.top = Math.round(p.top) + 'px';
    stage.setAttribute('data-side', p.side); stage.style.transformOrigin = (p.side === 'r' ? '0 ' : '100% ') + Math.round(cy - p.top) + 'px';
    edgeOverflow();
  }
  function show(id) {
    clearTimeout(closeT);
    if (!desk.matches) { select(id); return; }
    var was = open;
    if (!was) stage.classList.add('nojump');
    select(id); open = true; stage.classList.add('open'); place(id);
    if (!was) { void stage.offsetWidth; stage.classList.remove('nojump'); }
  }
  function hide() {
    clearTimeout(closeT); clearTimeout(intent);
    if (!open || !desk.matches) return;
    open = false; pinned = false; stage.classList.remove('open'); clearRun(); cur = ''; gen++; curLab.classList.remove('on');
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    linkEls.forEach(function (l) { l.classList.remove('hot'); }); web.removeAttribute('data-sel');
  }
  function out() { clearTimeout(intent); clearTimeout(closeT); if (!pinned) closeT = setTimeout(hide, 240); }   /* a short grace, so the pointer can cross the gap to the popup */
  buttons.forEach(function (b) {
    var id = b.getAttribute('data-id');
    b.addEventListener('click', function (ev) {
      clearTimeout(intent);
      if (!desk.matches) { select(id); if (stage.getBoundingClientRect().top > window.innerHeight * 0.75) stage.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); return; }
      if (open && cur === id && pinned) { hide(); return; }
      show(id); pinned = true;
      if (ev.detail === 0) vp.focus({ preventScroll: true });                                   /* from the keyboard: straight into the popup */
    });
    b.addEventListener('focus', function () { show(id); });
    b.addEventListener('pointerenter', function (ev) {
      if (ev.pointerType === 'touch' || !desk.matches) return;
      clearTimeout(closeT); clearTimeout(intent);
      intent = setTimeout(function () { show(id); }, open ? 60 : 90);                            /* a short pause, so sweeping past other tools does not switch the popup */
    });
    b.addEventListener('pointerleave', function () { clearTimeout(intent); out(); });
  });
  stage.addEventListener('pointerenter', function () { clearTimeout(closeT); });
  stage.addEventListener('pointerleave', function () { curLab.classList.remove('on'); out(); });
  field.addEventListener('focusout', function (ev) { if (!ev.relatedTarget || !field.contains(ev.relatedTarget)) out(); });
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape' || !open || !desk.matches) return;
    var k = stage.contains(document.activeElement) ? btn[cur] : null; hide(); if (k) k.focus({ preventScroll: true });
  });
  document.addEventListener('pointerdown', function (ev) { if (open && pinned && desk.matches && !field.contains(ev.target)) hide(); });

  /* ---------- the wheel over the popup moves the canvas sideways ---------- */
  var tgt = 0, anim = 0, lastW = 0, cap = false, endGesture = false;
  function span() { return vp.scrollWidth - vp.clientWidth; }
  function glide() {
    anim = 0; var d = tgt - vp.scrollLeft;
    if (Math.abs(d) < 0.8) { vp.scrollLeft = tgt; return; }
    var st = d * 0.2; if (Math.abs(st) < 1) st = d > 0 ? 1 : -1;
    vp.scrollLeft += st; anim = requestAnimationFrame(glide);
  }
  function onWheel(ev) {
    if (ev.ctrlKey || ev.metaKey) return;                                                         /* pinch zoom stays zoom */
    var over = span(); if (over < 6) return;
    var now = performance.now(), fresh = now - lastW > 220; lastW = now;
    if (fresh) { cap = true; endGesture = false; }                                                /* one flick = one gesture */
    if (!cap) return;
    var d = Math.abs(ev.deltaY) >= Math.abs(ev.deltaX) ? ev.deltaY : ev.deltaX;
    if (ev.deltaMode === 1) d *= 16; else if (ev.deltaMode === 2) d *= vp.clientWidth;
    var at = anim ? tgt : vp.scrollLeft, atEnd = d > 0 && at >= over - 1, atStart = d < 0 && at <= 1;
    if (atEnd || atStart) { if (endGesture) { ev.preventDefault(); return; } cap = false; return; }   /* the flick that reached the end does not drag the page; the next push does */
    ev.preventDefault(); manual = true;
    tgt = Math.max(0, Math.min(over, at + d * 1.3)); if (tgt <= 0 || tgt >= over) endGesture = true;
    if (reduce) vp.scrollLeft = tgt; else if (!anim) anim = requestAnimationFrame(glide);
  }
  stage.addEventListener('wheel', onWheel, { passive: false });
  buttons.forEach(function (b) { b.addEventListener('wheel', function (ev) { if (open && desk.matches && cur === b.getAttribute('data-id')) onWheel(ev); }, { passive: false }); });   /* the wheel works while the pointer is still on the tool */
  ['touchstart', 'keydown'].forEach(function (n) { vp.addEventListener(n, function () { manual = true; }, { passive: true }); });
  var drag = null;
  vp.addEventListener('pointerdown', function (ev) { if (ev.pointerType !== 'mouse' || ev.button) return; drag = { x: ev.clientX, s: vp.scrollLeft }; manual = true; vp.classList.add('grab'); });
  window.addEventListener('pointermove', function (ev) { if (drag) { vp.scrollLeft = drag.s - (ev.clientX - drag.x); tgt = vp.scrollLeft; } });
  window.addEventListener('pointerup', function () { drag = null; vp.classList.remove('grab'); });
  vp.addEventListener('scroll', function () { if (!anim) tgt = vp.scrollLeft; edgeOverflow(); }, { passive: true });
  if (fine && !reduce) {                                                                          /* a small cursor label over the popup, like a card gallery's */
    vpw.addEventListener('pointermove', function (ev) { if (ev.pointerType !== 'mouse' || !stage.classList.contains('can-scroll')) return; curLab.style.transform = 'translate(' + (ev.clientX + 16) + 'px,' + (ev.clientY + 14) + 'px)'; curLab.classList.add('on'); });
    vpw.addEventListener('pointerleave', function () { curLab.classList.remove('on'); });
    vpw.addEventListener('pointerdown', function () { curLab.classList.remove('on'); });
  }

  /* ---------- the web is alive: it drifts, leans toward the pointer and sends signals along its threads ---------- */
  var ptr = null, inStage = false, fieldOn = false, looping = false, last = 0;
  function layout() {
    var W = web.clientWidth, H = web.clientHeight; if (!W || !H) return;
    fw = W; fh = H;
    IDS.forEach(function (id) {
      var p = POS[id], x = (p[0] - VB[0]) / VB[2] * W, y = (p[1] - VB[1]) / VB[3] * H;
      base[id] = [x, y]; btn[id].style.left = f1(x) + 'px'; btn[id].style.top = f1(y) + 'px';
    });
    links.setAttribute('width', W); links.setAttribute('height', H); links.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    ports.forEach(function (port) { var b = base[port.getAttribute('data-for')]; if (b) port.style.left = f1(b[0]) + 'px'; });
    paint(0);
    if (open) place(cur);
  }
  function paint(k) {
    var i, l, a, b, ax, ay, bx, by;
    for (i = 0; i < lp.length; i++) {
      l = lp[i]; a = base[l.a]; b = base[l.b]; if (!a || !b) continue;
      ax = a[0] + off[l.a][0]; ay = a[1] + off[l.a][1]; bx = b[0] + off[l.b][0]; by = b[1] + off[l.b][1];
      l.ax = ax; l.ay = ay; l.bx = bx; l.by = by;
      l.qx = (ax + bx) / 2 - (by - ay) * 0.08 + Math.sin(k * 0.4 + i * 1.9) * 7; l.qy = (ay + by) / 2 + (bx - ax) * 0.08 + Math.cos(k * 0.36 + i * 1.3) * 7;
      linkEls[i].setAttribute('d', 'M' + f1(ax) + ',' + f1(ay) + ' Q' + f1(l.qx) + ',' + f1(l.qy) + ' ' + f1(bx) + ',' + f1(by));
    }
    for (var id in stemEls) { var s0 = base[id]; if (s0) stemEls[id].setAttribute('d', 'M' + f1(s0[0] + off[id][0]) + ',' + f1(s0[1] + off[id][1]) + ' L' + f1(s0[0]) + ',' + (STEMS[id] === 'in' ? -10 : fh + 10)); }
  }
  function frame(t) {
    if (reduce || !fieldOn || document.hidden) { looping = false; return; }
    requestAnimationFrame(frame);
    var k = t / 1000, dt = last ? Math.min(0.1, (t - last) / 1000) : 0.016; last = t;
    IDS.forEach(function (id, i) {
      var o = off[id], b = base[id], ph = i * 1.7;
      if (!b) return;
      var tx = Math.sin(k * 0.55 + ph) * 5 + Math.sin(k * 0.23 + ph * 2) * 2.5, ty = Math.cos(k * 0.47 + ph * 1.3) * 5 + Math.cos(k * 0.19 + ph) * 2.5;
      if (ptr && !inStage) { var dx = ptr.x - b[0], dy = ptr.y - b[1], d = Math.sqrt(dx * dx + dy * dy); if (d < 260 && d > 1) { var f = 1 - d / 260; f = f * f * 22; tx += dx / d * f; ty += dy / d * f; } }
      o[0] += (tx - o[0]) * 0.1; o[1] += (ty - o[1]) * 0.1;
      btn[id].style.translate = f1(o[0]) + 'px ' + f1(o[1]) + 'px';
    });
    paint(k);
    sg.forEach(function (s) {
      if (s.l < 0) { s.wait -= dt; if (s.wait > 0 || !lp.length) return; s.l = Math.floor(Math.random() * lp.length); s.t = 0; s.rev = Math.random() < 0.5; s.v = 0.26 + Math.random() * 0.2; }
      s.t += s.v * dt;
      if (s.t >= 1) { s.l = -1; s.wait = 1 + Math.random() * 3; s.c.setAttribute('opacity', 0); return; }
      var q = lp[s.l], u = s.rev ? 1 - s.t : s.t, v = 1 - u;
      s.c.setAttribute('cx', f1(v * v * q.ax + 2 * v * u * q.qx + u * u * q.bx)); s.c.setAttribute('cy', f1(v * v * q.ay + 2 * v * u * q.qy + u * u * q.by));
      s.c.setAttribute('opacity', (Math.sin(Math.PI * s.t) * 0.9).toFixed(2));
    });
  }
  function wake() { if (!looping && !reduce && fieldOn && !document.hidden) { looping = true; last = 0; requestAnimationFrame(frame); } }
  field.addEventListener('pointermove', function (ev) {
    if (ev.pointerType !== 'mouse') return;
    var r = web.getBoundingClientRect(); ptr = { x: ev.clientX - r.left, y: ev.clientY - r.top }; inStage = stage.contains(ev.target);
  }, { passive: true });
  field.addEventListener('pointerleave', function () { ptr = null; });
  document.addEventListener('visibilitychange', wake);

  /* ---------- start ---------- */
  function mode() {
    if (desk.matches) { if (!open) { cur = ''; stage.classList.remove('open'); } } else { open = false; pinned = false; stage.classList.remove('open'); stage.style.left = stage.style.top = stage.style.width = ''; select(cur || 'w-enquiries'); }
  }
  if (desk.addEventListener) desk.addEventListener('change', function () { cur = ''; mode(); layout(); }); else if (desk.addListener) desk.addListener(function () { cur = ''; mode(); layout(); });
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(web); else window.addEventListener('resize', layout);
  window.addEventListener('resize', edgeOverflow);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { if (es[es.length - 1].isIntersecting) web.classList.add('in'); }, { threshold: 0.25 }).observe(web);   /* the lines draw when the web is on screen */
    new IntersectionObserver(function (es) { fieldOn = es[es.length - 1].isIntersecting; wake(); }, { threshold: 0 }).observe(field);
    new IntersectionObserver(function (es) { var on = es[es.length - 1].isIntersecting; if (on === visible) return; visible = on; if (on) run(gen); else clearRun(); }, { threshold: 0.2 }).observe(stage);
  } else { visible = true; fieldOn = true; web.classList.add('in'); wake(); }
  layout(); mode();
  window.SITE_EXPLORER = { field: field, web: web, stage: stage, vp: vp, show: show, hide: hide, layout: layout, state: function () { return { open: open, pinned: pinned, cur: cur }; } };   /* for tools/v5_checks */
})();
