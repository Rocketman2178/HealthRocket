/*
  # Add Onboarding Transaction Function
  
  Creates a stored procedure to handle onboarding completion in a single transaction.
  This ensures data consistency across all tables during onboarding.
*/

-- Create function to handle onboarding completion in a transaction
CREATE OR REPLACE FUNCTION complete_onboarding(
  user_id uuid,
  expected_lifespan integer,
  expected_healthspan integer,
  health_score numeric,
  mindset_score numeric,
  sleep_score numeric,
  exercise_score numeric,
  nutrition_score numeric,
  biohacking_score numeric,
  created_at timestamptz
) RETURNS void AS $$
BEGIN
  -- Update user profile
  UPDATE public.users SET
    lifespan = expected_lifespan,
    healthspan = expected_healthspan,
    healthspan_years = 0,
    health_score = health_score,
    onboarding_completed = true
  WHERE id = user_id;

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
    user_id,
    expected_lifespan,
    expected_healthspan,
    health_score,
    0,
    expected_healthspan,
    mindset_score,
    sleep_score,
    exercise_score,
    nutrition_score,
    biohacking_score,
    created_at
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
    user_id,
    mindset_score,
    sleep_score,
    exercise_score,
    nutrition_score,
    biohacking_score,
    created_at
  );
END;
$$ LANGUAGE plpgsql;