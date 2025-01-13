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

    -- Reset user to level 1 with 0 FP first
    UPDATE users
    SET 
        level = 1,
        fuel_points = 0,
        burn_streak = 0  -- Also reset burn streak since we're resetting
    WHERE id = v_user_id;

    -- Calculate total FP from all daily_fp entries
    SELECT COALESCE(SUM(fp_earned), 0)
    INTO v_total_fp
    FROM daily_fp
    WHERE user_id = v_user_id;

    -- Handle level up with total FP
    -- This will:
    -- 1. Level up to level 2 (costs 20 FP)
    -- 2. Carry over remaining 6 FP to level 2
    v_level_up_result := handle_level_up(v_user_id, v_total_fp);

    -- Log results
    RAISE NOTICE 'Level up results: %', v_level_up_result;
END $$;