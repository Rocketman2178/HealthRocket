-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  email text NOT NULL,
  name text,
  plan text DEFAULT 'Free Plan'::text,
  level integer DEFAULT 1,
  fuel_points integer DEFAULT 0,
  burn_streak integer DEFAULT 0,
  health_score numeric(4,2) DEFAULT 7.8,
  healthspan_years numeric(4,2) DEFAULT 0,
  lifespan integer DEFAULT 85,
  healthspan integer DEFAULT 75,
  onboarding_completed boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);