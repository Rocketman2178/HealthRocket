-- Get community ID for Gobundance Elite & Champion
DO $$ 
DECLARE
  v_community_id uuid;
  v_user_id uuid;
BEGIN
  -- Get community ID
  SELECT id INTO v_community_id
  FROM public.communities
  WHERE name = 'Gobundance Elite & Champion';

  -- Get user ID for test25@gmail.com
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'test25@gmail.com';

  -- Create community membership if it doesn't exist
  INSERT INTO public.community_memberships (
    user_id,
    community_id,
    is_primary,
    settings
  )
  VALUES (
    v_user_id,
    v_community_id,
    true,
    jsonb_build_object('role', 'member')
  )
  ON CONFLICT (user_id, community_id) DO UPDATE
  SET is_primary = true;

END $$;