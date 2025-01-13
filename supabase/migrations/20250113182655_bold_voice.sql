-- Check tc0 challenges
DO $$
DECLARE
    v_total_count integer;
    v_active_count integer;
    v_result record;
BEGIN
    -- Get total count of tc0 challenges
    SELECT COUNT(*) INTO v_total_count
    FROM challenges
    WHERE challenge_id = 'tc0';

    -- Get count of active tc0 challenges
    SELECT COUNT(*) INTO v_active_count
    FROM challenges
    WHERE challenge_id = 'tc0'
    AND status = 'active';

    RAISE NOTICE E'\nChallenge Counts:';
    RAISE NOTICE '----------------------------------------';
    RAISE NOTICE 'Total tc0 challenges: %', v_total_count;
    RAISE NOTICE 'Active tc0 challenges: %', v_active_count;

    IF v_total_count > 0 THEN
        RAISE NOTICE E'\nDetailed Challenge Data:';
        RAISE NOTICE '----------------------------------------';
        FOR v_result IN (
            SELECT 
                c.challenge_id,
                c.status,
                c.started_at,
                u.email,
                u.name,
                u.plan
            FROM challenges c
            JOIN users u ON u.id = c.user_id
            WHERE c.challenge_id = 'tc0'
            ORDER BY c.started_at DESC
        ) LOOP
            RAISE NOTICE 'Challenge for % (%):',
                v_result.name,
                v_result.email;
            RAISE NOTICE '  Status: %', v_result.status;
            RAISE NOTICE '  Started: %', v_result.started_at;
            RAISE NOTICE '  Plan: %', v_result.plan;
            RAISE NOTICE '----------------------------------------';
        END LOOP;
    ELSE
        RAISE NOTICE E'\nNo tc0 challenges found in database';
    END IF;
END $$;