-- Create function to get today's stats
CREATE OR REPLACE FUNCTION get_today_stats(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_today date;
    v_stats jsonb;
    v_burn_streak integer;
    v_next_milestone integer;
BEGIN
    -- Get today's date in EDT
    v_today := (current_timestamp AT TIME ZONE 'America/New_York')::date;

    -- Get user's burn streak
    SELECT burn_streak INTO v_burn_streak
    FROM users
    WHERE id = p_user_id;

    -- Calculate next milestone
    IF v_burn_streak >= 21 THEN
        v_next_milestone := 3;  -- Reset to 3 after hitting 21
    ELSIF v_burn_streak >= 7 THEN
        v_next_milestone := 21;
    ELSIF v_burn_streak >= 3 THEN
        v_next_milestone := 7;
    ELSE
        v_next_milestone := 3;
    END IF;

    -- Get today's stats
    SELECT 
        jsonb_build_object(
            'boosts_completed', COALESCE(df.boosts_completed, 0),
            'fp_earned', COALESCE(df.fp_earned, 0),
            'streak_bonus', COALESCE(df.streak_bonus, 0),
            'burn_streak', v_burn_streak,
            'next_milestone', v_next_milestone
        ) INTO v_stats
    FROM users u
    LEFT JOIN daily_fp df ON df.user_id = u.id AND df.date = v_today
    WHERE u.id = p_user_id;

    RETURN v_stats;
END;
$$;

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

    -- Update daily_fp to include 100 FP streak bonus for reaching 21 days
    UPDATE daily_fp
    SET 
        fp_earned = fp_earned + 100,  -- Add 100 FP streak bonus
        streak_bonus = 100  -- Set streak bonus to 100 FP
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