-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  name text,
  plan text default 'Free Plan'::text,
  level integer default 1,
  fuel_points integer default 0,
  burn_streak integer default 0,
  health_score numeric(4,2) default 0,
  healthspan_years numeric(4,2) default 0,
  onboarding_completed boolean default false
);

-- Create quests table
CREATE TABLE IF NOT EXISTS public.quests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  quest_id text not null,
  status text not null,
  progress numeric(5,2) default 0,
  challenges_completed integer default 0,
  boosts_completed integer default 0,
  fp_reward integer not null default 0,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Create completed_boosts table
CREATE TABLE IF NOT EXISTS public.completed_boosts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  boost_id text not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_date date default current_date not null,
  CONSTRAINT unique_daily_boost UNIQUE (user_id, boost_id, completed_date)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_boosts ENABLE ROW LEVEL SECURITY;

-- Safely handle policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
  DROP POLICY IF EXISTS "Users can view own quests" ON public.quests;
  DROP POLICY IF EXISTS "Users can insert own quests" ON public.quests;
  DROP POLICY IF EXISTS "Users can update own quests" ON public.quests;
  DROP POLICY IF EXISTS "Users can view own completed boosts" ON public.completed_boosts;
  DROP POLICY IF EXISTS "Users can insert own completed boosts" ON public.completed_boosts;
END $$;

-- Create new policies
CREATE POLICY "Users can view own profile" ON public.users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own quests" ON public.quests 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quests" ON public.quests 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quests" ON public.quests 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own completed boosts" ON public.completed_boosts 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed boosts" ON public.completed_boosts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);