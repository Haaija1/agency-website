/* BPR site: motion layer (progressive enhancement; the page is complete without it).
   - Hero web: nodes drift gently and lean toward the mouse; the threads follow.
   - The page web that grows down the page lives in grow.js (it replaced the v2 strands).
   - Workflow example: a blue pulse runs card to card.
   - Cards and rows ease in once.
   Off entirely when the visitor asks for reduced motion. No libraries, no network requests. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.requestAnimationFrame) return;

  var root = document.documentElement;
  var NS = 'http://www.w3.org/2000/svg';
  var slice = Array.prototype.slice;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function mk(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function onVisible(el, fn, threshold) {
    if (!('IntersectionObserver' in window)) { fn(true); return; }
    new IntersectionObserver(function (es) { fn(es[es.length - 1].isIntersecting); }, { threshold: threshold || 0.05 }).observe(el);
  }

  /* ---------- Cards and rows ease in once ---------- */
  (function reveal() {
    if (!('IntersectionObserver' in window)) return;
    root.classList.add('js-anim');
    var list = slice.call(document.querySelectorAll('.ptable,.step,.proof-item,.assure,.canvas-demo,.week,.contact-card'));
    list.forEach(function (el) {
      el.classList.add('reveal');
      var idx = el.parentNode ? slice.call(el.parentNode.children).indexOf(el) : 0;
      el.style.setProperty('--d', Math.min(idx, 3) * 45 + 'ms');
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting && e.boundingClientRect.top > 0) return; /* below the fold: wait */
        var el = e.target;
        io.unobserve(el);
        el.classList.add('in');
        setTimeout(function () { el.classList.remove('reveal', 'in'); el.style.removeProperty('--d'); }, 900);
      });
    }, { rootMargin: '0px 0px 14% 0px' });   /* a little BEFORE it enters, so the top of a tall card is not missed */
    list.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Hero web: drift and lean ---------- */
  (function hero() {
    var svg = document.querySelector('.web');
    if (!svg) return;
    var nodes = slice.call(svg.querySelectorAll('.node')).map(function (g) {
      var m = /translate\(([-\d.]+),([-\d.]+)\)/.exec(g.getAttribute('transform'));
      return { g: g, id: g.id, bx: +m[1], by: +m[2], x: +m[1], y: +m[2], p1: Math.random() * 6.28, p2: Math.random() * 6.28 };
    });
    var byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });
    var links = slice.call(svg.querySelectorAll('.link')).map(function (p) {
      var e = p.getAttribute('data-ends').split(' ');
      return { p: p, a: byId[e[0]], b: byId[e[1]] };
    });
    var pt = null, running = false;

    if (fine) {
      svg.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var r = svg.getBoundingClientRect();
        pt = { x: (e.clientX - r.left) * 600 / r.width, y: (e.clientY - r.top) * 520 / r.height };
      });
      svg.addEventListener('pointerleave', function () { pt = null; });
    }

    function frame(t) {
      if (!running) return;
      requestAnimationFrame(frame);
      var k = t / 1000;
      nodes.forEach(function (n) {
        var amp = n.id === 'w-team' ? 1.2 : 3;
        var tx = n.bx + Math.sin(k * 0.6 + n.p1) * amp, ty = n.by + Math.cos(k * 0.5 + n.p2) * amp;
        if (pt) {
          var dx = pt.x - tx, dy = pt.y - ty, d = Math.sqrt(dx * dx + dy * dy);
          if (d > 0.1 && d < 150) { var f = (1 - d / 150) * 7; tx += dx / d * f; ty += dy / d * f; }
        }
        n.x += (tx - n.x) * 0.12;
        n.y += (ty - n.y) * 0.12;
        n.g.setAttribute('transform', 'translate(' + n.x.toFixed(2) + ',' + n.y.toFixed(2) + ')');
      });
      links.forEach(function (l) {
        var ax = l.a.x, ay = l.a.y, bx = l.b.x, by = l.b.y;
        var qx = (ax + bx) / 2 - (by - ay) * 0.08, qy = (ay + by) / 2 + (bx - ax) * 0.08;
        l.p.setAttribute('d', 'M' + ax.toFixed(1) + ',' + ay.toFixed(1) + ' Q' + qx.toFixed(1) + ',' + qy.toFixed(1) + ' ' + bx.toFixed(1) + ',' + by.toFixed(1));
      });
    }
    onVisible(svg, function (on) {
      if (on && !running) { running = true; requestAnimationFrame(frame); }
      else if (!on) { running = false; }
    });
  })();

  /* ---------- Workflow example: a pulse runs card to card ---------- */
  (function flow() {
    var box = document.querySelector('.canvas-demo'), ol = box && box.querySelector('.flow');
    if (!ol) return;
    var cards = slice.call(ol.querySelectorAll('.wnode')), edges = slice.call(ol.querySelectorAll('.edge'));
    var timer = 0, visible = false;
    function clear() {
      cards.forEach(function (c) { c.classList.remove('active'); });
      edges.forEach(function (e) { e.classList.remove('run'); });
    }
    function later(fn, ms) { timer = setTimeout(fn, ms); }
    function cycle() {
      if (!visible) return;
      clear();
      var i = 0;
      (function step() {
        if (!visible) return;
        cards[i].classList.add('active');
        if (i < edges.length) {
          later(function () {
            edges[i].classList.add('run');
            later(function () { i++; step(); }, 650);
          }, 450);
        } else {
          later(function () { clear(); later(cycle, 2400); }, 2200);
        }
      })();
    }
    onVisible(box, function (on) {
      visible = on;
      clearTimeout(timer);
      if (on) later(cycle, 600); else clear();
    }, 0.35);
  })();
})();
