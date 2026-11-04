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

---

# S5 (final small integration)

Session S5, 4 Nov 2026. Three small jobs: the approved slogan, a privacy-draft fix an
independent reviewer asked for, and the finishing checks. Branch base: S4
(`claude/bpsra-rebrand-s4-integration-af2o5t`) with S3
(`claude/before-after-prototype-8d5w69`) merged in with `--no-ff`. The merge was clean - S3
only adds files under `prototypes/before-after/` and edits none, so there was nothing to
resolve.

**Two source files changed: `index.html` (3 lines) and `privacy.html` (3 lines).** No
logic, colour, layout, breakpoint or router change. `grow.js`, `explorer.js`, `motion.js`,
`examples.js`, `site.js` and `styles.css` do not appear in this session's diff at all - no
CSS rule was added, because the measured layout did not need one. `prototypes/` was merged
in as-is and not edited.

## 1. `index.html` - the approved slogan

Haaija approved this exact wording on 4 Nov 2026: **"Spare some time, so we can save
yours."** It is a tagline, not a claim, so no number appears next to it and it is not
labelled as a result.

| file:line | old | new | why |
|---|---|---|---|
| `index.html:591` | `<span>AI automation for growing businesses</span>` (footer, middle span) | `<span>Spare some time, so we can save yours.</span>` | the approved slogan, verbatim, with that capitalisation and punctuation |
| `index.html:40` | *(absent)* | `"slogan": "Spare some time, so we can save yours.",` added to the JSON-LD block | `slogan` is the schema.org property for exactly this; it sits with `name`, `alternateName`, `url`, `description` and `telephone`, all of which are unchanged |

**What was deliberately NOT touched.** "AI automation for growing businesses" is the search
wording and stays in all four of the places a crawler reads it, plus the hero:

| Still says the search wording | line |
|---|---|
| `<title>` | `index.html:8` |
| `<meta name="description">` | `index.html:9` |
| `<meta property="og:title">` | `index.html:15` |
| JSON-LD `description` | `index.html:41` |
| `<p class="hero__descriptor">` (the hero is Willie's) | `index.html:72` |

Six occurrences of the search wording before this session, five after: the one that went is
the footer span the slogan replaced, which is the whole of the intended change. The five in
the table above - the four a crawler reads, plus the hero - are untouched.

## 2. `privacy.html` - a guessed rule removed (DRAFT)

**DRAFT - not reviewed by a lawyer.** An independent reviewer found a retention rule that
had been invented. Nobody decided 12 months. A retention period for personal information is
a legal question, and this file says on its face that it has not been reviewed, so a guessed
figure in it is worse than a visible gap.

| file:line | old | new | why |
|---|---|---|---|
| `privacy.html:174` | "12 months from the last message, then deleted." (enquiry that does not become work) | `TODO(Haaija): retention period (decide with a lawyer)` + the reasoning kept, with the figure named as an open decision | nobody decided 12 months |
| `privacy.html:176` | "Same 12 months for an enquiry" (WhatsApp conversations) | "The same period as an enquiry, once that period is set:" + the same placeholder | the two periods are one decision; tying them keeps them from drifting apart when the figure is filled in |
| `privacy.html:218` | "We will acknowledge within a few working days" | `TODO(Haaija): acknowledgement period (decide with a lawyer)` | found by S5's own sweep, not by the reviewer. It is the same mistake in a different coat: an undertaking to a data subject about response time that nobody had decided |

Placeholders use the file's existing `.todo` span, so they render highlighted in the warn
colours rather than hiding in body text. `TODO(Haaija)` count in `privacy.html`: **11 before,
14 after.**

### The rest of the file, swept and found clean

Checked for every category of invented specific, not just the one the reviewer named.
Nothing else needed changing, and here is why in each case, so the next reader does not have
to redo the sweep:

| Category | What is in the file | Verdict |
|---|---|---|
| Periods and numbers | after the three changes above, `grep -niE "[0-9]+ (months?\|years?\|weeks?\|days?)"` returns **nothing** | clean |
| Named processors | only **WhatsApp / Meta**, which the brief allows and which §5 of the notice explains at length. The hosting provider and the mailbox provider were already `TODO(Haaija)` | clean |
| Addresses | no postal or physical address is stated; the registered address is already a `TODO`. The only domains are `bpsra.co.za` (confirmed) and `inforegulator.org.za` (the Regulator's real site, cited as a site to visit - the notice deliberately declines to reproduce the Regulator's contact details and carries a `TODO` to copy the current ones in before publishing) | clean |
| Statutory citations | "Protection of Personal Information Act 4 of 2013", POPIA "section 21" (written operator agreement) and "section 22" (breach notification) | correct citations of public law, not invented business facts - left as they are |
| Dates | "Drafted: 4 November 2026" | accurate |

Two things were **considered and deliberately left alone** - see the decisions section below:
"only the two of us" (lines 153 and 193) and the security-measures list in §7 of the notice.

**Unchanged and verified still in place:** both DRAFT banners (head and foot),
`<meta name="robots" content="noindex">`, the no-JavaScript-by-design comment, the absence
of `og:*` and canonical tags, and the status block telling a publisher to fill in every TODO
and get an attorney to review it.

## 3. `docs/DEPLOY-ALLOWLIST.md` - corrected for prototypes, privacy and 404

| Section | Change | Why |
|---|---|---|
| header | added an S5 update paragraph | the file records who checked what and when; it is the only reason its numbers can be trusted |
| §1a | added, with the code quoted, that `build_dist.js` **does not recurse** into subfolders, so nothing under `prototypes/` can reach `dist/` | S3's prototype is a full page with its own CSS and JS. The build not reaching it is the thing that keeps it undeployable, and nothing said so. Verified after the merge: `dist/` holds the same eleven files and nothing from `prototypes/` |
| §1a | expanded the `/404.html` row and added a note: deploying the file does nothing without the host's error-document directive, the response must carry a real `404` status and not a `200`, the directive differs by host (`ErrorDocument` / `error_page`) and is therefore UNVERIFIED here, and the page's assets are root-absolute so it styles correctly at any URL depth | the doc listed the 404 files but never said how a 404 actually gets served. A deployer following it exactly would have shipped a 404 page nobody ever sees |
| §2 | the `TODO(Haaija)` list now names all fourteen, including S5's three, and says why they are the long pole | the gate is "every TODO answered"; an out-of-date list understates the work |
| §3 | rewrote the `prototypes/` row now that the files exist, naming what is in there and both reasons it is not served | it was written before S3's files were in the tree |
| §5 | re-measured all figures after S5's edits (7 files **39,328 B**, 11 files **48,298 B**), named the seven files counted, recorded S5's cost (+26 B home page, +60 B `privacy.html`), and noted the headroom has shrunk in two consecutive sessions | the section states its numbers were measured on a real build; after an `index.html` change they were stale |
| §7 | added two checklist items: `prototypes/` not in the uploaded set, and the error-document directive verified against a real missing URL | both are things a deployer can get wrong silently |

Still correct and re-verified rather than assumed: the CSP inline-script hash
`sha256-np25Q1eWGmUS+L5Zz9S154rVzvgKhhF14gdBLwpTP/c=` is **unchanged** by this session
(S5's edit is outside the inline script; recomputed from both `index.html` and
`dist/index.html` and both match the value in §4a), `grep -c privacy index.html` is still
**0**, `grep -c 'data:image' index.html` is still **0**, and the inline `style="` count is
still **38**.

## 4. `dist/` rebuilt

`npm install --no-save esbuild` (0.28.2, the same version S4 used, so the figures are
comparable) then `node tools/build_dist.js .`, which printed the same eleven files. `dist/`
was then checked against a **fresh rebuild from a clean `git archive` of the commit** into a
separate directory: `diff -rq` reports every file identical, and `dist/index.html` is
byte-for-byte equal (sha256 `528dc4e3...`, 32,052 B). The JSON-LD in the built file parses
and carries the slogan.

## 5. This changelog

This section.

## Decisions this session made that the brief did not cover

1. **The slogan went in the footer and the JSON-LD only, not the hero or the head.** The
   task said where to put it and what not to touch, so this is really a record of the
   reasoning: a tagline and a search phrase are different jobs. "AI automation for growing
   businesses" is what someone types into a search box; "Spare some time, so we can save
   yours." is what someone remembers. Putting the slogan in `<title>` would have traded a
   phrase that matches queries for one that does not. `slogan` is a real schema.org property
   on `ProfessionalService`, so the structured data says which is which rather than guessing.
2. **No CSS rule was added, because the measurement said none was needed.** The brief's
   instruction was to add one only if the measured layout needed it. Measured in headless
   Chromium at all six widths: the footer's height and row count are **identical** to the
   old wording (118.7 / 118.7 / 118.7 / 148.4 / 178.1 / 178.1 px; 1 / 1 / 1 / 2 / 3 / 3
   rows), and `documentElement.scrollWidth` equals `clientWidth` at every width. The slogan
   span is 266.1 px wide against the old 249.2 px - 16.9 px wider, absorbed by the existing
   `flex-wrap: wrap; justify-content: center`. A rule added "to be safe" would have been an
   unmeasured layout change, which the brief forbids.
3. **A third invented period was fixed, beyond the two named.** The task named the two
   retention lines and then asked for a sweep. "We will acknowledge within a few working
   days" is vaguer than "12 months" but it is the same class of error - an undertaking to a
   data subject that nobody decided - so it got the same treatment. Flagged here because it
   was not in the task list.
4. **"Only the two of us" was left in, and is flagged rather than fixed.** Lines 153 and 193
   of the notice say only two people see an enquiry. That is a number about the business, so
   it was considered under the sweep. It is grounded - the brief names Haaija and Willie as
   the two co-founders - and it describes access control rather than stating a rule about
   personal information, so replacing it with a `TODO` would have removed true information.
   It will become false the day a third person gets mailbox access, and whoever does that
   needs to edit this notice. Raised for Haaija, not changed.
5. **The security-measures list in §7 of the notice was left in, and is flagged.** It
   asserts password-manager use, MFA "wherever the service offers it", encryption in transit
   and limited access. None of those is a period, a number, a processor or an address, so
   they sit outside the sweep's categories - but they are factual claims about practice in a
   document that is a representation to the public, and this session has no evidence for
   them. The section already says it describes measures "in general terms" and guarantees
   nothing. Recommendation for Haaija and the attorney: confirm each line is true before
   publishing, or soften it. Not changed, because changing it would be a copy decision this
   session was not asked to make.
6. **The whole-`dist/` gzip figure is still over budget, and S5 did not move the goalposts
   either.** `node tools/gzip_size.js dist` reports 48,298 B against 40,960 because `dist/`
   now contains the undeployed `privacy.*` and `404.*` files. The seven deployed files total
   **39,328 B**, 1,632 B inside budget. S4 recommended redefining the budget as a home-page
   budget; S5 agrees, and like S4 changed neither `tools/gzip_size.js` nor `CLAUDE.md`, so
   the call stays Dave's. Noted in the allowlist §5 that the headroom has now shrunk in two
   consecutive sessions.
7. **`docs/V5-SPEC-AND-HANDOFF.md` still carries hostnames and server paths into a public
   repo.** S4 raised this and it is still open. S5 is not changing it for the same reasons
   (the brief keeps that file as history and forbids deleting anything under `docs/`), but it
   is repeated here rather than quietly dropped, because CLAUDE.md's "no secrets, server
   names or private paths in any file" is a repo-wide rule and a stale handoff note is a poor
   reason to keep breaking it. Dave's call.
8. **`git grep -iIl weave` now lists six files, all of them docs or `CLAUDE.md`.**
   `CLAUDE.md`, `docs/COPY-PROPOSALS.md`, `docs/DEPLOY-ALLOWLIST.md`,
   `docs/REBRAND-BRIEF.md`, `docs/REBRAND-CHANGELOG.md`, `docs/V5-SPEC-AND-HANDOFF.md`.
   Nothing in `index.html`, `*.css`, `*.js`, `tools/`, `tests/`, `dist/` or `prototypes/`.
   The brief's §3d gate names three of the six; the other three are history and audit trail
   (S4 raised the same point as its decision 6). S5's own additions to the allowlist and this
   changelog mention the old name only in sentences explaining that it is gone.

---

# S6 (fixes from the cloud ultrareview)

Session S6, 4 Nov 2026. Branch base: `claude/bpsra-rebrand-s5-final-ffarrp`, the verified
final candidate, reset onto before any work started. Eight findings from an independent
review of S5, one commit each, nothing else touched.

**`index.html` is byte-identical to S5.** `git diff --stat
origin/claude/bpsra-rebrand-s5-final-ffarrp -- index.html` is empty, and so is the same diff
over `dist/index.html`, `dist/styles.css`, `dist/site.js`, `dist/motion.js`,
`dist/examples.js`, `dist/explorer.js` and `dist/grow.js`. No logic, colour, layout,
breakpoint or router change anywhere; `styles.css`, `grow.js`, `explorer.js`, `motion.js`,
`examples.js` and `site.js` do not appear in this session's diff at all. The only copy
change is finding 4, which the review asked for.

## 1. (HIGH) `favicon.svg` and `og-image.svg` were not well-formed XML

Both files had an XML comment containing a CSS custom property name. The two hyphens that
open such a name are the one sequence an XML comment may not contain, and a browser parses
an SVG used as an icon or an `og:image` with the strict XML parser, not the forgiving HTML
one. The comments now name the tokens in words. Nothing about the drawn geometry or the
colours changed, so the three baked PNGs still match their sources.

New file `tools/check_xml.py`: walks the tree, parses every `.svg` and `.xml` with
`xml.etree.ElementTree`, prints one line per file plus an explicit `xml: all well-formed`
line, exits non-zero on any failure, skips `node_modules/`, `dist/` and
`prototypes/**/shots/`. Added to the checks list in `CLAUDE.md` and in `README.md`.

```
before:  FAIL  favicon.svg: not well-formed (invalid token): line 10, column 39
         FAIL  og-image.svg: not well-formed (invalid token): line 12, column 30
         ok    sitemap.xml
         xml: 2 of 3 file(s) are NOT well-formed                        (exit 1)
after:   ok    favicon.svg
         ok    og-image.svg
         ok    sitemap.xml
         xml: all well-formed (3 files)                                (exit 0)
```

This was not a theoretical parse complaint. In headless Chromium, as an `<img>` in a page
sitting beside the files, and then by navigating straight at each file:

```
  favicon-old.svg    naturalWidth x naturalHeight 0x0        document root <html>  parser error: true
  favicon.svg        naturalWidth x naturalHeight 32x32      document root <svg>   parser error: false
  og-image-old.svg   naturalWidth x naturalHeight 0x0        document root <html>  parser error: true
  og-image.svg       naturalWidth x naturalHeight 1200x630   document root <svg>   parser error: false
```

The old files never decoded at all, and the browser served an error document in place of
the drawing. `index.html`, `privacy.html` and `404.html` all link `favicon.svg`, and
`index.html` points `og:image` at the PNG but the SVG is the committed source - so the icon
was broken on every page for every visitor whose browser prefers the SVG.

## 2. (HIGH) `README.md` told the reader to deploy seven files

The Deploy section said "the contents of `dist/`, and only these seven files". The real set
in `docs/DEPLOY-ALLOWLIST.md` is wider, and following the README would have shipped a site
with no icons, no share image, no `robots.txt`, no sitemap and no 404 page. The section now
names the allow-list as the source of truth and lists what it lists: the seven home-page
files and `404.html` + `404.css` from `dist/`, and `robots.txt`, `sitemap.xml`,
`favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` and `og-image.png` from the repo
root, with `og-image.svg` optional. It states that `privacy.html`/`privacy.css` and
`prototypes/` are **not** deployed yet, and why.

Nothing was invented. Where the two documents disagreed, the README was corrected to the
allow-list: its old claim that the contact form "falls back to WhatsApp" is replaced by what
the allow-list and `site.js` actually say - `contact.php` is not in this repository, a
submit returns 404 until it exists, and the page then shows an error pointing the visitor at
WhatsApp.

## 3. (MED) The before/after morph could freeze with every label invisible

`prototypes/before-after/before-after.js`. `layoutScrub()` turns the scroll scrub off on a
resize, a rotation or a `prefers-reduced-motion` change, and `onScroll()` then returns early
- but nothing reset `prog`. The drawing stayed wherever the morph happened to be, and
because the two label phases deliberately do not overlap, a value in the middle leaves
**both** panels at opacity 0: threads on screen and no labels at all. It now snaps to the
nearer rest state, cancels any running tween and settles immediately, so `aria-pressed` and
the live region match what is drawn. The `window.BA.set` test hook, which sets `locked` and
then its own value, is left alone.

Proved in headless Chromium at 1440x1000: scrub on, scrolled to mid-morph, then switched off
two ways. Same tree, same probe, only `before-after.js` differing:

```
old   reduced motion on mid-morph   prog 0.431 -> 0.445   panel0 0.000  panel1 0.000  FAIL
      resized short mid-morph       prog 0.413 -> 0.277   panel0 0.000  panel1 0.000  FAIL
new   reduced motion on mid-morph   prog 0.413 -> 0.000   panel0 1.000  panel1 0.000  ok
      resized short mid-morph       prog 0.413 -> 0.000   panel0 1.000  panel1 0.000  ok
```

`prototypes/before-after/check.js` still reports `all checks passed` at 1440 and 390 px - 0
hits at all eleven stops, negative control fires at 88 hits - and regenerates the ten
committed screenshots byte-identically.

## 4. (MED) `404.html` carried an unapproved tagline

"Process first, automation second" is a **proposal** in `docs/COPY-PROPOSALS.md`, not
approved copy, and `404.html` had it in the two places a visitor and a search engine see.

| Line | Was | Now |
|---|---|---|
| 8, `meta description` | `That page is not here. Business Process Redesign — process first, automation second.` | `That page is not here. Business Process Redesign.` |
| 53, footer `<span>` | `Process first, automation second` | `Spare some time, so we can save yours.` |

The footer line is byte-identical to `index.html:591` and to the JSON-LD `slogan` at
`index.html:40`. `dist` rebuilt; `git status --short` after the rebuild listed only
`404.html` and `dist/404.html`, so no other built file moved.

`git grep -iIl "automation second"` now returns `docs/COPY-PROPOSALS.md` and
`docs/REBRAND-BRIEF.md` and nothing on the site. The brief is left alone deliberately: it is
the document that commissioned those proposals, and editing it would be rewriting the job
rather than the page.

## 5. (LOW) `privacy.html` header wrapped to two rows on a phone

The page carried the brand name as one plain `<span>`, so `header-inner` wrapped at narrow
widths. It now uses exactly the markup `index.html` uses - a `.brand-name` pair with
`aria-label` on the link and both spans `aria-hidden` - so the existing `styles.css` rules
apply with no CSS change and the accessible name stays the full name at every width.

Measured in headless Chromium, same probe before and after:

```
before   320 px header 77 px TWO ROWS   360 px and 390 px header 85 px TWO ROWS
after    320 / 360 / 390 / 480 / 768 px header 53 px, one row, brand "BPR"
         1440 px header 53 px, one row, brand "Business Process Redesign"
         scrollWidth == clientWidth at every width
```

**No `scroll-margin-top` was needed, and none was added.** The table-of-contents targets are
`<section id="...">` elements, so `styles.css` already gives them
`scroll-margin-top: calc(var(--header-h) + var(--space-5))`, which computes to 76 px against
a 53 px header. Clicking the first TOC link lands the heading 112.5 px clear of the header
bottom at 320 px and 53.5 px clear at 768 px - measured, not assumed. Adding a rule "to be
safe" would have been an unmeasured layout change.

The DRAFT banner, the `noindex` meta and all fourteen `TODO(Haaija)` placeholders are
untouched. `python tools/check_structure.py privacy.html`: 0 unbalanced tags, no duplicate
ids, no unresolved refs.

## 6. (MED) The size check measured a set the budget was never written for

Since the 404 and privacy pages started landing in `dist/`, `node tools/gzip_size.js dist`
has been summing eleven files - 48,335 B - against a 40,960 B budget written for what a
visitor downloads to see the **home** page. It reported a failure that was not one, and it
would have hidden a real home-page regression behind a number nobody could act on.

`tools/gzip_size.js` now takes `--site`, which sums exactly `index.html`, `styles.css`,
`site.js`, `motion.js`, `examples.js`, `explorer.js` and `grow.js`, prints each file, prints
the total with the headroom, prints PASS or FAIL and exits non-zero when over. It errors out
if any of the seven is missing, so a half-built `dist/` cannot pass by default. The
whole-folder total is still printed, now labelled informational, with a line naming the form
that carries the budget.

```
node tools/gzip_size.js dist --site
  index.html               32052 B raw    8140 B gzip
  styles.css               41691 B raw    8925 B gzip
  site.js                   3053 B raw    1389 B gzip
  motion.js                 3340 B raw    1504 B gzip
  examples.js               6403 B raw    2515 B gzip
  explorer.js              16255 B raw    6256 B gzip
  grow.js                  24689 B raw   10599 B gzip
  TOTAL (7 home-page files)   39328 B gzip | budget 40960 | headroom 1632
  site budget: PASS                                                   (exit 0)
```

The 40,960 B figure is untouched; only the measured set changed, which is what S4 and S5
both recommended and neither did unilaterally. `CLAUDE.md`, `README.md` and allow-list §5
all name the `--site` form, §5 is marked settled, its per-file figures are re-measured after
this session's two page edits, and the §7 checklist item is ticked.

## 7. (LOW) `check.js` built `file://` URLs by concatenation

`prototypes/before-after/check.js` joined `'file://'` to a filesystem path in two places:
the page URL and the two prefixes its "no third-party requests" check matches against. On
Windows the page would not load at all; on any path containing a space the request check
silently inverts, because Chromium reports percent-encoded URLs and a hand-built prefix is
not encoded. Both now go through `url.pathToFileURL`, and both prefixes end in `path.sep`
first, so a sibling directory whose name merely starts the same way cannot match.

Proved by copying the prototype into a directory whose name contains a space and running
both versions from there, same page, same browser:

```
old   requests made: 4 , all local: false
      FAIL requests left the repo: .../space%20test/prototypes/before-after/index.html,
        .../space%20test/styles.css, .../space%20test/.../before-after.css,
        .../space%20test/.../before-after.js
      before-after prototype: 1 FAILED                                (exit 1)
new   requests made: 4 , all local: true
      before-after prototype: all checks passed                       (exit 0)
```

## 8. (LOW) A negative assertion that could not fail

`tests/examples.test.js` guarded against `/<script[^>]*hero-cards/`. Nothing has ever been
called `hero-cards`: the script it was written to catch was the v2 hero card script, whose
filename carried the company's previous name and which was removed in v4. The pattern could
not fail whatever `index.html` contained. It is now `/<script[^>]*cards/`, which catches any
script with "cards" in its name - the hero web draws the cards itself - and the message is
unchanged.

Proved the assertion can now fail. A copy of `index.html` with
`<script src="x-cards.js" defer></script>` inserted before `</body>`, everything else
identical:

```
old pattern, planted file   examples.test.js: all passed                      (exit 0)
new pattern, planted file   AssertionError [ERR_ASSERTION]: v4 does not load
                            the hero card script: the hero web stays as in v2 (exit 1)
new pattern, real file      examples.test.js: all passed                      (exit 0)
```

## Checks run at the end of the session

```
node tools/build_dist.js .            built 404.css, 404.html, examples.js, explorer.js,
                                      grow.js, index.html, motion.js, privacy.css,
                                      privacy.html, site.js, styles.css
git status --short dist               empty - dist/ matches a fresh rebuild
node tests/examples.test.js           examples.test.js: all passed
node tests/grow.test.js               grow.test.js: all passed | 238 branches, 190 knots,
                                      10342 samples, closest 12.0px, 135ms
  same two on a CRLF copy             all passed; identical grow figures (140ms)
python tools/check_xml.py             xml: all well-formed (3 files)
node tools/gzip_size.js dist --site   39328 B gzip, headroom 1632, site budget: PASS
git grep -iIl weave                   CLAUDE.md, docs/COPY-PROPOSALS.md,
                                      docs/DEPLOY-ALLOWLIST.md, docs/REBRAND-BRIEF.md,
                                      docs/REBRAND-CHANGELOG.md,
                                      docs/V5-SPEC-AND-HANDOFF.md
git diff --stat <S5> -- index.html    empty
node prototypes/before-after/check.js all checks passed, both widths
python tools/check_structure.py       index.html and privacy.html: 0 unbalanced tags,
                                      no duplicate ids, no unresolved refs
```

The `grow.test.js` figures match the baseline in `CLAUDE.md` exactly: 238 branches, 190
knots, 10,342 samples, closest 12.0 px.

## Decisions this session made that the task did not cover

1. **`docs/REBRAND-BRIEF.md` still contains "automation second", and was left alone.**
   Finding 4 asked that `git grep -i "automation second"` return nothing outside
   `docs/COPY-PROPOSALS.md`. It also appears in §53 of the brief, in the sentence that asked
   for those proposals in the first place. Editing the brief would rewrite the job rather
   than the page, so it stays. Nothing on the site carries the tagline, which is the point of
   the finding.
2. **The old company name was kept out of the new test comment.** The first draft of
   finding 8's comment named the removed script file, which put the old name back into
   `tests/examples.test.js` and broke the `git grep -iIl weave` invariant - the grep is
   there precisely to catch that. The comment now says "the company's previous name" instead.
   `git grep -iIl weave` is back to the six docs files, with no source, test or tool file in
   the list.
3. **No `scroll-margin-top` rule was added for finding 5.** The finding allowed one "if
   needed". It was not needed - the global `section[id]` rule already clears the header by a
   measured 53.5 to 112.5 px - and adding it would have been an unmeasured CSS change the
   brief forbids. Measured rather than assumed, and reported either way.
4. **`tools/gzip_size.js` gained the option rather than a new script.** Finding 6 allowed
   either. One tool with one budget constant is harder to let drift than two scripts that
   each know the number, and the whole-folder mode is kept so the four undeployed files stay
   visible instead of disappearing from view.
5. **The three probe scripts are not committed.** The headless-Chromium probes for findings
   3, 5 and 1 live in this session's scratchpad, not in `tools/`. They are one-off proofs of
   specific regressions, the repo already has `check.js` and `check-text-clear.js` for the
   prototype, and the task asked for proof, not for new permanent tooling. Their output is
   quoted above and in the commit messages. If any of the three is worth keeping, finding 1's
   SVG-decode probe is the one: it is the only check that would catch the icon breaking
   again from the browser's side rather than the parser's.
6. **Points 5, 7 and 8 of S5's decision list are still open and are not this session's to
   close.** The "only the two of us" sentence and the security-measures list in the privacy
   draft (copy decisions for Haaija and the attorney), and the hostnames and server paths in
   `docs/V5-SPEC-AND-HANDOFF.md` (a repo-wide rule in `CLAUDE.md` versus the brief's "keep
   that file as history"). Repeated here rather than quietly dropped, for the third session
   running.
