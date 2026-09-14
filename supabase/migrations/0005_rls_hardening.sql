-- =============================================================================
-- RLS hardening
--
-- Applies on top of 0003. Three changes:
--
--   1. RLS switched on for every table in public, including any created in the
--      dashboard after 0001 was written. A table without RLS is open to anyone
--      holding the anon key, and the anon key ships to every browser.
--   2. Table privileges on the private tables revoked from anon, so a policy
--      mistake later still cannot expose subscriber emails, contact messages
--      or click logs. The admin reads these as `authenticated`, which keeps
--      its grants and its is_admin() policies.
--   3. The aggregate rebuild functions taken off the public RPC surface.
--      Anyone could otherwise call /rest/v1/rpc/rebuild_all_aggregates and
--      make the database recompute every rating on demand.
--
-- Public writes (reviews, newsletter, contact, affiliate clicks) deliberately
-- get no anon INSERT policy. They go through server actions and route handlers
-- on the service role, which validate input, apply the honeypot, and force
-- reviews to `hidden` and subscribers to `pending`. An anon INSERT policy would
-- let anyone skip all of that by posting to PostgREST with the public key.
--
-- Idempotent and safe to re run.
-- =============================================================================

do $$
declare
  t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end;
$$;

revoke all on table
  newsletter_subscribers,
  contact_messages,
  affiliate_clicks,
  audit_log,
  admin_users,
  review_helpful_votes
from anon;

-- The triggers that call these run as their definer, so revoking caller access
-- does not stop ratings or category counts updating. The seed scripts call
-- rebuild_all_aggregates() on the service role, which keeps its own grant.
revoke execute on function rebuild_all_aggregates() from public, anon, authenticated;
revoke execute on function recompute_software_ratings(uuid) from public, anon, authenticated;
revoke execute on function recompute_category_count(uuid) from public, anon, authenticated;
