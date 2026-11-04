# Copy proposals — process first, automation second

**PROPOSALS ONLY. Nothing here is on the site.** Haaija decides the copy. Pick a
number, or mix lines from different options, and say so; whoever applies it then edits
`index.html` and notes the change in `docs/REBRAND-CHANGELOG.md`.

Written for session S1 of the rebrand (`docs/REBRAND-BRIEF.md` section 3c). Ground
rule from our playbook, which every option below leans on:

> Never automate a workflow you have not mapped. If a human cannot explain the rule
> clearly, an AI agent cannot run it reliably.

Constraints every option here respects, and any replacement must too:

- No numbers, no percentages, no time savings, no "within X weeks".
- No client names and no client results, stated or implied.
- No promise of an outcome. "We map it before we build it" is a description of how we
  work; "you will save a day a week" is a promise, and is not allowed.
- No new service. The page sells Discovery & Audit, Implementation, Operations
  Retainer, and Hybrid / Licensing. Nothing below adds a fifth.
- Plain South African English, same register as the rest of the page: short sentences,
  no hype words ("revolutionise", "seamless", "cutting-edge", "unlock").

---

## 1. Hero eyebrow + lede

Currently on the page (unchanged by the rebrand, shown for comparison):

> **Eyebrow:** Less repetition. More possibility.
> **Lede:** **Your time is better spent moving your business forward.** We help
> automate repetitive work, so you can focus on what comes next.

The headline above them, "Make room for better work.", is Willie's and is **not** up
for change in any option below. Each option is an eyebrow plus a lede that sits under
that same headline.

### Option A — map first (closest to the playbook rule)

> **Eyebrow:** Map it first. Then automate it.
>
> **Lede:** **Most admin work is a process nobody has written down.** We map how the
> work actually happens before we automate any of it, so what gets built matches what
> your team really does.

*Why:* says the differentiator outright. The word "map" already appears in Services
and in step 02, so the page backs it up rather than making a new claim.

### Option B — the clarity test

> **Eyebrow:** Clear rules first. Automation second.
>
> **Lede:** **If a rule cannot be explained clearly, software cannot run it
> reliably.** So we start by getting the process clear, and automate the parts that
> are ready for it.

*Why:* this is the playbook rule said out loud, as a reason to trust the approach. It
also quietly sets the expectation that not everything gets automated, which matches
"where automation genuinely helps" in Services.

### Option C — the quiet one (smallest change from what is there now)

> **Eyebrow:** Less repetition. More possibility.
>
> **Lede:** **Your time is better spent moving your business forward.** We start by
> mapping the process, then automate the repetitive parts of it, so you can focus on
> what comes next.

*Why:* keeps Willie's eyebrow and the existing sentence shape, and only adds the
"process first" idea. The safest option if the hero should not feel rewritten.

---

## 2. About paragraph (the lede under "Your tools should work *together.*")

Currently on the page:

> When a business grows, the work between its systems grows too: copying information,
> chasing updates, and checking the same details twice. We connect those steps so your
> team can spend more time on work that needs their judgement.

Note: the kicker above this paragraph currently reads **"Why we do this"** (it read
"Why Weave" before the rebrand and had to change). If a different kicker is preferred,
the candidates are "Why we do this", "How we think about it", "Our approach", or
"Where we start" — this is a separate decision from the two paragraphs below.

### Option 1 — the process is already there, nobody drew it

> When a business grows, the work between its systems grows too: copying information,
> chasing updates, and checking the same details twice. That work is already a
> process — it is just not written down anywhere, so it only exists in the heads of
> the people doing it. We map it with them first, then connect the steps that are
> clear enough to run on their own, and leave the rest with your team.

*Why:* turns "we map first" into something a reader recognises from their own office,
and explains why mapping comes first without using the word "methodology". Ends on
people keeping the judgement calls, which matches "Keep people in control" below it.

### Option 2 — the honest limit

> When a business grows, the work between its systems grows too: copying information,
> chasing updates, and checking the same details twice. Not all of it should be
> automated. We map how the work really happens, agree which steps are clear enough
> for software to run, and design the handover for the ones that still need a person.

*Why:* leads with a limit rather than a benefit, which is unusual on an agency site
and is the most direct expression of the playbook rule. Reads as confident rather than
cautious because it is specific about what happens to the rest.

---

## Notes for whoever applies one

- The hero lede lives at `index.html:73`, inside
  `<p class="hero__copy">`, with the first sentence in `<strong>`. Keep that shape:
  the `<strong>` is styled.
- The About lede lives at `index.html:183`, inside `<p class="lede">`. The About
  kicker is `index.html:181`.
- The hero must not get taller: the pin maths depends on it. Hero height is currently
  747.0 px at 1440, 1280 and 1024 px, and the brief's limit is +24 px. A longer lede
  can push it over, so re-measure after editing. Options A and B are the same length
  as the current lede or shorter; Option 1 and Option 2 are longer than the current
  About paragraph, but the About section is not pinned, so only the hero matters.
- After any copy change: rerun `node tests/examples.test.js`, `node tests/grow.test.js`
  and `python tools/check_structure.py index.html`, rebuild `dist/`, and recheck the
  gzip budget.
