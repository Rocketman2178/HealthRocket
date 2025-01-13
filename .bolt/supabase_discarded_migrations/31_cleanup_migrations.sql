-- Clean up duplicate migrations
DO $$ 
BEGIN
    -- Drop any duplicate tables
    DROP TABLE IF EXISTS public.health_assessments CASCADE;
    DROP TABLE IF EXISTS public.category_scores CASCADE;

    -- Recreate tables with proper schema
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

    -- Enable RLS
    ALTER TABLE public.health_assessments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.category_scores ENABLE ROW LEVEL SECURITY;
END $$;