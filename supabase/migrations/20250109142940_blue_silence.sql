-- Drop existing function first
DROP FUNCTION IF EXISTS get_challenge_messages(text);

-- Create function to get messages with user details and replies
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
    WITH message_data AS (
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
            r.content as reply_content,
            r.created_at as reply_created_at,
            ru.name as reply_user_name,
            ru.avatar_url as reply_user_avatar_url
        FROM chat_messages m
        JOIN users u ON u.id = m.user_id
        LEFT JOIN chat_messages r ON r.id = m.reply_to_id
        LEFT JOIN users ru ON ru.id = r.user_id
        WHERE m.chat_id = p_chat_id
    )
    SELECT 
        id,
        chat_id,
        user_id,
        content,
        media_url,
        media_type,
        is_verification,
        reply_to_id,
        created_at,
        updated_at,
        user_name,
        user_avatar_url,
        CASE 
            WHEN reply_to_id IS NOT NULL THEN
                jsonb_build_object(
                    'id', reply_to_id,
                    'content', reply_content,
                    'createdAt', reply_created_at,
                    'user', jsonb_build_object(
                        'name', reply_user_name,
                        'avatarUrl', reply_user_avatar_url
                    )
                )
            ELSE NULL
        END as reply_to_message
    FROM message_data
    ORDER BY created_at ASC;
$$;