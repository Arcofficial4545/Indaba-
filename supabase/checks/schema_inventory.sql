-- =============================================================================
-- Schema inventory. READ ONLY.
--
-- Run in the Supabase SQL Editor against production, export the result, and
-- compare it with supabase/migrations/. Anything listed here that the
-- migrations do not create was added through the dashboard and needs a
-- migration of its own. Nothing in this file writes.
--
-- Lives outside migrations/ so the CLI never tries to apply it.
-- =============================================================================

select kind, name, detail from (
  select 'table'::text as kind, c.relname::text as name,
         ('rls=' || c.relrowsecurity::text)::text as detail
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r'

  union all
  select 'column', (table_name || '.' || column_name)::text,
         (data_type
           || case when is_nullable = 'NO' then ' not null' else '' end
           || coalesce(' default ' || column_default, ''))::text
  from information_schema.columns
  where table_schema = 'public'

  union all
  select 'index', indexname::text, indexdef::text
  from pg_indexes
  where schemaname = 'public'

  union all
  select 'function',
         (p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')')::text,
         (case when p.prosecdef then 'security definer' else 'invoker' end)::text
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'

  union all
  select 'trigger', (event_object_table || '.' || trigger_name)::text,
         (action_timing || ' ' || event_manipulation)::text
  from information_schema.triggers
  where trigger_schema = 'public'

  union all
  select 'policy', (schemaname || '.' || tablename || ': ' || policyname)::text,
         (cmd || ' using ' || coalesce(qual, '-') || ' check ' || coalesce(with_check, '-'))::text
  from pg_policies
  where schemaname in ('public', 'storage')

  union all
  select 'anon grant', table_name::text,
         string_agg(privilege_type::text, ', ' order by privilege_type::text)
  from information_schema.role_table_grants
  where grantee = 'anon' and table_schema = 'public'
  group by table_name
) inventory
order by kind, name;
