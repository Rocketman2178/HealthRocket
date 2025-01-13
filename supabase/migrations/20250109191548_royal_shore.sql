-- Drop existing function first
DROP FUNCTION IF EXISTS test_challenge_players(text);

-- Create function to test challenge players query with complete profile data
CREATE OR REPLACE FUNCTION test_challenge_players(p_challenge_id text)
RETURNS TABLE (
    user_id uuid,
    name text,
    avatar_url text,
    level integer,
    health_score numeric,
    healthspan_years numeric,
    plan text,
    created_at timestamptz,
    burn_streak integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    -- Get users with active challenges including all profile data
    SELECT DISTINCT ON (c.user_id)
        c.user_id,
        u.name,
        u.avatar_url,
        u.level,
        COALESCE(u.health_score, 7.8) as health_score,  -- Default to 7.8 if null
        COALESCE(u.healthspan_years, 0) as healthspan_years,  -- Default to 0 if null
        u.plan,
        u.created_at,
        u.burn_streak
    FROM challenges c
    JOIN users u ON u.id = c.user_id
    WHERE c.challenge_id = p_challenge_id
    AND c.status = 'active'
    ORDER BY c.user_id, u.name ASC;
$$;

-- Test the query with detailed output
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
    
    FOR v_result IN SELECT * FROM test_challenge_players('tc0') LOOP
        v_count := v_count + 1;
        RAISE NOTICE 'Player %:', v_count;
        RAISE NOTICE '  Name: %', v_result.name;
        RAISE NOTICE '  Level: %', v_result.level;
        RAISE NOTICE '  Health Score: %', v_result.health_score;
        RAISE NOTICE '  HealthSpan Years: %', v_result.healthspan_years;
        RAISE NOTICE '  Plan: %', v_result.plan;
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