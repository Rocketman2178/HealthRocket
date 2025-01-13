-- Create completed quests table
create table if not exists public.completed_quests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  quest_id text not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  fp_earned integer not null default 0,
  challenges_completed integer not null default 0,
  boosts_completed integer not null default 0
);

-- Enable RLS
alter table public.completed_quests enable row level security;

-- Safely handle policies
do $$ 
begin
  -- Drop existing policies if they exist
  if exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'completed_quests'
  ) then
    drop policy if exists "Users can view own completed quests" on public.completed_quests;
    drop policy if exists "Users can insert own completed quests" on public.completed_quests;
  end if;
end $$;

-- Create policies
create policy "Users can view own completed quests"
  on public.completed_quests for select
  using ( auth.uid() = user_id );

create policy "Users can insert own completed quests"
  on public.completed_quests for insert
  with check ( auth.uid() = user_id );

-- Create completed challenges table
create table if not exists public.completed_challenges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  challenge_id text not null,
  quest_id text,  -- Optional reference to parent quest
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  fp_earned integer not null default 0,
  days_to_complete integer not null,
  final_progress numeric(5,2) not null
);

-- Enable RLS
alter table public.completed_challenges enable row level security;

-- Safely handle policies
do $$ 
begin
  -- Drop existing policies if they exist
  if exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'completed_challenges'
  ) then
    drop policy if exists "Users can view own completed challenges" on public.completed_challenges;
    drop policy if exists "Users can insert own completed challenges" on public.completed_challenges;
  end if;
end $$;

-- Create policies
create policy "Users can view own completed challenges"
  on public.completed_challenges for select
  using ( auth.uid() = user_id );

create policy "Users can insert own completed challenges"
  on public.completed_challenges for insert
  with check ( auth.uid() = user_id );

-- Add completion tracking to existing tables
alter table public.quests
  add column if not exists challenges_required integer not null default 2,
  add column if not exists challenges_completed integer not null default 0,
  add column if not exists boosts_required integer not null default 45,
  add column if not exists fp_reward integer not null default 150;

alter table public.challenges
  add column if not exists fp_reward integer not null default 50;