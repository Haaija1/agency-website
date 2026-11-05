// storyboard_mock.js: STATIC mock-up of the "web grows as you scroll" bands (option A), drawn over the real v3 page.
// Not part of the site. Run in the page, then call window.__mock([p1,p2,p3,p4,p5]) with progress 0..1 per band.
// Story: one route snakes down the page like a thread through a loom (left to right, down the right rail, right to left,
// down the left Thread, ...). Each band is denser than the last; the last band converges on a single node: Contact.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const txt = (e) => e.textContent.replace(/^\s*\d+\s*/, '').trim();

  window.__mock = function (P) {
    const main = document.getElementById('main'), mr = main.getBoundingClientRect(), W = main.clientWidth, H = main.offsetHeight;
    document.querySelectorAll('.page-web').forEach((e) => { e.style.display = 'none'; });
    const old = document.getElementById('mock-bands'); if (old) old.remove();
    const svg = mk('svg', { id: 'mock-bands', class: 'web-bands', width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true' });
    svg.style.cssText = 'position:absolute;left:0;top:0;z-index:0;pointer-events:none;overflow:visible';
    main.appendChild(svg);

    const secs = [...main.querySelectorAll('.threaded')];
    const TB = [], wk = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    for (let n; (n = wk.nextNode());) {
      if (!n.textContent.trim() || n.parentElement.closest('svg,.hp,.page-web,.web-bands')) continue;
      const r = document.createRange(); r.selectNodeContents(n);
      for (const q of r.getClientRects()) TB.push([q.top - mr.top, q.bottom - mr.top]);
    }
    const gapOf = (s) => {                                  // text-free vertical gap around a section border
      const y = s.getBoundingClientRect().top - mr.top;
      const above = Math.max(0, ...TB.filter((b) => b[1] <= y + 1).map((b) => b[1]));
      const below = Math.min(1e9, ...TB.filter((b) => b[0] >= y - 1).map((b) => b[0]));
      return { top: above + 6, bottom: below - 6, mid: (above + below) / 2, size: below - above - 12 };
    };
    const gaps = secs.map(gapOf);
    const bead = secs[0].querySelector('.thread-node').getBoundingClientRect();
    const lx = bead.left + bead.width / 2 - mr.left, rx = W - lx;
    const sets = [
      [...secs[0].querySelectorAll('.proof-item h3')].map(txt),
      [...secs[1].querySelectorAll('.tier')].map(txt),
      [...secs[2].querySelectorAll('.step h3')].map(txt),
      [...secs[3].querySelectorAll('.wnode-title')].map(txt),
      ['Let\u2019s talk'],
    ];
    const sat = [2, 4, 6, 8, 7];                       // unlabelled satellite dots: the web gets denser
    const GREY = '#d3d9e2', BLUE = '#2a6fdb', INK = '#2f3b52';
    const grey = mk('g', {}), blue = mk('g', {}), dots = mk('g', {}), labels = mk('g', {});
    svg.append(grey, blue, dots, labels);
    const q = (x1, y1, x2, y2, bend) => 'M' + x1 + ',' + y1 + ' Q' + ((x1 + x2) / 2 - (y2 - y1) * bend) + ',' + ((y1 + y2) / 2 + (x2 - x1) * bend) + ' ' + x2 + ',' + y2;

    const route = [];                                   // [x,y] points the blue route passes through
    secs.forEach((s, k) => {
      const g = gaps[k], cy = Math.round(g.mid), p = clamp(P[k] === undefined ? 0 : P[k]);
      const amp = Math.max(8, g.size / 2 - 40), samp = Math.max(14, g.size / 2 - 22);   /* use the space the gap gives, label room kept */
      const ltr = true, names = sets[k], n = names.length;   /* always reads left to right, like the copy */
      const xa = lx + 150, xb = rx - 150;
      const pts = [];
      for (let i = 0; i < n; i++) {
        const t = n === 1 ? 0.5 : i / (n - 1), x = xa + (xb - xa) * (ltr ? t : 1 - t);
        pts.push({ x: Math.round(x), y: Math.round(cy + (n === 1 ? 0 : (i % 2 ? amp : -amp))), name: names[i] });
      }
      const sats = [];
      for (let j = 0; j < sat[k]; j++) {
        const t = (j + 0.5) / sat[k], x = xa - 70 + (xb - xa + 140) * t;
        sats.push({ x: Math.round(x), y: Math.round(cy + (j % 2 ? samp : -samp) + ((j * 7) % 3 - 1) * 4) });
      }
      sats.forEach((s2) => { pts.forEach((pt) => { if (Math.abs(s2.x - pt.x) < 70 && Math.abs(s2.y - pt.y) < 40) s2.x += (s2.x >= pt.x ? 1 : -1) * 70; }); });
      const near = (pt, arr, m) => arr.map((a) => ({ a, d: Math.hypot(a.x - pt.x, a.y - pt.y) })).sort((u, v) => u.d - v.d).slice(0, m).map((o) => o.a);
      const edges = [];
      pts.forEach((a, i) => { for (let h = 1; h <= Math.min(1 + k, 3); h++) if (pts[i + h]) edges.push([a, pts[i + h]]); });
      sats.forEach((s2) => near(s2, pts, k === 4 ? 1 : 2).forEach((a) => edges.push([s2, a])));
      sats.forEach((s2, j) => { if (sats[j + 1] && k > 0) edges.push([s2, sats[j + 1]]); });
      // spine links: bead (left) and post (right) to the nearest labelled node
      const first = pts[ltr ? 0 : pts.length - 1], last = pts[ltr ? pts.length - 1 : 0];
      edges.push([{ x: lx, y: cy }, first], [last, { x: rx, y: cy }]);
      edges.forEach(([a, b], i) => {
        const bend = ((i % 2) ? 1 : -1) * 0.09;
        const start = (i / edges.length) * 0.6;
        const f = clamp((p - start) / 0.4);
        const path = mk('path', { d: q(a.x, a.y, b.x, b.y, bend), fill: 'none', stroke: GREY, 'stroke-width': 1, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': (1 - f).toFixed(3) });
        grey.appendChild(path);
      });
      sats.forEach((s2, j) => { const f = clamp((p - 0.1 - j * 0.04) / 0.2); if (f > 0) dots.appendChild(mk('circle', { cx: s2.x, cy: s2.y, r: 2.6 * f, fill: '#b8bfcc' })); });
      pts.forEach((pt, i) => {
        const f = clamp((p - i / (n + 1) * 0.7) / 0.25);
        if (f <= 0) return;
        const g = mk('g', { transform: 'translate(' + pt.x + ',' + pt.y + ')', opacity: f.toFixed(2) });
        g.appendChild(mk('circle', { r: 5.5 * (0.6 + 0.4 * f), fill: INK }));
        const above = (i % 2 === 0);
        const t = mk('text', { x: 0, y: above ? -14 : 22, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 500, fill: INK, 'font-family': getComputedStyle(document.body).fontFamily });
        t.textContent = pt.name; g.appendChild(t);
        labels.appendChild(g);
      });
      // blue route for this band, then down the rail to the next band
      const entryX = ltr ? lx : rx, exitX = ltr ? rx : lx;
      route.push({ k, p, pts: [{ x: entryX, y: cy }].concat(ltr ? pts : pts.slice()), exit: { x: exitX, y: cy } });
    });

    // ladder: each band's blue rung runs bead -> nodes -> post, left to right; the right rail joins the posts.
    // (The left side is the page's own Thread, which already joins the beads.)
    route.forEach((r, k) => {
      const pts = [{ x: lx, y: Math.round(gaps[k].mid) }].concat(r.pts.slice(1)).concat([{ x: rx, y: Math.round(gaps[k].mid) }]);
      let d = 'M' + pts[0].x + ',' + pts[0].y;
      for (let i = 1; i < pts.length; i++) { const a2 = pts[i - 1], b2 = pts[i], bend = (i % 2 ? 1 : -1) * 0.07;
        d += ' Q' + ((a2.x + b2.x) / 2 - (b2.y - a2.y) * bend) + ',' + ((a2.y + b2.y) / 2 + (b2.x - a2.x) * bend) + ' ' + b2.x + ',' + b2.y; }
      blue.appendChild(mk('path', { d, fill: 'none', stroke: BLUE, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': (1 - clamp(P[k] || 0)).toFixed(3) }));
      if (secs[k + 1]) {
        const y1 = Math.round(gaps[k].mid), y2 = Math.round(gaps[k + 1].mid), f = clamp((P[k + 1] || 0) * 3);
        blue.appendChild(mk('path', { d: 'M' + rx + ',' + y1 + ' L' + rx + ',' + y2, fill: 'none', stroke: BLUE, 'stroke-width': 2, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': (1 - f).toFixed(3) }));
      }
    });
    const bluePath = { getTotalLength: () => 0 };
    // posts on the rails
    secs.forEach((s, k) => {
      const cy = Math.round(gaps[k].mid), on = clamp(P[k] || 0) >= 0.999;
      dots.appendChild(mk('circle', { cx: rx, cy, r: 3.5, fill: on ? BLUE : '#fff', stroke: on ? BLUE : '#8a93a3', 'stroke-width': 1.2 }));
    });
    return { w: W, h: H, lx, rx, centres: gaps.map((g) => Math.round(g.mid)), gapSizes: gaps.map((g) => Math.round(g.size)), };
  };
  return 'mock ready';
})()
