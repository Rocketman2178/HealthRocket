-- Add Test User 25 to Business Network 1 community
DO $$ 
DECLARE
  v_user_id uuid;
  v_business_network_id uuid;
BEGIN
  -- Get user ID for test25@gmail.com
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'test25@gmail.com';

  -- Get Business Network 1 community ID
  SELECT id INTO v_business_network_id
  FROM public.communities
  WHERE name = 'Business Network 1';

  -- Add user to Business Network 1 while keeping their existing memberships
  INSERT INTO public.community_memberships (
    user_id,
    community_id,
    is_primary,
    settings
  )
  VALUES (
    v_user_id,
    v_business_network_id,
    false,  -- Keep their existing primary community
    jsonb_build_object('role', 'member')
  )
  ON CONFLICT (user_id, community_id) DO NOTHING;

  -- Update community member count
  UPDATE public.communities
  SET 
    member_count = (
      SELECT COUNT(DISTINCT user_id) 
      FROM community_memberships 
      WHERE community_id = v_business_network_id
    ),
    updated_at = now()
  WHERE id = v_business_network_id;

END $$;