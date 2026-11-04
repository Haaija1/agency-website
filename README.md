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
| `dist/` | Minified output, committed. Most of what gets deployed — see [Deploy](#deploy) for the icons, `robots.txt` and `sitemap.xml` that go up from the repo root. |

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
python tools/check_xml.py                     # every .svg and .xml parses as XML
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

**`docs/DEPLOY-ALLOWLIST.md` is the source of truth** for what production serves, and
for the response headers and cache policy that go with it. If anything below disagrees
with that file, the allow-list wins. The short version:

From `dist/` — the seven home-page files, which are the set the gzip budget is measured
over:

```
index.html  styles.css  site.js  motion.js  examples.js  explorer.js  grow.js
```

Also from `dist/`, the standalone 404 page, which the home page does not load:

```
404.html  404.css
```

Deploying `404.html` is not enough on its own: the host has to be pointed at it as its
error document, and the response must carry a real `404` status rather than a `200`.

From the repo root — files the build does not touch, so they are copied up as they are:

```
robots.txt  sitemap.xml  favicon.svg  favicon-32.png  apple-touch-icon.png  og-image.png
```

`og-image.svg` is the source the PNG is baked from; serving it is optional.

**Not deployed yet:**

- `privacy.html` and `privacy.css` — the build produces them, but the privacy notice is
  a draft that has not been reviewed by a lawyer and still carries `TODO(Haaija)`
  placeholders. Only the deploy step keeps it off the live site. See §2 of the
  allow-list for the four gates it has to clear first.
- `prototypes/` — exploratory work, not part of the site. The build does not recurse
  into subfolders, so it cannot reach `dist/`; it would only arrive via a
  "copy the whole repo" deploy, which is what the allow-list says not to do.

Nothing else is served — not `tests/`, not `tools/`, not `docs/`, not the un-minified
root `.html`/`.css`/`.js`.

`contact.php`, which `index.html` posts the contact form to, is **not in this repository**
and is not produced by the build (allow-list §1c, `TODO(Haaija)`). Until it exists on the
host, a submit returns 404 and the page shows an error pointing the visitor at WhatsApp.

**Deploy by copying the allow-list, not by excluding a denylist.** Pushing to GitHub does
not publish anything by itself.

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
