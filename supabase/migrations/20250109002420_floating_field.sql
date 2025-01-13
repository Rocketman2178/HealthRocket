-- Create function to test challenge players query with proper joins
CREATE OR REPLACE FUNCTION test_challenge_players(p_challenge_id text)
RETURNS TABLE (
    user_id uuid,
    name text,
    email text,
    status text,
    created_at timestamptz,
    level integer,
    burn_streak integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    -- Get all users with active challenges
    SELECT 
        c.user_id,
        u.name,
        u.email,
        c.status,
        u.created_at,
        u.level,
        u.burn_streak
    FROM challenges c
    JOIN users u ON u.id = c.user_id
    WHERE c.challenge_id = p_challenge_id
    ORDER BY u.name ASC;
$$;

-- Test the query with detailed output
DO $$
DECLARE
    v_result record;
    v_count integer := 0;
BEGIN
    RAISE NOTICE 'Testing challenge players for tc0:';
    RAISE NOTICE '----------------------------------------';
    
    FOR v_result IN SELECT * FROM test_challenge_players('tc0') LOOP
        v_count := v_count + 1;
        RAISE NOTICE 'Player %:', v_count;
        RAISE NOTICE '  Name: %', v_result.name;
        RAISE NOTICE '  Email: %', v_result.email;
        RAISE NOTICE '  Status: %', v_result.status;
        RAISE NOTICE '  Level: %', v_result.level;
        RAISE NOTICE '  Burn Streak: %', v_result.burn_streak;
        RAISE NOTICE '  Created: %', v_result.created_at;
        RAISE NOTICE '----------------------------------------';
    END LOOP;

    IF v_count = 0 THEN
        RAISE NOTICE 'No players found for challenge tc0';
    ELSE
        RAISE NOTICE 'Total players found: %', v_count;
    END IF;
END $$;