# Supabase setup

Follow this once. The site runs on local fallback data until step 4, so
nothing is broken while you work through it.

## 1. Create the project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. **New project**.
   - **Name:** `indaba`
   - **Database password:** generate one and put it in your password manager.
     You will not be shown it again, and you need it for direct SQL access.
   - **Region:** pick the one closest to South Africa that is offered. At the
     time of writing that is `eu-west-1` (Ireland) or `eu-central-1`
     (Frankfurt). There is no African region, so expect roughly 150 to 180ms
     of round trip from Johannesburg. That is fine, because every public page
     is statically generated and revalidated hourly rather than queried per
     visit.
3. Wait for provisioning, usually about two minutes.

## 2. Collect the three keys

**Project Settings** in the left sidebar, then **API**.

| Key | Where it goes | Exposure |
|---|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | Public, safe in the browser |
| `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public, safe in the browser |
| `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` | **Server only** |

The `service_role` key bypasses row level security completely. It is used only
by the click tracking, newsletter and contact routes, which must write even
though the visitor is anonymous. It must never appear in a client component,
in `NEXT_PUBLIC_*`, or in the repository. If it leaks, rotate it on this same
page immediately.

## 3. Turn off public signups

The site has exactly one admin. Leaving signups open would let anyone create an
account.

**Authentication** > **Sign In / Providers** > **Email**:

- Leave **Enable email provider** on.
- Turn **Allow new users to sign up** off.
- Turn **Confirm email** on.

## 4. Fill in the environment file

```bash
cp .env.local.example .env.local
```

Paste the three keys, then generate the IP pepper:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Put the result in `IP_HASH_PEPPER`. Restart `npm run dev`. The site now reads
from Supabase instead of the fallback data. It will look empty until step 6,
which is expected.

## 5. Apply the migrations

Open **SQL Editor** > **New query** and run the four files in
`supabase/migrations/` **in order**, one at a time:

1. `0001_schema.sql` — tables, indexes, generated search columns
2. `0002_triggers.sql` — aggregate ratings, category counts, `updated_at`,
   price history, audit log
3. `0003_rls.sql` — row level security on every table
4. `0004_storage.sql` — the four public read buckets

All four are idempotent, so re running one is safe.

If you would rather use the CLI:

```bash
npm i -g supabase
supabase link --project-ref <your-ref>
supabase db push
```

## 6. Create the admin user

```bash
npm run create-admin
```

This creates the auth user through the service role key and adds them to the
`admin_users` allowlist. Membership of that table, not merely being signed in,
is what the write policies check, so a stray signup could never edit content.

## 7. Seed the content

```bash
npm run seed            # categories, software, alternatives, taxonomy
npm run seed:pages      # legal and static pages
npm run seed:articles   # buying guides
npm run seed:comparisons
npm run seed:reviews    # the large one
```

`seed:reviews` disables the per row ratings trigger, bulk inserts, re enables
it and then calls `rebuild_all_aggregates()`. Without that, six thousand
inserts would each recompute an average across every sibling review, which
turns a one minute seed into a very long one.

## 8. Verify

```bash
npm run verify-db
```

Checks that the aggregate trigger fires, that an anonymous client cannot write,
and that RLS is enabled on every table.
