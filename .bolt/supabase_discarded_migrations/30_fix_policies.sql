-- Safely drop and recreate policies
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