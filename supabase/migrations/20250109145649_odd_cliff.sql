-- Drop existing table and related objects
DROP TABLE IF EXISTS public.chat_messages CASCADE;

-- Create simplified chat messages table
CREATE TABLE public.chat_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id text NOT NULL,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    media_url text,
    media_type text CHECK (media_type IN ('image', 'video')),
    is_verification boolean DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX idx_chat_messages_chat_id ON public.chat_messages(chat_id);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

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