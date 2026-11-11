# Demos section and organic layer

Added 11 Nov 2026 on branch `claude/demo-screenshots-organic`, on top of the rebrand branch.
**DRAFT: wording below the page headline is proposed copy for Haaija and Willie to approve.**

## What changed

| Commit | What | Revert alone? |
|---|---|---|
| 1. Demos section | New `#demos` section (before Contact), nav link "Demos" (hidden on narrow screens like "Example"), three screenshots in `demos/`, `.demo-shot` added to the router's obstacle list in `grow.js` and `tools/web_collision.js`. | yes |
| 2. Organic layer | One block at the end of `styles.css` plus `grain.svg`: rounder cards (22 to 30 px), pill buttons and fields, blue-tinted soft shadows, a faint blue wash per section, paper grain. Scoped to `.threaded` sections, so the hero is untouched. | yes, delete the block |

One number moved in `grow.js`: the block around the tool web (`.wx-field`) now has margin 8 instead of 6. Adding
the new section changed the page height, which reshuffled the seeded twigs, and at 1024 px one twig grazed the top edge of the tool web
by 0.1 px (boxHits=7). A margin of 8 keeps twigs off that edge. The sweep passes at all eight widths with it.

## The screenshots: where they came from and what was removed

Rule in `CLAUDE.md`: a client name or result never appears on the site. The demos were built for prospects who have not seen them,
so each screenshot was taken from the local demo file with the live DOM text swapped before capture (the demo source files were not edited).

| File | Demo | Removed or replaced |
|---|---|---|
| `shipment-review.webp` | Freight shipment review dashboard | The company name, its email domain and the `FX-` order prefix. Everything else is invented sample data. |
| `learner-desk-chat.webp` | Driving-school WhatsApp-style chat | School name, branch name, street address, all phone numbers, logo (hidden), avatar letter. **The course price (R 5 800) and payment plan are still the school's published figures.** Replace them if the owner could object. |
| `returns-assistant.webp` | Online-shop returns and order queries | Shop name, domain, product names. The time-saved assumptions block was hidden. The quoted return rules are still the shop's published wording, with the domain replaced. |

No client result, no real price of ours and no time-saving number appears.

To refresh a screenshot: open the demo file at the viewport noted in the commit, swap the text as above, capture, crop,
save as WebP (quality 82), and update `width`/`height` in `index.html`.

## Verified on 11 Nov 2026

- `node tests/examples.test.js`: all passed. `node tests/grow.test.js`: all passed, 238 branches, 190 knots, 10,342 samples, closest 12.0 px (unchanged).
- Width sweep (`tools/sweep_widths.py`, source `index.html`, real browser): PASS at 1440, 1280, 1024, 768, 600, 480, 390, 320. `collisions=0`, `boxHits=0`, live web (12k to 27k samples), reaches Contact, no horizontal scroll, negative control caught.
- Hero height and header height identical to the rebrand branch at 1440, 1270, 1024 and 320.
- Gzip budget over the seven home-page files: 40,832 B of 40,960 B, **128 B headroom**. The next addition will need a trim.
- `tools/check_xml.py`: all well-formed (includes `grain.svg`).

## Not verified

- Reduced motion: confirmed only that the three images load; the section was not inspected by eye. No-JS: screenshotted at 1440, the section and images render.
- Colour contrast of the new text was not run through `tools/contrast.py`.
- Screenshot images are not in the gzip budget (lazy loaded, 77 KB to 107 KB each) but are new bytes for slow phones.
- Not checked on the live host.
