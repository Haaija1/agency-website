# CLAUDE.md: rules for every Claude Code session on this repo

This repo holds the marketing site for **Business Process Redesign** (bpsra.co.za), formerly Weave. Plain HTML/CSS/JS, no framework. Read `docs/REBRAND-BRIEF.md` for the job and `docs/V5-SPEC-AND-HANDOFF.md` for how the site works.

## Where to work
- The base for this work is the branch **`rebrand/bpsra`**. If your checkout does not contain `tests/`, `tools/` and `docs/REBRAND-BRIEF.md`, run `git fetch origin rebrand/bpsra && git checkout -b <your claude/ branch> origin/rebrand/bpsra` first.
- Push ONLY to your own `claude/...` branch. Never push or open a PR against `main`. Never force-push. Never touch another branch.
- This is a public repo: no secrets, tokens, passwords, IP addresses, server names or private paths in any file or commit message.

## Hard rules
- A client name, client result or real price never appears on the site. Time-saving numbers are placeholders, always labelled "Illustrative, not a client result".
- Any legal text (privacy notice, terms) is a DRAFT. Put "DRAFT - not reviewed by a lawyer" at the top of the file and in the PR/summary. Do not present it as final.
- Do not change copy beyond what the brief allows. Put wording ideas in `docs/COPY-PROPOSALS.md`, not in the page.
- Keep: slate + blue colours, layout, pinned intro branch, page web, cards drawn by the web, example explorer, reduced-motion state, no-JS state, keyboard parity.
- No third-party requests, analytics, or CDN fonts.

## How to check your work (all run from the repo root)
- Unit tests: `node tests/examples.test.js` and `node tests/grow.test.js`. A runner that prints nothing is NOT a pass: require the explicit "all passed" line. Baseline for grow: 238 branches, 190 knots, 10,342 samples, closest 12.0 px.
- Minified build: `npm install --no-save esbuild` then `node tools/build_dist.js .` (writes `./dist`). Budget: gzipped total of `dist/` <= 40,960 bytes, measured with `node tools/gzip_size.js dist`.
- Structure / contrast: `python tools/check_structure.py`, `python tools/contrast.py` (read the file header for usage). Browser-based sweeps (`tools/sweep_widths.py`) need a real browser; if the sandbox cannot run one, say so plainly and mark those items UNVERIFIED. Never claim a check you did not run.
- Use `git grep` to prove a rename is complete; do not rely on memory.

## Pitfalls already paid for (from the v5 build)
- A "0 collisions" result on a web that did not draw is meaningless; require a live web (thousands of samples) and a negative control.
- Silent test output is not a pass.
- A fixed 10 px routing grid misses 5 px gaps at some widths; do not retune the router.
- The hero is Willie's. Do not change how it pins or behaves.

## Handoff format (end of every session)
Print: branch name, commit hashes, a VERIFIED list (what you ran and the real output) and an UNVERIFIED list (what you could not run), and anything you decided that the brief did not cover.
