-- Create function to check if it's midnight in EDT
CREATE OR REPLACE FUNCTION is_edt_midnight()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
    SELECT EXTRACT(HOUR FROM (current_timestamp AT TIME ZONE 'America/New_York')) = 0
    AND EXTRACT(MINUTE FROM (current_timestamp AT TIME ZONE 'America/New_York')) < 5;
$$;

-- Create function to handle burn streak resets
CREATE OR REPLACE FUNCTION check_burn_streak_reset()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_yesterday date;
BEGIN
    -- Only proceed if it's midnight EDT
    IF is_edt_midnight() THEN
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
    END IF;

    RETURN NEW;
END;
$$;

-- Create trigger on completed_boosts table
DROP TRIGGER IF EXISTS check_burn_streak_reset_trigger ON completed_boosts;
CREATE TRIGGER check_burn_streak_reset_trigger
    AFTER INSERT ON completed_boosts
    FOR EACH STATEMENT
    EXECUTE FUNCTION check_burn_streak_reset();