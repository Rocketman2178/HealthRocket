-- Drop existing policies
DROP POLICY IF EXISTS "Users can read messages for their active challenges" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert messages for their active challenges" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_select" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert" ON public.chat_messages;

-- Create simplified policies with proper chat_id handling
CREATE POLICY "chat_messages_select" ON public.chat_messages
FOR SELECT
USING (
    -- For challenge chats (prefixed with c_)
    (
        chat_id LIKE 'c_%' AND
        EXISTS (
            SELECT 1 FROM challenges c
            WHERE c.challenge_id = substring(chat_messages.chat_id from 3)
            AND c.user_id = auth.uid()
            AND c.status = 'active'
        )
    ) OR
    -- For quest chats (prefixed with q_)
    (
        chat_id LIKE 'q_%' AND
        EXISTS (
            SELECT 1 FROM quests q
            WHERE q.quest_id = substring(chat_messages.chat_id from 3)
            AND q.user_id = auth.uid()
            AND q.status = 'active'
        )
    )
);

CREATE POLICY "chat_messages_insert" ON public.chat_messages
FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    (
        -- For challenge chats
        (
            chat_id LIKE 'c_%' AND
            EXISTS (
                SELECT 1 FROM challenges c
                WHERE c.challenge_id = substring(chat_messages.chat_id from 3)
                AND c.user_id = auth.uid()
                AND c.status = 'active'
            )
        ) OR
        -- For quest chats
        (
            chat_id LIKE 'q_%' AND
            EXISTS (
                SELECT 1 FROM quests q
                WHERE q.quest_id = substring(chat_messages.chat_id from 3)
                AND q.user_id = auth.uid()
                AND q.status = 'active'
            )
        )
    )
);