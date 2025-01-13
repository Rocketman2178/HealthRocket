-- Create function to get challenge chat details
CREATE OR REPLACE FUNCTION get_challenge_chat_details(p_chat_id text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_challenge_id text;
    v_player_count integer;
    v_result jsonb;
BEGIN
    -- Extract challenge_id from chat_id
    v_challenge_id := substring(p_chat_id from 3);

    -- Get active player count
    SELECT COUNT(DISTINCT user_id)
    INTO v_player_count
    FROM challenges
    WHERE challenge_id = v_challenge_id
    AND status = 'active';

    -- Build result
    v_result := jsonb_build_object(
        'chat_id', p_chat_id,
        'challenge_id', v_challenge_id,
        'player_count', v_player_count
    );

    RETURN v_result;
END;
$$;

-- Modify get_challenge_messages to focus only on messages
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
    updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        m.id,
        m.chat_id,
        m.user_id,
        m.content,
        m.media_url,
        m.media_type,
        m.is_verification,
        m.reply_to_id,
        m.created_at,
        m.updated_at
    FROM chat_messages m
    WHERE m.chat_id = p_chat_id
    ORDER BY m.created_at DESC;
$$;