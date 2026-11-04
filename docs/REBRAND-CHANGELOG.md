# Rebrand changelog: Weave -> Business Process Redesign

Phase 1 (session S1) of `docs/REBRAND-BRIEF.md`, sections 3a and 3b. Every string and
identifier that moved is listed below so the diff can be audited line by line.
Line numbers are the **new** ones, in the files as they are after both commits.

- Commit 1 `rebrand: public name` — section 3a (public surfaces)
- Commit 2 `rebrand: internal names` — section 3b (identifiers, file names, comments)

**No LOGIC CHANGE.** `git diff -w` of `grow.js`, `explorer.js`, `motion.js` and
`examples.js` against the originals shows renames only (identifiers, selectors,
comments). Nothing about colours, layout, animation, timing or the router changed.

## Brand constants used

| Constant | Value |
|---|---|
| Display name | `Business Process Redesign` |
| Short name | `BPR` |
| Domain / canonical | `https://bpsra.co.za/` |
| `alternateName` (JSON-LD only) | `Business Process Redesign South Africa` |
| Business email | still `REPLACE_BUSINESS_EMAIL`, card still `hidden` |
| WhatsApp numbers | unchanged; only the pre-filled text changed |

Per the 4 Nov 2026 erratum: the spelling is "Process", "BPR" is approved, and
"BPSRA" = Business Process Redesign South Africa, which appears **only** in the
JSON-LD `alternateName`. The display name, `<title>`, footer and all visible copy
stay "Business Process Redesign". "BPSRA" is never printed as a brand name in copy.

---

## Commit 1 — public surfaces (3a)

### Head: title, meta, social, canonical

| file:line | old | new |
|---|---|---|
| `index.html:8` | `<title>Weave — AI automation for growing businesses</title>` | `<title>Business Process Redesign — AI automation for growing businesses</title>` |
| `index.html:9` | `content="Weave — AI automation for growing businesses. Less repetitive work. More time for the work that matters."` | `content="Business Process Redesign — AI automation for growing businesses. Less repetitive work. More time for the work that matters."` |
| `index.html:11` | *(absent)* | `<link rel="canonical" href="https://bpsra.co.za/">` **added** |
| `index.html:12` | comment: "Add og:url, og:image and `<link rel="canonical">` once the final domain is confirmed" | comment: "og:image is NOT set yet: it needs an absolute URL to a real image file, which session S2 adds." |
| `index.html:14` | `og:site_name` = `Weave` | `og:site_name` = `Business Process Redesign` |
| `index.html:15` | `og:title` = `Weave — AI automation for growing businesses` | `og:title` = `Business Process Redesign — AI automation for growing businesses` |
| `index.html:17` | *(absent)* | `<meta property="og:url" content="https://bpsra.co.za/">` **added** |

`og:description` and `twitter:card` are unchanged (they carry no brand name).
**`og:image` is deliberately still absent**: the brief says not to add it until the
image file exists in the repo. S2 adds it.

### JSON-LD

| file:line | old | new |
|---|---|---|
| `index.html:25` | comment: "Add "url" once the final domain is confirmed." | comment: "alternateName records what BPSRA stands for; the display name stays the short form." |
| `index.html:31` | `"name": "Weave"` | `"name": "Business Process Redesign"` |
| `index.html:32` | *(absent)* | `"alternateName": "Business Process Redesign South Africa"` **added** |
| `index.html:33` | *(absent)* | `"url": "https://bpsra.co.za/"` **added** |
| `index.html:34` | `"description": "AI automation for growing businesses. Weave helps automate repetitive work so teams can focus on what comes next."` | `"description": "AI automation for growing businesses. Business Process Redesign helps automate repetitive work so teams can focus on what comes next."` |

`@context`, `@type` and `telephone` are unchanged.

### Header brand

| file:line | old | new |
|---|---|---|
| `index.html:46` | `<a class="brand" href="#top">` | `<a class="brand" href="#top" aria-label="Business Process Redesign">` |
| `index.html:46` | `<span>Weave</span>` | `<span class="brand-name" aria-hidden="true"><span class="brand-name__full">Business Process Redesign</span><span class="brand-name__short">BPR</span></span>` |
| `styles.css:196-205` | *(absent)* | `.brand-name__short{ display:none; }` and `@media (max-width:768px){ .brand-name__full{ display:none; } .brand-name__short{ display:inline; } }` **added**, with the measurement that chose the breakpoint in a comment |

Why 768 px and not the "<= 480 px" in the brief's constants table: measured in a real
browser, the full name renders **242.6 px** wide and the header row runs out of space
**between 700 px and 640 px**. A 480 px switch would wrap the header between 481 px
and 700 px. 768 px is an existing breakpoint in this stylesheet and leaves 105 px of
slack at 769 px. See "Decisions" below.

The accessible name is the full name at **every** width, because the `aria-label` sits
on the link and both spans are `aria-hidden`. A screen reader never hears "BPR".

### Hero and About copy

| file:line | old | new |
|---|---|---|
| `index.html:64` | `<p class="…__wordmark">weave<span aria-hidden="true">.</span></p>` | `<p class="…__wordmark">bpr<span aria-hidden="true">.</span></p>` |
| `index.html:73` | `… <strong>Your time is better spent moving your business forward.</strong> Weave helps automate repetitive work, so you can focus on what comes next.` | `… <strong>Your time is better spent moving your business forward.</strong> We help automate repetitive work, so you can focus on what comes next.` |
| `index.html:179` | `aria-label="Why Weave section"` | `aria-label="Why we do this section"` |
| `index.html:181` | `<p class="kicker">Why Weave</p>` | `<p class="kicker">Why we do this</p>` |
| `index.html:183` | `… checking the same details twice. Weave connects those steps so your team can spend more time on work that needs their judgement.` | `… checking the same details twice. We connect those steps so your team can spend more time on work that needs their judgement.` |

Meaning unchanged in all three rewrites. No new claim, number, service or promise.
The kicker had to change because the brand name was in it; "Why we do this" is the
minimal wording that matches the aria-label the brief specifies. Alternatives are in
`docs/COPY-PROPOSALS.md` for Haaija to pick from — none of them is applied.

### Thread beads (the W glyph)

| file:line | old | new |
|---|---|---|
| `index.html:179, 194, 229, 301, 412, 522` (6 beads) | `<path pathLength="1" d="M5 9l5 15 6-12 6 12 5-15"/>` | `<path pathLength="1" d="M5 9.5Q12 11 16 15L16 24M27 9.5Q20 11 16 15"/>` |

The old glyph drew a **W**, which spelled the old name. The new one is a merge: two
strokes bend inward and join into one trunk. Deliberately a merge, because merging is
what Haaija likes about this site.

Unchanged so nothing downstream has to move: the same `viewBox="3 7 26 19"`, one
`<path pathLength="1">`, the same bounding box (x 5–27, y 9.5–24 against the old
9–24), the same six beads, the same `.thread-node path` CSS. The draw-in animation
runs on `stroke-dasharray:1` over a normalised length, so the two sub-paths draw in as
one stroke exactly as before. Rendered and checked at bead size (18x14), at 4x, and
mid-draw-in.

| file:line | old | new |
|---|---|---|
| `tools/check_structure.py:92` | `("thread-node", "W beads")` | `("thread-node", "merge beads")` |

(Only the printed label; the check itself is unchanged and still counts 6.)

### Footer and WhatsApp

| file:line | old | new |
|---|---|---|
| `index.html:583` | `<span>© 2026 Weave</span>` | `<span>© 2026 Business Process Redesign</span>` |
| `index.html:558` | `…?text=Hi%20Weave%2C%20I%27d%20like%20to%20discuss%20automating%20a%20workflow.` | `…?text=Hi%2C%20I%27d%20like%20to%20discuss%20automating%20some%20of%20our%20admin%20work.` |
| `index.html:559` | same old text, second number | same new text, second number |

Both `wa.me` numbers are unchanged. The new pre-filled text carries no brand name, so
a later rename never touches it again. Decoded: `Hi, I'd like to discuss automating
some of our admin work.`

### README

`README.md` rewritten. It described a two-branch hero draft, Google Fonts, a dark
palette and a branch-ownership split, none of which is true of this repo any more. It
now describes the one-page site under the new name, what each file is, how to run the
tests (with the "a silent runner is not a pass" warning and the grow baseline), how to
build `dist/`, and the seven-file deploy allow-list. The "no secrets", "no client name
or result", "no third-party requests" and "the hero is Willie's" notes are kept.

Also removed while rewriting, because this repo is public: a client name that was
named in the old copy-guidance section, and two private file paths.

---

## Commit 2 — internal names (3b)

### Files renamed

| old | new |
|---|---|
| `weave-motion.js` | `motion.js` |
| `weave-examples.js` | `examples.js` |
| `weave-explorer.js` | `explorer.js` |
| `weave-grow.js` | `grow.js` |
| `tools/weave_contrast.py` | `tools/site_contrast.py` |

`tools/build_dist.js` needed no change: it globs every `.js`/`.css`/`.html` in the
folder rather than naming files.

### CSS classes and ids

| old | new | where |
|---|---|---|
| `weave-hero` | `hero` | `styles.css` x28, `index.html` x15, `grow.js` x2, `tools/measure_layout.js` x1 |
| `weave-headline` | `hero-headline` | `index.html` x2 (the `<h1>` id and the section's `aria-labelledby`) |

So `.weave-hero__identity` -> `.hero__identity`, `__wordmark`, `__descriptor`,
`__content`, `__text`, `__eyebrow`, `__layout`, `__line`, `__line--accent`, `__intro`,
`__copy`, `__cta`, `__closing` likewise.

**Collision check (the brief flags this):** the existing `.hero-pin` class and
`#hero-pin` id are separate names, not prefixes of `.hero`, so nothing new matches.
There are no substring attribute selectors (`[class*=]`, `[class^=]`) anywhere in the
CSS or JS, and the only two `.weave-hero` lookups in JS were `grow.js:372`
(`pinEl.querySelector('.hero')`) and the `BOX` list at `grow.js:377`
(`.weave-hero__cta` -> `.hero__cta`). Both updated.

### JS globals

| old | new | file:line |
|---|---|---|
| `WEAVE_EXAMPLES` | `SITE_EXAMPLES` | `examples.js:94` (export), `explorer.js:8` (read) |
| `WEAVE_EXPLORER` | `SITE_EXPLORER` | `explorer.js:323` |
| `WEAVE_GROW` | `SITE_GROW` | `grow.js:365` |
| `WEAVE_PAGE` | `SITE_PAGE` | `grow.js:685` |

### Script tags and requires

| file:line | old | new |
|---|---|---|
| `index.html:22` | `<script src="weave-motion.js" defer>` | `<script src="motion.js" defer>` |
| `index.html:23` | `<script src="weave-examples.js" defer>` | `<script src="examples.js" defer>` |
| `index.html:24` | `<script src="weave-explorer.js" defer>` | `<script src="explorer.js" defer>` |
| `index.html:25` | `<script src="weave-grow.js" defer>` | `<script src="grow.js" defer>` |
| `tests/examples.test.js:2, 122` | `require('../weave-examples.js')` | `require('../examples.js')` |
| `tests/grow.test.js:1, 4` | `require('../weave-grow.js')` | `require('../grow.js')` |
| `tests/wf_list.js:4` | `require('../weave-examples.js')` | `require('../examples.js')` |

### Comments

| file:line | old | new |
|---|---|---|
| `index.html:6` | `… weave-grow.js confirms it once the page is measured` | `… grow.js confirms it once the page is measured` |
| `index.html:265` | `… confirmed as Weave's real terms:` | `… confirmed as the business's real terms:` |
| `index.html:298-299` | `weave-explorer.js builds … generated from weave-examples.js` | `explorer.js builds … generated from examples.js` |
| `styles.css:2` | `Weave site: shared stylesheet, "app look".` | `BPR site: shared stylesheet, "app look".` |
| `styles.css:4-11` | header naming the source app, a private repo path and an internal brief | same facts, without the app's name, the repo path or the internal document name (see below) |
| `styles.css:652` | `pairs with weave-motion.js` | `pairs with motion.js` |
| `styles.css:675` | `The web that grows down the page (weave-grow.js)` | `… (grow.js)` |
| `styles.css:690` | `the hero web, bigger (weave-explorer.js)` | `… (explorer.js)` |
| `site.js:1` | `/* Weave site: progressive enhancement only.` | `/* BPR site: progressive enhancement only.` |
| `motion.js:1` | `/* Weave site: motion layer …` | `/* BPR site: motion layer …` |
| `motion.js:3` | `… lives in weave-grow.js` | `… lives in grow.js` |
| `explorer.js:1` | `/* Weave site: "Example workflows". …` | `/* BPR site: "Example workflows". …` |
| `explorer.js:4` | `Numbers come from weave-examples.js` | `Numbers come from examples.js` |
| `grow.js:1` | `/* Weave site: the page web. …` | `/* BPR site: the page web. …` |
| `grow.js:270` | `/* the weave: join twig tips back … */` | `/* the cross-links: join twig tips back … */` |
| `tools/sweep_widths.py:1` | `"""Width sweep for the Weave page web.` | `"""Width sweep for the page web.` |
| `tools/sweep_widths.py:4` | `sweep("file:///C:/.../weave-look/v4/index.html")` | `sweep("file:///path/to/index.html")` |
| `tools/gen_web_svg.py:2, 4, 5, 15` | names the source app, `apps/web/src/components/NetworkView.tsx`, a private repo and a screenshot path | the same geometry notes, without the app name or any private path |
| `tools/site_contrast.py:2` | `"""WCAG 2.x contrast table for a Weave-style token set.` | `"""WCAG 2.x contrast table for this site's token set.` |

### Two renames that are more than a rename

Both are called out because they are not purely cosmetic:

1. **`tools/site_contrast.py:15`** — the default stylesheet path was
   `../weave-look/weave-look.css`, a file that does not exist in this repo, so the tool
   crashed when run with no argument. It now defaults to `../styles.css`, the site's own
   stylesheet, and runs. Behaviour with an explicit path argument is unchanged.
2. **`tests/examples.test.js:119`** — the assertion
   `assert(!/<script[^>]*weave-cards/.test(html), …)` had the old name inside a regex
   literal. It is now `/<script[^>]*hero-cards/`. The page contains neither a
   `weave-cards` nor a `hero-cards` script tag, so the assertion passes for exactly the
   same reason as before, but it is a change to what the test literally matches, not
   just to a name. Flagged here so it is not mistaken for a pure rename.

### Docs

| file:line | old | new |
|---|---|---|
| `docs/V5-SPEC-AND-HANDOFF.md:1` | *(absent)* | `HISTORY: written under the old name Weave. Current names are in docs/REBRAND-CHANGELOG.md.` **added as the first line** |

The rest of that file is untouched: it is history and is meant to keep the old name.

---

## Deliverables commit — docs and dist

- `docs/REBRAND-CHANGELOG.md` (this file).
- `docs/COPY-PROPOSALS.md` — proposals only, nothing applied to the page.
- `dist/` rebuilt with esbuild from the renamed sources. The four `dist/weave-*.js`
  files are gone and `dist/` now holds exactly the seven deploy files:
  `index.html`, `styles.css`, `site.js`, `motion.js`, `examples.js`, `explorer.js`,
  `grow.js`.

---

## Decisions this session made that the brief did not cover

1. **The header switches to `BPR` at <= 768 px, not <= 480 px.** The brief's constants
   table suggests 480 px; its section 3a says "where it would wrap or crowd" and "the
   header must stay ONE row at 320 px". Measured, those two disagree: the full name is
   242.6 px wide and the row runs out between 700 px and 640 px, so a 480 px switch
   would break the one-row rule for every width from 481 px to about 700 px. 768 px is
   an existing breakpoint here and is the first one that is safe. Changing it later is
   one number in `styles.css`.
2. **The footer shows the full name, not `BPR`.** The constants table lists the footer
   under "tight spaces", but section 3a says explicitly `© 2026 Weave` becomes
   `© 2026 Business Process Redesign`. Section 3a wins as the more specific
   instruction. Checked: no horizontal scroll at 320 px.
3. **The header link gained `aria-label="Business Process Redesign"`.** Without it the
   accessible name would become "BPR" on phones. With it, assistive tech hears the full
   name at every width while sighted users see the short one.
4. **The "Why Weave" kicker became "Why we do this".** The brief names the aria-label
   wording but not the visible kicker above it; the kicker had to change because it
   carried the brand name, and this keeps the two consistent. Other options are in
   `docs/COPY-PROPOSALS.md`, unapplied.
5. **JSON-LD `description` uses the full name, not "We".** The brief's "We" rewrite
   covers hero and About copy. Structured data is machine-read and should name the
   business, so it says "Business Process Redesign helps automate repetitive work".
6. **Provenance notes were generalised rather than renamed.** The stylesheet header and
   `tools/gen_web_svg.py` named a private repository, two source paths and an internal
   brief that does not exist in this repo. This repo is public, so those were removed
   rather than rewritten with the new name. The technical content (the geometry
   constants, the APP tags) is untouched.
7. **`CLAUDE.md` keeps one historical "formerly Weave".** The 3d gate lists three files
   that may still contain the word and `CLAUDE.md` is not one of them. It is not a
   shipped file and the mention is the same kind of accurate history as the two docs
   that are allowed, so it was left alone rather than edited on this session's own
   initiative. One `git grep -i` hit, `CLAUDE.md:3`. Trivial to drop if Dave prefers.

## Known pre-existing failure, NOT caused by this work

The 8-width sweep fails at **768 px with 1 thread collision**. The other seven widths
pass with 0 collisions and 0 boxHits on a live web (10k–24k samples), and the negative
control is caught every run.

It is **not** caused by this work. Measured on the unmodified `rebrand/bpsra` tree
before any edit in this session, twice, and on the finished tree afterwards. All runs
report the same single hit at the same place:

```
w= 768  samples=~10,950  collisions=1  boxHits=0  first=[{'kind':'thread','x':71,'y':7414}]
svg class  frame-web      path class  fd          page coords (71, 7467)
text hit   "By hand"      span.lane-tag in section #case-study   padded box [67, 7445, 135, 7468]
```

So it is a **card-frame row divider**, not a branch wandering through copy: one of the
lines `buildFrames()` draws for the Week table grazes the bottom edge of a lane tag's
text box at 768 px, by about 1 px of the 4 px padding the checker adds (the glyphs
themselves are ~3 px clear). `docs/V5-SPEC-AND-HANDOFF.md` already notes that the Week
card's text sits on its border at narrow widths and that the text-collision check
includes `svg.frame-web`; 768 px is just above the 760 px where the card switches back
to its CSS border.

The brief forbids retuning the router, and the fix belongs to whoever owns the frame
layer, so it is reported rather than touched. Full numbers are in the session handoff.

---

# Integration (S4)

Session S4, 4 Nov 2026. S1 renamed the site; S2 added new files without touching
`index.html`; S4 stitches the two together. Branch base: S1
(`claude/bpsra-rebrand-phase-1-g7mtcu`) with S2 (`claude/bpsra-rebrand-s2-wchb2i`) merged
in with `--no-ff`. The merge was clean - S2 adds twelve new files and edits none, so
there was nothing to resolve.

**No copy change and no logic change.** Verified, not asserted: the visible text of
`index.html` was extracted before and after (scripts, styles and comments stripped, tags
removed, whitespace collapsed) and the two are **character-for-character identical**.
`grow.js`, `explorer.js`, `motion.js` and `examples.js` are untouched by this session -
they do not appear in its diff at all. No colour, layout, breakpoint or router change.
`prototypes/` was not touched (it is S3's).

## 1. `index.html` head - the files S2 added now exist, so the head can point at them

| file:line | old | new | why |
|---|---|---|---|
| `index.html:12` | comment: "og:image is NOT set yet: it needs an absolute URL to a real image file, which session S2 adds." | comment: "og:image is the 1200x630 image in the repo root; the width/height pair lets a scraper reserve the card before the file loads." | the comment was a note to the next session and is now false |
| `index.html:18` | *(absent)* | `<meta property="og:image" content="https://bpsra.co.za/og-image.png">` **added** | S2 committed `og-image.png`, so the precondition the brief set (§3a: "do NOT add `og:image` unless the image file exists in the repo") is met |
| `index.html:19` | *(absent)* | `<meta property="og:image:width" content="1200">` **added** | lets a scraper lay the card out before the image arrives |
| `index.html:20` | *(absent)* | `<meta property="og:image:height" content="630">` **added** | as above |
| `index.html:21` | `<meta name="twitter:card" content="summary">` | `<meta name="twitter:card" content="summary_large_image">` | `summary` renders a small square thumbnail. The image S2 produced is 1200x630, i.e. built for the large card; `summary` would letterbox or crop it |
| `index.html:22` | *(absent)* | comment: "Icons. The SVG wins wherever it is understood; the 32px PNG is the fallback. No data: URI any more, so the CSP no longer needs img-src data:." **added** | records the CSP consequence next to the cause |
| `index.html:23` | `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg ... %3C/svg%3E">` (one ~920-byte inline data URI) | `<link rel="icon" type="image/svg+xml" href="favicon.svg">` | the real file exists now; the inline copy was a stand-in and a second copy of the mark that could drift from `favicon.svg` |
| `index.html:24` | *(absent)* | `<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">` **added** | fallback for anything that will not take an SVG icon |
| `index.html:25` | *(absent)* | `<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">` **added** | iOS home-screen icon |

`og:url`, `og:title`, `og:description`, `og:site_name`, `og:type`, the canonical link, the
JSON-LD block and every `<script src>` are untouched. The inline pin bootstrap in the head
is byte-for-byte unchanged, so the hero pins exactly as it did.

**`privacy.html` is deliberately NOT linked.** Not in the footer, not in the nav, nowhere.
`grep -c -i privacy index.html` returns **0**. It is an unreviewed draft; `docs/DEPLOY-ALLOWLIST.md`
§2 lists the four gates it has to clear first.

### What this cost, measured

The head got six new lines and lost one very long one. Net effect on the gzipped total of
the seven home-page files: **39,378 B -> 39,302 B, i.e. 76 bytes smaller.** The inline
data-URI favicon was larger than everything that replaced it. Hero height and header
height are unchanged to the pixel at 1440, 1270, 1024 and 320 px.

## 2. `tests/examples.test.js` - the CRLF bug Dave found

| file:line | old | new |
|---|---|---|
| `tests/examples.test.js:3-7` | `const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');` | the same read with `.replace(/\r\n/g, '\n')` appended, plus a four-line comment saying why |

**The bug.** Line 107 (now 111) slices the static workflow list out of the page with

```js
html.indexOf('</ul>\n', html.indexOf('<ul class="wf-list"')) + 5
```

On a Windows checkout with `git config core.autocrlf=true`, `index.html` arrives with CRLF,
so the file contains `</ul>\r\n` and never the literal `</ul>\n` this searches for.
`indexOf` returns `-1`, `+5` makes it `4`, and `slice(bigIndex, 4)` returns the empty
string - so `assert(list.length > 200, 'index.html has the static workflow list')` fails on
a tree that is completely correct. Six further assertions downstream depend on that slice.

**It is not S1's doing and not S2's.** The identical line is in the base commit `3f8e20a`.
Confirmed by running it: a CRLF copy of the base commit fails at `examples.test.js:108`
with the same message.

**The fix normalises on read rather than patching the one slice.** Three slices in this
file search raw markup for literal newlines (`class="web"`, `<ul class="wf-list">`,
`<svg class="web">`), and any future one would inherit the same trap. Normalising once at
the read fixes all of them and every later one. Every assertion still matches exactly the
markup it matched before: on an LF checkout the string is unchanged, so this cannot
weaken a single check.

**Proved, both directions.** `tests/examples.test.js` and `tests/grow.test.js` were run on
an LF copy and on a CRLF copy of the fixed tree - all four runs print their "all passed"
line, and `grow.test.js` reports the CLAUDE.md baseline (238 branches, 190 knots, 10,342
samples, closest 12.0 px) on both. A **negative control** was run as well: on the CRLF copy
with the static list's class renamed so the slice finds nothing, the test still fails at the
same assertion. The fix did not make the assertion toothless.

`tests/grow.test.js` needed no change: it reads no files, so it was never exposed.
`tools/check_structure.py` needed none either: it feeds the markup to `html.parser`, which
is line-ending tolerant. `tests/examples.test.js` was the only reader of `index.html`.

## 3. `.gitattributes` - new file

| file | why |
|---|---|
| `.gitattributes` | `* text=auto` as a baseline, then `text eol=lf` for `*.html`, `*.css`, `*.js`, `*.py`, `*.md`, `*.svg`, `*.xml`, `*.txt`, and `*.png binary` |

The test fix makes that one test line-ending-proof; this stops the problem arising again
anywhere else. Every source text file now stays LF in the working tree on every platform,
including a Windows checkout with `core.autocrlf=true`. `*.png binary` matters in its own
right: a CRLF conversion applied to a PNG corrupts it, and this repo ships three
(`favicon-32.png`, `apple-touch-icon.png`, `og-image.png`).

Checked with `git check-attr text eol binary` on a sample across every listed extension
(`eol: lf` on each of them, `binary: set` on the PNGs), and with
`git add --renormalize .`, which reported no change to any existing file - the repo was
already uniformly LF, so this commit pins the status quo rather than rewriting history.

## 4. `docs/DEPLOY-ALLOWLIST.md` - checked against a real build

Every file name and every number in it was re-checked against `node tools/build_dist.js .`
on the integrated tree. Changes:

| § | old | new |
|---|---|---|
| header | "Written 4 Nov 2026 by session S2" | adds an S4 update note listing what changed |
| §1a | four rows carried the note "`weave-motion.js` until S1's rename lands" (and `weave-examples.js`, `weave-explorer.js`, `weave-grow.js`) | the notes are gone; S1's rename has landed and those four files no longer exist anywhere in the repo or in `dist/` |
| §1a | one table of eleven served paths | split into the **seven home-page files** (the set the §5 budget is measured over) and the **four standalone-page files**, because conflating them is exactly what makes the budget check misread |
| §1a | "Confirmed by running it." | the actual `built ...` line from the build, and the observation that eleven built files match the eleven rows exactly |
| §1a | `privacy.html` / `privacy.css`: "**not yet** - see §2" | "**do not serve yet** - see §2" - it is built, so only the deploy step holds it back |
| §1b | `/og-image.png`: "this is the one `og:image` must point at" | "`index.html` now points `og:image` at `https://bpsra.co.za/og-image.png`, so if this file is not deployed every shared link shows a broken card" |
| §1b | the three icon rows | each now names which pages link it |
| §2 | — | adds that S4 integrated S2's files and deliberately added no link to `privacy.html`, with the `grep` that shows it |
| §4a | `img-src 'self' data:;` and a bullet explaining that `data:` is needed for the inline favicon | `img-src 'self';` and a bullet explaining that it is **no longer** needed, because S4 replaced the inline icon with file links and `index.html` now has zero `data:` URIs |
| §4a | CSP hash `sha256-Els9xpZJTEDf10XgWonHd3AbiQzQYFL0IAvnI1GRDrM=`, flagged as already stale | `sha256-np25Q1eWGmUS+L5Zz9S154rVzvgKhhF14gdBLwpTP/c=`, recomputed from both `index.html` and `dist/index.html` (they match, which also re-proves the build copies script blocks byte-for-byte), and still flagged as provisional |
| §5 | 39,258 B / 48,165 B, and the four file sizes | 39,302 B / 48,212 B re-measured, corrected `privacy.css` size, and a new sub-section showing S4's head change *saved* 76 B |
| §5 | the three per-page over-the-wire figures | re-measured: home 39,302 B, privacy 16,448 B, 404 10,312 B |
| §5 | "S2 has not changed `tools/gzip_size.js` ..." | "Neither S2 nor S4 has ...", plus how to read a failing budget check until Dave decides |
| §7 | "[ ] `og:image` ... - S1 owns that line" | "[x] ... done by S4", with the three new tags named and a note that the card itself cannot be previewed until DNS resolves |

Three mentions of the old name remain in that file **as history**: two sentences recording
that the `weave-*.js` placeholders are gone, and one explaining that the superseded CSP hash
was computed from a comment that still said `weave-grow.js`. Each is a statement that the
old name was *removed*, which is the opposite of a leak. See "Decisions" below.

## 5. `dist/` rebuilt

`npm install --no-save esbuild` (0.28.2), then `node tools/build_dist.js .`. It now holds
**eleven** files: the seven home-page files plus `404.html`, `404.css`, `privacy.html`,
`privacy.css`. The four `dist/weave-*.js` files are still absent, as S1 left them.

| set | gzipped total | budget 40,960 B |
|---|---|---|
| the seven home-page files | **39,302 B** | **PASS**, 1,658 B of headroom |
| all eleven, i.e. `node tools/gzip_size.js dist` as written | 48,212 B | 7,252 B over - the known §5 measurement question, unchanged by this session |

## 6. This changelog

This section.

## Decisions this session made that the brief did not cover

1. **`twitter:card` went to `summary_large_image`, which the brief did not ask for in so
   many words.** The task did, and it is the right pairing: S2 built a 1200x630 image,
   which is the large-card aspect ratio. Left at `summary`, Twitter and anything else
   reading those tags would render it as a small square thumbnail and crop the artwork.
   `og:image:width`/`height` are set for the same reason - a scraper can reserve the right
   box before the file lands.
2. **No `og:image:alt`.** It is good practice and would normally go in beside the other
   three. It is *new user-visible copy*, though, and CLAUDE.md says copy ideas go in
   `docs/COPY-PROPOSALS.md`, not into the page. Flagged here rather than added: one short
   line, Haaija's to word.
3. **Icon paths are relative (`favicon.svg`), not root-relative (`/favicon.svg`).** This
   matches every other reference in `index.html` (`styles.css`, `grow.js`, ...) and matches
   `privacy.html`. `404.html` uses `/favicon.svg` instead, correctly: a 404 body can be
   served from any path, so it needs the absolute form. Worth knowing that the icons are
   **not** in `dist/` - they are deployed from the repo root (§1b), so a `dist/`-only
   deploy ships a page whose icon links 404.
4. **The CRLF fix normalises the whole file instead of fixing the one slice.** The task
   allowed either. Normalising is the stronger of the two: it covers the other two slices
   in the same file and anything added later, and it cannot change what any assertion
   matches on an LF checkout. A regex on that one line would have left the trap set.
5. **`.gitattributes` includes `* text=auto` as well as the eight explicit rules.** The
   task named the eight extensions; the baseline line covers text files that are not in
   that list (`.gitignore`, `package.json`, a future `LICENSE`) so they are stored LF in
   the index too. Verified harmless: `git add --renormalize .` changes nothing.
6. **Three historical mentions of the old name stay in `docs/DEPLOY-ALLOWLIST.md`.** The
   brief's §3d gate expects `git grep -iIl weave` to list only the three rebrand docs; this
   makes a fourth (and `CLAUDE.md` and `docs/COPY-PROPOSALS.md` are a fifth and sixth, both
   from S1). All three in the allowlist are sentences saying the old name is gone and why
   a superseded value was superseded - removing them would delete the audit trail the
   grep exists to support. Flagged for Dave rather than decided silently: trivial to
   reword if the gate is meant literally.
7. **Two numbers disagree between sessions and are left side by side.** S2 measured the
   seven home-page files at 39,258 B; S4 measures the identical pre-change tree at
   39,378 B, 120 B apart. The difference is S2's build, not S1's or S4's: S4's esbuild
   0.28.2 reproduces S1's committed `dist/` **byte-for-byte** for all six files S4 did not
   touch (`git diff dist/` after the rebuild lists only `dist/index.html`), and S4 also
   measures `privacy.css` at 3,634 B raw where S2 recorded 3,619 B - two different
   minifier outputs from the same source. Both totals are under budget and both agree
   about what pushes the whole-`dist/` figure over, so the verdict does not move, but the
   measurement is only reproducible to about ±120 B while esbuild is installed with
   `--no-save` and unpinned. Noted in §5 of the allowlist; pinning the version in
   `package.json` would fix it and is a few minutes' work for whoever owns the build.
8. **`docs/V5-SPEC-AND-HANDOFF.md` carries hostnames and server paths into a public repo.**
   Not this session's to change - the brief keeps that file as history and forbids deleting
   anything under `docs/` - but CLAUDE.md's "no secrets, server names or private paths in
   any file" is a repo-wide rule, and lines 67-69 of that file name a live hostname, an
   `sslip.io` host pattern and two `/srv/...` paths. Raised for Dave to decide; see the
   session handoff.

## The 768 px collision is still there, and is still not ours

S1 reported one thread collision at 768 px and said it predated the rebrand. S4 re-ran the
8-width sweep on the integrated tree and on the pre-S4 tree, back to back, in the same
browser:

- both runs: seven widths pass with 0 collisions and 0 boxHits on a live web
  (10,711-24,621 samples), the negative control is caught (91 hits), and the page height at
  every one of the eight widths is **identical** between the two trees;
- both runs: 768 px reports `collisions=1`, `first=[{"kind":"thread","x":71,"y":7414}]` -
  the same single hit, at the same coordinates S1 recorded.

So this session changed nothing about it. It remains a card-frame row divider grazing a lane
tag's padded text box, as S1 diagnosed, and the fix still belongs to whoever owns the frame
layer. The brief forbids retuning the router, so it is reported, not touched.
