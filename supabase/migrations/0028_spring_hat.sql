/*
  # Create Test Users

  1. New Users
    - Creates 5 test users with randomized health metrics
    - Sets up initial health assessments for each user
    - Configures consistent test password

  2. Security
    - Uses secure password hashing
    - Maintains RLS policies
*/

-- Create test users with consistent password
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
  -- Get password hash for 'test123456'
  v_password_hash := '$$2a$10$RgZJ1LdHVU5p.qVAxfh9NeU2PlGzHuGRv4iQxhm8W5zAjHGGl3ILi';

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

    -- Create auth user if doesn't exist
    INSERT INTO auth.users (
      email,
      raw_user_meta_data,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_sent_at
    )
    SELECT 
      'test' || i || '@gmail.com',
      jsonb_build_object('name', 'Test User ' || i),
      v_password_hash,
      now(),
      now(),
      now(),
      now()
    WHERE NOT EXISTS (
      SELECT 1 FROM auth.users WHERE email = 'test' || i || '@gmail.com'
    )
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