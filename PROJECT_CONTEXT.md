# Indaba — Complete Project Context

> **Purpose of this file.** This is a full handoff briefing for another AI (or a new
> developer) picking up this codebase cold. It describes what the product is, every
> feature that exists, the full data model, the design system, every animation, the
> conventions the code follows, and what is deliberately *not* built yet.
> Everything here was read out of the source, not assumed.
>
> Generated: 2026-09-03. Branch `main`, clean working tree.

---

## 1. What the product is

**Indaba** is an independent software review and comparison directory for the
**South African** business software market. Think G2 / Capterra, but built for one
country and with the local compliance detail that global directories get wrong.

- **Domain:** `indaba.co.za`
- **Tagline:** "South Africa's independent business software guide"
- **Positioning line (hero headline):** *"South African business software, weighed in the open."*
- **Sub-line:** *"Every price in rands with VAT shown, every reviewer named and verified, and no vendor can buy a ranking."*
- **Contact:** hello@indaba.co.za · +27 21 300 4820 · Cape Town, South Africa
- **Locale:** `en-ZA`, currency ZAR (`R`), VAT 15%

### The editorial proposition (this drives almost every technical decision)

1. **Prices are in rand, with the VAT basis stated.** `vat_inclusive` is a
   *nullable* boolean — `null` means "we have not confirmed it" and the UI says
   "VAT status unconfirmed" rather than guessing. Every price carries a
   `price_source_url` and `price_verified_at`.
2. **Rankings cannot be bought.** Ordering is a **Bayesian weighted average**
   (`lib/ranking.ts`), never a raw star count.
3. **Aggregate ratings are computed only by a Postgres trigger.** No application
   code path may write `overall_rating`, its four siblings, or `review_count`.
   They are typed `readonly` in TypeScript and excluded from the admin field
   whitelist.
4. **POPIA compliance is real, not decorative.** IPs are never stored — only a
   **peppered** SHA-256 (`IP_HASH_PEPPER`). If the pepper is missing, the code
   stores `null` rather than a reversible hash. Newsletter is double opt-in.
5. **Affiliate disclosure appears next to every commercial CTA**, and money
   beats analytics: a click-logging failure must never cost a redirect.

### Monetisation model (built, not yet wired to providers)

- **Affiliate links** via `/api/track-click?software=<slug>` → logs → 302 to vendor.
- **Display ad slots** (`SponsoredAd`) reserving exact dimensions (leaderboard
  728×90, billboard 970×250, half-page 300×600, vertical video 300×400) with a
  visible "Sponsored" label. No ad network connected yet.
- **"List your software"** CTA in the navbar → `/contact?intent=listing`.
- Newsletter list building (no mail provider connected yet).

---

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16.2.10**, App Router | ⚠️ Breaking changes vs. older Next. See §11. |
| React | **19.2.4** | Server Components by default. |
| Language | TypeScript 5, `strict: true` | Path alias `@/*` → repo root. |
| Styling | **Tailwind CSS v4** (`@tailwindcss/postcss`) | CSS-first config in `app/globals.css`; no `tailwind.config.js`. |
| UI primitives | `radix-ui` (unified package) + local shadcn-style wrappers in `components/ui/` | 21 primitives. |
| Icons | `lucide-react` ^1.31.0 | |
| Theme | `next-themes`, class strategy, **`enableSystem={false}`**, default `light` | |
| Database | **Supabase** (Postgres + Auth + Storage) | Optional at build time — see §6. |
| Charts | `recharts` ^3.10.1 | |
| Carousel | `embla-carousel-react` | Screenshots only. |
| Command palette | `cmdk` | ⌘K / Ctrl+K search. |
| Toasts | `sonner` | |
| Analytics | `@vercel/analytics` | |
| Fonts | Self-hosted woff2 via `next/font/local` | Inter (variable 100–900) + IBM Plex Mono (400/500). |
| Screenshot rig | `playwright` (dev only) | `scripts/shoot.ts`. |
| Deploy target | Vercel | Last two commits were Vercel build fixes. |

### Scripts (`package.json`)

```
dev / build / start / lint / typecheck
seed              seed categories, software, alternatives, taxonomy
seed:reviews      generate + insert the deterministic review corpus
seed:articles     seed the 6 guides
seed:comparisons  build head-to-head pairs from curated alternatives
seed:pages        seed the 7 legal/trust pages
seed:all          all of the above, in order
logos             fetch vendor logos into public/logos
create-admin      create the single admin user in Supabase
check-copy        editorial copy linter
verify-db         schema/data sanity check
research:pricing  pricing research scripts
pricing:sources   pricing provenance report
```

---

## 3. Content inventory (what actually exists as data)

All content lives in `lib/content/` as typed TypeScript, which is used **both** by
the seed scripts *and* by `lib/fallback-data.ts`. That means the site renders
identical real content with or without a database.

| Thing | Count | Source file |
|---|---|---|
| Categories | **6** | `scripts/seed.ts` + `lib/fallback-data.ts` |
| Products | **39** | `lib/content/catalogue.ts` (1,835 lines) |
| Reviews (target total) | **6,196** | generated by `lib/content/generateReviews.ts` |
| Buying guides / articles | **6** | `lib/content/articles.ts` |
| Legal & trust pages | **7** | `lib/content/pages.ts` |
| Comparisons | 2 per product, deduped | `scripts/seed-comparisons.ts` |
| Taxonomy terms ("best for") | business_size / role / industry | `lib/content/taxonomy.ts` |
| Pricing records w/ provenance | per product | `lib/content/pricing.ts` (804 lines) |
| Vendor logos | 35 files | `public/logos/` + `lib/logo-manifest.ts` |

### The six categories

| Name | Slug | Icon | Products |
|---|---|---|---|
| Accounting Software | `accounting-software` | calculator | 9 |
| Payroll Software | `payroll-software` | wallet | 7 |
| HR Software | `hr-software` | users | 6 |
| CRM Software | `crm-software` | handshake | 7 |
| ERP Software | `erp-software` | boxes | 5 |
| Project Management | `project-management` | kanban | 5 |

Category descriptions are deliberately local: *"EMP201 submissions, IRP5
certificates, UIF declarations and ACB payment files."*

### The catalogue's selection principle

Products were chosen because **South African businesses actually shortlist
them**, not because they rank globally. That is why SYSPRO, Omni Accounts,
PaySoft, Paymaster, QuickEasy BOS, LabourNet and PaySpace sit alongside
Salesforce, Asana and Workday.

Each `CatalogueEntry` carries: slug, name, categorySlug, tagline, short + full
HTML description, vendor name/website, foundedYear, featured flag, topFeatures,
features, integrations, supportTypes, countries, languages, five target rating
averages, a target reviewCount, curated `alternatives` (by slug), and `bestFor`
taxonomy slugs.

**Editorial standard enforced in the catalogue:** plain sentences, real
specifics, honest about weaknesses, British/South African spelling, **no em
dashes**.

### Review generation

`lib/content/generateReviews.ts` + `lib/content/corpus.ts` produce reviews
deterministically:

- **mulberry32** PRNG seeded per product (`hashString(slug)`) — the same product
  always produces the same reviews, so fallback data is stable across renders and
  re-seeding does not churn the database.
- Star distribution is driven by the product's **target average**, so disliked
  products get a believable tail of 1★/2★ reviews rather than uniform praise.
- Sentence banks for titles, summaries, pros, cons (mild + critical), vendor
  responses; plus SA first/last names, cities, industries, job titles, company
  name prefixes/suffixes, weighted company sizes and usage durations.

---

## 4. Route map (every page that exists)

### Public — `app/(public)/`

| Route | File | What it does |
|---|---|---|
| `/` | `page.tsx` | Home. 8 sections, see §5. `revalidate = 3600`. |
| `/software` | `software/page.tsx` | Directory. Filters + sort + pagination (10/page). |
| `/software/[slug]` | 630 lines | **The flagship page.** See §4.1. |
| `/software/[slug]/reviews` | | Full review archive with filters. |
| `/software/[slug]/reviews/new` | + `actions.ts` | Review submission form (server action). |
| `/software/[slug]/alternatives` | | "Alternatives to X" page. |
| `/categories` | | All six categories. |
| `/category/[slug]` | 165 lines | Category landing with editorial intro + checklist. |
| `/compare` | | Comparison index + two-select picker. |
| `/compare/[pair]` | 135 lines | Head-to-head dashboard. Canonical slug redirect. |
| `/blog` | + `loading.tsx` | Guides index. |
| `/blog/[slug]` | 185 lines | Long-form article. |
| `/search` | | Full-text search results. `noindex, follow`. |
| `/about`, `/contact`, `/newsletter`, `/newsletter/unsubscribe` | | Company pages. |
| 7 legal pages | via `LegalPage` component | privacy-policy, cookie-policy, terms, paia-manual, accessibility, editorial-policy, affiliate-disclosure |

### Admin — `app/(admin)/admin/`

| Route | What |
|---|---|
| `/admin` | Dashboard: counts + **unverified-price watchlist** (the most important number on the screen) + recent reviews. |
| `/admin/login` | Supabase email/password. |
| `/admin/[resource]` `/new` `/[id]` | Generic CRUD driven by the resource registry. |
| `/admin/newsletter` + `/admin/newsletter-export` (route) | Subscriber list + CSV export. |
| `/admin/contact` | Contact messages + handled toggle. |
| `/admin/analytics` | Affiliate click analytics. |
| `/admin/settings` | `site_settings` key/value editor. |

Admin resources registered: **software, reviews, categories, articles,
comparisons, pages, redirects**.

### API routes

| Route | Purpose |
|---|---|
| `GET /api/track-click?software=<slug>` | Log affiliate click (peppered IP hash, UA, referrer, country) → 302 to vendor. **Never blocks the redirect.** |
| `GET /api/newsletter/confirm?token=` | Double opt-in confirmation. |
| `GET /api/og?title=&eyebrow=&subtitle=&rating=&reviews=` | Dynamic OG image via `next/og` / satori. Navy card, lime corner wash. No web font fetched (crawlers won't wait). |

### Metadata routes

- `app/sitemap.ts` — every published entity, including per-product `/reviews` and
  `/alternatives` (distinct long-tail queries). `revalidate = 3600`.
- `app/robots.ts` — disallows `/api/`, `/admin`, `/search`.
- `app/not-found.tsx`, `app/favicon.ico`.

### `proxy.ts` (root)

⚠️ **Next 16 renamed `middleware` to `proxy`.** Runs on the Node runtime. Two jobs:

1. **Redirects** — reads the `redirects` table, cached in module scope for 5
   minutes. A lookup failure must never take the site down.
2. **Auth** — refreshes the Supabase session and guards `/admin/*`. Uses
   `getUser()` (revalidates against the auth server), **not** `getSession()`
   (which only trusts the cookie).

Matcher excludes `_next/static`, `_next/image`, `favicon.ico`, `logos/`, and all
image/txt/xml extensions.

### 4.1 The software profile page — section by section

Sticky `ProfileNav` pill bar tracks these sections:

1. **Overview** — hero block: logo, name, tagline, `CircularRating` dial in the
   product's brand colour, star rating, category badge, affiliate CTA.
2. **Pricing** — `PricingCards` (per-plan) + `PricingTable` (what the jump
   between tiers actually buys). VAT basis stated. Price source link.
3. **Features** — top features highlighted, then the full list.
4. **Screenshots** — only rendered when the product actually has them (Embla carousel).
5. **Ratings** — `SoftwareRatingsChart` (recharts), four dimension `RatingBar`s,
   `SentimentBar`, star distribution, `CompanySizeChart` (who is reviewing this).
6. **Compare** — link to the top alternative head-to-head.
7. **Reviews** — top 3 by helpfulness + link to the archive.
8. **Alternatives** — 3 curated `AlternativeCard`s.
9. **FAQs** — **generated from the product record**, never hand written, so
   FAQPage structured data can never contradict the visible page.

**Structured data emitted:** `Product` with `AggregateRating` + individual
`Review` nodes, `FAQPage`, and `BreadcrumbList` (emitted alongside the visual
breadcrumbs so the two cannot disagree).

`generateStaticParams` pre-renders all 39 products. `revalidate = 3600`.

---

## 5. The homepage, in order

1. **Hero** — full-bleed band, outside the site container (see §8 for the full
   animation sequence).
2. **Category explorer** (`HomepageExplore`) — client-side tabs, six categories,
   6 products each in a nested grey tray.
3. **Comparisons strip** — 3 trending head-to-heads.
4. **Top rated** — 3 products by Bayesian score, with live star distributions.
5. **Newsletter band**.
6. **Recently reviewed** — 3 most recently updated, numbered `01`–`03`.
7. **Blog preview** — 3 guides as a numbered editorial list with oversized `01`
   numerals that turn brand-olive on hover.
8. **`GlossyCTA` → "Read all guides"**.

Sections 3–8 each carry `.reveal-on-scroll`.

Every `SectionHeader` takes `eyebrow`, `icon`, `title`, `highlight`, `subtitle` —
the heading is split so the **one lime highlight per section** rule stays
enforceable.

---

## 6. Data layer

### The fallback-data pattern (important)

`lib/supabase/config.ts` exposes `isSupabaseConfigured()`. Every query function
in `lib/queries/*` calls `createClient()`, and **if it returns null, falls back to
`lib/fallback-data.ts`** — which is assembled from the same catalogue, pricing and
article modules the seed scripts use.

Consequences:
- The site builds and renders completely with **no database and no env vars**.
- What you see locally is what lands in the database.
- A pricing error shows up in development rather than after launch.
- Fallback software IDs are prefixed `sw-`; `track-click` checks for that prefix
  and writes `software_id: null` rather than a fake FK.

### Query modules (`lib/queries/`)

| File | Exports (main) |
|---|---|
| `software.ts` (254 ln) | `getAllSoftware`, `getTopRatedSoftware`, `getFeaturedSoftware`, `getRecentlyReviewedSoftware`, `getSoftwareByCategory`, `getSoftwareBySlug`, `getAlternatives`, `getDirectory(filters)`, `getStarDistributions` |
| `reviews.ts` | `getReviews(id, {limit, sort})`, `getCompanySizeBreakdown` |
| `categories.ts` | `getCategories` |
| `articles.ts` | `getLatestArticles`, `getArticleBySlug` |
| `comparisons.ts` | `getTrendingComparisons`, `getComparisonPair` |
| `search.ts` | `search(q)`, `getSearchIndex()` (feeds the ⌘K dialog from the public layout) |
| `stats.ts` | `getSiteStats()` → reviewCount / softwareCount / categoryCount |
| `pages.ts` | `getPageBySlug` |

### Supabase clients (`lib/supabase/`)

- `client.ts` — browser client.
- `server.ts` — `createClient()` (cookie-based, RLS applies) and
  `createServiceRoleClient()` (**bypasses RLS; server routes only**).
- `config.ts` — env reading + `getServiceRoleKey()`.

### Ranking (`lib/ranking.ts`)

```
score = (C·m + n·R) / (C + n)

R = product's own average
n = its review count
m = platform mean (weighted by review volume, unrated products excluded)
C = prior weight = median review count across rated products
```

Prior is **derived from the catalogue at query time**, not hardcoded, so it stays
correct as the catalogue grows. Ties break on review count.

Also here: `sentimentFromDistribution` (4–5 positive, 3 neutral, 1–2 negative),
`sentimentPercent`, `emptyDistribution`.

### Formatting (`lib/format.ts`) — the South African details

- Grouping via `Intl` with `en-ZA`, then `U+00A0` is replaced with **`U+202F`
  (narrow no-break space)**, because a full word space splits `6 196` into "6"
  and "196" at display sizes.
- `formatPrice` → `R1 375`, `US$49`. Whole rands never show decimals.
- `formatPricePerPeriod` → `R240/mo`. Unknown period → no suffix, never a guess.
- `startingPriceLabel()` returns `{amount, note, isCustom}` — null price becomes
  **"Pricing on request" / "The vendor does not publish a list price"** rather
  than a fabricated number.
- `addVat` / `removeVat` at 15%.
- `formatRating` uses a **full stop** (`4.3`) even though en-ZA uses a comma,
  because a rating is a label and schema.org wants a full stop.
- `formatDate` → `4 May 2026`; `formatMonthYear` → `May 2026`;
  `formatReviewCount`; `formatReadTime`.

---

## 7. Database schema (`supabase/migrations/`)

Four idempotent migrations, applied in order.

### `0001_schema.sql` — 19 tables

`admin_users` (allowlist + `is_admin()` SECURITY DEFINER function),
`categories`, `software`, `reviews`, `review_helpful_votes`, `articles`,
`software_alternatives`, `comparisons`, `software_price_history`,
`taxonomy_terms`, `software_taxonomy`, `affiliate_clicks`, `pages`,
`site_settings`, `newsletter_subscribers`, `contact_messages`, `audit_log`,
`redirects`, `media_library`.

Notable columns:
- `software.search_vector` — generated `tsvector` (name + tagline + short desc +
  vendor), GIN indexed. Same pattern on `articles`.
- `software` JSONB columns: `screenshots`, `pricing_plans`, `features`,
  `top_features`, `integrations`, `support_types`, `countries_available`, `languages`.
- The six aggregate columns carry the comment: *"Written ONLY by
  update_software_ratings(). Application code must never assign these."*
- `reviews` carries five 1–5 CHECK-constrained ratings plus reviewer identity,
  `verified_linkedin`, `verified_badge`, `vendor_response`, `helpful_count`.
- `affiliate_clicks.ip_hash` — peppered SHA-256, *"A raw IP address is never
  stored, for POPIA reasons."*
- Uses `gen_random_uuid()` (pgcrypto), not `uuid_generate_v4()`.

### `0002_triggers.sql`

1. **`update_software_ratings`** — recomputes all five averages + review count
   for one product from **published reviews only**, rounded to 1 decimal. Handles
   INSERT/UPDATE/DELETE and the case where a review moves between products.
2. **`update_category_counts`** — recomputes `categories.software_count` from
   published software.
3. Plus `updated_at` maintenance and audit-log triggers.

### `0003_rls.sql` — three tiers

- **anon** — read published content only.
- **admin** — full write, gated on `is_admin()` (membership of `admin_users`).
  Deliberately *not* "authenticated can do anything", which would hand write
  access to any future signup.
- **service role** — bypasses RLS; used only by click logging, newsletter and
  contact routes.

The file drops every existing policy first so it stays re-runnable.

### `0004_storage.sql`

Four public-read buckets: `logos`, `screenshots`, `avatars`, `articles`.
Write policies gated on `is_admin()`.

---

## 8. THE DESIGN SYSTEM

`app/globals.css` is **1,433 lines** and is the single source of truth. It is
organised into 7 numbered sections: Tokens, Theme mapping, Base, Layout language,
Motion, Prose systems, Hero.

### 8.1 The colour decision that shapes everything

**The primary brand colour is LIGHT.** Lime is a *fill*. It never carries white
text and never becomes body text on a white page. Three roles, never confused:

| Token | Value (light) | Role |
|---|---|---|
| `--brand` | `#d9f65f` | signature lime — **FILLS ONLY** |
| `--brand-strong` | `#c9ec3e` | hover fill |
| `--brand-ink` | `#1a2008` | the only ink that sits **on** lime |
| `--brand-dark` | `#4c5f0a` | brand-coloured **text** on light surfaces (7.1:1) |
| `--brand-light` | `#f3fbd3` | pale lime wash |
| `--navy` | `#1b1f3b` | secondary brand, panels, admin sidebar |
| `--amber` / `--star` | `#f5a623` | star rating fill |
| success / warning / error | `#10b981` / `#f59e0b` / `#ef4444` | |

In dark mode **only two brand tokens flip**: `--brand-dark` becomes the lime
itself (readable on dark), `--brand-light` becomes `#2c3512`. Everything else is
a straight surface swap.

Semantic tokens (light → dark): `--background` `#ffffff` → `#0c0e14`,
`--foreground` `#111827` → `#f4f4f5`, `--card` `#ffffff` → `#12141d`,
`--muted` `#f9fafb` → `#181b26`, `--border` `#e5e7eb` → `#262a38`.

Chart palette: `--chart-1..5`. Admin sidebar has its own `--sidebar-*` set.

Every raw token also exists as a `--color-*` alias, and `@theme inline` maps them
into Tailwind utilities (`bg-brand`, `text-brand-dark`). **One source of truth,
three ways to reach it.**

### 8.2 Theme mechanics

- `@custom-variant dark (&:where(.dark, .dark *))` — Tailwind 4 needs the dark
  variant wired to the class, because `next-themes` drives a class on `<html>`.
- `enableSystem={false}`, `defaultTheme="light"`.
- A **pre-paint inline script** in `app/layout.tsx` runs *before* next-themes'
  own script and discards any stored theme that isn't exactly `"light"` or
  `"dark"` — because next-themes only sanitises storage when `enableSystem` is
  on, so a stale `"system"` value would be written to `<html>` as
  `class="system"` and desync the toggle and the toasts.
- `viewport.themeColor` is a single `#ffffff`, not a `prefers-color-scheme` pair,
  because the OS no longer drives the theme.

### 8.3 Typography

- **Inter** (variable 100–900) — everything: headings, body, labels, table cells,
  forms, article text. Exposed as `--font-inter`, **not** `--font-sans`, because
  Tailwind 4 emits its own `--font-sans` on `:root` and two declarations at equal
  specificity would be decided by stylesheet order. `@theme inline` maps
  `--font-inter` → `--font-sans` + `--font-heading`.
- **IBM Plex Mono** (400/500) — the data face. Carries the hero trust-row counts.
  `adjustFontFallback: false`, because the generated metric override is measured
  against Arial and would reflow the numerals it exists to hold still.
- Both loaded from committed woff2 files via `next/font/local`, **not**
  `next/font/google`, so a CI machine that cannot reach `fonts.googleapis.com`
  doesn't fail the build.
- `font-synthesis-weight: none` on all headings — never let the browser fake a bold.

Hero type scale (each size carries its own tracking + leading):
```
--text-hero:      clamp(2.5rem, 1.2rem + 3.6vw, 4.5rem)   lh 1,   ls -0.03em
--text-hero-sub:  clamp(1.0625rem, 0.95rem + 0.5vw, 1.1875rem)  lh 1.6
--text-hero-stat: clamp(1.625rem, 1.35rem + 0.9vw, 2rem)  lh 1.1, ls -0.02em
```
The middle term was deliberately re-derived: a bare `5.5vw` gave 70px at 1280 and
72px at 1440 — barely any ramp across a range where the 7-column measure loses
94px, making 1280 the pinch point. The intercept form ramps properly: 47px @768,
56px @1024, 65px @1280, 71px @1440, ceiling 72px from 1500 up.

### 8.4 Layout language

- **`.container-site`** — `max-width: 1440px`, padding 1rem → 2rem @768 → 3rem
  @1024. Every page sits inside it. The hero is the one exception.
- **Radius scale** derived from `--radius: 0.5rem`: sm ×0.6, md ×0.8, lg ×1,
  xl ×1.4, 2xl ×1.8, 3xl ×2.2, 4xl ×2.6.
- **`.card-modern`** — 1.5rem radius, two-layer shadow, transitions on transform
  / box-shadow / border-color at `cubic-bezier(0.16, 1, 0.3, 1)`.
  `.card-modern-hover:hover` → `translateY(-4px)` + deeper shadow.
- **`.brand-highlight`** — the lime highlight span. *"The single most
  recognisable element of the brand. One heading per section, two or three
  words, never twice in the same heading."*
- **Nested tray pattern** — a soft grey outer (`bg-zinc-100/80` /
  `dark:bg-zinc-900/60`) at `rounded-[1.75rem]`, `p-2`, holding cards at
  `rounded-[1.4rem]` with a 2px gap. Used by the homepage explorer, recently
  reviewed, and the screenshot carousel.

### 8.5 The glossy button (`.btn-glossy`)

A rounded rectangle (0.875rem), **never a pill** by default. Fully parameterised
via `--btn-bg`, `--btn-ink`, `--btn-glow` so it can be recoloured per product.

Composition:
- A glass sheen gradient over the top half (white 0.4 → 0.14 → 0 by 52%).
- A fill gradient (lighter 14% → base at 55% → darker 14%).
- A bezel border: `color-mix(in srgb, var(--btn-bg), #000 22%)`.
- Four shadows: inset top highlight, inset bottom highlight, an inset pillow
  (`inset 0 -5px 9px`), and a drop shadow **tinted to the fill**.

States: hover → `translateY(-1px)` + `brightness(1.06) saturate(1.04)` + larger
glow. Active → `translateY(0) scale(0.98)` + `brightness(0.97)` + inverted inset.
Disabled → `opacity 0.55`, no transform.

Variants: `.btn-glossy-dark` (`#232428`/white), `.btn-glossy-white`
(white/navy). Sizes sm `h-9`, md `h-11`, lg `h-13`.

`GlossyButton` renders a `Link` when given `href`, a `<button>` otherwise — never
a div pretending to be interactive.

### 8.6 Glass material (nav + chips)

One material, two intensities:

```
--glass-fill          rgba(255,255,255,0.58)   →  dark: rgba(41,52,88,0.42)
--glass-fill-strong   rgba(255,255,255,0.82)   →  dark: rgba(24,31,56,0.72)
--glass-control       rgba(15,23,42,0.05)      →  dark: rgba(255,255,255,0.07)
--glass-control-hover rgba(15,23,42,0.10)      →  dark: rgba(255,255,255,0.16)
--glass-edge          rgba(15,23,42,0.10)      →  dark: rgba(255,255,255,0.13)
--glass-sheen         rgba(255,255,255,0.90)   →  dark: rgba(255,255,255,0.16)
--glass-shadow        rgba(15,23,42,0.34)      →  dark: rgba(0,0,0,0.60)
```

Two documented insights:
- **Light theme tints *down*, not up** — a well cut into a light pane reads as a
  control; a lighter chip on it reads as nothing.
- **Dark glass is the hard one** — raise the fill alpha and it stops being glass
  and becomes a grey box. So the fill stays low, **the blur does the work**, and
  the top sheen plus a lighter edge are what make it read as a lit pane.

### 8.7 Three prose systems

Deliberately three, *"because the same CSS cannot serve a legal page and a
magazine article."*

| Class | Used by | Character |
|---|---|---|
| `.prose-content` | vendor descriptions on profile pages | 1rem / 1.75, disc bullets, lime-bar blockquote |
| `.legal-content` | the 7 policy pages | 0.975rem / 1.8, **lime dot** bullets, dashed-border tables, `scroll-margin-top: 6rem` on h2 |
| `.article-content` | blog posts | 1.075rem / 1.85, oversized first paragraph as standfirst, **lime diamond** bullets (rotated squares), **lime circle counters** for `<ol>`, rounded-corner blockquote with one square corner (`1.25rem 1.25rem 1.25rem 0.35rem`) |

---

## 9. ANIMATION — the complete inventory

House rule: **subtle, mostly CSS-only, no animation library.** The only JS-driven
motion is the count-up, the nav state machine, and Embla.

### 9.0 The reduced-motion contract

Two mechanisms, both present:

1. Almost every motion block is wrapped in
   `@media (prefers-reduced-motion: no-preference)` — so with reduce on, the
   animation is never defined at all.
2. A global override at the end of §5 wins over everything:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, ::before, ::after {
       animation-duration: 0.01ms !important;
       animation-delay: 0ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
3. Where CSS can't reach — **Embla** (JS transform) and **CountUp** (rAF) — each
   component checks `matchMedia` itself. Embla drops its duration to 0 (a jump
   cut); CountUp writes the final value immediately.

### 9.1 Named keyframes in `globals.css`

| Keyframe | What it does |
|---|---|
| `float` | ±18px Y + 3deg rotate, 7s/8s loops (`--animate-float`, `--animate-float-delayed`) |
| `fade-in` / `fade-out` | opacity, for Radix overlays |
| `pop-in` / `pop-out` | opacity + `scale(0.96→1)` / `(1→0.97)` |
| `accordion-down` / `accordion-up` | `height: 0 ↔ var(--radix-accordion-content-height)` |
| `dialog-in` / `dialog-out` | opacity + `translate(-50%,-50%) scale()` — **carries the translate**, because an animation that set `scale()` alone would wipe the centring transform |
| `reveal-rise` | opacity 0→1 + `translateY(28px→0)` |
| `fill-bar` | `width: 0% → set width` |
| `hero-rise` | opacity + `translateY(12px→0)` |
| `hero-rise-blur` | as above **plus `blur(6px→0)`** |
| `hero-settle` | `rotate(-3deg → 0)` |
| `btn-shine` | `translateX(-130% → 130%)` |
| `chip-shine` | same sweep, one pass on hover |
| `hero-marquee` | `translateX(0 → -50%)` |
| `hero-float` | ±6px Y |
| `hero-exit` | opacity 0 + `translateY(-28px)`, scroll-driven |

### 9.2 Scroll reveal — zero JS

```css
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal-on-scroll {
      animation: reveal-rise linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 42%;
    }
  }
}
```
Progressive enhancement: browsers without scroll-driven animations simply show
the content. Applied to all six homepage sections below the hero.

### 9.3 The hero load sequence

The whole timeline lives in **one `BEAT` object** in `components/public/Hero.tsx`
— *"Reading the numbers down this list is the whole timeline; nothing else
schedules motion."* Each element gets its offset via a `--d` custom property.

| Beat | ms | Element | Animation |
|---|---|---|---|
| `headline` | 0 | `<h1>` | `.hero-rise-blur` — 680ms, opacity + 12px rise + **6px blur resolving into focus** |
| `subheading` | 80 | `<p>` | `.hero-rise` — 620ms |
| `search` | 160 | `HeroSearch` | `.hero-rise` |
| `chips` | 240 | category chips | `.hero-rise` |
| `illustration` | 310 | scale image | `.hero-rise`, then… |
| `illustration + 120` | 430 | scale image | `.hero-settle` — 1500ms `cubic-bezier(0.18, 1.5, 0.35, 1)` (**overshooting**), `rotate(-3deg → 0)`, `transform-origin: 50% 94%` — the scale swings and settles like a real balance |
| `proof` | 830 | proof band + rule | `.hero-rise` |
| `trust` | 890 | the three counts | `.hero-rise` + CountUp starts |
| `marks` | 970 | vendor marquee | `.hero-rise` |
| `countStagger` | +80 each | counts 2 and 3 | so the three figures start in sequence, not as one block |

All entry easing is `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out).

**Ambient float** — after the sequence lands, `.hero-float` runs `6s ease-in-out`
with a `1.7s` delay, forever, ±6px. It is the *only* hero element that earns a
`will-change`.

**Hero exit** — scroll-driven, no listener, no reflow:
```css
.hero-exit { animation-timeline: scroll(root block); animation-range: 0 70vh; }
```
It sits on a **wrapper** rather than on the entering elements, so the two
animations never fight over the same properties.

### 9.4 The navbar state machine (the most intricate piece)

**Two states, one gesture.** At rest the bar is *nothing*: no fill, no border, no
blur, no shadow, no radius. Scrolled, it contracts inward and materialises as
glass.

Thresholds with **hysteresis**:
```js
FROST_ENGAGE = 12   // px scrolled to become glass
FROST_RELEASE = 4   // px to go bare again
HIDE_AFTER = 120    // px before the bar will hide on scroll-down
```
The gap between engage and release exists because a single threshold lets a
trackpad resting near the boundary flip the bar several times a second — and the
transition is 320ms, so it would never even complete.

The scroll listener is rAF-throttled, `{ passive: true }`, and reads current
state from a **ref**, not a closure — registered once with `[]`, a closure over
`frosted` would be permanently stale and the release threshold would never fire.

**Ordering (the whole idea):**
```
--nav-ease:        cubic-bezier(0.16, 1, 0.3, 1)
--nav-dur:         320ms   (shape: shell padding, capsule padding, radius)
--nav-glass-delay:  40ms   (material follows)
--nav-glass-dur:   260ms   (fill, border, shadow, backdrop-filter)
```
The shape moves first, the material catches up ≈¼ beat behind, and they land
together. This was tuned: at 70ms the capsule had finished contracting while
still 85% transparent, and the eye read *a snap followed by a fade* rather than
one object arriving.

**`backdrop-filter: blur(0px)` at rest, not `none`** — `none` does not
interpolate, so the blur would snap in at the end instead of building with the
transition.

**The contraction inset** — measured, not eyeballed:
```css
--nav-inset: 3%;                                       /* below 1024 */
@media (min-width: 1024px) {
  --nav-inset: clamp(0px, (100vw - 1080px) * 0.2, 4.5rem);
}
```
Below 1024 the desktop links are hidden and contents are ~300px, so a
proportional inset has room. At 1024 the links appear and contents jump to ~884px
inside a 928px shell — no room at all, and a flat 5% overflowed by 48px. The
clamp stays at 0 until the viewport can afford it, then opens to 72px a side by
1440. Continuous, not a jump at a breakpoint.

**One attribute drives everything.** `data-nav-frosted="true|false"` sits on the
`<header>`; `.nav-shell`, `.nav-capsule`, `.nav-control` and `.nav-pill` all read
it from there, so the pieces cannot disagree mid-transition.

**The sliding active pill.** Measured with `getBoundingClientRect` in a
`useLayoutEffect` (before paint, so it never appears in the wrong place first),
re-measured on resize and pathname change. At rest it is a **2px rule under the
active link**; scrolled it grows into a **2.25rem filled pill**. Same element, so
the horizontal slide between links is uninterrupted in either state. A filled
pill at rest would read as a grey lozenge floating on the page with no plate
under it.

**Hide on scroll down.** `-translate-y-[130%]`, 300ms ease-out, only past 120px,
with a 4px jitter guard. The navbar publishes `data-header-hidden` on
`document.documentElement` so `ProfileNav` can rise to meet it — **the two
components stay decoupled and never import each other**.

**The mobile sheet** carries the glass unconditionally (it's only ever on screen
because someone opened it) and animates with `.anim-pop`. It records the pathname
it was opened on, so navigation closes it without an effect calling setState.

**⌘K / Ctrl+K** toggles the search dialog; Escape closes the menu.

### 9.5 The vendor marquee

Two identical `<ul>` tracks side by side, animated `translateX(0 → -50%)`, which
lands copy B exactly where copy A began.

- **The trailing gap lives inside each list as `padding-inline-end`**, not as a
  flex gap between them — a gap between the two lists would not be part of the
  50% and the loop would jump by that much every cycle.
- **Duration is computed per instance:** `--marquee-duration:
  max(24, logos.length × 1.7)s`, so the band travels at constant speed however
  many brands the catalogue holds.
- Edge fade via a `mask-image` linear-gradient (1.5rem, 2.5rem from 640px).
- `min-width: 0` on the container — a `max-content` track will report its width
  as its intrinsic contribution and push the container open; `overflow: hidden`
  alone does not stop that.
- **Pauses on hover and focus-within.**
- Under reduce, the whole block is skipped, leaving `translateX(0)`: a static,
  masked row — nothing stranded mid-transition.

**Logo optical sizing** — a square glyph and a horizontal lockup at the same
height do not read as the same weight (the lockup is 5× as wide and swamps
everything). So: marks are `1.75rem` (2rem @640), wordmarks are `1.125rem` capped
at `7.5rem` wide. Wordmarks narrower than a **3:1 aspect ratio** are excluded
entirely (they're stacked lockups that reduce to a grey smear). Measured off the
manifest's own dimensions, not a hardcoded brand list, so it can't rot.

**Dark mode:** wordmarks get `filter: brightness(0) invert(1)` at 0.92 opacity —
several are set in near-black and would be unreadable. Square glyphs keep full
brand colour in both themes, because they're marks, not type.

**Lead-brand interleaving** — Sage and QuickBooks are the two names an SA buyer
recognises first. Putting them *first* in the track was the wrong instinct: in a
loop, first is the position that leaves soonest and doesn't return for a full
cycle. Instead `spreadLeads()` re-inserts them at even intervals, 3 times each
per cycle — with ~7 logos on screen and a lead every ~5th slot, one is almost
always visible and two are never adjacent. Repeat appearances carry `alt=""` and
`loading="lazy"`; only the first appearance is announced and eagerly fetched.

### 9.6 Shine sweeps

**`.btn-shine`** — a 105° white gradient band (`transparent 38% → rgba(255,255,255,0.7) 50% → transparent 62%`) inside `overflow: hidden; isolation: isolate`, animating `translateX(-130% → 130%)` over `4.5s ease-in-out` with a `1.4s` delay, infinite. The sweep occupies only the first 18% of the cycle, so it reads as *an occasional catch of light*, not a loading shimmer.

It is a **modifier**, not part of `.btn-glossy` — *"a page full of buttons all
glinting at once would be a nightmare; this is for the one primary button in a
view."* Currently used only on the hero search button.

**`.hero-chip::after`** — the same sweep at 0.55 alpha, but **one 850ms pass on
hover/focus only**. Five pills glinting on a loop under the one button that
should be drawing the eye is noise.

Both pseudo-elements sit off-canvas at `translateX(-130%)` by default, so with
reduce on they simply never enter.

### 9.7 Component-level motion

| Component | Motion |
|---|---|
| `CountUp` | rAF, 1200ms, **easeOutCubic**. Server renders the final formatted value (correct with JS off and for crawlers); the animation is layered on. Uses `useLayoutEffect` (aliased to `useEffect` on server) to zero the count **before paint** — otherwise the reader sees the final figure for a frame and watches it drop to zero. Every frame including the last is formatted the same way so the figure never changes shape mid-count. Cleanup writes the final value. Hero counts use `group={false}` because at that size any separator splits `6 196` visually. |
| `GlossyCTA` | Two arrows in an `overflow-hidden` lime square: one exits right (`group-hover:translate-x-8`), one arrives from the left (`-translate-x-8 → 0`). 300ms ease-out. |
| `RatingBar` | `.animate-fill-bar` — `width: 0 → n%`, 1.1s expo-out. |
| `CircularRating` | SVG ring with `strokeDasharray`/`strokeDashoffset`, `-rotate-90`, rounded cap, drawn in the **product's own brand colour**. (Static, not animated.) |
| `ScreenshotCarousel` | Embla, `duration: 22` (or **0** under reduced motion). Position read via `useSyncExternalStore` rather than mirrored into state — *"Embla already is the store."* Dots + `"3 of 7"` text, because colour is never the only signal. |
| `ProfileNav` | `IntersectionObserver` with `rootMargin: "-160px 0px -55% 0px"` picks the topmost visible section. Mirrors `data-header-hidden` via a `MutationObserver` and transitions `top` between `top-22` and `top-3` over 300ms. Scrolls the active pill into centre view on narrow screens. |
| `ThemeToggle` | Renders an inert same-size placeholder until hydration, using `useSyncExternalStore` (server snapshot `false`, client `true`) — the hydration check without a setState in an effect. Avoids both a mismatch and a navbar layout shift. |
| Radix primitives | `.anim-overlay` (fade 200/150ms), `.anim-pop` (pop 200/150ms), `.anim-dialog` (translate-preserving), accordion height animation. |
| `card-modern-hover` | `translateY(-4px)` + border/shadow, 250ms expo-out. |
| Arrow chips on cards | `group-hover` → lime fill + brand-ink icon. |
| Numbered lists (home) | `group-hover` turns the oversized numeral `--color-brand-dark`. |

---

## 10. Accessibility (what's actually implemented)

- Skip-to-content link (`sr-only` → `focus:not-sr-only`, lime, z-100).
- `:focus-visible` — 2px `--ring` outline, 2px offset, everywhere.
- `::selection` — lime with brand-ink.
- Full `prefers-reduced-motion` contract (§9.0).
- Semantic landmarks: `<header>`, `<main id="main">`, `<footer>`, `aria-label`ed
  `<nav>`s ("Main", "Mobile", "Sections of this review", "Popular categories").
- `aria-current="page"` on active nav links.
- The hero counts use a `<dl>` with the pair **visually reversed via
  `flex-col-reverse`**, not reordered markup, because a `<dl>` group may only
  hold `<dt>`/`<dd>`.
- Marquee copy B is `aria-hidden="true"`; repeated logos carry `alt=""`.
- Carousel: `role="group"`, `aria-roledescription="carousel"/"slide"`,
  `aria-label="3 of 7"`, and the position is also stated as text.
- Tabs: proper `role="tablist"`/`tab`/`tabpanel` with `aria-controls`/`aria-selected`.
- `sr-only` review counts on cards.
- Card click targets use an `::after` overlay on a real `<a>`, so the accessible
  name stays on the link.
- There is a dedicated `/accessibility` policy page.

---

## 11. Next.js 16 specifics (⚠️ read before writing code)

`AGENTS.md` / `CLAUDE.md` say, verbatim:

> **This is NOT the Next.js you know.** This version has breaking changes — APIs,
> conventions, and file structure may all differ from your training data. Read the
> relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed
> deprecation notices.

Confirmed differences visible in this codebase:

1. **`middleware.ts` → `proxy.ts`**, exporting `proxy()` not `middleware()`.
2. **`params` and `searchParams` are Promises** — every page does
   `const { slug } = await props.params;`.
3. **`PageProps<"/software/[slug]">`** is a global generic type used for page
   props — no hand-written prop interfaces.
4. `next/image` accepts a **`preload`** prop (used on the hero illustration).
5. `tsconfig` includes `.next/dev/types/**/*.ts` alongside `.next/types`.

---

## 12. Code conventions this repo follows

These are consistent enough to be treated as rules:

1. **Comments explain *why*, at length.** `globals.css` and the components carry
   long prose comments recording the reasoning and the rejected alternative
   ("this used to be X, which broke at 1280, so now it's Y"). Match this density
   when editing — it is the house style, not accidental verbosity.
2. **British / South African spelling** in comments and copy ("colour",
   "localised", "behaviour"). **No em dashes** anywhere in editorial copy.
3. **Server Components by default.** `"use client"` appears only where genuinely
   needed. The hero has exactly two client components (`HeroSearch`, `CountUp`),
   and this is called out explicitly in their doc comments.
4. **Market signals live in `lib/site.ts` only.** If a country, currency, tax
   rate, phone number or hero line appears hardcoded in a component, that's a bug.
   Hero copy lives in `HERO_COPY` for exactly this reason.
5. **Whitelist-driven admin.** A field not in `lib/admin/resources.ts` is not
   rendered *and is stripped before the write*. That is the entire security
   design of the admin.
6. **Filters live in the query string**, never in component state, so views are
   linkable, bookmarkable and back-button-correct.
7. **Never let analytics break the product.** Click logging is wrapped and its
   result ignored.
8. **Degrade honestly.** Missing pepper → store nothing. Unconfirmed VAT → say so.
   No published price → "Pricing on request". Never fabricate a number.
9. `cn()` from `lib/utils.ts` (clsx + tailwind-merge) for all class composition.

---

## 13. Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=          # public
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # public
SUPABASE_SERVICE_ROLE_KEY=         # SERVER ONLY — bypasses RLS; rotate if leaked
IP_HASH_PEPPER=                    # 32 random bytes hex; without it POPIA claim is untrue
NEXT_PUBLIC_SITE_URL=              # no trailing slash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=   # optional
NEXT_PUBLIC_ADSENSE_ACCOUNT=            # optional
```

Setup walkthrough: `docs/SUPABASE_SETUP.md`. Recommended region `eu-west-1` or
`eu-central-1` (there is no African region; ~150–180ms from Johannesburg, which
is fine because every public page is statically generated with hourly
revalidation). **Public signups must be turned off** — the site has exactly one
admin.

---

## 14. Current state — what is done vs. what is not

### Done and working

- All public pages, fully designed, in light **and** dark themes.
- Complete design system and animation system.
- 39 products, ~6,196 reviews, 6 guides, 7 legal pages, comparisons — all real
  content, rendering with or without a database.
- Full admin CRUD, auth, RLS, triggers, storage buckets.
- SEO: dynamic OG images, sitemap, robots, JSON-LD (Product, AggregateRating,
  Review, FAQPage, BreadcrumbList), canonical URLs, DB-driven redirects.
- Review submission with honeypot + moderation queue (submissions land as
  `hidden`).
- Affiliate click tracking with POPIA-safe hashing.
- Responsive screenshot rig at 5 widths × 2 themes (`.screens/`).

### Explicitly not done (flagged in the code itself)

1. **No mail provider.** `app/(public)/newsletter/actions.ts` carries a note:
   pending rows and confirm tokens are created, but *nothing dispatches the
   confirmation email*. When a provider lands, send
   `${SITE_URL}/api/newsletter/confirm?token=${token}` and revisit the success
   copy (currently worded not to promise an inbox).
2. **No ad network.** `SponsoredAd` reserves exact dimensions so no layout shift
   appears the day the script goes live.
3. **Taxonomy is seeded but unused.** `taxonomy_terms` / `software_taxonomy` are
   populated and `TAXONOMY_TERMS` carries a `phrase` field plus `urlSlug`
   reasoning for `/best/...` landing pages ("best accounting software for sole
   traders in South Africa") — **but no `/best` route exists and no query module
   reads the taxonomy.** This is the largest built-but-unlaunched surface, and
   the comments say it is where the search volume actually sits.
4. **`README.md` is still the untouched `create-next-app` boilerplate.**
5. **Screenshots** — `software.screenshots` is empty for most products, so the
   carousel section is usually absent (by design).
6. **Affiliate URLs currently point at vendor websites**, not real affiliate
   programmes (`affiliate_url: entry.vendorWebsite` in the seed).
7. `.giti` — a stray empty file at the repo root, probably a typo for `.gitignore`.

---

## 15. Fast orientation for an AI picking this up

**If you are asked to change how something looks:** start in `app/globals.css`.
It is 1,433 lines and almost everything visual is there, in numbered sections,
with the reasoning attached.

**If you are asked to change motion:** the hero timeline is the `BEAT` object in
`components/public/Hero.tsx`; everything else is in globals.css §5 and §7.
Always keep the reduced-motion contract intact.

**If you are asked to add content:** edit `lib/content/*.ts`, then run the
matching seed script. Never edit prices outside `lib/content/pricing.ts` — that
file carries provenance and the seed reads from it, so a price cannot change
without a recorded source.

**If you are asked to add an admin field:** add it to
`lib/admin/resources.ts`. Never add the six aggregate rating columns.

**If you are asked about ratings or ordering:** it is Bayesian
(`lib/ranking.ts`), computed by a Postgres trigger, and no application code may
write it.

**If you are asked to write any Next.js code:** read
`node_modules/next/dist/docs/` first. This is Next 16 and it differs from
training-data defaults (`proxy.ts`, awaited `params`, `PageProps<>`).
