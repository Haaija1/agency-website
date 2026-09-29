# Weave site research: features worth borrowing

Research only. No site code was changed. First written 2026-09-29 from search summaries; updated the same day after checking the key claims against primary sources.

## 0. Method and limits (read first)

- **Pass 1** (earlier draft) was search-only because the network was blocked. **Pass 2** (this update) opened primary sources: Awwwards' own pages, live competitor pages, W3C, Google Search Central, NN/g, MDN's browser-compat data, Google Fonts metadata and popia.co.za.
- **Labels used below.** **Verified** = read from the primary page in pass 2. **Search only** = from a search summary, not confirmed. **Judgment (J)** = my recommendation. Effort (S ≤ ½ day, M 1–3 days, L > 3 days) and impact ratings are my estimates.
- **What I could and couldn't see.** Page text came from a page-to-text summariser (`WebFetch`) and raw HTML (`curl`). A real browser wouldn't connect (it can't validate the environment proxy's certificate, and I did not bypass that). So visuals, motion and JavaScript-rendered content were **not seen**.
- **One batch was blocked.** The auto-mode classifier refused my script reading LOW/CODE (home page and calculator), DestiLabs, Rex Automaton and LuMay. I did not retry those by another route. They stay "Search only" and appear in the options in section 6.
- **Competitor numbers** (prices, hours saved, resolution rates) are the competitors' own marketing claims.

### 0.1 What verification changed

| Earlier claim | What the primary source says |
|---|---|
| Oryzo AI: Site of the Month in April or May | Site of the Day Apr 13, 2026 and Site of the Month **April 2026** |
| MindMarket: Site of the Month Jan 2026, Site of the Day Mar 5, 2026 | Site of the Day **Dec 29, 2025**, Site of the Month **Dec 2025** |
| Studio Loop: Site of the Day Sep 12 | Only a **nominee** (Sep 11, 2026); not a winner |
| Mind Robotics: Site of the Day Sep 24 | Only a **nominee** (Sep 23); the Sep 24 winner was Moto Finance (Properly Studio) |
| Cerebrium: Site of the Day Sep 10 or 11 | Sep 10, 2026 |
| By-Kin: dates unverified | 'kin's Site of the Day was **Dec 26, 2024**: outside your 12-month window, so it's no longer in the analysed set |
| Messenger: "Site of the Year 2025" | Site of the Day Nov 10, 2025 plus Developer Award, listed among Awwwards' 2025 Site of the Year winners with Lando Norris (which category isn't shown) |
| Fourmula AI: May 2 or Jun 4 | May 2, 2026; the micro-interaction features do belong to its own page |
| Cohevo: an AI-automation agency selling a "60-day Business OS" | The live homepage is a **solo tech-help service in Israel**; the 60-day programme is in a blog post. Not a direct competitor |
| CodLinex quiz "as lead capture" | It **requires your email before showing the result**; the homepage now leads with AI-search visibility ("GEO") |
| AY Automate: "9 in 10 AI pilots never reach production"; five case studies | That claim isn't on its services page; it has 5 featured case studies plus 40+ named clients, **all named** |
| Zapier: hero prompt box, use-case tabs, wall of metrics, G2 badges | Today's homepage text shows a governance-led pitch and four customer stories; **those earlier claims are not confirmed** |
| Calendly embed is "~250 KB" | Measured today: loader script ≈ 12 KB (4 KB gzipped), stylesheet ≈ 2.4 KB (0.8 KB gzipped). An older audit cited by a speed article reports a 464 KB stylesheet. The scheduling iframe itself wasn't measured |
| Firefox support for cross-document view transitions "unclear" | **Not supported** in Firefox (MDN compat data) |
| Space Grotesk weight axis "to confirm" | Confirmed variable, weight 300–700; IBM Plex Sans is variable too (width 75–100, weight 100–700; I'd previously said 85–100) |
| Cyera AI Guardian: FWA of the Day | Couldn't be verified; FWA pages don't render in my tools |
| Cerebrium's ~20 s shader-compile story | Still search-only; the Codrops article timed out three times |

## 1. Where the site is today (observed in `index.html`)

- One section: the Hero. Dark palette, Space Grotesk / IBM Plex, orange accent. Already mobile-aware (`clamp()`, `100svh`, a 760px breakpoint) and guards the CTA transition with `prefers-reduced-motion`.
- No nav, footer or other sections. The CTA points at `#contact`, which doesn't exist yet.
- Fonts load from the Google Fonts CDN.
- `<head>` has title, description, theme-color and an inline favicon only: no Open Graph/Twitter tags, canonical URL or structured data.

**Contrast of the shared brand tokens** (computed locally with the WCAG formula; the script is not committed):

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on `--pbg` | 17.22:1 | Pass |
| `--muted` on `--pbg` / `--bg-2` | 6.66:1 / 6.39:1 | Pass |
| `--accent` on `--pbg` (and CTA label `--pbg` on `--accent`) | 6.83:1 | Pass |
| `--muted-2` on `--pbg` / `--bg-2` | 3.82:1 / 3.66:1 | **Fails AA for normal-size text** (needs 4.5:1); large text only |
| `--accent-dim` on `--pbg` | 2.10:1 | Fails everything: decoration only |
| `--line` on `--pbg` | 1.32:1 | Fine for decorative rules; **too faint for form-field borders** (WCAG non-text contrast wants 3:1) |

## 2. What we found

### 2.1 Award winners (window: Sep 2025 – Sep 2026)

| Site | Recognition | What it does best | Basis |
|---|---|---|---|
| [Oryzo AI](https://www.awwwards.com/sites/oryzo-ai) (Lusion) | Site of the Day Apr 13, 2026 (7.86); Site of the Month Apr 2026; Developer Award (7.87) | • "A cinematic product story" that turns a cork coaster into a product launch<br>• Tags: WebGL, GSAP, Three.js, storytelling, transitions<br>• Palette near-black `#100904` + orange `#FF8539`<br>• Search only: camera moves through real Z-depth and the hero object has weight and inertia; a 7-part behind-the-scenes series | Verified (Awwwards); technique detail search only |
| [MindMarket](https://www.awwwards.com/mindmarket-case-study.html) (Louis Paquet, KOKI-KIKO and team) | Site of the Day Dec 29, 2025 (7.85); Site of the Month Dec 2025 | • One idea, "the thread", drives brand, UX and code<br>• A path draws itself as you scroll: three layered SVG paths via GSAP DrawSVGPlugin, synced with Locomotive Scroll<br>• 85 homepage elements hand-placed per breakpoint; Rive animations start only when scrolled into view (IntersectionObserver)<br>• Its accessibility sub-score is its lowest (6.8) | Verified (case study) |
| [Cerebrium](https://www.awwwards.com/sites/cerebrium) (KOKI-KIKO) | Site of the Day Sep 10, 2026 (7.39); developer score 7.5 | • Makes an abstract service tangible with 3D, microinteractions and data visualisation instead of diagrams<br>• Tags: WebGL, GSAP, Three.js, Cinema 4D<br>• Search only: WebGPU/TSL build took ~20 s to compile shaders, so they moved back to WebGL ([Codrops](https://tympanus.net/codrops/2026/07/23/building-cerebrium-making-serverless-infrastructure-tangible/)) | Verified (Awwwards); build story search only |
| [Messenger](https://www.awwwards.com/sites/messenger) (abeto) | Site of the Day Nov 10, 2025 (7.92); Developer Award (8.21); among Awwwards' 2025 Sites of the Year | • A small playable world instead of a hero video<br>• Strict byte budget: 5.7 MB initial load, 17.5 MB maximum, runs on mobile ([WebGPU showcase](https://www.webgpu.com/showcase/messenger/))<br>• Three.js with WebSocket multiplayer | Verified |
| [Fourmula AI](https://www.awwwards.com/sites/fourmula-ai) (Fourmeta Agency) | Site of the Day May 2, 2026 (7.27) | • Near-black `#020108` + orange `#FF6B02`: the same pairing as Weave<br>• Listed features: loading animation, navigation menu, dynamic hero, custom 404, interactive footer, scroll effects<br>• Built in Webflow + GSAP; its accessibility sub-score is its lowest (6.2) | Verified |
| [Butter](https://www.awwwards.com/websites/sites_of_the_day/) (ToyFight) | Site of the Day Sep 28, 2026 | A video editor for creatives; not opened | Listed only |
| [Studio Loop](https://www.awwwards.com/sites/studio-loop) | **Nominee** only (Sep 11, 2026; score 8.28) | "A multi-craft studio told through type, motion and a living collage"; GSAP, Next.js | Verified (status) |
| [Mind Robotics](https://www.awwwards.com/sites/mind-robotics) (OddCommon) | **Nominee** only (Sep 23, 2026; score 8.41) | Factory-floor robotics; Three.js, React, Next.js | Verified (status) |
| Cyera AI Guardian (Active Theory) | Reported FWA of the Day, Sep 2026 | Search only: a playable three-planet journey (Discover, Govern, Protect) | **Unverified** |
| ['kin](https://www.awwwards.com/sites/kin-2) (By-Kin) | Site of the Day Dec 26, 2024 + Developer Award | Restrained editorial design | Verified, but **outside the window**; reference only |

**Patterns across the verified winners:**

- **The palette is on-trend.** Two in-window winners pair near-black with orange (Oryzo, Fourmula AI), so Weave's palette is not a risk.
- **Accessibility is the weak spot.** On Awwwards' developer sub-scores it's the lowest or tied-lowest on five of the six sites I checked (Oryzo 7.0, MindMarket 6.8, Fourmula AI 6.2, 'kin 7.0, Messenger tied at 7.6; Cerebrium's lowest is markup, 6.6). These are jury scores, not audits, but doing accessibility properly is a differentiator, not a given.
- **The stack isn't ours.** GSAP appears on Oryzo, MindMarket, Cerebrium, Fourmula AI and Studio Loop; Three.js on Oryzo, Cerebrium, Messenger and Mind Robotics. The transferable part is the organising idea, not the technology.

### 2.2 Direct competitors

**Verified on the live pages:**

| Agency | What it does best | Notes |
|---|---|---|
| [AutomateNexus](https://automatenexus.com/) | • A low-price first step: "The $500 Pilot", plus a free automation audit<br>• "Five phases. Thirty days to live." and a "One costs you every year. The other, you own." rent-vs-own comparison<br>• Prices on the page: typical build $7,500, model-provider cost $30–150 per month<br>• Resources menu lists an ROI Calculator, an AI Readiness Quiz, industry checklists and an Owner's Playbook (labels seen; tools not tested) | US-focused ("Nationwide", veteran-owned); 1 form with 1 input; JSON-LD for Organization, WebSite, FAQPage and 7 Services; the uncompressed HTML alone is 293 KB (transfer size not measured) |
| [CodLinex](https://www.codlinex.com/) | • Published tiers: Starter $497, Growth $997 (labelled "most popular"), Enterprise $2,497, per month<br>• "30-day money-back guarantee and no long-term contracts"; "live within 48 hours of purchase"<br>• A [2-minute, 5-question audit](https://www.codlinex.com/audit): **email required before the result**, which recommends a plan | The homepage now leads with AI-search visibility ("Your competitor shows up in ChatGPT. You don't.") and a $299 Deep GEO Audit; a 3-step process; stats such as "91% auto-resolution" and "23 hours saved per week" are marketing claims; form has 8 inputs |
| [AY Automate](https://www.ayautomate.com/services/ai-automation-agency) | • Four steps: audit, build, deploy, maintain; "We ship into your systems, not a demo environment"<br>• Prices shown as ranges: single workflow "low four figures", 1–2 weeks; full systems scoped after the audit, 4–8 weeks; embedded placement from $60,000/year; "We do not sell fixed packages sight unseen"<br>• CTAs: free 30-minute call, "Estimate payback" (an ROI calculator) | [Case studies](https://www.ayautomate.com/case-studies): 5 featured, metrics-first (e.g. "70% Admin Time Saved • €10K+ Fines Eliminated"), plus 40+ named clients. **Every case is named.** |
| [Cohevo](https://www.cohevo.co/) | Not a direct competitor (see 0.1). Small-business patterns worth noting: **WhatsApp as the primary CTA** ("WhatsApp David"), a "Prices" link in the nav, three named packages, a 3-step "how it works" (Send me what's happening / I'll tell you what I'd do / We'll get to work), a 4-item nav | Solo tech-help service in Israel (Carmei Gat / Kiryat Gat); 66 KB uncompressed HTML; form with 6 inputs |

**Not verified first-hand (search summaries only; see options R2):**

| Agency | Reported | Status |
|---|---|---|
| [LOW/CODE Agency](https://www.lowcode.agency/case-studies) | Metric-led case studies; a [Smart Cost Calculator](https://www.lowcode.agency/smart-cost-calculator); 34 Clutch reviews | Blocked |
| [DestiLabs](https://www.destilabs.com/) | Industry case studies; prices in content (proof of concept $8k–25k, single-workflow agents $35k–70k, above typical SMB budgets) | Blocked |
| [Rex Automaton](https://rexautomaton.com/) | Shadow mode first, then live with caps and a pause switch; rollback and runbook; fixed-fee quotes; named founder | Blocked |
| [LuMay](https://www.lumay.ai/) | Four-step framing; a dedicated SMB page; enterprise-leaning | Blocked |

**Cross-cutting patterns (verified competitors only):**

1. **Every one shows some numbers.** Tiers, ranges or "from" prices appear on AutomateNexus, CodLinex, AY Automate and Cohevo.
2. **A low-risk first step is standard:** the $500 pilot, a free audit, the $299 audit, a free 30-minute call.
3. **Process is 3–5 named steps** with a time-to-live claim.
4. **Risk reversal:** a guarantee (CodLinex), ownership (AutomateNexus), "not a demo" (AY Automate).
5. **Interactive tools are table stakes.** Three of four verified sites have a calculator, payback estimator or quiz. The differentiator is how they're done (CodLinex gates the result behind email).
6. **Named clients are the norm** at AY Automate. Weave's redacted case study has to look deliberate, not evasive.
7. Seven of the eight original competitors host a "best AI automation agencies" article on their own domain (from search result URLs). These are self-published, not independent rankings.

### 2.3 Adjacent products

| Product | What it does best | Basis |
|---|---|---|
| Zapier | Today's homepage text: "Build and govern AI workflows and agents across 9,000+ apps", a three-pillar governance section (Control, Delegation, Visibility), four customer stories with measurable results, "Start free" / "Talk to sales". Earlier claims (hero prompt box, tabs, wall of metrics, G2 badges) are not confirmed | Verified (text only) |
| Relevance AI | Frames automation as an "AI Workforce" of narrow, named roles (Lead Researcher, Outbound Prospector); the source is a competitor's comparison post | Search only |
| Linear / Attio / ElevenLabs | "Product is the demo": the hero shows the product acting | Search only (one article) |
| n8n, Lindy | Not analysed | Gap |

## 3. South Africa (and beyond)

You said the market is mainly South Africa, with the door open elsewhere. That changes several things.

**Observed**

- **POPIA replaces GDPR as the privacy baseline.** [Section 18](https://popia.co.za/section-18-notification-to-data-subject-when-collecting-personal-information/) (verified) says that when you collect personal information you must tell the person the responsible party's name and address, the purpose, whether supplying it is voluntary or mandatory, the consequences of not supplying it, and their rights, including how to complain to the Information Regulator. [Section 69](https://popia.co.za/section-69-direct-marketing-by-means-of-unsolicited-electronic-communications/) (verified) says electronic direct marketing is prohibited unless the person has consented or is a customer, must offer a free and easy way to object, and must identify the sender. This is a summary of the statute, not legal advice.
- **WhatsApp is the main channel.** Two search summaries put WhatsApp at about 94–96% of South African internet users (Search only). On the verified pages, Cohevo's primary CTA is WhatsApp.
- **South African agencies sell WhatsApp automation.** Search results list DDM Technology (chatbots in English, Zulu and Afrikaans), The Digital Lab, WRIGHTSAI (Cape Town), Ezemind AI, AI Automated Solutions and Kipps.AI. **Not opened**: see option R1.
- **Page weight costs visitors money.** Summaries put mobile at roughly 70% of African web traffic and South African mobile data at about R20 per GB (Search only). AutomateNexus's uncompressed homepage HTML alone is 293 KB (verified; transfer size not measured).
- **The three verified agencies that show prices (AutomateNexus, CodLinex, AY Automate) quote in US dollars.**
- **"Solare"** (your answer to "sites you love or hate") didn't resolve to a website; see option R5.

**What I'd do about it (J)**

1. Make a **WhatsApp button** a co-primary CTA (a `wa.me` link with a prefilled message), alongside a short form and the booking link.
2. Show **prices in ZAR by default**, with an optional USD toggle for visitors elsewhere.
3. Put a **POPIA notice** next to the form covering the section 18 items, keep any newsletter tick box unticked and optional, and add a short Privacy page. Have a South African privacy professional check it.
4. Set a **mobile page-weight budget** in addition to the Core Web Vitals targets (see 4.1).
5. Later: consider local-language content, since a local agency advertises Zulu and Afrikaans chatbots (Search only).

## 4. Recommendations (judgment)

**Section** shows who owns the build under the README split: Services / Case Study / Contact → Haaija, Hero / About → Willie. "Shared" means agree the owner before building. Every item is filtered through the constraints: vanilla HTML/CSS/JS, no build step, works on cPanel, no heavy libraries, honours `prefers-reduced-motion`, mobile-first, uses the existing brand tokens.

### 4.1 Feature table

**Hero, scroll and motion**

| Feature | Seen on | Why it works | Effort | Impact | Section |
|---|---|---|---|---|---|
| Proof strip under the hero: 3–4 one-line proof points from the Eyecatchers case (approved exact figures, once you supply them) | AY Automate's metrics-first cards (verified) | Answers "does this work?" in the first scroll (J) | S | High | Hero (Willie) |
| Live-workflow hero visual: a small looping SVG/CSS animation of messy inputs becoming one clean flow | Linear/Attio (search only); Cerebrium's "make it tangible" idea (verified tags) | Shows automation working instead of describing it, with no 3D library (J) | M | High | Hero (Willie) |
| Scroll-drawn thread (see 4.3) | MindMarket (verified) | One organising idea that ties the sections together and doubles as progress | M | High | Shared |
| CSS scroll reveals (`animation-timeline: view()`) with an IntersectionObserver fallback | Award sites in general | Chrome/Edge 115+ and Safari 26+ support it; Firefox only in preview (verified in MDN's compat data), so use it as progressive enhancement | S | Med | Shared |
| One motion idea per section | Oryzo, MindMarket | Keeps the page fast and readable (J) | S | Med | Shared |
| Variable-weight display type on scroll | Kinetic-type trend (search only) | Space Grotesk has a weight axis of 300–700 (verified), so it works once the font is self-hosted; the Hero currently requests only 600 and 700 | S–M | Low–Med | Hero (Willie), optional |
| Micro-interaction kit: custom 404 (`ErrorDocument`), footer flourish, menu transition | Fourmula AI (verified) | Small polish that signals craft at low cost | S each | Low–Med | Shared |

**Services**

| Feature | Seen on | Why it works | Effort | Impact | Section |
|---|---|---|---|---|---|
| Low-risk first step (a small paid pilot or free audit) as the front door | AutomateNexus "$500 Pilot" and free audit; CodLinex $299 audit; AY Automate free 30-minute call (all verified) | Lets a cautious SMB start small; every verified competitor does it | S | High | Services (Haaija) |
| Tier ladder: "from" price or range, what's included, "best for" line | CodLinex, AutomateNexus, AY Automate (verified) | Pre-qualifies leads; every verified competitor shows numbers. Needs your pricing decision (D1) | S | High | Services (Haaija) |
| "How it works" strip: 3–5 steps, each with a deliverable, plus a time-to-live | AutomateNexus "Five phases. Thirty days to live."; AY Automate 4 steps; CodLinex 3 steps (verified) | Makes the unknown concrete | S | High | Services (Haaija) |
| Risk-reversal band: you own it, a real pilot not a demo, guarantee | AutomateNexus rent-vs-own, AY Automate "not a demo", CodLinex 30-day guarantee (verified) | Addresses the biggest SMB fear. Copy must match Weave's real terms | S | High | Services (Haaija) |
| "Pick your situation" chooser showing example workflows | AutomateNexus's industry section (verified); Zapier tabs (search only) | Fits the niche-agnostic copy rule: visitors pick a job, not an industry (J) | S–M | High | Services (Haaija) |
| Hours-saved / ROI calculator (hours per week, hourly cost, team size, complexity, ramp time) | AutomateNexus and AY Automate (verified labels/CTA); LOW/CODE (search only) | Turns "AI" into a number the visitor typed. Show assumptions | M | High | Services (Haaija) |
| Role-style names for automations ("Lead follow-up", "Invoice chaser") | Relevance AI (search only) | Makes automation legible to non-technical buyers (J) | S | Med | Services (Haaija) |

**Case study**

| Feature | Seen on | Why it works | Effort | Impact | Section |
|---|---|---|---|---|---|
| Redacted-by-design case study: name shown as a deliberate black bar, exact approved figures visible, "name withheld at client's request" | Anonymous case-study guides (search only); AY Automate names every client (verified), so ours must look intentional | Guides report anonymous studies are trusted nearly as much as named ones | S | High | Case Study (Haaija) |
| Before/after week view with a toggle (see 4.3) | AY Automate's metrics-first case cards (verified) as the pattern | Shows the change instead of asserting it | M | High | Case Study (Haaija) |
| "What we built" flow (trigger → steps → outcome) as inline SVG | AY Automate: "we ship into your systems, not a demo environment" (verified) | Proves it's working software (J) | S | Med | Case Study (Haaija) |
| Review-profile badge once reviews exist | Clutch on competitor profiles (search only) | Third-party proof; needs real reviews first | S | High later | Hero / Case Study |

**Contact**

| Feature | Seen on | Why it works | Effort | Impact | Section |
|---|---|---|---|---|---|
| WhatsApp button (`wa.me`, prefilled message) beside the form | Cohevo's primary CTA (verified); ~94–96% WhatsApp reach in SA (search only) | Meets South African visitors where they already talk (J) | S | High | Contact (Haaija) |
| Short form (3–4 fields) with honeypot and a time check; PHP handler on cPanel (PHPMailer over SMTP, SPF/DKIM) | Static HTML of three verified competitors shows forms with 1, 6 and 8 inputs; [static-form guidance](https://www.staticforms.dev/blog/spam-email-bot) (search only) | Fewer fields convert better (vendor stats, directional) | S–M | High | Contact (Haaija) |
| POPIA notice beside the form (section 18 items) and an unticked optional newsletter box (section 69) | popia.co.za (verified) | Required-style disclosure; builds trust | S | High | Contact (Haaija) |
| Calendly opened only on click (popup/link), not embedded inline | Measured: loader ≈ 4 KB gzipped, stylesheet ≈ 0.8 KB gzipped today | Keeps the first load light; iframe weight not measured, so test with Lighthouse | S | Med–High | Contact (Haaija) |
| Automation Readiness Score → tier match → "send me this plan" by WhatsApp or email (see 4.3) | CodLinex audit (verified, email-gated); AutomateNexus quiz (label only) | A calculator or quiz is table stakes; ours can be faster and ungated | M | High | Services / Contact (Haaija) |
| "What happens next" microcopy: response time, free call, no obligation | AutomateNexus "Start with a call."; CodLinex "Live in 48 hours" (verified) | Lowers the perceived cost of the first step | S | Med | Contact (Haaija) |

**Site-wide foundation**

| Feature | Seen on | Why it works | Effort | Impact | Section |
|---|---|---|---|---|---|
| Small nav (about 4–6 items) plus a persistent contact CTA | Cohevo's 4-item nav (verified); generic B2B guidance (search only); AutomateNexus's large dropdown menu is the opposite | Keeps the CTA one click away. The README doesn't assign the nav | S | Med | Shared |
| Self-host the fonts (woff2, preload the display face) | The Hero loads from Google's CDN today | Removes a third-party dependency and speeds up first paint (guide: search only). The 2022 Munich GDPR ruling matters only if you also serve EU visitors | S | Med | Shared |
| Head basics: Open Graph/Twitter tags, canonical URL, JSON-LD (`Organization`/`ProfessionalService`), `sitemap.xml`, `robots.txt` | AutomateNexus ships Organization, WebSite and Service schema (verified) | Share previews and search clarity for almost no cost. Skip FAQ markup for search snippets (see 4.5) | S | Med | Shared |
| `.htaccess`: HTTPS redirect, compression, cache headers, HSTS | cPanel guides (search only) | Cheap speed and security. Confirm with the host that `mod_deflate`/`mod_expires` are on; Brotli only if available; HSTS only once HTTPS works everywhere | S | Med | Shared |
| Motion policy: honour reduced-motion everywhere, plus an optional on-page motion toggle | [WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) is Level AAA and recommends reduced-motion and a control to switch animation off (verified) | Parallax and large motion can cause vestibular symptoms | S | Med | Shared |
| Written performance budget: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at the 75th percentile (verified on [web.dev](https://web.dev/articles/vitals)), plus a mobile initial-transfer cap (see D7) | Messenger's 5.7 MB for a whole game (verified); SA data costs (search only) | Decide before building. A lean page can be a competitive edge: AutomateNexus's uncompressed HTML alone is 293 KB | S | High | Shared |
| Fix low-contrast tokens (see section 1) | Computed locally | `--muted-2` can't carry body text; form borders need at least 3:1 (`--muted-2` works, `--line` doesn't) | S | Med | Shared (brand tokens) |
| Prices in ZAR with an optional USD toggle | The three verified agencies that show prices use USD; you're SA-first (J) | Local trust without closing the door on other markets | S | Med | Services (Haaija) |

### 4.2 Top 5 quick wins

1. **A working contact path.** A WhatsApp button, a 3–4 field form with a spam-safe PHP handler, the POPIA notice and "what happens next" copy, with Calendly opening on click. Every CTA points at `#contact`. Effort S–M.
2. **"How it works" plus a risk-reversal band plus a low-risk first step.** Copy-heavy, cheap, and the pattern all four verified competitors share. Effort S.
3. **The tier ladder.** Needs your pricing decision (D1). Effort S.
4. **A half-day foundation bundle:** self-hosted fonts, head/social/JSON-LD basics, `.htaccess`, and a written performance budget with a mobile weight cap. Effort S.
5. **Contrast and motion baseline:** retire `--muted-2` for body text, use 3:1 borders on inputs, and set the reduced-motion rule once for the whole site. Effort S.

### 4.3 Top 3 signature ideas

**1. The Thread.** The brand's zigzag "W" stroke, in orange, runs down the page and draws itself as you scroll, connecting Hero → Services → Case Study → Contact with small nodes that double as navigation. *Observed:* MindMarket's scroll-drawn path (verified). *What's ours:* it is the Weave mark, it works as progress and navigation, and it ends at the contact CTA. Effort M, impact High.

**2. Automation Readiness Score.** Five questions, one screen each, ending in "your best starting point is Tier N", an estimated range of hours reclaimed (assumptions visible) and "send me this plan" by **WhatsApp or email**. *Observed:* AutomateNexus, AY Automate and CodLinex all have a quiz, calculator or estimator, so the idea is not unique. What can set us apart: an instant result with **no email wall** (CodLinex requires your email first), a link to our own tier model, and the WhatsApp handoff. Vendor blogs claim diagnostic quizzes convert at 22–35% against 3–5% for static forms (search only); treat that as directional. Effort M, impact High.

**3. Redaction as a design motif ("Show the week").** The Eyecatchers client can't be named, so make that a feature: the name appears as a black bar in IBM Plex Mono ("Name withheld at client's request"), the approved exact figures sit beside it, and a Before / After toggle swaps a week-view timeline from manual work to the automated flow. *Observed:* AY Automate names every client, so redaction has to read as deliberate. Effort M, impact High.

### 4.4 Implementation notes (top 3)

**The Thread**
- One inline `<svg aria-hidden="true">` path with `pathLength="1"`, `stroke-dasharray: 1`, `stroke-dashoffset: 1`. Drive `stroke-dashoffset` to 0 with `animation-timeline: view()` inside `@supports (animation-timeline: view())`. Reference: [scroll-driven SVG stroke draw](https://codefronts.com/motion/css-scroll-animations/scroll-driven-svg-stroke-draw/).
- Fallback where the feature is missing (Firefox stable): an IntersectionObserver adds a class and a CSS transition draws the segment on entry (about 20 lines).
- `@media (prefers-reduced-motion: reduce)`: render the line fully drawn, with no animation.
- **Single page, shared files in `assets/`** (your decisions): put the thread's CSS and JS in `assets/`, and build it as per-section segments, not one giant path. MindMarket hand-placed its SVGs per breakpoint, and one path that has to line up with every section at every width is where this idea gets expensive. Each section owner adds one `<svg class="thread-seg">` at the top of their section, so the README's ownership split still holds. On mobile, collapse to a straight line in the left gutter.
- Don't add a smooth-scroll library. MindMarket used Locomotive Scroll, but NN/g found scroll-speed manipulation disorienting, worse on mobile.
- `stroke-dashoffset` repaints each frame, so keep to one or two animated paths at a time.
- If the nodes act as navigation, make them real `<a href="#services">` links with visible focus styles.

**Automation Readiness Score**
- Plain `<form>` with one `<fieldset>` per step and native radio/checkbox groups. Without JavaScript it degrades to a link to the contact form.
- A small state machine of about 100 lines of JS and no library. Move focus to each new step's heading; announce the result in an `aria-live="polite"` region.
- Keep answers in `sessionStorage` and read them into hidden fields in the contact form. Nothing leaves the browser until the visitor submits, which also keeps the POPIA notice simple.
- Show the result first and ask for contact details second.
- **Needs the definition of the four tiers** to map scores to tiers (you chose placeholders for now). Hours-saved figures must be shown as estimates with the assumptions listed.

**Show the week (case study)**
- Server-rendered semantic HTML first: both states readable as a table or definition list with no JS.
- A `<button role="switch" aria-checked>` flips a `data-state="before|after"` attribute. Bars use `transform: scaleX(var(--w))`, so it animates on the compositor. Under reduced motion the swap is instant.
- Keep the figures in one place (`data-*` attributes or a small JSON block) so placeholders can be replaced by the approved numbers without touching the layout.
- You confirmed sign-off for the exact figures. I don't have them, and I won't invent any. The README still says "no real numbers without sign-off"; option D8 updates it.

### 4.5 Trends to avoid

1. **A WebGL/3D hero as the main experience** (Oryzo, Messenger, Cerebrium style). It needs a 3D library and an asset pipeline, and even the best teams work to strict budgets (Messenger's 5.7 MB is for a whole game). It conflicts with no-build cPanel hosting and with a conversion-first page on South African mobile data.
2. **Scroll-jacking and smooth-scroll libraries.** NN/g's testing found disorientation and "severe agitation" among task-focused users, worse on mobile, and advises omitting it from mobile ([Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/)).
3. **Auto-forwarding carousels for proof or logos.** NN/g: "Accordions and carousels should show a new panel only when users ask for it" ([article](https://www.nngroup.com/articles/auto-forwarding/)). Use a static grid.
4. **Parallax and large motion without reduced-motion handling** (WCAG 2.3.3, Level AAA).
5. **"AI slop" visuals:** indigo-to-purple gradients, Inter everywhere, three identical icon cards, sparkle icons (search only: [925 Studios](https://www.925studios.co/blog/ai-slop-design-tells), [DEV](https://dev.to/james_anderson_h/the-purple-gradient-problem-why-ai-ui-all-looks-alike-and-how-to-fix-it-3j65)). The current dark-plus-orange Hero with Space Grotesk and Plex Mono sits outside that set, and two award winners use the same palette. Protect it.
6. **Marking up FAQs for Google rich results.** Google's documentation says FAQ rich results stopped appearing in Google Search on May 7, 2026 ([Search Central](https://developers.google.com/search/docs/appearance/structured-data/faqpage)). A visible FAQ is still fine for readers.
7. **Email-gating a result before showing any value** (CodLinex's audit) (J).
8. **Hover-only interactions** (custom cursors, hover reveals). They need a tap equivalent on mobile (search only).
9. **Unverifiable stats.** Competitors publish claims like "91% auto-resolution". Use only the figures you've approved.
10. **Self-published "best agencies" posts and programmatic city pages** (J). Crowded, not independent proof, and our copy is deliberately niche-agnostic.

### 4.6 Filtered out by the constraints or your decisions

- WebGL scenes and multiplayer (Oryzo, Messenger, Cerebrium): heavy libraries, asset pipelines, mobile risk.
- GSAP, Next.js, Strapi and Webflow builds: not our stack; CSS scroll-driven animations plus IntersectionObserver cover the effects recommended here.
- Cross-document view transitions: not applicable to a single page (and Firefox doesn't support them).
- Programmatic city pages.

## 5. Decisions so far (your answers)

| # | Decision | Effect |
|---|---|---|
| 1 | Verify the top findings; don't fill the gaps, offer options instead | Section 6 |
| 2 | Screenshots stay in the session only | None were taken (a real browser wouldn't connect anyway) |
| 3 | Mainly South Africa, worldwide where possible | Section 3 |
| 4 | "Solare" | Unresolved; option R5 |
| 5 | Prices: undecided, design both | Option D1 |
| 6 | One scrolling page | Drops the view-transition idea; the Thread becomes one spine |
| 7 | Calendly for booking | Load on click; option D3 |
| 8 | Eyecatchers: exact figures approved | Needs you to supply them; the client name stays withheld |
| 9 | Owners for shared pieces: decide later | Marked "Shared" |
| 10 | Shared CSS/JS lives in `assets/` | Applied to the Thread notes |
| 11 | Tiers: placeholders for now | The tier ladder and readiness score use placeholder tiers |
| 12 | Research only after this update | No building |

## 6. Options for your approval

Reply with the codes, for example `R1 yes, R2 LOW/CODE only, D1 b`. My recommendation is marked ★.

### Research follow-ups (the gaps)

- **R1. South African competitor scan.** Candidates from search: DDM Technology (Johannesburg, multilingual chatbots), The Digital Lab (WhatsApp automation), WRIGHTSAI (Cape Town), Ezemind AI (40+ agents shipped), AI Automated Solutions, Kipps.AI. ★ Yes, all six: this is your home market and the biggest hole in the research.
- **R2. The four pages the classifier blocked** (LOW/CODE home page and calculator, DestiLabs, Rex Automaton, LuMay). I'd read them with `WebFetch` only, no scripts. ★ LOW/CODE's calculator and Rex Automaton (risk-control wording); skip DestiLabs (priced above SMB budgets) and LuMay (enterprise-leaning).
- **R3. Adjacent products** (n8n, Lindy, Relevance AI). ★ Skip for now: low value for a services site. Revisit if you want product-style demos.
- **R4. More in-window B2B/agency award winners** from Awwwards' own lists. Candidates (names only, not opened): Terminal Industries (REJOUICE, Site of the Month Sep 2025), Sharplink (Studio Freight, Aug 27, 2026), Moto Finance (Properly Studio, Sep 24, 2026), Cipher (Magnetism, Aug 20, 2026), Studio K95 (Aug 11, 2026). ★ Terminal Industries, Sharplink and Moto Finance.
- **R5. "Solare".** Tell me the URL, or say whether it's a site you love or hate. My search only found solar-energy templates. ★ Needs your input.
- **R6. CSS Design Awards winners.** ★ Try, via `WebFetch` only. Skip FWA: its pages don't render in my tools, so Cyera stays unverified.

### Site decisions (for when we build)

- **D1. Prices** (your answer was "undecided"):
  - a) A public price per tier. Example: CodLinex shows $497 / $997 / $2,497 per month.
  - b) ★ "From" prices for the lower tiers and "scoped after the audit" for the top tier, plus a low-priced first step in ZAR. Examples: AY Automate's ranges; AutomateNexus's $500 pilot.
  - c) No numbers; "WhatsApp us for a quote". No verified competitor does this on its homepage.
  - d) Build the tier ladder so prices can be switched on or off with one setting, then decide later.
  - Why b: all four verified competitors show some numbers, and a cheap first step suits cautious SMBs.
- **D2. Case-study presentation.** a) ★ Client name redacted as a black bar, approved exact figures shown. b) Fully anonymous with ranges. c) Named, if the client agrees (AY Automate names all 45 clients). Recommend a) now and ask the client about naming later.
- **D3. Contact path.** a) Form plus Calendly. b) ★ WhatsApp button plus short form plus Calendly on click. c) WhatsApp only. Examples: Cohevo (WhatsApp-first), AutomateNexus ("Book a call" plus form). I need the WhatsApp number when we build.
- **D4. Readiness score result** (later). a) Email before the result (CodLinex). b) ★ Result first, then "send me this plan" by WhatsApp or email. c) Skip it for launch.
- **D5. Currency.** a) ZAR only. b) ★ ZAR default with a USD toggle. c) USD only (what the verified agencies do).
- **D6. POPIA baseline.** a) ★ Notice beside the form covering the section 18 items, a Privacy page, and an unticked optional newsletter box. b) Add a cookie banner only when analytics or ads are added. c) Have a South African privacy professional review it. a) and c) together is safest. This isn't legal advice.
- **D7. Mobile page-weight budget** (initial transfer). a) 300 KB (strict, almost no photos). b) ★ 500 KB. c) 1 MB. For scale: the current Hero is a few KB plus fonts; AutomateNexus's uncompressed HTML alone is 293 KB.
- **D8. Record these decisions in the README** (single page, shared files in `assets/`, Calendly, SA market, approved figures, POPIA). ★ Yes. It's documentation, not site code.

## 7. Gaps and what would raise confidence

- No visuals or motion were seen; a real browser couldn't validate the proxy's certificate, and I didn't bypass that. Everything here rests on page text, raw HTML and Awwwards' data.
- The Cerebrium build story (Codrops) and Cyera (FWA) remain unverified.
- LOW/CODE, DestiLabs, Rex Automaton and LuMay were not read first-hand (see R2).
- n8n, Lindy and Relevance AI were not analysed (see R3).
- Awwwards jury scores are not accessibility audits.
- Conversion figures (form fields, quizzes), WhatsApp reach and South African data costs come from vendor or roundup pages: directional only.
- Not researched: South African hosting options, local payment methods, local-language content, and whether POPIA affects analytics or cookies.

## 8. Sources

**Verified primary pages**
- Awwwards: [Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/), [Sites of the Month](https://www.awwwards.com/websites/sites_of_the_month/), [Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/), [Oryzo AI](https://www.awwwards.com/sites/oryzo-ai), [MindMarket](https://www.awwwards.com/sites/mindmarket), [MindMarket case study](https://www.awwwards.com/mindmarket-case-study.html), [Cerebrium](https://www.awwwards.com/sites/cerebrium), [Messenger](https://www.awwwards.com/sites/messenger), [Fourmula AI](https://www.awwwards.com/sites/fourmula-ai), ['kin](https://www.awwwards.com/sites/kin-2), [Studio Loop](https://www.awwwards.com/sites/studio-loop), [Mind Robotics](https://www.awwwards.com/sites/mind-robotics)
- Messenger: [WebGPU showcase](https://www.webgpu.com/showcase/messenger/)
- Competitors: [AutomateNexus](https://automatenexus.com/), [CodLinex](https://www.codlinex.com/), [CodLinex audit](https://www.codlinex.com/audit), [AY Automate](https://www.ayautomate.com/services/ai-automation-agency), [AY Automate case studies](https://www.ayautomate.com/case-studies), [Cohevo](https://www.cohevo.co/), [Zapier](https://zapier.com/)
- Standards and platform data: [MDN browser-compat-data](https://github.com/mdn/browser-compat-data) (`animation-timeline`, `@view-transition`), [Google Fonts metadata](https://github.com/google/fonts) (Space Grotesk, IBM Plex), [Calendly loader](https://assets.calendly.com/assets/external/widget.js) and [stylesheet](https://assets.calendly.com/assets/external/widget.css) (measured), [web.dev Core Web Vitals](https://web.dev/articles/vitals), [WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [Google FAQ rich results](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- Usability: [NN/g Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/), [NN/g auto-forwarding carousels](https://www.nngroup.com/articles/auto-forwarding/)
- South Africa: [POPIA section 18](https://popia.co.za/section-18-notification-to-data-subject-when-collecting-personal-information/), [POPIA section 69](https://popia.co.za/section-69-direct-marketing-by-means-of-unsolicited-electronic-communications/)

**Search summaries only (unconfirmed)**
- Award context: [Codrops on Cerebrium](https://tympanus.net/codrops/2026/07/23/building-cerebrium-making-serverless-infrastructure-tangible/), [Utsubo Three.js roundup](https://www.utsubo.com/blog/best-threejs-websites-2026), [Lusion behind-the-scenes](https://blog.lusion.co/oryzo-bts-part-1-7-concept-and-creative-direction), [Cyera AI Guardian on FWA](https://thefwa.com/cases/cyera-ai-guardian)
- Competitors not read: [LOW/CODE](https://www.lowcode.agency/case-studies), [LOW/CODE calculator](https://www.lowcode.agency/smart-cost-calculator), [DestiLabs](https://www.destilabs.com/), [Rex Automaton](https://rexautomaton.com/), [LuMay](https://www.lumay.ai/)
- South African agencies (not opened): [DDM Technology](https://www.ddmtech.co.za/), [The Digital Lab](https://thedigitallab.co.za/services/whatsapp-automation.html), [WRIGHTSAI](https://www.wrightsai.com/), [Ezemind AI](https://ezemind.ai/), [AI Automated Solutions](https://aiautomatedsolutions.co.za/), [Kipps.AI](https://www.kipps.ai/location/whatsapp-agent-south-africa)
- WhatsApp and data: [Yazi WhatsApp penetration](https://www.askyazi.com/articles/whatsapp-penetration-across-africa-statistics-by-country), [MyBroadband data prices](https://mybroadband.co.za/news/cellular/657852-cheapest-and-most-expensive-mobile-data-in-south-africa.html)
- Techniques and conversion: [scroll-driven SVG draw](https://codefronts.com/motion/css-scroll-animations/scroll-driven-svg-stroke-draw/), [Calendly performance article](https://www.corewebvitals.io/pagespeed/speed-up-calendly-integration), [static forms and spam](https://www.staticforms.dev/blog/spam-email-bot), [anonymous case studies](https://proofmap.com/insights/how-to-write-anonymous-case-studies), [pricing transparency](https://www.glencoyne.com/guides/pricing-transparency-services), [form-field benchmarks](https://fluentforms.com/online-form-statistics-facts/), [quiz conversion](https://getaiform.com/blog/quiz-funnels-vs-static-lead-magnets-interactive-content-conversion-2026), [B2B navigation](https://www.blendb2b.com/websites-decoded/b2b-website-navigation-best-practices), [self-hosting fonts](https://www.corewebvitals.io/pagespeed/self-host-google-fonts), [cPanel `.htaccess`](https://stackharbor.com/en/knowledge-base/cpperf-browser-cache-headers-vhost-htaccess/)
