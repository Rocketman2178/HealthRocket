-- Drop existing functions and triggers with CASCADE
DROP TRIGGER IF EXISTS sync_user_fuel_points_trigger ON daily_fp;
DROP FUNCTION IF EXISTS sync_fuel_points() CASCADE;
DROP FUNCTION IF EXISTS handle_level_up(uuid, integer) CASCADE;
DROP FUNCTION IF EXISTS calculate_next_level_points(integer) CASCADE;

-- Create function to calculate next level points
CREATE OR REPLACE FUNCTION calculate_next_level_points(p_level integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
AS $$
    -- Base points needed for level 1 is 20
    -- Each level requires 41% more points than the previous level
    SELECT round(20 * power(1.41, p_level - 1))::integer;
$$;

-- Create function to handle level ups
CREATE OR REPLACE FUNCTION handle_level_up(
    p_user_id uuid,
    p_current_fp integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_level integer;
    v_next_level_points integer;
    v_carryover_fp integer;
    v_new_level integer;
BEGIN
    -- Get user's current level
    SELECT level INTO v_current_level
    FROM users
    WHERE id = p_user_id;

    -- Calculate points needed for next level
    v_next_level_points := calculate_next_level_points(v_current_level);

    -- Check if we have enough points to level up
    WHILE p_current_fp >= v_next_level_points LOOP
        -- Calculate carryover FP
        v_carryover_fp := p_current_fp - v_next_level_points;
        v_new_level := v_current_level + 1;

        -- Update user's level and FP
        UPDATE users
        SET 
            level = v_new_level,
            fuel_points = v_carryover_fp
        WHERE id = p_user_id;

        -- Update for next iteration
        v_current_level := v_new_level;
        p_current_fp := v_carryover_fp;
        v_next_level_points := calculate_next_level_points(v_current_level);
    END LOOP;

    -- Get final values after any level ups
    SELECT level, fuel_points 
    INTO v_current_level, v_carryover_fp
    FROM users 
    WHERE id = p_user_id;

    RETURN jsonb_build_object(
        'current_level', v_current_level,
        'current_fp', v_carryover_fp,
        'next_level_points', v_next_level_points
    );
END;
$$;

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

    -- Handle level up
    v_level_up_result := handle_level_up(NEW.user_id, v_total_fp);

    RETURN NEW;
END;
$$;

-- Create new trigger
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

    -- Reset user's level and FP first
    UPDATE users
    SET 
        level = 1,
        fuel_points = 0
    WHERE id = v_user_id;

    -- Calculate total FP
    SELECT COALESCE(SUM(fp_earned), 0)
    INTO v_total_fp
    FROM daily_fp
    WHERE user_id = v_user_id;

    -- Handle level up with total FP
    v_level_up_result := handle_level_up(v_user_id, v_total_fp);

    -- Log results
    RAISE NOTICE 'Level up results: %', v_level_up_result;
END $$;