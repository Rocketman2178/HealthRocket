DO $$ 
DECLARE
    v_user_id uuid;
    v_yesterday date := CURRENT_DATE - interval '1 day';
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Insert the missing completed boost
    INSERT INTO public.completed_boosts (
        user_id,
        boost_id,
        completed_at,
        completed_date
    ) VALUES (
        v_user_id,
        'sleep-102',
        v_yesterday + time '23:59:59',
        v_yesterday
    )
    ON CONFLICT (user_id, boost_id, completed_date) DO NOTHING;

    -- Run sync function to update FP and streaks with correct FP value
    PERFORM sync_user_boosts(v_user_id, v_yesterday);
END $$;