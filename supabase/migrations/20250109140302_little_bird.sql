-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS public.chat_messages 
DROP CONSTRAINT IF EXISTS chat_messages_user_id_fkey,
DROP CONSTRAINT IF EXISTS chat_messages_reply_to_id_fkey;

-- Recreate the table with proper constraints
DROP TABLE IF EXISTS public.chat_messages CASCADE;
CREATE TABLE public.chat_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id text NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    media_url text,
    media_type text CHECK (media_type IN ('image', 'video')),
    is_verification boolean DEFAULT false,
    reply_to_id uuid,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chat_messages_reply_to_id_fkey FOREIGN KEY (reply_to_id) REFERENCES chat_messages(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_reply_to_id ON chat_messages(reply_to_id);

-- Create RLS policies
CREATE POLICY "chat_messages_select" ON chat_messages
FOR SELECT USING (true);

CREATE POLICY "chat_messages_insert" ON chat_messages
FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM challenges c
        WHERE c.challenge_id = substring(chat_messages.chat_id from 3)
        AND c.user_id = auth.uid()
        AND c.status = 'active'
    )
);

CREATE POLICY "chat_messages_delete" ON chat_messages
FOR DELETE USING (auth.uid() = user_id);

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
            1 as level
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
            mt.level + 1
        FROM chat_messages m
        JOIN message_tree mt ON m.reply_to_id = mt.id
        JOIN users u ON u.id = m.user_id
        JOIN chat_messages p ON p.id = m.reply_to_id
        JOIN users pu ON pu.id = p.user_id
        WHERE m.chat_id = p_chat_id
        AND level < 10  -- Prevent infinite recursion
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