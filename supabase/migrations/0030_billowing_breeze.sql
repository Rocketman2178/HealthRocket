/*
  # Fix Test Users Creation

  1. Changes
    - Adds all required auth.users fields
    - Ensures proper UUID generation
    - Maintains consistent password hash
*/

DO $$ 
DECLARE
  v_password_hash text;
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
  -- Set password hash for 'test123456'
  v_password_hash := '$2a$10$RgZJ1LdHVU5p.qVAxfh9NeU2PlGzHuGRv4iQxhm8W5zAjHGGl3ILi';

  -- Create users 10-14
  FOR i IN 10..14 LOOP
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

    -- Create auth user if doesn't exist
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
      'test' || i || '@gmail.com',                 -- email
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
      jsonb_build_object('name', 'Test User ' || i),    -- raw_user_meta_data
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
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO v_user_id;

    -- If user already exists, get their ID
    IF v_user_id IS NULL THEN
      SELECT id INTO v_user_id 
      FROM auth.users 
      WHERE email = 'test' || i || '@gmail.com';
    END IF;

    -- Create or update user profile
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
      'test' || i || '@gmail.com',
      'Test User ' || i,
      'Pro Plan',
      1,
      0,
      0,
      v_health_score,
      0,
      v_lifespan,
      v_healthspan,
      true,
      v_healthspan
    )
    ON CONFLICT (id) DO UPDATE SET
      health_score = v_health_score,
      lifespan = v_lifespan,
      healthspan = v_healthspan,
      initial_healthspan = v_healthspan,
      onboarding_completed = true;

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

  END LOOP;
END $$;