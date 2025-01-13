-- Create base tables in correct order
DO $$ 
BEGIN
    -- Create users table first if it doesn't exist
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

    -- Enable RLS on users table
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

    -- Create health assessments table
    CREATE TABLE IF NOT EXISTS public.health_assessments (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
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

    -- Create category scores table
    CREATE TABLE IF NOT EXISTS public.category_scores (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        mindset_score numeric(4,2) NOT NULL,
        sleep_score numeric(4,2) NOT NULL,
        exercise_score numeric(4,2) NOT NULL,
        nutrition_score numeric(4,2) NOT NULL,
        biohacking_score numeric(4,2) NOT NULL
    );

    -- Enable RLS on category scores
    ALTER TABLE public.category_scores ENABLE ROW LEVEL SECURITY;

END $$;