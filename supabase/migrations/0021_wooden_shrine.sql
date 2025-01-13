-- Create test user with initial health assessment from November 20, 2024
DO $$ 
BEGIN
  -- Insert user profile if it doesn't exist
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
    '676c3382-1fef-404a-90aa-565da369995f',  -- Test user ID
    'test@gmail.com',
    'Test User1',
    'Pro Plan',
    1,
    0,
    0,
    7.5,
    0,
    100,
    90,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    name = 'Test User1',
    lifespan = 100,
    healthspan = 90,
    health_score = 7.5,
    onboarding_completed = true;

  -- Insert initial health assessment from November 20, 2024
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
    100,
    90,
    7.5,
    0,
    90,
    7.5,
    7.5,
    7.5,
    7.5,
    7.5,
    '2024-11-20 12:00:00Z'  -- Set to November 20, 2024
  )
  ON CONFLICT DO NOTHING;

END $$;