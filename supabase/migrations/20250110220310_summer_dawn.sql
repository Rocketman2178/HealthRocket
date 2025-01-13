-- Create function to check and reset burn streaks
CREATE OR REPLACE FUNCTION check_and_reset_burn_streaks()
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

    -- Reset burn streak for users who didn't complete any boosts yesterday
    UPDATE users u
    SET burn_streak = 0
    WHERE NOT EXISTS (
        SELECT 1 FROM completed_boosts cb
        WHERE cb.user_id = u.id
        AND cb.completed_date = v_yesterday
    )
    AND burn_streak > 0;
END;
$$;

-- Create function to get yesterday's boost count
CREATE OR REPLACE FUNCTION get_yesterday_boost_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(*)::integer
    FROM completed_boosts
    WHERE user_id = p_user_id
    AND completed_date = (current_timestamp AT TIME ZONE 'America/New_York' - interval '1 day')::date;
$$;

-- Fix Test User 25's burn streak
DO $$
DECLARE
    v_user_id uuid;
    v_yesterday date;
    v_yesterday_boosts integer;
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Get yesterday's date in EDT
    v_yesterday := (current_timestamp AT TIME ZONE 'America/New_York' - interval '1 day')::date;

    -- Get yesterday's boost count
    SELECT COUNT(*)
    INTO v_yesterday_boosts
    FROM completed_boosts
    WHERE user_id = v_user_id
    AND completed_date = v_yesterday;

    -- Reset burn streak if no boosts yesterday
    IF v_yesterday_boosts = 0 THEN
        UPDATE users
        SET burn_streak = 0
        WHERE id = v_user_id;
        
        RAISE NOTICE 'Reset burn streak for Test User 25 (no boosts on %)', v_yesterday;
    ELSE
        RAISE NOTICE 'User had % boosts on %', v_yesterday_boosts, v_yesterday;
    END IF;
END $$;