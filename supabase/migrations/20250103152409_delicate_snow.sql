-- Create function to migrate challenge messages
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
    WHERE cm.challenge_id::uuid = c.id::uuid;

    -- Update message reads to use correct challenge IDs
    UPDATE user_message_reads mr
    SET challenge_id = c.challenge_id
    FROM challenges c
    WHERE mr.challenge_id::uuid = c.id::uuid;
END;
$$;

-- Run migration
SELECT migrate_challenge_messages();

-- Drop migration function
DROP FUNCTION migrate_challenge_messages();

-- Add constraint to ensure challenge_id matches active challenges
ALTER TABLE challenge_messages
ADD CONSTRAINT challenge_messages_challenge_id_check
CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$');

-- Create index for challenge messages by challenge_id
CREATE INDEX IF NOT EXISTS idx_challenge_messages_challenge_id
ON challenge_messages(challenge_id);

-- Update RLS policies to use correct challenge_id field
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