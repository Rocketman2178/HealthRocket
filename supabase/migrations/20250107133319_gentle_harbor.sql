-- Reset Test User 25's boosts
DO $$ 
DECLARE
    v_user_id uuid;
    v_today date;
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Get today's date in EDT
    v_today := (current_timestamp AT TIME ZONE 'America/New_York')::date;

    -- Remove today's completed boosts
    DELETE FROM completed_boosts
    WHERE user_id = v_user_id
    AND completed_date = v_today;

    -- Reset daily FP for today
    DELETE FROM daily_fp
    WHERE user_id = v_user_id
    AND date = v_today;

    -- Keep burn streak but ensure FP is accurate
    UPDATE users
    SET fuel_points = COALESCE((
        SELECT SUM(fp_earned)
        FROM daily_fp
        WHERE user_id = v_user_id
        AND date < v_today
    ), 0)
    WHERE id = v_user_id;

    -- Run level up check to ensure proper level and FP
    PERFORM handle_level_up(
        v_user_id,
        (SELECT fuel_points FROM users WHERE id = v_user_id)
    );
END $$;