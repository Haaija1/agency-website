"""HEAD-check the known asset paths of casadisolare.com (frames, WebGL, videos, models, textures) and estimate page weight.

usage: python measure.py
Network required. Sends only HEAD requests. Content-Length may be the compressed size.
"""
import re, json, concurrent.futures as cf, urllib.request
BASE="https://casadisolare.com"
def head(path):
    req=urllib.request.Request(BASE+path, method="HEAD", headers={"User-Agent":"Mozilla/5.0","Accept-Encoding":"identity"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return path, int(r.headers.get("Content-Length") or 0), r.status
    except Exception as e:
        return path, 0, str(e)[:40]
paths_desktop=[f"/scene/frame-{i}.jpg" for i in range(1,241)]
paths_mobile=[f"/scene/mobile/frame-{i}.jpg" for i in range(1,181)]
other=["/webgl.js","/book.mp4","/foot.mp4","/circle-scroll-svg.riv","/grain.jpg","/person.jpg"]
other+= [f"/webgl/models/{m}.glb" for m in "backplate floor pillars rock-left roof rock-right sand sun water water-surround".split()]
other+= [f"/webgl/textures/{t}" for t in "water-normal.png matcap-01.png desert-backplate.jpg sand.jpg rock-left.jpg rock-right.jpg water-surround.jpg roof.jpg pillars.png floor.jpg".split()]
with cf.ThreadPoolExecutor(16) as ex:
    D=list(ex.map(head,paths_desktop)); M=list(ex.map(head,paths_mobile)); O=list(ex.map(head,other))
def stat(name,L):
    ok=[s for p,s,st in L if st==200]; bad=[(p,st) for p,s,st in L if st!=200]
    print(f"{name}: {len(ok)}/{len(L)} ok, total {sum(ok)/1e6:.1f} MB, avg {sum(ok)/max(1,len(ok))/1e3:.0f} KB, bad={bad[:3]}")
    return sum(ok)
d=stat("desktop frames (/scene, 240)",D); m=stat("mobile frames (/scene/mobile, 180)",M); o=stat("webgl+media+other",O)
print("other breakdown:", {p:round(s/1e3) for p,s,st in O if s>150_000})
print(f"DESKTOP est. = frames {d/1e6:.1f} + other {o/1e6:.1f} + JS chunks ~0.78 + fonts ~0.53 => ~{(d+o)/1e6+1.3:.0f} MB")
print(f"MOBILE  est. = frames {m/1e6:.1f} + other {o/1e6:.1f} (if webgl also loads) => ~{(m+o)/1e6+1.3:.0f} MB")
