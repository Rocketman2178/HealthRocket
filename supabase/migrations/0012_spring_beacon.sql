-- Update onboarding function to handle test user
CREATE OR REPLACE FUNCTION complete_onboarding(
  p_user_id uuid,
  p_test_user_id uuid,
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
  IF auth.uid() != p_user_id AND p_user_id != p_test_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

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

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to complete onboarding: %', SQLERRM;
END;
$$;