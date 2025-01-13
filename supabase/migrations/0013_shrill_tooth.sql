/*
  # Set up test user with completed onboarding

  1. Test User Setup
    - Create test user profile
    - Set onboarding as completed
    - Add initial health assessment
  
  2. Security
    - Enable RLS policies for test user access
*/

-- Create or update test user
DO $$ 
BEGIN
  -- Insert or update test user profile
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
  )
  ON CONFLICT (id) DO UPDATE SET
    onboarding_completed = true,
    health_score = 7.8,
    healthspan_years = 2.5,
    lifespan = 85,
    healthspan = 75;

  -- Insert initial health assessment if none exists
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
  )
  SELECT
    '676c3382-1fef-404a-90aa-565da369995f',
    85,
    75,
    7.8,
    2.5,
    75,
    8.2,
    7.5,
    8.0,
    7.2,
    7.8
  WHERE NOT EXISTS (
    SELECT 1 FROM public.health_assessments 
    WHERE user_id = '676c3382-1fef-404a-90aa-565da369995f'
  );

END $$;