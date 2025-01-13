-- Create test users and add them to Gobundance Elite & Champions
DO $$ 
DECLARE
  v_community_id uuid;
  v_user_id uuid;
  v_lifespan integer;
  v_healthspan integer;
  v_mindset_score numeric;
  v_sleep_score numeric;
  v_exercise_score numeric;
  v_nutrition_score numeric;
  v_biohacking_score numeric;
  v_health_score numeric;
BEGIN
  -- Get community ID for Gobundance Elite & Champions
  SELECT id INTO v_community_id
  FROM public.communities
  WHERE name = 'Gobundance Elite & Champion';

  -- Create 5 test users
  FOR i IN 1..5 LOOP
    -- Generate random scores
    v_lifespan := floor(random() * (110 - 95 + 1) + 95);
    v_healthspan := floor(random() * (90 - 80 + 1) + 80);
    v_mindset_score := round((random() * (9.5 - 7.5) + 7.5)::numeric, 1);
    v_sleep_score := round((random() * (9.5 - 7.5) + 7.5)::numeric, 1);
    v_exercise_score := round((random() * (9.5 - 7.5) + 7.5)::numeric, 1);
    v_nutrition_score := round((random() * (9.5 - 7.5) + 7.5)::numeric, 1);
    v_biohacking_score := round((random() * (9.5 - 7.5) + 7.5)::numeric, 1);
    
    -- Calculate average health score
    v_health_score := round((v_mindset_score + v_sleep_score + v_exercise_score + v_nutrition_score + v_biohacking_score) / 5, 1);

    -- Create user profile
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
      onboarding_completed,
      initial_healthspan
    ) VALUES (
      gen_random_uuid(),
      'gb_test_' || i || '@healthrocket.test',
      'GB Test Player ' || i,
      'Pro Plan',
      floor(random() * 5 + 1),  -- Random level 1-5
      floor(random() * 2000),   -- Random FP 0-2000
      floor(random() * 30),     -- Random streak 0-30
      v_health_score,
      round((random() * 5)::numeric, 1),  -- Random healthspan years 0-5
      v_lifespan,
      v_healthspan,
      true,
      v_healthspan
    )
    RETURNING id INTO v_user_id;

    -- Create initial health assessment
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
      v_user_id,
      v_lifespan,
      v_healthspan,
      v_health_score,
      0,
      v_healthspan,
      v_mindset_score,
      v_sleep_score,
      v_exercise_score,
      v_nutrition_score,
      v_biohacking_score,
      now() - interval '30 days'
    );

    -- Add to Gobundance Elite & Champions community
    INSERT INTO public.community_memberships (
      user_id,
      community_id,
      is_primary,
      settings
    ) VALUES (
      v_user_id,
      v_community_id,
      true,
      jsonb_build_object('role', 'member')
    );

    -- Update community member count
    UPDATE public.communities
    SET member_count = member_count + 1
    WHERE id = v_community_id;

  END LOOP;
END $$;