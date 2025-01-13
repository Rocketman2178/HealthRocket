-- Create test user data for Clay Speakman (90@gmail.com)
-- Note: User must be created through Auth UI or API first

-- Only insert if user exists but doesn't have profile
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
) 
select
  (select id from auth.users where email = '90@gmail.com'),
  '90@gmail.com',
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
where exists (
  select 1 from auth.users where email = '90@gmail.com'
) and not exists (
  select 1 from public.users where email = '90@gmail.com'
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
)
select
  (select id from auth.users where email = '90@gmail.com'),
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
where exists (
  select 1 from public.users where email = '90@gmail.com'
) and not exists (
  select 1 from public.health_assessments 
  where user_id = (select id from auth.users where email = '90@gmail.com')
);

-- Insert category scores
insert into public.category_scores (
  user_id,
  mindset_score,
  sleep_score,
  exercise_score,
  nutrition_score,
  biohacking_score
)
select
  (select id from auth.users where email = '90@gmail.com'),
  8.2,
  7.5,
  8.0,
  7.2,
  7.8
where exists (
  select 1 from public.users where email = '90@gmail.com'
) and not exists (
  select 1 from public.category_scores 
  where user_id = (select id from auth.users where email = '90@gmail.com')
);

-- Insert active challenges
insert into public.challenges (
  user_id,
  challenge_id,
  status,
  progress,
  started_at
)
select * from (values
  (
    (select id from auth.users where email = '90@gmail.com'),
    'sc1',
    'active',
    45.5,
    now() - interval '10 days'
  ),
  (
    (select id from auth.users where email = '90@gmail.com'),
    'mc1',
    'active',
    33.3,
    now() - interval '5 days'
  )
) as v
where exists (
  select 1 from public.users where email = '90@gmail.com'
) and not exists (
  select 1 from public.challenges 
  where user_id = (select id from auth.users where email = '90@gmail.com')
);

-- Insert completed boosts
insert into public.completed_boosts (
  user_id,
  boost_id,
  completed_at
)
select * from (values
  (
    (select id from auth.users where email = '90@gmail.com'),
    'mindset-1',
    now()
  ),
  (
    (select id from auth.users where email = '90@gmail.com'),
    'sleep-2',
    now()
  ),
  (
    (select id from auth.users where email = '90@gmail.com'),
    'exercise-1',
    now() - interval '1 day'
  ),
  (
    (select id from auth.users where email = '90@gmail.com'),
    'nutrition-2',
    now() - interval '1 day'
  )
) as v
where exists (
  select 1 from public.users where email = '90@gmail.com'
) and not exists (
  select 1 from public.completed_boosts 
  where user_id = (select id from auth.users where email = '90@gmail.com')
);

-- Insert active quest
insert into public.quests (
  user_id,
  quest_id,
  status,
  progress,
  started_at,
  daily_boosts_completed
)
select
  (select id from auth.users where email = '90@gmail.com'),
  'sq1',
  'active',
  35.0,
  now() - interval '15 days',
  22
where exists (
  select 1 from public.users where email = '90@gmail.com'
) and not exists (
  select 1 from public.quests 
  where user_id = (select id from auth.users where email = '90@gmail.com')
);

-- Insert player status history
insert into public.player_status_history (
  user_id,
  status,
  started_at,
  average_fp,
  percentile
)
select
  (select id from auth.users where email = '90@gmail.com'),
  'Hero',
  now() - interval '30 days',
  42.5,
  85.5
where exists (
  select 1 from public.users where email = '90@gmail.com'
) and not exists (
  select 1 from public.player_status_history 
  where user_id = (select id from auth.users where email = '90@gmail.com')
);

-- Insert daily FP records
insert into public.daily_fp (
  user_id,
  date,
  fp_earned,
  boosts_completed,
  challenges_completed,
  quests_completed
)
select * from (values
  (
    (select id from auth.users where email = '90@gmail.com'),
    current_date,
    45,
    3,
    0,
    0
  ),
  (
    (select id from auth.users where email = '90@gmail.com'),
    current_date - 1,
    38,
    2,
    1,
    0
  )
) as v
where exists (
  select 1 from public.users where email = '90@gmail.com'
) and not exists (
  select 1 from public.daily_fp 
  where user_id = (select id from auth.users where email = '90@gmail.com')
);