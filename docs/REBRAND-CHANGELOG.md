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
