-- Drop existing constraints if they exist
ALTER TABLE public.challenge_messages
DROP CONSTRAINT IF EXISTS challenge_messages_challenge_id_check;

ALTER TABLE public.user_message_reads
DROP CONSTRAINT IF EXISTS user_message_reads_challenge_id_check;

-- Add constraints without WHERE clause
ALTER TABLE public.challenge_messages
ADD CONSTRAINT challenge_messages_challenge_id_check 
CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$');

ALTER TABLE public.user_message_reads
ADD CONSTRAINT user_message_reads_challenge_id_check 
CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$');

-- Recreate optimized indexes
DROP INDEX IF EXISTS idx_challenge_messages_lookup;
CREATE INDEX idx_challenge_messages_lookup 
ON public.challenge_messages(challenge_id, user_id, created_at DESC);

DROP INDEX IF EXISTS idx_message_reads_lookup;
CREATE INDEX idx_message_reads_lookup
ON public.user_message_reads(challenge_id, user_id);

-- Ensure RLS is enabled
ALTER TABLE public.challenge_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_message_reads ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies with simplified permissions
DROP POLICY IF EXISTS "challenge_messages_select" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_insert" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_update" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_delete" ON public.challenge_messages;

CREATE POLICY "challenge_messages_select" 
ON public.challenge_messages FOR SELECT
USING (true);

CREATE POLICY "challenge_messages_insert" 
ON public.challenge_messages FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM challenges c
        WHERE c.user_id = auth.uid()
        AND c.status = 'active'
        AND c.challenge_id = challenge_messages.challenge_id
    )
);

CREATE POLICY "challenge_messages_update" 
ON public.challenge_messages FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "challenge_messages_delete" 
ON public.challenge_messages FOR DELETE
USING (auth.uid() = user_id);