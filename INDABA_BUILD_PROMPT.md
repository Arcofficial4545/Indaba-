# Indaba: Complete Build Prompt

> Copy everything below the line into your AI coding agent. It is a full, self contained
> specification: brand, colour system, typography, layout language, every component, every
> route, the database schema, the content strategy and the launch checklist.

---

## THE BRIEF

Build a production grade, SEO first **business software review and comparison platform for the
South African market**, called **Indaba**. It is an editorial directory: independent reviews,
verified user ratings, side by side comparisons and buying guides for accounting, payroll, HR,
CRM, ERP and project management software. Revenue comes from affiliate links and display ads,
so the design must earn trust before it asks for a click.

The name is deliberate. *Indaba* is a Nguni word used across South African business English for
the gathering where people talk something through and reach a decision. That is exactly what the
platform is: the place you go to work out which software to buy.

**Wordmark:** `Indaba` set in Google Sans Medium, with the last three letters `aba` carrying the
brand accent colour. Domain target `indaba.co.za` (check availability, fall back to
`getindaba.co.za` or `indaba.africa`).

**Tagline:** South Africa's independent business software guide.

---

## PART 1. TECHNOLOGY STACK

Use exactly this stack. Do not substitute.

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.10 |
| React | React | 19.2.4 |
| Language | TypeScript strict | 5.x |
| Styling | Tailwind CSS, CSS first config | 4.x |
| Database | Supabase Postgres | latest |
| Auth | Supabase Auth, email and password, single admin | `@supabase/ssr` 0.12+ |
| Icons | lucide-react | 1.24+ |
| Primitives | radix-ui | 1.6+ |
| Charts | recharts | 3.9+ |
| Carousel | embla-carousel-react | 8.6+ |
| Toasts | sonner | 2.0+ |
| Command palette | cmdk | 1.1+ |
| Theme | next-themes | 0.4+ |
| Analytics | @vercel/analytics | 2.0+ |
| Class merging | clsx plus tailwind-merge plus class-variance-authority | latest |
| Scripts | tsx | 4.23+ |
| Hosting | Vercel | n/a |

**Important:** Next.js 16 has breaking changes from earlier versions. Before writing any route
code, read the guides in `node_modules/next/dist/docs/`. Key differences to expect: `params` and
`searchParams` are promises that must be awaited, and typed route helpers use the
`PageProps<"/route/[slug]">` generic.

Package scripts to define:

```
dev, build, start, lint,
seed, seed:reviews, seed:articles, seed:comparisons, seed:pages,
logos, create-admin
```

---

## PART 2. BRAND AND COLOUR SYSTEM

### 2.1 The colour philosophy

The palette is built on one unusual decision that must be understood before you use it: **the
primary brand colour is a light colour.** It is a bright citrus lime. That means it can never
carry white text and can never be used as body text on a white page. It is a **fill** colour.
Dark ink goes on top of it.

Because of that, the system carries a second brand token, a deep olive, whose only job is to be
the readable version of the brand for text and icons on light surfaces. Whenever you would
instinctively write `text-brand`, you almost always want `text-brand-dark` instead.

Three roles, never confused:

1. **`--color-brand`**. The lime. Backgrounds, fills, highlight pills, chart bars, active
   states, icon accents on dark surfaces. Never text on white.
2. **`--color-brand-ink`**. Near black olive. The only colour that sits on top of lime.
3. **`--color-brand-dark`**. Deep olive. Brand coloured *text*, links and icons on white.

### 2.2 Light theme tokens

Declare on `:root` in `app/globals.css`:

```css
:root {
  /* Brand palette */
  --color-brand: #d9f65f;          /* signature lime, FILLS ONLY */
  --color-brand-strong: #c9ec3e;   /* hover fill */
  --color-brand-ink: #1a2008;      /* text ON lime */
  --color-brand-dark: #4c5f0a;     /* brand text on white */
  --color-brand-light: #f3fbd3;    /* pale lime wash */
  --color-navy: #1b1f3b;           /* secondary brand, panels */
  --color-amber: #f5a623;
  --color-amber-dark: #e0941a;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-star: #f5a623;           /* star rating fill */

  /* Semantic tokens */
  --background: #ffffff;
  --foreground: #111827;
  --card: #ffffff;
  --card-foreground: #111827;
  --popover: #ffffff;
  --popover-foreground: #111827;
  --primary: #d9f65f;
  --primary-foreground: #1a2008;
  --secondary: #1b1f3b;
  --secondary-foreground: #ffffff;
  --muted: #f9fafb;
  --muted-foreground: #6b7280;
  --accent: #f3f4f6;
  --accent-foreground: #111827;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #e5e7eb;
  --input: #e5e7eb;
  --ring: #b6d43a;

  /* Charts */
  --chart-1: #a4c521;
  --chart-2: #1b1f3b;
  --chart-3: #f5a623;
  --chart-4: #10b981;
  --chart-5: #6b7280;

  /* Admin sidebar */
  --sidebar: #1b1f3b;
  --sidebar-foreground: #e5e7eb;
  --sidebar-primary: #d9f65f;
  --sidebar-primary-foreground: #1a2008;
  --sidebar-accent: #262b4d;
  --sidebar-accent-foreground: #ffffff;
  --sidebar-border: #2c3157;
  --sidebar-ring: #b6d43a;

  --radius: 0.5rem;
}
```

### 2.3 Dark theme tokens

Declare on `.dark`. Note the two brand tokens that flip: on dark surfaces the lime is already
readable, so `--color-brand-dark` becomes the lime itself.

```css
.dark {
  --color-brand-dark: #d9f65f;
  --color-brand-light: #2c3512;

  --background: #0c0e14;
  --foreground: #f4f4f5;
  --card: #12141d;
  --card-foreground: #f4f4f5;
  --popover: #12141d;
  --popover-foreground: #f4f4f5;
  --primary: #d9f65f;
  --primary-foreground: #1a2008;
  --secondary: #262b4d;
  --secondary-foreground: #f4f4f5;
  --muted: #181b26;
  --muted-foreground: #9ca3af;
  --accent: #1d2130;
  --accent-foreground: #f4f4f5;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #262a38;
  --input: #262a38;
  --ring: #d9f65f;

  --chart-1: #d9f65f;
  --chart-2: #8b93c9;
  --chart-3: #f5a623;
  --chart-4: #34d399;
  --chart-5: #9ca3af;

  --sidebar: #12141d;
  --sidebar-foreground: #e5e7eb;
  --sidebar-primary: #d9f65f;
  --sidebar-primary-foreground: #1a2008;
  --sidebar-accent: #1d2130;
  --sidebar-accent-foreground: #ffffff;
  --sidebar-border: #262a38;
  --sidebar-ring: #d9f65f;
}
```

**Improvement over the reference build: ship dark mode enabled.** Wire `next-themes` with
`attribute="class"` and `defaultTheme="system"`, and put a working sun and moon toggle in the
navbar. Every token above already exists, so this costs almost nothing and doubles the perceived
quality of the site.

### 2.4 Per product accent colours

Each software product carries its own brand colour, used for its logo ring, its rating dial, its
chart bars and its "Visit website" button. Resolution order:

1. `software.brand_color` set by an admin
2. A hardcoded slug to hex map in `lib/brandColors.ts`
3. Fallback `#00a86b`

Seed the map with real vendor colours:

```ts
export const BRAND_COLORS: Record<string, string> = {
  // Accounting
  "sage-accounting": "#00d639",
  "xero": "#13b5ea",
  "quickbooks-online": "#2ca01c",
  "zoho-books": "#e42527",
  "sage-50cloud-pastel": "#008849",
  // Payroll
  "simplepay": "#1e88e5",
  "payspace": "#e4002b",
  "sage-pastel-payroll": "#00754a",
  "sage-business-cloud-payroll": "#00d639",
  // HR
  "sage-hr": "#008849",
  "bamboohr": "#73c41d",
  // CRM
  "zoho-crm": "#e42527",
  "salesforce": "#00a1e0",
  "hubspot": "#ff7a59",
  // ERP
  "odoo": "#714b67",
  "sap-business-one": "#0faaff",
  "sage-200-evolution": "#008849",
  // Project management
  "monday-com": "#ff3d57",
  "asana": "#f06a6a",
  "trello": "#0079bf",
};
```

Include a `withAlpha(hex, alpha)` helper that converts a hex to `rgba()` for tints.

---

## PART 3. TYPOGRAPHY

**This is a hard requirement. Use Google Sans and Inter, nothing else.**

Google Sans was open sourced in December 2025 under the SIL Open Font License and is now served
from Google Fonts, so `next/font/google` can load it directly. Verified working with weights
400, 500, 600 and 700.

### 3.1 Font loading

In `app/layout.tsx`:

```tsx
import { Google_Sans, Inter } from "next/font/google";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
```

Apply both variables to the `<html>` element alongside `h-full antialiased`.

### 3.2 Font role mapping

In the `@theme inline` block:

```css
@theme inline {
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-heading: var(--font-google-sans), var(--font-inter), sans-serif;
  --font-mono: ui-monospace, monospace;
}
```

Then:

```css
body { font-family: var(--font-sans); }
h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
```

**The rule to follow everywhere:** Google Sans is the *display and heading* face. Its geometric
warmth carries headlines, the wordmark, statistics, prices, ratings and section titles. Inter is
the *reading* face for body copy, labels, table cells, form fields and long form article text,
because it stays legible at small sizes and has proper tabular figures.

Apply `font-heading` explicitly on any element that should use Google Sans but is not a heading
tag: price figures, stat values, rating numbers, the ghost wordmark in the footer, numbered list
markers and card titles.

### 3.3 Type scale

| Use | Classes |
|---|---|
| Hero H1 | `font-heading text-[2rem] leading-[1.1] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl` |
| Page H1 | `font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]` |
| Section H2 | `font-heading text-3xl font-medium tracking-tight text-balance sm:text-[2.6rem] sm:leading-[1.18]` |
| Card title | `font-heading text-lg font-bold tracking-tight` |
| Stat value | `font-heading text-2xl font-extrabold tabular-nums tracking-tight sm:text-3xl` |
| Price | `font-heading text-2xl font-extrabold tabular-nums tracking-tight` |
| Body | `text-base leading-relaxed` |
| Muted body | `text-sm leading-relaxed text-muted-foreground` |
| Eyebrow label | `text-[0.65rem] font-bold tracking-[0.18em] uppercase` |
| Micro label | `text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase` |

Always use `tabular-nums` on numbers that sit in columns or update: prices, ratings, counts,
review totals. Always use `text-balance` on headings and `text-pretty` on standfirst paragraphs.

---

## PART 4. LAYOUT LANGUAGE

This is what makes the design feel like one product rather than a set of pages. Six signature
patterns, used relentlessly.

### 4.1 The site container

```css
.container-site {
  margin-inline: auto;
  width: 100%;
  max-width: 1440px;
  padding-inline: 1rem;
}
@media (min-width: 768px) { .container-site { padding-inline: 2rem; } }
@media (min-width: 1024px) { .container-site { padding-inline: 3rem; } }
```

Every page is `container-site` with vertical rhythm of `space-y-10` to `space-y-16`, and profile
pages use `space-y-20` between major sections.

### 4.2 The centred section header

Used at the top of every section on every page. Three parts stacked and centred: a pill eyebrow,
a large heading where two or three words are wrapped in a lime highlight, and a muted subtitle.

```tsx
<div className="mx-auto flex max-w-xl flex-col items-center gap-5 pb-2 text-center">
  <p className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-foreground/80">
    <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
    Eyebrow text
  </p>
  <h2 className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-[2.6rem] sm:leading-[1.18]">
    Plain words{" "}
    <span className="rounded-2xl bg-[var(--color-brand)] px-3 py-0.5 whitespace-nowrap text-[var(--color-brand-ink)]">
      highlighted words
    </span>
  </h2>
  <p className="text-base leading-relaxed text-muted-foreground">
    One or two sentences of context.
  </p>
</div>
```

The lime highlight span is the single most recognisable element of the brand. Use it on roughly
one heading per section, never twice in the same heading, and keep the highlighted phrase to two
or three words.

### 4.3 The nested tray

Content groups sit in a soft grey tray with a 2px gap between inner cards. This gives the page
depth without heavy borders.

```tsx
<div className="rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60">
  <div className="grid gap-2 md:grid-cols-3">
    <div className="rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 dark:border-zinc-800">
      {/* inner card */}
    </div>
  </div>
</div>
```

Outer radius `1.75rem`, inner radius `1.4rem`, gap `0.5rem`. Use it for review lists, alternative
grids, screenshot frames, rating panels, category lists and article lists.

### 4.4 The glossy button

The primary CTA. A rounded rectangle, never a pill, with a glass sheen across the top half, a
1px darker bezel, pillowed inner shadows and a coloured drop shadow tinted to match the fill.
Fully parameterised so any accent colour can drive it.

```css
.btn-glossy {
  --btn-bg: var(--color-brand);
  --btn-ink: var(--color-brand-ink);
  --btn-glow: rgba(163, 197, 33, 0.5);
  border-radius: 0.875rem;
  color: var(--btn-ink);
  font-weight: 600;
  border: 1px solid color-mix(in srgb, var(--btn-bg), #000 22%);
  background-image:
    linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.14) 36%, rgba(255,255,255,0) 52%),
    linear-gradient(180deg, color-mix(in srgb, var(--btn-bg), #fff 14%) 0%, var(--btn-bg) 55%, color-mix(in srgb, var(--btn-bg), #000 14%) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.5),
    inset 0 -1px 0 rgba(255,255,255,0.14),
    inset 0 -5px 9px color-mix(in srgb, var(--btn-bg), #000 18%),
    0 12px 24px -10px var(--btn-glow);
  transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.btn-glossy:hover {
  transform: translateY(-1px);
  filter: brightness(1.06) saturate(1.04);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.55),
    inset 0 -1px 0 rgba(255,255,255,0.14),
    inset 0 -5px 9px color-mix(in srgb, var(--btn-bg), #000 18%),
    0 16px 30px -10px var(--btn-glow);
}
.btn-glossy:active {
  transform: translateY(0) scale(0.98);
  filter: brightness(0.97);
  box-shadow:
    inset 0 1px 2px color-mix(in srgb, var(--btn-bg), #000 30%),
    inset 0 -1px 0 rgba(255,255,255,0.1),
    0 6px 14px -8px var(--btn-glow);
}
.btn-glossy-dark {
  --btn-bg: #232428;
  --btn-ink: #ffffff;
  --btn-glow: rgba(10, 12, 16, 0.55);
}
.btn-glossy-white {
  --btn-bg: #ffffff;
  --btn-ink: var(--color-navy);
  --btn-glow: rgba(15, 23, 42, 0.22);
  border-color: color-mix(in srgb, #ffffff, #000 14%);
}
```

Wrap it in a `<GlossyButton>` component with `variant` of `brand`, `dark` or `white`, that
renders an `<a>` when given `href` and a `<button>` otherwise. To recolour per product, set
`--btn-bg`, `--btn-ink` and `--btn-glow` inline.

One special variant worth building: a dark CTA with a lime square that slides from the left edge
to the right edge on hover, carrying an arrow icon. Used for "read all reviews".

### 4.5 The modern card

```css
.card-modern {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.5rem;
  box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 12px 32px -16px rgba(15,23,42,0.14);
  transition: transform 0.25s cubic-bezier(0.16,1,0.3,1),
              box-shadow 0.25s cubic-bezier(0.16,1,0.3,1),
              border-color 0.25s ease;
}
.card-modern-hover:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--foreground) 12%, var(--border));
  box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 24px 48px -20px rgba(15,23,42,0.22);
}
```

### 4.6 Motion

Motion is subtle and mostly CSS only. No animation library.

```css
/* Scroll reveal, progressive enhancement, zero JS */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal-on-scroll {
      animation: reveal-rise linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 42%;
    }
    @keyframes reveal-rise {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  }
}

/* Rating bars grow from zero */
@media (prefers-reduced-motion: no-preference) {
  .animate-fill-bar { animation: fill-bar 1.1s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes fill-bar { from { width: 0%; } }
}

/* Floating hero shapes */
--animate-float: float 7s ease-in-out infinite;
--animate-float-delayed: float 8s ease-in-out 1.5s infinite;
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-18px) rotate(3deg); }
}

/* Honour the user's setting, always */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4.7 Radius scale

Derived from `--radius: 0.5rem` in the `@theme inline` block:

```css
--radius-sm: calc(var(--radius) * 0.6);   /* 0.3rem */
--radius-md: calc(var(--radius) * 0.8);   /* 0.4rem */
--radius-lg: var(--radius);               /* 0.5rem */
--radius-xl: calc(var(--radius) * 1.4);   /* 0.7rem */
--radius-2xl: calc(var(--radius) * 1.8);  /* 0.9rem */
--radius-3xl: calc(var(--radius) * 2.2);  /* 1.1rem */
--radius-4xl: calc(var(--radius) * 2.6);  /* 1.3rem */
```

Practical radii in use: buttons `0.875rem`, small tiles `0.75rem`, cards `1.5rem`, inner tray
cards `1.4rem`, outer trays `1.75rem`, hero and newsletter panels `2.5rem`, pills `9999px`.

### 4.8 Prose systems

Three separate rich text styles, because the same CSS cannot serve a legal page and a magazine
article.

- **`.prose-content`**. Vendor descriptions on profile pages. 1rem, line height 1.75, lime
  underlined links, disc bullets, lime left border on blockquotes.
- **`.legal-content`**. Policy pages. 0.975rem, line height 1.8, custom round lime bullet
  markers via `::before`, dashed table borders, `scroll-margin-top: 6rem` on H2 for anchor links.
- **`.article-content`**. Blog posts. 1.075rem, line height 1.85, oversized first paragraph at
  1.25rem as a standfirst, lime diamond bullets rotated 45 degrees, numbered lists with lime
  circle counters, blockquotes with a muted background and asymmetric radius.

---

## PART 5. DATABASE SCHEMA

Postgres on Supabase. Everything below is idempotent and safe to re run.

### 5.1 Tables

**`categories`**. Id uuid pk, name, slug unique, icon, description, software_count int default 0,
display_order int, created_at.

**`software`**. The core table.

```sql
create table if not exists software (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  tagline text,
  description_short text not null,
  description_full text not null,          -- HTML
  logo_url text,
  screenshots jsonb not null default '[]',
  category_id uuid references categories(id),

  starting_price numeric,
  price_currency text not null default 'ZAR',
  billing_period text not null default 'month',
  free_trial boolean not null default false,
  free_version boolean not null default false,
  pricing_plans jsonb not null default '[]',

  features jsonb not null default '[]',
  top_features jsonb not null default '[]',
  integrations jsonb not null default '[]',
  brand_color text,

  affiliate_url text,
  vendor_website text,
  vendor_name text,
  founded_year int,
  support_types jsonb not null default '[]',
  countries_available jsonb not null default '[]',
  languages jsonb not null default '[]',

  overall_rating numeric(3,1) not null default 0,
  ease_of_use_rating numeric(3,1) not null default 0,
  value_for_money_rating numeric(3,1) not null default 0,
  customer_service_rating numeric(3,1) not null default 0,
  functionality_rating numeric(3,1) not null default 0,
  review_count int not null default 0,

  meta_title text,
  meta_description text,
  og_image_url text,

  status text not null default 'draft' check (status in ('published','draft')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  search_vector tsvector generated always as (
    to_tsvector('english',
      coalesce(name,'') || ' ' || coalesce(tagline,'') || ' ' ||
      coalesce(description_short,'') || ' ' || coalesce(vendor_name,''))
  ) stored
);

create index if not exists software_search_idx on software using gin (search_vector);
create index if not exists software_category_published_idx on software (category_id) where status = 'published';
create index if not exists software_status_idx on software (status);
```

**`reviews`**. Software_id fk cascade, reviewer_name, reviewer_job_title, reviewer_company,
reviewer_industry, reviewer_company_size, `reviewer_country text not null default 'South Africa'`,
reviewer_avatar_url, verified_linkedin bool, verified_badge, used_for_duration, five integer
ratings each checked between 1 and 5 (overall_rating, ease_of_use, value_for_money,
customer_service, functionality), review_title, summary, pros, cons, vendor_response,
vendor_response_date, review_date, helpful_count, status published or hidden.

**`articles`**. Title, slug unique, excerpt, content, featured_image_url, category_tag,
related_software_id, author_name, author_bio, author_avatar_url, author_title, meta fields,
read_time_minutes, status, featured, published_date, search_vector.

**`software_alternatives`**. Software_id, alternative_id, display_order, unique pair.

**`comparisons`**. Software_a_id, software_b_id, custom_verdict, meta fields, status.

**`affiliate_clicks`**. Software_id, software_name, affiliate_url, clicked_at, ip_hash,
user_agent, referrer, country_code. Indexed on (software_id, clicked_at desc).

**`pages`**. Slug unique, title, content, meta fields, status. Powers editable legal pages.

**`site_settings`**. Key unique, value, updated_at.

**`newsletter_subscribers`**. Email unique, status pending, confirmed or unsubscribed,
interests text[], confirm_token, confirmed_at, unsubscribed_at, consent_ip_hash, consent_source,
user_agent, created_at. Double opt in for POPIA.

**`contact_messages`**. Name, email, subject, message, ip_hash, user_agent, handled bool,
created_at.

**`audit_log`**. Table_name, row_id, action, actor, changed_at, old_data jsonb, new_data jsonb.

**`redirects`**. From_path unique, to_path, status_code 301 or 302.

**`media_library`**. Bucket, path, public_url, alt_text, uploaded_by, unique (bucket, path).

### 5.2 Triggers

Four triggers carry real logic. **Aggregate ratings must never be written by application code.**

1. **`update_software_ratings()`**. After insert, update or delete on `reviews`, recompute all
   five averages rounded to one decimal plus `review_count`, counting only published reviews.
2. **`update_category_counts()`**. After insert, update of category_id or status, or delete on
   `software`, recount published software per affected category.
3. **`set_updated_at()`**. Before update on software, articles and pages.
4. **`write_audit_log()`**. After any mutation on software, articles, reviews, pages and
   site_settings, capture actor via `auth.uid()` plus before and after JSON.

### 5.3 Row level security

Enable RLS on every table.

- **Anonymous read:** categories, published software, published reviews, published articles,
  alternatives, published comparisons, published pages, settings, redirects.
- **Authenticated full access:** the single admin user gets `for all ... using (true) with check (true)`
  on all content tables.
- **Service role only writes:** affiliate_clicks, newsletter_subscribers, contact_messages. The
  admin may read them, and update newsletter and contact rows.
- **Storage buckets:** `logos`, `screenshots`, `avatars`, `articles`, all public read,
  authenticated write.

---

## PART 6. SITE ARCHITECTURE

Two route groups: `(public)` with navbar and footer, and `(admin)` with its own shell.

### 6.1 Public routes

| Route | Purpose |
|---|---|
| `/` | Home |
| `/software` | Directory, filtered, sorted, paginated |
| `/software/[slug]` | Product profile, the flagship page |
| `/software/[slug]/reviews` | Full review archive with filters |
| `/software/[slug]/reviews/new` | Review submission form |
| `/software/[slug]/alternatives` | Ranked alternatives |
| `/categories` | Category index |
| `/category/[slug]` | Category landing |
| `/compare` | Comparison hub plus builder |
| `/compare/[pair]` | Head to head, slug format `a-vs-b` |
| `/blog` | Article index, paginated |
| `/blog/[slug]` | Article |
| `/search` | Full text search results |
| `/about` | About, with anchored sections |
| `/contact` | Contact form |
| `/newsletter` | Signup landing |
| `/newsletter/unsubscribe` | One click unsubscribe |
| `/privacy-policy` `/cookie-policy` `/terms` `/paia-manual` `/accessibility` `/editorial-policy` `/affiliate-disclosure` | Legal and trust |

### 6.2 API routes

| Route | Purpose |
|---|---|
| `/api/track-click` | Log affiliate click then 302 redirect. **Must never fail the redirect if logging errors.** |
| `/api/og` | Dynamic Open Graph image generation |
| `/api/newsletter/confirm` | Double opt in confirmation |
| `/robots.ts` `/sitemap.ts` | Generated, include every published entity |

### 6.3 Admin routes

`/admin/login`, `/admin` dashboard, then a generic resource CRUD at `/admin/[resource]`,
`/admin/[resource]/new` and `/admin/[resource]/[id]` covering software, reviews, categories,
articles, comparisons and pages. Plus `/admin/newsletter`, `/admin/contact`, `/admin/analytics`,
`/admin/settings` and `/admin/newsletter-export` as a CSV route.

The admin uses a **resource registry**: one field map per table in `lib/admin/resources.ts`
drives both the form renderer and the save action, so nothing outside the whitelist can ever be
written. Field types: text, textarea, html, number, checkbox, select, date, color, json.

---

## PART 7. PAGE BY PAGE SPECIFICATION

### 7.1 Home page

Revalidate every 3600 seconds. Sections in order:

**Hero.** A full width photographic card, radius `2.5rem`, with a heavy soft drop shadow
`0 40px 80px -40px rgba(15,23,42,0.35)`. A white radial wash sits over the photo so text stays
readable. Four 3D render shapes (donut, star, spring, cube) float at the corners using the float
animation, hidden below the `sm` breakpoint. Centred content: H1 "Find the right software", a
supporting line, a large search bar, then a row of "Popular:" category pills on translucent white.

**Stats bar.** A card that overlaps the hero by `-2rem` to `-2.5rem`, three columns divided by
vertical rules on desktop and horizontal rules on mobile. Each stat pairs a 3D shape icon with a
big tabular number and a tiny uppercase label. Values come from live counts: verified reviews,
software listed, categories covered.

**Category explorer.** Section header, then an interactive component with category tabs and the
products inside each.

**Comparisons strip.** Popular head to head match ups.

**Top rated.** Three column grid of software cards. **Ranking uses a Bayesian weighted average,
not a raw star average.** A product with 400 reviews at 4.1 outranks one with 30 reviews at 4.3.
Blend each rating toward the platform mean, weighted by review volume, using the median review
count as the prior weight. Fetch live star distributions for each card so the sentiment strip is
real data.

**Newsletter band.** Navy panel, radius `2.5rem`, copy left and form right, with three tick list
promises about spam, POPIA and one click unsubscribe.

**Recently reviewed.** Nested tray with three ranked cards.

**Blog preview.** Three articles as an editorial list: an oversized ghost numeral on the left
that turns brand coloured on hover, category tag, date, read time, title, excerpt, author, and a
square arrow button that fills lime on hover. The whole row is clickable via an `after:absolute
after:inset-0` overlay on the title link.

### 7.2 Software profile page

The most important page on the site. Revalidate 3600.

**Header.** Centred. Large product logo at 84px, H1, a Featured badge if applicable, tagline,
then rating number, star row and a link to the review count, then a "Write a review" glossy CTA.

**Sticky section nav.** A pill bar that tracks scroll position and highlights the active section.
It must react to the navbar hiding, via a `data-header-hidden` attribute on the document element.

**Vendor spec sheet.** Starting price, vendor, founded year, countries, languages, support types,
free trial badge, affiliate CTA and the affiliate disclosure note.

**Sections**, each with the centred header pattern and `scroll-mt-32`:

1. **Overview**, `dangerouslySetInnerHTML` of `description_full` in `.prose-content`.
2. **Pricing**. Heading "plans, **priced in rand**". Pricing cards plus a full feature
   comparison table. Include a "get current pricing" note that list prices move.
3. **Features**. Top features highlighted, then the full list.
4. **Screenshots**. Only rendered when real screenshots exist. Embla carousel inside a nested tray.
5. **Ratings**. A circular rating dial in the product's accent colour, five star distribution
   bars that animate from zero, a sentiment bar, a ratings by dimension chart and a reviewer
   company size chart.
6. **Compare**. Head to head against the top alternative.
7. **Reviews**. Three review cards then a closing band with the sliding arrow CTA to the full
   archive.
8. **Sponsored**. A 970x250 billboard ad unit, labelled.
9. **Alternatives**. Three ranked cards in a nested tray.
10. **FAQs**. Accordion, **generated from the product's own data**, never hand written. Build
    questions about cost in South Africa, free trial availability, integrations, local
    suitability and what users say, filling answers from the record.

**Structured data.** Emit Product with AggregateRating, individual Review objects and
BreadcrumbList as JSON-LD.

### 7.3 Directory page

Breadcrumbs, centred hero, then a two column layout: a filter sidebar and a list of software
rows. Filters: category, minimum rating, free trial, free version, paid only. Sorts: most
reviewed, highest rated, recently updated. Ten per page with pagination that preserves every
active filter in the query string.

### 7.4 Category, compare, blog, about

- **Category**. Hero naming the category, the products, and an editorial intro explaining what
  South African buyers should look for in that category.
- **Compare hub**. A two product selector in a nested tray, plus trending comparison cards.
- **Compare pair**. A full comparison dashboard: ratings side by side, feature matrix, pricing,
  a verdict, and a sticky bar on mobile.
- **Blog**. A featured latest article card, then a list. Nine per page.
- **About**. Anchored sections covering the story, method, the compliance yardstick and the
  people. Three principle cards with bare icons.

---

## PART 8. COMPONENT INVENTORY

Build these. Names are prescriptive so imports stay predictable.

### 8.1 shadcn style primitives (`components/ui/`)

`alert-dialog`, `avatar`, `badge`, `breadcrumb`, `button`, `card`, `checkbox`, `command`,
`dialog`, `dropdown-menu`, `input`, `input-group`, `label`, `navigation-menu`, `popover`,
`progress`, `scroll-area`, `select`, `separator`, `skeleton`, `sonner`, `switch`, `table`,
`tabs`, `textarea`.

The Badge component needs seven variants via `cva`: default lime, secondary navy, destructive,
outline, **success** (pale lime background with deep olive text), **amber**, and **muted**.

### 8.2 Public components (`components/public/`)

**Layout and brand**
`Navbar`, `Footer`, `BrandLogo` plus exported `LogoMark`, `Breadcrumbs`, `ThemeToggle`,
`SocialIcons`, `Pagination`, `ProfileNav`.

**Software display**
`SoftwareCard`, `SoftwareListRow`, `RecentSoftwareCard`, `AlternativeCard`, `SoftwareLogo`,
`SoftwareSidebar`, `CategoryCard`, `CategoryIcon`, `StatusBadge`, `CountryFlag`.

**Ratings and data visualisation**
`StarRating`, `StarSelector`, `CircularRating`, `RatingBar`, `SentimentBar`, `ReviewSentiment`,
`SoftwareRatingsChart`, `CompanySizeChart`, `DonutChart`, `VerifiedBadges`.

**Reviews**
`ReviewCard`, `ReviewForm`, `ReviewFilters`.

**Pricing and features**
`PricingCards`, `PricingTable`, `FeatureChecklist`, `FeaturesSection`, `ScreenshotCarousel`.

**Comparison**
`CompareSelector`, `CompareDashboard`, `CompareAlternative`, `CompareStickyBar`,
`ComparisonCard`, `ComparisonMatrix`, `ComparisonTable`.

**Home page**
`HomepageExplore`, `HomepageCompare`, `NewsletterSection`.

**Forms and conversion**
`SearchBar`, `FilterSidebar`, `DirectorySort`, `NewsletterForm`, `NewsletterUnsubscribeForm`,
`ContactForm`, `FaqAccordion`, `GlossyButton`, `GlossyCTA`.

**Monetisation and trust**
`AffiliateCTAButton`, `AffiliateDisclosureNote`, `SponsoredAd`, `LegalPage`.

### 8.3 Navbar behaviour in detail

It is a floating capsule inside `container-site`, not a full width bar.

- Transparent border and background at the top of the page.
- Once scrolled past 8px, it gains a frosted background `bg-background/85` with
  `backdrop-blur-xl`, a subtle border and a large soft shadow.
- Scrolling **down** past 120px translates it `-130%` off screen; scrolling **up** brings it back.
- The active route is marked by a pill that **measures the active link with
  `getBoundingClientRect` and slides** to it with a 300ms ease out transition.
- Right side: a square search button that turns lime on hover, a "List your software" glossy
  button hidden on mobile, a theme toggle, and a hamburger below `lg`.
- Search opens a `cmdk` command dialog with grouped Software and Articles results, fed by a
  search index built in the layout.
- Mobile menu is a floating card below the capsule, not a full screen overlay.

### 8.4 Footer behaviour in detail

Dark `#141517`, with a `rounded-t-[2.5rem]` top so it reads as a slab sliding under the page.

1. **Newsletter band**. Pill eyebrow, heading with a lime highlight, POPIA reassurance, form.
2. **Five link columns**. Brand block with logo, tagline and contact details each prefixed by a
   lime icon, then Explore, Categories, Company and Popular reviews. Categories and popular
   reviews are pulled live from the database, not hardcoded.
3. **Legal bar**. Copyright plus policy links.
4. **Ghost wordmark**. The word `Indaba` at `clamp(4rem, 14vw, 13rem)`, colour `text-white/[0.045]`,
   with `-mb-[0.26em]` so it is clipped by the bottom edge of the viewport.

---

## PART 9. SOUTH AFRICAN LOCALISATION

This is what separates the site from a generic directory. Everything below is non negotiable.

### 9.1 Single source of truth

`lib/site.ts` holds every market signal:

```ts
export const SITE_NAME = "Indaba";
export const SITE_DOMAIN = "indaba.co.za";
export const SITE_TAGLINE = "South Africa's independent business software guide";
export const CONTACT_EMAIL = "hello@indaba.co.za";
export const CONTACT_PHONE = "+27 21 300 4820";
export const SITE_LOCATION = "Cape Town, South Africa";
export const SITE_LOCALE = "en-ZA";
export const OG_LOCALE = "en_ZA";

export const REVIEWER_COUNTRIES = [
  "South Africa", "Namibia", "Botswana", "Zambia",
  "Kenya", "Nigeria", "Zimbabwe", "Other",
] as const;

export const DEFAULT_REVIEWER_COUNTRY = "South Africa";
export const CURRENCIES = ["ZAR", "USD", "EUR", "GBP"] as const;
export const DEFAULT_CURRENCY = "ZAR";
```

Set `lang="en-ZA"` on the html element and `locale: "en_ZA"` in Open Graph metadata.

### 9.2 Currency formatting

Rand is the default and the symbol is prefixed with no space. **South African digit grouping uses
a space, not a comma**, which `toLocaleString("en-ZA")` handles correctly. Never show decimals on
whole rand amounts.

```ts
export const CURRENCY_SYMBOLS: Record<string, string> = {
  ZAR: "R", USD: "US$", EUR: "€", GBP: "£",
};
// R240   R1 375   R23 844
```

Provide `formatPrice`, `formatPricePerPeriod` with `/mo` and `/yr` suffixes, `startingPriceLabel`
that splits a price into a headline amount plus a short note and flags custom pricing,
`formatNumber`, `formatDate` and `formatRating` to one decimal.

### 9.3 Compliance vocabulary

Every product assessment is judged against the same local yardstick, and the copy must use these
terms naturally because they are exactly what buyers search for:

- **SARS eFiling**. Returns must transfer cleanly without rebuilding figures
- **VAT201** at the standard **15%** rate, covering standard, zero rated and exempt supplies
- **EMP201** monthly employer declarations and **EMP501** biannual reconciliations
- **IRP5** and **IT3(a)** employee tax certificates
- **e@syFile** exports
- **UIF** declarations to the Department of Employment and Labour
- **SDL** skills development levy
- **ETI** Employment Tax Incentive
- **BCEA** leave entitlements
- **POPIA** for data handling, and a **PAIA manual** page as required
- **CIPC** company registration
- **B-BBEE** where relevant to vendor selection
- Bank feed coverage for **Absa, FNB, Standard Bank, Nedbank and Capitec**
- **ACB** payment files for salary runs

### 9.4 Voice and editorial standard

Write as an experienced South African business journalist, not as a marketer and not as an AI.

- Plain, confident sentences. Vary the length. Let some run long where the idea needs room.
- **Never use em dashes or hyphens as sentence punctuation.** Rewrite the sentence instead.
- No "unlock", "seamless", "revolutionise", "in today's fast paced world", "game changer".
- Give real numbers. "R240 per month including VAT" beats "affordable pricing".
- Be honest about weaknesses. A review that only praises is not a review, and readers can tell.
- Use local framing: a business "registered with CIPC", an accountant "in practice", the reality
  that load shedding makes desktop software genuinely useful in some sectors.
- British and South African spelling throughout: organisation, localisation, recognise, colour,
  favourite, licence as a noun.

### 9.5 Content seeding targets

Ship with real volume. The reference build launched with:

| Entity | Count |
|---|---|
| Categories | 6 |
| Software products | 39 |
| Verified reviews | 6 178 |
| Articles | 25 |
| Comparisons | 15 |
| Legal and static pages | 6 |

Categories, in display order: Accounting Software, Payroll Software, HR Software, CRM Software,
ERP Software, Project Management.

Products must include the vendors South Africans actually shortlist: Sage across its full local
range (Sage Accounting, Sage Business Cloud Payroll, Sage 50cloud Pastel, Sage Pastel Payroll,
Sage HR, Sage 200 Evolution), Xero, QuickBooks Online, Zoho Books and CRM, SimplePay, PaySpace,
BambooHR, Salesforce, HubSpot, Odoo, SAP Business One, monday.com, Asana and Trello.

**Every price must be researched from the vendor's own South African pricing page or official
shop and stated in rand, with a note on whether VAT is included.** Vendors publish differently:
some quote including VAT and some excluding, and getting this wrong destroys credibility. Re
verify prices quarterly.

Reviews need South African reviewer identities: real sounding names across the country's language
groups, job titles, company sizes, industries and cities. Ratings across all five dimensions.
Include vendor responses on a minority of reviews. Never write only glowing reviews.

---

## PART 10. SEO AND STRUCTURED DATA

1. **Metadata per route** via `generateMetadata`, with a canonical URL on every page and a title
   template of `%s | Indaba`.
2. **JSON-LD**: Product with AggregateRating and Review on profiles, BreadcrumbList everywhere,
   Article on blog posts, FAQPage on profiles, Organization and WebSite on the home page.
3. **Dynamic OG images** through `/api/og` using `next/og`, rendering product name, rating and
   brand.
4. **Sitemap** generated from the database covering every published software, article, category,
   comparison and static page.
5. **ISR** with `revalidate = 3600` on all public pages.
6. **Semantic HTML**: one `h1` per page, `section` with `aria-labelledby`, `nav` with `aria-label`,
   `dl` for statistics, `article` for cards and reviews.
7. **Redirects table** consulted in middleware so URLs can be changed without losing rankings.

---

## PART 11. MONETISATION

### 11.1 Affiliate click tracking

Every "Visit website" link points at `/api/track-click?software=<slug>`, never directly at the
vendor. The route logs the click then issues a 302 to the affiliate URL.

**The critical rule: a logging failure must never cost you a click.** Wrap the insert in
try and catch, and redirect regardless of whether the write succeeded. Money first, analytics
second.

Log software_id, name, url, timestamp, a hashed IP, user agent, referrer and country code. Never
store a raw IP address, for POPIA reasons.

All affiliate anchors carry `rel="noopener noreferrer sponsored"` and `target="_blank"`.

### 11.2 Disclosure

A visible affiliate disclosure note sits next to every commercial CTA, worded plainly: the site
may earn a commission when you buy through the link, at no extra cost to you, and it never
affects ratings. Link it to a full `/affiliate-disclosure` page. This is both an ethical
requirement and a ranking factor.

### 11.3 Display advertising

A `SponsoredAd` component supporting leaderboard 728x90, billboard 970x250, half page 300x600
and vertical video formats. Place the billboard after the reviews section on profile pages and
the half page in the review archive sidebar. Every unit carries a visible "Sponsored" label and
`rel="sponsored"`.

Add the AdSense account meta tag and Google site verification tag in the root layout metadata.

---

## PART 12. IMPROVEMENTS OVER THE REFERENCE BUILD

Ship these. They are the difference between a clone and a better product.

1. **Enable dark mode.** Every token exists but the reference forces light. Wire `next-themes`
   with `defaultTheme="system"` and surface the toggle in the navbar.
2. **Fix brand text contrast.** `--color-brand-dark` at `#4c5f0a` on white is around 6.5:1, which
   passes, but audit every usage with a contrast checker and never let raw `--color-brand` become
   text on a light background.
3. **Populate `software_alternatives`.** In the reference this table is empty and the profile page
   silently falls back to category peers. Seed real curated alternative sets, three to six per
   product, so the recommendations are editorial rather than accidental.
4. **Add price history.** A `software_price_history` table capturing starting_price on each change,
   plus a small "price changed in March" line on the profile. Nobody else in this market does it
   and it is genuinely useful.
5. **Add a "best for" taxonomy.** Tag products by business size and by role, then build landing
   pages like "best accounting software for sole traders in South Africa" which is where the
   search volume actually sits.
6. **Review helpfulness voting.** The `helpful_count` column exists but is never written to. Add a
   rate limited endpoint and a thumbs up control on review cards.
7. **Comparison URLs both ways.** Make `/compare/xero-vs-sage-accounting` and the reverse both
   resolve, canonicalising to one, so you never lose a long tail query.
8. **Skip to content link** and a visible focus ring on every interactive element.
9. **Loading skeletons** via `loading.tsx` for the directory, profile and blog routes.
10. **A proper 404** that suggests popular software instead of a dead end.
11. **Weekly automated price check** as a scheduled script that flags products whose vendor page
    no longer matches the stored price, so the catalogue never quietly goes stale.
12. **Reduce hero image weight.** Serve the hero as AVIF with a WebP fallback and a blur
    placeholder.

---

## PART 13. ACCESSIBILITY AND QUALITY BAR

- Every image has `alt`, decorative ones get `alt=""` plus `aria-hidden="true"`.
- Colour is never the only signal. Ratings show a number beside the stars.
- All interactive elements reachable and operable by keyboard, with `focus-visible` rings using
  `--ring`.
- `prefers-reduced-motion` respected globally.
- Form fields have real `<label>` elements, and errors are announced.
- Target Lighthouse 95 or better on performance, accessibility, best practices and SEO.
- Ship an `/accessibility` statement page.

---

## PART 14. BUILD ORDER

1. Scaffold Next.js 16 with TypeScript and Tailwind 4. Read `node_modules/next/dist/docs/` first.
2. Write `app/globals.css` completely: tokens, `@theme inline`, container, button, card, motion,
   the three prose systems.
3. Load Google Sans and Inter in the root layout and wire the font variables.
4. Build `lib/`: types, site constants, format helpers, brand colours, utils.
5. Run the Supabase migrations in order, then verify triggers and RLS.
6. Build the `components/ui/` primitives.
7. Build the layout shell: Navbar, Footer, BrandLogo, Breadcrumbs, ThemeToggle.
8. Build the Supabase query layer with placeholder fallbacks so the site renders before the
   database is populated.
9. Build the public pages in order: home, directory, profile, category, compare, blog, static.
10. Build the admin panel on the resource registry.
11. Write and run the seed scripts.
12. Add SEO: metadata, JSON-LD, sitemap, robots, OG images.
13. Add monetisation: click tracking, disclosures, ad slots.
14. Audit accessibility and performance, then deploy to Vercel.

---

## PART 15. DEFINITION OF DONE

- [ ] Google Sans renders on all headings, Inter on all body copy, verified in the browser
- [ ] Light and dark themes both correct, with no unreadable brand text in either
- [ ] Every price shown in rand with correct en-ZA space grouping, VAT status stated
- [ ] Aggregate ratings written only by the database trigger, never by application code
- [ ] Affiliate redirect still fires when the click log write fails
- [ ] Disclosure visible next to every commercial CTA
- [ ] JSON-LD validates in Google's Rich Results Test
- [ ] Sitemap lists every published entity
- [ ] Lighthouse 95 or better across all four categories
- [ ] Zero em dashes or hyphen punctuation in any published copy
- [ ] Keyboard only navigation reaches every interactive element
- [ ] Seeded with at least 35 products, 5 000 reviews and 20 articles before launch
