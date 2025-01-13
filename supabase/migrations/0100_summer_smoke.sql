-- Drop existing trigger
DROP TRIGGER IF EXISTS sync_user_fuel_points_trigger ON daily_fp;

-- Create trigger with correct syntax
CREATE TRIGGER sync_user_fuel_points_trigger
    AFTER INSERT OR UPDATE OF fp_earned ON daily_fp
    FOR EACH ROW
    EXECUTE PROCEDURE recalculate_user_fuel_points();

-- Fix Test User 25's fuel points again to ensure correct sync
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