-- Drop existing function first
DROP FUNCTION IF EXISTS test_challenge_players(text);

-- Create simplified function that only checks status
CREATE OR REPLACE FUNCTION test_challenge_players(p_challenge_id text)
RETURNS TABLE (
    user_id uuid,
    name text,
    email text,
    status text,
    created_at timestamptz,
    level integer,
    burn_streak integer,
    health_score numeric,
    healthspan_years numeric,
    community_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    -- Get all users with active challenges, only filtering on status
    SELECT 
        c.user_id,
        u.name,
        u.email,
        c.status,
        u.created_at,
        u.level,
        u.burn_streak,
        u.health_score,
        u.healthspan_years,
        comm.name as community_name
    FROM challenges c
    JOIN users u ON u.id = c.user_id
    LEFT JOIN community_memberships cm ON cm.user_id = u.id AND cm.is_primary = true
    LEFT JOIN communities comm ON comm.id = cm.community_id
    WHERE c.challenge_id = p_challenge_id
    AND c.status = 'active'  -- Only filter on active status
    ORDER BY u.name ASC;
$$;

-- Test the query with detailed output
DO $$
DECLARE
    v_result record;
    v_count integer := 0;
BEGIN
    RAISE NOTICE E'\nTesting challenge players for tc0:';
    RAISE NOTICE '----------------------------------------';
    
    FOR v_result IN SELECT * FROM test_challenge_players('tc0') LOOP
        v_count := v_count + 1;
        RAISE NOTICE E'\nPlayer %:', v_count;
        RAISE NOTICE '  Name: %', v_result.name;
        RAISE NOTICE '  Email: %', v_result.email;
        RAISE NOTICE '  Status: %', v_result.status;
        RAISE NOTICE '  Level: %', v_result.level;
        RAISE NOTICE '  Burn Streak: %', v_result.burn_streak;
        RAISE NOTICE '  Health Score: %', v_result.health_score;
        RAISE NOTICE '  HealthSpan Years: %', v_result.healthspan_years;
        RAISE NOTICE '  Community: %', COALESCE(v_result.community_name, 'None');
        RAISE NOTICE '  Created: %', v_result.created_at;
        RAISE NOTICE '----------------------------------------';
    END LOOP;

    IF v_count = 0 THEN
        RAISE NOTICE E'\nNo active players found for challenge tc0';
    ELSE
        RAISE NOTICE E'\nTotal active players found: %', v_count;
    END IF;
END $$;