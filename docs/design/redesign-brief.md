# INDABA — FULL SITE REDESIGN
### Master brief v2 — supersedes v1 entirely

---

## 0. HOW TO USE THIS FILE

Save at `docs/design/redesign-brief.md`, replacing v1. Then:

> Read `docs/design/redesign-brief.md` in full. It replaces the previous brief. Keep your Phase 2 foundation work, discard everything after it, and restart at Phase 3 against this document.

v1 was wrong in four ways and this file corrects them. Where v1 and v2 disagree, **v2 wins**, including where you have already built to v1.

### The four corrections

1. **Clarity outranks visual sophistication.** v1 optimised for craft and never once required that a stranger understand the page. That was the error that produced a dense, chaotic UI.
2. **The scale sits level.** v1 asked for idle sway and automatic tilt. On a site whose entire claim is independence, a scale that leans says Indaba already picked a winner. It is a brand contradiction.
3. **Less, not more.** v1 specified eleven homepage sections. Six is the cap.
4. **You do not touch version control.** No commit, push, checkout, branch, reset, stash — ever. The user handles git. If you think something should be committed, say so and stop.

---

## 1. MISSION

Redesign **indaba.co.za** end to end: layout, structure, navigation, typography, colour, motion, copy.

Indaba is South Africa's independent business software review and comparison directory. G2/Capterra localised: ZAR pricing with 15% VAT, en-ZA locale, POPIA/PAIA, reviewers from SA and neighbouring markets. Categories: accounting, payroll, HR, CRM, ERP, project management. Revenue is affiliate plus sponsored slots, so **organic search is the business.**

### The bar

A South African business owner, who has never heard of this site, lands on it. Within ten seconds she knows what Indaba does, that it is free for her, and what to click. Within five minutes she has chosen payroll software with confidence.

That is the product. Everything in this brief serves it. A page that is beautiful and leaves her uncertain has failed.

### The concept

*Indaba* is a Nguni word for a gathering where a matter is talked through until a decision is reached. Two ideas must be visible in the design:

- **Weighing.** Comparison is not a feature of this site, it is the site. Two-sided structure should show up in real layout, not as an icon dropped into a section.
- **Independence.** The design reads as *evidence presented*, not *product marketed*. Numbers plain. Method visible. Sponsorship disclosed. Restraint is the trust signal — a site that shouts looks paid for.

Never explain the word in a paragraph. Express it in the design.

---

## 2. THE CLARITY CONTRACT

This section outranks every other section in this file. If clarity and sophistication conflict, clarity wins and you do not ask.

- The hero states plainly what Indaba is and who it is for, in words a non-technical person uses. **No metaphor in the headline. No cleverness.**
- Every section heading says what is in the section, in plain language. Not conceptual, not editorial.
- **Exactly one obvious primary action per screen.** Everything else is visibly secondary.
- Ratings, counts and prices are self-explanatory without a legend.
- Name things by what the user understands, not by how the system works. "Compare two products", never "Head-to-head".
- Standard, predictable patterns for search, filters and navigation. Do not invent an interaction model the user has to learn.
- Every interactive element looks interactive without being hovered.
- Empty states and errors say what happened and what to do next.

Stripe, Mercury and Wise read as premium **because** they are clear, not despite it. Confusion never reads as expensive; it reads as confusion.

### Density rules

- **Six sections maximum on the homepage.** If a seventh feels necessary, one of the six is doing too little.
- No section may have more than one thing competing for attention.
- Section rhythm: `96 / 128 / 160 / 192` desktop, via clamp. When in doubt, go one step larger.
- Delete every element that carries no information. If it only exists because this brief listed it, delete it.
- Body text sets to a 68ch measure. Never full-bleed paragraphs.

---

## 3. WORKING RULES

- **No git operations, ever.** Not commit, push, branch, checkout, reset, stash, or merge. Report status; the user decides.
- **Stop after every phase.** Show screenshots at 1280 and 390, light mode, and wait for approval. No autonomous multi-phase runs.
- Read `AGENTS.md`. Read `node_modules/next/dist/docs/` before using Next APIs — your training data is behind this version.
- `lib/site.ts` is the single source of truth for country, currency, VAT, nav, contact, social. Never hardcode a market signal elsewhere.
- Do not change the database schema or `lib/queries/` contracts. Need new data? Add a query; do not reshape an existing one.
- Keep intact: `/api/track-click`, `/api/og` and `ogImageUrl()`, newsletter double opt-in, `scripts/` tooling.
- `globals.css` is 1,433 lines of the old lime/navy system. **Rewrite it in place** — other routes depend on selectors in it. Verify the admin area still renders before moving on.
- Admin: retokenise only. Do not touch admin logic, routing, or `[resource]` CRUD.
- **Simple over clever.** No new state manager, no animation abstraction layer, no design-system package. Three or four small primitives in `components/motion/` and nothing more.

---

## 4. COLOUR

### Brand palette (fixed)

| Token | Hex | Role |
|---|---|---|
| `bone` | `#EEEFE9` | Page background. Light is default. |
| `ink` | `#262626` | Type, rules, dark surfaces. |
| `sand` | `#D1BD91` | Accent. Fills, rules, rating marks. **Never body text on bone** — 1.6:1, it fails. |

### Derived and added

| Token | Hex | Role | On bone |
|---|---|---|---|
| `paper` | `#F6F6F2` | Raised surfaces — lifts cards **without shadows** | — |
| `bronze` | `#7A5F31` | Sand-family text: links, hovers, accented type | 5.2:1 |
| `petrol` | `#1E3A34` | Cool counterweight: charts, secondary dark, "pro" | high |
| `brick` | `#9A3B2A` | Functional negative only: cons, negative deltas | 5.4:1 |

**Why `petrol`:** bone + sand + ink alone collapses into beige, and beige-plus-serif is the most recognisable AI-design signature in circulation. One cool anchor breaks that read and gives charts a second series.

### Dark theme

Page `#141413`, surface `#262626`, type `bone`, links `bronze` → `sand`.

`petrol` (1.50:1) and `brick` (2.66:1) do not survive the inversion and both hold text roles. Add dark-only lifts: `petrol-lift #63A192`, and a brick lift that is **redder and cooler than `#D2755F`** — around `#E0776B` — because `#D2755F` sits at nearly the hue and chroma of `#D97757`, which §12 bans as the AI tell. Verify both clear 4.5:1 on `#141413`.

Ship dark working; design for light.

### Borders — two weights, two meanings

- Decorative (cards, sections, dividers): `color-mix(in oklch, var(--color-ink) 12%, transparent)`.
- **`--border-control` at ink 55%**, scoped strictly to operable boundaries: input, checkbox, radio, select, switch, focusable card. Ink 12% computes to 1.25:1 and WCAG 1.4.11 requires 3:1 on a control boundary.

### Other rules

- Shadows: two elevation levels maximum, and prefer border + `paper` fill over any shadow. The same soft grey shadow under every card is a template tell.
- **No gradient washes.** One exception: the inner-highlight gloss in §7.
- Ink surfaces are rationed — docked navbar, footer, and **exactly one full-bleed band per page.**
- All tokens in `globals.css` under Tailwind v4 `@theme`. No arbitrary hex in components: if a colour is not a token, it does not exist.

---

## 5. TYPOGRAPHY

**One family across the entire site.** No display/body split. The logo is the only exception.

**Switzer** (Fontshare, ITF Free Font License, free for commercial use), variable file — 43KB, smaller than the three statics it replaces, and the only option that can animate the 400→500 nav hover.

Load it by **inlining `@font-face` pointing at the `cdn.fontshare.com` file**, one `preconnect`, plus `<link rel="preload" as="font" crossorigin>`. Fontshare's CSS route splits across two origins and puts a render-blocking stylesheet in front of the LCP element. Nothing is redistributed, so the licence position is unchanged. **Pin the exact versioned file URL with a comment recording the fetch date** — Fontshare paths are versioned and a silent 404 is a production font failure. If it 404s at any point, stop and report; never fall back quietly.

### Scale

```
display-hero clamp(2.5rem, 5.2vw, 4.75rem) / 1.00 / -0.030em / 500   ← hero only
display-l    clamp(2.25rem, 4.5vw, 4rem)   / 0.98 / -0.030em / 500
h2           clamp(1.75rem, 2.6vw, 2.75rem)/ 1.05 / -0.020em / 500
h3           1.375rem                       / 1.20 / -0.010em / 500
body         1.0625rem                      / 1.60 /  0       / 400   max 68ch
small        0.875rem                       / 1.45
data         tabular-nums, 500
```

`display-hero` exists because at 1280 the hero well is 691px; a 96px size yields 14.2 characters per line and the headline breaks to five lines. **Cap hero headline copy at 28 characters per line so it sets in three.** If the copy does not fit, rewrite the copy — not the type scale.

Weights: **400, 500, 600 only.** Impact comes from size and negative tracking, never weight.

### Numbers

Format through `Intl.NumberFormat('en-ZA')`, render inside a span with `white-space: nowrap`, `font-variant-numeric: tabular-nums`, `word-spacing: -0.12em`. This fixes "6 196" reading as two numbers. Switzer's digits are already tabular, but the Arial fallback is not, and the swap window is exactly when a comparison table would jitter — keep the property.

### Typographic bans

Tracked-out ALL-CAPS eyebrows. One-word colour or italic accents in headlines. Meta strings joined with middle dots. `WORD — fragment` labels. Monospace for data labels. `→` in button or link text. Serif display type of any kind.

---

## 6. LAYOUT

The current site is a centred stack, which is why it reads as a template.

**Asymmetric editorial grid.** Twelve columns, a consistent left structural rail carrying section labels and counts, content on a fixed measure to its right. **Left-aligned by default.** Centred text at most once per page, and only for a single focal statement.

**Comparison as real structure**, not as an icon:
- Compare pages split on a true centre axis with a shared row rhythm.
- Head-to-head cards split A|B, never stacked.
- A **persistent compare tray** docks to the bottom of the viewport when a second product is selected anywhere, and follows the user across routes. This is what makes the marketing site behave like the product. Build it.

**Radii: two values, used to mean different things.** Pill (`999px`) for buttons, chips, the nav capsule. `14px` for cards and panels. `0` for full-bleed bands and table cells. One radius on everything is a template tell.

Watch CSS specificity between section-level and element-level padding — that is where generated stylesheets cancel themselves out.

---

## 7. MOTION

Use `motion` (`import { motion } from "motion/react"`, v12). CSS scroll-driven animation behind `@supports` where it removes JS. **Do not add Lenis or any smooth-scroll library.**

```
--ease-out-quint: cubic-bezier(.22, 1, .36, 1)     entrances, reveals
--ease-in-out:    cubic-bezier(.65, 0, .35, 1)     state changes
spring:           { stiffness: 220, damping: 26 }

160ms  micro         hover, press, focus
320ms  component     menus, sheets, tray
700ms  orchestrated  load sequence, hero reveal
```

### Rules

1. **One orchestrated, non-user-triggered moment per viewport. Maximum.** Fade-and-slide-up on every section plus hover-lift on every card is the generic default and reads as machine-generated. Sections reveal by masking the first heading line only; the rest is simply present.
2. **Motion answers user action.** Opening, expanding, confirming, comparing — always welcome, because it shows what changed. Motion that acts on its own is almost always wrong on this site.
3. `useReducedMotion` everywhere. Reduced motion renders the final state instantly, never a degraded half-animation.
4. `transform`, `opacity`, `clip-path` only. Never `width`, `height`, `top`, `left`.
5. Every animated element is present and correct in server-rendered HTML. If JS never runs, the page reads and ranks.

---

## 8. NAVIGATION

**At scroll top: no background at all.** Wordmark left, nav items inline on the bone page as plain ink text, no container, no border, no blur, one ink pill CTA right. The page's own background is the navbar's background.

**Past ~80px: the nav collapses.** The item row contracts into a compact capsule via layout animation (`layout` / shared `layoutId`), not a fade-swap. Search collapses to a `⌘K` affordance. The capsule gets the scoped gloss: `background: var(--color-ink)`, 1px border, `box-shadow: inset 0 1px 0 rgb(255 255 255 / .14)` — gloss from an inner highlight, never a gradient. Reversing scroll expands it back.

The collapse is the navbar's whole idea. Get the spring right and nothing else needs to be clever.

**Micro-interactions — the complete list:** hover shifts variable weight 400 → 500 with an ink underline drawn from the left, 160ms; press is `scale(0.98)`, 120ms. Nothing more. More reads as nervous, not premium.

**Categories sheet:** opens **on click, never hover.** Full-width, `clip-path` reveal, four columns with live counts from `lib/queries/`, one featured comparison. `Esc` closes, focus trapped, focus returns to trigger.

**Mobile:** full-screen sheet, large type, 40ms stagger. Compare tray stays docked above it.

---

## 9. PAGE LOAD

Runs on first load and hard reload. **1200ms hard cap.** Skippable on any key or click. Once per session via `sessionStorage`. Never on client-side navigation.

```
0ms     Bone screen, logo mark small and optically centred
150ms   A 1px sand rule sweeps horizontally through the mark
420ms   The mark travels to its navbar position (shared layoutId)
600ms   Hero headline reveals line by line under a clip-path mask, 60ms stagger
800ms   The scale settles into place, level, with a single small overshoot
1200ms  Done. Nothing animates again until the user acts.
```

**No percentage counter, no progress bar, no full-screen logo hold.** The full page is in the DOM throughout — the intro is an overlay and a set of transforms, never a gate on rendering. Crawlers and reduced-motion users see complete content at 0ms. **Test the hard-reload case specifically.**

---

## 10. HERO

Delete the current hero entirely: centred stack, lime-to-cream gradient card, scattered 3D props, floating stats card. Also delete the first rebuild attempt — a hard dark panel behind the transparent scale, wrong in light mode and not responsive. **Never put a dark rectangle behind the scale.**

### Composition

Full-viewport, bone background. **No gradient, no photograph, no glass.**

- **Left, ~6 columns:** headline at `display-hero`, left-aligned, three lines maximum. Below it one sentence naming the mechanism — independent reviews from SA businesses, ZAR pricing, no paid ranking. Below that, the search field.
- **Right, ~6 columns, overlapping into the headline column:** the scale. Overlap the descender zone of the final line, never the middle of a word. Occlusion creates depth with zero effects.

### The scale — corrected

**The beam sits perfectly level at rest. Always.** A scale that leans says Indaba has already picked a winner, on a site whose whole claim is that rankings cannot be bought. Balance is the logo.

- No idle sway. No automatic chip swap. No autonomous motion of any kind.
- It tilts **only** when the user actively compares two products — then it leans toward the higher-rated one and settles. That single behaviour is worth more than any ambient animation, because it means something.
- On scroll: at most 20px of parallax on the disc. Small.

**The disc:** the scale sits on a large flat `sand` ellipse bleeding off the right edge — a shape in the composition, not a card or panel, travelling with the asset at every breakpoint. **The disc stays light in both themes**, desaturating rather than darkening in dark mode, so the transparent PNG always sits on a light surface. That is the fix for the earlier rejection.

**Asset:** the current file is 316×303px, too small to be the hero, and its icon accents are pixel-matched to the deleted lime (`#E7FE9A` / `#D9F65F`). Do not design around its current size or colour. Build against a placeholder at the intended final dimensions — roughly 1600px wide, transparent, accents in sand/ink/petrol — behind a single asset path so the real export drops in with no layout change.

### Search field

Search is the product on a directory, so it is the hero's primary object. Full width in its column, `paper` fill, `--border-control`, pill radius, generous height. **Static placeholder** — no cross-fade, no typewriter. That was a second automatic animation competing with the scale, and §7 rule 1 forbids it. The popular-category chips below carry that signal instead, sourced from real data.

Focus opens the same cmdk panel as `⌘K`. One search implementation, two entry points.

### Below the hero

- **Vendor logo marquee** — continuous, seam-free, pauses on hover, ink-55% greyscale to full colour on hover, static row under reduced motion.
- **Three stats, counted up once on entry** — reviews, software, categories. Plainly typeset on the bone with hairline rules between. Not floating cards.

### Copy

Write the real thing. State what Indaba is in words a non-technical business owner uses. Sentence case. No exclamation marks, no "revolutionise", no "seamless", no emoji.

---

## 11. PAGES

### Homepage — six sections, hard cap

1. **Hero** — §10.
2. **Logo marquee + stats.**
3. **Browse by category.** Not six identical cards. An editorial two-column index: each row a category with live product count and its top three vendor logos; hovering a row previews its leading product on the right.
4. **How Indaba rates software.** The trust engine, and the only place numbered markers are legitimate because it genuinely is a sequence. Three steps: how reviews are verified, how ZAR pricing is checked, how rankings are set and why sponsorship cannot buy one.
5. **Top rated software.** A **ranked table, not cards.** Rank, logo, name, rating bar, review count, ZAR entry price, and a compare checkbox filling the persistent tray. Tabular figures. A table where visitors expect cards is the most confident thing on the page and also the most useful.
6. **Newsletter** — the single full-bleed ink band. Double opt-in, honest about frequency.

Then the footer: large wordmark, sitemap columns, POPIA/PAIA, affiliate disclosure, editorial policy, country and currency from `lib/site.ts`.

Reviews and guides move to their own pages and are linked, not stacked onto the homepage. That is the cut v1 should have made.

**Rating bars:** sand fill on an ink-12% track with a 1px bronze edge, and **the numeric value always adjacent.** Sand on paper is 1.70:1; the adjacent figure is what makes it legible rather than a defect.

### Templates

- **Category listing** — filter rail left, results right, sticky filter summary, result count in tabular figures, an empty state that invites action.
- **Product profile** — the money page. Screenshot carousel, pricing table with VAT, features, integrations, rating distribution (petrol and sand as the two series), FAQs, alternatives, reviews plus submission form, affiliate CTA with click tracking intact. Sticky summary rail: rating, price from, add to compare.
- **Compare page** — true centre-axis split, sticky header row, differences highlighted, a genuinely useful "what to pick" verdict block. This page is the brand thesis. Make it the best page on the site.
- **Search** — same cmdk implementation, full-page surface.
- **Blog and post** — 68ch measure, real hierarchy, generous leading.
- **About / methodology, contact, legal** — retokenise, keep the content authoritative.
- **404** — searchable, not a joke.

---

## 12. BLOCKLIST

This palette sits inside the most recognisable AI-design cluster in circulation: warm cream, high-contrast serif, terracotta accent. Keep the palette; refuse everything else in the cluster.

Banned: serif display type. Terracotta or clay near `#D97757`. Gradient fills and washes (the §8 inner-highlight gloss excepted). Emoji anywhere in the UI. Sparkle, spark, zap or "AI" iconography. Bento grids. Identical rounded cards with identical shadows. `01 / 02 / 03` numbering outside §11.4. Glassmorphism, backdrop-blur stacks, neumorphism. Testimonial marquees, auto-playing carousels, parallax on more than one element per viewport. Stock photos of people at laptops. `→` in button labels. ALL-CAPS eyebrows. Middle-dot meta strings. Monospace data labels.

If you reach for one of these because a section looks empty, the section is wrong. Fix the section.

---

## 13. RESPONSIVENESS, ACCESSIBILITY, PERFORMANCE

### Responsiveness — has broken twice; treat as first-class

Screenshot every one before calling a section done:

```
390   768   1024   1280   1440   1536   1920
```

`1280` is 100% browser zoom on a 1080p Windows laptop and is the failure case both times. Also test **125% Windows display scaling** — the default on your audience's machines.

No fixed heights on anything containing text. `clamp()` on every type size and section pad. No horizontal overflow at any width. Below 1024 the hero stacks with the scale above the fold but smaller — never cropped, never overlapping the search field.

Widen `scripts/shoot.ts` to all seven widths in both themes, checking horizontal overflow and reduced-motion correctness.

### Accessibility

WCAG AA on every text pair. Visible keyboard focus everywhere: a `bronze` ring at 2px offset, never `outline: none`. Full keyboard operation of nav sheet, cmdk, compare tray, all forms. Semantic landmarks. Alt text on the scale describing its meaning. `prefers-reduced-motion` honoured on every animation in the inventory.

### Performance and SEO — rankings are revenue

- LCP under 2.0s on throttled 4G. **The hero headline is the LCP element and must be server-rendered text**, never inside a client component gated on an animation.
- CLS exactly 0. Reserve space for the scale, marquee and every image.
- Scale asset: `next/image`, `priority`, correct `sizes`, AVIF/WebP with PNG fallback.
- `motion` imports lazy where the component is below the fold.
- Preserve every metadata export, canonical URL, JSON-LD block and OG route. Add `Product`, `Review`, `AggregateRating` structured data on profiles if absent.

---

## 14. PHASES — stop after each one

```
2   Tokens, fonts, motion primitives, theme, globals.css rewrite   → verify admin renders
3   Navbar + page-load sequence
4   Hero
5   Remaining homepage sections + compare tray
6   Template pages
7   Responsive sweep, a11y audit, Lighthouse
```

After each: screenshot at 1280 and 390 in light mode, critique your own work against §2 and §12, then **stop and wait.** No git operations at any point.

Keep `docs/design/design-notes.md` of what you tried and rejected, so later phases do not re-litigate settled decisions.

---

## 15. DONE

- [ ] A stranger understands what Indaba is within ten seconds of the homepage.
- [ ] Six homepage sections. One primary action per screen.
- [ ] The hero scale is level at rest and moves only when the user compares.
- [ ] Every colour is a token; no arbitrary hex in any component.
- [ ] One typeface, weights 400/500/600, tabular figures on every number.
- [ ] "6 196" renders as one number at every breakpoint.
- [ ] Load sequence under 1200ms, skippable, once per session, invisible to crawlers and reduced-motion users.
- [ ] Navbar has no background at scroll top and collapses via layout animation.
- [ ] The scale sits on a light disc in **both** themes.
- [ ] Compare tray works across routes.
- [ ] Zero horizontal overflow at all seven widths and at 125% Windows scaling.
- [ ] Lighthouse: Performance ≥ 90, Accessibility 100, SEO 100 on home and one profile.
- [ ] Dark mode complete; light is default.
- [ ] Admin untouched and working.
- [ ] Nothing from §12 appears anywhere.
- [ ] No git command was run.

---

## 16. THE ONE THING

**Spend all the boldness on the scale, and keep everything else disciplined and clear.** One meaningful moment surrounded by restraint reads as expensive. Five moments read as a template with the effects turned up.

Before you call any page finished, read it as a business owner choosing payroll software — then remove one thing.