-- Fix Test User 25's boost data
DO $$ 
DECLARE
    v_user_id uuid;
    v_yesterday date := '2025-01-02'::date;  -- The date the boosts were selected
    v_old_date date := '2024-12-26'::date;   -- Date of incorrect completed boosts
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Convert pending boosts to completed boosts
    INSERT INTO public.completed_boosts (
        user_id,
        boost_id,
        completed_at,
        completed_date
    )
    SELECT 
        user_id,
        boost_id,
        v_yesterday + time '23:59:59',
        v_yesterday
    FROM pending_boosts
    WHERE user_id = v_user_id
    AND date = v_yesterday
    AND boost_id IN ('sleep-101', 'sleep-103')
    ON CONFLICT (user_id, boost_id, completed_date) DO NOTHING;

    -- Delete the pending boosts
    DELETE FROM pending_boosts
    WHERE user_id = v_user_id
    AND date = v_yesterday
    AND boost_id IN ('sleep-101', 'sleep-103');

    -- Remove incorrect completed boosts from December 26
    DELETE FROM completed_boosts
    WHERE user_id = v_user_id
    AND completed_date = v_old_date
    AND boost_id IN ('mindset-101', 'mindset-102', 'mindset-103');

    -- Run sync function to update FP and streaks
    PERFORM sync_user_boosts(v_user_id, v_yesterday);

END $$;