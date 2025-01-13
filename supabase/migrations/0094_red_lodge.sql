-- Create lookup table for boost FP values
CREATE TABLE IF NOT EXISTS public.boost_fp_values (
    boost_id text PRIMARY KEY,
    fp_value integer NOT NULL,
    category text NOT NULL
);

-- Create function to calculate boost FP from completed boosts
CREATE OR REPLACE FUNCTION calculate_boost_fp(p_user_id uuid, p_date date)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_fp integer := 0;
BEGIN
    -- Sum FP from completed boosts using lookup values
    SELECT COALESCE(SUM(bfp.fp_value), 0)
    INTO v_total_fp
    FROM completed_boosts cb
    JOIN boost_fp_values bfp ON bfp.boost_id = cb.boost_id
    WHERE cb.user_id = p_user_id
    AND cb.completed_date = p_date;

    RETURN v_total_fp;
END;
$$;

-- Update sync_daily_boosts to use proper FP calculation
CREATE OR REPLACE FUNCTION sync_daily_boosts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_yesterday date := CURRENT_DATE - interval '1 day';
    v_user_record record;
    v_fp_earned integer;
    v_streak_bonus integer;
    v_boosts_completed integer;
BEGIN
    -- Process each user's selected boosts from yesterday
    FOR v_user_record IN (
        SELECT DISTINCT user_id 
        FROM completed_boosts 
        WHERE completed_date = v_yesterday
        UNION
        SELECT DISTINCT user_id
        FROM daily_fp
        WHERE date = v_yesterday
    ) LOOP
        -- Calculate actual FP from boosts using lookup values
        v_fp_earned := calculate_boost_fp(v_user_record.user_id, v_yesterday);
        
        -- Count completed boosts
        SELECT COUNT(*)
        INTO v_boosts_completed
        FROM completed_boosts
        WHERE user_id = v_user_record.user_id
        AND completed_date = v_yesterday;

        -- Calculate streak bonus
        SELECT 
            CASE 
                WHEN burn_streak >= 21 THEN 100
                WHEN burn_streak >= 7 THEN 10
                WHEN burn_streak >= 3 THEN 5
                ELSE 0
            END INTO v_streak_bonus
        FROM users
        WHERE id = v_user_record.user_id;

        -- Update or insert daily FP record
        INSERT INTO daily_fp (
            user_id,
            date,
            fp_earned,
            source,
            boosts_completed,
            streak_bonus
        ) VALUES (
            v_user_record.user_id,
            v_yesterday,
            COALESCE(v_fp_earned, 0) + COALESCE(v_streak_bonus, 0),
            'boost',
            v_boosts_completed,
            COALESCE(v_streak_bonus, 0)
        )
        ON CONFLICT (user_id, date) 
        DO UPDATE SET
            fp_earned = EXCLUDED.fp_earned,
            boosts_completed = EXCLUDED.boosts_completed,
            streak_bonus = EXCLUDED.streak_bonus;

        -- Update user's burn streak and total FP
        UPDATE users
        SET 
            burn_streak = CASE 
                WHEN v_boosts_completed > 0 THEN burn_streak + 1
                ELSE 0
            END,
            fuel_points = fuel_points + COALESCE(v_fp_earned, 0) + COALESCE(v_streak_bonus, 0)
        WHERE id = v_user_record.user_id;
    END LOOP;
END;
$$;

-- Update sync_user_boosts to use proper FP calculation
CREATE OR REPLACE FUNCTION sync_user_boosts(p_user_id uuid, p_date date)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_fp_earned integer;
    v_streak_bonus integer;
    v_boosts_completed integer;
BEGIN
    -- Calculate actual FP from boosts using lookup values
    v_fp_earned := calculate_boost_fp(p_user_id, p_date);
    
    -- Count completed boosts
    SELECT COUNT(*)
    INTO v_boosts_completed
    FROM completed_boosts
    WHERE user_id = p_user_id
    AND completed_date = p_date;

    -- Calculate streak bonus
    SELECT 
        CASE 
            WHEN burn_streak >= 21 THEN 100
            WHEN burn_streak >= 7 THEN 10
            WHEN burn_streak >= 3 THEN 5
            ELSE 0
        END INTO v_streak_bonus
    FROM users
    WHERE id = p_user_id;

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
        p_date,
        COALESCE(v_fp_earned, 0) + COALESCE(v_streak_bonus, 0),
        'boost',
        v_boosts_completed,
        COALESCE(v_streak_bonus, 0)
    )
    ON CONFLICT (user_id, date) 
    DO UPDATE SET
        fp_earned = EXCLUDED.fp_earned,
        boosts_completed = EXCLUDED.boosts_completed,
        streak_bonus = EXCLUDED.streak_bonus;

    -- Update user's burn streak and total FP
    UPDATE users
    SET 
        burn_streak = CASE 
            WHEN v_boosts_completed > 0 THEN burn_streak + 1
            ELSE 0
        END,
        fuel_points = fuel_points + COALESCE(v_fp_earned, 0) + COALESCE(v_streak_bonus, 0)
    WHERE id = p_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'fp_earned', v_fp_earned,
        'streak_bonus', v_streak_bonus,
        'total_fp', v_fp_earned + v_streak_bonus,
        'boosts_completed', v_boosts_completed
    );
END;
$$;