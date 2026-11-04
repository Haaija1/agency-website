# Business Process Redesign — website

Marketing site for **Business Process Redesign** (short name **BPR**), at
**bpsra.co.za**. One page, plain HTML/CSS/JS, no framework and no build step to view
it: open `index.html` in a browser. There is a minify step for what gets deployed
(see [Build](#build)).

The site was built as "v5" under the company's previous name. The name changed; the
site did not. `docs/REBRAND-BRIEF.md` is the job, `docs/REBRAND-CHANGELOG.md` lists
every string and identifier that moved, and `docs/V5-SPEC-AND-HANDOFF.md` is the
history of how the page works (written under the old name).

## What the page is

A single scrolling page: hero, why we do this, services, process, example workflows,
a workflow example, contact. Behind the content a web of threads grows down the page
as you scroll, draws the card borders, and joins the big interactive tool web in
"Example workflows". All of it is progressive enhancement:

- **No JavaScript** — the page is complete: normal CSS borders, no pin, and the
  example workflows read as a plain list.
- **`prefers-reduced-motion: reduce`** — everything holds still.
- **Keyboard** — every pointer interaction has a keyboard equivalent.

The hero is Willie's: his words and structure (identity row, eyebrow, two-line
headline, intro, call to action, closing line). **Do not change how it pins or
behaves.** It holds still for a few scrolls while the first branch grows out of it;
that is deliberate and approved.

## Files

| File | What it does |
|---|---|
| `index.html` | The page. All content lives here. |
| `styles.css` | The whole stylesheet (slate + blue tokens, layout, motion rules). |
| `site.js` | Progressive enhancement: form validation, the week switch, reveals. |
| `motion.js` | Motion layer: hero web drift, pointer silk, signals. |
| `examples.js` | The workflow data for the example explorer (pure, unit-tested). |
| `explorer.js` | Builds the interactive tool web and its popup. |
| `grow.js` | The web that grows down the page: router, pin, card frames. |
| `tests/` | Node unit tests. |
| `tools/` | Measurement and build scripts. |
| `dist/` | Minified output, committed. This is what gets deployed. |

## Checks

All from the repo root.

```
node tests/examples.test.js      # must print "examples.test.js: all passed"
node tests/grow.test.js          # must print "grow.test.js: all passed | ..."
```

Baseline for `grow.test.js`: 238 branches, 190 knots, 10,342 samples, closest 12.0 px.
**A runner that prints nothing is not a pass** — require the explicit "all passed"
line. (A silent runner once exited 0 with no tests run.)

```
python tools/check_structure.py index.html    # tag balance, duplicate ids, refs resolve
python tools/contrast.py                      # WCAG contrast ratios
python tools/site_contrast.py <stylesheet>    # contrast table for a token set
```

`tools/sweep_widths.py` checks the web against the page text at 8 widths (0 collisions,
0 boxHits, on a web that is actually alive, plus a negative control). It needs a real
browser and the `cdp` / `js` / `goto_url` / `wait_for_load` helpers of a CDP harness —
it does not run on its own. A "0 collisions" result on a web that did not draw is
meaningless: require thousands of samples and a negative control that gets caught.

## Build

```
npm install --no-save esbuild
node tools/build_dist.js .      # writes ./dist
node tools/gzip_size.js dist    # budget: gzipped total <= 40,960 bytes
```

## Deploy

Deploy the contents of `dist/`, and only these seven files:

```
index.html  styles.css  site.js  motion.js  examples.js  explorer.js  grow.js
```

Nothing else is served — not `tests/`, not `tools/`, not `docs/`. A `contact.php`
endpoint is not deployed, so the contact form falls back to WhatsApp.

Pushing to GitHub does not publish anything by itself.

## Rules for this repo

- **This repo is public.** No secrets, tokens, passwords, IP addresses, server names
  or private paths in any file or in any commit message.
- **No client name, client result or real price appears on the site.** The
  time-saving figures are illustrative placeholders and are always labelled
  "Illustrative, not a client result".
- **No third-party requests**: no analytics, no CDN fonts, no external images. Every
  request the page makes is to a file in the list above.
- Any legal text (privacy notice, terms) is a **DRAFT** until a lawyer has read it,
  and says so at the top of its own file.
- Copy changes are Haaija's call. Ideas go in `docs/COPY-PROPOSALS.md`, not into the
  page.

See `CLAUDE.md` for the rules that apply to automated sessions on this repo.
