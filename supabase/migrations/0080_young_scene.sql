-- Modify challenge_messages table to ensure consistent types
ALTER TABLE public.challenge_messages 
ALTER COLUMN challenge_id TYPE text;

-- Drop existing policies
DROP POLICY IF EXISTS "challenge_messages_select" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_insert" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_update" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_delete" ON public.challenge_messages;

-- Create new policies with proper validation
CREATE POLICY "challenge_messages_select" ON public.challenge_messages
    FOR SELECT USING (true);  -- Allow reading all messages

CREATE POLICY "challenge_messages_insert" ON public.challenge_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.challenges c
            WHERE c.user_id = auth.uid()
            AND c.status = 'active'
            AND c.challenge_id = challenge_messages.challenge_id
        )
    );

CREATE POLICY "challenge_messages_update" ON public.challenge_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "challenge_messages_delete" ON public.challenge_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_challenge_messages_lookup 
ON public.challenge_messages(challenge_id, user_id);

-- Create function to validate challenge message access
CREATE OR REPLACE FUNCTION can_access_challenge_messages(p_challenge_id text, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM challenges
        WHERE user_id = p_user_id
        AND status = 'active'
        AND challenge_id = p_challenge_id
    );
$$;