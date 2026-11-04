"""Well-formedness check for every .svg and .xml file in the repo.

Why this exists: a browser parses an SVG loaded through <link rel="icon">, <img> or og:image
with the strict XML parser, not the forgiving HTML one. An XML comment may not contain the
two-character sequence that opens and closes it, so a comment mentioning a CSS custom property
by its literal name silently makes the file unparseable and the icon or share image fails to
load. Nothing else in the repo catches that.

usage: python tools/check_xml.py            from the repo root; checks the whole tree
       python tools/check_xml.py <folder>   checks one folder instead

Skips node_modules/, dist/ (generated) and prototypes/**/shots/ (screenshots only).
Prints one line per file, then an explicit "xml: all well-formed" line.
Exit status: 0 if every file parsed, 1 if any file failed, 2 on a usage error.
"""
import os
import sys
import xml.etree.ElementTree as ET

SKIP_DIRS = {"node_modules", "dist", ".git", "shots"}
EXTS = (".svg", ".xml")


def files(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS)
        for name in sorted(filenames):
            if name.lower().endswith(EXTS):
                yield os.path.join(dirpath, name)


def main(argv):
    root = argv[1] if len(argv) > 1 else "."
    if not os.path.isdir(root):
        print("usage: python tools/check_xml.py [folder]", file=sys.stderr)
        return 2
    found = bad = 0
    for path in files(root):
        found += 1
        rel = os.path.relpath(path, root)
        try:
            ET.parse(path)
        except ET.ParseError as exc:
            bad += 1
            print("FAIL  {}: {}".format(rel, exc))
        else:
            print("ok    {}".format(rel))
    if found == 0:
        print("xml: no .svg or .xml files found under {}".format(root))
        return 1
    if bad:
        print("xml: {} of {} file(s) are NOT well-formed".format(bad, found))
        return 1
    print("xml: all well-formed ({} files)".format(found))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
