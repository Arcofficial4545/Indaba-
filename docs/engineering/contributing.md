# Contributing

How changes get from a branch to production.

## Workflow

1. Branch from `main`, named by intent: `feature/…`, `fix/…`, `chore/…` or `docs/…`.
2. Keep each pull request to one concern. A refactor and a feature are two PRs.
3. Open the pull request into `main`. CI must pass before merging.
4. Merging into `main` deploys to Vercel production. Treat every merge as a release.

## Before you open a pull request

Run the same checks CI runs:

```bash
npm run lint
npx next typegen && npm run typecheck
npm run build
```

Building without a Supabase project needs the environment check skipped:

```bash
SKIP_ENV_VALIDATION=1 npm run build          # macOS, Linux
$env:SKIP_ENV_VALIDATION = "1"; npm run build # Windows PowerShell
```

For any visible change, attach screenshots at **1280px and 390px** in the light
theme. With `npm run dev` running:

```bash
npx tsx scripts/shoot.ts /route --widths 1280,390 --theme light
```

Screenshots are written to `.screens/`, which is never committed.

## Conventions

- **Next.js.** This version has breaking changes. Read the relevant guide in
  `node_modules/next/dist/docs/` before writing App Router, proxy or caching code.
  See [`AGENTS.md`](../../AGENTS.md).
- **Market config.** Country, currency, VAT rate, contact details and the site URL
  come from `lib/site.ts` and nowhere else.
- **Data access.** Pages read through `lib/queries/`. Supabase clients are created
  only in `lib/supabase/`. The service role client bypasses Row Level Security and
  is used only in route handlers and server actions.
- **Affiliate links.** `AffiliateCTAButton` belongs only on decision pages, with
  `AffiliateDisclosureNote` beside it. The rule is documented in the component.
- **Copy.** Editorial rules are enforced by `npm run check-copy`: no em or en dashes
  as punctuation, no banned marketing vocabulary, British and South African spelling.
- **Documentation.** Docs live in `docs/`, one topic per file, kebab-case names.

## Database changes

- Add a new file, `supabase/migrations/NNNN_description.sql`, with the next number.
- Never edit a migration that has been applied to production.
- Write migrations so they are safe to re-run.
- Never run seed or reset scripts against production without explicit sign-off.

Details: [`supabase/README.md`](../../supabase/README.md).

## Commit messages

A short imperative summary line, for example `Add welcome email template`,
followed by a body that explains why when the reason is not obvious.

## Secrets

Never commit `.env.local`, keys or tokens. Production secrets live only in the
Vercel project settings, marked Sensitive.
