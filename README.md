# Weave Agency Website

Static marketing/portfolio site. Plain HTML/CSS/JS, no framework, no build step.
The website will be hosted using cPanel. GitHub stores the website source.

## Current draft

`index.html` has: Willie's Hero section (done), a placeholder for his About/Story
(not started), and Dave/Haaija's Services, Case Study, and Contact sections (done).
All CSS lives in `styles.css` — the Hero's original inline `<style>` block was
extracted in so there's one shared stylesheet, not two. Opens directly in a browser,
no build step. Google Fonts requires an internet connection; system fonts fall back.

## Branches & ownership split

Working in parallel without merge conflicts: each branch owns different sections of
`index.html`. Don't edit outside your own sections — reconcile at merge time via PR
(push to your own branch first — merging straight to `main` skips review).

| Section | Owner | Status |
|---|---|---|
| Hero | Willie | ✅ done, merged |
| About / Story | Willie | ⏳ not started — placeholder in `index.html` |
| Services | Haaija/Dave | ✅ done |
| Case Study | Haaija/Dave | ✅ done — kept anonymized, pending real client sign-off |
| Contact | Haaija/Dave | ✅ structure done — needs real WhatsApp number, email, calendar link (see placeholders in `index.html`) |

Adjust this table as sections land — keep it accurate so neither of you builds on stale info.

## Brand tokens (shared — don't invent new ones per branch)

Source: `_MY-BUSINESS/cofounder-pitch-deck.html` (the deck that pitched Willie as cofounder).

- Fonts: **Space Grotesk** (headings), **IBM Plex Sans** (body), **IBM Plex Mono** (accents)
- Palette (dark): `--pbg:#0c0d0a`, `--bg-2:#121309`, `--ink:#f3f1e8`, `--muted:#9b9788`
  (exact accent/border colors TBD — check the full file for the rest before inventing new ones)

## Copy guidance

Niche validation (20–50 real client interviews) is not done yet — see
`AI-Agency-Kits/_MY-BUSINESS/niche-validation-tracker.md`. Keep hero/services copy
niche-agnostic for now; don't hard-commit headline copy to one vertical (e.g. "AI Ops for
Property Managers"). Lead with proof-of-work (Eyecatchers case study, redacted — no real
client name/numbers without sign-off) and the 4-tier service model instead.

## Local dev

No build step. Open `index.html` directly in a browser, or run any static server:

```
npx serve .
```

## Deploy

Publish the approved `index.html` to the website's document root using cPanel.
GitHub changes do not by themselves confirm a cPanel deployment; any automatic
deployment integration must be configured separately. This repository update
does not publish the draft to the live website.
