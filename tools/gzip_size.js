// gzip_size.js: gzipped bytes of a site folder's html/css/js (level 9), against the 40,960 B budget in performance-budget.md.
// Usage: node gzip_size.js <folder>
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const dir = process.argv[2];
if (!dir) { console.error('usage: node gzip_size.js <folder>'); process.exit(2); }
const BUDGET = 40960;
let total = 0;
for (const f of fs.readdirSync(dir).sort()) {
  if (!/\.(html|css|js)$/.test(f)) continue;
  const raw = fs.readFileSync(path.join(dir, f));
  const gz = zlib.gzipSync(raw, { level: 9 }).length;
  total += gz;
  console.log(f.padEnd(22), String(raw.length).padStart(7), 'B raw', String(gz).padStart(7), 'B gzip');
}
console.log('TOTAL'.padEnd(22), ''.padStart(7), '     ', String(total).padStart(7), 'B gzip', '| budget', BUDGET, '| headroom', BUDGET - total);
