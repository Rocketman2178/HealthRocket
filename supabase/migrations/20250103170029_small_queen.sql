-- Run migration function
SELECT migrate_challenge_messages();

-- Drop old tables and rename new ones
DROP TABLE IF EXISTS public.challenge_messages CASCADE;
DROP TABLE IF EXISTS public.user_message_reads CASCADE;

ALTER TABLE public.challenge_messages_new RENAME TO challenge_messages;
ALTER TABLE public.user_message_reads_new RENAME TO user_message_reads;

-- Rename constraints and indexes to match new table names
ALTER INDEX IF EXISTS idx_challenge_messages_new_lookup RENAME TO idx_challenge_messages_lookup;
ALTER INDEX IF EXISTS idx_message_reads_new_lookup RENAME TO idx_message_reads_lookup;

-- Drop migration function
DROP FUNCTION IF EXISTS migrate_challenge_messages();

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