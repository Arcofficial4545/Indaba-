-- =============================================================================
-- Storage buckets
--
-- Four public read buckets, writable only by the admin allowlist.
-- =============================================================================

insert into storage.buckets (id, name, public)
values
  ('logos',       'logos',       true),
  ('screenshots', 'screenshots', true),
  ('avatars',     'avatars',     true),
  ('articles',    'articles',    true)
on conflict (id) do update set public = excluded.public;

-- Re runnable: clear the policies this file owns before recreating them.
do $$
declare
  p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname like 'indaba %'
  loop
    execute format('drop policy if exists %I on storage.objects', p.policyname);
  end loop;
end;
$$;

create policy "indaba public read"
  on storage.objects for select
  using (bucket_id in ('logos','screenshots','avatars','articles'));

create policy "indaba admin insert"
  on storage.objects for insert
  with check (
    bucket_id in ('logos','screenshots','avatars','articles') and is_admin()
  );

create policy "indaba admin update"
  on storage.objects for update
  using (
    bucket_id in ('logos','screenshots','avatars','articles') and is_admin()
  );

create policy "indaba admin delete"
  on storage.objects for delete
  using (
    bucket_id in ('logos','screenshots','avatars','articles') and is_admin()
  );
