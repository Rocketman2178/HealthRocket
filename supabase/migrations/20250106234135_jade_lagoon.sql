-- Create chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id text NOT NULL, -- This will be either challenge_id or quest_id prefixed with 'c_' or 'q_'
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    media_url text,
    media_type text CHECK (media_type IN ('image', 'video')),
    is_verification boolean DEFAULT false,
    reply_to_id uuid REFERENCES public.chat_messages ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create read receipts table
CREATE TABLE IF NOT EXISTS public.message_read_status (
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    chat_id text NOT NULL,
    last_read_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, chat_id)
);

-- Create storage bucket for chat media
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-media', 'chat-media', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_read_status ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_chat_messages_chat ON public.chat_messages(chat_id);
CREATE INDEX idx_chat_messages_user ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_created ON public.chat_messages(created_at DESC);

-- Create RLS policies for chat messages
CREATE POLICY "chat_messages_select" ON public.chat_messages
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM challenges c
        WHERE 'c_' || c.challenge_id = chat_messages.chat_id
        AND c.user_id = auth.uid()
        AND c.status = 'active'
    ) OR
    EXISTS (
        SELECT 1 FROM quests q
        WHERE 'q_' || q.quest_id = chat_messages.chat_id
        AND q.user_id = auth.uid()
        AND q.status = 'active'
    )
);

CREATE POLICY "chat_messages_insert" ON public.chat_messages
FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    (
        EXISTS (
            SELECT 1 FROM challenges c
            WHERE 'c_' || c.challenge_id = chat_messages.chat_id
            AND c.user_id = auth.uid()
            AND c.status = 'active'
        ) OR
        EXISTS (
            SELECT 1 FROM quests q
            WHERE 'q_' || q.quest_id = chat_messages.chat_id
            AND q.user_id = auth.uid()
            AND q.status = 'active'
        )
    )
);

CREATE POLICY "chat_messages_delete" ON public.chat_messages
FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS policies for read status
CREATE POLICY "message_read_select" ON public.message_read_status
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "message_read_insert" ON public.message_read_status
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "message_read_update" ON public.message_read_status
FOR UPDATE
USING (auth.uid() = user_id);

-- Create storage policies
CREATE POLICY "chat_media_upload" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'chat-media' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "chat_media_select" ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'chat-media');

-- Create function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_message_count(
    p_user_id uuid,
    p_chat_id text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_last_read timestamptz;
    v_count integer;
BEGIN
    -- Get last read timestamp
    SELECT last_read_at INTO v_last_read
    FROM message_read_status
    WHERE user_id = p_user_id
    AND chat_id = p_chat_id;

    -- Count unread messages
    SELECT COUNT(*) INTO v_count
    FROM chat_messages
    WHERE chat_id = p_chat_id
    AND created_at > COALESCE(v_last_read, '1970-01-01'::timestamptz);

    RETURN v_count;
END;
$$;