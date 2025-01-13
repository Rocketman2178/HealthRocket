-- Clean up test user data for Clay Speakman (91@gmail.com)
DO $$ 
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user ID
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = '91@gmail.com';

  -- Delete all completed quests for this user
  DELETE FROM public.completed_quests
  WHERE user_id = target_user_id;

  -- Delete all completed challenges for this user
  DELETE FROM public.completed_challenges
  WHERE user_id = target_user_id;

  -- Reset active quests
  UPDATE public.quests
  SET status = 'active',
      completed_at = NULL
  WHERE user_id = target_user_id;

  -- Reset active challenges
  UPDATE public.challenges
  SET status = 'active',
      completed_at = NULL
  WHERE user_id = target_user_id;

END $$;