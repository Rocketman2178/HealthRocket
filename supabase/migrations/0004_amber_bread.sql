/*
  # Health Assessment and Category Score Tables

  1. Tables
    - health_assessments: Stores periodic health assessments
    - category_scores: Tracks scores across health categories
  
  2. Security
    - Enable RLS on both tables
    - Add policies for user data access
*/

-- Safely create health assessments table
CREATE TABLE IF NOT EXISTS public.health_assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  expected_lifespan integer NOT NULL,
  expected_healthspan integer NOT NULL,
  health_score numeric(4,2) NOT NULL,
  healthspan_years numeric(4,2) NOT NULL,
  previous_healthspan integer NOT NULL,
  mindset_score numeric(4,2) NOT NULL,
  sleep_score numeric(4,2) NOT NULL,
  exercise_score numeric(4,2) NOT NULL,
  nutrition_score numeric(4,2) NOT NULL,
  biohacking_score numeric(4,2) NOT NULL
);

-- Safely create category scores table
CREATE TABLE IF NOT EXISTS public.category_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  mindset_score numeric(4,2) DEFAULT 5,
  sleep_score numeric(4,2) DEFAULT 5,
  exercise_score numeric(4,2) DEFAULT 5,
  nutrition_score numeric(4,2) DEFAULT 5,
  biohacking_score numeric(4,2) DEFAULT 5
);

-- Enable RLS
ALTER TABLE public.health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_scores ENABLE ROW LEVEL SECURITY;

-- Safely handle policies
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view own assessments" ON public.health_assessments;
    DROP POLICY IF EXISTS "Users can insert own assessments" ON public.health_assessments;
    DROP POLICY IF EXISTS "Users can view own scores" ON public.category_scores;
    DROP POLICY IF EXISTS "Users can insert own scores" ON public.category_scores;

    -- Create policies only if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'health_assessments' 
        AND policyname = 'Users can view own assessments'
    ) THEN
        CREATE POLICY "Users can view own assessments"
            ON public.health_assessments FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'health_assessments' 
        AND policyname = 'Users can insert own assessments'
    ) THEN
        CREATE POLICY "Users can insert own assessments"
            ON public.health_assessments FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'category_scores' 
        AND policyname = 'Users can view own scores'
    ) THEN
        CREATE POLICY "Users can view own scores"
            ON public.category_scores FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'category_scores' 
        AND policyname = 'Users can insert own scores'
    ) THEN
        CREATE POLICY "Users can insert own scores"
            ON public.category_scores FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;