# Business Process Redesign - brand assets

These replace the company's previous emblem, from before the rename. Use them only after
Haaija confirms the registered company name - everything here is built on "Business
Process Redesign" / "BPR" / bpsra.co.za per the brief, but none of it has been checked
against a CIPC registration.

## Files

- **`mark.svg`** - the hub-and-spokes mark, transparent background, slate on light. Same
  geometry as `favicon.svg`. Use on white or light surfaces: letterheads, light-mode
  documents, anywhere next to the site itself.
- **`mark-reversed.svg`** - same mark, recoloured white/light for dark or slate surfaces.
  Use on photos, dark slide backgrounds, anywhere `mark.svg` would disappear.
- **`whatsapp-profile.svg`** / **`whatsapp-profile.png`** (640x640) - WhatsApp Business
  profile photo. The mark is centred and scaled so its farthest point sits at 210px from
  centre, inside WhatsApp's circular-crop safe zone (the central 80% of the square, radius
  256px). No text - profile photos are too small and get cropped unpredictably.
- **`linkedin-banner.svg`** / **`linkedin-banner.png`** (1584x396) - LinkedIn company page
  cover banner. Mark, "Business Process Redesign", and the one approved slogan. Nothing
  starts before x=410 (the mark) or x=620 (the text), both clear of the left ~330px LinkedIn
  reserves for the profile-photo overlay. No numbers, no client names.
- **`email-signature.html`** - plain HTML/CSS email signature for the Gmail or Outlook
  signature editor. Table-based, inline styles, no images, no external requests. Name,
  slogan, and `TODO(Haaija)` placeholders for phone and email - do not fill these with
  invented values.
- **`README.md`** - this file.

## Where to use each one

| File | Use |
|---|---|
| `whatsapp-profile.png` | WhatsApp Business profile photo |
| `linkedin-banner.png` | LinkedIn company page cover banner |
| `email-signature.html` | Pasted into Gmail/Outlook signature settings |
| `mark.svg` / `mark-reversed.svg` | Source mark for any future placement not listed above |

## Colours and measured contrast

All hex values below are literal in the files (not CSS custom properties - these SVGs and
the HTML signature are loaded standalone and never see the site's `:root` tokens). Ratios
measured with `python tools/contrast.py "<fg>" "<bg>"` from the repo root; all meet WCAG AA
(4.5:1 normal text / 3:1 large text or non-text).

| Foreground | Background | Pair | Ratio | Used in |
|---|---|---|---|---|
| `#2f3b52` (slate / site `--ink`, `--primary`) | `#ffffff` | ink on white | **11.24:1** | `mark.svg` hub+nodes; email signature name/company |
| `#5c677b` (site `--ink-muted`) | `#ffffff` | muted ink on white | **5.70:1** | `mark.svg` spokes; email signature contact line and opt-out line |
| `#1f5bc0` (site `--link`) | `#ffffff` | link blue on white | **6.33:1** | email signature website link |
| `#ffffff` | `#2f3b52` (slate) | white on slate | **11.24:1** | `mark-reversed.svg` hub+nodes; WhatsApp profile mark; LinkedIn banner heading |
| `#b8c3d9` | `#2f3b52` (slate) | light slate-blue on slate | **6.34:1** | `mark-reversed.svg` spokes; WhatsApp profile mark; LinkedIn banner slogan (26px, counts as large text; needs only 3:1) |

Slate (`#2f3b52`) and the link blue (`#1f5bc0`) are the site's own B3 palette values
(`styles.css`, the `B3-slate-cool-blue-accent` override block) - no new colours were
invented for these assets.

## Not done here

Nothing on the live site changed. No client name, client result or price appears anywhere
in this folder. The email signature's phone and email fields are left as
`TODO(Haaija)` rather than guessed.
