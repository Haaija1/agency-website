# Performance budget

Decided before building more, so new sections are checked against it instead of discovered later. Targets follow Google's Core Web Vitals "good" thresholds, measured at the 75th percentile of real visits ([web.dev](https://web.dev/articles/vitals)).

## Targets

| Measure | Target |
|---|---|
| Largest Contentful Paint (LCP) | 2.5 s or less |
| Interaction to Next Paint (INP) | 200 ms or less |
| Cumulative Layout Shift (CLS) | 0.1 or less |

## Weight and request limits (first load)

| Item | Limit | Measured 2026-09-29 |
|---|---|---|
| HTML + CSS + JS, gzipped | 40 KB | 16 KB (6.3 + 7.5 + 2.1) |
| Fonts (woff2) | 120 KB, six faces at most | 102 KB, six faces |
| Third-party requests on first load | 0 | 0 |
| Total requests on first load | 15 | 9 |
| JavaScript frameworks or animation libraries | none | none |

Fonts, CSS and JS are gzipped on the server by the `.htaccess` in this repo. Confirm compression is on after deploying: `curl -sI -H 'Accept-Encoding: gzip' https://YOUR-DOMAIN/styles.css` should show `content-encoding: gzip`. If it doesn't, the host needs `mod_deflate` enabled.

## Rules that keep us inside it

- No third-party scripts, fonts or embeds on first load. Booking widgets, if added, load only after a click.
- No layout shift: give images and embeds explicit dimensions; fonts use `font-display: swap`.
- Motion is CSS-only, one idea per section, and never runs under `prefers-reduced-motion`.
- Add a font weight only if a rule on the page really uses it.

## To verify after deploying

The numbers above were measured on a local server with no network throttling, so they show weight, not real speed.

1. Run PageSpeed Insights on the live URL (mobile) and record LCP, INP and CLS here.
2. Watch LCP in particular. The Hero's load-in animation (headline rises, strand grows) runs for about 1.3 s, and the headline is the largest element, so it counts towards LCP. If LCP is over 2.5 s on mobile, shorten or remove that intro first.
3. Re-check after any section is added.
