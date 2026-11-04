# DEPLOY ALLOWLIST - DRAFT

**DRAFT - not reviewed. Nothing here has been tested against the real host.** It is a list and a
set of recommendations, written from what is in this repository. No server names, hostnames, IP
addresses, control-panel paths or credentials appear in this file, and none should ever be added
to it: this repository is public.

Written 4 Nov 2026 by session S2 of the rebrand. Companion to `docs/REBRAND-BRIEF.md`.

Updated 4 Nov 2026 by session S4 (integration), which checked every file name and every number in
here against a real build of the integrated tree. What changed: the four `weave-*.js` placeholders
in §1a are gone (S1's rename landed), §1a is split into the seven home-page files and the four
standalone-page files and checked against what `build_dist.js` actually writes, the CSP `img-src`
no longer needs `data:` and the inline-script hash is recomputed (§4a), the gzip figures in §5 are
re-measured, and the `og:image` item in §7 is ticked off.

Updated 4 Nov 2026 by session S5 (final integration), which merged S3's prototype into the tree and
changed two files. What changed in here: §1a and §3 now state, verified against the build, that
`build_dist.js` does not recurse into subfolders, so `prototypes/` is never built and never
deployed; the `/404.html` row and §7 now cover the host's error-document directive, which nothing
had mentioned and without which the 404 page is never served; §2 lists the two further
`TODO(Haaija)` periods S5 added to `privacy.html`; and §5 is re-measured after S5's two edits.
`privacy.html` and `privacy.css` are still **not** deployed, and neither is `prototypes/`.

---

## 1. What production serves

The site is static. Production serves a **small, explicit list of files** and nothing else. If a
file is not named below, it is not deployed.

Two groups, because they come from two places.

### 1a. From `dist/` - the minified site

`node tools/build_dist.js .` writes these. They are what a visitor actually downloads.

| Served path | From | Notes |
|---|---|---|
The seven **home-page** files, which is the set the gzip budget in §5 is measured over:

| Served path | From | Notes |
|---|---|---|
| `/index.html` | `dist/index.html` | the home page |
| `/styles.css` | `dist/styles.css` | every page uses it |
| `/site.js` | `dist/site.js` | |
| `/motion.js` | `dist/motion.js` | |
| `/examples.js` | `dist/examples.js` | |
| `/explorer.js` | `dist/explorer.js` | |
| `/grow.js` | `dist/grow.js` | |

Plus the two standalone pages, which the home page does not load:

| Served path | From | Notes |
|---|---|---|
| `/404.html` | `dist/404.html` | served as the 404 body, not linked from anywhere. Deploying the file is **not** enough: the host has to be told to use it - see the error-document note below |
| `/404.css` | `dist/404.css` | |
| `/privacy.html` | `dist/privacy.html` | **do not serve yet** - see §2 |
| `/privacy.css` | `dist/privacy.css` | **do not serve yet** - see §2 |

**404 handling needs one line of host config.** Uploading `404.html` does nothing on its own; the
host must be pointed at it, and the response must carry a real `404` status rather than a `200`
with an error page in the body, or crawlers index the error page as a real one. On Apache or cPanel
that is `ErrorDocument 404 /404.html` in `.htaccess`; on nginx, `error_page 404 /404.html;`. The
exact directive depends on the host, so it is **UNVERIFIED** here - §7 carries it as a checklist
item. The page's own assets are referenced root-absolute (`/styles.css`, `/404.css`,
`/favicon.svg` - checked, not assumed), so it styles correctly however deep the missing URL was,
which a relative path would not do.

These are the current, final file names: S1's rename has landed, and the four `weave-*.js` files
no longer exist anywhere in the repo or in `dist/`.

`build_dist.js` walks the repo root and minifies every `.html`, `.css` and `.js` it finds, so the
four standalone-page files above are picked up with no change to the build.

It walks that one directory and **does not recurse**: the loop reads the root with `readdirSync`
and skips anything that is not a file (`if (!fs.statSync(...).isFile()) continue;`). So the
`.html`, `.css` and `.js` files under `prototypes/before-after/` are never minified, never land in
`dist/`, and therefore cannot reach production through the build. Verified by session S5 after
merging S3: `dist/` holds the same eleven files listed above and nothing from `prototypes/`. This
matters because S3's prototype is a full page with its own stylesheet and script, and a build that
recursed would have quietly added it to the deployable set.

Checked against a real build on 4 Nov 2026 (session S4): `node tools/build_dist.js .` printed

```
built 404.css, 404.html, examples.js, explorer.js, grow.js, index.html, motion.js, privacy.css, privacy.html, site.js, styles.css
```

- eleven files, which is exactly the eleven rows in the two tables above - no more, no fewer;
- `privacy.html` and `privacy.css` are built, which is why §2 matters: the build produces them, so
  only the deploy step keeps them off the live site.

### 1b. From the repo root - files the build does not touch

`build_dist.js` has no handler for these extensions, so they are **not** copied into `dist/` and
must be deployed from the repo root.

| Served path | Notes |
|---|---|
| `/robots.txt` | allows everything; points at the sitemap |
| `/sitemap.xml` | home page only |
| `/favicon.svg` | the hub-and-spokes mark; `index.html`, `privacy.html` and `404.html` all link it |
| `/favicon-32.png` | 32x32 fallback for browsers that will not take an SVG icon; linked from `index.html` |
| `/apple-touch-icon.png` | 180x180, full-bleed; iOS applies its own corner mask; linked from `index.html` |
| `/og-image.png` | 1200x630 share image - `index.html` now points `og:image` at `https://bpsra.co.za/og-image.png`, so if this file is not deployed every shared link shows a broken card |
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
   the statutory retention period, the Regulator's current contact details, the PAIA-manual
   question, and what the host logs) - **fourteen** of them as of session S5, which added three:
   the retention period for an enquiry that does not become work, the same period as it applies to
   WhatsApp conversations, and how quickly we undertake to acknowledge a data-subject request. S5
   replaced a guessed "12 months" and a guessed "a few working days" with placeholders, because a
   retention period and a response commitment are both legal questions and neither had been
   decided. Answering these is the longest pole in §2, not a formality;
2. an attorney has reviewed it;
3. the draft banner, the status block and the `noindex` meta are removed;
4. the `<url>` block commented into `sitemap.xml` is uncommented and dated.

Serving it early is the worse of the two mistakes available here: a published privacy notice is a
representation to the public about how personal information is handled.

Session S4 integrated S2's files into `index.html` and deliberately did **not** add a link to
`privacy.html` anywhere - not in the footer, not in the nav. Verified: `grep -c privacy index.html`
returns 0. The only thing holding the page off the live site now is the deploy step, because
`build_dist.js` does build it (§1a).

---

## 3. What production must NOT serve

Everything not named in §1. Specifically:

| Not served | Why |
|---|---|
| `docs/` | internal briefs, this file, copy proposals, the changelog |
| `tools/` | build and measurement scripts |
| `tests/` | test runners and fixtures |
| `prototypes/` | S3's exploratory work, merged into the tree by S5 and **not** part of the site. `prototypes/before-after/` is a standalone page (`index.html`, `before-after.css`, `before-after.js`, two check scripts, ten PNG screenshots) that `index.html` neither links nor loads, and that the build does not reach because it does not recurse (§1a). It is here to be looked at and argued about, not served |
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
  img-src 'self';
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

  As of 4 Nov 2026, after S1's rename and S4's head changes, that prints

  ```
  sha256-np25Q1eWGmUS+L5Zz9S154rVzvgKhhF14gdBLwpTP/c=
  ```

  and the identical value comes out of `dist/index.html`, because the build stashes script blocks
  and copies them through byte-for-byte (S4 ran it on both files and compared). It replaces the
  `sha256-Els9xpZJTEDf10XgWonHd3AbiQzQYFL0IAvnI1GRDrM=` written here before S1's rename, which
  was computed from a block whose comment still said `weave-grow.js`.

  **Treat any value written in this file as provisional.** Any change inside that block - one
  character of the comment included - changes the hash. Recompute it from the deployed
  `dist/index.html` as the last step before go-live, and re-check it whenever `index.html`
  changes. A wrong hash silently breaks the hero.

- **`style-src` has to allow inline attributes.** `index.html` carries 38 inline `style="..."`
  attributes (counted, not estimated). `style-src 'self'` blocks all of them. The CSP3 split
  above keeps stylesheets strict while allowing only attributes; the plain `style-src` line after
  it is the fallback for anything that does not understand the split, and must come after.
  `'unsafe-inline'` on *style* is a far smaller risk than on script, but it is still a loosening:
  if someone later wants the strict version, the fix is to move those 38 attributes into classes
  in `styles.css`, not to add a nonce.

- **`img-src` no longer needs `data:`.** It used to: the favicon in `index.html` was an inline
  `data:image/svg+xml` URI, and `<link rel="icon">` is governed by `img-src`. Session S4 replaced
  that inline icon with links to the real `favicon.svg`, `favicon-32.png` and
  `apple-touch-icon.png` files, so `index.html` now contains **zero** `data:` URIs (counted, not
  estimated: `grep -c 'data:image' index.html` returns 0). `img-src 'self'` is therefore enough,
  and is the stricter policy. If anyone re-introduces an inline image, `data:` has to come back.

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
with `node tools/gzip_size.js dist`. Re-measured 4 Nov 2026 by session S4, on the integrated tree
(S1 + S2 + S4's head change), from a real `node tools/build_dist.js .` with esbuild 0.28.2:

Re-measured again 4 Nov 2026 by session S5 after its two edits, same esbuild 0.28.2, same command:

| `dist/` contents | gzipped total | against budget |
|---|---|---|
| the 7 home-page files alone | **39,328 B** | 1,632 B of headroom |
| all 11 files, i.e. `node tools/gzip_size.js dist` as written | **48,298 B** | **7,338 B over** |

The seven files counted, which is the set the budget is measured over: `index.html` (8,140 B gzip),
`styles.css` (8,925), `grow.js` (10,599), `explorer.js` (6,256), `examples.js` (2,515),
`motion.js` (1,504), `site.js` (1,389).

S5's two edits cost **+26 B** on the home page (39,302 -> 39,328): the footer slogan plus the
JSON-LD `slogan` line, less the footer text they replaced. `privacy.html` grew **+60 B** gzipped
(6,553 -> 6,613) from the three `TODO(Haaija)` placeholders, and it is not deployed.

So merging S2's pages makes the budget check fail as it is currently written, with no change to
the home page at all. The four standalone-page files are:

| File | raw | gzip |
|---|---|---|
| `privacy.html` | 18,864 B | 6,613 B |
| `privacy.css` | 3,634 B | 970 B |
| `404.html` | 2,581 B | 949 B |
| `404.css` | 1,016 B | 438 B |

8,970 B gzipped between them, which is the whole of the overshoot.

### What S4's head change cost

Nothing - it paid. Measured on the same tree before and after, over the seven home-page files:

| | gzipped total | headroom |
|---|---|---|
| before (S1's `index.html`) | 39,378 B | 1,582 B |
| after (S4: `og:image` set, inline data-URI favicon replaced with file links) | **39,302 B** | **1,658 B** |

A net **76 B saved**: the three new `og:image*` tags and the three `<link rel="icon">` lines are
smaller than the ~920-byte inline `data:image/svg+xml` favicon they replaced.

S2 recorded 39,258 B for the seven files where S4 measures 39,378 B for the same pre-change tree,
a 120 B difference. It sits with S2's build: S4's esbuild 0.28.2 reproduces S1's committed `dist/`
byte-for-byte for all six files S4 did not touch (after the rebuild, `git diff dist/` lists only
`dist/index.html`), and S4 measures `privacy.css` at 3,634 B raw where S2 recorded 3,619 B - the
same source, two minifier versions. It changes nothing about the verdict - both figures are under
budget, and both agree the four page files are what pushes the whole-`dist/` number over - but the
two numbers are left side by side rather than quietly reconciled, so it is visible that the
measurement is only reproducible to about ±120 B while esbuild is installed with `--no-save` and
unpinned. Pinning the version in `package.json` would be worth a few minutes.

**This is a measurement problem, not a weight problem.** 40,960 bytes is a budget for what a
visitor downloads to see the home page, and no home-page visitor downloads `privacy.html`. What
each page actually costs, first visit, nothing cached:

| Page | gzipped bytes over the wire |
|---|---|
| Home | 39,328 (index + styles + the 5 scripts) |
| Privacy | 16,508 (privacy.html + styles.css + privacy.css) - not deployed |
| 404 | 10,312 (404.html + styles.css + 404.css) |

**Recommendation for Dave:** keep 40,960 as a *home-page* budget, measured over the seven
home-page files, and track the standalone pages separately against their own figures. That keeps
the constraint doing the job it was written for.

S5 agrees with S4 and did not change the tool or the budget either. Note that the headroom is now
1,632 B and has shrunk in both of the last two sessions. It is enough, but it is not a lot: the
next person to add markup to the home page should re-measure rather than assume.

Neither S2 nor S4 has changed `tools/gzip_size.js`, `CLAUDE.md` or anything else that would move
the goalposts unilaterally - the numbers are here so the call can be made deliberately. Until Dave
makes it, read a failing `node tools/gzip_size.js dist` against the 7-file figure above, not the
11-file one.

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
- [ ] `prototypes/` is not in the uploaded set (§3). It cannot arrive via `dist/`, but it would
      arrive via a "copy the whole repo" deploy, which is exactly what §3 says not to do
- [ ] the host's error-document directive points at `/404.html`, and a request for a URL that does
      not exist returns the styled page **with a 404 status**, not a 200 (§1a)
- [x] `og:image` in `index.html` points at `https://bpsra.co.za/og-image.png` - done by S4, with
      `og:image:width` 1200, `og:image:height` 630 and `twitter:card` raised to
      `summary_large_image`. Still needs a real-world check once DNS is live: the card cannot be
      previewed while the domain does not resolve.
- [ ] the inline-script CSP hash recomputed from the deployed `dist/index.html` (§4a)
- [ ] CSP run in report-only mode once, console clean on all three pages
- [ ] `/.git/config`, `/docs/...`, `/tools/...`, `/package.json` all return 404
- [ ] HSTS left off until HTTPS is confirmed on every subdomain (§4b)
- [ ] the gzip budget question in §5 answered one way or the other
