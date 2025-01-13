-- Modify challenge_messages table to use text IDs
ALTER TABLE public.challenge_messages
ALTER COLUMN challenge_id TYPE text;

-- Modify user_message_reads table to use text IDs
ALTER TABLE public.user_message_reads
ALTER COLUMN challenge_id TYPE text;

-- Update indexes for better performance
DROP INDEX IF EXISTS idx_challenge_messages_lookup;
CREATE INDEX idx_challenge_messages_lookup 
ON public.challenge_messages(challenge_id, user_id);

DROP INDEX IF EXISTS idx_message_reads_lookup;
CREATE INDEX idx_message_reads_lookup 
ON public.user_message_reads(challenge_id, user_id);

-- Update RLS policies to handle text IDs
DROP POLICY IF EXISTS "challenge_messages_select" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_insert" ON public.challenge_messages;

CREATE POLICY "challenge_messages_select" ON public.challenge_messages
    FOR SELECT USING (true);  -- Allow reading all messages

CREATE POLICY "challenge_messages_insert" ON public.challenge_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM challenges c
            WHERE c.user_id = auth.uid()
            AND c.status = 'active'
            AND c.challenge_id = challenge_messages.challenge_id
        )
    );