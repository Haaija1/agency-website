# Weave site research: features worth borrowing

Research only. No site code was changed. First written 2026-09-29 from search summaries; updated the same day after checking the key claims against primary sources, and again with the South African competitor scan (R1) and your Solare reference (R5).

## 0. Method and limits (read first)

- **Pass 1** (earlier draft) was search-only because the network was blocked. **Pass 2** (this update) opened primary sources: Awwwards' own pages, live competitor pages, W3C, Google Search Central, NN/g, MDN's browser-compat data, Google Fonts metadata and popia.co.za.
- **Labels used below.** **Verified** = read from the primary page in pass 2. **Search only** = from a search summary, not confirmed. **Judgment (J)** = my recommendation. Effort (S ≤ ½ day, M 1–3 days, L > 3 days) and impact ratings are my estimates.
- **What I could and couldn't see.** Page text came from a page-to-text summariser (`WebFetch`) and raw HTML (`curl`). A real browser wouldn't connect (it can't validate the environment proxy's certificate, and I did not bypass that). So visuals, motion and JavaScript-rendered content were **not seen**.
- **One batch was blocked.** The auto-mode classifier refused my script reading LOW/CODE (home page and calculator), DestiLabs, Rex Automaton and LuMay. I did not retry those by another route. They stay "Search only" and appear in the options in section 6. The Digital Lab and WRIGHTSAI returned a bot-check page or HTTP 503, so they weren't readable either; I did not try to get past that.
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
| Kipps.AI: a South African WhatsApp-agent provider | An **Indian product** (Udaipur) with a South Africa landing page ("Official Meta Partner · South Africa", a $11 setup offer in USD). Not a local competitor |
| DDM Technology: no prices shown | Its homepage shows none, but its Pricing page lists three tiers in ZAR: R8,000, R15,000 and R30,000+ per month, excluding VAT |
| "Solare": no website found | casadisolare.com is a **typeface showcase** (Solare, by Nikolas Wrobel), not a solar company |

## 1. Where the site is today (observed in `index.html`)

This describes `main`. A build on another branch has since added the rest of the page; see 5.2.

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

### 2.4 South African agencies (read from the live pages on 2026-09-29)

| Agency | What it does | Notes |
|---|---|---|
| [DDM Technology](https://www.ddmtech.co.za/) (Johannesburg) | • H1 "We Build AI Systems That Run Your Business While You Sleep" and "No hype. No fluff."<br>• Local trust copy: "We understand load shedding, we understand POPIA"; 50+ deployments; three named case studies (MineX Coal Trading, Flame & Fork, UrbanNest)<br>• Tools: an AI Readiness Quiz and an AI ROI Calculator; CTAs "Book a Free AI Audit", WhatsApp and "See Our Work"<br>• [Pricing page](https://www.ddmtech.co.za/pricing): Starter R8,000, Professional R15,000 ("MOST POPULAR"), Enterprise R30,000+ per month, excluding 15% VAT, month-to-month after a 3-month minimum, plus a "free 30-minute consultation" | 14+ item nav; chatbots in English, Zulu and Afrikaans; no partner badges or team credentials shown |
| [Ezemind AI](https://ezemind.ai/) (founder Johan van Niekerk) | • Fixed price per project in ZAR with no public price list, but it states timelines (single agents 1–2 weeks, WhatsApp CRM 4–8, platforms 8–12) and a "written proposal within 2 working days"<br>• Four stages: a free 30-minute discovery call, the proposal, a build sprint with weekly updates, then launch and training<br>• Named clients with attributed quotes and metrics; "96% client retention after launch" and "40+ production builds since 2023", with a note that figures were "audited internally" (May 2026)<br>• Trust: POPIA mentioned, data kept in South Africa, a free security check before launch | 7-item nav; an "Ask Ezzy" chatbot (English and Afrikaans) that books discovery calls; a free 15-second AI visibility audit; WhatsApp number shown |
| [AI Automated Solutions](https://aiautomatedsolutions.co.za/) | • A "60 second AI fit check": 4 steps with auto-save, ending in name, company, email and WhatsApp/phone<br>• A five-step "how it works" (trigger → AI reads context → actions run → departments update → resolved or escalated)<br>• "Built in South Africa" and "POPIA aware"; CTAs "Book Free Consult", WhatsApp and a phone number | Shows 12+ client logos (unnamed) in an auto-rotating carousel. Its review line contradicts itself on the page ("0 Google · 0 verified reviews" and "4.9/5 Google rating · 17 verified reviews"). A Pricing page is in the nav (not read) |
| [Kipps.AI](https://www.kipps.ai/location/whatsapp-agent-south-africa) | An **Indian** product (Udaipur) with a South Africa landing page: "Official Meta Partner · South Africa", a $11 WhatsApp API setup offer, three named customers | No POPIA statement and no local contact. Not a local competitor |
| The Digital Lab, WRIGHTSAI | Not readable: each returned a bot-check page or HTTP 503 | Search summaries only: WhatsApp automation (The Digital Lab), Cape Town (WRIGHTSAI) |

**Patterns among the South African agencies**

1. **WhatsApp is on every readable site** (DDM, Ezemind, AI Automated Solutions).
2. **All three readable local agencies use POPIA as a trust signal**: DDM most directly, Ezemind with data residency and security checks, AI Automated Solutions more softly ("POPIA aware"). The Indian product doesn't mention it.
3. **Interactive tools are common locally too:** DDM's quiz and calculator, the 60-second fit check, Ezemind's chatbot and free audit.
4. **Pricing splits:** DDM publishes ZAR tiers excluding VAT on a Pricing page; Ezemind quotes fixed prices but publishes timelines and a proposal deadline instead of a list.
5. **Named proof is common** (DDM, Ezemind), so Weave's redacted case study has to look deliberate.
6. **Local cues work:** "load shedding", "Built in South Africa", data residency, Zulu and Afrikaans.
7. **Pitfalls to avoid:** an auto-rotating logo strip (NN/g advises against auto-moving content) and a rating line that contradicts itself both cost credibility.

### 2.5 Your reference site: Solare (casadisolare.com)

**What it is** (page text plus press coverage): Casa di Solare is the showcase for **Solare**, a variable typeface by Nikolas Wrobel, released in January 2024 and sold through Nikolas Type. In order: a hero with a specimen, the family weights, an interactive type tester (size, weight and "intensity" controls), the designer's story, repeated "Purchase Solare" buttons, and a footer with a newsletter. Character illustrations react on hover, and the voice is poetic and personal. Coverage says it was built by Wrobel with designer Nathan Riley, with words that shapeshift between weights.

**What I could not see:** colours, type styling and motion. Page text doesn't show them.

**What might transfer to Weave** (J, until you tell me what you love about it):

- **A weight-shifting headline.** Space Grotesk has a weight axis of 300–700 (verified), so one word, say "weave", could thicken on scroll or hover in CSS. The current build self-hosts static 600 and 700 files, so this needs the variable file, checked against the performance budget.
- **A hands-on moment instead of a hero video**, like the type tester. The "Show the week" toggle is already this kind of thing.
- **A personal voice.** Solare's copy is warm and specific; a founder line in an About section could do the same.

Question Q2 in 5.3 asks what you love about it.

## 3. South Africa (and beyond)

You said the market is mainly South Africa, with the door open elsewhere. That changes several things.

**Observed**

- **POPIA replaces GDPR as the privacy baseline.** [Section 18](https://popia.co.za/section-18-notification-to-data-subject-when-collecting-personal-information/) (verified) says that when you collect personal information you must tell the person the responsible party's name and address, the purpose, whether supplying it is voluntary or mandatory, the consequences of not supplying it, and their rights, including how to complain to the Information Regulator. [Section 69](https://popia.co.za/section-69-direct-marketing-by-means-of-unsolicited-electronic-communications/) (verified) says electronic direct marketing is prohibited unless the person has consented or is a customer, must offer a free and easy way to object, and must identify the sender. This is a summary of the statute, not legal advice.
- **WhatsApp is the main channel.** Two search summaries put WhatsApp at about 94–96% of South African internet users (Search only). On the verified pages, Cohevo's primary CTA is WhatsApp.
- **South African agencies lead with WhatsApp and POPIA** (verified in 2.4). All three readable local agencies show WhatsApp and mention POPIA. Kipps.AI is an Indian product, not a local one.
- **Page weight costs visitors money.** Summaries put mobile at roughly 70% of African web traffic and South African mobile data at about R20 per GB (Search only). AutomateNexus's uncompressed homepage HTML alone is 293 KB (verified; transfer size not measured).
- **Currency:** the three US agencies that show prices quote in US dollars; the local agencies that show prices quote in ZAR excluding VAT (DDM), or in ZAR as fixed project prices (Ezemind).
- **Solare**, your reference site, is casadisolare.com, a typeface showcase; see 2.5.

**What I'd do about it (J)**

1. Make a **WhatsApp button** a co-primary CTA (a `wa.me` link with a prefilled message), alongside a short form and the booking link.
2. Show **prices in ZAR by default, excluding VAT** (as DDM does), with an optional USD toggle for visitors elsewhere.
3. Put a **POPIA notice** next to the form covering the section 18 items, keep any newsletter tick box unticked and optional, and add a short Privacy page. Have a South African privacy professional check it.
4. Set a **mobile page-weight budget** in addition to the Core Web Vitals targets (see 4.1).
5. Later: consider local-language content, since DDM offers Zulu and Afrikaans chatbots and Ezemind's assistant works in Afrikaans (verified).

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
| Variable-weight display type on scroll or hover | Solare (casadisolare.com: words shapeshift between weights; your reference site); kinetic-type trend (search only) | Space Grotesk has a weight axis of 300–700 (verified). The current build self-hosts static 600 and 700 files, so this needs the variable file | S–M | Low–Med | Hero (Willie), optional |
| Micro-interaction kit: custom 404 (`ErrorDocument`), footer flourish, menu transition | Fourmula AI (verified) | Small polish that signals craft at low cost | S each | Low–Med | Shared |

**Services**

| Feature | Seen on | Why it works | Effort | Impact | Section |
|---|---|---|---|---|---|
| Low-risk first step (a small paid pilot or free audit) as the front door | AutomateNexus "$500 Pilot" and free audit; CodLinex $299 audit; AY Automate free 30-minute call (all verified) | Lets a cautious SMB start small; every verified competitor does it | S | High | Services (Haaija) |
| Tier ladder: "from" price or range, what's included, "best for" line | CodLinex, AutomateNexus, AY Automate (verified) | Pre-qualifies leads; every verified competitor shows numbers. Needs your pricing decision (Q1 in 5.3) | S | High | Services (Haaija) |
| Pricing-model explainer without a price list: fixed price per project, a proposal deadline, typical timelines | Ezemind AI (ZAR; verified) | Gives cautious buyers something concrete without publishing numbers; an alternative to a tier ladder | S | Med–High | Services (Haaija) |
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
| Label where each figure comes from ("reported by the client and reviewed with them") | Ezemind AI's "audited internally" note (verified) | Shows honesty about proof (J) | S | Med | Case Study (Haaija) |

**Contact**

| Feature | Seen on | Why it works | Effort | Impact | Section |
|---|---|---|---|---|---|
| WhatsApp button (`wa.me`, prefilled message) beside the form | Cohevo's primary CTA (verified); ~94–96% WhatsApp reach in SA (search only) | Meets South African visitors where they already talk (J) | S | High | Contact (Haaija) |
| Short form (3–4 fields) with honeypot and a time check; PHP handler on cPanel (PHPMailer over SMTP, SPF/DKIM) | Static HTML of three verified competitors shows forms with 1, 6 and 8 inputs; [static-form guidance](https://www.staticforms.dev/blog/spam-email-bot) (search only) | Fewer fields convert better (vendor stats, directional) | S–M | High | Contact (Haaija) |
| POPIA notice beside the form (section 18 items) and an unticked optional newsletter box (section 69) | popia.co.za (verified) | Required-style disclosure; builds trust | S | High | Contact (Haaija) |
| Local trust cues: "Built in South Africa" and data location (only if true), plain wording on how form data is used | DDM, Ezemind and AI Automated Solutions (verified) | Every readable local agency does it. State only what is true and reviewed | S | Med | Contact / Shared |
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
| Written performance budget: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at the 75th percentile (verified on [web.dev](https://web.dev/articles/vitals)), plus a mobile initial-transfer cap (500 KB, your choice; the build's own budget is stricter) | Messenger's 5.7 MB for a whole game (verified); SA data costs (search only) | Decide before building. A lean page can be a competitive edge: AutomateNexus's uncompressed HTML alone is 293 KB | S | High | Shared |
| Fix low-contrast tokens (see section 1) | Computed locally | `--muted-2` can't carry body text; form borders need at least 3:1 (`--muted-2` works, `--line` doesn't) | S | Med | Shared (brand tokens) |
| Prices in ZAR with an optional USD toggle | The three verified agencies that show prices use USD; you're SA-first (J) | Local trust without closing the door on other markets | S | Med | Services (Haaija) |

### 4.2 Top 5 quick wins

1. **A working contact path.** A WhatsApp button, a 3–4 field form with a spam-safe PHP handler, the POPIA notice and "what happens next" copy, with Calendly opening on click. Every CTA points at `#contact`. Effort S–M.
2. **"How it works" plus a risk-reversal band plus a low-risk first step.** Copy-heavy, cheap, and the pattern all four verified competitors share. Effort S.
3. **The tier ladder or an Ezemind-style pricing explainer.** Needs your pricing decision (Q1 in 5.3). Effort S.
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
- You confirmed sign-off for the exact figures. I don't have them, and I won't invent any. The README still says "no real numbers without sign-off"; the text to update it is in 5.4.

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

## 5. Decisions and status

### 5.1 Your answers so far

| Code | Your answer | Status |
|---|---|---|
| R1 | Yes: South African competitor scan | Done: section 2.4 |
| R5 | casadisolare.com, "love it" | Done: section 2.5; see Q2 |
| D1 | "That's good" (my ★ option: "from" prices for lower tiers, "scoped after the audit" for the top tier, plus a low-priced first step in ZAR) | **Conflicts with the current build** (no public pricing); see Q1 |
| D2 | OK: client name redacted, approved exact figures shown | Redaction style is built; the figures are still needed from you |
| D3 | Yes: WhatsApp button, short form, Calendly opening on click | WhatsApp (two numbers) and the form are built; **Calendly is not** |
| D4 | My default: result first, then "send me this plan" | For later; the readiness score isn't built |
| D5 | My default: ZAR with an optional USD toggle | Matters once prices are shown |
| D6 | Yes: POPIA notice, Privacy page, unticked newsletter box, "to show we know our stuff" | **Not built yet**; see Q4 for the wording |
| D7 | My default: a 500 KB first-load cap | The build's budget is stricter, so it already fits |
| D8 | Yes: record the decisions in the README | **Not done here**: the README is on the other branch; the text is in 5.4 |
| R2, R3, R4, R6 | Not answered | Still open, in section 6 |
| Earlier | One scrolling page; Calendly; exact figures approved; shared CSS/JS in `assets/`; tiers as placeholders; research only from this pass on | Applied where noted |

### 5.2 How this compares with the build on the other branch

The session "Site research continuation" (branch `claude/serene-pascal-5d126v`) has built the page. I read what it committed; I did not change anything there.

| Item | State on that branch |
|---|---|
| The Thread, the "Show the week" toggle (made-up proportions, labelled illustrative), the redaction style | Built |
| Contact: a short form with `contact.php` (honeypot, timing check, same-site check, 5 notes per hour) and WhatsApp with two numbers | Built |
| Self-hosted fonts (static 600 and 700 Space Grotesk, Plex Sans, Plex Mono), `.htaccess`, `robots.txt`, JSON-LD | Built |
| Performance budget: 40 KB gzipped HTML+CSS+JS, 120 KB fonts, 0 third-party requests, 15 requests (measured 16 KB, 102 KB, 0 and 9) | Written; **stricter than the 500 KB cap**, and it says booking widgets load only after a click |
| Pricing | "Four services, no public pricing" |
| POPIA notice, Privacy page, unticked newsletter box | **Not found** |
| Calendly opening on click | **Not found** |
| README decisions block | **Not there**; the README still says nothing may state a client result or price until sign-off |
| Shared CSS/JS in `assets/` (your choice 10B) | `styles.css` and `site.js` are in the root; only the fonts are in `assets/` |
| `docs/site-research.md` | It holds an earlier copy of this file plus a short "Implementation status" section. **Both branches edit this file, so merging both will conflict** |

### 5.3 Questions for you

- **Q1. Pricing conflict.** You said D1 is good, but the built page shows no prices. The local agencies I could read don't put a price list on their homepage either: DDM has a Pricing page with ZAR tiers, and Ezemind publishes timelines and a proposal deadline instead. What should the site do?
  - a) ★ Keep the page without numbers for now and add an Ezemind-style "how pricing works" line (fixed price per project in ZAR excluding VAT, a written proposal within a stated number of working days, typical timelines) until the tiers are real.
  - b) Show "from" prices as in the option you approved, once you have the tiers.
  - c) Leave it exactly as built.
- **Q2. What do you love about Solare?** a) The shapeshifting weights and the type tester. b) The characters that react on hover, and the "world" feeling. c) The warm, poetic voice. d) The layout and pacing. ★ My guess is a) and c), which suit a weight-shift headline and a warmer About line, but I can't see the visuals.
- **Q3. Where the shared CSS and JS live.** You chose `assets/`, but the build keeps `styles.css` and `site.js` in the root. a) ★ Keep them in the root: one stylesheet and one script, and no merge conflicts now that one session owns them. b) Move them into `assets/`.
- **Q4. POPIA wording.** You want to show the site is legit. ★ Describe what we actually do ("we use your details only to reply; nothing is stored"), link a Privacy page, and don't write "POPIA compliant" until a South African privacy professional has reviewed it. OK?
- **Q5. The two copies of this file.** ★ I reconcile them into one on my branch when you're ready to merge.

Still owed by you: the exact Eyecatchers figures, and the booking details when Calendly is added.

### 5.4 README decisions block (D8), ready to paste

The README lives on the other branch, so I haven't touched it. This text records what you decided:

```
## Decisions (2026-09-29)
- Market: South Africa first, open to elsewhere. Any prices shown are in ZAR excluding VAT, with an optional USD toggle.
- One scrolling page.
- Contact: WhatsApp and a short form; Calendly (when added) opens only on click.
- Case study: the client name stays withheld (.redacted). The client has approved exact figures: add them when supplied and update "Copy guidance" above.
- Privacy: a POPIA notice beside the form and a Privacy page; any newsletter box unticked and optional. Describe what we do; don't claim compliance until reviewed.
- Performance: docs/performance-budget.md applies; first load stays under 500 KB even when images are added.
- Pricing: to be decided (see docs/site-research.md, Q1).
```

## 6. Still open (research)

Reply with the codes. My recommendation is marked ★.

- **R2. The four pages the classifier blocked** (LOW/CODE home page and calculator, DestiLabs, Rex Automaton, LuMay). I'd read them with `WebFetch` only, no scripts. ★ LOW/CODE's calculator and Rex Automaton (risk-control wording); skip DestiLabs (priced above SMB budgets) and LuMay (enterprise-leaning).
- **R3. Adjacent products** (n8n, Lindy, Relevance AI). ★ Skip for now: low value for a services site.
- **R4. More in-window B2B/agency award winners** from Awwwards' own lists. Candidates (names only, not opened): Terminal Industries (REJOUICE, Site of the Month Sep 2025), Sharplink (Studio Freight, Aug 27, 2026), Moto Finance (Properly Studio, Sep 24, 2026), Cipher (Magnetism, Aug 20, 2026), Studio K95 (Aug 11, 2026). ★ Terminal Industries, Sharplink and Moto Finance.
- **R6. CSS Design Awards winners.** ★ Try, via `WebFetch` only. Skip FWA: its pages don't render in my tools, so Cyera stays unverified.

## 7. Gaps and what would raise confidence

- No visuals or motion were seen; a real browser couldn't validate the proxy's certificate, and I didn't bypass that. Everything here rests on page text, raw HTML and Awwwards' data.
- The Cerebrium build story (Codrops) and Cyera (FWA) remain unverified.
- LOW/CODE, DestiLabs, Rex Automaton and LuMay were not read first-hand (see R2). The Digital Lab and WRIGHTSAI weren't readable (bot check or HTTP 503).
- Solare's colours, type styling and motion were not seen, only its text.
- n8n, Lindy and Relevance AI were not analysed (see R3).
- Awwwards jury scores are not accessibility audits.
- Conversion figures (form fields, quizzes), WhatsApp reach and South African data costs come from vendor or roundup pages: directional only.
- Not researched: South African hosting options, local payment methods, local-language content, and whether POPIA affects analytics or cookies.

## 8. Sources

**Verified primary pages**
- Awwwards: [Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/), [Sites of the Month](https://www.awwwards.com/websites/sites_of_the_month/), [Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/), [Oryzo AI](https://www.awwwards.com/sites/oryzo-ai), [MindMarket](https://www.awwwards.com/sites/mindmarket), [MindMarket case study](https://www.awwwards.com/mindmarket-case-study.html), [Cerebrium](https://www.awwwards.com/sites/cerebrium), [Messenger](https://www.awwwards.com/sites/messenger), [Fourmula AI](https://www.awwwards.com/sites/fourmula-ai), ['kin](https://www.awwwards.com/sites/kin-2), [Studio Loop](https://www.awwwards.com/sites/studio-loop), [Mind Robotics](https://www.awwwards.com/sites/mind-robotics)
- Messenger: [WebGPU showcase](https://www.webgpu.com/showcase/messenger/)
- South African agencies: [DDM Technology](https://www.ddmtech.co.za/), [DDM pricing](https://www.ddmtech.co.za/pricing), [Ezemind AI](https://ezemind.ai/), [AI Automated Solutions](https://aiautomatedsolutions.co.za/), [Kipps.AI](https://www.kipps.ai/location/whatsapp-agent-south-africa)
- Reference site: [Casa di Solare](https://casadisolare.com/)
- Competitors: [AutomateNexus](https://automatenexus.com/), [CodLinex](https://www.codlinex.com/), [CodLinex audit](https://www.codlinex.com/audit), [AY Automate](https://www.ayautomate.com/services/ai-automation-agency), [AY Automate case studies](https://www.ayautomate.com/case-studies), [Cohevo](https://www.cohevo.co/), [Zapier](https://zapier.com/)
- Standards and platform data: [MDN browser-compat-data](https://github.com/mdn/browser-compat-data) (`animation-timeline`, `@view-transition`), [Google Fonts metadata](https://github.com/google/fonts) (Space Grotesk, IBM Plex), [Calendly loader](https://assets.calendly.com/assets/external/widget.js) and [stylesheet](https://assets.calendly.com/assets/external/widget.css) (measured), [web.dev Core Web Vitals](https://web.dev/articles/vitals), [WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [Google FAQ rich results](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- Usability: [NN/g Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/), [NN/g auto-forwarding carousels](https://www.nngroup.com/articles/auto-forwarding/)
- South Africa: [POPIA section 18](https://popia.co.za/section-18-notification-to-data-subject-when-collecting-personal-information/), [POPIA section 69](https://popia.co.za/section-69-direct-marketing-by-means-of-unsolicited-electronic-communications/)

**Search summaries only (unconfirmed)**
- Award context: [Codrops on Cerebrium](https://tympanus.net/codrops/2026/07/23/building-cerebrium-making-serverless-infrastructure-tangible/), [Utsubo Three.js roundup](https://www.utsubo.com/blog/best-threejs-websites-2026), [Lusion behind-the-scenes](https://blog.lusion.co/oryzo-bts-part-1-7-concept-and-creative-direction), [Cyera AI Guardian on FWA](https://thefwa.com/cases/cyera-ai-guardian)
- Competitors not read: [LOW/CODE](https://www.lowcode.agency/case-studies), [LOW/CODE calculator](https://www.lowcode.agency/smart-cost-calculator), [DestiLabs](https://www.destilabs.com/), [Rex Automaton](https://rexautomaton.com/), [LuMay](https://www.lumay.ai/)
- South African agencies not readable: [The Digital Lab](https://thedigitallab.co.za/services/whatsapp-automation.html), [WRIGHTSAI](https://www.wrightsai.com/)
- Solare background: [Behance](https://www.behance.net/gallery/189625739/Solare-Typeface), [The Brand Identity](https://the-brandidentity.com/typeface/beauty-will-save-us-solare-a-variable-typeface-by-nikolas-type-is-simply-drop-dead-gorgeous), [Nikolas Type](https://www.nikolastype.com/fonts/solare/)
- WhatsApp and data: [Yazi WhatsApp penetration](https://www.askyazi.com/articles/whatsapp-penetration-across-africa-statistics-by-country), [MyBroadband data prices](https://mybroadband.co.za/news/cellular/657852-cheapest-and-most-expensive-mobile-data-in-south-africa.html)
- Techniques and conversion: [scroll-driven SVG draw](https://codefronts.com/motion/css-scroll-animations/scroll-driven-svg-stroke-draw/), [Calendly performance article](https://www.corewebvitals.io/pagespeed/speed-up-calendly-integration), [static forms and spam](https://www.staticforms.dev/blog/spam-email-bot), [anonymous case studies](https://proofmap.com/insights/how-to-write-anonymous-case-studies), [pricing transparency](https://www.glencoyne.com/guides/pricing-transparency-services), [form-field benchmarks](https://fluentforms.com/online-form-statistics-facts/), [quiz conversion](https://getaiform.com/blog/quiz-funnels-vs-static-lead-magnets-interactive-content-conversion-2026), [B2B navigation](https://www.blendb2b.com/websites-decoded/b2b-website-navigation-best-practices), [self-hosting fonts](https://www.corewebvitals.io/pagespeed/self-host-google-fonts), [cPanel `.htaccess`](https://stackharbor.com/en/knowledge-base/cpperf-browser-cache-headers-vhost-htaccess/)
