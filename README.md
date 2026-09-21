# Weave website

Static HTML and CSS; no build step. Based on HJ’s integrated design/dave version.

## Current page

Hero, About, four services without public pricing, a clearly labelled illustrative workflow, and WhatsApp contact at +27 73 851 6860. The WhatsApp link opens a draft; it does not send a message automatically. No enquiry form, tracking scripts, or calendar booking is configured.

Unapproved payroll client claims and metrics were removed from the public page. The workflow example is illustrative, not a customer testimonial or measured result.

## Preview

Open index.html in a browser, or serve this directory with a static server. Google Fonts needs an internet connection; system fonts provide a fallback.

## Publish to cPanel

Upload index.html and styles.css together to the correct domain document root. Do not upload .git, README.md, or the design directory. The design directory contains an earlier concept, not the current website.

Before launch, verify the domain DNS, HTTPS, and www redirect. Check the live stylesheet loads and the WhatsApp link opens the correct recipient. A GitHub push alone does not deploy the site to cPanel.

Client claims or testimonials should only be added after approval and evidence review. Add a canonical URL and social-sharing URL after the final domain is confirmed.
