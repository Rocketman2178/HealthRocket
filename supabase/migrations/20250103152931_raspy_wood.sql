-- Ensure challenge_messages uses the correct ID format
ALTER TABLE public.challenge_messages
ALTER COLUMN challenge_id TYPE text;

-- Ensure user_message_reads uses the correct ID format
ALTER TABLE public.user_message_reads
ALTER COLUMN challenge_id TYPE text;

-- Create function to fix existing message IDs
CREATE OR REPLACE FUNCTION fix_challenge_message_ids()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update challenge messages to use correct IDs
    UPDATE challenge_messages cm
    SET challenge_id = c.challenge_id
    FROM challenges c
    WHERE cm.challenge_id = c.id::text;

    -- Update message reads to use correct IDs
    UPDATE user_message_reads mr
    SET challenge_id = c.challenge_id
    FROM challenges c
    WHERE mr.challenge_id = c.id::text;
END;
$$;

-- Run the fix
SELECT fix_challenge_message_ids();

-- Drop the function
DROP FUNCTION fix_challenge_message_ids();

-- Add constraints to ensure valid IDs
ALTER TABLE challenge_messages
DROP CONSTRAINT IF EXISTS challenge_messages_challenge_id_check;

ALTER TABLE challenge_messages
ADD CONSTRAINT challenge_messages_challenge_id_check
CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$');

ALTER TABLE user_message_reads
DROP CONSTRAINT IF EXISTS user_message_reads_challenge_id_check;

ALTER TABLE user_message_reads
ADD CONSTRAINT user_message_reads_challenge_id_check
CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$');

-- Create optimized indexes
DROP INDEX IF EXISTS idx_challenge_messages_lookup;
CREATE INDEX idx_challenge_messages_lookup 
ON challenge_messages(challenge_id, user_id);

DROP INDEX IF EXISTS idx_message_reads_lookup;
CREATE INDEX idx_message_reads_lookup
ON user_message_reads(challenge_id, user_id);