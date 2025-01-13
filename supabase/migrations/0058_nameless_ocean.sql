-- Update GB Test Player 4's stats
UPDATE public.users 
SET 
  healthspan_years = 15.2,
  fuel_points = 350
WHERE email = 'gb_test_4@healthrocket.test';

-- Update their latest health assessment
UPDATE public.health_assessments
SET healthspan_years = 15.2
WHERE user_id = (
  SELECT id FROM public.users 
  WHERE email = 'gb_test_4@healthrocket.test'
)
AND created_at = (
  SELECT MAX(created_at) 
  FROM public.health_assessments 
  WHERE user_id = (
    SELECT id FROM public.users 
    WHERE email = 'gb_test_4@healthrocket.test'
  )
);