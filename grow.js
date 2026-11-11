/* BPR site: the page web. The hero holds still for a few scrolls while the first branch grows out of its web; then the page scrolls and the
   web carries on around the text and cards, never through them, docking at headings and cards, and ends at Contact. It stays alive: a slow
   drift and silk that leans toward the pointer, limited by the free space around each thread. Progressive enhancement. A pure core (grow, curvePoints, pathD, frac; tests/grow.test.js) plus a small DOM layer at the
   bottom. How it works: HOW-IT-WORKS.md. */
(function (root) {
  'use strict';

  function rng(s) { var a = s >>> 0; return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function dseg(a, b) { return Math.hypot(b[0] - a[0], b[1] - a[1]); }
  function length(p) { var s = 0; for (var i = 1; i < p.length; i++) s += dseg(p[i - 1], p[i]); return s; }

  /* curves: one cubic per segment, handles follow the local direction */
  function segs(p) {
    var n = p.length, t = [], out = [], i;
    for (i = 0; i < n; i++) {
      var a = p[Math.max(i - 1, 0)], b = p[Math.min(i + 1, n - 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      t.push([dx / l, dy / l]);
    }
    for (i = 0; i < n - 1; i++) {
      var s = p[i], e = p[i + 1], L = dseg(s, e) * 0.36;
      out.push([s, [s[0] + t[i][0] * L, s[1] + t[i][1] * L], [e[0] - t[i + 1][0] * L, e[1] - t[i + 1][1] * L], e]);
    }
    return out;
  }
  function bez(s, u) {
    var v = 1 - u, A = v * v * v, B = 3 * v * v * u, C = 3 * v * u * u, D = u * u * u;
    return [A * s[0][0] + B * s[1][0] + C * s[2][0] + D * s[3][0], A * s[0][1] + B * s[1][1] + C * s[2][1] + D * s[3][1]];
  }
  function curvePoints(p, step) {
    if (p.length < 2) return p.slice();
    var out = [p[0]];
    segs(p).forEach(function (s) { var n = Math.max(2, Math.ceil(dseg(s[0], s[3]) / step)); for (var k = 1; k <= n; k++) out.push(bez(s, k / n)); });
    return out;
  }
  function slacks(p, clear, need) {                      /* how far (px) each anchor may move before its curve gets nearer than `need` to content */
    var out = p.map(function () { return 99; });
    segs(p).forEach(function (s, i) {
      var n = Math.max(3, Math.ceil(dseg(s[0], s[3]) / 10)), m = 99;
      for (var k = 0; k <= n; k++) { var q = bez(s, k / n), c = clear(q[0], q[1]); if (c < m) m = c; }
      m -= need; if (m < 0) m = 0;
      if (m < out[i]) out[i] = m;
      if (m < out[i + 1]) out[i + 1] = m;
    });
    return out.map(function (v, i) { return Math.min(v, out[i - 1] === undefined ? v : out[i - 1], out[i + 1] === undefined ? v : out[i + 1]); });   /* tangents lean on the neighbours too */
  }
  function pathD(p) {
    function f(n) { return Math.round(n * 10) / 10; }
    var d = 'M' + f(p[0][0]) + ' ' + f(p[0][1]);
    segs(p).forEach(function (s) { d += 'C' + f(s[1][0]) + ' ' + f(s[1][1]) + ' ' + f(s[2][0]) + ' ' + f(s[2][1]) + ' ' + f(s[3][0]) + ' ' + f(s[3][1]); });
    return d;
  }
  function dp(p, eps) {                                   /* Douglas-Peucker */
    if (p.length < 3 || eps <= 0) return p;
    var keep = new Uint8Array(p.length);
    keep[0] = keep[p.length - 1] = 1;
    (function rec(i, j) {
      var a = p[i], b = p[j], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, m = -1, w = 0;
      for (var k = i + 1; k < j; k++) { var d = Math.abs((p[k][0] - a[0]) * dy - (p[k][1] - a[1]) * dx) / L; if (d > w) { w = d; m = k; } }
      if (w > eps) { keep[m] = 1; rec(i, m); rec(m, j); }
    })(0, p.length - 1);
    return p.filter(function (_, i) { return keep[i]; });
  }

  /* reveal: thr[i] is the scroll position at which point i is reached */
  function frac(b, r) {
    var t = b.thr, n = t.length;
    if (r <= t[0]) return 0;
    if (r >= t[n - 1]) return 1;
    if (!b.cum) { var c = [0]; for (var k = 1; k < n; k++) c.push(c[k - 1] + dseg(b.pts[k - 1], b.pts[k])); b.cum = c; }
    var i = 1;
    while (t[i] < r) i++;
    var f = (r - t[i - 1]) / ((t[i] - t[i - 1]) || 1);
    return (b.cum[i - 1] + f * (b.cum[i] - b.cum[i - 1])) / b.cum[n - 1];
  }
  function walk(pts, t0) {                                /* a branch takes scroll to grow and never gets ahead of the page */
    var t = [t0];
    for (var i = 1; i < pts.length; i++) t.push(Math.max(t[i - 1] + 0.5 * dseg(pts[i - 1], pts[i]), pts[i][1]));
    return t;
  }

  function Heap() { this.k = []; this.v = []; this.top = 0; }
  Heap.prototype.push = function (key, val) {
    var k = this.k, v = this.v, i = k.length;
    k.push(key); v.push(val);
    while (i > 0) { var p = (i - 1) >> 1; if (k[p] <= key) break; k[i] = k[p]; v[i] = v[p]; i = p; }
    k[i] = key; v[i] = val;
  };
  Heap.prototype.pop = function () {
    var k = this.k, v = this.v, rv = v[0], key = k[k.length - 1], val = v[v.length - 1], n;
    this.top = k[0];
    k.pop(); v.pop(); n = k.length;
    if (n > 0) {
      var i = 0;
      for (;;) { var c = 2 * i + 1; if (c >= n) break; if (c + 1 < n && k[c + 1] < k[c]) c++; if (k[c] >= key) break; k[i] = k[c]; v[i] = v[c]; i = c; }
      k[i] = key; v[i] = val;
    }
    return rv;
  };

  var DX = [1, -1, 0, 0, 1, 1, -1, -1], DY = [0, 0, 1, -1, 1, -1, 1, -1], DW = [1, 1, 1, 1, 1.4142, 1.4142, 1.4142, 1.4142];

  /* cfg: W, H, blocks [[x0,y0,x1,y1(,margin)]], roots [{x,y,stem}], targets [{x,y,main,alts}], seed, margin, cell, twigEvery */
  function grow(cfg) {
    var W = cfg.W, H = cfg.H, C = cfg.cell || (cfg.W < 480 ? 5 : 10), M = cfg.margin == null ? 14 : cfg.margin, R = rng(cfg.seed || 1);
    var cols = Math.ceil(W / C), rows = Math.ceil(H / C), N = cols * rows, blocks = cfg.blocks || [], i, j;
    function cxOf(c) { return (c % cols + 0.5) * C; }
    function cyOf(c) { return (Math.floor(c / cols) + 0.5) * C; }
    function cellOf(x, y) { return Math.min(rows - 1, Math.max(0, Math.floor(y / C))) * cols + Math.min(cols - 1, Math.max(0, Math.floor(x / C))); }

    /* free space: blocks grow by their margin */
    var free = new Uint8Array(N);
    for (j = 0; j < rows; j++) for (i = 0; i < cols; i++) { var px = (i + 0.5) * C; free[j * cols + i] = px >= 4 && px <= W - 4 ? 1 : 0; }
    blocks.forEach(function (b) {
      var m = b.length > 4 ? b[4] : M, i0 = Math.max(0, Math.floor((b[0] - m) / C)), i1 = Math.min(cols - 1, Math.floor((b[2] + m) / C)),
          j0 = Math.max(0, Math.floor((b[1] - m) / C)), j1 = Math.min(rows - 1, Math.floor((b[3] + m) / C));
      for (var y = j0; y <= j1; y++) for (var x = i0; x <= i1; x++) {
        var cx = (x + 0.5) * C, cy = (y + 0.5) * C;
        if (cx > b[0] - m && cx < b[2] + m && cy > b[1] - m && cy < b[3] + m) free[y * cols + x] = 0;
      }
    });
    /* exact clearance, to check every finished curve */
    var BH = 80, nb = Math.ceil(H / BH) + 1, bk = [];
    for (i = 0; i < nb; i++) bk.push([]);
    blocks.forEach(function (b) {
      var y0 = Math.max(0, Math.floor((b[1] - 40) / BH)), y1 = Math.min(nb - 1, Math.floor((b[3] + 40) / BH));
      for (var y = y0; y <= y1; y++) bk[y].push(b);
    });
    function clear(x, y, skip) {
      var a = bk[Math.min(nb - 1, Math.max(0, Math.floor(y / BH)))], m = 99;
      for (var k = 0; k < a.length; k++) {
        var b = a[k];
        if (skip && skip.indexOf(b) >= 0) continue;
        var d = Math.hypot(Math.max(b[0] - x, 0, x - b[2]), Math.max(b[1] - y, 0, y - b[3])) + (b.length > 4 ? M - b[4] : 0);
        if (d < m) m = d;
      }
      return m;
    }

    /* smooth noise in the cost, so routes meander */
    var G = 64, gw = Math.ceil(W / G) + 2, gh = Math.ceil(H / G) + 2, lat = new Float32Array(gw * gh), cost = new Float32Array(N);
    for (i = 0; i < lat.length; i++) lat[i] = R();
    function nz(x, y) {
      var u = x / G, v = y / G, a = Math.floor(u), b = Math.floor(v), fu = u - a, fv = v - b, p = b * gw + a,
          su = fu * fu * (3 - 2 * fu), sv = fv * fv * (3 - 2 * fv), n00 = lat[p], n10 = lat[p + 1], n01 = lat[p + gw], n11 = lat[p + gw + 1];
      return n00 + (n10 - n00) * su + (n01 - n00) * sv + (n00 - n10 - n01 + n11) * su * sv;
    }
    for (j = 0; j < rows; j++) for (i = 0; i < cols; i++) cost[j * cols + i] = 1 + 1.1 * nz((i + 0.5) * C, (j + 0.5) * C);
    /* cfg.open: points (a dock beside a card, a port on the tool web) whose neighbourhood is forced free so the web can reach them */
    (cfg.open || []).forEach(function (p) {
      var c = cellOf(p.x, p.y), cx = c % cols, cy = (c - cx) / cols;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var nx = cx + dx, ny = cy + dy; if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) free[ny * cols + nx] = 1; }
    });
    /* cfg.hug (0 to 0.6): running close to content is cheaper, so threads follow the edges of cards and text instead of drifting in open space */
    if (cfg.hug) {
      var dd = new Float32Array(N).fill(1e3), q, v;
      for (q = 0; q < N; q++) if (!free[q]) dd[q] = 0;
      for (j = 0; j < rows; j++) for (i = 0; i < cols; i++) {
        q = j * cols + i; v = dd[q];
        if (i > 0 && dd[q - 1] + 1 < v) v = dd[q - 1] + 1;
        if (j > 0) { if (dd[q - cols] + 1 < v) v = dd[q - cols] + 1; if (i > 0 && dd[q - cols - 1] + 1.414 < v) v = dd[q - cols - 1] + 1.414; if (i < cols - 1 && dd[q - cols + 1] + 1.414 < v) v = dd[q - cols + 1] + 1.414; }
        dd[q] = v;
      }
      for (j = rows - 1; j >= 0; j--) for (i = cols - 1; i >= 0; i--) {
        q = j * cols + i; v = dd[q];
        if (i < cols - 1 && dd[q + 1] + 1 < v) v = dd[q + 1] + 1;
        if (j < rows - 1) { if (dd[q + cols] + 1 < v) v = dd[q + cols] + 1; if (i < cols - 1 && dd[q + cols + 1] + 1.414 < v) v = dd[q + cols + 1] + 1.414; if (i > 0 && dd[q + cols - 1] + 1.414 < v) v = dd[q + cols - 1] + 1.414; }
        dd[q] = v;
      }
      for (q = 0; q < N; q++) if (free[q]) { var u = (dd[q] * C - 12) / 16; cost[q] *= 1 - cfg.hug * Math.exp(-u * u); }
    }

    var dist = new Float64Array(N).fill(Infinity), par = new Int32Array(N).fill(-1), net = new Uint8Array(N), heap = new Heap();
    var adj = new Map(), exact = new Map(), bands = [], BAND = 50, mainEdge = new Set();
    function ek(a, b) { return a < b ? a * 1048576 + b : b * 1048576 + a; }
    function addAdj(a, b) { var l = adj.get(a); if (!l) adj.set(a, l = []); if (l.indexOf(b) < 0) l.push(b); }
    function each(c, fn) {                                /* the free neighbours of a cell, with the cost of stepping there */
      var x = c % cols, y = (c - x) / cols;
      for (var k = 0; k < 8; k++) {
        var nx = x + DX[k], ny = y + DY[k];
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        var n = ny * cols + nx;
        if (!free[n] || (k > 3 && (!free[y * cols + nx] || !free[ny * cols + x]))) continue;   /* no squeezing diagonally between blocked cells */
        fn(n, C * DW[k] * (cost[c] + cost[n]) * 0.5);
      }
    }
    var cc = 0, cd = 0;
    function visit(n, w) { var nd = cd + w; if (nd < dist[n]) { dist[n] = nd; par[n] = cc; heap.push(nd, n); } }
    function relax() { while (heap.k.length) { cc = heap.pop(); cd = heap.top; if (cd <= dist[cc]) each(cc, visit); } }
    function mark(c) {
      if (net[c]) return;
      net[c] = 1;
      var b = Math.floor(cyOf(c) / BAND);
      while (bands.length <= b) bands.push([]);
      bands[b].push(c);
    }
    function addPath(cells, isMain) {
      for (var k = 0; k < cells.length; k++) {
        var c = cells[k]; mark(c); dist[c] = 0; par[c] = -1; heap.push(0, c);
        if (k) { addAdj(cells[k - 1], c); addAdj(c, cells[k - 1]); if (isMain) mainEdge.add(ek(cells[k - 1], c)); }
      }
      relax();
    }
    function chainTo(c) { var ch = [c]; while (!net[c]) { c = par[c]; ch.push(c); } return ch; }
    function nearestFree(x, y, rings) {
      var c0 = cellOf(x, y), cx = c0 % cols, cy = (c0 - cx) / cols;
      for (var r = 0; r <= rings; r++) for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        var nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && free[ny * cols + nx]) return ny * cols + nx;
      }
      return -1;
    }

    /* roots: a root inside a block leaves its dot on a straight vertical stem (p.stem px); the web grows from the stem's end */
    var roots = [], rootCells = [], stems = [];
    (cfg.roots || []).forEach(function (p) {
      var hosts = blocks.filter(function (b) { return p.x >= b[0] && p.x <= b[2] && p.y >= b[1] && p.y <= b[3]; }), sy = p.y + (p.stem || 0);
      if (p.stem) {
        hosts.forEach(function (b) { sy = Math.max(sy, b[3] + M + 1); });             /* long enough to leave the block it sits in */
        for (var yy = p.y + 20, bad = false; !bad; yy += 4) {                           /* any OTHER block in the way: this root is skipped */
          if (clear(p.x, Math.min(yy, sy), hosts) < 8.5) bad = true;
          if (yy >= sy) break;
        }
        if (bad) return;
      }
      var c = cellOf(p.x, sy), cx = c % cols, cy = (c - cx) / cols;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var nx = cx + dx, ny = cy + dy; if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) free[ny * cols + nx] = 1; }
      roots.push([p.x, p.y]); rootCells.push(c); exact.set(c, [p.x, sy]); mark(c); dist[c] = 0; heap.push(0, c);
      if (p.stem) stems.push([[p.x, p.y], [p.x, sy]]);
    });
    relax();

    /* targets, main one first: the web runs to the first spot of each that can be reached, trying its alternatives in turn */
    var targets = (cfg.targets || []).map(function (t) { return { x: t.x, y: t.y, main: !!t.main, reached: false, alts: t.alts || [] }; });
    targets.forEach(function (t) {
      [{ x: t.x, y: t.y }].concat(t.alts).some(function (p) {
        var c = nearestFree(p.x, p.y, 2);
        if (c < 0 || dist[c] === Infinity || net[c]) return false;
        exact.set(c, [p.x, p.y]); addPath(chainTo(c), t.main);
        t.x = p.x; t.y = p.y; t.reached = true; t.cell = c;
        return true;
      });
    });

    /* twigs: denser lower down, each ending in a knot */
    var T = Math.round(H / (cfg.twigEvery || 50)), leaves = [];
    function yAt(u) { var a = 1.5 / H; return (-1 + Math.sqrt(1 + 4 * a * u * 2.5 * H)) / (2 * a); }
    function pickNet(y) {
      var b0 = Math.floor(y / BAND);
      for (var o = 0; o <= 4; o++) for (var sgn = -1; sgn <= 1; sgn += 2) {
        var l = bands[b0 + o * sgn];
        if (l && l.length) return l[Math.floor(R() * l.length)];
        if (!o) break;
      }
      return -1;
    }
    for (var s = 0; s < T; s++) {
      var oc = pickNet(yAt((s + R()) / T));
      if (oc < 0) continue;
      var ox = cxOf(oc), oy = cyOf(oc);
      for (var a = 0; a < 10; a++) {
        var r = 55 + R() * 125, th = R() * 6.2832, tx = ox + Math.cos(th) * r, ty = oy + Math.sin(th) * r;
        if (tx < 8 || tx > W - 8 || ty < 0 || ty > H) continue;
        var tc = cellOf(tx, ty);
        if (!free[tc] || net[tc] || dist[tc] < 42 || dist[tc] > r * 2.6) continue;
        addPath(chainTo(tc), false); leaves.push(tc); break;
      }
    }

    /* the cross-links: join twig tips back to far-away parts of the web (real loops) */
    var ld = new Float64Array(N), lp = new Int32Array(N), ls = new Int32Array(N), stamp = 0;
    function bridge(L, skip) {
      var near = new Set([L]), q = [L], dep = new Map([[L, 0]]);
      while (q.length) {
        var c = q.shift(), dc = dep.get(c);
        if (dc >= 30) continue;
        (adj.get(c) || []).forEach(function (n) { if (!near.has(n)) { near.add(n); dep.set(n, dc + 1); q.push(n); } });
      }
      var h = new Heap(), explored = 0;
      stamp++; ld[L] = 0; ls[L] = stamp; lp[L] = -1; h.push(0, L);
      while (h.k.length && explored++ < 4000) {
        var c2 = h.pop(), d = h.top;
        if (d > ld[c2]) continue;
        if (net[c2] && !near.has(c2) && d >= 45 && !(skip && skip.has(c2))) {
          var ch = [c2];
          while (c2 !== L) { c2 = lp[c2]; ch.push(c2); }
          addPath(ch, false);
          return true;
        }
        if (d > 330) break;
        each(c2, function (n, w) { var nd = d + w; if (ls[n] !== stamp || nd < ld[n]) { ls[n] = stamp; ld[n] = nd; lp[n] = c2; h.push(nd, n); } });
      }
      return false;
    }
    var rs = new Set(rootCells);
    rootCells.forEach(function (c) { if (!adj.has(c) && !bridge(c, rs)) bridge(c); });   /* every root joins the web: first to a non-root part, else to a root */
    leaves.forEach(function (L) { if (R() < 0.22 + 0.4 * cyOf(L) / H) bridge(L); });

    /* the web as a graph: knots (roots, targets, tips, forks) joined by branches */
    function deg(c) { var l = adj.get(c); return l ? l.length : 0; }
    function isKnot(c) { return deg(c) !== 2 || exact.has(c); }
    var seen = new Set(), chains = [];
    adj.forEach(function (nbs, k) {
      if (!isKnot(k)) return;
      nbs.forEach(function (n0) {
        if (seen.has(ek(k, n0))) return;
        var ch = [k], prev = k, cur = n0;
        seen.add(ek(k, n0));
        while (!isKnot(cur)) { ch.push(cur); var l = adj.get(cur), nx = l[0] === prev ? l[1] : l[0]; seen.add(ek(cur, nx)); prev = cur; cur = nx; }
        ch.push(cur);
        chains.push({ cells: ch, main: mainEdge.has(ek(ch[0], ch[1])) });
      });
    });
    function okCurve(p) {
      var q = curvePoints(p, 3);
      for (var k = 0; k < q.length; k++) if (q[k][0] < 2.5 || q[k][0] > W - 2.5 || clear(q[k][0], q[k][1]) < 8.5) return false;
      return true;
    }
    function smooth(pts) {                                
      var eps = [9, 5, 2.5, 0], out = pts;
      for (var e = 0; e < eps.length; e++) { out = dp(pts, eps[e]); if (okCurve(out)) return out; }
      return out;
    }
    var kcell = [], kmap = new Map();
    function kn(c) { var k = kmap.get(c); if (k === undefined) { k = kcell.length; kmap.set(c, k); kcell.push(c); } return k; }
    chains.forEach(function (ch) {
      ch.pts = smooth(ch.cells.map(function (c) { var e = exact.get(c); return e ? [e[0], e[1]] : [cxOf(c), cyOf(c)]; }));
      ch.a = kn(ch.cells[0]); ch.b = kn(ch.cells[ch.cells.length - 1]);
    });
    var K = kcell.length, kt = [], inc = [], fin = new Uint8Array(K);
    for (i = 0; i < K; i++) { kt.push(Infinity); inc.push([]); }
    chains.forEach(function (ch, k) { inc[ch.a].push(k); if (ch.b !== ch.a) inc[ch.b].push(k); });
    rootCells.forEach(function (c) { var k = kmap.get(c); if (k !== undefined) kt[k] = 0; });
    for (var it = 0; it < K; it++) {                      /* earliest scroll position at which each knot is reached */
      var u = -1;
      for (i = 0; i < K; i++) if (!fin[i] && kt[i] < Infinity && (u < 0 || kt[i] < kt[u])) u = i;
      if (u < 0) break;
      fin[u] = 1;
      inc[u].forEach(function (ci) {
        var ch = chains[ci], o = ch.a === u ? ch.b : ch.a;
        if (fin[o]) return;
        var p = ch.a === u ? ch.pts : ch.pts.slice().reverse(), t = walk(p, kt[u]), e = t[t.length - 1];
        if (e < kt[o]) kt[o] = e;
      });
    }
    var branches = [];
    chains.forEach(function (ch) {
      if (kt[ch.a] === Infinity && kt[ch.b] === Infinity) return;
      var fromA = kt[ch.a] <= kt[ch.b], st = fromA ? ch.a : ch.b, pts = fromA ? ch.pts : ch.pts.slice().reverse();
      branches.push({ pts: pts, thr: walk(pts, kt[st]), main: ch.main });
    });
    stems.forEach(function (s) { branches.push({ pts: s, thr: walk(s, 0), main: false }); });
    branches.sort(function (p, q) { return p.thr[0] - q.thr[0]; });
    var rootSet = new Set(rootCells), tcells = new Set(targets.filter(function (t) { return t.reached; }).map(function (t) { return t.cell; })), knots = [];
    kcell.forEach(function (c, k) {
      if (kt[k] === Infinity) return;
      var e = exact.get(c), dg = deg(c);
      knots.push({ x: e ? e[0] : cxOf(c), y: e ? e[1] : cyOf(c), thr: kt[k], k: rootSet.has(c) ? 'r' : tcells.has(c) ? 't' : dg === 1 ? 'l' : 'j' });
    });
    return { W: W, H: H, roots: roots, targets: targets, branches: branches, knots: knots, clear: clear, M: M };
  }

  var api = { grow: grow, curvePoints: curvePoints, pathD: pathD, frac: frac, length: length, slacks: slacks };
  if (typeof module === 'object' && module.exports) { module.exports = api; return; }
  root.SITE_GROW = api;

  /* ===== the page: the hero holds still, the first branch grows out of its web, then the page web takes over; both stay alive ===== */
  var doc = root.document, main = doc && doc.getElementById('main');
  if (!main || !root.requestAnimationFrame || !root.matchMedia) return;
  var NS = 'http://www.w3.org/2000/svg', html = doc.documentElement, slice = Array.prototype.slice;
  var reduce = root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pinEl = doc.getElementById('hero-pin'), hero = pinEl && pinEl.querySelector('.hero'), header = doc.querySelector('.site-header');
  var IDS = ['w-tracker', 'w-calendar', 'w-email'], TR = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/;
  function mk(tag, attrs) { var e = doc.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function Web(cls, parent) { this.svg = mk('svg', { 'class': cls, 'aria-hidden': 'true', focusable: 'false' }); parent.appendChild(this.svg); this.items = []; this.dots = []; this.sl = null; this.ready = false; this.heroDots = []; }
  var pageWeb = new Web('grow-web', main), introWeb = hero ? new Web('grow-web intro-web', hero) : null;
  var BOX = '.ptable,.step,.proof,.assure,.canvas-demo,.week,.contact-card,.hero__cta,.thread-node,button,.pill,.field,input,textarea,.demo-shot';
  var BLOCK = 'p,h1,h2,h3,h4,h5,li,td,th,dt,dd,label,legend,figcaption,button,a,div,section';
  var FRAME = '.ptable,.step,.proof,.assure,.canvas-demo,.week,.contact-card', frameSvg = mk('svg', { 'class': 'frame-web', 'aria-hidden': 'true', focusable: 'false' }), frames = [], stubs = [];
  main.appendChild(frameSvg);
  var ST = { P: 0, Pe: 1, L0: 0, L72: 0, mainTop: 0 }, beads = [], queued = 0, timer = 0, ro = null, ptr = null, ptrK = 0, looping = false;

  function pinLen(vh) { return Math.round(Math.max(320, Math.min(440, vh * 0.46))); }   /* about four wheel clicks */
  function keyOf(p) { return Math.round(p[0] * 2) + ',' + Math.round(p[1] * 2); }
  function measure(rootEl, org) {                         /* text blocks and cards, as boxes in the coordinates of org (a viewport point) */
    var out = [], groups = new Map(), labs = new Set(), w = doc.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      if (!n.nodeValue.trim()) continue;
      var pe = n.parentElement;
      if (!pe || pe.closest('.hp,.visually-hidden,[hidden],.wx-field')) continue;      /* the tool web is blocked as a whole */
      var sv = pe.closest('svg');
      if (sv && !sv.classList.contains('web')) continue;      /* skip icons, keep the hero labels */
      var g = pe.closest(BLOCK) || pe, r = doc.createRange(), box = groups.get(g);
      if (sv && !labs.has(pe)) {                                                       /* a hero label also stands alone, so a stem can be checked against it */
        labs.add(pe); var lr = pe.getBoundingClientRect();
        if (lr.width) { var lp = ST.labPad || 0; out.push([lr.left - org.left - lp, lr.top - org.top - lp, lr.right - org.left + lp, lr.bottom - org.top + lp]); }   /* labels drift (3 units) and lean to the pointer (7): keep the stems clear of where they can get to */
      }
      r.selectNodeContents(n);
      slice.call(r.getClientRects()).forEach(function (q) {
        if (!q.width || !q.height) return;
        if (!box) groups.set(g, box = [Infinity, Infinity, -Infinity, -Infinity]);
        box[0] = Math.min(box[0], q.left); box[1] = Math.min(box[1], q.top); box[2] = Math.max(box[2], q.right); box[3] = Math.max(box[3], q.bottom);
      });
    }
    groups.forEach(function (b) { if (b[0] < Infinity) out.push([b[0] - org.left, b[1] - org.top, b[2] - org.left, b[3] - org.top]); });
    slice.call(rootEl.querySelectorAll(BOX)).forEach(function (e) {
      if (e.closest('.hp,.wx-field')) return;
      var r = e.getBoundingClientRect();
      if (r.width && r.height) out.push([r.left - org.left, r.top - org.top, r.right - org.left, r.bottom - org.top]);
    });
    return out;
  }
  function dotOf(id, org) { var d = doc.querySelector('#' + id + ' .dot'); if (!d) return null; var r = d.getBoundingClientRect(); return { x: r.left + r.width / 2 - org.left, y: r.top + r.height / 2 - org.top }; }

  /* draw a grown web into its svg. scale turns the router's scroll units into real scroll distance (the intro runs in the pin) */
  function render(web, res, W, H, scale) {
    var svg = web.svg; while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var grey = mk('g', {}), blue = mk('g', {}), dots = mk('g', {}), sl = new Map();
    web.items = []; web.dots = []; web.sl = sl;
    res.branches.forEach(function (b) {
      if (scale !== 1) b.thr = b.thr.map(function (t) { return t * scale; });
      b.sl = slacks(b.pts, res.clear, 8.5);
      b.pts.forEach(function (p, i) { var k = keyOf(p), v = sl.get(k); if (v === undefined || b.sl[i] < v) sl.set(k, b.sl[i]); });
    });
    res.branches.forEach(function (b) {
      var p = mk('path', { d: pathD(b.pts), pathLength: 1 }), x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, mv = false;
      if (b.main) p.setAttribute('class', 'main');
      (b.main ? blue : grey).appendChild(p);
      b.pts.forEach(function (q) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); if (sl.get(keyOf(q)) > 1) mv = true; });
      web.items.push({ el: p, b: b, last: -1, keys: b.pts.map(keyOf), bb: [x0 - 30, y0 - 30, x1 + 30, y1 + 30], mv: mv, hd: null });
    });
    res.knots.forEach(function (k) {
      if (k.k === 'r') return;
      var e = mk('circle', { cx: k.x.toFixed(1), cy: k.y.toFixed(1), r: k.k === 't' ? 4.5 : k.k === 'l' ? 2.4 : 1.8 });
      e.setAttribute('class', 'k-' + k.k); dots.appendChild(e);
      web.dots.push({ el: e, thr: k.thr * scale, on: false, x: k.x, y: k.y, key: keyOf([k.x, k.y]) });
    });
    svg.appendChild(grey); svg.appendChild(blue); svg.appendChild(dots);
    web.ready = true;
  }
  function reveal(web, r) {
    var it = web.items, i;
    for (i = 0; i < it.length; i++) { var f = frac(it[i].b, r), q = Math.round(f * 1000); if (q !== it[i].last) { it[i].last = q; it[i].el.style.strokeDashoffset = (1 - f).toFixed(3); } }
    web.dots.forEach(function (k) { var on = r >= k.thr; if (on !== k.on) { k.on = on; k.el.classList.toggle('on', on); } });
  }
  /* where the page web has grown to, in main's coordinates. At the moment the pin lets go, the growth line sits on the hero's bottom edge (so the
     first branch carries straight on); it then moves down to a fifth of a screen below the bottom of the screen (1.2 x viewport height) over the next 320px, so the web is drawn ahead of what is visible and leads the cards (they draw at 92%). */
  function pageR(s, l72) {
    if (reduce) return 1e9;
    var L = ST.L0, e = s - ST.P;
    if (e > 0) { var u = Math.min(1, e / 320); u = u * u * (3 - 2 * u); L = ST.L0 + ((l72 === undefined ? ST.L72 : l72) - ST.L0) * u; }
    return s + L - ST.mainTop;
  }
  function update() {
    queued = 0;
    var s = root.pageYOffset, r = pageR(s);
    if (introWeb && introWeb.ready) reveal(introWeb, reduce ? 1e9 : s);
    if (pageWeb.ready) reveal(pageWeb, r);
    if (ST.routeY) { var fe = doc.querySelector('.wx-field'); if (fe) fe.classList.toggle('routed', r >= ST.routeY); }
    var rf = reduce ? 1e9 : Math.max(pageR(s, root.innerHeight * 0.72), s + root.innerHeight * 0.92 - ST.mainTop);   /* cards keep the old 0.72 line so they form where they always did; the web (r) leads them. They draw as they come up the screen (the last one must finish before the page ends) */
    frames.forEach(function (fr) {
      var p = Math.max(0, Math.min(1, (rf - fr.y + 10) / (fr.span * 0.45)));
      var k = Math.round(p * 300); if (k === fr.last) return; fr.last = k;
      fr.o.style.strokeDashoffset = (1 - Math.min(1, p / 0.5)).toFixed(3);
      if (fr.dv) fr.dv.style.strokeDashoffset = (1 - Math.max(0, Math.min(1, (p - 0.35) / 0.4))).toFixed(3);
      var on = p >= 0.45; if (on !== fr.on) { fr.on = on; fr.c.classList.toggle('formed', on); }
    });
    beads.forEach(function (b) { var on = r >= b.y; if (on !== b.on) { b.on = on; if (b.bead) b.bead.classList.toggle('is-lit', on); } });
  }

  /* the cards, tables and rows are drawn by the web: their borders become threads that grow out of a dock and close around the card, then the
     card fills and its content appears. The CSS border steps aside (html.web-frames). */
  function buildFrames(mr, W, H, ySeam) {
    var svg = frameSvg, cs; while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    frames = [];
    if (reduce) { html.classList.remove('web-frames'); return; }
    function f(n) { return Math.round(n * 10) / 10; }
    slice.call(main.querySelectorAll(FRAME)).forEach(function (c) {
      if (c.closest('.wx-field,.wf-list') || (W < 760 && c.matches('.week'))) return;   /* on a phone the week table's text sits on its border: keep the css border there */
      var r = c.getBoundingClientRect(); if (!r.width || !r.height || r.top - mr.top < ySeam) return;
      var L = r.left - mr.left, T = r.top - mr.top, R = r.right - mr.left, B = r.bottom - mr.top;
      var q = Math.min(parseFloat(getComputedStyle(c).borderTopLeftRadius) || 10, (B - T) / 2, (R - L) / 2), y0 = Math.max(T + q, Math.min(B - q, T + 26)), dl = null, dr = null;
      stubs.forEach(function (t) { if (t.c === c) { if (t.side === 'l') dl = t; else dr = t; } });
      var A = function (x, y) { return 'A' + q + ' ' + q + ' 0 0 1 ' + f(x) + ' ' + f(y); };
      var d = (dl ? 'M' + f(dl.x) + ' ' + f(y0) + 'L' + f(L) + ' ' + f(y0) : 'M' + f(L) + ' ' + f(y0)) + 'L' + f(L) + ' ' + f(T + q) + A(L + q, T) + 'L' + f(R - q) + ' ' + f(T) + A(R, T + q) +
              'L' + f(R) + ' ' + f(B - q) + A(R - q, B) + 'L' + f(L + q) + ' ' + f(B) + A(L, B - q) + 'L' + f(L) + ' ' + f(y0);
      if (dr) d += 'M' + f(R) + ' ' + f(dr.y) + 'L' + f(dr.x) + ' ' + f(dr.y);
      var o = mk('path', { d: d, pathLength: 1 }), dv = null, rows = [];
      if (c.matches('.ptable,.week')) slice.call(c.querySelectorAll('tr')).forEach(function (tr, i, all) { var b = tr.getBoundingClientRect(); if (b.width && b.height && i < all.length - 1) rows.push('M' + f(b.left - mr.left) + ' ' + f(b.bottom - mr.top) + 'L' + f(b.right - mr.left) + ' ' + f(b.bottom - mr.top)); });
      if (rows.length) dv = mk('path', { d: rows.join(''), pathLength: 1, 'class': 'fd' });
      svg.appendChild(o); if (dv) svg.appendChild(dv);
      c.classList.add('framed');
      frames.push({ c: c, o: o, dv: dv, y: dl ? dl.y : y0, span: Math.max(220, Math.min(520, B - T) * 0.9), last: -1, on: null });
    });
    html.classList.toggle('web-frames', frames.length > 0);
  }
  function build() {
    html.classList.add('measuring');                      /* measure cards where they will rest */
    var vh = root.innerHeight, hdr = header ? header.offsetHeight : 0, i;
    var pin = false, P = 0;
    html.style.setProperty('--hdr', hdr + 'px');
    if (hero) {                                           /* pin on a big screen when the hero (squeezed to the screen by the css) still fits and the first branch has room to grow */
      var want = !reduce && root.innerWidth >= 960 && vh >= 600, room = 0, low = 0;
      html.classList.toggle('pin-on', want);
      if (want) {
        var hr0 = hero.getBoundingClientRect(), fits = hero.offsetHeight <= vh - hdr + 1;
        IDS.forEach(function (id) { var d = dotOf(id, { left: 0, top: hr0.top }); if (d && d.y > low) low = d.y; });
        room = hr0.height - low;
        pin = fits && room >= 100;
      }
      P = pin ? pinLen(vh) : 0;
      html.classList.toggle('pin-on', pin);
      html.style.setProperty('--pin', P + 'px');
    }
    var mr = main.getBoundingClientRect(), W = Math.round(main.clientWidth), H = Math.round(main.offsetHeight), narrow = W < 760, margin = narrow ? 10 : 16;
    ST.mainTop = mr.top + root.pageYOffset;
    ST.P = P;
    var pr = (pinEl || hero || main).getBoundingClientRect(), ySeam = Math.round(pr.bottom - mr.top), heroH = hero ? Math.round(hero.offsetHeight) : ySeam;
    ST.Pe = pin ? ST.P : Math.round(vh * 0.6); ST.L0 = Math.min(ST.mainTop + heroH, vh * 0.95); ST.L72 = vh * 1.2;
    var bead0 = main.querySelector('.thread-node'), rb = bead0 && bead0.getBoundingClientRect();
    var railX = rb ? rb.left + rb.width / 2 - mr.left : 40, seamX = Math.max(12, Math.round(railX - 34));
    html.setAttribute('data-pin', ST.P);
    pageWeb.ready = false; if (introWeb) introWeb.ready = false;

    /* 1. the first branch: inside the hero, driven by the scroll of the pin (nothing is drawn at scroll 0) */
    var seamAt = seamX, heroSvg = hero && hero.querySelector('svg.web');
    if (hero && introWeb && heroSvg) {
      var hr = hero.getBoundingClientRect(), org = { left: mr.left, top: hr.top }, roots = [], hs = [];
      var sc = heroSvg.getBoundingClientRect().width / 600;
      ST.labPad = W < 760 ? Math.ceil(10 * sc) : 0;
      IDS.forEach(function (id) {
        var d = dotOf(id, org); if (!d) return;
        var lab = doc.querySelector('#' + id + ' .node-name'), lq = lab && lab.getBoundingClientRect();
        if (lq && W < 760) { var gx = lq.right - org.left - d.x; if (gx <= 2 && gx > -14) d.x += 3; else { gx = lq.left - org.left - d.x; if (gx >= -2 && gx < 14) d.x -= 3; } }   /* on a phone the dot is ~4px from its label: the thread leaves 3px to the other side (the dot hides it) */
        var g = doc.getElementById(id), m = g && TR.exec(g.getAttribute('transform') || '');
        roots.push({ x: d.x, y: d.y, stem: 60 }); hs.push({ g: g, base: [d.x, d.y], t0: m ? [+m[1], +m[2]] : [0, 0], scale: sc, ok: !!m });
      });
      if (roots.length) {
        var res = grow({ W: W, H: heroH, blocks: measure(hero, org), roots: roots, seed: 5, margin: margin, twigEvery: 130, hug: 0.25,
                         targets: [{ x: seamX, y: heroH - 3, main: true, alts: [{ x: W - 14, y: heroH - 3 }, { x: 12, y: heroH - 3 }, { x: W / 2, y: heroH - 3 }] }] });
        var mainEnd = 0, allEnd = 0;
        res.branches.forEach(function (b) { var e = b.thr[b.thr.length - 1]; if (e > allEnd) allEnd = e; if (b.main && e > mainEnd) mainEnd = e; });
        render(introWeb, res, W, heroH, ST.Pe * 0.96 / (mainEnd || allEnd || 1));
        introWeb.svg.style.left = (mr.left - hr.left) + 'px';
        introWeb.heroDots = hs;
        introWeb.items.forEach(function (it) { hs.forEach(function (h) { if (it.b.pts.length === 2 && it.b.pts[0][0] === h.base[0] && it.b.pts[0][1] === h.base[1]) it.hd = h; }); });
        if (res.targets[0].reached) seamAt = res.targets[0].x;
        introWeb.res = res;
      }
    }

    /* 2. the page web: from the foot of the hero down to Contact, around the text, hugging the cards, docking at headings and cards */
    var blocks = measure(main, mr).filter(function (b) { return b[3] > ySeam - 2; });
    blocks.push([0, 0, W, ySeam - 1, 0]);                 /* the hero and its pin space belong to the first branch */
    stubs = [];
    var docks = [], gates = [], open = [], targets = [], fld = main.querySelector('.wx-field');
    var ct = doc.getElementById('contact-title'), tr = ct && ct.getBoundingClientRect(), cy = tr ? tr.top - mr.top + tr.height / 2 : H - 400;
    if (tr) targets.push({ x: narrow ? 12 : tr.left - mr.left - 56, y: cy, main: true, alts: [{ x: W - 14, y: cy }, { x: 12, y: cy + 60 }, { x: W / 2, y: cy - 80 }] });
    var inP = null, outP = null, fTop = 0;
    if (fld) {                                            /* the tool web is blocked; the page web comes in above it (port in) and leaves below it (port a) */
      var fr = fld.getBoundingClientRect(); fTop = fr.top - mr.top;
      blocks.push([fr.left - mr.left, fTop, fr.right - mr.left, fr.bottom - mr.top, 6]);
      slice.call(fld.querySelectorAll('.wx-port')).forEach(function (e) {
        if (!e.getClientRects().length) return;                       /* not shown on narrow screens */
        var r = e.getBoundingClientRect(), k = e.getAttribute('data-port'), p = { x: r.left + r.width / 2 - mr.left, y: r.top - mr.top + (k === 'in' ? -10 : 10) };   /* 10px off the box, the explorer's stem bridges the gap */
        if (k === 'in') inP = p; else if (k === 'a') outP = p; else { targets.push({ x: p.x, y: p.y, main: false, alts: [] }); }
        open.push(p);
      });
      if (!(inP && outP)) inP = outP = null;
    }
    var rails = [];
    slice.call(main.querySelectorAll('.threaded')).forEach(function (s) {
      var sr = s.getBoundingClientRect(), b = s.querySelector('.thread-node'), h2 = s.querySelector('h2'), top = sr.top - mr.top, bot = sr.bottom - mr.top;
      if (!b || !h2) return;
      var br = b.getBoundingClientRect(), cx = br.left + br.width / 2 - mr.left, hr2 = h2.getBoundingClientRect(), col = hr2.left - mr.left, ys = [];
      function dock(x, y) { if (y > ySeam + 40) { docks.push({ x: x, y: y }); ys.push(y); } }
      if (!narrow) {
        dock(cx - 26, br.top - mr.top + br.height / 2);   /* the bead */
        dock(col - 22, hr2.top - mr.top + 18);            /* the heading */
        var n = 0;
        function room(x, y) { return !blocks.some(function (b) { return x > b[0] - 6 && x < b[2] + 6 && y > b[1] - 6 && y < b[3] + 6; }); }
        slice.call(s.querySelectorAll(FRAME)).forEach(function (c) {
          var r = c.getBoundingClientRect(), y;
          if (n < 14 && r.width && r.height && !c.closest('.wx-field')) {
            if (Math.abs(r.left - mr.left - col) < 6) { y = r.top - mr.top + 26; dock(col - 22, y); stubs.push({ c: c, x: col - 22, y: y, side: 'l' }); n++; }
            y = r.top - mr.top + r.height - 26;
            if (r.right - mr.left + 34 < W && room(r.right - mr.left + 22, y)) { dock(r.right - mr.left + 22, y); stubs.push({ c: c, x: r.right - mr.left + 22, y: y, side: 'r' }); n++; }
          }
        });
      }
      if (narrow) return;                                 /* phones: no docks, and the rail block would sit on top of the seam root */
      ys.sort(function (a, c) { return a - c; });         /* the Thread rail, with a gate wherever a dock sits beside it */
      var cur = top;
      ys.forEach(function (gy) { if (gy - 24 > cur) rails.push([cx - 1, cur, cx + 1, gy - 24, 9]); cur = Math.max(cur, gy + 24); });
      if (bot > cur) rails.push([cx - 1, cur, cx + 1, bot, 9]);
    });
    var cfg2 = { W: W, H: H, margin: margin, twigEvery: narrow ? 90 : 46, hug: narrow ? 0 : 0.4 }, res2;
    function run2(o) { for (var k in cfg2) o[k] = cfg2[k]; return grow(o); }
    var ctgt = targets.filter(function (t) { return t.main; });
    if (inP) {                                            /* two runs: down to the tool web (and in at the top), then out of its foot to Contact */
      var above = [], below = [], opA = [inP], opB = [outP];
      docks.forEach(function (d) { if (d.y < fTop - 30) { above.push({ x: d.x, y: d.y, main: false, alts: [] }); opA.push(d); } else if (d.y > outP.y + 40) { below.push({ x: d.x, y: d.y, main: false, alts: [] }); opB.push(d); } });
      var rest = targets.filter(function (t) { return !t.main && t.y > outP.y - 2; }).concat(below);
      var bA = blocks.concat(rails, [[0, fTop + 1, W, H, 0]]), bB = blocks.concat(rails, [[0, 0, W, outP.y - 1, 0]]);
      var rA = run2({ blocks: bA, roots: [{ x: seamAt, y: ySeam }], targets: [{ x: inP.x, y: inP.y, main: true, alts: [] }].concat(above), open: opA, seed: 11 });
      var rB = run2({ blocks: bB, roots: [{ x: outP.x, y: outP.y }], targets: ctgt.concat(rest), open: opB, seed: 12 });
      var mid = (fTop + outP.y) / 2;
      res2 = { W: W, H: H, roots: rA.roots, targets: rA.targets.concat(rB.targets), branches: rA.branches.concat(rB.branches), knots: rA.knots.concat(rB.knots), M: margin, clear: function (x, y) { return y < mid ? rA.clear(x, y) : rB.clear(x, y); } };
      res2.joined = rA.targets[0].reached && rB.roots.length > 0;
    } else {
      docks.forEach(function (d) { targets.push({ x: d.x, y: d.y, main: false, alts: [] }); open.push(d); });
      res2 = run2({ blocks: blocks.concat(rails), roots: [{ x: seamAt, y: ySeam }], targets: targets, open: open, seed: 11 });
    }
    html.classList.toggle('web-routed', !!(inP && res2.joined));
    ST.routeY = inP ? fTop : 0;
    buildFrames(mr, W, H, ySeam);
    doc.documentElement.classList.remove('measuring');
    render(pageWeb, res2, W, H, 1);
    pageWeb.res = res2;
    beads = slice.call(main.querySelectorAll('.threaded')).map(function (s) { return { s: s, bead: s.querySelector('.thread-node'), y: s.getBoundingClientRect().top - mr.top + 48, on: false }; });
    update();
  }

  /* ---- alive: a slow drift, and silk that leans toward the pointer. A thread can only move as far as the free space around it allows. ---- */
  function disp(x, y, t, sl, p, out) {
    var a = sl * 0.5;
    if (a < 0.4) { out[0] = out[1] = 0; return; }
    var dx = Math.sin(y * 0.0105 + t * 0.9 + x * 0.004) * 2.6, dy = Math.cos(x * 0.0085 + t * 0.7 + y * 0.003) * 2.1;
    if (p && p.k > 0.01) {
      var qx = p.x - x, qy = p.y - y, d = Math.sqrt(qx * qx + qy * qy);
      if (d < 190 && d > 0.5) { var f = 1 - d / 190; f = f * f * 17 * p.k / d; dx += qx * f; dy += qy * f; }
    }
    var m = Math.sqrt(dx * dx + dy * dy);
    if (m > a) { dx *= a / m; dy *= a / m; }
    out[0] = dx; out[1] = dy;
  }
  var tmp = [0, 0];
  function tick(w, k, vh) {
    var rc = w.svg.getBoundingClientRect();
    if (rc.bottom < -60 || rc.top > vh + 60) return;
    var v0 = -rc.top, v1 = -rc.top + vh, p = ptr ? { x: ptr.x - rc.left, y: ptr.y - rc.top, k: ptrK } : ptrK > 0.01 ? { x: -9999, y: -9999, k: 0 } : null;
    w.items.forEach(function (it) {
      if (it.last <= 0 || (!it.mv && !it.hd) || it.bb[3] < v0 || it.bb[1] > v1) return;
      var pts = it.b.pts, out = [], i;
      for (i = 0; i < pts.length; i++) { disp(pts[i][0], pts[i][1], k, w.sl.get(it.keys[i]) || 0, p, tmp); out.push([pts[i][0] + tmp[0], pts[i][1] + tmp[1]]); }
      if (it.hd && it.hd.ok) {                            /* a stem stays hooked to its dot while the hero web drifts */
        var m = TR.exec(it.hd.g.getAttribute('transform') || '');
        if (m) out.unshift([it.hd.base[0] + (m[1] - it.hd.t0[0]) * it.hd.scale, it.hd.base[1] + (m[2] - it.hd.t0[1]) * it.hd.scale]);
      }
      it.el.setAttribute('d', pathD(out));
    });
    w.dots.forEach(function (d) {
      if (!d.on || d.y < v0 - 30 || d.y > v1 + 30) return;
      disp(d.x, d.y, k, w.sl.get(d.key) || 0, p, tmp);
      d.el.setAttribute('cx', (d.x + tmp[0]).toFixed(1)); d.el.setAttribute('cy', (d.y + tmp[1]).toFixed(1));
    });
  }
  function live(t) {
    if (reduce || doc.hidden) { looping = false; return; }
    root.requestAnimationFrame(live);
    ptrK += ((ptr ? 1 : 0) - ptrK) * 0.08;
    var k = t / 1000, vh = root.innerHeight;
    if (introWeb && introWeb.ready) tick(introWeb, k, vh);
    if (pageWeb.ready) tick(pageWeb, k, vh);
  }
  function wake() { if (!looping && !reduce && !doc.hidden) { looping = true; root.requestAnimationFrame(live); } }

  function schedule() { if (!queued) queued = root.requestAnimationFrame(update); }
  function rebuildSoon() { clearTimeout(timer); timer = setTimeout(build, 140); }
  function start() {
    build();
    if (!reduce) {
      root.addEventListener('scroll', schedule, { passive: true });
      root.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') ptr = { x: e.clientX, y: e.clientY }; }, { passive: true });
      doc.documentElement.addEventListener('pointerleave', function () { ptr = null; });
      root.addEventListener('blur', function () { ptr = null; });
      doc.addEventListener('visibilitychange', wake);
      wake();
    }
    root.addEventListener('resize', rebuildSoon);
    if ('ResizeObserver' in root) { ro = new ResizeObserver(rebuildSoon); ro.observe(main); }
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(rebuildSoon);
    root.SITE_PAGE = { state: ST, intro: introWeb, page: pageWeb, rebuild: build };      /* for the checks in tools/v5_checks.py */
  }
  if (doc.readyState === 'complete') setTimeout(start, 0); else root.addEventListener('load', function () { setTimeout(start, 0); });
})(typeof window !== 'undefined' ? window : this);
