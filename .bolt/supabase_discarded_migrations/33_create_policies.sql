-- Create policies after tables exist
DO $$ 
BEGIN
    -- Users policies
    DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

    CREATE POLICY "Users can view own profile"
        ON public.users FOR SELECT
        USING (auth.uid() = id);

    CREATE POLICY "Users can update own profile"
        ON public.users FOR UPDATE
        USING (auth.uid() = id);

    CREATE POLICY "Users can insert own profile"
        ON public.users FOR INSERT
        WITH CHECK (auth.uid() = id);

    -- Health assessments policies
    DROP POLICY IF EXISTS "Users can view own assessments" ON public.health_assessments;
    DROP POLICY IF EXISTS "Users can insert own assessments" ON public.health_assessments;

    CREATE POLICY "Users can view own assessments"
        ON public.health_assessments FOR SELECT
        USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own assessments"
        ON public.health_assessments FOR INSERT
        WITH CHECK (auth.uid() = user_id);

    -- Category scores policies
    DROP POLICY IF EXISTS "Users can view own scores" ON public.category_scores;
    DROP POLICY IF EXISTS "Users can insert own scores" ON public.category_scores;

    CREATE POLICY "Users can view own scores"
        ON public.category_scores FOR SELECT
        USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own scores"
        ON public.category_scores FOR INSERT
        WITH CHECK (auth.uid() = user_id);

END $$;