-- Insert test user
-- Insert user profile
insert into public.users (
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
  onboarding_completed
) values (
  (select id from auth.users where email = '71@gmail.com'),
  '71@gmail.com',
  'Clay Speakman',
  'Pro Plan',
  3,
  1250,
  14,
  7.8,
  2.5,
  85,
  75,
  true
);

-- Insert initial health assessment
insert into public.health_assessments (
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
) values (
  (select id from auth.users where email = '71@gmail.com'),
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
);

-- Insert category scores
insert into public.category_scores (
  user_id,
  mindset_score,
  sleep_score,
  exercise_score,
  nutrition_score,
  biohacking_score
) values (
  (select id from auth.users where email = '71@gmail.com'),
  8.2,
  7.5,
  8.0,
  7.2,
  7.8
);

-- Insert active challenges
insert into public.challenges (
  user_id,
  challenge_id,
  status,
  progress,
  started_at
) values 
  (
    (select id from auth.users where email = '71@gmail.com'),
    'sc1',
    'active',
    45.5,
    now() - interval '10 days'
  ),
  (
    (select id from auth.users where email = '71@gmail.com'),
    'mc1',
    'active',
    33.3,
    now() - interval '5 days'
  );

-- Insert completed boosts for the last few days
insert into public.completed_boosts (
  user_id,
  boost_id,
  completed_at
) values 
  (
    (select id from auth.users where email = '71@gmail.com'),
    'mindset-1',
    now()
  ),
  (
    (select id from auth.users where email = '71@gmail.com'),
    'sleep-2',
    now()
  ),
  (
    (select id from auth.users where email = '71@gmail.com'),
    'exercise-1',
    now() - interval '1 day'
  ),
  (
    (select id from auth.users where email = '71@gmail.com'),
    'nutrition-2',
    now() - interval '1 day'
  );

-- Insert active quest
insert into public.quests (
  user_id,
  quest_id,
  status,
  progress,
  started_at,
  daily_boosts_completed
) values (
  (select id from auth.users where email = '71@gmail.com'),
  'sq1',
  'active',
  35.0,
  now() - interval '15 days',
  22
);

-- Insert player status history
insert into public.player_status_history (
  user_id,
  status,
  started_at,
  average_fp,
  percentile
) values (
  (select id from auth.users where email = '71@gmail.com'),
  'Hero',
  now() - interval '30 days',
  42.5,
  85.5
);

-- Insert daily FP records
insert into public.daily_fp (
  user_id,
  date,
  fp_earned,
  boosts_completed,
  challenges_completed,
  quests_completed
) values 
  (
    (select id from auth.users where email = '71@gmail.com'),
    current_date,
    45,
    3,
    0,
    0
  ),
  (
    (select id from auth.users where email = '71@gmail.com'),
    current_date - 1,
    38,
    2,
    1,
    0
  );