-- Test challenge players function for tc0
DO $$
DECLARE
    v_result record;
    v_count integer := 0;
BEGIN
    -- First show total count
    SELECT COUNT(DISTINCT user_id) 
    INTO v_count
    FROM challenges 
    WHERE challenge_id = 'tc0'
    AND status = 'active';
    
    RAISE NOTICE E'\nTotal active tc0 challenges: %', v_count;
    
    -- Reset count for detailed results
    v_count := 0;
    
    RAISE NOTICE E'\nActive players in tc0 challenge:';
    RAISE NOTICE '----------------------------------------';
    
    -- First show raw user data
    RAISE NOTICE E'\nRaw User Data:';
    FOR v_result IN (
        SELECT u.name, u.email, u.plan, c.status
        FROM challenges c
        JOIN users u ON u.id = c.user_id
        WHERE c.challenge_id = 'tc0'
        AND c.status = 'active'
        ORDER BY u.name ASC
    ) LOOP
        RAISE NOTICE 'User: % (%), Plan: %, Status: %',
            v_result.name,
            v_result.email,
            v_result.plan,
            v_result.status;
    END LOOP;

    RAISE NOTICE E'\nTest Challenge Players Function Results:';
    -- Now test the function
    FOR v_result IN SELECT * FROM test_challenge_players('tc0') LOOP
        v_count := v_count + 1;
        RAISE NOTICE 'Player %:', v_count;
        RAISE NOTICE '  Name: %', v_result.name;
        RAISE NOTICE '  Level: %', v_result.level;
        RAISE NOTICE '  Plan: %', v_result.plan;
        RAISE NOTICE '  Health Score: %', v_result.health_score;
        RAISE NOTICE '  HealthSpan Years: %', v_result.healthspan_years;
        RAISE NOTICE '  Burn Streak: %', v_result.burn_streak;
        RAISE NOTICE '  Member Since: %', v_result.created_at;
        RAISE NOTICE '  Avatar URL: %', COALESCE(v_result.avatar_url, 'None');
        RAISE NOTICE '----------------------------------------';
    END LOOP;

    IF v_count = 0 THEN
        RAISE NOTICE E'\nNo active players found for challenge tc0';
    ELSE
        RAISE NOTICE E'\nTotal active players found: %', v_count;
    END IF;
END $$;