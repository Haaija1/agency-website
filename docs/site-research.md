# Weave site research: features worth borrowing

Research only. No site code was changed. Prepared 2026-09-29 for Haaija and Willie.

## 0. Method and limits (read first)

- **Nothing here was viewed first-hand.** The environment's network policy refused every direct page fetch (awwwards.com, cssdesignawards.com, thefwa.com, n8n.io, lindy.ai, relevanceai.com, zapier.com, developer.mozilla.org, web.dev, hontran.dev, veloxthemes.com, line25.com and webflow.com). Web search still worked, so every finding comes from **search-result summaries and snippets**. Treat them as leads to confirm, not as screenshots.
- **Observed vs. recommended.** Sections 1 and 2 record what sources say (observed). Section 3 is my judgment. Effort (S ≤ ½ day, M 1–3 days, L > 3 days) and impact ratings are my estimates. Anything marked **(J)** is judgment.
- **Confidence:** High = several independent results agree. Med = one credible page. Low = a single summary, a vendor blog, or a site's own marketing claim.
- **Sources disagreed** on: Oryzo AI's Site of the Month (April vs May 2026); Fourmula AI's Site of the Day (May 2 vs Jun 4); Cerebrium's Site of the Day (Sep 10 vs 11); MindMarket (a January Site of the Month with a March Site of the Day). Cerebrium, Studio Loop and Mind Robotics also show "Nominee" page titles while another result lists a Site of the Day date. Award dates and levels below are "as reported".
- **Competitor numbers** (prices, hours saved, resolution rates) are the competitors' own marketing claims.

## 1. Where the site is today (observed in `index.html`)

- One section: the Hero. Dark palette, Space Grotesk / IBM Plex, orange accent. Already mobile-aware (`clamp()`, `100svh`, a 760px breakpoint) and guards the CTA transition with `prefers-reduced-motion`.
- No nav, footer or other sections. The CTA points at `#contact`, which doesn't exist yet.
- Fonts load from the Google Fonts CDN.
- `<head>` has title, description, theme-color and an inline favicon only. There are no Open Graph/Twitter tags, canonical URL or structured data.

**Contrast of the shared brand tokens** (computed locally with the WCAG formula; the script is not committed):

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on `--pbg` | 17.22:1 | Pass |
| `--muted` on `--pbg` / `--bg-2` | 6.66:1 / 6.39:1 | Pass |
| `--accent` on `--pbg` (and CTA label `--pbg` on `--accent`) | 6.83:1 | Pass |
| `--muted-2` on `--pbg` / `--bg-2` | 3.82:1 / 3.66:1 | **Fails AA for normal-size text** (needs 4.5:1); large text only |
| `--accent-dim` on `--pbg` | 2.10:1 | Fails everything: decoration only |
| `--line` on `--pbg` | 1.32:1 | Fine for decorative rules; **too faint for form-field borders** (WCAG non-text contrast wants 3:1) |

## 2. What we found (observed)

### 2.1 Award winners

Seven analysed, three identified but not analysed (no feature detail was retrievable).

| Site | Recognition (as reported) | What it does best | Confidence |
|---|---|---|---|
| [Oryzo AI](https://www.awwwards.com/sites/oryzo-ai) (Lusion) | Awwwards Site of the Day, Developer Award, Site of the Month (Apr or May 2026) | • Product as a story: scroll moves a camera through real Z-depth instead of sliding 2D layers<br>• Hero object has weight and inertia (physics-style easing)<br>• Premium restraint: the aim was to make people "look at the product, believe the framing"; a 7-part behind-the-scenes series ([part 1](https://blog.lusion.co/oryzo-bts-part-1-7-concept-and-creative-direction), [part 3](https://blog.lusion.co/oryzo-bts-part-3-7-website-ux-ui-and-illustrations)) turns the craft into content | Med–High |
| [MindMarket](https://www.awwwards.com/mindmarket-case-study.html) | Awwwards Site of the Month Jan 2026; Site of the Day date reported inconsistently | • One idea ("the thread") drives brand, UX and code: a path draws itself as you scroll<br>• SVGs hand-placed per breakpoint (85 homepage elements) so the rhythm survives resizing<br>• Speaks "the language of people", not data | Med |
| [Cerebrium](https://tympanus.net/codrops/2026/07/23/building-cerebrium-making-serverless-infrastructure-tangible/) (KOKI-KIKO) | Reported Site of the Day + Developer Award, Sep 2026; award status unverified | • Makes an abstract service tangible with interactive 3D instead of diagrams<br>• Every interaction mirrors the product's traits (fast, precise, modular)<br>• Build lesson: a WebGPU/TSL version took ~20 s to compile shaders on load, so they moved back to WebGL | Med (the write-up is solid; the award status isn't) |
| [Cyera AI Guardian](https://thefwa.com/cases/cyera-ai-guardian) (Active Theory) | FWA of the Day, Sep 2026 | • Explains a three-part offer as a playable journey: pilot a vessel through three planets (Discover, Govern, Protect)<br>• Mini-games embedded in the explanation<br>• One planet per pillar gives it a clear structure | Med |
| [By-Kin](https://www.hontran.dev/blog/by-kin-case-study-award-winning-website) (UK studio) | Awwwards Site of the Day + Developer Award, FWA, CSSDA Website of the Day (dates not verified) | • Restraint: editorial typography, transitions that never call attention to themselves<br>• A "single continuous surface" feel<br>• CMS-driven (Next.js, GSAP, Strapi) | Med–Low (one blog, via snippet) |
| [Messenger](https://www.awwwards.com/sites/messenger) (Abeto) | Awwwards Site of the Year 2025 (launch date not verified; may pre-date the 12-month window) | • Delight in a tiny world instead of a hero video<br>• Strict byte budget: 5.7 MB initial load, about 17.5 MB max, runs on mobile ([showcase](https://www.webgpu.com/showcase/messenger/))<br>• Light multiplayer presence (see other players, wave with emoji) | Med |
| [Fourmula AI](https://www.awwwards.com/sites/fourmula-ai) (Fourmeta Agency) | Awwwards Site of the Day (May or Jun 2026) | • Near-black (#020108) + orange (#FF6B02) palette: the same dark/orange pairing as Weave, so it demonstrably works at award level<br>• The Awwwards summary lists a micro-interaction kit (loader, menu transitions, animated footer, animated 404, scroll effects), but it's ambiguous whether those tags belong to Fourmula AI or to the agency's own site<br>• Built in Webflow + GSAP | Med–Low |
| [Studio Loop](https://www.awwwards.com/sites/studio-loop) | Reported Site of the Day, Sep 12, 2026 | Not analysed. Described as a multi-craft studio (video, design, motion, 3D, AI). | Low |
| [Mind Robotics](https://www.awwwards.com/sites/mind-robotics) | Reported Site of the Day, Sep 24, 2026; index shows "Nominee" | Not analysed. | Low |
| [Butter](https://www.awwwards.com/sites/butter) | Reported Site of the Day, Sep 28, 2026 | Not analysed. A video editor where creatives remix custom tools on the timeline. | Low |

**Pattern across the winners:** each is organised around one idea (a thread, three planets, a product story), keeps motion in service of that idea, and treats performance as a design constraint. Most rely on Three.js or GSAP, which isn't our stack. The transferable part is the organising idea, not the technology.

### 2.2 Direct competitors (AI automation for SMBs)

| Agency | What it does best | Notes |
|---|---|---|
| [AutomateNexus](https://automatenexus.com/) | • Ownership-based pricing: one-time builds from $2,500 (typical $7,500); the client supplies their own AI keys, so ongoing cost is only $30–150/mo model usage, with no lock-in<br>• A free AI-automation audit is the front door<br>• 2–4 week delivery; an industries-served list plus city landing pages (Atlanta, Austin, New York), i.e. programmatic location SEO | [Clutch profile](https://clutch.co/profile/automatenexus) (3 reviews) |
| [Cohevo](https://www.cohevo.co/blog/ai-automation-agency-small-business) | • One named programme: a 60-day "Business OS Setup" in four phases (Map, Design, Build, Train)<br>• Five named deliverables and "you own everything"<br>• States the client time needed (2–4 hrs/week); the CTA is a 30-minute audit call | No prices on the pages surfaced |
| [CodLinex](https://www.codlinex.com/) | • Three published tiers with prices ($497 / $997 / $2,497 per month) and a "most popular" flag<br>• 30-day money-back guarantee and a 48-hour setup promise<br>• A 2-minute, 5-question [Business Automation Audit](https://www.codlinex.com/audit) as lead capture | "91% auto-resolution" and "23 hours saved/week" are self-reported |
| [AY Automate](https://www.ayautomate.com/services/ai-automation-agency) | • Four-step process (audit, build, deploy, maintain), stressing it ships into the client's own systems, not a demo<br>• Five published [case studies](https://www.ayautomate.com/case-studies)<br>• Sharp positioning: "9 in 10 AI pilots never reach production" | |
| [LOW/CODE Agency](https://www.lowcode.agency/case-studies) | • Case studies lead with a hard metric (75% admin-time cut; 40% fewer support inquiries)<br>• An interactive [Smart Cost Calculator](https://www.lowcode.agency/smart-cost-calculator)<br>• Proof by dogfooding: 17 internal AI "employees", about 20 CEO hours a month recovered | [Clutch](https://clutch.co/profile/lowcode-agency): 34 reviews |
| [DestiLabs](https://www.destilabs.com/) | • Case studies across industries with outcomes (67% fewer support requests, 3x reply rates)<br>• Prices discussed openly in content: proof of concept $8k–25k, single-workflow agents $35k–70k (above typical SMB budgets)<br>• "Prioritise use cases by payback before code" | [Clutch](https://clutch.co/profile/destilabs): 20–23 reviews (summaries differ), 5.0 avg |
| [Rex Automaton](https://rexautomaton.com/) | • Risk language buyers understand: shadow mode first, then live with caps and a pause switch; rollback and runbook; "buy pilots, not lab demos"<br>• Fixed-fee quotes, first measurable win in 2–4 weeks<br>• Named founder ([About](https://rexautomaton.com/about)), 150+ businesses since 2018, a stated ideal client ($500K–$10M revenue) | |
| [LuMay](https://www.lumay.ai/) | • Four-step framing: map opportunities, deploy agents, integrate, scale<br>• A dedicated [SMB page](https://www.lumay.ai/resources/smb-solutions)<br>• Blends agency and product (visual workflow builder); enterprise-leaning tone | Least detail retrieved |

**Cross-cutting patterns:**

1. Every agency offers a low-commitment first step: a free audit, a 30-minute call or a 2-minute quiz.
2. The process is always 3–4 named steps with visible deliverables.
3. Risk reversal is the differentiator: a guarantee (CodLinex), ownership and no lock-in (AutomateNexus, Cohevo), shadow mode and rollback (Rex).
4. Proof leads with a number, and review profiles (Clutch) do the third-party work.
5. Pricing ranges from published tiers (CodLinex), to "from" prices (AutomateNexus), to ranges buried in blog posts (DestiLabs), to none (Cohevo).
6. Seven of the eight host a "best AI automation agencies" article on their own domain (all except LOW/CODE). These are self-published, so they aren't independent rankings; it's a crowded SEO play.

### 2.3 Adjacent products (pattern reference only)

| Product | What it does best | Confidence |
|---|---|---|
| Zapier | Via third-party design analyses ([getdesign.md](https://getdesign.md/zapier/design-md), [Solid Digital](https://www.soliddigital.com/resources/inspiring-ai-product-website-designs-that-make-you-want-to-use-the-tool/)), not viewed:<br>• Horizontal tabs let visitors self-select by use case<br>• An AI prompt box in the hero turns a vague idea into a starting point<br>• A "wall of impact" of metrics plus G2 badges; a warm, paper-like beige instead of dark | Med–Low |
| Relevance AI | • Frames automation as an "AI Workforce" of narrow, named roles (Lead Researcher, Outbound Prospector, Deal Reviewer); the source is a competitor's comparison post ([Lindy](https://www.lindy.ai/blog/relevanceai-vs-n8n))<br>• Catalogued for animation, parallax and pattern styling ([Pure Landing](https://purelanding.page/inspirations/relevance-ai-build-your-ai-workforce-ai-for-business)) | Low |
| Linear / Attio / ElevenLabs | "Product is the demo": the hero shows the product acting (a Linear agent picks up an issue; Attio runs "Ask Attio"; ElevenLabs plays a voice sample on hover). One article ([Stan](https://www.stan.vision/journal/saas-website-design)). | Low–Med |
| n8n | **Not analysed.** Only gallery listings surfaced ([Saaspo](https://saaspo.com/pages/n8n-landing-page)); no design detail was retrievable. | n/a |
| Lindy | **Barely analysed.** Catalogued as pastel colours with sans-serif type, with an integrations section ([Pure Landing](https://purelanding.page/inspirations/lindy-ai-meet-your-ai-assistant)). | n/a |

## 3. Recommendations (judgment)

Effort and impact are my estimates. **Section** shows who owns the build under the README split: Services / Case Study / Contact → Haaija, Hero / About → Willie. "Shared" means agree the owner before building.

Every item below is filtered through the constraints: vanilla HTML/CSS/JS, no build step, works on cPanel, no heavy libraries, honours `prefers-reduced-motion`, mobile-first, uses the existing brand tokens.

### 3.1 Feature table

**Hero, scroll and motion**

| Feature | Seen on | Why it works | Effort | Impact | Section |
|---|---|---|---|---|---|
| Proof strip under the hero: 3–4 one-line proof points linking to the case study | CodLinex, LOW/CODE, AY Automate lead with proof | Answers "does this work?" in the first scroll (J). Use qualitative wording until the client signs off numbers. | S | High | Hero (Willie) |
| Live-workflow hero visual: a small looping SVG/CSS animation of messy inputs becoming one clean flow | Linear/Attio "product is the demo"; Cerebrium "make it tangible" | Shows automation working instead of describing it, and needs no 3D library (J) | M | High | Hero (Willie) |
| Scroll-drawn thread (see 3.3) | MindMarket | One organising idea that ties the sections together and doubles as progress | M | High | Shared |
| CSS scroll reveals (`animation-timeline: view()`) with an IntersectionObserver fallback | By-Kin's restrained transitions | Motion that clarifies instead of decorating. Chrome/Edge 115+ and Safari 26+ support it; stable Firefox does not (as of Firefox 152) ([guide](https://cssawwwards.com/blog/css-scroll-driven-animations-guide-2026)). Use it as progressive enhancement. | S | Med | Shared |
| One motion idea per section, no more | By-Kin | Keeps the page fast and readable (J) | S | Med | Shared |
| Variable-weight display type on scroll | Kinetic-type trend roundups | Adds life to the headline. Only worth it if the self-hosted Space Grotesk file has a weight axis (an [Adobe Fonts variable version](https://fonts.adobe.com/fonts/space-grotesk-variable) exists; confirm for the file we host). | S–M | Low–Med | Hero (Willie), optional |
| Cross-document view transitions between pages (`@view-transition { navigation: auto; }`) | Echoes By-Kin's "continuous surface" | Native and non-breaking: browsers without support just navigate normally. Supported in Chromium and Safari 18.2+; Firefox status is unclear ([CSS-Tricks](https://css-tricks.com/cross-document-view-transitions-part-1/)). Only matters if the site goes multi-page. | S | Low–Med | Shared |
| Micro-interaction kit: custom 404 (`ErrorDocument`), footer flourish, menu transition | Fourmula AI / Fourmeta (the summary doesn't say which site) | Small polish that signals craft at low cost | S each | Low–Med | Shared |

**Services**

| Feature | Seen on | Why it works | Effort | Impact | Section |
|---|---|---|---|---|---|
| Use-case tabs ("What do you want to automate?") showing example workflows | Zapier's self-segmenting tabs | Fits the niche-agnostic copy rule: visitors pick a job, not an industry (J) | S–M | High | Services (Haaija) |
| Four-tier ladder: "from" price or range, what's included, "best for" line; custom scope via contact | CodLinex tiers; AutomateNexus "from $2,500"; [pricing-transparency guidance](https://www.glencoyne.com/guides/pricing-transparency-services) | Sources say published pricing pre-qualifies leads and shortens the sales cycle; the hybrid (publish low/mid tiers, gate custom) is the common advice. Needs a pricing decision (see 3.7). | S | High | Services (Haaija) |
| "How it works" strip: 3–4 steps, each with a deliverable and the client's time commitment | Cohevo (Map/Design/Build/Train, 5 deliverables, 2–4 hrs/week); AY Automate; LuMay | Makes the unknown concrete; every competitor does it | S | High | Services (Haaija) |
| Risk-reversal band: you own it, pilot first, pause switch and rollback, guarantee | Rex Automaton, AutomateNexus, Cohevo, CodLinex | Addresses the biggest SMB fear. The copy must match Weave's real terms. | S | High | Services (Haaija) |
| Hours-saved / ROI calculator (hours per week, hourly cost, team size, complexity, ramp time) | LOW/CODE calculator; [ROI framework](https://solvspot.com/blog/ai-automation-roi-estimation) | Turns "AI" into a number the visitor typed. Show assumptions and avoid false precision. | M | High | Services (Haaija) |
| Role-style names for automations ("Lead follow-up", "Invoice chaser") | Relevance AI's role framing | Makes automation legible to non-technical buyers (J) | S | Med | Services (Haaija) |

**Case study**

| Feature | Seen on | Why it works | Effort | Impact | Section |
|---|---|---|---|---|---|
| Redacted-by-design case study: descriptor labels, rounded or ranged figures, client-reviewed, a visible "name withheld" note | [Anonymous case-study guides](https://proofmap.com/insights/how-to-write-anonymous-case-studies) | Guides report anonymous studies are trusted nearly as much as named ones (one 2025 survey, via summary); confidentiality also lets you share more context | S | High | Case Study (Haaija) |
| Before/after week view with a toggle (see 3.3) | Metric-first case studies (LOW/CODE, DestiLabs) | Shows the change instead of asserting it | M | High | Case Study (Haaija) |
| "What we built" flow (trigger → steps → outcome) as inline SVG | AY Automate ("ships into the client's own systems") | Proves it's real, working software, not a demo (J) | S | Med | Case Study (Haaija) |
| Review-profile badge once reviews exist | Clutch on AutomateNexus, LOW/CODE, DestiLabs; G2 badges on Zapier | Third-party proof carries more weight than self-description. Needs real reviews first. | S | High later | Hero / Case Study |

**Contact**

| Feature | Seen on | Why it works | Effort | Impact | Section |
|---|---|---|---|---|---|
| 3–4 field form with honeypot and a time-to-submit check, handled by a PHP script on cPanel (PHPMailer over SMTP, SPF/DKIM set up) | [Static-form guidance](https://www.staticforms.dev/blog/spam-email-bot) | Vendor roundups report conversion falling as fields rise (about 23% at 3 fields, 17% at 5, 11% at 7; directional only). Honeypot plus a timing check is enough for low-spam sites. | S–M | High | Contact (Haaija) |
| Booking loaded only on click (Cal.com/Calendly facade) | [Calendly performance guidance](https://www.corewebvitals.io/pagespeed/speed-up-calendly-integration) | The default Calendly embed is about 250 KB of JS; loading on intent protects LCP. Benchmarks say 60–75% of B2B form submitters never reach a calendar, so offering a slot straight after submit helps. | S | Med–High | Contact (Haaija) |
| Automation Readiness Score → tier match → prefilled contact (see 3.3) | CodLinex audit; AutomateNexus free audit | Gives visitors something before asking for anything | M | High | Services / Contact (Haaija) |
| "What happens next" microcopy: response time, free call, no obligation | Cohevo's 30-minute call; AutomateNexus's free audit | Lowers the perceived cost of the first step | S | Med | Contact (Haaija) |

**Site-wide foundation**

| Feature | Seen on | Why it works | Effort | Impact | Section |
|---|---|---|---|---|---|
| Minimal sticky nav: up to 6 items plus a persistent contact CTA | [B2B navigation guidance](https://www.blendb2b.com/websites-decoded/b2b-website-navigation-best-practices) (generic convention, not award sites) | Keeps the CTA one click away. The README doesn't assign the nav; decide an owner. | S | Med | Shared |
| Self-host the fonts (woff2, preload the display face) | [Font-hosting guide](https://www.corewebvitals.io/pagespeed/self-host-google-fonts); the Hero currently loads from the Google CDN | Removes a third-party dependency and speeds up first paint. A 2022 Munich court ruled CDN-loaded Google Fonts violated GDPR without consent ([summary](https://www.fontself.app/blog/self-host-google-fonts-2026-gdpr-compliant)). | S | Med | Shared |
| Head basics: Open Graph/Twitter tags, canonical URL, JSON-LD (`Organization` / `ProfessionalService`), `sitemap.xml`, `robots.txt` | Missing from the current `<head>` | Share previews and search clarity for almost no cost (J) | S | Med | Shared |
| `.htaccess`: HTTPS redirect, compression, cache headers, HSTS | cPanel guides ([1](https://stackharbor.com/en/knowledge-base/cpperf-browser-cache-headers-vhost-htaccess/), [2](https://massivegrid.com/blog/cpanel-gzip-brotli-compression-setup/), [HSTS](https://www.todhost.com/host/knowledgebase/946/cPanel-Security-tutorial-Implementing-the-HSTS-protocol.html)) | Cheap speed and security on the hosting we already have. Confirm with the host that `mod_deflate`/`mod_expires` are enabled; Brotli only if available. Turn HSTS on only once HTTPS works everywhere. | S | Med | Shared |
| Motion policy: honour reduced-motion everywhere, plus an optional on-page motion toggle | [WCAG 2.3.3](https://dequeuniversity.com/resources/wcag2.1/2.3.3-animations-from-interactions) (AAA, so not legally required at AA) | Parallax and large motion can cause vestibular symptoms ([NN/g](https://www.nngroup.com/articles/scrolljacking-101/)) | S | Med | Shared |
| Written performance budget: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at the 75th percentile ([web.dev](https://web.dev/articles/vitals)) | Messenger's byte discipline; Cerebrium's load-time lesson | Decide before building, not after | S | High | Shared |
| Fix low-contrast tokens (see section 1) | Computed locally | `--muted-2` can't carry body text; form borders need at least 3:1 (`--muted-2` works, `--line` doesn't) | S | Med | Shared (brand tokens) |

### 3.2 Top 5 quick wins

1. **A working contact path.** A 3–4 field form, a spam-safe PHP handler and "what happens next" copy. Every CTA on the site points at `#contact`, so this unblocks the Hero. Effort S–M.
2. **"How it works" plus a risk-reversal band.** Copy-heavy, cheap and the strongest trust pattern across all eight competitors. Effort S.
3. **The four-tier ladder.** Needs one decision from you (do we show prices? see 3.7). Effort S.
4. **A half-day foundation bundle:** self-hosted fonts, head/social/JSON-LD basics, `.htaccess`, and a written performance budget. Effort S.
5. **Contrast and motion baseline:** retire `--muted-2` for body text, use 3:1 borders on inputs, and set the reduced-motion rule once for the whole site. Effort S.

### 3.3 Top 3 signature ideas

**1. The Thread.** The brand's zigzag "W" stroke, in orange, runs down the page and draws itself as you scroll, connecting Hero → Services → Case Study → Contact with small nodes that double as navigation. *Observed:* MindMarket's scroll-drawn path. *What's ours:* it is the Weave mark, it works as progress and navigation, and it ends at the contact CTA. Effort M, impact High.

**2. Automation Readiness Score.** Five questions, one screen each, ending in "your best starting point is Tier N", an estimated range of hours reclaimed (assumptions visible) and a one-click "send me this plan" that prefills the contact form. *Observed:* CodLinex's 5-question audit, AutomateNexus's free audit, LOW/CODE's calculator. Honest note: the idea itself isn't unique. What can set us apart is execution: instant result, no email wall, and a link to our own tier model. Vendor blogs claim diagnostic quizzes convert at 22–35% against 3–5% for static forms ([1](https://getaiform.com/blog/quiz-funnels-vs-static-lead-magnets-interactive-content-conversion-2026), [2](https://www.digitalapplied.com/blog/ai-lead-magnets-templates-capture-emails-guide)); treat that as directional. Effort M, impact High.

**3. Redaction as a design motif ("Show the week").** The Eyecatchers case study can't name its client, so make that a feature: the name appears as a black bar in IBM Plex Mono ("Name withheld at client's request"), and a Before / After toggle swaps a week-view timeline from manual work to the automated flow. *Observed:* anonymised-case-study guidance and metric-first case studies. *What's ours:* turning a constraint into a recognisable visual. Effort M, impact High.

### 3.4 Implementation notes (top 3)

**The Thread**
- One inline `<svg aria-hidden="true">` path with `pathLength="1"`, `stroke-dasharray: 1`, `stroke-dashoffset: 1`. Drive `stroke-dashoffset` to 0 with `animation-timeline: view()` inside `@supports (animation-timeline: view())`. Reference: [scroll-driven SVG stroke draw](https://codefronts.com/motion/css-scroll-animations/scroll-driven-svg-stroke-draw/), [how SVG line animation works](https://css-tricks.com/svg-line-animation-works/).
- Fallback where the CSS feature is missing (stable Firefox): an IntersectionObserver that adds a class, and a normal CSS transition draws the segment on entry (about 20 lines).
- `@media (prefers-reduced-motion: reduce)`: render the line fully drawn with no animation.
- **Build it as per-section segments, not one giant path.** MindMarket hand-placed its SVGs per breakpoint; a single path that has to line up with every section at every width is where this idea gets expensive. Each owner adds one `<svg class="thread-seg">` at the top of their section, so the README's ownership split still holds. On mobile, collapse to a straight line in the left gutter.
- `stroke-dashoffset` repaints each frame, so keep it to one or two animated paths at a time ([performance note](https://codefronts.com/motion/css-scroll-animations/scroll-driven-svg-stroke-draw/)).
- If the nodes act as navigation, make them real `<a href="#services">` links with visible focus styles.

**Automation Readiness Score**
- Plain `<form>` with one `<fieldset>` per step and native radio/checkbox groups. Without JavaScript it degrades to a link to the contact form.
- A small state machine of about 100 lines of JS and no library. Move focus to the new step's heading on each step; announce the result in an `aria-live="polite"` region.
- Keep answers in `sessionStorage` and read them into hidden fields in the contact form. Nothing leaves the browser until the visitor submits.
- Show the result first and ask for contact details second.
- **Needs the team's definition of the four tiers** to map scores to tiers. Hours-saved figures must be shown as estimates with the assumptions listed.

**Show the week (case study)**
- Server-rendered semantic HTML first: both states readable as a table or definition list with no JS.
- A `<button role="switch" aria-checked>` flips a `data-state="before|after"` attribute. Bars use `transform: scaleX(var(--w))`, so it animates on the compositor. Under reduced motion the swap is instant.
- Keep the data in one place (`data-*` attributes or a small JSON block) so placeholder figures can be swapped for signed-off ones without touching the layout.
- **Hard rule from the README:** no real client name or numbers without sign-off. Build with clearly marked placeholders and ship only approved figures.

### 3.5 Trends to avoid

1. **A WebGL/3D hero as the main experience** (Oryzo, Messenger, Cerebrium style). It needs a 3D library and an asset pipeline, and even the best teams hit limits: Cerebrium's build hit ~20 s shader compiles, and Messenger's whole game is held to a 5.7 MB initial budget. It also conflicts with no-build cPanel hosting and with a conversion-first page.
2. **Scroll-jacking and smooth-scroll libraries.** NN/g's testing found threats to user control, discoverability and task success ([Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/)). By-Kin's "weighted smooth scroll" is a JS pattern; skip it.
3. **Auto-forwarding carousels for proof or logos.** Users miss content that moves on before they read it (NN/g). Use a static grid.
4. **Parallax and large motion without reduced-motion handling** (see the motion policy above).
5. **"AI slop" visuals:** indigo-to-purple gradients, Inter everywhere, three identical icon cards, sparkle icons, glowing glass cards ([925 Studios](https://www.925studios.co/blog/ai-slop-design-tells), [DEV](https://dev.to/james_anderson_h/the-purple-gradient-problem-why-ai-ui-all-looks-alike-and-how-to-fix-it-3j65)). The current dark-plus-orange hero with Space Grotesk and Plex Mono sits outside that set. Protect it.
6. **Marking up FAQs for Google rich results.** Google retired FAQ rich results on May 7, 2026 ([summary](https://fennecseo.app/blog/google-faq-structured-data-update/), [The HOTH](https://www.thehoth.com/blog/google-faq-rich-results-deprecated/)). A visible FAQ is still fine for readers; don't spend effort on the markup for search snippets.
7. **Heavy third-party embeds on first load:** the default Calendly script (~250 KB) and Google's font CDN.
8. **Hover-only interactions** (custom cursors, hover reveals). They need a tap equivalent on mobile ([breakdown](https://metabole.studio/en/blog/immersive-website-examples)).
9. **Self-published "best AI automation agencies" posts and programmatic city pages** (J). Seven of eight competitors do the first and AutomateNexus does the second. They're crowded, not independent proof, and our copy is deliberately niche-agnostic.
10. **Unverifiable stats.** Competitors publish claims like "91% auto-resolution". The README already says no real numbers without sign-off; keep to that.

### 3.6 Filtered out by the constraints

- WebGL scenes and multiplayer (Oryzo, Messenger, Cerebrium, Cyera): heavy libraries, asset pipelines, mobile risk.
- GSAP, Next.js, Strapi and Webflow builds (By-Kin, Fourmula AI): not our stack, and CSS scroll-driven animations plus IntersectionObserver cover the effects recommended here.
- Programmatic city pages (AutomateNexus): see 3.5.

### 3.7 Open decisions for the team

1. **Show prices?** Sources favour publishing "from" prices or ranges for lower tiers and gating custom scope. It's a business call; CodLinex publishes, Cohevo doesn't.
2. **Single page or multi-page?** Cross-document view transitions and a dedicated case-study page only matter if it goes multi-page.
3. **Booking tool:** Cal.com, Calendly, or form-only for launch.
4. **Client sign-off** for the Eyecatchers figures, and how much detail can be shown.
5. **Owners for shared pieces:** nav, footer, `<head>`, the thread, and whether shared CSS/JS stays embedded in `index.html` (as in the Hero) or moves to `assets/` to reduce merge conflicts.
6. **The four tiers' definitions,** needed for the tier ladder and the readiness score.

## 4. Gaps and what would raise confidence

- No site was opened, so every "does X" statement is second-hand. Allowing the blocked domains would let a second pass confirm the top findings first-hand (the award pages, By-Kin, MindMarket, CodLinex, Cohevo, Rex, Zapier).
- n8n and Lindy weren't analysable. Studio Loop, Mind Robotics and Butter were identified but not analysed, so only seven of the ten award sites have real detail.
- CSS Design Awards' own pages couldn't be read; the only CSSDA winner mentioned is By-Kin, and the 2025 Website of the Year winner wasn't retrievable.
- Award dates and levels conflict between summaries (section 0).
- Navigation evidence is generic B2B guidance, not taken from award sites.
- Conversion figures (form fields, quizzes, form-to-meeting drop-off) come from vendor blogs and are directional only.
- Browser support for scroll-driven animations and view transitions comes from third-party guides dated mid-2026; recheck on caniuse before building.

## 5. Sources

**Award winners and case studies**
- Awwwards lists: [Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/), [Sites of the Month](https://www.awwwards.com/websites/sites_of_the_month/), [Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/)
- Oryzo AI: [Awwwards](https://www.awwwards.com/sites/oryzo-ai), [Awwwards post](https://x.com/awwwards/status/2043600792184099160), [Lusion project](https://lusion.co/projects/oryzo_ai/), [Codrops on Lusion](https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/), [Utsubo Three.js roundup](https://www.utsubo.com/blog/best-threejs-websites-2026)
- MindMarket: [Awwwards page](https://www.awwwards.com/sites/mindmarket), [case study](https://www.awwwards.com/mindmarket-case-study.html)
- Cerebrium: [Codrops case study](https://tympanus.net/codrops/2026/07/23/building-cerebrium-making-serverless-infrastructure-tangible/), [Awwwards page](https://www.awwwards.com/sites/cerebrium)
- Cyera AI Guardian: [FWA](https://thefwa.com/cases/cyera-ai-guardian)
- By-Kin: [case study](https://www.hontran.dev/blog/by-kin-case-study-award-winning-website), [2026 roundup](https://www.hontran.dev/blog/best-award-winning-websites-2026)
- Messenger: [Awwwards](https://www.awwwards.com/sites/messenger), [WebGPU showcase](https://www.webgpu.com/showcase/messenger/)
- Fourmula AI: [Awwwards](https://www.awwwards.com/sites/fourmula-ai), [Fourmeta project page](https://www.fourmeta.com/projects/fourmula-ai)
- Others: [Studio Loop](https://www.awwwards.com/sites/studio-loop), [Mind Robotics](https://www.awwwards.com/sites/mind-robotics), [Butter](https://www.awwwards.com/sites/butter)
- Immersive-site breakdown: [Metabole](https://metabole.studio/en/blog/immersive-website-examples)

**Competitors and adjacent products**
- [AutomateNexus](https://automatenexus.com/), [Cohevo](https://www.cohevo.co/blog/ai-automation-agency-small-business), [CodLinex](https://www.codlinex.com/), [AY Automate](https://www.ayautomate.com/services/ai-automation-agency), [LOW/CODE](https://www.lowcode.agency/case-studies), [DestiLabs](https://www.destilabs.com/), [Rex Automaton](https://rexautomaton.com/), [LuMay](https://www.lumay.ai/)
- Agency pricing context: [Taskip](https://taskip.net/ai-automation-agency-pricing/)
- Zapier: [getdesign.md](https://getdesign.md/zapier/design-md), [Solid Digital](https://www.soliddigital.com/resources/inspiring-ai-product-website-designs-that-make-you-want-to-use-the-tool/)
- Relevance AI: [workforce page](https://relevanceai.com/workforce), [Pure Landing](https://purelanding.page/inspirations/relevance-ai-build-your-ai-workforce-ai-for-business), [Lindy comparison](https://www.lindy.ai/blog/relevanceai-vs-n8n)
- SaaS hero patterns: [Stan](https://www.stan.vision/journal/saas-website-design)
- n8n and Lindy listings: [Saaspo n8n](https://saaspo.com/pages/n8n-landing-page), [Pure Landing Lindy](https://purelanding.page/inspirations/lindy-ai-meet-your-ai-assistant)

**Technique, performance, accessibility, SEO, conversion**
- Scroll-driven animations: [CSSAwwwards guide](https://cssawwwards.com/blog/css-scroll-driven-animations-guide-2026), [caniuse](https://caniuse.com/mdn-css_properties_animation-timeline_scroll), [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline)
- View transitions: [CSS-Tricks](https://css-tricks.com/cross-document-view-transitions-part-1/), [MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- SVG line drawing: [CodeFronts](https://codefronts.com/motion/css-scroll-animations/scroll-driven-svg-stroke-draw/), [CSS-Tricks](https://css-tricks.com/svg-line-animation-works/)
- Accessibility and motion: [WCAG 2.3.3 (Deque)](https://dequeuniversity.com/resources/wcag2.1/2.3.3-animations-from-interactions), [NN/g Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/)
- Core Web Vitals: [web.dev](https://web.dev/articles/vitals)
- cPanel hosting: [forms](https://www.staticforms.dev/blog/spam-email-bot), [`.htaccess` caching](https://stackharbor.com/en/knowledge-base/cpperf-browser-cache-headers-vhost-htaccess/), [compression](https://massivegrid.com/blog/cpanel-gzip-brotli-compression-setup/), [HSTS](https://www.todhost.com/host/knowledgebase/946/cPanel-Security-tutorial-Implementing-the-HSTS-protocol.html)
- Booking embeds: [CoreWebVitals.io](https://www.corewebvitals.io/pagespeed/speed-up-calendly-integration), [LoudFace](https://www.loudface.co/blog/how-to-optimize-calendly-embed-load-time-on-webflow)
- Fonts: [self-hosting guide](https://www.corewebvitals.io/pagespeed/self-host-google-fonts), [GDPR summary](https://www.fontself.app/blog/self-host-google-fonts-2026-gdpr-compliant), [Space Grotesk Variable](https://fonts.adobe.com/fonts/space-grotesk-variable)
- FAQ rich results: [Fennec SEO](https://fennecseo.app/blog/google-faq-structured-data-update/), [The HOTH](https://www.thehoth.com/blog/google-faq-rich-results-deprecated/)
- Anonymous case studies: [Proofmap](https://proofmap.com/insights/how-to-write-anonymous-case-studies), [Velocity Partners](https://velocitypartners.com/blog/how-to-write-an-anonymous-case-study-that-doesnt-suck/), [Blue Seedling](https://www.blueseedling.com/blog/how-to-make-anonymous-case-studies-your-secret-weapon/)
- Pricing transparency: [Glencoyne](https://www.glencoyne.com/guides/pricing-transparency-services), [ManyRequests](https://manyrequests.com/blog/agency-pricing-models)
- Forms and booking benchmarks: [Fluent Forms](https://fluentforms.com/online-form-statistics-facts/), [Chili Piper](https://www.chilipiper.com/post/form-conversion-rate-benchmark-report), [SkipUp](https://blog.skipup.ai/form-submission-to-meeting-booking-drop-off-rates/)
- Quizzes and lead magnets: [Dashform](https://getaiform.com/blog/quiz-funnels-vs-static-lead-magnets-interactive-content-conversion-2026), [Digital Applied](https://www.digitalapplied.com/blog/ai-lead-magnets-templates-capture-emails-guide)
- ROI calculators: [SolvSpot](https://solvspot.com/blog/ai-automation-roi-estimation), [Fusion Interactive](https://fusioninteractive.agency/resources/automation-savings-calculator/), [Swimlane](https://swimlane.com/roi-calculator/)
- Navigation: [Blend B2B](https://www.blendb2b.com/websites-decoded/b2b-website-navigation-best-practices)
- AI-design clichés: [925 Studios](https://www.925studios.co/blog/ai-slop-design-tells), [DEV Community](https://dev.to/james_anderson_h/the-purple-gradient-problem-why-ai-ui-all-looks-alike-and-how-to-fix-it-3j65)
