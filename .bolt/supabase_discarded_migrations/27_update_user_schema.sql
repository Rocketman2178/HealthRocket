-- Add missing columns to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS lifespan integer DEFAULT 85,
  ADD COLUMN IF NOT EXISTS healthspan integer DEFAULT 75,
  ADD COLUMN IF NOT EXISTS healthspan_years numeric(4,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS health_score numeric(4,2) DEFAULT 7.8,
  ADD COLUMN IF NOT EXISTS level integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS fuel_points integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS burn_streak integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Create health assessments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.health_assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  expected_lifespan integer NOT NULL,
  expected_healthspan integer NOT NULL,
  health_score numeric(4,2) NOT NULL,
  healthspan_years numeric(4,2) NOT NULL,
  previous_healthspan integer,
  mindset_score numeric(4,2) NOT NULL,
  sleep_score numeric(4,2) NOT NULL,
  exercise_score numeric(4,2) NOT NULL,
  nutrition_score numeric(4,2) NOT NULL,
  biohacking_score numeric(4,2) NOT NULL
);

-- Enable RLS on health assessments
ALTER TABLE public.health_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for health assessments
CREATE POLICY "Users can view own assessments"
  ON public.health_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON public.health_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);