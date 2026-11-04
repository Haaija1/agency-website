# Before / After prototype

A standalone section that **shows** what "map it, redesign it, then automate it" means, in the
same visual language as the rest of the site: a web of threads that branch and merge.

One plain example - a supplier invoice moving from an email attachment to a payment - is drawn
twice. On the left of the morph, **Before**: twelve boxes with threads that cross and double
back, because the same figures are typed in twice, people chase each other by email, and the
invoice waits. On the right, **After**: the same job redesigned into seven boxes, where those
threads merge into one flow.

Nothing here is wired into `index.html`. It is a prototype to look at and argue about.

## Open it

```
# anything that serves the repo root works; a file:// URL works too
python3 -m http.server 8000      # then http://localhost:8000/prototypes/before-after/
```

or just open `prototypes/before-after/index.html` in a browser. It links `../../styles.css`
for the tokens, so it has to sit inside the repo.

## The rules this example was built to

These are not decoration; they are why the content is what it is.

- **A person approves anything that moves money.** The *after* drawing keeps a visible human
  approval step (box 5), and every path through the drawing goes through it: the clean route
  and the review route both merge there. Nothing in the drawing pays or approves on its own,
  and nothing claims it does.
- **No client names.** The example is generic.
- **No time, money or percentage claims.** The only numbers on the page are "12 steps drawn"
  and "7 steps drawn", which are a count of the boxes in the two drawings and are labelled as
  such in the note underneath.
- The whole thing carries **"Illustrative example, not a client result"**, as the site's rules
  require.

## Behaviour

| State | What you get |
|---|---|
| No JavaScript | Both drawings as plain numbered lists, stacked, fully readable. The script adds a `ba-js` class to `<html>`; every rule that positions anything is behind that class. |
| `prefers-reduced-motion: reduce` | One drawing at a time, swapped instantly by the buttons. No scroll scrub, no animation, no draw-in. |
| Full | The two drawings share one stage. Scrolling through the pinned section scrubs the morph, and the two buttons jump to either end of it. |

- The control is two real `<button>`s with `aria-pressed`, inside a `role="group"`. They work
  from the keyboard like any button, and they are the only control: the scroll scrub is an
  extra way in, never the only one.
- A short sentence in an `aria-live="polite"` region says what changed, written out in words
  ("the re-typing, chasing and waiting threads have merged into one flow... a person still
  approves the payment"). It is only updated once the morph comes to rest, so scrubbing does
  not spam a screen reader, and the drawing that is not showing is `aria-hidden`.
- The scroll scrub turns itself **off** when the drawing is taller than the viewport (phones,
  short windows) or when reduced motion is on. The buttons then do the whole job.
- Phones (390 px): one column, boxes in normal flow, threads in the side gutters, no sideways
  scroll.

### How the morph actually merges

Each of the sixteen *before* threads is paired with the *after* thread it belongs to. Both are
sampled to the same number of points, so the morph interpolates them point by point and several
*before* threads land on **the same** *after* thread. At the end they lie exactly on top of one
another: sixteen paths have become seven. That is a real merge, not a cross-fade.

The morph runs in three phases that are deliberately kept apart:

```
0.04 - 0.24   the "before" labels fade out and the boxes start to gather
0.22 - 0.75   the threads merge: sixteen paths slide onto seven, and the blue flow draws in
0.74 - 0.94   the "after" labels appear on the flow that is now drawn
```

Labels are therefore never on screen while a thread is between the two drawings. That is what
lets the check below come back with zero crossings at *every* step of the morph, not only at
its two ends.

### How the geometry is built

Box rectangles are **measured** from the DOM on every layout, never hard-coded. The only thing
authored per edge is which lane it travels in:

- `c` - direct: leave the side of A facing B, enter the side of B facing A. `c:rt` names the
  sides by hand where the automatic choice would stack two threads on one side of a box.
- `l0`, `r2` - out of the side, along a gutter lane, back in on the same side. The lanes are
  derived from the measured left and right margins of the drawing.
- `m0` - the same, but up the empty channel **between** the two columns, so a rework thread
  cuts across every thread going the other way. That channel is found by measuring, so the
  route falls back to a gutter in the one-column layout.

Direct threads are cubic Beziers (a Bezier stays inside the hull of its control points, so it
cannot swing off into a box); lane threads are polylines with rounded corners. An earlier
Catmull-Rom version overshot its last corner and pushed a thread through the heading - the
check below caught it.

## Checking that no thread crosses any text

`check-text-clear.js` is the check, and `check.js` is the browser run around it. From the repo
root:

```
node prototypes/before-after/check.js
```

`check-text-clear.js` is the same idea as `tools/web_collision.js`, applied to this stage:

1. A `TreeWalker` collects every text node in the stage and takes its real client rectangles -
   one per wrapped line, via `Range.getClientRects` - padded by 4 px.
2. Box counters are drawn with `::before`, which a `Range` cannot see, so the `<li>` rectangles
   are collected too, padded by 2 px. That is **stricter** than a text-only test: it forbids a
   thread anywhere inside a box, not only on its letters.
3. A rectangle only counts while it can be seen. Text in a panel faded below 0.15 cannot be
   crossed, so it is skipped - the same reasoning `web_collision.js` uses for text scrolled out
   of a clipping box. Threads are filtered by their own opacity the same way.
4. Every `<path>` is walked with `getPointAtLength` every 3 px and each sample is tested against
   every live rectangle. The two boxes at a thread's own ends are exempt, within 7 px of those
   ends only, because a thread has to touch what it joins; which boxes those are is worked out
   from the endpoint geometry, not asserted.

`check.js` holds the morph at eleven progress values (including the two moments where a set of
labels is half faded), runs the check at each, and **runs a negative control**: it drags one
thread straight across a label and fails if the checker does not report it. A checker that
cannot fail proves nothing - that lesson is already paid for in `CLAUDE.md`. It also checks for
sideways scroll, checks that no request leaves the repo, and writes the screenshots in `shots/`.

## Weight

The budget is 12,288 B gzipped for the three files that would ship.

```
node -e "const z=require('zlib'),f=require('fs');let t=0;for(const n of ['index.html','before-after.css','before-after.js']){const b=f.readFileSync('prototypes/before-after/'+n);const g=z.gzipSync(b,{level:9}).length;t+=g;console.log(n,b.length+' B raw',g+' B gz')}console.log('total',t+' B gz')"
```

The measured numbers are in the session handoff. They are for the **source** files, comments and
all; through the site's esbuild step (`tools/build_dist.js`) the same code is considerably
smaller. `check.js`, `check-text-clear.js`, `README.md` and `shots/` are dev files and would not
ship.

No third-party request, no external font, no library, no analytics, nothing written to storage.

## Wiring it into the real page later - NOT DONE HERE

Deliberately not done: `index.html` and `dist/` were being edited by another session while this
was written, and the copy is not Haaija's yet. When someone does wire it in:

1. **Copy decision first.** The wording here is the prototype's own. Anything that would go on
   the real page belongs in `docs/COPY-PROPOSALS.md` for Haaija to choose, per `CLAUDE.md`.
2. Move the `<section class="ba">` block into `index.html`, keeping `class="threaded"` on it and
   a `.thread-node` bead if it should join the page's Thread, as every other section does.
3. Fold `before-after.css` into `styles.css` (the token block it relies on is already there) and
   add `before-after.js` to the `<script>` tags **and** to the esbuild list in
   `tools/build_dist.js` **and** to the 7-file deploy allow-list in `docs/DEPLOY-ALLOWLIST.md`,
   which would become an 8-file list. Missing any one of those three is the usual way a file
   gets built but not served.
4. The scroll scrub uses its own sticky wrapper. The page already pins the header and hero
   (`docs/V5-SPEC-AND-HANDOFF.md`, section 3). Check the two pins do not fight before shipping:
   that is a real-browser check, not a unit test.
5. Re-run `tools/sweep_widths.py` for the whole page, not just this section - the page web
   (`grow.js`) routes around whatever is in the document, and nineteen new boxes change what it
   has to route around.
6. Re-check the gzipped total of `dist/` against the 40,960 B budget with `node tools/gzip_size.js dist`.

## Files

```
index.html             the section (standalone page; links ../../styles.css for tokens)
before-after.css       its styles
before-after.js        layout, thread geometry, the morph, the control
check-text-clear.js    the no-thread-crosses-text check, to run in the page   (dev only)
check.js               the headless Chromium run around it, and the screenshots (dev only)
shots/                 PNGs at 1440 and 390 px: before, merging, after, reduced motion, no JS
```
