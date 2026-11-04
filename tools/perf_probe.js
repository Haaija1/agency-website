// perf_probe.js: run in the page on a freshly loaded page. Scrolls the full page in 80 steps while recording
// layout shift (CLS) and frame times.
// NOTE: the browser_exec harness cuts Runtime.evaluate off at 5 s and this run takes ~5.5 s, so this file only
// STARTS the run and returns 'started'. Poll with:  js("window.__perf || null")  every ~1 s until it is not null.
(() => {
  window.__perf = null;
  (async () => {
    let cls = 0, shifts = 0;
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { cls += e.value; shifts++; } })
        .observe({ type: 'layout-shift', buffered: true });
    } catch (e) { /* unsupported */ }
    const frames = [];
    let last = performance.now(), running = true;
    (function tick(t) { if (!running) return; frames.push(t - last); last = t; requestAnimationFrame(tick); })(last);
    const H = document.documentElement.scrollHeight - innerHeight, steps = 80;
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 400));
    frames.length = 0;
    for (let i = 0; i <= steps; i++) {
      window.scrollTo({ top: H * i / steps, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 50));
    }
    await new Promise((r) => setTimeout(r, 300));
    running = false;
    frames.sort((a, b) => a - b);
    const avg = frames.reduce((s, x) => s + x, 0) / frames.length;
    const svgEls = document.querySelectorAll('svg.page-web *, svg.web-bands *').length;
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.__perf = {
      cls: +cls.toFixed(4), shifts, frames: frames.length,
      avgMs: +avg.toFixed(2), p95Ms: +frames[Math.floor(frames.length * 0.95)].toFixed(2), worstMs: +frames[frames.length - 1].toFixed(2),
      pageWebSvgElements: svgEls, docHeight: document.documentElement.scrollHeight,
    };
  })();
  return 'started';
})()
