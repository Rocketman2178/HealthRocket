-- Add reply_to_id back to chat_messages
ALTER TABLE public.chat_messages
ADD COLUMN reply_to_id uuid REFERENCES public.chat_messages(id) ON DELETE SET NULL;

-- Create index for reply lookups
CREATE INDEX idx_chat_messages_reply_to_id ON public.chat_messages(reply_to_id);

-- Create function to get message replies
CREATE OR REPLACE FUNCTION get_message_replies(p_message_ids uuid[])
RETURNS TABLE (
    message_id uuid,
    reply_data jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        m.id as message_id,
        jsonb_build_object(
            'id', r.id,
            'content', r.content,
            'createdAt', r.created_at,
            'user', jsonb_build_object(
                'name', u.name,
                'avatarUrl', u.avatar_url
            )
        ) as reply_data
    FROM chat_messages m
    JOIN chat_messages r ON r.id = m.reply_to_id
    JOIN users u ON u.id = r.user_id
    WHERE m.id = ANY(p_message_ids)
    AND m.reply_to_id IS NOT NULL;
$$;