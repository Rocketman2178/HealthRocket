-- Drop existing level up functions
DROP FUNCTION IF EXISTS handle_level_up CASCADE;
DROP FUNCTION IF EXISTS calculate_next_level_points CASCADE;

-- Create improved function to calculate next level points
CREATE OR REPLACE FUNCTION calculate_next_level_points(p_level integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
AS $$
    -- Base points needed for level 1 is 20
    -- Each level requires exactly 41% more points than the previous level
    SELECT round(20 * power(1.41, p_level - 1))::integer;
$$;

-- Create improved function to handle level ups with carryover
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
    v_levels_gained integer := 0;
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
        v_levels_gained := v_levels_gained + 1;
    END LOOP;

    -- Only update if we gained levels
    IF v_levels_gained > 0 THEN
        -- Update user with new level and remaining FP
        UPDATE users
        SET 
            level = v_new_level,
            fuel_points = v_remaining_fp
        WHERE id = p_user_id;

        RETURN jsonb_build_object(
            'leveled_up', true,
            'levels_gained', v_levels_gained,
            'new_level', v_new_level,
            'carryover_fp', v_remaining_fp,
            'next_level_points', calculate_next_level_points(v_new_level)
        );
    END IF;

    -- No level up needed
    RETURN jsonb_build_object(
        'leveled_up', false,
        'current_level', v_current_level,
        'current_fp', p_current_fp,
        'next_level_points', v_next_level_points
    );
END;
$$;

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

    -- Handle level up with total FP
    v_level_up_result := handle_level_up(v_user_id, v_total_fp);

    -- Log results
    RAISE NOTICE 'Level up results: %', v_level_up_result;
END $$;