-- Add new columns to existing users table
alter table public.users 
  add column if not exists level integer default 1,
  add column if not exists fuel_points integer default 0,
  add column if not exists burn_streak integer default 0,
  add column if not exists health_score numeric(4,2) default 0,
  add column if not exists healthspan_years numeric(4,2) default 0,
  add column if not exists lifespan integer default 85,
  add column if not exists healthspan integer default 75,
  add column if not exists onboarding_completed boolean default false;

-- Create category scores table for tracking health metrics
create table if not exists public.category_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  mindset_score numeric(4,2) default 5,
  sleep_score numeric(4,2) default 5,
  exercise_score numeric(4,2) default 5,
  nutrition_score numeric(4,2) default 5,
  biohacking_score numeric(4,2) default 5
);

-- Enable RLS
alter table public.category_scores enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own scores" on public.category_scores;
drop policy if exists "Users can insert own scores" on public.category_scores;

-- Create RLS policies
create policy "Users can view own scores"
  on public.category_scores for select
  using ( auth.uid() = user_id );

create policy "Users can insert own scores"
  on public.category_scores for insert
  with check ( auth.uid() = user_id );

-- Create health assessments table for tracking periodic updates
create table if not exists public.health_assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expected_lifespan integer not null,
  expected_healthspan integer not null,
  health_score numeric(4,2) not null,
  healthspan_years numeric(4,2) not null,
  mindset_score numeric(4,2) not null,
  sleep_score numeric(4,2) not null,
  exercise_score numeric(4,2) not null,
  nutrition_score numeric(4,2) not null,
  biohacking_score numeric(4,2) not null
);

-- Enable RLS
alter table public.health_assessments enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own assessments" on public.health_assessments;
drop policy if exists "Users can insert own assessments" on public.health_assessments;

-- Create RLS policies
create policy "Users can view own assessments"
  on public.health_assessments for select
  using ( auth.uid() = user_id );

create policy "Users can insert own assessments"
  on public.health_assessments for insert
  with check ( auth.uid() = user_id );

-- Create completed boosts table
create table if not exists public.completed_boosts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  boost_id text not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_date date default current_date not null
);

-- Add unique constraint on user, boost, and date
alter table public.completed_boosts
  add constraint unique_daily_boost unique (user_id, boost_id, completed_date);

-- Enable RLS
alter table public.completed_boosts enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own completed boosts" on public.completed_boosts;
drop policy if exists "Users can insert own completed boosts" on public.completed_boosts;

-- Create RLS policies
create policy "Users can view own completed boosts"
  on public.completed_boosts for select
  using ( auth.uid() = user_id );

create policy "Users can insert own completed boosts"
  on public.completed_boosts for insert
  with check ( auth.uid() = user_id );

-- Create challenges table
create table if not exists public.challenges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  challenge_id text not null,
  status text not null,
  progress numeric(5,2) default 0,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Enable RLS
alter table public.challenges enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own challenges" on public.challenges;
drop policy if exists "Users can insert own challenges" on public.challenges;
drop policy if exists "Users can update own challenges" on public.challenges;

-- Create RLS policies
create policy "Users can view own challenges"
  on public.challenges for select
  using ( auth.uid() = user_id );

create policy "Users can insert own challenges"
  on public.challenges for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own challenges"
  on public.challenges for update
  using ( auth.uid() = user_id );