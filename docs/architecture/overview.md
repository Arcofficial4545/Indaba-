# Architecture overview

How Indaba works today. For the full product briefing see
[`project-context.md`](project-context.md), which is a dated snapshot.

## At a glance

```text
Browser
  -> Vercel
     -> proxy.ts          redirects table, session refresh, /admin guard
     -> Next.js App Router
          app/(public)    static pages, revalidated hourly
          app/(admin)     dynamic, per request
          app/api         click tracking, newsletter confirm, OG images
     -> lib/queries        typed read layer
          -> Supabase      Postgres with Row Level Security
          -> lib/content   fallback content when the database is unset or empty
     -> Resend             transactional email
```

## Rendering

- Public pages export `revalidate = 3600`: statically generated and refreshed
  hourly. Product, category and article pages pre-render through
  `generateStaticParams`.
- Admin pages are `force-dynamic`.
- `proxy.ts` (Next.js 16's replacement for middleware) runs before routes. Its
  matcher skips static assets, image optimisation and `/api/og`.

## Data layer

- Pages read only through `lib/queries/`.
- **Fallback content.** When Supabase is not configured, or is connected but not
  yet seeded, every query serves the local catalogue from `lib/content/` through
  `lib/fallback-data.ts`. Fallback products carry `sw-` ids, which is how
  review, rating and search queries recognise an unseeded database.
- **Market config.** Country, currency, VAT rate, contact details and the site URL
  live only in `lib/site.ts`.

## Supabase clients

| Client | File | Used for |
| --- | --- | --- |
| Public | `lib/supabase/public.ts` | Public reads, including static generation. Publishable key, no cookies |
| Server | `lib/supabase/server.ts`, `createClient` | Admin pages and actions. Cookie session, RLS applies |
| Service role | `lib/supabase/server.ts`, `createServiceRoleClient` | Server-only writes that must succeed for anonymous visitors |
| Browser | `lib/supabase/client.ts` | Admin sign-in form |

`server.ts` imports `server-only`, so the service role key cannot be bundled
for the browser.

## Auth and admin

- Supabase Auth, email and password, with public sign-ups disabled.
- `proxy.ts` refreshes the session on every matched request and redirects
  unauthenticated `/admin` requests to `/admin/login`.
- Row Level Security grants writes to members of `admin_users` through
  `is_admin()`, not to every signed-in user.

## Writes from the public site

All go through server actions or route handlers on the service role, with
validation and a honeypot:

| Flow | Behaviour |
| --- | --- |
| Review submission | Saved as `hidden`, published by an admin |
| Newsletter | One step: the address is subscribed immediately with a consent record, then a welcome email is sent |
| Contact form | Stored for the admin inbox |
| Affiliate click | `/api/track-click` logs the click, then redirects. Logging never blocks the redirect |

IP addresses are stored only as peppered hashes (`lib/hash.ts`).

## Affiliate links

`AffiliateCTAButton` appears only on decision pages (product profile, reviews,
head-to-head comparisons, single-product guides), each with a disclosure beside
it. Lists, cards and the home page link to those pages instead.

## Email

`lib/email.ts` sends through the Resend HTTP API. Markup lives in
`lib/email-templates.ts`, which has no server-only import so it can be rendered
to a file for preview. Email is optional: without `RESEND_API_KEY` and
`EMAIL_FROM` the site works and says so rather than promising an inbox.

## Configuration and environment

`next.config.ts` runs `validateEnv()` from `lib/env.ts` on production builds and
production server start. A missing required variable fails the build, not a
request. `SKIP_ENV_VALIDATION=1` bypasses it for local or CI builds with no
Supabase project.

## SEO

- `app/sitemap.ts` and `app/robots.ts` generate `sitemap.xml` and `robots.txt`.
- Open Graph images come from `/api/og`, always addressed through `ogImageUrl()`
  in `lib/site.ts`.
- Product and article pages emit JSON-LD.

## Database

Schema and policies: [`../../supabase/README.md`](../../supabase/README.md).
