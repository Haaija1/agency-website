"""WCAG 2.x contrast ratios.

usage: python contrast.py                       prints the Solare pairs quoted in docs/site-teardown.md (Appendix C.2)
       python contrast.py "#563E3B" "#ECE4D5"   one pair
"""
import sys


def lum(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda v: v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = map(f, c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


PAIRS = [
    ("ink on page", "#563E3B", "#ECE4D5"),
    ("ink on card", "#563E3B", "#F3EBDA"),
    ("amber on page", "#FFAF37", "#ECE4D5"),
    ("amber on card", "#FFAF37", "#F3EBDA"),
    ("ink on amber", "#563E3B", "#FFAF37"),
    ("white on amber", "#FFFFFF", "#FFAF37"),
    ("white on footer slate", "#FFFFFF", "#414648"),
]

if __name__ == "__main__":
    if len(sys.argv) == 3:
        print(f"{ratio(sys.argv[1], sys.argv[2]):.2f}:1")
    else:
        for name, a, b in PAIRS:
            print(f"{name:24s} {ratio(a, b):5.2f}:1")
