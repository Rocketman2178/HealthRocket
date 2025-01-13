-- Create function to get challenge players count
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

-- Create function to get challenge messages with user details
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
    user_name text,
    user_avatar_url text,
    reply_to_message jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    WITH reply_messages AS (
        SELECT 
            cm.id,
            jsonb_build_object(
                'id', cm.id,
                'content', cm.content,
                'user', jsonb_build_object(
                    'name', u.name,
                    'avatarUrl', u.avatar_url
                )
            ) as reply_data
        FROM chat_messages cm
        JOIN users u ON u.id = cm.user_id
    )
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
        m.updated_at,
        u.name as user_name,
        u.avatar_url as user_avatar_url,
        rm.reply_data as reply_to_message
    FROM chat_messages m
    JOIN users u ON u.id = m.user_id
    LEFT JOIN reply_messages rm ON rm.id = m.reply_to_id
    WHERE m.chat_id = p_chat_id
    ORDER BY m.created_at ASC;
$$;