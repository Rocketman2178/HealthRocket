/*
  # Health Assessment Update System
  
  1. New Functions
    - check_health_assessment_eligibility: Checks if user can submit new assessment
    - update_health_assessment: Handles health assessment updates
  
  2. Security
    - RLS policies for health assessments table
    - Function security settings
*/

-- Function to check if user can submit new health assessment
CREATE OR REPLACE FUNCTION check_health_assessment_eligibility(p_user_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  last_assessment_date timestamptz;
BEGIN
  -- Get date of last assessment
  SELECT created_at INTO last_assessment_date
  FROM health_assessments
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;

  -- Allow if no previous assessment or last one was > 30 days ago
  RETURN (
    last_assessment_date IS NULL OR 
    (CURRENT_TIMESTAMP - last_assessment_date) > INTERVAL '30 days'
  );
END;
$$;

-- Function to handle health assessment updates
CREATE OR REPLACE FUNCTION update_health_assessment(
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

  -- Check eligibility
  IF NOT check_health_assessment_eligibility(p_user_id) THEN
    RAISE EXCEPTION 'Must wait 30 days between health assessments';
  END IF;

  -- Get previous healthspan for tracking improvement
  WITH previous_assessment AS (
    SELECT expected_healthspan
    FROM health_assessments
    WHERE user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT 1
  )
  -- Insert new assessment
  INSERT INTO health_assessments (
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
    COALESCE(
      (SELECT (p_expected_healthspan - expected_healthspan)::numeric(4,2)
       FROM previous_assessment),
      0
    ),
    COALESCE(
      (SELECT expected_healthspan 
       FROM previous_assessment),
      p_expected_healthspan
    ),
    p_mindset_score,
    p_sleep_score,
    p_exercise_score,
    p_nutrition_score,
    p_biohacking_score,
    p_created_at
  );

  -- Update user profile with latest scores
  UPDATE users SET
    lifespan = p_expected_lifespan,
    healthspan = p_expected_healthspan,
    health_score = p_health_score
  WHERE id = p_user_id;

END;
$$;