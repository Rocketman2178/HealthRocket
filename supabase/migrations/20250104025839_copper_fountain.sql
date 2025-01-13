-- Drop existing functions and triggers
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
    v_remaining_fp integer := p_current_fp;
    v_new_level integer;
BEGIN
    -- Get user's current level
    SELECT level INTO v_current_level
    FROM users
    WHERE id = p_user_id;

    v_new_level := v_current_level;

    -- Keep leveling up while we have enough FP
    WHILE true LOOP
        -- Calculate points needed for next level
        v_next_level_points := calculate_next_level_points(v_new_level);
        
        -- Exit if we don't have enough FP for next level
        IF v_remaining_fp < v_next_level_points THEN
            EXIT;
        END IF;
        
        -- Level up and calculate remaining FP
        v_remaining_fp := v_remaining_fp - v_next_level_points;
        v_new_level := v_new_level + 1;
    END LOOP;

    -- Update user with new level and remaining FP
    UPDATE users
    SET 
        level = v_new_level,
        fuel_points = v_remaining_fp
    WHERE id = p_user_id;

    RETURN jsonb_build_object(
        'current_level', v_new_level,
        'current_fp', v_remaining_fp,
        'next_level_points', calculate_next_level_points(v_new_level)
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
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Reset daily_fp entries
    DELETE FROM daily_fp
    WHERE user_id = v_user_id;

    -- Insert single daily_fp entry with 21 total FP
    INSERT INTO daily_fp (
        user_id,
        date,
        fp_earned,
        source,
        boosts_completed
    ) VALUES (
        v_user_id,
        CURRENT_DATE,
        21,
        'boost',
        3
    );

    -- The trigger will handle level calculation and FP carryover
END $$;