-- Reset data for Clay Speakman (91@gmail.com)
DO $$ 
BEGIN
  -- Get user ID
  WITH user_id AS (
    SELECT id FROM auth.users WHERE email = '91@gmail.com'
  )
  
  -- Delete all user data
  DELETE FROM public.challenges WHERE user_id = (SELECT id FROM user_id);
  DELETE FROM public.quests WHERE user_id = (SELECT id FROM user_id);
  DELETE FROM public.completed_boosts WHERE user_id = (SELECT id FROM user_id);
  DELETE FROM public.completed_boosts WHERE user_id = (SELECT id FROM user_id);
  DELETE FROM public.completed_quests WHERE user_id = (SELECT id FROM user_id);
  DELETE FROM public.completed_challenges WHERE user_id = (SELECT id FROM user_id);
  DELETE FROM public.daily_fp WHERE user_id = (SELECT id FROM user_id);
  DELETE FROM public.player_status_history WHERE user_id = (SELECT id FROM user_id);
  DELETE FROM public.category_scores WHERE user_id = (SELECT id FROM user_id);
  DELETE FROM public.health_assessments WHERE user_id = (SELECT id FROM user_id);
  
  -- Reset user stats
  UPDATE public.users 
  SET 
    level = 1,
    fuel_points = 0,
    burn_streak = 0,
    health_score = 7.8,
    healthspan_years = 2.5,
    lifespan = 85,
    healthspan = 75,
    onboarding_completed = true
  WHERE id = (SELECT id FROM user_id);

  -- Insert initial category scores
  INSERT INTO public.category_scores (
    user_id,
    mindset_score,
    sleep_score,
    exercise_score,
    nutrition_score,
    biohacking_score
  )
  SELECT 
    id,
    8.2,
    7.5,
    8.0,
    7.2,
    7.8
  FROM user_id
  WHERE NOT EXISTS (
    SELECT 1 FROM public.category_scores 
    WHERE user_id = (SELECT id FROM user_id)
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
  )
  SELECT
    id,
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
  FROM user_id
  WHERE NOT EXISTS (
    SELECT 1 FROM public.health_assessments 
    WHERE user_id = (SELECT id FROM user_id)
  );

END $$;