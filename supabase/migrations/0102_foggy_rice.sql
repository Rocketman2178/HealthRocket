-- Drop existing trigger
DROP TRIGGER IF EXISTS sync_user_fuel_points_trigger ON daily_fp;

-- Create function to recalculate user's fuel points without updated_at
CREATE OR REPLACE FUNCTION recalculate_user_fuel_points()
RETURNS trigger
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
    WHERE user_id = NEW.user_id;

    -- Update user's fuel_points to match daily_fp total
    UPDATE users
    SET fuel_points = v_total_fp
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$;

-- Create trigger with correct syntax
CREATE TRIGGER sync_user_fuel_points_trigger
    AFTER INSERT OR UPDATE OF fp_earned ON daily_fp
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_user_fuel_points();

-- Fix Test User 25's fuel points
DO $$
DECLARE
    v_user_id uuid;
    v_total_fp integer;
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Calculate total FP
    SELECT COALESCE(SUM(fp_earned), 0)
    INTO v_total_fp
    FROM daily_fp
    WHERE user_id = v_user_id;

    -- Update user's fuel points
    UPDATE users
    SET fuel_points = v_total_fp
    WHERE id = v_user_id;
END $$;