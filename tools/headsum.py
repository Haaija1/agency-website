"""Sum real transfer bytes for a Resource Timing dump.

Resource Timing reports transferSize=0 for cross-origin assets that lack a
Timing-Allow-Origin header, so a plain performance.getEntriesByType('resource')
total UNDERCOUNTS. This script HEADs those URLs to recover Content-Length.

usage: python headsum.py dump.json
dump.json = list of [name, initiatorType, transferSize, encodedBodySize, decodedBodySize]
"""
import json, sys, re, concurrent.futures as cf, urllib.request

rows = json.load(open(sys.argv[1], encoding="utf-8"))

def kind(u):
    u = u.split("?")[0].lower()
    if re.search(r"\.(js|mjs)$", u): return "js"
    if re.search(r"\.(png|jpe?g|webp|avif|gif|svg|ktx2)$", u): return "img"
    if re.search(r"\.(mp4|webm|m3u8|ts)$", u): return "video"
    if re.search(r"\.(glb|gltf|bin|drc|riv|json|lottie|wasm)$", u): return "3d/data"
    if re.search(r"\.(woff2?|ttf|otf)$", u): return "font"
    if re.search(r"\.css$", u): return "css"
    return "other"

def head(u):
    try:
        req = urllib.request.Request(u, method="HEAD", headers={"User-Agent": "Mozilla/5.0", "Accept-Encoding": "identity"})
        with urllib.request.urlopen(req, timeout=25) as r:
            return int(r.headers.get("Content-Length") or 0)
    except Exception:
        return -1

known = 0; by = {}; unknown = []
for name, init, ts, enc, dec in rows:
    if name.startswith("data:") or name.startswith("blob:"):
        continue
    size = ts or enc
    if size:
        known += size; by[kind(name)] = by.get(kind(name), 0) + size
    else:
        unknown.append(name)

recovered = 0; failed = 0
if unknown:
    with cf.ThreadPoolExecutor(12) as ex:
        for u, n in zip(unknown, ex.map(head, unknown)):
            if n > 0:
                recovered += n; by[kind(u)] = by.get(kind(u), 0) + n
            else:
                failed += 1

total = known + recovered
print(f"requests: {len(rows)}  | measured by Resource Timing: {known/1e6:.2f} MB | cross-origin recovered via HEAD: {recovered/1e6:.2f} MB ({len(unknown)} urls, {failed} unreadable)")
print(f"TOTAL >= {total/1e6:.2f} MB   (compressed-on-wire where servers gzip/br; HEAD sizes are Content-Length so may be compressed size)")
print("by type (MB):", {k: round(v/1e6, 2) for k, v in sorted(by.items(), key=lambda kv: -kv[1])})
