-- Drop existing trigger
DROP TRIGGER IF EXISTS sync_user_fuel_points_trigger ON daily_fp;

-- Create improved function to sync fuel points with level up handling
CREATE OR REPLACE FUNCTION sync_fuel_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_fp integer;
    v_level_up_result jsonb;
BEGIN
    -- Calculate total FP from all daily_fp entries
    SELECT COALESCE(SUM(fp_earned), 0)
    INTO v_total_fp
    FROM daily_fp
    WHERE user_id = NEW.user_id;

    -- Handle level up and get result
    v_level_up_result := handle_level_up(NEW.user_id, v_total_fp);

    -- Log level up result for debugging
    RAISE NOTICE 'Level up result: %', v_level_up_result;

    RETURN NEW;
END;
$$;

-- Create new trigger that runs after each daily_fp change
CREATE TRIGGER sync_user_fuel_points_trigger
    AFTER INSERT OR UPDATE OF fp_earned ON daily_fp
    FOR EACH ROW
    EXECUTE FUNCTION sync_fuel_points();

-- Fix Test User 25's level and FP
DO $$
DECLARE
    v_user_id uuid;
    v_total_fp integer;
    v_level_up_result jsonb;
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

    -- Force a level up check with current total FP
    v_level_up_result := handle_level_up(v_user_id, v_total_fp);

    -- Log results
    RAISE NOTICE 'Level up results for Test User 25: %', v_level_up_result;
END $$;