// Layout sweep probe: run at each viewport width (Runtime.evaluate). Returns one JSON-able object.
// Reports the things that break between breakpoints: page overflow, flow cards outside their panel,
// hero column count, web label size on screen, header wrapping, smallest HTML text.
(() => {
  const de = document.documentElement;
  const r = (e) => e.getBoundingClientRect();
  const demo = document.querySelector('.canvas-demo');
  const dr = demo ? r(demo) : null;
  const cards = [...document.querySelectorAll('.flow .wnode')].map((c) => r(c));
  const outside = dr ? cards.filter((c) => c.left < dr.left - 0.5 || c.right > dr.right + 0.5).length : -1;
  const web = document.querySelector('.web');
  const wr = web ? r(web) : null;
  const label = document.querySelector('.web .node-name');
  const labelPx = label && wr ? +(parseFloat(getComputedStyle(label).fontSize) * wr.width / 600).toFixed(1) : null;
  const hdr = document.querySelector('.header-inner');
  let minFont = 99, minEl = '';
  for (const el of document.body.querySelectorAll('*')) {
    if (el instanceof SVGElement) continue;
    if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || (!el.getClientRects().length)) continue;
    if (el.closest('.hp,.visually-hidden')) continue;
    const s = parseFloat(cs.fontSize);
    if (s < minFont) { minFont = s; minEl = el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0]; }
  }
  const cols = getComputedStyle(document.querySelector('.weave-hero__content')).gridTemplateColumns.split(' ').length;
  return {
    vw: de.clientWidth, pageOverflowX: de.scrollWidth > de.clientWidth, scrollW: de.scrollWidth,
    heroCols: cols, webW: wr ? Math.round(wr.width) : null, labelPx,
    flowCardsOutsidePanel: outside, flowCardW: cards.length ? Math.round(cards[0].width) : null,
    headerH: hdr ? Math.round(r(hdr).height) : null,
    stepsCols: getComputedStyle(document.querySelector('.steps')).gridTemplateColumns.split(' ').length,
    minHtmlFontPx: minFont, minHtmlFontEl: minEl,
  };
})()
