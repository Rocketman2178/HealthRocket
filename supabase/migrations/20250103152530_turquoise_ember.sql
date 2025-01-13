-- Drop existing function if it exists
DROP FUNCTION IF EXISTS migrate_challenge_messages();

-- Create improved migration function that handles text IDs
CREATE OR REPLACE FUNCTION migrate_challenge_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update existing messages to use correct challenge IDs
    UPDATE challenge_messages cm
    SET challenge_id = c.challenge_id
    FROM challenges c
    WHERE cm.challenge_id = c.id::text;

    -- Update message reads to use correct challenge IDs
    UPDATE user_message_reads mr
    SET challenge_id = c.challenge_id
    FROM challenges c
    WHERE mr.challenge_id = c.id::text;
END;
$$;

-- Run migration
SELECT migrate_challenge_messages();

-- Drop migration function
DROP FUNCTION migrate_challenge_messages();

-- Add constraint to ensure challenge_id matches pattern
ALTER TABLE challenge_messages
DROP CONSTRAINT IF EXISTS challenge_messages_challenge_id_check;

ALTER TABLE challenge_messages
ADD CONSTRAINT challenge_messages_challenge_id_check
CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$');

-- Create optimized indexes
DROP INDEX IF EXISTS idx_challenge_messages_challenge_id;
CREATE INDEX idx_challenge_messages_lookup 
ON challenge_messages(challenge_id, user_id);

DROP INDEX IF EXISTS idx_message_reads_challenge_id;
CREATE INDEX idx_message_reads_lookup
ON user_message_reads(challenge_id, user_id);

-- Update RLS policies
DROP POLICY IF EXISTS "challenge_messages_select" ON challenge_messages;
DROP POLICY IF EXISTS "challenge_messages_insert" ON challenge_messages;

CREATE POLICY "challenge_messages_select" 
ON challenge_messages FOR SELECT
USING (true);

CREATE POLICY "challenge_messages_insert" 
ON challenge_messages FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM challenges c
        WHERE c.user_id = auth.uid()
        AND c.status = 'active'
        AND c.challenge_id = challenge_messages.challenge_id
    )
);