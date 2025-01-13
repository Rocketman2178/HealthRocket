-- Create challenge_messages table
CREATE TABLE IF NOT EXISTS public.challenge_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id text NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    media_urls jsonb DEFAULT '[]'::jsonb,
    is_verification boolean DEFAULT false,
    parent_id uuid REFERENCES public.challenge_messages(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create challenge_message_reactions table
CREATE TABLE IF NOT EXISTS public.challenge_message_reactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id uuid REFERENCES public.challenge_messages ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    reaction text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE(message_id, user_id)
);

-- Create indexes
CREATE INDEX idx_challenge_messages_challenge ON public.challenge_messages(challenge_id);
CREATE INDEX idx_challenge_messages_user ON public.challenge_messages(user_id);
CREATE INDEX idx_challenge_messages_parent ON public.challenge_messages(parent_id);
CREATE INDEX idx_challenge_message_reactions_message ON public.challenge_message_reactions(message_id);

-- Enable RLS
ALTER TABLE public.challenge_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_message_reactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view messages for their active challenges"
ON public.challenge_messages
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.challenges c
        WHERE c.challenge_id = challenge_messages.challenge_id
        AND c.user_id = auth.uid()
        AND c.status = 'active'
    )
);

CREATE POLICY "Users can create messages for their active challenges"
ON public.challenge_messages
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.challenges c
        WHERE c.challenge_id = challenge_messages.challenge_id
        AND c.user_id = auth.uid()
        AND c.status = 'active'
    )
);

CREATE POLICY "Users can update their own messages"
ON public.challenge_messages
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own messages"
ON public.challenge_messages
FOR DELETE
USING (user_id = auth.uid());

-- Reaction policies
CREATE POLICY "Users can view reactions"
ON public.challenge_message_reactions
FOR SELECT
USING (true);

CREATE POLICY "Users can create reactions for messages they can see"
ON public.challenge_message_reactions
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.challenge_messages cm
        JOIN public.challenges c ON c.challenge_id = cm.challenge_id
        WHERE cm.id = message_id
        AND c.user_id = auth.uid()
        AND c.status = 'active'
    )
);

CREATE POLICY "Users can delete their own reactions"
ON public.challenge_message_reactions
FOR DELETE
USING (user_id = auth.uid());