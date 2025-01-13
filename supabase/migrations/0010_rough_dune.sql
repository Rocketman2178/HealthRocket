-- Create test user data
DO $$ 
BEGIN
  -- Only insert if user doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM public.users WHERE id = '676c3382-1fef-404a-90aa-565da369995f'
  ) THEN
    INSERT INTO public.users (
      id,
      email,
      name,
      plan,
      level,
      fuel_points,
      burn_streak,
      health_score,
      healthspan_years,
      lifespan,
      healthspan,
      onboarding_completed
    ) VALUES (
      '676c3382-1fef-404a-90aa-565da369995f',
      '51@gmail.com',
      'Test User',
      'Pro Plan',
      3,
      1250,
      14,
      7.8,
      2.5,
      85,
      75,
      true
    );

    -- Insert initial health assessment
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
      biohacking_score
    ) VALUES (
      '676c3382-1fef-404a-90aa-565da369995f',
      85,
      75,
      7.8,
      0,
      75,
      8.2,
      7.5,
      8.0,
      7.2,
      7.8
    );
  END IF;
END $$;