-- Create improved function to get challenge players count
CREATE OR REPLACE FUNCTION get_challenge_players_count(p_challenge_id text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(DISTINCT user_id)::integer
    FROM challenges
    WHERE challenge_id = p_challenge_id
    AND status = 'active';
$$;