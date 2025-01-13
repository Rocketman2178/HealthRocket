/*
  # Fix RLS policies and function security

  1. Changes
    - Add SECURITY DEFINER to complete_onboarding function
    - Add RLS policies for UPDATE on tables
    - Fix policy naming conflicts
    - Ensure proper transaction handling

  2. Security
    - Enable RLS on all tables
    - Add proper policies for all operations
    - Ensure function has necessary permissions
*/

-- Drop and recreate function with SECURITY DEFINER
DROP FUNCTION IF EXISTS complete_onboarding;

CREATE OR REPLACE FUNCTION complete_onboarding(
  p_user_id uuid,
  p_expected_lifespan integer,
  p_expected_healthspan integer,
  p_health_score numeric,
  p_mindset_score numeric,
  p_sleep_score numeric,
  p_exercise_score numeric,
  p_nutrition_score numeric,
  p_biohacking_score numeric,
  p_created_at timestamptz
) RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  -- Verify user permissions
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Start transaction
  BEGIN
    -- Update user profile
    UPDATE public.users SET
      lifespan = p_expected_lifespan,
      healthspan = p_expected_healthspan,
      healthspan_years = 0,
      health_score = p_health_score,
      onboarding_completed = true
    WHERE id = p_user_id;

    -- Insert health assessment
    INSERT INTO public.health_assessments (
      user_id,
      expected_lifespan,
      expected_healthspan,
      health_score,
      healthspan_years,
      previous_healthspan,
      mindset_score,
      sleep_score,
      exercise_score,
      nutrition_score,
      biohacking_score,
      created_at
    ) VALUES (
      p_user_id,
      p_expected_lifespan,
      p_expected_healthspan,
      p_health_score,
      0,
      p_expected_healthspan,
      p_mindset_score,
      p_sleep_score,
      p_exercise_score,
      p_nutrition_score,
      p_biohacking_score,
      p_created_at
    );

    -- Insert category scores
    INSERT INTO public.category_scores (
      user_id,
      mindset_score,
      sleep_score,
      exercise_score,
      nutrition_score,
      biohacking_score,
      created_at
    ) VALUES (
      p_user_id,
      p_mindset_score,
      p_sleep_score,
      p_exercise_score,
      p_nutrition_score,
      p_biohacking_score,
      p_created_at
    );

    -- Commit transaction
    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback on error
      ROLLBACK;
      RAISE;
  END;
END;
$$;

-- Safely handle policies
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view own assessments" ON public.health_assessments;
    DROP POLICY IF EXISTS "Users can insert own assessments" ON public.health_assessments;
    DROP POLICY IF EXISTS "Users can update own assessments" ON public.health_assessments;
    DROP POLICY IF EXISTS "Users can view own scores" ON public.category_scores;
    DROP POLICY IF EXISTS "Users can insert own scores" ON public.category_scores;
    DROP POLICY IF EXISTS "Users can update own scores" ON public.category_scores;

    -- Create new policies
    CREATE POLICY "health_assessments_select" ON public.health_assessments 
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "health_assessments_insert" ON public.health_assessments 
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "health_assessments_update" ON public.health_assessments 
      FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "category_scores_select" ON public.category_scores 
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "category_scores_insert" ON public.category_scores 
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "category_scores_update" ON public.category_scores 
      FOR UPDATE USING (auth.uid() = user_id);
END $$;