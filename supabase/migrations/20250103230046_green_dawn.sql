-- First, let's check Test User 25's current daily_fp entries
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

    -- Reset daily_fp entries to ensure clean state
    DELETE FROM daily_fp
    WHERE user_id = v_user_id;

    -- Insert correct daily_fp entries (21 FP total)
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

    -- Reset user's level and FP to ensure clean state
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