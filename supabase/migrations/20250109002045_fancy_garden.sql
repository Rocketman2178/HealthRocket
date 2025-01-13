-- Create function to test challenge players query
CREATE OR REPLACE FUNCTION test_challenge_players(p_challenge_id text)
RETURNS TABLE (
    user_id uuid,
    name text,
    email text,
    status text,
    created_at timestamptz
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
        c.created_at
    FROM challenges c
    JOIN users u ON u.id = c.user_id
    WHERE c.challenge_id = p_challenge_id
    ORDER BY u.name ASC;
$$;

-- Test the query
DO $$
DECLARE
    v_result record;
BEGIN
    RAISE NOTICE 'Testing challenge players for tc0:';
    RAISE NOTICE '----------------------------------------';
    
    FOR v_result IN SELECT * FROM test_challenge_players('tc0') LOOP
        RAISE NOTICE 'User: % (%), Status: %, Created: %',
            v_result.name,
            v_result.email,
            v_result.status,
            v_result.created_at;
    END LOOP;
END $$;