-- Drop existing policies
DROP POLICY IF EXISTS "challenge_messages_select" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_insert" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_update" ON public.challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_delete" ON public.challenge_messages;

-- Create new policies with simplified challenge validation
CREATE POLICY "challenge_messages_select" ON public.challenge_messages
    FOR SELECT USING (true);  -- Allow reading all messages

CREATE POLICY "challenge_messages_insert" ON public.challenge_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.challenges c
            WHERE c.user_id = auth.uid()
            AND c.status = 'active'
        )
    );

CREATE POLICY "challenge_messages_update" ON public.challenge_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "challenge_messages_delete" ON public.challenge_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE public.challenge_messages ENABLE ROW LEVEL SECURITY;