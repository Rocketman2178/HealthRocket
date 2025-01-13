/*
  # Remove minimum FP bonus for health assessments

  1. Changes
    - Updates health assessment function to remove minimum FP bonus
    - Calculates bonus as exactly 10% of next level points
*/

-- Update function to remove minimum FP bonus
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
DECLARE
  v_level integer;
  v_next_level_points integer;
  v_fp_bonus integer;
  v_today date;
BEGIN
  -- Verify user permissions
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Get user's current level
  SELECT level INTO v_level
  FROM users
  WHERE id = p_user_id;

  -- Calculate next level points (same formula as in utils.ts)
  v_next_level_points := round(20 * power(1.41, v_level - 1));
  
  -- Calculate FP bonus (exactly 10% of next level points)
  v_fp_bonus := round(v_next_level_points * 0.1);
  
  v_today := CURRENT_DATE;

  -- Update user profile with latest scores and add FP bonus
  UPDATE users SET
    lifespan = p_expected_lifespan,
    healthspan = p_expected_healthspan,
    health_score = p_health_score,
    fuel_points = fuel_points + v_fp_bonus
  WHERE id = p_user_id;

  -- Insert health assessment
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
    0,
    p_expected_healthspan,
    p_mindset_score,
    p_sleep_score,
    p_exercise_score,
    p_nutrition_score,
    p_biohacking_score,
    p_created_at
  );

  -- Update or insert daily FP record with health assessment bonus
  INSERT INTO daily_fp (
    user_id,
    date,
    fp_earned,
    health_assessment_bonus
  ) VALUES (
    p_user_id,
    v_today,
    COALESCE((SELECT fp_earned FROM daily_fp WHERE user_id = p_user_id AND date = v_today), 0) + v_fp_bonus,
    v_fp_bonus
  )
  ON CONFLICT (user_id, date) 
  DO UPDATE SET
    fp_earned = daily_fp.fp_earned + v_fp_bonus,
    health_assessment_bonus = v_fp_bonus;

END;
$$;