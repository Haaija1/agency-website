# Weave website

Static HTML, CSS and a little JavaScript; no framework, no build step. Hosted on cPanel; GitHub stores the source.

## Current page

Header with a persistent Contact button, then:

1. **Hero** (Willie): woven-thread background and load-in motion.
2. **Why Weave**: three working principles.
3. **Services**: four services, no public pricing.
4. **How it works**: four steps, each with what you get, and a "You stay in control" band.
5. **Workflow example**: a clearly labelled illustrative workflow, plus "Show the week", a Before/After toggle.
6. **Contact**: a short form (name, email, note) with WhatsApp as the other direct path.

**The Thread** is the orange line down the left, with a W-mark bead at the top of each section. It draws itself as you scroll where the browser supports scroll-driven animation, draws on entry elsewhere, and is fully drawn (no motion) when reduced motion is on or JavaScript is off.

Nothing on the page states a client name, client result or price. The workflow example and the week view are illustrative and say so. Keep it that way until the client signs off (see "Copy guidance").

## Files

| File | What it is |
|---|---|
| `index.html` | The page |
| `styles.css` | All styles, including the self-hosted `@font-face` rules |
| `site.js` | Thread fallback, form enhancement, week toggle. The page works without it. |
| `contact.php` | Receives the form and emails it |
| `contact-config.example.php` | Template for the server-only `contact-config.php` (git-ignored) |
| `.htaccess` | HTTPS redirect, compression, caching, safety headers |
| `robots.txt` | Search-engine rules |
| `assets/fonts/` | Space Grotesk, IBM Plex Sans, IBM Plex Mono (latin subset, with their OFL licences) |
| `docs/` | `site-research.md` (what informed this build), `performance-budget.md` |
| `design/` | An earlier concept. Not part of the site. |

## Preview

Static parts open straight from `index.html`. To try the contact form you need PHP:

```
php -S localhost:8000
```

Create `contact-config.php` first (see below). To see the mail instead of sending it, set `'envelope_sender' => false` in that local file and start PHP with a stand-in for sendmail: `php -d sendmail_path="cat >> /tmp/mail.txt" -S localhost:8000`. (With `envelope_sender` on, PHP adds a `-f` argument that `cat` rejects, and the form answers with its "did not send" message.)

## Turn on the contact form (cPanel)

1. In cPanel, create a mailbox on the site's own domain to send from, for example `website@yourdomain` (Email Accounts).
2. Copy `contact-config.example.php` to `contact-config.php` **on the server** and set `to` (where enquiries arrive) and `from` (that mailbox).
3. In cPanel > Email Deliverability, make sure SPF and DKIM show as valid for the domain, or notes may land in spam.
4. Send yourself a test note from the live page and check it arrives and that replying goes to the sender.

Until step 2 is done the form tells visitors it is not switched on and points them to WhatsApp, so it is safe to upload early.

How it protects the inbox: a hidden trap field, a check that the note was not sent implausibly fast, a same-site check, and at most 5 notes per person per hour. Nothing is stored. If deliverability is poor with PHP's `mail()`, the next step is sending through the mailbox's SMTP login (PHPMailer); ask before changing it.

## Publish to cPanel

Upload to the domain's document root: `index.html`, `styles.css`, `site.js`, `contact.php`, `.htaccess`, `robots.txt` and the `assets/` folder. Then create `contact-config.php` there. Do not upload `.git`, `README.md`, `docs/`, `design/` or `contact-config.example.php`.

A push to GitHub does not deploy to cPanel, and this repository does not do it for you.

### Before launch

- Domain, DNS and HTTPS work, then the `.htaccess` redirect can stay on. Pick www or non-www and uncomment that rule.
- Once the final domain is confirmed, add: `<link rel="canonical">`, `og:url` and `og:image` in `index.html`; `"url"` in the JSON-LD; `sitemap.xml` and the `Sitemap:` line in `robots.txt`.
- HSTS in `.htaccess` is switched off on purpose. Enable it only when HTTPS works everywhere, starting with a short max-age.
- Check the two WhatsApp links open the right numbers, and that the live stylesheet, script and fonts load.
- Confirm compression is on (see `docs/performance-budget.md`) and record real LCP, INP and CLS there.

## Brand tokens (shared: don't invent new ones)

Source: the cofounder pitch deck. Defined once in `:root` in `styles.css`.

- Fonts: **Space Grotesk** (headings), **IBM Plex Sans** (body), **IBM Plex Mono** (accents). Self-hosted; add a weight only if a rule really uses it.
- Palette (dark): `--pbg #0c0d0a`, `--bg-2 #121309`, `--ink #f3f1e8`, `--muted #9b9788`, `--muted-2 #726e5f`, `--accent #ff6a35`, `--accent-dim #7a3018`, `--line #2a2820`, `--line-soft #1c1c14`, `--good #8fb383`.
- Contrast rules (measured against `--pbg`): `--ink`, `--muted` and `--accent` are fine for text. **`--muted-2` (3.8:1) is not for text**; use it for control borders, which need 3:1. **`--accent-dim` (2.1:1) and `--line` (1.3:1) are decoration only.**

## Copy guidance

- Niche validation (20 to 50 real client interviews) is not done, so keep hero and services copy niche-agnostic.
- No real client name or numbers without sign-off. The "Show the week" bars are made-up proportions with no figures; when real, approved numbers exist, change the `--w` values and wording in `index.html` (the layout doesn't change). A withheld client name can use the `.redacted` style.
- The "You stay in control" band only restates what the Services copy already says. The comment above it in `index.html` lists claims worth adding once they are confirmed as real terms: client owns what is built, pilot first, pause switch and rollback, a guarantee, timelines, and the client's weekly time.

## Working on it

- **Section owners:** Hero and Why Weave: Willie. Services, How it works, Workflow example, Contact: HJ. Header, footer, `<head>`, `styles.css` tokens and the Thread are shared; agree changes before making them.
- **Adding a section to the Thread:** give the section `class="threaded"` and put one `<a class="thread-node" href="#id" aria-label="Name section">` (copy the W `<svg>` from any section) as its first child. Add `threaded--end` only to the last one.
- **Motion:** one motion idea per section, CSS-only, and inside `@media (prefers-reduced-motion: no-preference)` so it is off by default for people who ask for that.
- **Performance:** stay inside `docs/performance-budget.md`.
