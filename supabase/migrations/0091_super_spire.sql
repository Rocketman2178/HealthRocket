-- Create improved function to sync fuel points with better error handling
CREATE OR REPLACE FUNCTION sync_fuel_points()
RETURNS trigger AS $$
DECLARE
    v_total_fp integer;
BEGIN
    -- Calculate total FP safely including all sources
    WITH total_points AS (
        SELECT COALESCE(SUM(fp_earned), 0) as total
        FROM daily_fp
        WHERE user_id = NEW.user_id
    )
    SELECT total INTO v_total_fp
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

-- Drop existing trigger
DROP TRIGGER IF EXISTS sync_fuel_points_trigger ON daily_fp;

-- Create new trigger for fuel points sync
CREATE TRIGGER sync_fuel_points_trigger
    AFTER INSERT OR UPDATE OF fp_earned ON daily_fp
    FOR EACH ROW
    EXECUTE FUNCTION sync_fuel_points();

-- Create function to recalculate user's lifetime FP
CREATE OR REPLACE FUNCTION recalculate_user_lifetime_fp(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE users
    SET fuel_points = (
        SELECT COALESCE(SUM(fp_earned), 0)
        FROM daily_fp
        WHERE user_id = p_user_id
    )
    WHERE id = p_user_id;
END;
$$;