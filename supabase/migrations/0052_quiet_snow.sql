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
  v_password_hash text;
BEGIN
  -- Get community ID for Gobundance Elite & Champions
  SELECT id INTO v_community_id
  FROM public.communities
  WHERE name = 'Gobundance Elite & Champion';

  -- Set password hash for 'test123456'
  v_password_hash := '$2a$10$RgZJ1LdHVU5p.qVAxfh9NeU2PlGzHuGRv4iQxhm8W5zAjHGGl3ILi';

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

    -- Generate UUID for new user
    v_user_id := gen_random_uuid();

    -- Create auth user
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      invited_at,
      confirmation_token,
      confirmation_sent_at,
      recovery_token,
      recovery_sent_at,
      email_change_token_new,
      email_change,
      email_change_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      phone,
      phone_confirmed_at,
      phone_change,
      phone_change_token,
      phone_change_sent_at,
      confirmed_at,
      email_change_token_current,
      email_change_confirm_status,
      banned_until,
      reauthentication_token,
      reauthentication_sent_at,
      is_sso_user,
      deleted_at
    ) VALUES (
      v_user_id,                                    -- id
      '00000000-0000-0000-0000-000000000000',      -- instance_id
      'gb_test_' || i || '@healthrocket.test',     -- email
      v_password_hash,                             -- encrypted_password
      now(),                                       -- email_confirmed_at
      null,                                        -- invited_at
      '',                                          -- confirmation_token
      now(),                                       -- confirmation_sent_at
      '',                                          -- recovery_token
      null,                                        -- recovery_sent_at
      '',                                          -- email_change_token_new
      '',                                          -- email_change
      null,                                        -- email_change_sent_at
      null,                                        -- last_sign_in_at
      '{"provider": "email", "providers": ["email"]}',  -- raw_app_meta_data
      jsonb_build_object('name', 'GB Test Player ' || i),    -- raw_user_meta_data
      false,                                       -- is_super_admin
      now(),                                       -- created_at
      now(),                                       -- updated_at
      null,                                        -- phone
      null,                                        -- phone_confirmed_at
      '',                                          -- phone_change
      '',                                          -- phone_change_token
      null,                                        -- phone_change_sent_at
      now(),                                       -- confirmed_at
      '',                                          -- email_change_token_current
      0,                                          -- email_change_confirm_status
      null,                                        -- banned_until
      '',                                          -- reauthentication_token
      null,                                        -- reauthentication_sent_at
      false,                                       -- is_sso_user
      null                                         -- deleted_at
    );

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
      v_user_id,
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