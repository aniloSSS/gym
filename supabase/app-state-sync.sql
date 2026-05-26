create table if not exists public.app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

drop policy if exists "Users can read own app state" on public.app_state;
drop policy if exists "Users can insert own app state" on public.app_state;
drop policy if exists "Users can update own app state" on public.app_state;
drop policy if exists "Users can delete own app state" on public.app_state;

create policy "Users can read own app state" on public.app_state
  for select using (auth.uid() = user_id);

create policy "Users can insert own app state" on public.app_state
  for insert with check (auth.uid() = user_id);

create policy "Users can update own app state" on public.app_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own app state" on public.app_state
  for delete using (auth.uid() = user_id);

create or replace function public.touch_app_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_app_state_updated_at on public.app_state;

create trigger touch_app_state_updated_at
  before update on public.app_state
  for each row execute procedure public.touch_app_state_updated_at();
