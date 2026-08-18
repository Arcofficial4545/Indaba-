-- =============================================================================
-- Row level security
--
-- Three tiers:
--   anon           read published content only
--   admin          full write, scoped to members of admin_users
--   service role   bypasses RLS entirely, used only by server routes that must
--                  write regardless of caller (click logging, newsletter,
--                  contact form)
--
-- Note the deliberate departure from "authenticated can do anything": that
-- would hand full write access to any future signup. is_admin() checks
-- membership of the allowlist instead.
-- =============================================================================

alter table admin_users              enable row level security;
alter table categories               enable row level security;
alter table software                 enable row level security;
alter table reviews                  enable row level security;
alter table review_helpful_votes     enable row level security;
alter table articles                 enable row level security;
alter table software_alternatives    enable row level security;
alter table comparisons              enable row level security;
alter table software_price_history   enable row level security;
alter table taxonomy_terms           enable row level security;
alter table software_taxonomy        enable row level security;
alter table affiliate_clicks         enable row level security;
alter table pages                    enable row level security;
alter table site_settings            enable row level security;
alter table newsletter_subscribers   enable row level security;
alter table contact_messages         enable row level security;
alter table audit_log                enable row level security;
alter table redirects                enable row level security;
alter table media_library            enable row level security;

-- -----------------------------------------------------------------------------
-- Helper to keep the file re runnable
-- -----------------------------------------------------------------------------
do $$
declare
  p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
  loop
    execute format('drop policy if exists %I on %I.%I',
                   p.policyname, p.schemaname, p.tablename);
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- Public read
-- -----------------------------------------------------------------------------
create policy "anon reads categories"
  on categories for select using (true);

create policy "anon reads published software"
  on software for select using (status = 'published');

create policy "anon reads published reviews"
  on reviews for select using (status = 'published');

create policy "anon reads published articles"
  on articles for select using (status = 'published');

create policy "anon reads alternatives"
  on software_alternatives for select using (true);

create policy "anon reads published comparisons"
  on comparisons for select using (status = 'published');

create policy "anon reads price history"
  on software_price_history for select using (true);

create policy "anon reads taxonomy"
  on taxonomy_terms for select using (true);

create policy "anon reads software taxonomy"
  on software_taxonomy for select using (true);

create policy "anon reads published pages"
  on pages for select using (status = 'published');

create policy "anon reads settings"
  on site_settings for select using (true);

create policy "anon reads redirects"
  on redirects for select using (true);

create policy "anon reads media"
  on media_library for select using (true);

-- -----------------------------------------------------------------------------
-- Admin write, scoped to the allowlist
-- -----------------------------------------------------------------------------
create policy "admin reads own row"
  on admin_users for select using (user_id = auth.uid());

create policy "admin manages categories"
  on categories for all using (is_admin()) with check (is_admin());

create policy "admin manages software"
  on software for all using (is_admin()) with check (is_admin());

create policy "admin manages reviews"
  on reviews for all using (is_admin()) with check (is_admin());

create policy "admin manages articles"
  on articles for all using (is_admin()) with check (is_admin());

create policy "admin manages alternatives"
  on software_alternatives for all using (is_admin()) with check (is_admin());

create policy "admin manages comparisons"
  on comparisons for all using (is_admin()) with check (is_admin());

create policy "admin manages price history"
  on software_price_history for all using (is_admin()) with check (is_admin());

create policy "admin manages taxonomy"
  on taxonomy_terms for all using (is_admin()) with check (is_admin());

create policy "admin manages software taxonomy"
  on software_taxonomy for all using (is_admin()) with check (is_admin());

create policy "admin manages pages"
  on pages for all using (is_admin()) with check (is_admin());

create policy "admin manages settings"
  on site_settings for all using (is_admin()) with check (is_admin());

create policy "admin manages redirects"
  on redirects for all using (is_admin()) with check (is_admin());

create policy "admin manages media"
  on media_library for all using (is_admin()) with check (is_admin());

create policy "admin reads audit log"
  on audit_log for select using (is_admin());

-- -----------------------------------------------------------------------------
-- Service role only writes
--
-- No insert policy for anon or authenticated on these. The server routes use
-- the service role key, which bypasses RLS. The admin may read them, and may
-- update the newsletter and contact rows to work through them.
-- -----------------------------------------------------------------------------
create policy "admin reads clicks"
  on affiliate_clicks for select using (is_admin());

create policy "admin reads subscribers"
  on newsletter_subscribers for select using (is_admin());

create policy "admin updates subscribers"
  on newsletter_subscribers for update using (is_admin()) with check (is_admin());

create policy "admin reads contact messages"
  on contact_messages for select using (is_admin());

create policy "admin updates contact messages"
  on contact_messages for update using (is_admin()) with check (is_admin());

-- Helpful votes are written through a rate limited server route on the service
-- role, and are never read directly by the public. The count lives on reviews.
create policy "admin reads helpful votes"
  on review_helpful_votes for select using (is_admin());
