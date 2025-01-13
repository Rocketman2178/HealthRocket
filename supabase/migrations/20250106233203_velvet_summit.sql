-- Create chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id text,
    quest_id text,
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
    challenge_id text,
    quest_id text,
    last_read_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, COALESCE(challenge_id, quest_id))
);

-- Create storage bucket for chat media
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-media', 'chat-media', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_read_status ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_chat_messages_challenge ON public.chat_messages(challenge_id) WHERE challenge_id IS NOT NULL;
CREATE INDEX idx_chat_messages_quest ON public.chat_messages(quest_id) WHERE quest_id IS NOT NULL;
CREATE INDEX idx_chat_messages_user ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_created ON public.chat_messages(created_at DESC);

-- Create RLS policies
CREATE POLICY "Users can read messages for their active challenges"
ON public.chat_messages
FOR SELECT
USING (
    (challenge_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM challenges c
        WHERE c.challenge_id = chat_messages.challenge_id
        AND c.user_id = auth.uid()
        AND c.status = 'active'
    )) OR
    (quest_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM quests q
        WHERE q.quest_id = chat_messages.quest_id
        AND q.user_id = auth.uid()
        AND q.status = 'active'
    ))
);

CREATE POLICY "Users can insert messages for their active challenges"
ON public.chat_messages
FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    (
        (challenge_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM challenges c
            WHERE c.challenge_id = chat_messages.challenge_id
            AND c.user_id = auth.uid()
            AND c.status = 'active'
        )) OR
        (quest_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM quests q
            WHERE q.quest_id = chat_messages.quest_id
            AND q.user_id = auth.uid()
            AND q.status = 'active'
        ))
    )
);

CREATE POLICY "Users can delete their own messages"
ON public.chat_messages
FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for read status
CREATE POLICY "Users can view their own read status"
ON public.message_read_status
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own read status"
ON public.message_read_status
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own read status"
ON public.message_read_status
FOR UPDATE
USING (auth.uid() = user_id);

-- Create storage policies
CREATE POLICY "Users can upload chat media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'chat-media' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view chat media"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'chat-media');

-- Create function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_message_count(
    p_user_id uuid,
    p_challenge_id text DEFAULT NULL,
    p_quest_id text DEFAULT NULL
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
    AND (
        (p_challenge_id IS NOT NULL AND challenge_id = p_challenge_id) OR
        (p_quest_id IS NOT NULL AND quest_id = p_quest_id)
    );

    -- Count unread messages
    SELECT COUNT(*) INTO v_count
    FROM chat_messages
    WHERE (
        (p_challenge_id IS NOT NULL AND challenge_id = p_challenge_id) OR
        (p_quest_id IS NOT NULL AND quest_id = p_quest_id)
    )
    AND created_at > COALESCE(v_last_read, '1970-01-01'::timestamptz);

    RETURN v_count;
END;
$$;