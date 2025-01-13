-- Drop existing function first
DROP FUNCTION IF EXISTS test_challenge_players(text);

-- Create maximally simplified function
CREATE OR REPLACE FUNCTION test_challenge_players(p_challenge_id text)
RETURNS TABLE (
    user_id uuid,
    name text,
    email text,
    status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    -- Only get essential fields and only join users table
    SELECT 
        c.user_id,
        u.name,
        u.email,
        c.status
    FROM challenges c
    JOIN users u ON u.id = c.user_id
    WHERE c.challenge_id = p_challenge_id
    AND c.status = 'active'
    ORDER BY u.name ASC;
$$;

-- Test the query with simplified output
DO $$
DECLARE
    v_result record;
    v_count integer := 0;
BEGIN
    RAISE NOTICE E'\nActive players in tc0 challenge:';
    RAISE NOTICE '----------------------------------------';
    
    FOR v_result IN SELECT * FROM test_challenge_players('tc0') LOOP
        v_count := v_count + 1;
        RAISE NOTICE 'Player %: % (%) - Status: %',
            v_count,
            v_result.name,
            v_result.email,
            v_result.status;
    END LOOP;

    RAISE NOTICE '----------------------------------------';
    RAISE NOTICE 'Total active players: %', v_count;
END $$;