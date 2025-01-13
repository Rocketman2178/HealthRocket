-- Drop existing table and related objects
DROP TABLE IF EXISTS public.chat_messages CASCADE;

-- Create chat messages table with proper constraints
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
    CONSTRAINT chat_messages_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES public.users(id) 
        ON DELETE CASCADE,
    CONSTRAINT chat_messages_reply_to_id_fkey 
        FOREIGN KEY (reply_to_id) 
        REFERENCES public.chat_messages(id) 
        ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_chat_messages_chat_id ON public.chat_messages(chat_id);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_reply_to_id ON public.chat_messages(reply_to_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "chat_messages_select" ON public.chat_messages
FOR SELECT USING (true);

CREATE POLICY "chat_messages_insert" ON public.chat_messages
FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM challenges c
        WHERE c.challenge_id = substring(chat_messages.chat_id from 3)
        AND c.user_id = auth.uid()
        AND c.status = 'active'
    )
);

CREATE POLICY "chat_messages_delete" ON public.chat_messages
FOR DELETE USING (auth.uid() = user_id);

-- Create function to get messages with proper joins
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
        CASE 
            WHEN m.reply_to_id IS NOT NULL THEN
                jsonb_build_object(
                    'id', r.id,
                    'content', r.content,
                    'createdAt', r.created_at,
                    'user', jsonb_build_object(
                        'name', ru.name,
                        'avatarUrl', ru.avatar_url
                    )
                )
            ELSE NULL
        END as reply_to_message
    FROM chat_messages m
    JOIN users u ON u.id = m.user_id
    LEFT JOIN chat_messages r ON r.id = m.reply_to_id
    LEFT JOIN users ru ON ru.id = r.user_id
    WHERE m.chat_id = p_chat_id
    ORDER BY m.created_at ASC;
$$;