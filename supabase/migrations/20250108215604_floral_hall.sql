-- Create function to get active challenge players count
CREATE OR REPLACE FUNCTION get_challenge_players_count(p_challenge_id text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(DISTINCT user_id)
    FROM challenges
    WHERE challenge_id = p_challenge_id
    AND status = 'active';
$$;

-- Create function to get challenge messages with player count
CREATE OR REPLACE FUNCTION get_challenge_messages(p_chat_id text)
RETURNS TABLE (
    id uuid,
    chat_id text,
    user_id uuid,
    content text,
    media_url text,
    media_type text,
    is_verification boolean,
    reply_to_id uuid,
    created_at timestamptz,
    updated_at timestamptz,
    player_count integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        m.*,
        get_challenge_players_count(substring(p_chat_id from 3)) as player_count
    FROM chat_messages m
    WHERE m.chat_id = p_chat_id
    ORDER BY m.created_at DESC;
$$;