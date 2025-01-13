-- Create function to recalculate user's fuel points from daily_fp
CREATE OR REPLACE FUNCTION recalculate_user_fuel_points(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_fp integer;
BEGIN
    -- Calculate total FP from all daily_fp entries
    SELECT COALESCE(SUM(fp_earned), 0)
    INTO v_total_fp
    FROM daily_fp
    WHERE user_id = p_user_id;

    -- Update user's fuel_points to match daily_fp total
    UPDATE users
    SET 
        fuel_points = v_total_fp,
        updated_at = now()
    WHERE id = p_user_id;
END;
$$;

-- Fix Test User 25's fuel points
DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Recalculate their fuel points from daily_fp
    PERFORM recalculate_user_fuel_points(v_user_id);
END $$;

-- Create trigger to keep fuel_points in sync with daily_fp
DROP TRIGGER IF EXISTS sync_user_fuel_points_trigger ON daily_fp;

CREATE TRIGGER sync_user_fuel_points_trigger
    AFTER INSERT OR UPDATE OF fp_earned ON daily_fp
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_user_fuel_points(NEW.user_id);