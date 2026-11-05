// build_dist.js: minify a site folder into <folder>/dist (esbuild for js and css; html: comments and blank space between tags only).
// Usage: node build_dist.js <folder>     then: node gzip_size.js <folder>/dist
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const dir = process.argv[2]; if (!dir) { console.error('usage: node build_dist.js <folder>'); process.exit(2); }
const out = path.join(dir, 'dist'); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out);
// Resolve a real esbuild binary and invoke it directly: shell:true would route through
// cmd.exe and paint a visible console window per file (7 flashes per build on Windows).
// shell:false + windowsHide:true passes CREATE_NO_WINDOW, so nothing flashes.
const ESBUILD = (() => {
  const envBin = process.env.ESBUILD_BINARY_PATH;
  if (envBin && fs.existsSync(envBin)) return envBin;
  const cands = [
    path.join(__dirname, '..', 'node_modules', '@esbuild', 'win32-x64', 'esbuild.exe'),
    path.join(__dirname, '..', 'node_modules', 'esbuild', 'bin', 'esbuild'),
  ];
  // npx cache fallback: collect every cached copy, then prefer the HIGHEST version,
  // so we don't silently downgrade vs what `npx --yes esbuild` used to resolve.
  const npxRoot = path.join(process.env.LOCALAPPDATA || '', 'npm-cache', '_npx');
  const cached = [];
  if (fs.existsSync(npxRoot)) {
    for (const d of fs.readdirSync(npxRoot)) {
      const bin = path.join(npxRoot, d, 'node_modules', '@esbuild', 'win32-x64', 'esbuild.exe');
      if (!fs.existsSync(bin)) continue;
      let ver = '0.0.0';
      try {
        const pj = path.join(npxRoot, d, 'node_modules', 'esbuild', 'package.json');
        if (fs.existsSync(pj)) ver = JSON.parse(fs.readFileSync(pj, 'utf8')).version || ver;
      } catch { /* keep 0.0.0 */ }
      cached.push({ bin, ver });
    }
  }
  const key = v => v.split('.').map(n => String(parseInt(n, 10) || 0).padStart(6, '0')).join('.');
  cached.sort((a, b) => key(b.ver).localeCompare(key(a.ver)));
  const hit = cands.find(p => { try { return fs.existsSync(p); } catch { return false; } })
            || (cached[0] && cached[0].bin);
  if (!hit) throw new Error('esbuild not found. Run: npm i -D esbuild (or set ESBUILD_BINARY_PATH)');
  return hit;
})();
const esb = (f, loader) => execFileSync(ESBUILD, [path.join(dir, f), '--minify', '--target=es2018'], { shell: false, windowsHide: true, maxBuffer: 1 << 26 });
for (const f of fs.readdirSync(dir)) {
  if (!fs.statSync(path.join(dir, f)).isFile()) continue;
  if (f.endsWith('.js')) fs.writeFileSync(path.join(out, f), esb(f, 'js'));
  else if (f.endsWith('.css')) fs.writeFileSync(path.join(out, f), esb(f, 'css'));
  else if (f.endsWith('.html')) {
    let h = fs.readFileSync(path.join(dir, f), 'utf8');
    const keep = []; h = h.replace(/<(script|style|pre|textarea)\b[\s\S]*?<\/\1>/gi, m => { keep.push(m); return '\u0000' + (keep.length - 1) + '\u0000'; });
    h = h.replace(/<!--(?!\[if)[\s\S]*?-->/g, '').replace(/>\s+</g, '> <').replace(/\n\s*\n+/g, '\n');
    h = h.replace(/\u0000(\d+)\u0000/g, (_, i) => keep[+i]);
    fs.writeFileSync(path.join(out, f), h);
  }
}
console.log('built', fs.readdirSync(out).join(', '));
