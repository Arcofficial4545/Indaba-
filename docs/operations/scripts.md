# Scripts

Every npm script, what it touches, and what it needs. Scripts in `scripts/` load
`.env.local` themselves.

> **Scripts marked "writes to the database" act on whichever project
> `.env.local` points at.** If that is production, they change production. None
> of them should be run against production without sign-off.

## Application

| Command | What it does | Needs |
| --- | --- | --- |
| `npm run dev` | Local development server | Nothing; uses fallback content without Supabase |
| `npm run build` | Production build, after environment validation | Required env vars, or `SKIP_ENV_VALIDATION=1` |
| `npm run start` | Serves the production build | A completed build |
| `npm run lint` | ESLint | Nothing |
| `npm run typecheck` | TypeScript, no emit | Route types: run `npx next typegen` first on a clean checkout |

## Database

| Command | What it does | Writes to the database |
| --- | --- | --- |
| `npm run create-admin` | Creates the admin auth user and adds it to `admin_users` | Yes |
| `npm run seed` | Categories, software, alternatives, taxonomy | Yes |
| `npm run seed:pages` | Legal and static pages | Yes |
| `npm run seed:articles` | Buying guides | Yes |
| `npm run seed:comparisons` | Head-to-head comparisons | Yes |
| `npm run seed:reviews` | Review corpus, with triggers paused for the bulk load | Yes |
| `npm run seed:all` | All seeds, in order | Yes |
| `npm run verify-db` | Checks the rating trigger and Row Level Security | Yes, a test review is inserted and then removed |

All database scripts need `NEXT_PUBLIC_SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY`.

## Content and research

| Command | What it does |
| --- | --- |
| `npm run check-copy` | Checks the content modules against the editorial rules |
| `npm run logos` | Fetches vendor logos |
| `npm run research:pricing` | Pricing research passes; reports under `data/pricing/` |
| `npm run pricing:sources` | Generates `data/pricing/SOURCES.md` from `lib/content/pricing.ts` |

## Screenshot rig

Not an npm script. With `npm run dev` running:

```bash
npx tsx scripts/shoot.ts /route --widths 1280,390 --theme light
```

Writes full-page screenshots and an overflow audit to `.screens/`, which is never
committed.
