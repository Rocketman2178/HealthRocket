-- Create improved function to sync fuel points with better error handling
CREATE OR REPLACE FUNCTION sync_fuel_points()
RETURNS trigger AS $$
DECLARE
    v_total_fp integer;
BEGIN
    -- Calculate total FP safely including all sources
    WITH total_points AS (
        SELECT COALESCE(SUM(fp_earned), 0) as daily_fp
        FROM daily_fp
        WHERE user_id = NEW.user_id
    )
    SELECT daily_fp INTO v_total_fp
    FROM total_points;

    -- Update user's lifetime fuel points
    UPDATE users
    SET 
        fuel_points = v_total_fp,
        updated_at = now()
    WHERE id = NEW.user_id;

    -- Handle null values
    NEW.fp_earned := COALESCE(NEW.fp_earned, 0);

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Error in sync_fuel_points: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to recalculate all users' lifetime FP
CREATE OR REPLACE FUNCTION recalculate_all_lifetime_fp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT DISTINCT user_id FROM daily_fp LOOP
        UPDATE users u
        SET fuel_points = (
            SELECT COALESCE(SUM(fp_earned), 0)
            FROM daily_fp
            WHERE user_id = r.user_id
        )
        WHERE u.id = r.user_id;
    END LOOP;
END;
$$;