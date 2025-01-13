-- Update Test User1's initial health assessment
DO $$ 
BEGIN
  -- Update user profile
  UPDATE public.users 
  SET 
    healthspan = 90,
    initial_healthspan = 90,
    onboarding_completed = true
  WHERE id = '676c3382-1fef-404a-90aa-565da369995f';  -- Test user ID

  -- Delete any existing health assessments
  DELETE FROM public.health_assessments 
  WHERE user_id = '676c3382-1fef-404a-90aa-565da369995f';

  -- Insert initial health assessment with healthspan of 90
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
    '676c3382-1fef-404a-90aa-565da369995f',  -- Test user ID
    100,  -- Expected lifespan
    90,   -- Initial healthspan of 90
    7.5,  -- Health score
    0,    -- Initial healthspan years (difference from baseline)
    90,   -- Previous healthspan (same as initial)
    7.5,  -- Category scores
    7.5,
    7.5,
    7.5,
    7.5,
    NOW() - INTERVAL '30 days'  -- Set to 30 days ago to allow immediate updates
  );

END $$;