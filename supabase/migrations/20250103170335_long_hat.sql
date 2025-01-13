-- Drop all existing policies first
DROP POLICY IF EXISTS "challenge_messages_new_select" ON public.challenge_messages_new;
DROP POLICY IF EXISTS "challenge_messages_new_insert" ON public.challenge_messages_new;
DROP POLICY IF EXISTS "challenge_messages_new_update" ON public.challenge_messages_new;
DROP POLICY IF EXISTS "challenge_messages_new_delete" ON public.challenge_messages_new;
DROP POLICY IF EXISTS "message_reads_new_select" ON public.user_message_reads_new;
DROP POLICY IF EXISTS "message_reads_new_insert" ON public.user_message_reads_new;
DROP POLICY IF EXISTS "message_reads_new_update" ON public.user_message_reads_new;

-- Create new policies
CREATE POLICY "challenge_messages_new_select" 
ON public.challenge_messages_new FOR SELECT
USING (true);

CREATE POLICY "challenge_messages_new_insert" 
ON public.challenge_messages_new FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM challenges c
        WHERE c.user_id = auth.uid()
        AND c.status = 'active'
        AND c.challenge_id = challenge_messages_new.challenge_id
    )
);

CREATE POLICY "challenge_messages_new_update" 
ON public.challenge_messages_new FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "challenge_messages_new_delete" 
ON public.challenge_messages_new FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "message_reads_new_select"
ON public.user_message_reads_new FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "message_reads_new_insert"
ON public.user_message_reads_new FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "message_reads_new_update"
ON public.user_message_reads_new FOR UPDATE
USING (auth.uid() = user_id);