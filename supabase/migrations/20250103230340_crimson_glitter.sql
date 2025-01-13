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

    -- Calculate total FP from daily_fp
    SELECT COALESCE(SUM(fp_earned), 0)
    INTO v_total_fp
    FROM daily_fp
    WHERE user_id = v_user_id;

    -- If we don't have 21 FP recorded, add it
    IF v_total_fp < 21 THEN
        INSERT INTO daily_fp (
            user_id,
            date,
            fp_earned,
            source,
            boosts_completed
        ) VALUES (
            v_user_id,
            CURRENT_DATE,
            21 - v_total_fp, -- Add whatever is needed to reach 21
            'boost',
            3
        );
        
        -- Update total FP
        v_total_fp := 21;
    END IF;

    -- Handle level up with total FP
    v_level_up_result := handle_level_up(v_user_id, v_total_fp);

    -- Log results
    RAISE NOTICE 'Level up results: %', v_level_up_result;
END $$;