-- First drop all policies that depend on challenge_id
DROP POLICY IF EXISTS "challenge_messages_select" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_insert" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_update" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_delete" ON public.challenge_messages;

-- Now we can safely modify the column
ALTER TABLE public.challenge_messages
ALTER COLUMN challenge_id TYPE text;

-- Add constraint to ensure challenge_id matches pattern
ALTER TABLE public.challenge_messages
ADD CONSTRAINT challenge_messages_challenge_id_check
CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$');

-- Create optimized index
DROP INDEX IF EXISTS idx_challenge_messages_lookup;
CREATE INDEX idx_challenge_messages_lookup 
ON public.challenge_messages(challenge_id, user_id, created_at DESC);

-- Recreate the policies with the new column type
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