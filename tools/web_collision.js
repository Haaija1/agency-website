// web_collision.js: run in the page (Runtime.evaluate) at each viewport width. Samples every thread (<path>) every 3 px and
// every node hit area against all text boxes in <main> (4 px padding). Expect collisions: 0.
// Reset emulation first; resize can need ~0.9 s for the page web to rebuild.
(() => {
  document.documentElement.classList.add('measuring');   // cards below the fold sit 14px low until revealed; measure where they rest (as the page does)
  const PAD = 4, STEP = 3, main = document.querySelector('main');
  const T = [];                                   // text boxes in page coordinates
  const clipBox = new Map();                      // text scrolled out of a scroll box (overflow) is invisible: only its visible part counts
  const visiblePart = (el, q) => {
    let l = q.left, t = q.top, r = q.right, b = q.bottom;
    for (let a = el; a && a !== main; a = a.parentElement) {
      let c = clipBox.get(a);
      if (c === undefined) { const s = getComputedStyle(a); c = (s.overflowX !== 'visible' || s.overflowY !== 'visible') ? a.getBoundingClientRect() : null; clipBox.set(a, c); }
      if (c) { l = Math.max(l, c.left); t = Math.max(t, c.top); r = Math.min(r, c.right); b = Math.min(b, c.bottom); }
    }
    return r > l && b > t ? { left: l, top: t, right: r, bottom: b } : null;
  };
  const w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    if (!n.textContent.trim() || n.parentElement.closest('.hp')) continue;
    { const sv = n.parentElement.closest('svg'); if (sv && !sv.classList.contains('web')) continue; }   // icons skipped; the hero web's labels kept
    const r = document.createRange(); r.selectNodeContents(n);
    for (const q0 of r.getClientRects()) {
      const q = visiblePart(n.parentElement, q0);
      if (q) T.push([q.left + scrollX - PAD, q.top + scrollY - PAD, q.right + scrollX + PAD, q.bottom + scrollY + PAD]);
    }
  }
  const hit = (x, y, hw = 0) => T.some(b => x + hw > b[0] && x - hw < b[2] && y + hw > b[1] && y - hw < b[3]);
  const out = [], svgs = [...document.querySelectorAll('svg.page-web, svg.web-bands, svg.grow-web, svg.frame-web')].filter((s) => s.getClientRects().length);  // skip display:none (zero box -> wrong origin)
  let samples = 0;
  for (const s of svgs) {
    const o = s.getBoundingClientRect(), ox = o.left + scrollX, oy = o.top + scrollY;
    for (const p of s.querySelectorAll('path')) {           // threads: 1 px wide
      const L = p.getTotalLength();
      for (let d = 0; d <= L; d += STEP) {
        const q = p.getPointAtLength(d); samples++;
        if (hit(q.x + ox, q.y + oy)) out.push({ kind: 'thread', x: Math.round(q.x), y: Math.round(q.y) });
      }
    }
    for (const c of s.querySelectorAll('circle.node-hit'))  // 44 px touch areas
      if (hit(+c.getAttribute('cx') + ox, +c.getAttribute('cy') + oy, 22)) out.push({ kind: 'node', id: c.id });
    for (const t of s.querySelectorAll('text')) {            // node labels (text inside the web) against page text
      const b = t.getBoundingClientRect(), x0 = b.left + scrollX, y0 = b.top + scrollY, x1 = b.right + scrollX, y1 = b.bottom + scrollY;
      samples++;
      if (T.some((q) => x1 > q[0] && x0 < q[2] && y1 > q[1] && y0 < q[3])) out.push({ kind: 'label', text: t.textContent, x: Math.round(x0), y: Math.round(y0) });
    }
  }
  // Second, separate count: threads and dots drawn INSIDE a bordered card/table (empty padding, not text). Reported apart so the
  // text-only claim stays comparable with v2; Phase 3 should aim for boxHits: 0 as well.
  const boxes = [...main.querySelectorAll('.ptable,.step,.proof,.assure,.canvas-demo,.week,.contact-card,.wx-web,.wx-stage,.demo-shot')].map((e) => { const r = e.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.right + scrollX, r.bottom + scrollY]; });
  let boxHits = 0;
  for (const s of svgs) {
    if (s.classList.contains('frame-web')) continue;
    const o = s.getBoundingClientRect(), ox = o.left + scrollX, oy = o.top + scrollY;
    for (const p of s.querySelectorAll('path')) {
      const L = p.getTotalLength();
      for (let d = 0; d <= L; d += STEP) { const q = p.getPointAtLength(d), x = q.x + ox, y = q.y + oy; if (boxes.some((b) => x > b[0] && x < b[2] && y > b[1] && y < b[3])) boxHits++; }
    }
  }
  document.documentElement.classList.remove('measuring');
  return { vw: innerWidth, svgs: svgs.length, samples, collisions: out.length, boxHits, first: out.slice(0, 5) };
})()
