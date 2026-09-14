# Indaba

South Africa's independent business software guide. Reviews, ratings and
side-by-side comparisons of accounting, payroll, HR, CRM, ERP and project
management software, with prices in rand and the VAT basis stated.

**Production:** https://indaba-one.vercel.app

---

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Database](#database)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript, strict mode |
| Styling | Tailwind CSS v4, design tokens in `app/globals.css` |
| Data and auth | Supabase (Postgres, Row Level Security, Auth) through `@supabase/ssr` |
| Email | Resend HTTP API |
| Hosting | Vercel |

> **This project runs a version of Next.js with breaking changes.** Read
> [`AGENTS.md`](AGENTS.md) before writing any App Router, proxy or caching code.

## Getting started

**Prerequisites:** Node.js 20.9 or later (CI runs Node 24) and npm.

```bash
npm install
cp .env.example .env.local    # Windows: copy .env.example .env.local
npm run dev
```

The site runs at http://localhost:3000. Without Supabase credentials it serves
its built-in fallback content, so the whole site can be worked on before a
database exists. First-time database setup:
[`docs/operations/supabase-setup.md`](docs/operations/supabase-setup.md).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build. Validates environment variables first (`lib/env.ts`) |
| `npm run start` | Serves the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript. On a clean checkout run `npx next typegen` first |
| `npm run check-copy` | Enforces the editorial rules on the content modules |

Database, seeding and research scripts are documented in
[`docs/operations/scripts.md`](docs/operations/scripts.md). Several of them
write to the database.

## Environment variables

Every variable the code reads is listed, with a comment, in
[`.env.example`](.env.example).

| Variable | Scope | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Production builds |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Production builds |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Production builds |
| `IP_HASH_PEPPER` | Server only | Production builds |
| `NEXT_PUBLIC_SITE_URL` | Public | No, falls back to the production URL |
| `RESEND_API_KEY` and `EMAIL_FROM` | Server only | No, but set both or neither |

A production build fails fast when a required variable is missing. For a local
build with no Supabase project, set `SKIP_ENV_VALIDATION=1`. Never commit
`.env.local`.

## Project structure

```text
app/
  (public)/          Public site: directory, profiles, compare, guides, legal pages
  (admin)/           Editor admin, guarded by proxy.ts
  api/               Route handlers: click tracking, newsletter confirm, OG images
  layout.tsx         Root layout, theme and fonts
  robots.ts          robots.txt
  sitemap.ts         sitemap.xml
components/
  public/            Site components (home/ holds the home page sections)
  admin/             Admin UI
  motion/            Motion primitives
  ui/                Radix based primitives
lib/
  queries/           Typed read layer, falls back to local content when the database is empty
  supabase/          Supabase clients: server, browser and public (static generation)
  content/           Catalogue, articles, pricing and legal page content
  admin/             Admin resource registry and data access
  site.ts            Single source of market config: country, currency, VAT, URLs
  env.ts             Environment validation, run from next.config.ts
  email.ts           Transactional email through Resend
  email-templates.ts Email markup, previewable without sending
public/              Static assets (logos/, blog/)
supabase/
  migrations/        Numbered SQL migrations, applied in order
  checks/            Read-only diagnostic queries
scripts/             Seeding, admin creation, database checks, pricing research, screenshots
data/pricing/        Pricing research audit trail written by scripts/
docs/                Architecture, design, operations runbooks, handover, archive
proxy.ts             Redirects, session refresh and admin guard (Next.js 16 proxy)
```

## Database

Schema, Row Level Security and storage policies live in
[`supabase/migrations`](supabase/migrations) as numbered, idempotent SQL files.
See [`supabase/README.md`](supabase/README.md) for the migration rules.

## Deployment

`main` deploys to Vercel production. The full runbook, including environment
variables, Supabase settings and post-deploy checks, is
[`docs/operations/deployment.md`](docs/operations/deployment.md).

## Documentation

Start at [`docs/README.md`](docs/README.md).

## Contributing

Branching, checks and conventions:
[`docs/engineering/contributing.md`](docs/engineering/contributing.md).
