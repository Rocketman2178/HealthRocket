-- Fix Test User 25's boost completion
DO $$ 
DECLARE
    v_user_id uuid;
    v_yesterday date := CURRENT_DATE - interval '1 day';
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Insert completed boosts for yesterday
    INSERT INTO public.completed_boosts (
        user_id,
        boost_id,
        completed_at,
        completed_date
    ) VALUES 
    (v_user_id, 'mindset-101', v_yesterday + time '23:59:59', v_yesterday),
    (v_user_id, 'sleep-101', v_yesterday + time '23:59:59', v_yesterday),
    (v_user_id, 'exercise-101', v_yesterday + time '23:59:59', v_yesterday)
    ON CONFLICT (user_id, boost_id, completed_date) DO NOTHING;

    -- Clean up any pending boosts
    DELETE FROM pending_boosts
    WHERE user_id = v_user_id
    AND date = v_yesterday;

    -- Run sync function to update FP and streaks
    PERFORM sync_daily_boosts();

END $$;