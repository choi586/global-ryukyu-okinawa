-- Run once in your own Supabase SQL editor. All access is through server-side service credentials.
create table if not exists public.records (
  namespace text not null,
  id text not null,
  data jsonb not null,
  primary key (namespace, id)
);
alter table public.records enable row level security;
revoke all on public.records from anon, authenticated;
create table if not exists public.login_limits (id text primary key, count integer not null);
alter table public.login_limits enable row level security;
revoke all on public.login_limits from anon, authenticated;
create or replace function public.consume_login_attempt(bucket text) returns integer language plpgsql security definer set search_path = public as $$
declare result integer;
begin
  delete from public.login_limits where id <> bucket;
  insert into public.login_limits values(bucket, 1) on conflict(id) do update set count=login_limits.count+1 returning count into result;
  return result;
end;
$$;
revoke all on function public.consume_login_attempt(text) from public, anon, authenticated;
grant execute on function public.consume_login_attempt(text) to service_role;
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('notice-files','notice-files',false,3145728,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict(id) do nothing;
