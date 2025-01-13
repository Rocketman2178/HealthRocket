-- Drop existing sync function
DROP FUNCTION IF EXISTS sync_fuel_points CASCADE;

-- Create improved sync function with error handling
CREATE OR REPLACE FUNCTION sync_fuel_points()
RETURNS trigger AS $$
DECLARE
    v_total_fp integer;
BEGIN
    -- Calculate total FP safely
    SELECT COALESCE(SUM(fp_earned), 0)
    INTO v_total_fp
    FROM daily_fp
    WHERE user_id = NEW.user_id;

    -- Update user's lifetime fuel points
    UPDATE users
    SET 
        fuel_points = v_total_fp,
        updated_at = now()
    WHERE id = NEW.user_id;

    -- Handle null values
    IF NEW.fp_earned IS NULL THEN
        NEW.fp_earned := 0;
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error and continue
    RAISE WARNING 'Error in sync_fuel_points: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS sync_fuel_points_trigger ON daily_fp;
CREATE TRIGGER sync_fuel_points_trigger
    AFTER INSERT OR UPDATE ON daily_fp
    FOR EACH ROW
    EXECUTE FUNCTION sync_fuel_points();

-- Create function to safely get lifetime FP
CREATE OR REPLACE FUNCTION get_lifetime_fuel_points(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(fuel_points, 0)
    FROM users
    WHERE id = p_user_id;
$$;