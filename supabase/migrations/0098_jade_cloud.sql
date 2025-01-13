-- Drop existing trigger
DROP TRIGGER IF EXISTS update_monthly_fp_totals_trigger ON daily_fp;

-- Create improved function to update monthly totals
CREATE OR REPLACE FUNCTION update_monthly_fp_total()
RETURNS trigger AS $$
BEGIN
    -- Insert or update monthly total
    INSERT INTO monthly_fp_totals (
        user_id,
        year,
        month,
        total_fp
    )
    SELECT
        NEW.user_id,
        EXTRACT(year FROM NEW.date),
        EXTRACT(month FROM NEW.date),
        COALESCE(SUM(fp_earned), 0)
    FROM daily_fp
    WHERE user_id = NEW.user_id
    AND EXTRACT(year FROM date) = EXTRACT(year FROM NEW.date)
    AND EXTRACT(month FROM date) = EXTRACT(month FROM NEW.date)
    ON CONFLICT (user_id, year, month)
    DO UPDATE SET
        total_fp = EXCLUDED.total_fp,
        updated_at = now();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger for monthly FP totals
CREATE TRIGGER update_monthly_fp_totals_trigger
    AFTER INSERT OR UPDATE OF fp_earned ON daily_fp
    FOR EACH ROW
    EXECUTE FUNCTION update_monthly_fp_total();

-- Fix burn streak calculation
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
    v_had_boosts_yesterday boolean;
BEGIN
    -- Process each user's completed boosts
    FOR v_user_record IN (
        SELECT DISTINCT user_id 
        FROM completed_boosts 
        WHERE completed_date = v_yesterday
    ) LOOP
        -- Calculate FP from boosts using lookup values
        v_fp_earned := calculate_boost_fp(v_user_record.user_id, v_yesterday);
        
        -- Count completed boosts
        SELECT COUNT(*)
        INTO v_boosts_completed
        FROM completed_boosts
        WHERE user_id = v_user_record.user_id
        AND completed_date = v_yesterday;

        -- Check if user had boosts yesterday
        SELECT EXISTS (
            SELECT 1 FROM completed_boosts
            WHERE user_id = v_user_record.user_id
            AND completed_date = v_yesterday - 1
        ) INTO v_had_boosts_yesterday;

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

        -- Update daily FP
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
            -- Only increment streak by 1 if had boosts yesterday
            burn_streak = CASE 
                WHEN v_boosts_completed > 0 AND v_had_boosts_yesterday THEN burn_streak + 1
                WHEN v_boosts_completed > 0 THEN 1
                ELSE 0
            END,
            fuel_points = fuel_points + COALESCE(v_fp_earned, 0) + COALESCE(v_streak_bonus, 0)
        WHERE id = v_user_record.user_id;
    END LOOP;
END;
$$;

-- Fix Test User 25's data
DO $$
DECLARE
    v_user_id uuid;
    v_yesterday date := CURRENT_DATE - interval '1 day';
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Reset burn streak to correct value
    UPDATE users
    SET burn_streak = 2
    WHERE id = v_user_id;

    -- Recalculate monthly FP total
    INSERT INTO monthly_fp_totals (
        user_id,
        year,
        month,
        total_fp
    )
    SELECT
        v_user_id,
        EXTRACT(year FROM CURRENT_DATE),
        EXTRACT(month FROM CURRENT_DATE),
        COALESCE(SUM(fp_earned), 0)
    FROM daily_fp
    WHERE user_id = v_user_id
    AND EXTRACT(year FROM date) = EXTRACT(year FROM CURRENT_DATE)
    AND EXTRACT(month FROM date) = EXTRACT(month FROM CURRENT_DATE)
    ON CONFLICT (user_id, year, month)
    DO UPDATE SET
        total_fp = EXCLUDED.total_fp,
        updated_at = now();
END $$;