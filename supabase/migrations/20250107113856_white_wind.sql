-- Fix level up handling for Test User 25
DO $$ 
DECLARE
    v_user_id uuid;
    v_current_fp integer;
    v_current_level integer;
    v_next_level_points integer;
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Get current FP and level
    SELECT fuel_points, level
    INTO v_current_fp, v_current_level
    FROM users
    WHERE id = v_user_id;

    -- Calculate points needed for next level
    v_next_level_points := round(20 * power(1.41, v_current_level - 1))::integer;

    -- If we have enough points to level up
    IF v_current_fp >= v_next_level_points THEN
        -- Update user's level and reset FP to 0
        UPDATE users
        SET 
            level = level + 1,
            fuel_points = 0
        WHERE id = v_user_id;

        RAISE NOTICE 'User leveled up to % with % FP carried over', v_current_level + 1, 0;
    END IF;
END $$;