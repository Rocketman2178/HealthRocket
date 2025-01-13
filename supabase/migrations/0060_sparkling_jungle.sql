-- Create Business Network 1 community
INSERT INTO public.communities (
  name,
  description,
  settings,
  is_active
) VALUES (
  'Business Network 1',
  'A community of business leaders focused on optimizing health and performance.',
  jsonb_build_object(
    'features', jsonb_build_object(
      'leaderboard', true,
      'challenges', true,
      'quests', true,
      'prizes', true
    ),
    'privacy', jsonb_build_object(
      'memberListVisibility', 'members',
      'activityVisibility', 'members'
    )
  ),
  true
);

-- Create multi-use invite code for the community
INSERT INTO public.invite_codes (
  code,
  community_id,
  type,
  is_active
)
SELECT 
  'BN2025',
  id,
  'multi_use',
  true
FROM public.communities
WHERE name = 'Business Network 1';

-- Create test users and add them to Business Network 1
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
  v_password_hash text;
BEGIN
  -- Get community ID
  SELECT id INTO v_community_id
  FROM public.communities
  WHERE name = 'Business Network 1';

  -- Set password hash for 'test123456'
  v_password_hash := '$2a$10$RgZJ1LdHVU5p.qVAxfh9NeU2PlGzHuGRv4iQxhm8W5zAjHGGl3ILi';

  -- Create 3 test users
  FOR i IN 1..3 LOOP
    -- Generate random scores with higher variance
    v_lifespan := floor(random() * (110 - 85 + 1) + 85);
    v_healthspan := floor(random() * (95 - 75 + 1) + 75);
    v_mindset_score := round((random() * (9.8 - 6.5) + 6.5)::numeric, 1);
    v_sleep_score := round((random() * (9.8 - 6.5) + 6.5)::numeric, 1);
    v_exercise_score := round((random() * (9.8 - 6.5) + 6.5)::numeric, 1);
    v_nutrition_score := round((random() * (9.8 - 6.5) + 6.5)::numeric, 1);
    v_biohacking_score := round((random() * (9.8 - 6.5) + 6.5)::numeric, 1);
    
    -- Calculate average health score
    v_health_score := round((v_mindset_score + v_sleep_score + v_exercise_score + v_nutrition_score + v_biohacking_score) / 5, 1);

    -- Generate UUID for new user
    v_user_id := gen_random_uuid();

    -- Create auth user
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'bn_test_' || i || '@healthrocket.test',
      v_password_hash,
      now(),
      '{"provider": "email", "providers": ["email"]}',
      jsonb_build_object('name', 'BN Test Player ' || i),
      now(),
      now()
    );

    -- Create user profile with varied stats
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
      v_user_id,
      'bn_test_' || i || '@healthrocket.test',
      'BN Test Player ' || i,
      'Pro Plan',
      floor(random() * 7 + 1),  -- Random level 1-8
      floor(random() * 3000),   -- Random FP 0-3000
      floor(random() * 45),     -- Random streak 0-45
      v_health_score,
      round((random() * 8)::numeric, 1),  -- Random healthspan years 0-8
      v_lifespan,
      v_healthspan,
      true,
      v_healthspan
    );

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

    -- Add to Business Network 1 community
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