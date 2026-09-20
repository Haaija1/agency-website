# Agency Website

Static marketing/portfolio site. Plain HTML/CSS/JS, no framework, no build step.
Hosted on Vercel with automatic per-branch preview deploys.

## Branches & ownership split

Working in parallel without merge conflicts: each branch owns different sections of
`index.html`. Don't edit outside your own sections — reconcile at merge time via PR.

| Branch | Owner | Owns |
|---|---|---|
| `design/dave` | Haaija (design by Dave/Claude, build via Claude Code on Opus) | Services section, Case Study section, Contact section |
| `design/willie` | Willie | Hero section, About/Story section |

Adjust the split in this table if you agree on something different — just keep it written
down here so both of you know the boundary.

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

Push to any branch → Vercel auto-builds a preview URL. Push to `main` → production.
