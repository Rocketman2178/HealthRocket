-- Create function to handle all FP sources
CREATE OR REPLACE FUNCTION sync_fp_earnings()
RETURNS trigger AS $$
DECLARE
    v_today date := CURRENT_DATE;
    v_fp_amount integer;
    v_source text;
BEGIN
    -- Set FP amount and source based on the table being updated
    CASE TG_TABLE_NAME
        WHEN 'completed_boosts' THEN
            -- Get FP value from boost data (handled at midnight)
            v_source := 'boost';
            
        WHEN 'completed_challenges' THEN
            v_fp_amount := NEW.fp_earned;
            v_source := 'challenge';
            
        WHEN 'completed_quests' THEN
            v_fp_amount := NEW.fp_earned;
            v_source := 'quest';
            
        WHEN 'health_assessments' THEN
            -- Calculate FP bonus (10% of next level points)
            SELECT round(20 * power(1.41, level - 1) * 0.1)
            INTO v_fp_amount
            FROM users
            WHERE id = NEW.user_id;
            v_source := 'health_assessment';
    END CASE;

    -- Only proceed if we have FP to add
    IF v_fp_amount > 0 THEN
        -- Update daily_fp
        INSERT INTO daily_fp (
            user_id,
            date,
            fp_earned,
            source,
            source_id
        ) VALUES (
            NEW.user_id,
            v_today,
            v_fp_amount,
            v_source,
            NEW.id
        )
        ON CONFLICT (user_id, date) 
        DO UPDATE SET
            fp_earned = daily_fp.fp_earned + v_fp_amount;

        -- Update user's lifetime total
        UPDATE users
        SET fuel_points = fuel_points + v_fp_amount
        WHERE id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add source tracking to daily_fp
ALTER TABLE public.daily_fp 
ADD COLUMN IF NOT EXISTS source text,
ADD COLUMN IF NOT EXISTS source_id uuid;

-- Create triggers for each FP source
DROP TRIGGER IF EXISTS sync_challenge_fp ON completed_challenges;
CREATE TRIGGER sync_challenge_fp
    AFTER INSERT ON completed_challenges
    FOR EACH ROW
    EXECUTE FUNCTION sync_fp_earnings();

DROP TRIGGER IF EXISTS sync_quest_fp ON completed_quests;
CREATE TRIGGER sync_quest_fp
    AFTER INSERT ON completed_quests
    FOR EACH ROW
    EXECUTE FUNCTION sync_fp_earnings();

DROP TRIGGER IF EXISTS sync_health_assessment_fp ON health_assessments;
CREATE TRIGGER sync_health_assessment_fp
    AFTER INSERT ON health_assessments
    FOR EACH ROW
    EXECUTE FUNCTION sync_fp_earnings();

-- Create function to sync completed boosts at midnight
CREATE OR REPLACE FUNCTION sync_completed_boosts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
    v_yesterday date := CURRENT_DATE - interval '1 day';
    v_user_record record;
    v_fp_earned integer;
    v_streak_bonus integer;
BEGIN
    -- Process each user's completed boosts
    FOR v_user_record IN (
        SELECT DISTINCT user_id 
        FROM completed_boosts 
        WHERE completed_date = v_yesterday
    ) LOOP
        -- Calculate base FP from boosts
        SELECT COUNT(*) * 5 -- Assuming each boost is worth 5 FP
        INTO v_fp_earned
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

        -- Add FP to daily total
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
            v_fp_earned + v_streak_bonus,
            'boost',
            v_fp_earned / 5, -- Number of boosts
            v_streak_bonus
        )
        ON CONFLICT (user_id, date) 
        DO UPDATE SET
            fp_earned = daily_fp.fp_earned + v_fp_earned + v_streak_bonus,
            boosts_completed = daily_fp.boosts_completed + v_fp_earned / 5,
            streak_bonus = v_streak_bonus;

        -- Update user's lifetime total
        UPDATE users
        SET fuel_points = fuel_points + v_fp_earned + v_streak_bonus
        WHERE id = v_user_record.user_id;
    END LOOP;
END;
$$;