-- Create function to handle immediate boost completion with fixed streak logic
CREATE OR REPLACE FUNCTION complete_boost(
    p_user_id uuid,
    p_boost_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_fp_value integer;
    v_today date;
    v_yesterday date;
    v_burn_streak integer;
    v_streak_bonus integer;
    v_total_fp integer;
    v_had_boost_yesterday boolean;
BEGIN
    -- Get dates in EDT
    v_today := (current_timestamp AT TIME ZONE 'America/New_York')::date;
    v_yesterday := v_today - 1;

    -- Check if boost already completed today
    IF EXISTS (
        SELECT 1 FROM completed_boosts
        WHERE user_id = p_user_id
        AND boost_id = p_boost_id
        AND completed_date = v_today
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Boost already completed today'
        );
    END IF;

    -- Get FP value for the boost
    SELECT fp_value INTO v_fp_value
    FROM boost_fp_values
    WHERE boost_id = p_boost_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid boost ID'
        );
    END IF;

    -- Check if user had any boosts yesterday
    SELECT EXISTS (
        SELECT 1 FROM completed_boosts
        WHERE user_id = p_user_id
        AND completed_date = v_yesterday
    ) INTO v_had_boost_yesterday;

    -- Get current burn streak
    SELECT burn_streak INTO v_burn_streak
    FROM users
    WHERE id = p_user_id;

    -- Update burn streak based on yesterday's activity
    IF NOT v_had_boost_yesterday THEN
        -- Reset streak to 0 if no boosts yesterday
        v_burn_streak := 0;
    END IF;
    -- Increment streak for today's boost
    v_burn_streak := v_burn_streak + 1;

    -- Calculate streak bonus based on new streak value
    v_streak_bonus := CASE 
        WHEN v_burn_streak >= 21 THEN 100
        WHEN v_burn_streak >= 7 THEN 10
        WHEN v_burn_streak >= 3 THEN 5
        ELSE 0
    END;

    -- Insert completed boost
    INSERT INTO completed_boosts (
        user_id,
        boost_id,
        completed_at,
        completed_date
    ) VALUES (
        p_user_id,
        p_boost_id,
        current_timestamp AT TIME ZONE 'America/New_York',
        v_today
    );

    -- Calculate total FP (boost value + any streak bonus)
    v_total_fp := v_fp_value + v_streak_bonus;

    -- Update or insert daily FP record
    INSERT INTO daily_fp (
        user_id,
        date,
        fp_earned,
        source,
        boosts_completed,
        streak_bonus
    ) VALUES (
        p_user_id,
        v_today,
        v_total_fp,
        'boost',
        1,
        v_streak_bonus
    )
    ON CONFLICT (user_id, date) 
    DO UPDATE SET
        fp_earned = daily_fp.fp_earned + v_total_fp,
        boosts_completed = daily_fp.boosts_completed + 1,
        streak_bonus = GREATEST(daily_fp.streak_bonus, v_streak_bonus);

    -- Update user's burn streak
    UPDATE users
    SET burn_streak = v_burn_streak
    WHERE id = p_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'fp_earned', v_fp_value,
        'streak_bonus', v_streak_bonus,
        'total_fp', v_total_fp,
        'new_burn_streak', v_burn_streak,
        'had_boost_yesterday', v_had_boost_yesterday
    );
END;
$$;