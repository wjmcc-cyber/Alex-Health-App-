create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  full_name text not null,
  age integer not null check (age between 16 and 80),
  sex text not null,
  height_cm numeric(5,2) not null,
  weight_kg numeric(5,2) not null,
  fitness_level text not null,
  training_experience_years integer not null default 0,
  dietary_preference text not null,
  weekly_sessions integer not null,
  session_minutes integer not null,
  schedule_notes text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  goal_type text not null,
  starting_weight_kg numeric(5,2) not null,
  target_weight_kg numeric(5,2),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.injuries_or_limitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  limitation_area text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.equipment_inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  equipment_type text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_plans (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  split text not null,
  coaching_summary text not null,
  weekly_frequency integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_weeks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  workout_plan_id text not null references public.workout_plans(id) on delete cascade,
  week_number integer not null default 1,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_days (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  workout_plan_id text not null references public.workout_plans(id) on delete cascade,
  sort_order integer not null,
  day_label text not null,
  focus text not null,
  estimated_minutes integer not null,
  exercises_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.exercises (
  id text primary key,
  name text not null,
  category text not null,
  primary_muscles text[] not null default '{}',
  equipment_types text[] not null default '{}',
  injury_tags text[] not null default '{}',
  coaching_cue text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.exercise_substitutions (
  id uuid primary key default gen_random_uuid(),
  exercise_id text not null references public.exercises(id) on delete cascade,
  substitution_exercise_id text not null references public.exercises(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  workout_day_id text not null references public.workout_days(id) on delete cascade,
  perceived_effort integer not null default 7,
  notes text not null default '',
  completed_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  calories integer not null,
  protein_grams integer not null,
  carbs_grams integer not null,
  fats_grams integer not null,
  fiber_grams integer not null,
  hydration_liters numeric(4,1) not null,
  maintenance_calories integer not null,
  target_adjustment integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.foods (
  id text primary key,
  name text not null,
  brand text,
  calories integer not null,
  protein numeric(6,2) not null,
  carbs numeric(6,2) not null,
  fats numeric(6,2) not null,
  serving_size text not null,
  category text not null,
  is_custom boolean not null default false,
  user_id uuid references public.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.food_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  food_id text not null references public.foods(id) on delete cascade,
  logged_for_date date not null,
  meal_label text not null,
  servings numeric(6,2) not null default 1,
  calories integer not null,
  protein numeric(6,2) not null,
  carbs numeric(6,2) not null,
  fats numeric(6,2) not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.meal_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  items_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.grocery_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.grocery_list_items (
  id uuid primary key default gen_random_uuid(),
  grocery_list_id uuid not null references public.grocery_lists(id) on delete cascade,
  name text not null,
  quantity_label text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.progress_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  metric_date date not null,
  weight_kg numeric(5,2) not null,
  workout_minutes integer not null default 0,
  calories_consumed integer not null default 0,
  calorie_target integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.prediction_snapshots (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  horizon text not null,
  expected_weight_low_kg numeric(5,2) not null,
  expected_weight_high_kg numeric(5,2) not null,
  body_composition_direction text not null,
  confidence text not null,
  assumptions_json jsonb not null default '[]'::jsonb,
  explanation text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.wearable_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  provider text not null,
  status text not null default 'not_connected',
  last_sync_at timestamptz,
  external_user_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.body_scan_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'pending',
  upload_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.body_scan_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  body_scan_job_id uuid not null unique references public.body_scan_jobs(id) on delete cascade,
  body_fat_estimate numeric(5,2),
  lean_mass_estimate_kg numeric(5,2),
  posture_summary text not null default 'Not available in MVP',
  symmetry_summary text not null default 'Not available in MVP',
  confidence text not null default 'not_available',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  premium_enabled boolean not null default false,
  measurement_units text not null default 'metric',
  coaching_tone text not null default 'supportive',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_goals_user_id on public.goals(user_id);
create index if not exists idx_injuries_user_id on public.injuries_or_limitations(user_id);
create index if not exists idx_equipment_user_id on public.equipment_inventory(user_id);
create index if not exists idx_workout_plans_user_id on public.workout_plans(user_id);
create index if not exists idx_workout_days_user_id on public.workout_days(user_id);
create index if not exists idx_workout_logs_user_id_completed_at on public.workout_logs(user_id, completed_at desc);
create index if not exists idx_food_entries_user_id_logged_for_date on public.food_entries(user_id, logged_for_date desc);
create index if not exists idx_progress_metrics_user_id_metric_date on public.progress_metrics(user_id, metric_date desc);
create index if not exists idx_predictions_user_id_created_at on public.prediction_snapshots(user_id, created_at desc);
create index if not exists idx_wearables_user_id on public.wearable_integrations(user_id);
create index if not exists idx_body_scan_jobs_user_id on public.body_scan_jobs(user_id);

create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger set_goals_updated_at before update on public.goals for each row execute procedure public.set_updated_at();
create trigger set_injuries_updated_at before update on public.injuries_or_limitations for each row execute procedure public.set_updated_at();
create trigger set_equipment_updated_at before update on public.equipment_inventory for each row execute procedure public.set_updated_at();
create trigger set_workout_plans_updated_at before update on public.workout_plans for each row execute procedure public.set_updated_at();
create trigger set_workout_weeks_updated_at before update on public.workout_weeks for each row execute procedure public.set_updated_at();
create trigger set_workout_days_updated_at before update on public.workout_days for each row execute procedure public.set_updated_at();
create trigger set_exercises_updated_at before update on public.exercises for each row execute procedure public.set_updated_at();
create trigger set_substitutions_updated_at before update on public.exercise_substitutions for each row execute procedure public.set_updated_at();
create trigger set_workout_logs_updated_at before update on public.workout_logs for each row execute procedure public.set_updated_at();
create trigger set_nutrition_targets_updated_at before update on public.nutrition_targets for each row execute procedure public.set_updated_at();
create trigger set_foods_updated_at before update on public.foods for each row execute procedure public.set_updated_at();
create trigger set_food_entries_updated_at before update on public.food_entries for each row execute procedure public.set_updated_at();
create trigger set_meal_suggestions_updated_at before update on public.meal_suggestions for each row execute procedure public.set_updated_at();
create trigger set_grocery_lists_updated_at before update on public.grocery_lists for each row execute procedure public.set_updated_at();
create trigger set_grocery_items_updated_at before update on public.grocery_list_items for each row execute procedure public.set_updated_at();
create trigger set_progress_metrics_updated_at before update on public.progress_metrics for each row execute procedure public.set_updated_at();
create trigger set_prediction_snapshots_updated_at before update on public.prediction_snapshots for each row execute procedure public.set_updated_at();
create trigger set_wearable_integrations_updated_at before update on public.wearable_integrations for each row execute procedure public.set_updated_at();
create trigger set_body_scan_jobs_updated_at before update on public.body_scan_jobs for each row execute procedure public.set_updated_at();
create trigger set_body_scan_results_updated_at before update on public.body_scan_results for each row execute procedure public.set_updated_at();
create trigger set_app_settings_updated_at before update on public.app_settings for each row execute procedure public.set_updated_at();
create trigger set_users_updated_at before update on public.users for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.injuries_or_limitations enable row level security;
alter table public.equipment_inventory enable row level security;
alter table public.workout_plans enable row level security;
alter table public.workout_weeks enable row level security;
alter table public.workout_days enable row level security;
alter table public.workout_logs enable row level security;
alter table public.nutrition_targets enable row level security;
alter table public.foods enable row level security;
alter table public.food_entries enable row level security;
alter table public.meal_suggestions enable row level security;
alter table public.grocery_lists enable row level security;
alter table public.grocery_list_items enable row level security;
alter table public.progress_metrics enable row level security;
alter table public.prediction_snapshots enable row level security;
alter table public.wearable_integrations enable row level security;
alter table public.body_scan_jobs enable row level security;
alter table public.body_scan_results enable row level security;
alter table public.app_settings enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_substitutions enable row level security;

create policy "users self access" on public.users using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles self access" on public.profiles using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "goals self access" on public.goals using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "injuries self access" on public.injuries_or_limitations using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "equipment self access" on public.equipment_inventory using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "workout plans self access" on public.workout_plans using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "workout weeks self access" on public.workout_weeks using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "workout days self access" on public.workout_days using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "workout logs self access" on public.workout_logs using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "nutrition targets self access" on public.nutrition_targets using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "foods public read or owner write" on public.foods using (user_id is null or user_id = auth.uid()) with check (user_id = auth.uid() or user_id is null);
create policy "food entries self access" on public.food_entries using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meal suggestions self access" on public.meal_suggestions using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "grocery lists self access" on public.grocery_lists using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "grocery items via list owner" on public.grocery_list_items using (
  exists (
    select 1 from public.grocery_lists gl where gl.id = grocery_list_id and gl.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.grocery_lists gl where gl.id = grocery_list_id and gl.user_id = auth.uid()
  )
);
create policy "progress self access" on public.progress_metrics using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "predictions self access" on public.prediction_snapshots using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "wearables self access" on public.wearable_integrations using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "body scan jobs self access" on public.body_scan_jobs using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "body scan results self access" on public.body_scan_results using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "app settings self access" on public.app_settings using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "exercises public read" on public.exercises for select using (true);
create policy "exercise substitutions public read" on public.exercise_substitutions for select using (true);
