/* ==========================================================================
   check.js  -  the browser run for this prototype. Not shipped; a dev tool.

   Usage, from the repo root:
     node prototypes/before-after/check.js

   What it does
     - opens prototypes/before-after/index.html in headless Chromium (the one already in
       the image; nothing is downloaded)
     - at 1440 and 390 px wide, holds the morph at progress 0, 0.3, 0.5, 0.7 and 1 and runs
       check-text-clear.js at each one. Progress 0 and 1 are the resting states and must be
       clean; the three in between are reported so a transient is visible rather than hidden.
     - runs a NEGATIVE CONTROL: it drags one thread straight through a label and checks that
       the checker reports it. A checker that cannot fail proves nothing.
     - checks there is no sideways scroll at 390 px
     - checks no request leaves the page's own two directories
     - writes PNGs to prototypes/before-after/shots/
   Exit code 1 if a resting state is dirty, the control does not fire, the page scrolls
   sideways, or a third-party request is seen.
   ========================================================================== */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const SHOTS = path.join(DIR, 'shots');
const URL = 'file://' + path.join(DIR, 'index.html');
const CHECK = fs.readFileSync(path.join(DIR, 'check-text-clear.js'), 'utf8');
/* 0 and 1 are the two resting states; the rest walk the morph, including the two moments
   where a set of labels is half faded (0.2 and 0.8). All of them must come back clean. */
const STOPS = [0, 0.1, 0.2, 0.23, 0.3, 0.5, 0.7, 0.78, 0.8, 0.9, 1];

let bad = 0;
const fail = (m) => { bad++; console.log('  FAIL ' + m); };

async function run() {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const requests = [];

  for (const vp of [{ w: 1440, h: 900, tag: '1440' }, { w: 390, h: 844, tag: '390' }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.on('request', (r) => requests.push(r.url()));
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(400);

    const wide = await page.evaluate(() => !!(window.BA && window.BA.wide()));
    console.log(`\n== ${vp.w}x${vp.h} == layout: ${wide ? 'wide' : 'narrow'}`);

    for (const p of STOPS) {
      await page.evaluate((v) => window.BA.set(v), p);
      await page.waitForTimeout(120);
      const r = await page.evaluate(CHECK);
      console.log(
        `  p=${String(p).padEnd(4)} paths ${String(r.paths).padStart(2)}  samples ${String(r.samples).padStart(5)}` +
        `  text rects ${String(r.textRects).padStart(3)}  box rects ${String(r.boxRects).padStart(2)}  hits ${r.hits}`
      );
      if (r.samples < 150) fail(`only ${r.samples} samples at p=${p}: the threads did not draw`);
      if (r.hits) fail(`${r.hits} crossing(s) at p=${p}: ` + JSON.stringify(r.first));
    }

    /* negative control: push one thread across a label and make sure the checker sees it */
    await page.evaluate((v) => window.BA.set(v), 0);
    await page.waitForTimeout(80);
    const ctl = await page.evaluate((src) => {
      const box = document.querySelector('[data-ba-panel="0"] .ba-box:nth-child(6)');
      const stage = document.querySelector('[data-ba-stage]');
      const o = stage.getBoundingClientRect(), b = box.getBoundingClientRect();
      const x0 = b.left - o.left - 10, x1 = b.right - o.left + 10, y = (b.top + b.bottom) / 2 - o.top;
      const p = document.querySelector('svg.ba-web path');
      const keep = p.getAttribute('d');
      p.setAttribute('d', `M${x0} ${y} L${x1} ${y}`);
      const dirty = eval(src);
      p.setAttribute('d', keep);
      const clean = eval(src);
      return { dirty: dirty.hits, clean: clean.hits };
    }, CHECK);
    console.log(`  negative control: thread dragged across a label -> hits ${ctl.dirty}; put back -> hits ${ctl.clean}`);
    if (!ctl.dirty) fail('negative control did not fire: the checker cannot detect a crossing');
    if (ctl.clean) fail('page did not come back clean after the control');

    /* sideways scroll */
    const sx = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth
    }));
    console.log(`  scrollWidth ${sx.sw} vs clientWidth ${sx.cw}`);
    if (sx.sw > sx.cw + 1) fail(`sideways scroll of ${sx.sw - sx.cw} px at ${vp.w} px`);

    /* shots at rest */
    for (const [p, name] of [[0, 'before'], [1, 'after']]) {
      await page.evaluate((v) => window.BA.set(v), p);
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(SHOTS, `${vp.tag}-${name}.png`), fullPage: true });
    }
    /* mid-morph, and the reduced-motion and no-JS states */
    await page.evaluate(() => window.BA.set(0.5));
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(SHOTS, `${vp.tag}-merging.png`), fullPage: true });
    await ctx.close();

    for (const [mode, opts, name] of [
      ['reduced motion', { reducedMotion: 'reduce' }, 'reduced-motion'],
      ['no JS', { javaScriptEnabled: false }, 'no-js']
    ]) {
      const c2 = await browser.newContext(Object.assign({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2 }, opts));
      const p2 = await c2.newPage();
      p2.on('request', (r) => requests.push(r.url()));
      await p2.goto(URL, { waitUntil: 'load' });
      await p2.waitForTimeout(300);
      const s2 = await p2.evaluate(() => ({
        sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
        panels: document.querySelectorAll('[data-ba-panel]').length,
        steps: document.querySelectorAll('.ba-box').length,
        js: document.documentElement.classList.contains('ba-js')
      }));
      console.log(`  ${mode}: ba-js=${s2.js} panels=${s2.panels} boxes=${s2.steps} scrollWidth ${s2.sw}/${s2.cw}`);
      if (s2.steps !== 19) fail(`${mode}: ${s2.steps} boxes, expected 19`);
      if (s2.sw > s2.cw + 1) fail(`${mode}: sideways scroll of ${s2.sw - s2.cw} px`);
      await p2.screenshot({ path: path.join(SHOTS, `${vp.tag}-${name}.png`), fullPage: true });
      await c2.close();
    }
  }

  await browser.close();

  const outside = [...new Set(requests)].filter((u) => !u.startsWith('file://' + path.dirname(DIR)) &&
    !u.startsWith('file://' + path.resolve(DIR, '../..')));
  console.log('\nrequests made: ' + new Set(requests).size + ' , all local: ' + (outside.length === 0));
  if (outside.length) fail('requests left the repo: ' + outside.join(', '));

  console.log('\nshots: ' + fs.readdirSync(SHOTS).sort().join(', '));
  console.log(bad === 0 ? '\nbefore-after prototype: all checks passed' : `\nbefore-after prototype: ${bad} FAILED`);
  process.exit(bad ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(1); });
