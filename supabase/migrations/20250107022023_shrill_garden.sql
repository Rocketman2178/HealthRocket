-- Drop existing policies
DROP POLICY IF EXISTS "chat_messages_select" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert" ON public.chat_messages;

-- Create maximally simplified policies
CREATE POLICY "chat_messages_select" ON public.chat_messages
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM challenges c
        WHERE c.challenge_id = substring(chat_messages.chat_id from 3)
        AND c.user_id = auth.uid()
        AND c.status = 'active'
    )
);

CREATE POLICY "chat_messages_insert" ON public.chat_messages
FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM challenges c
        WHERE c.challenge_id = substring(chat_messages.chat_id from 3)
        AND c.user_id = auth.uid()
        AND c.status = 'active'
    )
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_challenge 
ON public.chat_messages((substring(chat_id from 3)));