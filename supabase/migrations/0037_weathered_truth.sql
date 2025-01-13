-- Insert Gobundance communities
INSERT INTO public.communities (
  name,
  description,
  settings,
  is_active
) VALUES 
  (
    'Gobundance Elite & Champion',
    'For established entrepreneurs and business leaders focused on balanced success across health, wealth, and relationships.',
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
  ),
  (
    'Gobundance Women',
    'A community of high-performing women entrepreneurs dedicated to achieving extraordinary results in business and life.',
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
  ),
  (
    'Gobundance Emerge',
    'For emerging entrepreneurs and professionals committed to personal growth and building wealth with accountability.',
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

-- Create initial admin invite codes for each community
WITH community_ids AS (
  SELECT id, name FROM public.communities
  WHERE name IN (
    'Gobundance Elite & Champion',
    'Gobundance Women',
    'Gobundance Emerge'
  )
)
INSERT INTO public.invite_codes (
  code,
  community_id,
  type,
  is_active
)
SELECT 
  CASE 
    WHEN name = 'Gobundance Elite & Champion' THEN 'ELITE2024'
    WHEN name = 'Gobundance Women' THEN 'WOMEN2024'
    WHEN name = 'Gobundance Emerge' THEN 'EMERGE2024'
  END,
  id,
  'multi_use',
  true
FROM community_ids;