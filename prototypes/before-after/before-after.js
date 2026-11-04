/* ==========================================================================
   Before / After prototype.

   What this does: the two drawings in the markup are plain ordered lists. This script lays
   them out as process maps in one shared stage, draws the threads between the boxes, and
   morphs one into the other. Every "before" thread is paired with the "after" thread it
   belongs to, so at the end of the morph the sixteen tangled threads lie exactly on top of
   the seven clean ones: the threads visibly MERGE rather than cross-fade.

   Geometry is built from MEASURED box rectangles every time, never from hard-coded pixels,
   so it survives any width, any font size and any text wrapping. Only the lane a thread
   travels in is authored (see the route codes below).

   No third-party code. No network requests. Nothing is written to storage.
   If the markup is not what this script expects it returns and the static lists stay.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document, root = doc.documentElement, win = window;
  var stage = doc.querySelector('[data-ba-stage]');
  if (!stage || !doc.createElementNS || !win.requestAnimationFrame) return;

  var panels = [doc.querySelector('[data-ba-panel="0"]'), doc.querySelector('[data-ba-panel="1"]')];
  var scrub = doc.querySelector('[data-ba-scrub]');
  var sticky = doc.querySelector('[data-ba-sticky]');
  var live = doc.querySelector('[data-ba-live]');
  var hint = doc.querySelector('[data-ba-hint]');
  var btns = [].slice.call(doc.querySelectorAll('[data-ba]'));
  if (!panels[0] || !panels[1] || !scrub || !sticky || !live || btns.length !== 2) return;

  var boxes = [
    [].slice.call(panels[0].querySelectorAll('.ba-box')),
    [].slice.call(panels[1].querySelectorAll('.ba-box'))
  ];
  if (boxes[0].length !== 12 || boxes[1].length !== 7) return;

  /* ---------- the two drawings ----------------------------------------------
     Edge = [from, to, routeWide, routeNarrow, bow].
     Route codes:
       'c'      direct: leave the side of A facing B, enter the side of B facing A.
       'c:XY'   direct with the sides named (l r t b) when the automatic choice would
                stack two threads on the same side of a box.
       'l0'..   out of the left side, down (or up) left-gutter lane n, back in on the left.
       'r0'..   the same on the right. Lane 0 is nearest the boxes.
       'm0'     the same, but up the empty channel BETWEEN the two columns, so the thread
                cuts across every thread going the other way. Only exists in the wide
                layout, which is why those edges name a gutter lane for the narrow one.
     bow is a fraction of the edge length; it pushes a direct thread sideways so that
     neighbouring threads cross each other instead of running parallel.
     ------------------------------------------------------------------------ */

  /* Before: a zigzag of twelve steps, plus five threads that double back. */
  var EB = [
    [0, 1, 'c', 0, 0.16], [1, 2, 'c', 0, -0.16], [2, 3, 'c', 0, 0.16],
    [3, 4, 'c', 0, -0.16], [4, 5, 'c', 0, 0.16], [5, 6, 'c', 0, -0.16],
    [6, 7, 'c', 0, 0.16], [7, 8, 'c', 0, -0.16], [8, 9, 'c', 0, 0.16],
    [9, 10, 'c', 0, -0.16], [10, 11, 'c', 0, 0.16],
    [6, 2, 'm0', 'l0'],   /* typed a second time: the same figures, two systems */
    [7, 3, 'm1', 'r1'],   /* waiting sends the email thread round again */
    [5, 3, 'r0'],         /* chasing the supplier goes back to the manager's question */
    [11, 1, 'r2'],        /* looking for an answer goes back to the paper tray */
    [10, 0, 'l1']         /* "is it paid?" lands back in the shared inbox */
  ];
  var BACK = 11;  /* edges from here on are the ones that double back */

  /* After: one spine that splits at the check and merges again at the human approval. */
  var EA = [
    [0, 1, 'c'], [1, 2, 'c'],
    [2, 3, 'c:rt', 'c'],    /* split: only what does not match goes to review */
    [2, 4, 'c:bt', 'l0'],   /* matched: straight to the person who approves */
    [3, 4, 'c:lr', 'c'],    /* reviewed: merges back in at the same approval */
    [4, 5, 'c'], [5, 6, 'c']
  ];

  /* which "after" thread each "before" thread merges into */
  var TO = [0, 0, 1, 2, 2, 1, 2, 4, 5, 6, 6, 1, 4, 2, 6, 6];
  /* which "after" box each "before" box becomes */
  var MERGE = [0, 1, 1, 3, 2, 2, 1, 3, 4, 5, 6, 6];

  /* wide placement, as fractions of the stage box. The right column is dropped half a row,
     so the twelve steps read as one zigzag and every forward thread is a diagonal. */
  var WB = [
    [0.26, 0.145], [0.74, 0.2175], [0.26, 0.290], [0.74, 0.3625], [0.26, 0.435], [0.74, 0.5075],
    [0.26, 0.580], [0.74, 0.6525], [0.26, 0.725], [0.74, 0.7975], [0.26, 0.870], [0.74, 0.9425]
  ];
  var WA = [[0.40, 0.16], [0.40, 0.295], [0.40, 0.43], [0.76, 0.57], [0.40, 0.655], [0.40, 0.79], [0.40, 0.925]];
  var WBW = 0.40, WAW = [0.34, 0.34, 0.34, 0.30, 0.34, 0.34, 0.34];

  var SAY = [
    'Before: twelve boxes. The threads cross and double back — the same figures are typed in ' +
    'twice, the supplier and the manager are chased by email, and the invoice waits for the next payment run.',
    'After: seven boxes. The re-typing, chasing and waiting threads have merged into one flow: the ' +
    'invoice is captured once, matched to the order it belongs to, and only what does not match goes to a ' +
    'person to review. A person still approves the payment before anything is released to the bank.'
  ];

  /* ---------- small helpers ---------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var N = 26;     /* points per thread. Both drawings use the same count, so they can be interpolated. */
  var PAD = 5;    /* a thread starts this far outside the box it leaves */
  var TOP = 12;   /* sticky offset */

  function ns(t) { return doc.createElementNS(SVGNS, t); }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function r2(v) { return Math.round(v * 10) / 10; }
  function smooth(t) { return t * t * (3 - 2 * t); }
  var mq = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return !!(mq && mq.matches); }

  function dist(a, b) { var x = b[0] - a[0], y = b[1] - a[1]; return Math.sqrt(x * x + y * y); }
  function at(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }

  /* a cubic Bezier sampled to exactly n points. A Bezier stays inside the hull of its four
     control points, so a thread cannot swing off into a box the way a Catmull-Rom spline can. */
  function bez(c, n) {
    var out = [], i;
    for (i = 0; i < n; i++) {
      var t = i / (n - 1), u = 1 - t;
      var a = u * u * u, b = 3 * u * u * t, d = 3 * u * t * t, e = t * t * t, k, p = [];
      for (k = 0; k < 2; k++) p.push(a * c[0][k] + b * c[1][k] + d * c[2][k] + e * c[3][k]);
      out.push(p);
    }
    return out;
  }

  /* a polyline with its corners rounded off, sampled to exactly n points along its length.
     Used for the gutter lanes, where a thread has to turn two square corners and must not
     overshoot past them. */
  function poly(V, R, n) {
    var seg = [], cur = V[0], i;
    for (i = 1; i < V.length - 1; i++) {
      var a = V[i - 1], v = V[i], b = V[i + 1];
      var la = dist(a, v) || 1, lb = dist(v, b) || 1;
      var s = at(v, a, Math.min(R, la / 2) / la), e = at(v, b, Math.min(R, lb / 2) / lb);
      seg.push([cur, s]);
      seg.push([s, e, v]);
      cur = e;
    }
    seg.push([cur, V[V.length - 1]]);
    var L = [], tot = 0;
    for (i = 0; i < seg.length; i++) {
      var g = seg[i];
      var l = g.length > 2 ? (dist(g[0], g[2]) + dist(g[2], g[1]) + dist(g[0], g[1])) / 2 : dist(g[0], g[1]);
      L.push(l); tot += l;
    }
    var out = [], k = 0, acc = 0;
    for (i = 0; i < n; i++) {
      var d = i / (n - 1) * (tot || 1);
      while (k < seg.length - 1 && acc + L[k] < d) { acc += L[k]; k++; }
      var u = L[k] ? Math.min(1, (d - acc) / L[k]) : 0, g2 = seg[k];
      if (g2.length > 2) {
        var w = 1 - u;
        out.push([w * w * g2[0][0] + 2 * w * u * g2[2][0] + u * u * g2[1][0],
          w * w * g2[0][1] + 2 * w * u * g2[2][1] + u * u * g2[1][1]]);
      } else out.push(at(g2[0], g2[1], u));
    }
    return out;
  }

  /* a smooth path through a point list (Catmull-Rom written as cubics) */
  function toPath(p) {
    var n = p.length, d = 'M' + r2(p[0][0]) + ' ' + r2(p[0][1]), i;
    for (i = 0; i < n - 1; i++) {
      var a = p[i > 0 ? i - 1 : 0], b = p[i], c = p[i + 1], e = p[i + 2 < n ? i + 2 : n - 1];
      d += 'C' + r2(b[0] + (c[0] - a[0]) / 6) + ' ' + r2(b[1] + (c[1] - a[1]) / 6) +
        ' ' + r2(c[0] - (e[0] - b[0]) / 6) + ' ' + r2(c[1] - (e[1] - b[1]) / 6) +
        ' ' + r2(c[0]) + ' ' + r2(c[1]);
    }
    return d;
  }

  function mix(a, b, t) {
    var o = [], i;
    for (i = 0; i < a.length; i++) o.push([a[i][0] + (b[i][0] - a[i][0]) * t, a[i][1] + (b[i][1] - a[i][1]) * t]);
    return o;
  }

  function anchor(r, s) {
    if (s === 'l') return [r.l - PAD, r.cy];
    if (s === 'r') return [r.r + PAD, r.cy];
    if (s === 't') return [r.cx, r.t - PAD];
    return [r.cx, r.b + PAD];
  }
  function normal(s) { return s === 'l' ? [-1, 0] : s === 'r' ? [1, 0] : s === 't' ? [0, -1] : [0, 1]; }
  function facing(a, b) {
    var dx = b.cx - a.cx, dy = b.cy - a.cy;
    return Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'b' : 't');
  }

  /* ---------- the geometry of one edge, as N points ---------- */
  function geom(e, R, L, k, n) {
    var A = R[e[0]], B = R[e[1]], route = e[k] || e[2], p0, p1;
    if (route.charAt(0) === 'c') {
      var sa, sb;
      if (route.charAt(1) === ':') { sa = route.charAt(2); sb = route.charAt(3); }
      else { sa = facing(A, B); sb = facing(B, A); }
      p0 = anchor(A, sa); p1 = anchor(B, sb);
      var n0 = normal(sa), n1 = normal(sb);
      var dx = p1[0] - p0[0], dy = p1[1] - p0[1];
      var d = dist(p0, p1) || 1, s = d * 0.32, bow = (e[4] || 0) * d;
      var bx = -dy / d * bow, by = dx / d * bow;
      return bez([p0, [p0[0] + n0[0] * s + bx, p0[1] + n0[1] * s + by],
        [p1[0] + n1[0] * s + bx, p1[1] + n1[1] * s + by], p1], n);
    }
    var c0 = route.charAt(0), lane = +route.charAt(1), side, x;
    if (c0 === 'm' && L.m) { side = A.cx < L.mid ? 'r' : 'l'; x = L.m[lane]; }
    else {
      side = (c0 === 'l' || c0 === 'm') ? 'l' : 'r';
      var arr = side === 'l' ? L.l : L.r;
      x = arr[Math.min(lane, arr.length - 1)];
    }
    p0 = anchor(A, side); p1 = anchor(B, side);
    return poly([p0, [x, A.cy], [x, B.cy], p1], 22, n);
  }

  /* The lanes a thread may travel in, all worked out from the measured boxes: two in the
     left margin, three in the right margin, and - when the drawing is in two columns - two
     in the empty channel between them. Nothing here is a hard-coded pixel. */
  function lanes(R, W) {
    var x0 = Infinity, x1 = -Infinity, lo = -Infinity, hi = Infinity, mid = W / 2, i;
    for (i = 0; i < R.length; i++) {
      if (R[i].l < x0) x0 = R[i].l;
      if (R[i].r > x1) x1 = R[i].r;
      if (R[i].cx < mid) { if (R[i].r > lo) lo = R[i].r; }
      else if (R[i].l < hi) hi = R[i].l;
    }
    var g = W - x1, m = null;
    if (lo > -Infinity && hi < Infinity && hi - lo > 34) {
      var c = (lo + hi) / 2, s = (hi - lo) * 0.2;
      m = [c - s, c + s];
    }
    return { l: [x0 * 2 / 3, x0 / 3], r: [x1 + g / 4, x1 + g / 2, x1 + g * 3 / 4], m: m, mid: mid };
  }

  /* ---------- the svg ---------- */
  var svg = ns('svg'), gT = ns('g'), gF = ns('g'), thP = [], flP = [], i;
  svg.setAttribute('class', 'ba-web');
  svg.setAttribute('aria-hidden', 'true');
  for (i = 0; i < EB.length; i++) {
    var p = ns('path');
    p.setAttribute('class', 'ba-th');
    if (i >= BACK) p.setAttribute('data-back', '1');
    gT.appendChild(p); thP.push(p);
  }
  for (i = 0; i < EA.length; i++) {
    var q = ns('path');
    q.setAttribute('class', 'ba-fl');
    gF.appendChild(q); flP.push(q);
  }
  svg.appendChild(gT); svg.appendChild(gF);

  /* ---------- state ---------- */
  var prog = 0, shown = -1, wide = false, W = 0, H = 0;
  var geoB = [], geoA = [], span = 0, scrubOn = false, locked = false, anim = 0, timer = 0;

  function cssPos(el, p, w) {
    el.style.setProperty('--x', (p[0] * 100) + '%');
    el.style.setProperty('--y', (p[1] * 100) + '%');
    el.style.setProperty('--w', (w * 100) + '%');
  }
  function cssClear(el) {
    el.style.removeProperty('--x'); el.style.removeProperty('--y'); el.style.removeProperty('--w');
  }
  function cssOff(el) { el.style.setProperty('--dx', '0px'); el.style.setProperty('--dy', '0px'); }

  function place() {
    var w0 = stage.getBoundingClientRect().width;
    wide = w0 >= 900;
    root.classList.toggle('ba-wide', wide);
    root.classList.toggle('ba-narrow', !wide);
    /* one font-size for the whole wide drawing, from the measured stage width: the map then
       scales as a single piece and the channels between the rows cannot close up. */
    stage.style.fontSize = wide ? (w0 * 0.0135).toFixed(2) + 'px' : '';
    var j, n;
    for (j = 0; j < 2; j++) {
      for (n = 0; n < boxes[j].length; n++) {
        if (wide) cssPos(boxes[j][n], j ? WA[n] : WB[n], j ? WAW[n] : WBW);
        else cssClear(boxes[j][n]);
      }
    }
  }

  function measure() {
    var o = stage.getBoundingClientRect(), out = [[], []], j, n, r;
    W = o.width; H = o.height;
    for (j = 0; j < 2; j++) {
      for (n = 0; n < boxes[j].length; n++) {
        r = boxes[j][n].getBoundingClientRect();
        out[j].push({
          l: r.left - o.left, t: r.top - o.top, r: r.right - o.left, b: r.bottom - o.top,
          cx: (r.left + r.right) / 2 - o.left, cy: (r.top + r.bottom) / 2 - o.top
        });
      }
    }
    return out;
  }

  function build() {
    var j, n, R, L, k = wide ? 2 : 3;
    for (j = 0; j < 2; j++) for (n = 0; n < boxes[j].length; n++) cssOff(boxes[j][n]);
    R = measure();
    if (!W || !H) return;
    svg.setAttribute('viewBox', '0 0 ' + r2(W) + ' ' + r2(H));
    geoB = []; geoA = [];
    L = lanes(R[0], W);
    for (n = 0; n < EB.length; n++) geoB.push(geom(EB[n], R[0], L, k, N));
    L = lanes(R[1], W);
    for (n = 0; n < EA.length; n++) geoA.push(geom(EA[n], R[1], L, k, N));
    for (n = 0; n < EA.length; n++) flP[n].setAttribute('d', toPath(geoA[n]));
    /* Where each box travels while the drawings swap. A "before" box ends up exactly on the
       "after" box it becomes, and an "after" box starts at the average of the boxes that
       become it, so the boxes move with the same curve as the threads and a thread's ends
       stay on the boxes it joins all the way through. */
    for (n = 0; n < 12; n++) {
      var a = R[0][n], b = R[1][MERGE[n]];
      boxes[0][n].__d = [b.cx - a.cx, b.cy - a.cy];
    }
    for (n = 0; n < 7; n++) {
      var sx = 0, sy = 0, c = 0, m;
      for (m = 0; m < 12; m++) if (MERGE[m] === n) { sx += R[0][m].cx; sy += R[0][m].cy; c++; }
      boxes[1][n].__d = c ? [sx / c - R[1][n].cx, sy / c - R[1][n].cy] : [0, 0];
    }
    draw();
  }

  function shift(el, f) {
    var d = el.__d;
    if (!d) return;
    el.style.setProperty('--dx', r2(d[0] * f) + 'px');
    el.style.setProperty('--dy', r2(d[1] * f) + 'px');
  }

  /* The three phases are deliberately kept apart, in this order:
       0.04 - 0.24   the "before" labels fade and the boxes start to gather
       0.22 - 0.75   the threads merge: sixteen paths slide onto seven
       0.74 - 0.94   the "after" labels appear on the flow that is now drawn
     The labels are therefore never on screen while a thread is between the two drawings,
     which is what lets check-text-clear.js come back with zero crossings at every step of
     the morph and not only at its two ends. */
  function draw() {
    if (!geoB.length) return;
    var e = smooth(clamp((prog - 0.22) / 0.53)), n;
    var o0 = clamp(1 - (prog - 0.04) / 0.20), o1 = clamp((prog - 0.74) / 0.20);
    for (n = 0; n < EB.length; n++) {
      thP[n].setAttribute('d', toPath(mix(geoB[n], geoA[TO[n]], e)));
      thP[n].style.opacity = (1 - e * e).toFixed(3);
    }
    var dr = clamp((e - 0.1) / 0.9);
    for (n = 0; n < EA.length; n++) {
      flP[n].style.opacity = e < 0.1 ? '0' : '1';
      flP[n].style.strokeDashoffset = (1 - dr).toFixed(3);
    }
    panels[0].style.setProperty('--o', o0.toFixed(3));
    panels[1].style.setProperty('--o', o1.toFixed(3));
    panels[0].setAttribute('data-o', o0 < 0.02 ? '0' : '1');
    panels[1].setAttribute('data-o', o1 < 0.02 ? '0' : '1');
    for (n = 0; n < 12; n++) shift(boxes[0][n], e);
    for (n = 0; n < 7; n++) shift(boxes[1][n], 1 - e);
  }

  /* ---------- the state that is announced: only once the morph has come to rest ---------- */
  function settle(now) {
    clearTimeout(timer);
    var run = function () {
      var s = prog >= 0.5 ? 1 : 0;
      btns[0].setAttribute('aria-pressed', s ? 'false' : 'true');
      btns[1].setAttribute('aria-pressed', s ? 'true' : 'false');
      panels[0].setAttribute('aria-hidden', s ? 'true' : 'false');
      panels[1].setAttribute('aria-hidden', s ? 'false' : 'true');
      if (s !== shown) { shown = s; live.textContent = SAY[s]; }
    };
    if (now) run(); else timer = setTimeout(run, 170);
  }

  function setProg(p) {
    p = clamp(p);
    if (p === prog) return;
    prog = p; draw(); settle();
  }

  function tween(target) {
    if (anim) win.cancelAnimationFrame(anim);
    var from = prog, t0 = 0;
    var step = function (ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / 700);
      setProg(from + (target - from) * smooth(k));
      anim = k < 1 ? win.requestAnimationFrame(step) : 0;
    };
    anim = win.requestAnimationFrame(step);
  }

  /* ---------- scroll scrub: on only when the whole drawing fits the screen ---------- */
  function layoutScrub() {
    var h = stage.getBoundingClientRect().height;
    scrubOn = !locked && !reduced() && h > 0 && (h + TOP + 24) <= win.innerHeight;
    if (scrubOn) {
      span = Math.round(Math.min(760, win.innerHeight * 0.9));
      sticky.style.position = 'sticky';
      sticky.style.top = TOP + 'px';
      scrub.style.height = Math.round(h + span) + 'px';
    } else {
      span = 0;
      sticky.style.position = '';
      sticky.style.top = '';
      scrub.style.height = '';
    }
    if (hint) hint.hidden = !scrubOn;
  }

  function onScroll() {
    if (!scrubOn || !span) return;
    setProg((TOP - scrub.getBoundingClientRect().top) / span);
  }

  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var t = +b.getAttribute('data-ba');
      if (scrubOn) {
        win.scrollTo({
          top: Math.round(scrub.getBoundingClientRect().top + win.pageYOffset - TOP + (t ? span : 0)),
          behavior: reduced() ? 'auto' : 'smooth'
        });
      } else if (reduced()) {
        setProg(t); settle(true);
      } else {
        tween(t);
      }
    });
  });

  var rt = 0;
  function relayout() {
    place(); build(); layoutScrub(); onScroll();
  }
  win.addEventListener('resize', function () {
    clearTimeout(rt); rt = setTimeout(relayout, 120);
  });
  win.addEventListener('scroll', onScroll, { passive: true });
  if (mq && mq.addEventListener) mq.addEventListener('change', relayout);

  /* ---------- go ---------- */
  root.classList.add('ba-js');
  stage.insertBefore(svg, stage.firstChild);
  place();
  build();
  layoutScrub();
  onScroll();
  settle(true);
  win.addEventListener('load', relayout);

  /* Test hook, used by check-text-clear.js and shot.js. Calling set() turns the scroll
     scrub off for the rest of the page's life, so a check can hold one progress value. */
  win.BA = {
    set: function (p) { locked = true; layoutScrub(); prog = -1; setProg(p); settle(true); return prog; },
    get: function () { return prog; },
    wide: function () { return wide; },
    relayout: relayout
  };
})();
