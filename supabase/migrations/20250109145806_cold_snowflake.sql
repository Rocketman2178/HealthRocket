-- Drop existing function first
DROP FUNCTION IF EXISTS get_challenge_messages(text);

-- Create function to get messages with user details
CREATE OR REPLACE FUNCTION get_challenge_messages(p_chat_id text)
RETURNS TABLE (
    id uuid,
    chat_id text,
    user_id uuid,
    content text,
    media_url text,
    media_type text,
    is_verification boolean,
    created_at timestamptz,
    updated_at timestamptz,
    user_name text,
    user_avatar_url text
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
        m.created_at,
        m.updated_at,
        u.name as user_name,
        u.avatar_url as user_avatar_url
    FROM chat_messages m
    JOIN users u ON u.id = m.user_id
    WHERE m.chat_id = p_chat_id
    ORDER BY m.created_at ASC;
$$;