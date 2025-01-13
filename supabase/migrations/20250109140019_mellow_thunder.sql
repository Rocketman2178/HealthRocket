-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS public.chat_messages 
DROP CONSTRAINT IF EXISTS chat_messages_user_id_fkey,
DROP CONSTRAINT IF EXISTS chat_messages_reply_to_id_fkey;

-- Add foreign key constraints with explicit names
ALTER TABLE public.chat_messages
ADD CONSTRAINT chat_messages_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.users(id) 
  ON DELETE CASCADE,
ADD CONSTRAINT chat_messages_reply_to_id_fkey 
  FOREIGN KEY (reply_to_id) 
  REFERENCES public.chat_messages(id) 
  ON DELETE SET NULL;

-- Create function to get challenge messages with proper joins
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
                'createdAt', cm.created_at,
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