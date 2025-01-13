-- Create simple debug function
CREATE OR REPLACE FUNCTION debug_challenge_data(p_challenge_id text)
RETURNS TABLE (
    total_challenges bigint,
    active_challenges bigint,
    challenge_statuses text[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        (SELECT COUNT(*) FROM challenges WHERE challenge_id = p_challenge_id),
        (SELECT COUNT(*) FROM challenges WHERE challenge_id = p_challenge_id AND status = 'active'),
        ARRAY_AGG(DISTINCT status) FROM challenges WHERE challenge_id = p_challenge_id;
$$;

-- Test the debug function
DO $$
DECLARE
    v_result record;
BEGIN
    SELECT * INTO v_result FROM debug_challenge_data('tc0');
    
    RAISE NOTICE E'\nChallenge Data for tc0:';
    RAISE NOTICE '----------------------------------------';
    RAISE NOTICE 'Total Challenges: %', v_result.total_challenges;
    RAISE NOTICE 'Active Challenges: %', v_result.active_challenges;
    RAISE NOTICE 'Challenge Statuses: %', v_result.challenge_statuses;
    RAISE NOTICE '----------------------------------------';
    
    -- Also show raw challenge data
    RAISE NOTICE E'\nRaw Challenge Records:';
    RAISE NOTICE '----------------------------------------';
    FOR v_challenge IN (
        SELECT c.*, u.email 
        FROM challenges c
        JOIN users u ON u.id = c.user_id
        WHERE c.challenge_id = 'tc0'
    ) LOOP
        RAISE NOTICE 'User: %, Status: %, Started: %',
            v_challenge.email,
            v_challenge.status,
            v_challenge.started_at;
    END LOOP;
END $$;