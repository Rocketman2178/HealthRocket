-- Drop existing function
DROP FUNCTION IF EXISTS get_challenge_messages;

-- Create improved function to get messages with replies
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
    WITH RECURSIVE message_tree AS (
        -- Base case: Get all messages
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
            NULL::jsonb as reply_to_message,
            1 as tree_level  -- Renamed to avoid ambiguity
        FROM chat_messages m
        JOIN users u ON u.id = m.user_id
        WHERE m.chat_id = p_chat_id
        AND m.reply_to_id IS NULL

        UNION ALL

        -- Recursive case: Get replies
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
            jsonb_build_object(
                'id', p.id,
                'content', p.content,
                'createdAt', p.created_at,
                'user', jsonb_build_object(
                    'name', pu.name,
                    'avatarUrl', pu.avatar_url
                )
            ),
            mt.tree_level + 1  -- Use renamed column
        FROM chat_messages m
        JOIN message_tree mt ON m.reply_to_id = mt.id
        JOIN users u ON u.id = m.user_id
        JOIN chat_messages p ON p.id = m.reply_to_id
        JOIN users pu ON pu.id = p.user_id
        WHERE m.chat_id = p_chat_id
        AND mt.tree_level < 10  -- Use renamed column
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
        reply_to_message
    FROM message_tree
    ORDER BY created_at ASC;
$$;