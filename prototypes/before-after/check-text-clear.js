/* ==========================================================================
   check-text-clear.js  -  "no thread ever crosses a label", measured, not assumed.

   Same idea as tools/web_collision.js: walk the real DOM, take the real rectangles,
   walk the real <path> geometry, and count overlaps. Differences are listed below.

   HOW IT WORKS
   1. Text boxes. A TreeWalker collects every non-empty text node inside the stage.
      Each node's client rectangles (one per wrapped line, from Range.getClientRects)
      are padded by PAD px. Box counters are drawn with ::before, which a Range cannot
      see, so the <li> element rectangles are collected too, padded by 2 px - that is a
      STRICTER test, because it forbids a thread anywhere inside a box, not just on its
      letters.
   2. Visibility. A rectangle only counts while it can be seen: a text node whose
      panel is faded below VIS is invisible, so a thread cannot be read as crossing it.
      web_collision.js does the same for text scrolled out of a clipping box. Threads
      are filtered the same way, by their own opacity.
   3. Threads. Every <path> in the overlay is walked with getPointAtLength every STEP px
      and each sample is tested against every live rectangle. A sample is allowed inside
      the two boxes that path connects, within END px of its own ends, because a thread
      has to touch the boxes it joins; endpoints sit PAD px outside the box anyway.
   4. Result: { vw, paths, samples, textRects, boxRects, hits, first } with hits: 0
      meaning nothing visible is crossed.

   It takes no arguments and returns a plain object, so it can be dropped into
   Runtime.evaluate / page.evaluate at any viewport width and at any morph progress.
   ========================================================================== */
(function () {
  var PAD = 4, STEP = 3, VIS = 0.15, END = 7;
  var stage = document.querySelector('[data-ba-stage]');
  if (!stage) return { error: 'no stage' };

  var o = stage.getBoundingClientRect();
  var panels = [].slice.call(stage.querySelectorAll('[data-ba-panel]'));

  /* opacity a panel is currently painted at */
  function panelAlpha(el) {
    var a = 1;
    for (var n = el; n && n !== document.documentElement; n = n.parentElement) {
      var s = getComputedStyle(n);
      if (s.visibility === 'hidden' || s.display === 'none') return 0;
      a *= parseFloat(s.opacity);
      if (!(a > 0)) return 0;
    }
    return a;
  }

  var alpha = {}, i;
  for (i = 0; i < panels.length; i++) alpha[panels[i].getAttribute('data-ba-panel')] = panelAlpha(panels[i]);

  /* --- 1 + 2: the rectangles that are visible right now --- */
  var T = [], nText = 0, nBox = 0;
  function add(l, t, r, b, pad, owner) {
    if (r > l && b > t) T.push([l - pad, t - pad, r + pad, b + pad, owner]);
  }
  function panelOf(el) {
    var p = el.closest ? el.closest('[data-ba-panel]') : null;
    return p ? p.getAttribute('data-ba-panel') : null;
  }

  var w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT), n;
  while ((n = w.nextNode())) {
    if (!n.textContent.trim()) continue;
    var host = n.parentElement;
    var pid = panelOf(host);
    if (pid !== null && !(alpha[pid] >= VIS)) continue;          /* faded out: cannot be crossed */
    var owner = host.closest('.ba-box');
    var rg = document.createRange(); rg.selectNodeContents(n);
    var rs = rg.getClientRects();
    for (i = 0; i < rs.length; i++) {
      add(rs[i].left - o.left, rs[i].top - o.top, rs[i].right - o.left, rs[i].bottom - o.top, PAD, owner);
      nText++;
    }
  }
  var bx = [].slice.call(stage.querySelectorAll('.ba-box'));
  for (i = 0; i < bx.length; i++) {
    var pid2 = panelOf(bx[i]);
    if (pid2 !== null && !(alpha[pid2] >= VIS)) continue;
    var r = bx[i].getBoundingClientRect();
    add(r.left - o.left, r.top - o.top, r.right - o.left, r.bottom - o.top, 2, bx[i]);
    nBox++;
  }

  /* --- 3: walk the threads ---
     A thread leaves and enters a box, so the two boxes at its own ends are exempt, and
     only within END px of those ends. Every other box and every other label must be clear
     along the whole length. "The box at this end" is worked out from geometry: the boxes
     whose padded rectangle comes within REACH px of that endpoint. */
  var REACH = PAD + 4;
  function endBoxes(q) {
    var s = [];
    for (var k = 0; k < T.length; k++) {
      var t = T[k];
      if (t[4] && q.x > t[0] - REACH && q.x < t[2] + REACH && q.y > t[1] - REACH && q.y < t[3] + REACH) {
        if (s.indexOf(t[4]) < 0) s.push(t[4]);
      }
    }
    return s;
  }

  var paths = [].slice.call(stage.querySelectorAll('svg.ba-web path'));
  var hits = [], samples = 0, used = 0;
  for (i = 0; i < paths.length; i++) {
    var p = paths[i];
    if (!(parseFloat(getComputedStyle(p).opacity) >= VIS)) continue;
    var L = p.getTotalLength();
    if (!L) continue;
    used++;
    var ends = [endBoxes(p.getPointAtLength(0)), endBoxes(p.getPointAtLength(L))];
    for (var d = 0; d <= L; d += STEP) {
      var q = p.getPointAtLength(d);
      samples++;
      var exempt = d < END ? ends[0] : d > L - END ? ends[1] : null;
      for (var j = 0; j < T.length; j++) {
        var t = T[j];
        if (q.x > t[0] && q.x < t[2] && q.y > t[1] && q.y < t[3]) {
          if (exempt && t[4] && exempt.indexOf(t[4]) >= 0) continue;
          hits.push({ path: i, cls: p.getAttribute('class'), x: Math.round(q.x), y: Math.round(q.y) });
          break;
        }
      }
    }
  }

  return {
    vw: innerWidth,
    wide: !!(window.BA && window.BA.wide()),
    prog: window.BA ? +window.BA.get().toFixed(2) : null,
    paths: used,
    samples: samples,
    textRects: nText,
    boxRects: nBox,
    hits: hits.length,
    first: hits.slice(0, 6)
  };
})()
