# DEPLOY ALLOWLIST - DRAFT

**DRAFT - not reviewed. Nothing here has been tested against the real host.** It is a list and a
set of recommendations, written from what is in this repository. No server names, hostnames, IP
addresses, control-panel paths or credentials appear in this file, and none should ever be added
to it: this repository is public.

Written 4 Nov 2026 by session S2 of the rebrand. Companion to `docs/REBRAND-BRIEF.md`.

---

## 1. What production serves

The site is static. Production serves a **small, explicit list of files** and nothing else. If a
file is not named below, it is not deployed.

Two groups, because they come from two places.

### 1a. From `dist/` - the minified site

`node tools/build_dist.js .` writes these. They are what a visitor actually downloads.

| Served path | From | Notes |
|---|---|---|
| `/index.html` | `dist/index.html` | the home page |
| `/styles.css` | `dist/styles.css` | every page uses it |
| `/site.js` | `dist/site.js` | |
| `/motion.js` | `dist/motion.js` | `weave-motion.js` until S1's rename lands |
| `/examples.js` | `dist/examples.js` | `weave-examples.js` until S1's rename lands |
| `/explorer.js` | `dist/explorer.js` | `weave-explorer.js` until S1's rename lands |
| `/grow.js` | `dist/grow.js` | `weave-grow.js` until S1's rename lands |
| `/privacy.html` | `dist/privacy.html` | **not yet** - see §2 |
| `/privacy.css` | `dist/privacy.css` | **not yet** - see §2 |
| `/404.html` | `dist/404.html` | served as the 404 body, not linked from anywhere |
| `/404.css` | `dist/404.css` | |

`build_dist.js` walks the repo root and minifies every `.html`, `.css` and `.js` it finds, so the
four new page files above are picked up with no change to the build. Confirmed by running it.

### 1b. From the repo root - files the build does not touch

`build_dist.js` has no handler for these extensions, so they are **not** copied into `dist/` and
must be deployed from the repo root.

| Served path | Notes |
|---|---|
| `/robots.txt` | allows everything; points at the sitemap |
| `/sitemap.xml` | home page only |
| `/favicon.svg` | the hub-and-spokes mark |
| `/favicon-32.png` | 32x32 fallback for browsers that will not take an SVG icon |
| `/apple-touch-icon.png` | 180x180, full-bleed; iOS applies its own corner mask |
| `/og-image.png` | 1200x630 share image - this is the one `og:image` must point at |
| `/og-image.svg` | the source the PNG is baked from; serving it is optional |

### 1c. Not in this repository, but the site needs it

| Served path | Status |
|---|---|
| `/contact.php` | **TODO(Haaija)** |

`index.html` posts the contact form to `contact.php` (`<form action="contact.php" method="post">`,
and `site.js` fetches the same path). That file is **not in this repository** and is not produced
by the build. Deploying the allowlist above and nothing else gives a contact form that returns 404
on submit. Before launch: decide where `contact.php` comes from, who reviews it, and how it is
deployed - and keep it out of this public repo if it holds a mailbox address or any other secret.

---

## 2. Hold `privacy.html` back until it is approved

`privacy.html` is a **draft POPIA notice that has not been reviewed by a lawyer**. It carries a
visible draft banner and `<meta name="robots" content="noindex">`, and `sitemap.xml` deliberately
leaves it out.

Do not link it from `index.html` and do not announce it, until:

1. every `TODO(Haaija)` in it is answered (registered name, registration number, registered
   address, Information Officer, the privacy contact address, the hosting and email providers,
   the statutory retention period, the Regulator's current contact details);
2. an attorney has reviewed it;
3. the draft banner, the status block and the `noindex` meta are removed;
4. the `<url>` block commented into `sitemap.xml` is uncommented and dated.

Serving it early is the worse of the two mistakes available here: a published privacy notice is a
representation to the public about how personal information is handled.

---

## 3. What production must NOT serve

Everything not named in §1. Specifically:

| Not served | Why |
|---|---|
| `docs/` | internal briefs, this file, copy proposals, the changelog |
| `tools/` | build and measurement scripts |
| `tests/` | test runners and fixtures |
| `prototypes/` | S3's unfinished work; not wired into the site |
| `node_modules/` | never; it is also large and full of third-party code |
| `*.md` anywhere | `README.md`, `CLAUDE.md` and everything under `docs/` |
| the un-minified root `.html`, `.css`, `.js` | the `dist/` copies are what ships; shipping both doubles the surface and lets the two drift |
| `.git/`, `.gitignore` | a served `.git/` leaks the entire history, including anything ever committed by mistake |
| `package.json`, `package-lock.json` | dependency names and versions |
| dotfiles of any kind | editor, CI and tooling config |
| `og-image.svg` | optional - see §1b; serving it is harmless, it is simply not needed |

**Deploy by copying the allowlist, not by excluding a denylist.** An allowlist fails closed: a new
internal file added next month is not served because nobody added it. A denylist fails open.

A belt-and-braces check worth running once against the live site after the first deploy:
request `/.git/config`, `/docs/REBRAND-BRIEF.md`, `/tools/build_dist.js` and `/package.json` and
confirm all four return 404. **UNVERIFIED** - DNS is not live, so this has not been run.

---

## 4. Response headers worth setting

Static site, one origin, no third-party anything. That makes a genuinely strict policy possible,
which is unusual and worth keeping.

### 4a. Content-Security-Policy

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'sha256-REPLACE_INLINE_SCRIPT_HASH';
  style-src-elem 'self';
  style-src-attr 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self';
  form-action 'self';
  frame-ancestors 'none';
  base-uri 'self';
  object-src 'none';
  upgrade-insecure-requests
```

Written on one line in the real config; wrapped here to be readable.

Four things in that policy are not obvious, and each was checked against the actual markup:

- **`script-src` needs a hash.** `index.html` has one inline `<script>` in the head - the pin
  bootstrap that sets `--pin` before first paint. `script-src 'self'` alone blocks it, and the
  hero stops pinning. Compute the hash from the exact bytes between `<script>` and `</script>`:

  ```
  python3 -c "import re,hashlib,base64;s=open('index.html',encoding='utf-8').read();b=re.search(r'<script>([\s\S]*?)</script>',s).group(1).encode();print('sha256-'+base64.b64encode(hashlib.sha256(b).digest()).decode())"
  ```

  At the time of writing that prints `sha256-Els9xpZJTEDf10XgWonHd3AbiQzQYFL0IAvnI1GRDrM=`, and
  the same value comes out of `dist/index.html`, because the build stashes script blocks and
  copies them through byte-for-byte. **That value is already stale**: S1 is editing `index.html`,
  and any change inside that block - one character of the comment included - changes the hash.
  Recompute it from the deployed `dist/index.html` as the last step before go-live, and re-check
  it whenever `index.html` changes. A wrong hash silently breaks the hero.

- **`style-src` has to allow inline attributes.** `index.html` carries 38 inline `style="..."`
  attributes (counted, not estimated). `style-src 'self'` blocks all of them. The CSP3 split
  above keeps stylesheets strict while allowing only attributes; the plain `style-src` line after
  it is the fallback for anything that does not understand the split, and must come after.
  `'unsafe-inline'` on *style* is a far smaller risk than on script, but it is still a loosening:
  if someone later wants the strict version, the fix is to move those 38 attributes into classes
  in `styles.css`, not to add a nonce.

- **`img-src` needs `data:`.** The favicon in `index.html` is an inline `data:image/svg+xml` URI,
  and `<link rel="icon">` is governed by `img-src`.

- **No host needs allowing.** The only external strings in the markup are `w3.org` (an XML
  namespace, never fetched), `schema.org` (the JSON-LD `@context`, never fetched) and `wa.me`
  (link targets - a top-level navigation, which this policy does not restrict). Verified by
  grepping `index.html`, `styles.css` and `site.js` for `http`. If anyone ever proposes adding
  analytics or a CDN font, this policy is where it will show up as a deliberate loosening, which
  is the point.

Roll it out as `Content-Security-Policy-Report-Only` first if the host makes that easy, confirm
the browser console is clean on the home page, the privacy page and a 404, then switch to
enforcing.

### 4b. The rest

| Header | Value | Why |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | stops a browser from guessing a type the server got wrong and running a file as script |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | a visitor clicking through to WhatsApp sends the origin, never the full path |
| `X-Frame-Options` | `DENY` | the older sibling of `frame-ancestors 'none'`; cheap, and still read by some tooling |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=(), interest-cohort=()` | the site uses none of them; say so |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | **only once HTTPS is confirmed working on every subdomain.** Setting it early locks visitors out of a site that cannot yet serve HTTPS, and the lock is cached in the browser. Add `preload` later, if ever: it is hard to undo. |
| `Cross-Origin-Opener-Policy` | `same-origin` | optional here; costs nothing on a site with no popups |

### 4c. Cache policy

The filenames carry no content hash, so caching has to be conservative or a CSS change will not
reach anyone for a year.

| What | `Cache-Control` | Why |
|---|---|---|
| `/index.html`, `/privacy.html`, `/404.html` | `no-cache` | means "revalidate every time", not "do not store". A 304 is cheap; a stale home page is not. |
| `/styles.css`, `/*.js` | `public, max-age=3600, stale-while-revalidate=86400` | an hour is short enough that a fix lands the same morning, long enough that a reader clicking through two pages does not refetch |
| `/favicon*`, `/apple-touch-icon.png`, `/og-image.*` | `public, max-age=604800` | a week; these change almost never |
| `/robots.txt`, `/sitemap.xml` | `public, max-age=86400` | a day |

If content-hashed filenames (`styles.4f2a9c.css`) are ever introduced, those files become
`public, max-age=31536000, immutable` and this table shrinks to the two HTML rows.

Also worth having on, if the host offers it: gzip or brotli for `.html`, `.css`, `.js`, `.svg` and
`.xml` - and not for `.png`, which is already compressed.

---

## 5. The gzip budget needs a decision

`CLAUDE.md` sets a budget: the gzipped total of `dist/` must be at most 40,960 bytes, measured
with `node tools/gzip_size.js dist`. Measured today, on a copy of the root in a scratch directory
so the repository's own `dist/` was left alone:

| `dist/` contents | gzipped total | against budget |
|---|---|---|
| the 7 home-page files alone (baseline) | **39,258 B** | 1,702 B of headroom |
| plus `privacy.html`, `privacy.css`, `404.html`, `404.css` | **48,165 B** | **7,205 B over** |

So merging S2's pages makes the budget check fail as it is currently written, with no change to
the home page at all. The new files are:

| File | raw | gzip |
|---|---|---|
| `privacy.html` | 18,551 B | 6,553 B |
| `privacy.css` | 3,619 B | 967 B |
| `404.html` | 2,581 B | 949 B |
| `404.css` | 1,016 B | 438 B |

**This is a measurement problem, not a weight problem.** 40,960 bytes is a budget for what a
visitor downloads to see the home page, and no home-page visitor downloads `privacy.html`. What
each page actually costs, first visit, nothing cached:

| Page | gzipped bytes over the wire |
|---|---|
| Home | 39,258 (index + styles + the 5 scripts) |
| Privacy | 16,428 (privacy.html + styles.css + privacy.css) |
| 404 | 10,295 (404.html + styles.css + 404.css) |

**Recommendation for Dave:** keep 40,960 as a *home-page* budget, measured over the seven
home-page files, and track the standalone pages separately against their own figures. That keeps
the constraint doing the job it was written for.

S2 has not changed `tools/gzip_size.js`, `CLAUDE.md` or anything else that would move the goalposts
unilaterally - the numbers are here so the call can be made deliberately.

---

## 6. How the image assets were produced

So they can be rebuilt rather than guessed at. `favicon.svg` and `og-image.svg` are the sources
and are committed; the three PNGs are baked from them with headless Chromium via Playwright, at
`deviceScaleFactor: 1` so the pixel dimensions are exactly as named:

- `favicon-32.png` - `favicon.svg` at 32x32
- `apple-touch-icon.png` - `favicon.svg` at 180x180 with `rx="7"` swapped to `rx="0"`, because iOS
  applies its own corner mask and a rounded source gets rounded twice
- `og-image.png` - `og-image.svg` at 1200x630

`og-image.svg` names Inter first in its font stack, ahead of the site's own order, so that
rasterising it is deterministic. Re-rendering on a machine without Inter installed will produce a
different-looking PNG.

The render script was not committed: it is a one-off, and `tools/` belongs to another session in
this round of work. If the icons need regenerating often, it belongs in `tools/`.

---

## 7. Before the first deploy

- [ ] `contact.php` exists on the host and the form actually delivers (§1c)
- [ ] `privacy.html` is still held back, or has cleared all four gates in §2
- [ ] `og:image` in `index.html` points at `https://bpsra.co.za/og-image.png` - S1 owns that line
- [ ] the inline-script CSP hash recomputed from the deployed `dist/index.html` (§4a)
- [ ] CSP run in report-only mode once, console clean on all three pages
- [ ] `/.git/config`, `/docs/...`, `/tools/...`, `/package.json` all return 404
- [ ] HSTS left off until HTTPS is confirmed on every subdomain (§4b)
- [ ] the gzip budget question in §5 answered one way or the other
