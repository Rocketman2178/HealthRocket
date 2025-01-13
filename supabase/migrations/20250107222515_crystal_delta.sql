-- Fix Test User 25's streak bonus
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

    -- Update daily_fp to include streak bonus
    UPDATE daily_fp
    SET 
        fp_earned = fp_earned + 10,  -- Add 10 FP streak bonus
        streak_bonus = 10  -- Set streak bonus to 10 FP
    WHERE user_id = v_user_id
    AND date = v_today;

    -- Update user's total FP
    UPDATE users u
    SET fuel_points = (
        SELECT COALESCE(SUM(fp_earned), 0)
        FROM daily_fp
        WHERE user_id = u.id
    )
    WHERE id = v_user_id;

    -- Run level up check
    PERFORM handle_level_up(v_user_id, (SELECT fuel_points FROM users WHERE id = v_user_id));

END $$;