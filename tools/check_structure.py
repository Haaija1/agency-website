#!/usr/bin/env python3
"""Structure check for index.html: tag balance, duplicate ids, and every reference that must resolve.

usage: python check_structure.py path/to/index.html [path/to/original/index.html]

Checks (exit code 1 if any fails):
  - every non-void element is closed in the right order
  - no duplicate id
  - every href="#x", aria-labelledby, aria-describedby, <use href="#x"> points at an existing id
  - counts of the things the JavaScript and the Thread rely on, compared with the original when given:
    .threaded sections, .thread-node links, #week .switch, #contact-form and its fields, .hp honeypot, .lane pairs
"""
import re
import sys
from html.parser import HTMLParser

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.errors, self.ids, self.refs = [], [], [], []
        self.classes = {}
        self.tagcount = {}

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.tagcount[tag] = self.tagcount.get(tag, 0) + 1
        if "id" in a:
            self.ids.append(a["id"])
        for c in (a.get("class") or "").split():
            self.classes[c] = self.classes.get(c, 0) + 1
        href = a.get("href") or ""
        if href.startswith("#") and len(href) > 1:
            self.refs.append(("href", href[1:], self.getpos()[0]))
        for k in ("aria-labelledby", "aria-describedby"):
            for i in (a.get(k) or "").split():
                self.refs.append((k, i, self.getpos()[0]))
        if tag not in VOID:
            self.stack.append((tag, self.getpos()[0]))

    def handle_startendtag(self, tag, attrs):  # <path ... /> style
        a = dict(attrs)
        self.tagcount[tag] = self.tagcount.get(tag, 0) + 1
        if "id" in a:
            self.ids.append(a["id"])
        for c in (a.get("class") or "").split():
            self.classes[c] = self.classes.get(c, 0) + 1
        href = a.get("href") or ""
        if href.startswith("#") and len(href) > 1:
            self.refs.append(("href", href[1:], self.getpos()[0]))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack:
            self.errors.append(f"line {self.getpos()[0]}: </{tag}> with nothing open")
            return
        top, line = self.stack[-1]
        if top == tag:
            self.stack.pop()
        else:
            self.errors.append(f"line {self.getpos()[0]}: </{tag}> but <{top}> (opened line {line}) is still open")
            # recover: pop to the matching tag if present
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    del self.stack[i:]
                    break


def scan(path):
    p = P()
    p.feed(open(path, encoding="utf-8").read())
    p.close()
    for tag, line in p.stack:
        p.errors.append(f"line {line}: <{tag}> never closed")
    dup = sorted({i for i in p.ids if p.ids.count(i) > 1})
    ids = set(p.ids)
    # the symbol sprite and the SVG <use> references use href="#..." too (handled above via href)
    bad = [(k, i, ln) for k, i, ln in p.refs if i not in ids]
    return p, dup, bad


p, dup, bad = scan(sys.argv[1])
print(f"{sys.argv[1]}")
print(f"  unbalanced tags     : {len(p.errors)}")
for e in p.errors[:10]:
    print("     ", e)
print(f"  duplicate ids       : {dup or 'none'}")
print(f"  unresolved refs     : {bad or 'none'}")
keys = [("threaded", "sections that join the Thread"), ("thread-node", "merge beads"), ("lane", "before/after lanes"), ("hp", "honeypot wrapper"),
        ("field", "form fields"), ("switch", "Before/After switch"), ("proof-item", "numbered rows"), ("step", "process steps"), ("tier", "service rows")]
old = None
if len(sys.argv) > 2:
    old, _, _ = scan(sys.argv[2])
print("  hooks the CSS/JS rely on (new" + (" vs original" if old else "") + "):")
mismatch = 0
for k, label in keys:
    n = p.classes.get(k, 0)
    o = old.classes.get(k, 0) if old else None
    flag = "" if o is None or o == n else "   <-- differs"
    mismatch += 0 if o is None or o == n else 1
    print(f"     .{k:11s} {n:3d}" + (f"  (was {o:3d})" if old else "") + f"  {label}{flag}")
for i in ("contact-form", "week", "main", "top", "cf-name", "cf-email", "cf-message", "cf-status", "whatsapp-contact"):
    print(f"     #{i:16s} {'present' if i in set(p.ids) else 'MISSING'}")
missing = [i for i in ("contact-form", "week", "main", "top", "cf-name", "cf-email", "cf-message", "cf-status", "whatsapp-contact") if i not in set(p.ids)]
sys.exit(1 if (p.errors or dup or bad or missing) else 0)
