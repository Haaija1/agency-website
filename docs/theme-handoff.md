# Theme handoff: spiderweb restyle

Branch: `claude/zealous-planck-icfsm7` (built on `claude/serene-pascal-5d126v`).
`docs/site-research.md` is read-only reference: don't edit it. The newest copy is on
`claude/award-winning-website-research-1mg92j`.

## Restore points
- Orange hero only: `backup/v1-hero-2026-09-30/index.html`
- Full orange site (fallback copy, opens standalone): `backup/v2-orange-full-site-2026-09-30/`
- Full orange site on its own branch: `claude/serene-pascal-5d126v`
- Willie has approved the spiderweb look for the demo build (2026-09-30).

## What changed (pass 1)
| Area | Change |
|---|---|
| Tokens (`styles.css` `:root`) | Dark blue-grey + white + ice-blue accent. New: `--action` (white buttons), `--web` (web strands), `--r` (radius) |
| Canvas | Faint dot grid on `body`, like a workflow editor |
| Hero | Woven-thread motif replaced by a generated spiderweb SVG (`.weave-hero__web`), drawn in with CSS, static under reduced motion |
| Process | Steps are now node cards with ports and wires between them (wide screens only) |
| Surfaces | Cards, form inputs, buttons rounded; primary buttons white |
| Unchanged | All copy, structure, `contact.php`, `site.js`, fonts, the Thread, Show the week logic |

Checked in Chromium at 1440, 1000, 768, 390 and 320 px: no horizontal overflow; text/border
contrast passes WCAG AA (body text >= 7.2:1, field borders >= 3.6:1); reduced motion shows the
finished web. Not yet seen in Firefox or Safari.

## Still provisional: the Weave app's real tokens
The colours above are my reading of "white and dark grey/blue spiderweb". Replace them with the
app's actual values from `apps/web/src` (Tailwind config / global CSS / theme tokens). Fill in:

| Token | Current | Weave app value |
|---|---|---|
| `--pbg` (page) | `#0d1320` | ? |
| `--bg-2` (cards) | `#131b2b` | ? |
| `--ink` (text) | `#f3f6fb` | ? |
| `--accent` | `#8fb2ff` | ? |
| `--line` | `#26324a` | ? |
| Heading / body fonts | Space Grotesk / IBM Plex Sans | ? |
| Node card radius, port style | 12px, 10px ring | ? |

## Suggested split so two agents don't collide
- **Claude:** `styles.css` theme and layout, hero web, node/wire visuals, hero + process markup.
- **Dave:** fill the table above from the app; then the content items from the research that
  are not built yet: "how pricing works" note (A.3), click-only Calendly button (A.4), POPIA
  notice + `privacy.html` (A.1, A.2), proof strip, custom 404. Use a separate branch and keep
  edits to `index.html` inside the Services and Contact sections plus new files.
- Needs the user: approved Eyecatchers figures, company legal details, a South African privacy
  professional's review before anything says "POPIA compliant".
