-- Create improved function to handle level ups with event trigger
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

        -- Notify about level up through response
        RETURN jsonb_build_object(
            'leveled_up', true,
            'levels_gained', v_levels_gained,
            'new_level', v_new_level,
            'carryover_fp', v_remaining_fp,
            'next_level_points', calculate_next_level_points(v_new_level),
            'should_show_modal', true  -- Add flag to trigger modal
        );
    END IF;

    -- No level up needed
    RETURN jsonb_build_object(
        'leveled_up', false,
        'current_level', v_current_level,
        'current_fp', p_current_fp,
        'next_level_points', v_next_level_points,
        'should_show_modal', false
    );
END;
$$;