-- Set timezone to Eastern Time
ALTER DATABASE postgres SET timezone TO 'America/New_York';

-- Create function to handle pending boosts at EDT midnight
CREATE OR REPLACE FUNCTION process_pending_boosts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_yesterday date;
BEGIN
    -- Get yesterday's date in EDT
    v_yesterday := (current_timestamp AT TIME ZONE 'America/New_York' - interval '1 day')::date;

    -- Move pending boosts to completed_boosts
    INSERT INTO completed_boosts (
        user_id,
        boost_id,
        completed_at,
        completed_date
    )
    SELECT 
        user_id,
        boost_id,
        (v_yesterday + interval '23 hours 59 minutes 59 seconds') AT TIME ZONE 'America/New_York',
        v_yesterday
    FROM pending_boosts
    WHERE date = v_yesterday
    ON CONFLICT (user_id, boost_id, completed_date) DO NOTHING;

    -- Clean up processed pending boosts
    DELETE FROM pending_boosts
    WHERE date = v_yesterday;

    -- Run sync function to update FP and streaks
    PERFORM sync_daily_boosts();
END;
$$;

-- Process Test User 25's pending boosts from yesterday
DO $$ 
DECLARE
    v_user_id uuid;
    v_yesterday date;
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Get yesterday's date in EDT
    v_yesterday := (current_timestamp AT TIME ZONE 'America/New_York' - interval '1 day')::date;

    -- Move pending boosts to completed_boosts
    INSERT INTO completed_boosts (
        user_id,
        boost_id,
        completed_at,
        completed_date
    )
    SELECT 
        user_id,
        boost_id,
        (v_yesterday + interval '23 hours 59 minutes 59 seconds') AT TIME ZONE 'America/New_York',
        v_yesterday
    FROM pending_boosts
    WHERE user_id = v_user_id
    AND date = v_yesterday
    ON CONFLICT (user_id, boost_id, completed_date) DO NOTHING;

    -- Clean up processed pending boosts
    DELETE FROM pending_boosts
    WHERE user_id = v_user_id
    AND date = v_yesterday;

    -- Run sync function to update FP and streaks
    PERFORM sync_daily_boosts();
END $$;