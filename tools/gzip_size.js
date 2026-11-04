// gzip_size.js: gzipped bytes of a site folder's html/css/js (level 9), against the 40,960 B budget.
//
// Usage: node gzip_size.js <folder>            every .html/.css/.js in the folder, informational
//        node gzip_size.js <folder> --site     ONLY the seven home-page files, against the budget
//
// --site is the one that matters. The 40,960 B budget is what a visitor downloads to see the
// home page, and no home-page visitor downloads privacy.html or 404.html. Since those pages
// landed in dist/, the plain whole-folder total measures a set the budget was never written
// for and reports a failure that is not one. See docs/DEPLOY-ALLOWLIST.md §5.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const args = process.argv.slice(2);
const siteOnly = args.includes('--site');
const dir = args.filter((a) => !a.startsWith('--'))[0];
if (!dir) { console.error('usage: node gzip_size.js <folder> [--site]'); process.exit(2); }
const BUDGET = 40960;

// The seven files the home page loads: the document, the one stylesheet, the five scripts.
const SITE = ['index.html', 'styles.css', 'site.js', 'motion.js', 'examples.js', 'explorer.js', 'grow.js'];

let names;
if (siteOnly) {
  names = SITE;
  const missing = SITE.filter((f) => !fs.existsSync(path.join(dir, f)));
  if (missing.length) {
    console.error('missing from ' + dir + ': ' + missing.join(', ') + ' - run node tools/build_dist.js . first');
    process.exit(2);
  }
} else {
  names = fs.readdirSync(dir).sort().filter((f) => /\.(html|css|js)$/.test(f));
}

let total = 0;
for (const f of names) {
  const raw = fs.readFileSync(path.join(dir, f));
  const gz = zlib.gzipSync(raw, { level: 9 }).length;
  total += gz;
  console.log(f.padEnd(22), String(raw.length).padStart(7), 'B raw', String(gz).padStart(7), 'B gzip');
}

if (siteOnly) {
  console.log('TOTAL (7 home-page files)'.padEnd(22), ''.padStart(7), '     ', String(total).padStart(7), 'B gzip',
    '| budget', BUDGET, '| headroom', BUDGET - total);
  console.log(total <= BUDGET ? 'site budget: PASS' : 'site budget: FAIL');
  process.exit(total <= BUDGET ? 0 : 1);
}

console.log('TOTAL'.padEnd(22), ''.padStart(7), '     ', String(total).padStart(7), 'B gzip',
  '| ' + names.length + ' files, informational only');
console.log('The 40,960 B budget applies to the seven home-page files: run with --site.');
