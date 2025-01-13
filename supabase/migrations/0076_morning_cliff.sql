-- Drop existing policies
DROP POLICY IF EXISTS "Users can view messages for their active challenges" ON public.challenge_messages;
DROP POLICY IF EXISTS "Users can create messages for their active challenges" ON public.challenge_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.challenge_messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.challenge_messages;

-- Create new policies with proper challenge ID handling
CREATE POLICY "challenge_messages_select" ON public.challenge_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.challenges c
            WHERE c.challenge_id = challenge_messages.challenge_id
            AND c.user_id = auth.uid()
            AND c.status = 'active'
        )
    );

CREATE POLICY "challenge_messages_insert" ON public.challenge_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.challenges c
            WHERE c.challenge_id = challenge_messages.challenge_id
            AND c.user_id = auth.uid()
            AND c.status = 'active'
        )
    );

CREATE POLICY "challenge_messages_update" ON public.challenge_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "challenge_messages_delete" ON public.challenge_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE public.challenge_messages ENABLE ROW LEVEL SECURITY;