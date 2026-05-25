create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  height_cm integer,
  current_weight_kg numeric(5,2),
  target_weight_kg numeric(5,2),
  calorie_goal integer not null default 2300,
  protein_goal integer not null default 150,
  training_frequency integer not null default 3,
  physique_goal text,
  created_at timestamptz not null default now()
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  code text not null,
  title text not null,
  description text,
  scheduled_weekday integer check (scheduled_weekday between 1 and 7),
  created_at timestamptz not null default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  name text not null,
  sets integer not null,
  reps text not null,
  rest_seconds integer not null,
  target_muscles text[] not null default '{}',
  execution_tips text not null,
  mistakes_to_avoid text not null,
  demo_url text,
  position integer not null default 0
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  calories integer not null,
  protein_g integer not null,
  ingredients text[] not null default '{}',
  prep_minutes integer not null,
  image_url text,
  is_snack boolean not null default false
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  recorded_at date not null default current_date,
  weight_kg numeric(5,2),
  waist_cm numeric(5,2),
  photo_before_url text,
  photo_after_url text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  tracked_date date not null default current_date,
  workout_id uuid references public.workouts(id) on delete set null,
  calories integer not null default 0,
  protein_g integer not null default 0,
  workout_completed boolean not null default false,
  validated boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, tracked_date)
);

create table if not exists public.daily_meals (
  id uuid primary key default gen_random_uuid(),
  daily_tracking_id uuid not null references public.daily_tracking(id) on delete cascade,
  meal_id uuid not null references public.meals(id) on delete restrict,
  quantity numeric(6,2) not null default 1,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.workouts enable row level security;
alter table public.exercises enable row level security;
alter table public.meals enable row level security;
alter table public.progress enable row level security;
alter table public.daily_tracking enable row level security;
alter table public.daily_meals enable row level security;

create table if not exists public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  tracked_date date not null default current_date,
  weight_used text,
  reps_done text,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, exercise_id, tracked_date)
);

alter table public.exercise_logs enable row level security;

create policy "Users can read own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

create policy "Users can read own workouts and templates" on public.workouts
  for select using (user_id is null or auth.uid() = user_id);
create policy "Users can manage own workouts" on public.workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can read exercises from visible workouts" on public.exercises
  for select using (
    exists (
      select 1 from public.workouts
      where workouts.id = exercises.workout_id
      and (workouts.user_id is null or workouts.user_id = auth.uid())
    )
  );

create policy "Meals are readable by authenticated users" on public.meals
  for select to authenticated using (true);

create policy "Users can manage own progress" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own daily tracking" on public.daily_tracking
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage meals attached to own days" on public.daily_meals
  for all using (
    exists (
      select 1 from public.daily_tracking
      where daily_tracking.id = daily_meals.daily_tracking_id
      and daily_tracking.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.daily_tracking
      where daily_tracking.id = daily_meals.daily_tracking_id
      and daily_tracking.user_id = auth.uid()
    )
  );

create policy "Users can manage own exercise logs" on public.exercise_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url, height_cm, current_weight_kg, target_weight_kg, physique_goal)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    183,
    75,
    72,
    'Physique sec et athlétique'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.workouts (id, code, title, description, scheduled_weekday) values
  ('00000000-0000-0000-0000-0000000000a1', 'A', 'Pecs lourds', 'Pecs, épaules, triceps, abdos', 1),
  ('00000000-0000-0000-0000-0000000000b1', 'B', 'Dos & biceps', 'Dos, biceps, rappel pec léger, abdos', 3),
  ('00000000-0000-0000-0000-0000000000c1', 'C', 'Haut du corps complet', 'Haut des pecs, dos largeur, épaules, bras, abdos', 5)
on conflict (id) do nothing;

insert into public.exercises (workout_id, name, sets, reps, rest_seconds, target_muscles, execution_tips, mistakes_to_avoid, position) values
  ('00000000-0000-0000-0000-0000000000a1', 'Développé couché barre', 4, '5-8', 150, array['Pectoraux','Triceps','Épaules avant'], 'Omoplates serrées, trajectoire contrôlée, pieds ancrés.', 'Rebondir sur la poitrine, coudes trop ouverts, fesses décollées.', 1),
  ('00000000-0000-0000-0000-0000000000a1', 'Développé incliné haltères', 3, '8-10', 120, array['Haut des pecs','Épaules'], 'Descente lente, haltères alignés au haut de poitrine.', 'Inclinaison trop haute, amplitude raccourcie.', 2),
  ('00000000-0000-0000-0000-0000000000b1', 'Tractions pronation', 4, '6-10', 120, array['Grand dorsal','Biceps'], 'Tirer les coudes vers les hanches, poitrine ouverte.', 'Demi-amplitude, menton projeté en avant.', 1),
  ('00000000-0000-0000-0000-0000000000c1', 'Développé incliné machine', 4, '8-10', 120, array['Haut des pecs'], 'Rester collé au dossier, pousser en arc naturel.', 'Épaules qui prennent tout le mouvement.', 1)
on conflict do nothing;

insert into public.meals (name, category, calories, protein_g, ingredients, prep_minutes, image_url, is_snack) values
  ('Poulet pommes de terre légumes', 'Repas riches en protéines', 620, 52, array['Poulet','Pommes de terre','Brocoli','Huile d''olive'], 25, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', false),
  ('Saumon riz courgettes', 'Post training', 690, 45, array['Saumon','Riz basmati','Courgettes','Citron'], 22, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288', false),
  ('Skyr banane', 'Collations', 220, 22, array['Skyr','Banane'], 3, null, true),
  ('Shake protéiné', 'Collations', 160, 28, array['Whey','Eau ou lait'], 2, null, true)
on conflict do nothing;
