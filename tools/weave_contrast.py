#!/usr/bin/env python3
"""WCAG 2.x contrast table for a Weave-style token set.

usage: python weave_contrast.py [path/to/tokens-or-stylesheet.css]
       (default: ../weave-look/weave-look.css, next to this tools folder)

Reads literal hex custom properties (--ink: #1a1a1a;) and one level of var() aliases
(--control-border: var(--ink-3);). Exit code 1 if a required pair is below its threshold, so it
can run in a check script after tokens are changed.
"""
import os
import re
import sys

path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "weave-look", "weave-look.css")
src = open(path, encoding="utf-8").read()
raw = dict(re.findall(r"--([a-z0-9-]+):\s*([^;]+);", src))
tok = {}
for k, v in raw.items():
    v = v.strip()
    m = re.fullmatch(r"var\(--([a-z0-9-]+)\)", v)
    if m and m.group(1) in raw:
        v = raw[m.group(1)].strip()
    if re.fullmatch(r"#[0-9a-fA-F]{6}", v):
        tok[k] = v


def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def lum(h):
    h = h.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def ratio(a, b):
    x, y = lum(a), lum(b)
    return (max(x, y) + 0.05) / (min(x, y) + 0.05)


# (label, foreground token or hex, background token or hex, minimum ratio, why)
CHECKS = [
    ("body text", "ink", "bg", 4.5, "text"),
    ("secondary text", "ink-2", "bg", 4.5, "text"),
    ("secondary text on subtle band", "ink-2", "bg-subtle", 4.5, "text"),
    ("muted text (site)", "ink-muted", "bg", 4.5, "text"),
    ("muted text on subtle band", "ink-muted", "bg-subtle", 4.5, "text"),
    ("muted text on muted tint", "ink-muted", "bg-muted", 4.5, "text"),
    ("muted text on hover tint", "ink-muted", "bg-hover", 4.5, "text"),
    ("primary button text", "primary-ink", "primary", 4.5, "text"),
    ("primary button hover", "#ffffff", "#333333", 4.5, "text"),
    ("No AI pill", "deterministic", "deterministic-bg", 4.5, "text"),
    ("AI pill", "agentic", "agentic-bg", 4.5, "text"),
    ("ok text (site)", "ok-text", "ok-bg", 4.5, "text"),
    ("warn text (site)", "warn-text", "warn-bg", 4.5, "text"),
    ("bad text (site)", "bad-text", "bad-bg", 4.5, "text"),
    ("running text (site)", "running-text", "running-bg", 4.5, "text"),
    ("form-field border (site)", "control-border", "bg", 3.0, "UI"),
    ("focus outline", "ink", "bg", 3.0, "UI"),
    ("workflow edge and handles (site)", "ink-3", "bg", 3.0, "UI"),
]
INFO = [  # not required to pass; shown so nobody uses them by mistake
    ("APP ink-3 as text", "ink-3", "bg", 4.5),
    ("APP ink-4 as text", "ink-4", "bg", 4.5),
    ("APP line-strong as field border", "line-strong", "bg", 3.0),
    ("APP focus ring (18% ink)", "#d1d1d1", "bg", 3.0),
    ("APP ok text", "ok", "ok-bg", 4.5),
    ("APP warn text", "warn", "warn-bg", 4.5),
    ("APP bad text", "bad", "bad-bg", 4.5),
    ("APP running text", "running", "running-bg", 4.5),
    ("APP skipped text", "skipped", "skipped-bg", 4.5),
]
get = lambda k: tok.get(k, k)
bad = 0
print(f"tokens read: {len(tok)} from {os.path.normpath(path)}\n")
print("REQUIRED on the site")
for label, fg, bg, need, _kind in CHECKS:
    if get(fg) not in tok.values() and not get(fg).startswith("#"):
        print(f"  ??    {label:36s} missing token {fg}")
        bad += 1
        continue
    r = ratio(get(fg), get(bg))
    ok = r >= need
    bad += not ok
    print(f"  {'PASS' if ok else 'FAIL'}  {label:36s} {r:5.2f}:1  (need {need})")
print("\nFor information: app values that do NOT meet the site's bar")
for label, fg, bg, need in INFO:
    r = ratio(get(fg), get(bg))
    print(f"  {'ok  ' if r >= need else 'below'} {label:36s} {r:5.2f}:1  (need {need})")
sys.exit(1 if bad else 0)
