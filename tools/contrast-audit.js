// Paste into the browser console (or run with Runtime.evaluate) on any page.
// Checks every visible piece of text against its effective background, WCAG 2.x:
// 4.5:1 for normal text, 3:1 for large text (24px+, or 18.66px+ at weight 700+).
// Backgrounds are composited from the element up to the first opaque ancestor (over white).
// Gradients are not sampled: an element with a gradient behind it is flagged, so check it by eye.
(() => {
  const parse = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c || '');
    if (!m) return null;
    const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const bgOf = (el) => {
    const layers = []; let gradient = false;
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage !== 'none') gradient = true;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a === 1) break; }
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return { c: base, gradient };
  };
  const visible = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || e.getAttribute('aria-hidden') === 'true' || e.hasAttribute('hidden')) return false;
    }
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const rows = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let n; (n = walker.nextNode()); ) {
    const t = n.textContent.replace(/\s+/g, ' ').trim();
    const el = n.parentElement;
    if (!t || seen.has(el) || /^(SCRIPT|STYLE|TITLE)$/i.test(el.tagName) || !visible(el)) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    const svgText = el instanceof SVGElement;
    const fg = parse(svgText ? cs.fill : cs.color);
    if (!fg) continue;
    const { c: bg, gradient } = bgOf(el);
    const eff = over(fg, bg);
    const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const r = ratio(eff, bg);
    rows.push({ text: t.slice(0, 44), tag: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''), size: +size.toFixed(1), weight, ratio: +r.toFixed(2), need, pass: r >= need, gradient });
  }
  const fails = rows.filter((r) => !r.pass);
  const lowest = [...rows].sort((a, b) => a.ratio - b.ratio).slice(0, 6).map((r) => `${r.ratio} (${r.size}px/${r.weight}, need ${r.need}) ${r.tag}: ${r.text}`);
  return { checked: rows.length, min: Math.min(...rows.map((r) => r.ratio)), failures: fails, gradientItems: rows.filter((r) => r.gradient).length, gradientRows: rows.filter((r) => r.gradient).map((r) => `${r.ratio} (need ${r.need}) ${r.tag}: ${r.text}`), lowest };
})()
