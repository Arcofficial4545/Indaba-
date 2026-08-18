-- =============================================================================
-- Indaba schema
--
-- Idempotent and safe to re run. Apply in order: 0001, 0002, 0003, 0004.
--
-- Note on UUIDs: this uses gen_random_uuid(), which Postgres 13+ provides via
-- pgcrypto and Supabase enables by default. uuid_generate_v4() would require
-- the uuid-ossp extension, which is not on by default.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Admin allowlist
--
-- RLS policies below grant write access to members of this table rather than
-- to every authenticated user. Without it, any future signup would inherit
-- full write access to all published content.
-- -----------------------------------------------------------------------------
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;

-- -----------------------------------------------------------------------------
-- Categories
-- -----------------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  description text,
  software_count int not null default 0,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Software, the core table
-- -----------------------------------------------------------------------------
create table if not exists software (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text,
  description_short text not null,
  description_full text not null,          -- HTML
  logo_url text,
  screenshots jsonb not null default '[]',
  category_id uuid references categories(id) on delete set null,

  starting_price numeric,
  price_currency text not null default 'ZAR',
  billing_period text not null default 'month',
  -- Vendors quote differently. Null means we have not confirmed it, and the
  -- UI says so rather than guessing.
  vat_inclusive boolean,
  price_source_url text,
  price_verified_at timestamptz,
  free_trial boolean not null default false,
  free_trial_days int,
  free_version boolean not null default false,
  pricing_plans jsonb not null default '[]',

  features jsonb not null default '[]',
  top_features jsonb not null default '[]',
  integrations jsonb not null default '[]',
  brand_color text,

  affiliate_url text,
  vendor_website text,
  vendor_name text,
  founded_year int,
  support_types jsonb not null default '[]',
  countries_available jsonb not null default '[]',
  languages jsonb not null default '[]',

  -- Aggregates. Written ONLY by update_software_ratings(). Application code
  -- must never assign these.
  overall_rating numeric(3,1) not null default 0,
  ease_of_use_rating numeric(3,1) not null default 0,
  value_for_money_rating numeric(3,1) not null default 0,
  customer_service_rating numeric(3,1) not null default 0,
  functionality_rating numeric(3,1) not null default 0,
  review_count int not null default 0,

  meta_title text,
  meta_description text,
  og_image_url text,

  status text not null default 'draft' check (status in ('published','draft')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  search_vector tsvector generated always as (
    to_tsvector('english',
      coalesce(name,'') || ' ' || coalesce(tagline,'') || ' ' ||
      coalesce(description_short,'') || ' ' || coalesce(vendor_name,''))
  ) stored
);

create index if not exists software_search_idx on software using gin (search_vector);
create index if not exists software_category_published_idx on software (category_id) where status = 'published';
create index if not exists software_status_idx on software (status);
create index if not exists software_slug_idx on software (slug);

-- -----------------------------------------------------------------------------
-- Reviews
-- -----------------------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  software_id uuid not null references software(id) on delete cascade,

  reviewer_name text not null,
  reviewer_job_title text,
  reviewer_company text,
  reviewer_industry text,
  reviewer_company_size text,
  reviewer_country text not null default 'South Africa',
  reviewer_city text,
  reviewer_avatar_url text,
  verified_linkedin boolean not null default false,
  verified_badge boolean not null default false,
  used_for_duration text,

  overall_rating int not null check (overall_rating between 1 and 5),
  ease_of_use int not null check (ease_of_use between 1 and 5),
  value_for_money int not null check (value_for_money between 1 and 5),
  customer_service int not null check (customer_service between 1 and 5),
  functionality int not null check (functionality between 1 and 5),

  review_title text not null,
  summary text not null,
  pros text,
  cons text,
  vendor_response text,
  vendor_response_date timestamptz,
  review_date timestamptz not null default now(),
  helpful_count int not null default 0,
  status text not null default 'published' check (status in ('published','hidden')),
  created_at timestamptz not null default now()
);

create index if not exists reviews_software_idx on reviews (software_id) where status = 'published';
create index if not exists reviews_date_idx on reviews (review_date desc);
create index if not exists reviews_rating_idx on reviews (software_id, overall_rating);

-- Helpfulness voting, rate limited by a hashed voter fingerprint.
create table if not exists review_helpful_votes (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id) on delete cascade,
  voter_hash text not null,
  created_at timestamptz not null default now(),
  unique (review_id, voter_hash)
);

-- -----------------------------------------------------------------------------
-- Articles
-- -----------------------------------------------------------------------------
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  featured_image_url text,
  category_tag text,
  related_software_id uuid references software(id) on delete set null,
  author_name text not null,
  author_bio text,
  author_avatar_url text,
  author_title text,
  meta_title text,
  meta_description text,
  read_time_minutes int not null default 5,
  status text not null default 'draft' check (status in ('published','draft')),
  featured boolean not null default false,
  published_date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  search_vector tsvector generated always as (
    to_tsvector('english',
      coalesce(title,'') || ' ' || coalesce(excerpt,'') || ' ' ||
      coalesce(category_tag,''))
  ) stored
);

create index if not exists articles_search_idx on articles using gin (search_vector);
create index if not exists articles_published_idx on articles (published_date desc) where status = 'published';

-- -----------------------------------------------------------------------------
-- Alternatives and comparisons
-- -----------------------------------------------------------------------------
create table if not exists software_alternatives (
  id uuid primary key default gen_random_uuid(),
  software_id uuid not null references software(id) on delete cascade,
  alternative_id uuid not null references software(id) on delete cascade,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (software_id, alternative_id),
  check (software_id <> alternative_id)
);

create index if not exists software_alternatives_idx on software_alternatives (software_id, display_order);

create table if not exists comparisons (
  id uuid primary key default gen_random_uuid(),
  software_a_id uuid not null references software(id) on delete cascade,
  software_b_id uuid not null references software(id) on delete cascade,
  slug text not null unique,
  custom_verdict text,
  meta_title text,
  meta_description text,
  status text not null default 'draft' check (status in ('published','draft')),
  created_at timestamptz not null default now(),
  unique (software_a_id, software_b_id),
  check (software_a_id <> software_b_id)
);

-- -----------------------------------------------------------------------------
-- Price history
--
-- One row per observed change, so the profile page can say "the price moved in
-- March" instead of silently showing a new number.
-- -----------------------------------------------------------------------------
create table if not exists software_price_history (
  id uuid primary key default gen_random_uuid(),
  software_id uuid not null references software(id) on delete cascade,
  starting_price numeric,
  price_currency text not null default 'ZAR',
  vat_inclusive boolean,
  source_url text,
  recorded_at timestamptz not null default now()
);

create index if not exists price_history_idx on software_price_history (software_id, recorded_at desc);

-- -----------------------------------------------------------------------------
-- "Best for" taxonomy
--
-- Drives landing pages such as "best accounting software for sole traders in
-- South Africa", which is where the search volume actually sits.
-- -----------------------------------------------------------------------------
create table if not exists taxonomy_terms (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('business_size','role','industry')),
  name text not null,
  slug text not null unique,
  description text,
  display_order int not null default 0
);

create table if not exists software_taxonomy (
  software_id uuid not null references software(id) on delete cascade,
  term_id uuid not null references taxonomy_terms(id) on delete cascade,
  primary key (software_id, term_id)
);

-- -----------------------------------------------------------------------------
-- Monetisation and operations
-- -----------------------------------------------------------------------------
create table if not exists affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  software_id uuid references software(id) on delete set null,
  software_name text not null,
  affiliate_url text not null,
  clicked_at timestamptz not null default now(),
  -- Peppered SHA-256. A raw IP address is never stored, for POPIA reasons.
  ip_hash text,
  user_agent text,
  referrer text,
  country_code text
);

create index if not exists affiliate_clicks_idx on affiliate_clicks (software_id, clicked_at desc);

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  meta_title text,
  meta_description text,
  status text not null default 'draft' check (status in ('published','draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  updated_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'pending' check (status in ('pending','confirmed','unsubscribed')),
  interests text[] not null default '{}',
  confirm_token text,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  consent_ip_hash text,
  consent_source text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists newsletter_status_idx on newsletter_subscribers (status);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  ip_hash text,
  user_agent text,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  row_id uuid,
  action text not null,
  actor uuid,
  changed_at timestamptz not null default now(),
  old_data jsonb,
  new_data jsonb
);

create index if not exists audit_log_idx on audit_log (table_name, changed_at desc);

create table if not exists redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text not null unique,
  to_path text not null,
  status_code int not null default 301 check (status_code in (301,302)),
  created_at timestamptz not null default now()
);

create table if not exists media_library (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  public_url text not null,
  alt_text text,
  uploaded_by uuid,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);
