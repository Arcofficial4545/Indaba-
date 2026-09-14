# Deployment runbook

`main` deploys to Vercel production on every merge. Follow this for each release.

## 1. Before merging

- [ ] CI is green on the pull request (lint, route types, type-check, build).
- [ ] Local dev servers are stopped, so no stale generated files are relied on.
- [ ] `.env.local`, `_trash/` and `.screens/` are not in the change set.
- [ ] New files are included (new pages, assets under `public/`, migrations).
- [ ] Any new migration has been applied to production first. See
      [`../../supabase/README.md`](../../supabase/README.md).

## 2. Vercel environment variables

**Vercel > Project > Settings > Environment Variables.** Tick Production and
Preview for each. Mark server-only values **Sensitive**.

| Variable | Value | Sensitive |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key, `sb_publishable_…` | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key, `sb_secret_…` | Yes |
| `IP_HASH_PEPPER` | 64 hex characters | Yes |
| `NEXT_PUBLIC_SITE_URL` | `https://indaba-one.vercel.app`, never localhost | No |
| `RESEND_API_KEY` | Resend key, `re_…` | Yes |
| `EMAIL_FROM` | `Indaba <sender@verified-domain>` | No |

Each value box holds the value only: no `NAME=` prefix, no quotes, no spaces.
Changing a variable takes effect only after a redeploy.

Also confirm **Settings > Git > Production Branch** is `main`.

## 3. Supabase settings

- **Authentication > URL Configuration**
  - Site URL: `https://indaba-one.vercel.app`
  - Redirect URLs: `http://localhost:3000/**`, `https://indaba-one.vercel.app/**`,
    and the preview pattern `https://*-<vercel-team>.vercel.app/**`
- **Authentication > Sign In / Providers > Email:** Allow new users to sign up is **off**.
- An admin exists: `npm run create-admin`.

## 4. Deploy

1. Merge the pull request into `main`. Vercel starts the build.
2. Watch **Vercel > Deployments** until the deployment is **Ready**.
3. If the log shows `Environment check failed`, fix the named variable and use
   **Redeploy**.

## 5. Post-deploy checks

- [ ] Home page counters show numbers, not zero.
- [ ] A product page's visit button opens the vendor in a new tab, with the
      disclosure beside it.
- [ ] `/for-vendors` loads, and the navbar CTA links to it.
- [ ] Newsletter: subscribing shows the success message, the welcome email
      arrives with the logo, and its unsubscribe link works.
- [ ] `/admin/login` signs in, and the session survives refreshes and navigation.
- [ ] `/robots.txt` and `/sitemap.xml` use the production URL.

## 6. Rolling back

In **Vercel > Deployments**, promote the last good deployment to production.
Database migrations do not roll back with it, which is one more reason every
migration is written to be additive and safe to re-run.

## Key rotation

When a key may have been exposed: create a replacement at the source, update
Vercel and `.env.local`, redeploy, then revoke the old key.

## Email deliverability

Until a sending domain is verified in Resend, email reaches only the Resend
account owner. For production:

1. Add the domain in **Resend > Domains** and create its DNS records (SPF, DKIM,
   DMARC) at the registrar.
2. Set `EMAIL_FROM` to an address on that domain.
3. Redeploy.

A verified domain is the largest single factor in landing in the Gmail
Primary tab.
