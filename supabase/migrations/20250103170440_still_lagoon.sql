-- Drop any remaining old tables/objects
DROP TABLE IF EXISTS public.challenge_messages_new CASCADE;
DROP TABLE IF EXISTS public.user_message_reads_new CASCADE;

-- Ensure challenge_messages has correct structure
ALTER TABLE public.challenge_messages
ALTER COLUMN challenge_id TYPE text,
ADD CONSTRAINT challenge_messages_challenge_id_check 
CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$')
WHERE NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'challenge_messages_challenge_id_check'
);

-- Ensure user_message_reads has correct structure
ALTER TABLE public.user_message_reads
ALTER COLUMN challenge_id TYPE text,
ADD CONSTRAINT user_message_reads_challenge_id_check 
CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$')
WHERE NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_message_reads_challenge_id_check'
);

-- Recreate optimized indexes
DROP INDEX IF EXISTS idx_challenge_messages_lookup;
CREATE INDEX idx_challenge_messages_lookup 
ON public.challenge_messages(challenge_id, user_id, created_at DESC);

DROP INDEX IF EXISTS idx_message_reads_lookup;
CREATE INDEX idx_message_reads_lookup
ON public.user_message_reads(challenge_id, user_id);

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

-- Create function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_message_count(p_user_id uuid, p_challenge_id text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    WITH last_read AS (
        SELECT last_read_at
        FROM user_message_reads
        WHERE user_id = p_user_id
        AND challenge_id = p_challenge_id
    )
    SELECT COUNT(*)::integer
    FROM challenge_messages cm
    LEFT JOIN last_read lr ON true
    WHERE cm.challenge_id = p_challenge_id
    AND cm.created_at > COALESCE(lr.last_read_at, '1970-01-01'::timestamptz);
$$;