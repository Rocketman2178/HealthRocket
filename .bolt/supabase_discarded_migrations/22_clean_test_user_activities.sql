-- Clean up completed activities for Clay Speakman (91@gmail.com)
DO $$ 
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user ID
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = '91@gmail.com';

  -- Delete any completed quests that don't have corresponding active/completed/canceled quests
  DELETE FROM public.completed_quests cq
  WHERE cq.user_id = target_user_id
  AND NOT EXISTS (
    SELECT 1 FROM public.quests q 
    WHERE q.user_id = target_user_id 
    AND q.quest_id = cq.quest_id
  );

  -- Delete any completed challenges that don't have corresponding active/completed/canceled challenges
  DELETE FROM public.completed_challenges cc
  WHERE cc.user_id = target_user_id
  AND NOT EXISTS (
    SELECT 1 FROM public.challenges c 
    WHERE c.user_id = target_user_id 
    AND c.challenge_id = cc.challenge_id
  );

  -- Reset any challenges that might be in an invalid state
  UPDATE public.challenges
  SET status = 'active',
      completed_at = NULL
  WHERE user_id = target_user_id
  AND status NOT IN ('active', 'completed', 'canceled');

  -- Reset any quests that might be in an invalid state  
  UPDATE public.quests
  SET status = 'active',
      completed_at = NULL
  WHERE user_id = target_user_id
  AND status NOT IN ('active', 'completed', 'canceled');

END $$;