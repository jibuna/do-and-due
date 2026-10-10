-- Do & Due sync: run once in Supabase (SQL Editor). Safe to run again.
create table if not exists public.docs (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  key text not null,
  data jsonb,
  deleted boolean not null default false,
  ts bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.docs enable row level security;

drop policy if exists "docs select own" on public.docs;
drop policy if exists "docs insert own" on public.docs;
drop policy if exists "docs update own" on public.docs;
drop policy if exists "docs delete own" on public.docs;

create policy "docs select own" on public.docs for select to authenticated using (user_id = (select auth.uid()));
create policy "docs insert own" on public.docs for insert to authenticated with check (user_id = (select auth.uid()));
create policy "docs update own" on public.docs for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "docs delete own" on public.docs for delete to authenticated using (user_id = (select auth.uid()));

-- An older change never overwrites a newer one, even if devices sync out of order.
create or replace function public.docs_keep_newer() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.ts <= old.ts then
    return null;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists docs_keep_newer on public.docs;
create trigger docs_keep_newer before update on public.docs
  for each row execute function public.docs_keep_newer();
