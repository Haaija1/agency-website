"""Print a variable font's axes, named instances and OpenType features.

usage: python fvar.py            (needs `pip install fonttools brotli` and SolareVF.woff2 in the working directory)
The font is licensed; download it locally from the site to inspect it and do not commit it.
"""
from fontTools.ttLib import TTFont
f = TTFont('SolareVF.woff2')
nm = f['name']
print("glyphs:", len(f.getGlyphOrder()), "| unitsPerEm:", f['head'].unitsPerEm)
print("fvar axes:")
for a in f['fvar'].axes:
    print(f"  {a.axisTag!r:8} min={a.minValue:>6} default={a.defaultValue:>6} max={a.maxValue:>6}  name={nm.getDebugName(a.axisNameID)!r}")
print("named instances:", len(f['fvar'].instances), [nm.getDebugName(i.subfamilyNameID) for i in f['fvar'].instances][:16])
if 'GSUB' in f:
    print("GSUB features:", sorted({fr.FeatureTag for fr in f['GSUB'].table.FeatureList.FeatureRecord}))
print("family/copyright:", nm.getDebugName(1), "|", (nm.getDebugName(0) or '')[:80])
