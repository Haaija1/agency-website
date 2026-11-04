# Rebrand brief: Weave -> Business Process Redesign (bpsra.co.za)

Written 4 Nov 2026 by Dave for Haaija. Source of truth for every cloud session on this repo. Read `CLAUDE.md` first, then this file, then `docs/V5-SPEC-AND-HANDOFF.md` (how the site works; it still says "Weave" because it is history).

## 1. Why

"Weave" is already a registered company owned by someone else, so we cannot keep the name. The new company is **Business Process Redesign** with the domain **bpsra.co.za**. The site we have (v5, approved by Willie) stays: Haaija likes how everything merges and how the whole web branches out. This job swaps the NAME and the things that spell it, and keeps every mechanism that makes the site feel alive.

Why the web still fits: a business process IS a web of steps, tools and people that branch and merge. The pinned intro branch, the page web, the cards drawn by the web and the example explorer already read as a process map. Do not redesign them. Only the words around them change.

## 2. Brand constants (use these exact strings so they stay greppable)

| Constant | Value | Status |
|---|---|---|
| Display name | `Business Process Redesign` | TODO(Haaija): he typed "Proses" by voice. Default is "Process". If the registered name differs, the new string is one search-and-replace. |
| Short name (tight spaces: hero wordmark, <=480 px header, footer) | `BPR` | TODO(Haaija): confirm. Lowercase `bpr` + `.` mirrors the old `weave.` wordmark. |
| Domain | `bpsra.co.za`, canonical `https://bpsra.co.za/` | Confirmed by Haaija. DNS is NOT live yet; do not claim it is. |
| What "BPSRA" stands for | unknown | TODO(Haaija). Never print "BPSRA" as a brand name in copy. It appears only in URLs. |
| Business email | not created yet | Keep the existing `REPLACE_BUSINESS_EMAIL` placeholder and the `hidden` contact card. Do NOT invent an address. |
| WhatsApp numbers | unchanged | Keep both `wa.me` links. Only the pre-filled text changes (no brand name needed: "Hi, I'd like to discuss automating some of our admin work."). |
| Colours, fonts, layout | unchanged (B3 slate + blue) | Do not touch. |
| Logo mark | the hub-and-spokes mark (header `.brand svg.mark`, favicon) | KEEP. It does not spell "W", so it carries over and gives continuity. |

## 3. Phase 1: the rebrand (session S1)

### 3a. Public surfaces (commit 1: "rebrand: public name")
Every place a visitor, crawler or screen reader meets the name:

- `<title>`, `<meta description>`, `og:site_name`, `og:title`, JSON-LD `name` and `description`.
- Add now that the domain is confirmed: `<link rel="canonical" href="https://bpsra.co.za/">`, `og:url`, JSON-LD `url`. Do NOT add `og:image` unless the image file exists in the repo (session S2 adds it; leave a one-line comment).
- Header `.brand` text (`<span>Weave</span>`): show `Business Process Redesign` at wide widths and `BPR` where it would wrap or crowd. The header must stay ONE row at 320 px.
- Hero wordmark (`weave.`): replace with `bpr` + the same dot treatment. The hero must not grow by more than 24 px at any of the 8 sweep widths, or the pin maths changes. If it does, shrink the wordmark, not the hero.
- Hero and About copy where the brand is the SUBJECT of a sentence ("Weave helps automate...", "Weave connects..."): rewrite with "We" ("We help automate repetitive work..."). Meaning unchanged. No new claims, no new numbers, no new services.
- The six Thread beads carry a **W glyph** (`M5 9l5 15 6-12 6 12 5-15`), which spells the old name. Replace it with a name-agnostic **merge glyph** (two strokes join into one, or a branch that splits and rejoins), as a single `<path pathLength="1">` inside the same `viewBox="3 7 26 19"` so the draw-in animation, sizing and CSS keep working unchanged. Same glyph on all six beads. This is deliberate: merging is what Haaija likes.
- `aria-label="Why Weave section"` becomes `Why we do this section` or similar; check every other aria-label and `alt`.
- Footer `© 2026 Weave` becomes `© 2026 Business Process Redesign`.
- Both `wa.me` pre-filled texts (see table).
- `README.md` still describes the old two-branch Weave hero draft. Rewrite it for what the repo is now (the v5 site under the new name, how to run tests, build `dist/`, and the 7-file deploy allow-list: index.html, styles.css, site.js, motion.js, examples.js, explorer.js, grow.js). Keep the "no secrets" and "hero is Willie's" notes.
- Do not add analytics, fonts from a CDN, or any third-party request.

### 3b. Internal names (commit 2: "rebrand: internal names", separate so it can be reverted alone)
Rename everything called `weave` to a role name that is NOT the brand, so a future rename costs nothing:
- Files: `weave-motion.js` -> `motion.js`, `weave-examples.js` -> `examples.js`, `weave-explorer.js` -> `explorer.js`, `weave-grow.js` -> `grow.js`, `tools/weave_contrast.py` -> `tools/site_contrast.py`.
- CSS classes and ids: `weave-hero*` -> `hero*` (watch for collisions with existing `hero-pin`, `.hero`), `weave-headline` -> `hero-headline`, and anything else found by `git grep -i weave`.
- JS globals: `WEAVE_PAGE`, `WEAVE_EXPLORER`, etc. -> `SITE_PAGE`, `SITE_EXPLORER`. Update every tool in `tools/` and every test that reads them (the browser sweep in `tools/sweep_widths.py` and `tools/measure_layout.js` use them).
- `<script src>` tags in `index.html`, the esbuild step in `tools/build_dist.js`, and `dist/`.
- Comments mentioning the old name.
- Leave `docs/V5-SPEC-AND-HANDOFF.md` as history, but add a first line: "HISTORY: written under the old name Weave. Current names are in docs/REBRAND-CHANGELOG.md."

### 3c. Deliverables
1. The two commits above, pushed to YOUR OWN `claude/...` branch (never `main`, never `rebrand/bpsra` itself).
2. `docs/REBRAND-CHANGELOG.md`: a table of every string/identifier changed, `file:line | old | new`, so Haaija and Dave can audit the diff.
3. `docs/COPY-PROPOSALS.md`: PROPOSALS ONLY, not applied. Haaija decides copy. Give 3 alternatives for the hero eyebrow + lede and 2 for the About paragraph that lean into "process first, automation second". Ground them in this rule from our playbook: *never automate a workflow you have not mapped; if a human cannot explain the rule clearly, an AI agent cannot run it reliably.* No numbers, no client names, no promises of results.
4. A rebuilt `dist/` (see CLAUDE.md for esbuild).

### 3d. Acceptance criteria (Dave measures these again from a fresh pull; a self-report does not count)
- [ ] `node tests/examples.test.js` and `node tests/grow.test.js` each print their explicit "all passed" line (baseline: 238 branches, 190 knots, 10,342 samples, closest 12.0 px).
- [ ] `git grep -iIl weave` lists only `docs/V5-SPEC-AND-HANDOFF.md` and `docs/REBRAND-CHANGELOG.md` (and `docs/REBRAND-BRIEF.md`). Nothing in `index.html`, `*.css`, `*.js`, `tools/`, `tests/`, `dist/`. Also zero hits for `weavewf`.
- [ ] Visible-text diff: extract the text of the old and new `index.html`; after replacing the old brand with the new one in the old text, the only remaining differences are the "We" rewrites and the aria-labels listed in the changelog.
- [ ] Gzipped total of `dist/` <= 40,960 bytes (`node tools/gzip_size.js dist`).
- [ ] The web engine logic is unchanged: `git diff -w` of `grow.js`, `explorer.js`, `motion.js`, `examples.js` against the originals shows renames only (identifiers, comments). If you must change logic, stop and write it in the changelog under "LOGIC CHANGE".
- [ ] No new network request type: `index.html` and CSS reference only local files.
- [ ] Hero height at 1440, 1270 and 1024 px is within +24 px of baseline (record the numbers).
- [ ] Header on one row at 320 px (record the measured heights).
- [ ] JSON-LD still parses (`JSON.parse`) and has `name`, `url`, `telephone`.

## 4. What S1 must NOT do
No colour, layout, animation, timing or router changes. No new sections. No new copy beyond the "We" rewrites. No client names or results. No push to `main`, no PR to `main`, no deploy, no secrets, no IPs, no server names. Do not delete anything under `docs/`.

## 5. Later phases (separate sessions, started after Phase 1 is merged and checked by Dave)
- **S2 (independent, new files only)**: privacy notice DRAFT (POPIA), 404 page, robots.txt, sitemap.xml, favicon set, share image, `docs/DEPLOY-ALLOWLIST.md`. Must not edit `index.html`.
- **S3 prototype**: a standalone "Before / After" process-redesign section built on the existing web engine, as `prototypes/before-after.html`. Not wired into `index.html`.
- **Review**: `claude ultrareview` on the integration branch.

## 6. Open questions for Haaija (placeholders are in use meanwhile)
1. Exact spelling of the registered name ("Process" vs "Proses").
2. What do the letters BPSRA stand for? Is "BPR" acceptable as the short name?
3. Business email on bpsra.co.za (a mailbox also unlocks proper SPF/DKIM/DMARC for outreach).
4. Willie is a co-founder and the hero is his: does he know about the new name?
