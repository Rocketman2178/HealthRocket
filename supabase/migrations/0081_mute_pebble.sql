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
            SELECT 1 FROM challenges c
            WHERE c.user_id = auth.uid()
            AND c.status = 'active'
            AND c.challenge_id::text = challenge_messages.challenge_id::text
        )
    );

CREATE POLICY "challenge_messages_update" ON public.challenge_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "challenge_messages_delete" ON public.challenge_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Create helper function for challenge access validation
CREATE OR REPLACE FUNCTION validate_challenge_access(p_challenge_id text, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM challenges
        WHERE user_id = p_user_id
        AND status = 'active'
        AND challenge_id::text = p_challenge_id::text
    );
$$;