-- =============================================================================
-- Triggers
--
-- Four of these carry real logic. The first is the important one: aggregate
-- ratings are computed here and nowhere else. No application code path is
-- permitted to write software.overall_rating or its siblings.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Aggregate ratings
--
-- Recomputes all five averages plus the review count for one product, counting
-- only published reviews. Rounded to one decimal to match the column type.
-- -----------------------------------------------------------------------------
create or replace function recompute_software_ratings(target uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update software s
  set
    overall_rating          = coalesce(agg.overall, 0),
    ease_of_use_rating      = coalesce(agg.ease, 0),
    value_for_money_rating  = coalesce(agg.value, 0),
    customer_service_rating = coalesce(agg.service, 0),
    functionality_rating    = coalesce(agg.functionality, 0),
    review_count            = coalesce(agg.total, 0)
  from (
    select
      round(avg(overall_rating)::numeric, 1)   as overall,
      round(avg(ease_of_use)::numeric, 1)      as ease,
      round(avg(value_for_money)::numeric, 1)  as value,
      round(avg(customer_service)::numeric, 1) as service,
      round(avg(functionality)::numeric, 1)    as functionality,
      count(*)                                 as total
    from reviews
    where software_id = target and status = 'published'
  ) agg
  where s.id = target;
end;
$$;

create or replace function update_software_ratings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform recompute_software_ratings(old.software_id);
    return old;
  end if;

  perform recompute_software_ratings(new.software_id);

  -- A review moved between products, so the old one needs recomputing too.
  if tg_op = 'UPDATE' and old.software_id is distinct from new.software_id then
    perform recompute_software_ratings(old.software_id);
  end if;

  return new;
end;
$$;

drop trigger if exists reviews_update_ratings on reviews;
create trigger reviews_update_ratings
  after insert or update or delete on reviews
  for each row execute function update_software_ratings();

-- -----------------------------------------------------------------------------
-- 2. Category counts
-- -----------------------------------------------------------------------------
create or replace function recompute_category_count(target uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if target is null then return; end if;

  update categories c
  set software_count = (
    select count(*) from software s
    where s.category_id = target and s.status = 'published'
  )
  where c.id = target;
end;
$$;

create or replace function update_category_counts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform recompute_category_count(old.category_id);
    return old;
  end if;

  perform recompute_category_count(new.category_id);

  if tg_op = 'UPDATE' and old.category_id is distinct from new.category_id then
    perform recompute_category_count(old.category_id);
  end if;

  return new;
end;
$$;

drop trigger if exists software_update_category_counts on software;
create trigger software_update_category_counts
  after insert or delete or update of category_id, status on software
  for each row execute function update_category_counts();

-- -----------------------------------------------------------------------------
-- 3. updated_at
-- -----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists software_set_updated_at on software;
create trigger software_set_updated_at
  before update on software
  for each row execute function set_updated_at();

drop trigger if exists articles_set_updated_at on articles;
create trigger articles_set_updated_at
  before update on articles
  for each row execute function set_updated_at();

drop trigger if exists pages_set_updated_at on pages;
create trigger pages_set_updated_at
  before update on pages
  for each row execute function set_updated_at();

-- -----------------------------------------------------------------------------
-- 4. Price history
--
-- Records a row whenever the listed price or its VAT basis actually changes,
-- which is what lets the profile page say when a price last moved.
-- -----------------------------------------------------------------------------
create or replace function record_price_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT'
     or old.starting_price is distinct from new.starting_price
     or old.vat_inclusive is distinct from new.vat_inclusive then
    insert into software_price_history
      (software_id, starting_price, price_currency, vat_inclusive, source_url)
    values
      (new.id, new.starting_price, new.price_currency, new.vat_inclusive, new.price_source_url);
  end if;
  return new;
end;
$$;

drop trigger if exists software_record_price_change on software;
create trigger software_record_price_change
  after insert or update of starting_price, vat_inclusive on software
  for each row execute function record_price_change();

-- -----------------------------------------------------------------------------
-- 5. Audit log
-- -----------------------------------------------------------------------------
create or replace function write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  rid uuid;
begin
  rid := case when tg_op = 'DELETE' then old.id else new.id end;

  insert into audit_log (table_name, row_id, action, actor, old_data, new_data)
  values (
    tg_table_name,
    rid,
    tg_op,
    auth.uid(),
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) else null end
  );

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists software_audit on software;
create trigger software_audit
  after insert or update or delete on software
  for each row execute function write_audit_log();

drop trigger if exists articles_audit on articles;
create trigger articles_audit
  after insert or update or delete on articles
  for each row execute function write_audit_log();

drop trigger if exists reviews_audit on reviews;
create trigger reviews_audit
  after insert or update or delete on reviews
  for each row execute function write_audit_log();

drop trigger if exists pages_audit on pages;
create trigger pages_audit
  after insert or update or delete on pages
  for each row execute function write_audit_log();

drop trigger if exists site_settings_audit on site_settings;
create trigger site_settings_audit
  after insert or update or delete on site_settings
  for each row execute function write_audit_log();

-- -----------------------------------------------------------------------------
-- 6. Helpful vote counter
-- -----------------------------------------------------------------------------
create or replace function update_helpful_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid;
begin
  target := case when tg_op = 'DELETE' then old.review_id else new.review_id end;

  update reviews r
  set helpful_count = (
    select count(*) from review_helpful_votes v where v.review_id = target
  )
  where r.id = target;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists review_votes_count on review_helpful_votes;
create trigger review_votes_count
  after insert or delete on review_helpful_votes
  for each row execute function update_helpful_count();

-- -----------------------------------------------------------------------------
-- Bulk seed helpers
--
-- The ratings trigger is per row, so a six thousand row review seed would
-- recompute an average across every sibling on each insert. The seed script
-- disables the trigger, bulk inserts, re enables, then calls the rebuild.
-- -----------------------------------------------------------------------------
/*
  PostgREST cannot execute DDL, so the seed script cannot run ALTER TABLE
  directly. This wrapper runs as its definer, which can, and is the only
  supported way to switch the review triggers off for a bulk load.

  The audit trigger goes off with it. Six thousand audit rows recording a seed
  is noise that makes the real audit trail harder to read.
*/
create or replace function set_reviews_triggers(enabled boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if enabled then
    execute 'alter table reviews enable trigger reviews_update_ratings';
    execute 'alter table reviews enable trigger reviews_audit';
  else
    execute 'alter table reviews disable trigger reviews_update_ratings';
    execute 'alter table reviews disable trigger reviews_audit';
  end if;
end;
$$;

revoke all on function set_reviews_triggers(boolean) from public, anon, authenticated;

create or replace function rebuild_all_aggregates()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  for r in select id from software loop
    perform recompute_software_ratings(r.id);
  end loop;

  for r in select id from categories loop
    perform recompute_category_count(r.id);
  end loop;
end;
$$;
