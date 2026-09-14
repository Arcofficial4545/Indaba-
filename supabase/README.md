# Supabase

Schema, Row Level Security and storage policies for the Indaba database.

## Migrations

Applied in numeric order. Every file is idempotent and safe to re-run.

| File | Contents |
| --- | --- |
| `0001_schema.sql` | Tables, indexes, generated search columns, the `admin_users` allowlist and `is_admin()` |
| `0002_triggers.sql` | Rating aggregates, category counts, `updated_at`, price history, audit log, bulk seed helpers |
| `0003_rls.sql` | Row Level Security and policies for every table |
| `0004_storage.sql` | Public-read storage buckets, writable by admins only |
| `0005_rls_hardening.sql` | RLS on every public table, private tables revoked from the public role, aggregate functions removed from the public API |

## Rules

- **Never edit a migration that has been applied to production.** Add a new file
  with the next number: `NNNN_description.sql`.
- Write every migration so it can be re-run without harm.
- Never reset the production database, and never seed it without explicit sign-off.

## Applying a migration

Either paste each new file, in order, into **Supabase > SQL Editor** and run it,
or use the CLI:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

## Checks

- `checks/schema_inventory.sql` is read only. Run it in the SQL Editor to list
  every table, column, index, function, trigger, policy and public-role grant,
  and compare the output with these migrations.
- `npm run verify-db` confirms the rating trigger and Row Level Security behave.
  It inserts a test review and removes it again.

First-time project setup: [`docs/operations/supabase-setup.md`](../docs/operations/supabase-setup.md).
