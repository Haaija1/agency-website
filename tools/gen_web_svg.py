#!/usr/bin/env python3
"""Freeze the Weave app's network view into a static inline SVG, plus its CSS-only hover rules.

Geometry is copied from apps/web/src/components/NetworkView.tsx in the Weave app repo
(GitHub/weave), read in full on 2026-09-30:
  radius = min(width, height) * 0.34
  guide rings at radius * [0.5, 1, 1.3]; 12 spokes of length radius * 1.3, the first at 12 o'clock
  the owner sits at the centre (dot r 7); everyone else is a dot of r 5
  label starts 7 px beyond the dot and faces outward (left-hand nodes are right-aligned)
  thread = quadratic curve; control point pushed sideways by 0.08 x the chord
  thread width = 0.8 + 0.5 x strength (strength is an integer 1..10 in the app)
  hover: other nodes fade to 0.3, other threads to 0.35, the hovered node's threads turn ink-3,
  its halo (r + 7, accent colour) appears
The app runs a live d3-force simulation. Here the layout is frozen at the positions the simulation
settled on in the app's own screenshot (GitHub/weave/.shots/network3.png), so the public site needs
no JavaScript for it.

usage: python gen_web_svg.py           print the <svg> markup
       python gen_web_svg.py --css     print the hover rules (paste inside the site stylesheet)
"""
import math
import sys

W, H = 600, 520
CX, CY = W / 2, H / 2
R = min(W, H) * 0.34
RINGS = (0.5, 1, 1.3)
SPOKES = 12
BEND = 0.08

# id, label, angle in degrees (0 = 3 o'clock, clockwise), distance as a fraction of R, halo accent
PEOPLE = [
    ("owner", "Owner", None, 0.0, "slate"),
    ("finance", "Finance", -59.5, 0.88, "indigo"),
    ("support", "Support", -24.6, 0.98, "teal"),
    ("fulfilment", "Fulfilment", 42.0, 1.10, "amber"),
    ("operations", "Operations", 102.4, 0.945, "rose"),
    ("marketing", "Marketing", 137.8, 0.956, "violet"),
    ("sales", "Sales", 209.4, 0.88, "sky"),
    ("design", "Design", 234.6, 0.865, "lime"),
]

# who works with whom, and how closely (strength 1..3 here)
LINKS = [
    ("owner", "design", 2),
    ("owner", "sales", 3),
    ("owner", "operations", 3),
    ("sales", "finance", 1),
    ("sales", "support", 2),
    ("sales", "marketing", 2),
    ("design", "marketing", 1),
    ("design", "operations", 1),
    ("finance", "operations", 2),
    ("support", "fulfilment", 1),
    ("operations", "fulfilment", 3),
]


def _r(v):
    s = f"{v:.1f}"
    return s[:-2] if s.endswith(".0") else s


def positions():
    pos = {}
    for pid, _label, angle, dist, _accent in PEOPLE:
        if angle is None:
            pos[pid] = (CX, CY)
        else:
            a = math.radians(angle)
            pos[pid] = (CX + math.cos(a) * dist * R, CY + math.sin(a) * dist * R)
    return pos


def neighbours():
    nb = {pid: [] for pid, *_ in PEOPLE}
    for a, b, _s in LINKS:
        nb[a].append(b)
        nb[b].append(a)
    return nb


def label_width(label):
    # app: longest = max(name.length, role.length + 12); width = min(220, 8 + longest * 6.8)
    return min(220.0, 8 + max(len(label), 12) * 6.8)


def svg():
    pos = positions()
    nb = neighbours()
    roles = ", ".join(l for _i, l, *_ in PEOPLE if l != "Owner")
    out = []
    out.append(f'<svg class="web" viewBox="0 0 {W} {H}" role="img" aria-labelledby="web-t web-d">')
    out.append('  <title id="web-t">Your business as a web of people</title>')
    out.append(
        f'  <desc id="web-d">An owner in the centre, joined by thin curved threads to the teams they work with: {roles}. '
        "Teams that work closely together are joined by thicker threads.</desc>"
    )
    out.append('  <g class="guides">')
    for f in RINGS:
        out.append(f'    <circle cx="{_r(CX)}" cy="{_r(CY)}" r="{_r(R * f)}"/>')
    for i in range(SPOKES):
        a = i / SPOKES * math.tau - math.pi / 2
        out.append(
            f'    <line x1="{_r(CX)}" y1="{_r(CY)}" x2="{_r(CX + math.cos(a) * R * 1.3)}" y2="{_r(CY + math.sin(a) * R * 1.3)}"/>'
        )
    out.append("  </g>")
    out.append('  <g class="links">')
    for i, (a, b, s) in enumerate(LINKS):
        (ax, ay), (bx, by) = pos[a], pos[b]
        mx, my = (ax + bx) / 2, (ay + by) / 2
        dx, dy = bx - ax, by - ay
        qx, qy = mx - dy * BEND, my + dx * BEND
        out.append(
            f'    <path class="link" pathLength="1" data-ends="w-{a} w-{b}" style="--i:{i}" '
            f'stroke-width="{_r(0.8 + s * 0.5)}" d="M{_r(ax)},{_r(ay)} Q{_r(qx)},{_r(qy)} {_r(bx)},{_r(by)}"/>'
        )
    out.append("  </g>")
    out.append('  <g class="nodes">')
    for i, (pid, label, _angle, _dist, accent) in enumerate(PEOPLE):
        x, y = pos[pid]
        centre = pid == "owner"
        r = 7 if centre else 5
        left = (not centre) and x < CX
        lx = -(r + 7) if left else r + 7
        anchor = "end" if left else "start"
        lw = label_width(label)
        rect_x = -(r + 7) - lw if left else 0
        nbs = " ".join(f"w-{n}" for n in nb[pid])
        out.append(f'    <g class="node" id="w-{pid}" data-nb="{nbs}" style="--i:{i}" transform="translate({_r(x)},{_r(y)})">')
        out.append('      <circle class="hit" r="22"/>')
        out.append(f'      <rect class="hit" x="{_r(rect_x)}" y="-12" width="{_r(lw + r + 7)}" height="32"/>')
        out.append(f'      <circle class="halo" r="{r + 7}" style="stroke:var(--accent-{accent})"/>')
        out.append(f'      <circle class="dot" r="{r}"/>')
        out.append(f'      <text class="node-name" x="{lx}" y="4" text-anchor="{anchor}">{label}</text>')
        out.append("    </g>")
    out.append("  </g>")
    out.append("</svg>")
    return "\n".join(out)


def hover_css():
    """CSS-only version of the app's hover behaviour. Needs :has() (Baseline since Dec 2023)."""
    lines = ["@media (hover: hover) and (pointer: fine) {", "  .web .node:hover .halo { opacity: 1; }"]
    for pid, *_ in PEOPLE:
        n = f"w-{pid}"
        lines.append(f'  .web:has(#{n}:hover) .link:not([data-ends~="{n}"]) {{ opacity: 0.35; }}')
        lines.append(f'  .web:has(#{n}:hover) .link[data-ends~="{n}"] {{ stroke: var(--ink-3); }}')
        lines.append(f'  .web:has(#{n}:hover) .node:not(#{n}):not([data-nb~="{n}"]) {{ opacity: 0.3; }}')
    lines.append("}")
    return "\n".join(lines)


if __name__ == "__main__":
    print(hover_css() if "--css" in sys.argv else svg())
