-- Drop existing function if it exists
DROP FUNCTION IF EXISTS fix_challenge_message_ids();

-- Create improved function to fix message IDs
CREATE OR REPLACE FUNCTION fix_challenge_message_ids()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update challenge messages to use challenge_id from challenges table
    UPDATE challenge_messages cm
    SET challenge_id = c.challenge_id
    FROM challenges c
    WHERE cm.challenge_id = c.id::text
    OR cm.challenge_id = c.challenge_id;

    -- Update message reads to use challenge_id from challenges table
    UPDATE user_message_reads mr
    SET challenge_id = c.challenge_id
    FROM challenges c
    WHERE mr.challenge_id = c.id::text
    OR mr.challenge_id = c.challenge_id;

    -- Clean up any orphaned messages
    DELETE FROM challenge_messages
    WHERE challenge_id NOT IN (
        SELECT DISTINCT challenge_id FROM challenges
    );

    -- Clean up any orphaned message reads
    DELETE FROM user_message_reads
    WHERE challenge_id NOT IN (
        SELECT DISTINCT challenge_id FROM challenges
    );
END;
$$;

-- Run the fix
SELECT fix_challenge_message_ids();

-- Drop the function
DROP FUNCTION fix_challenge_message_ids();

-- Recreate indexes for better performance
DROP INDEX IF EXISTS idx_challenge_messages_lookup;
CREATE INDEX idx_challenge_messages_lookup 
ON challenge_messages(challenge_id, user_id, created_at DESC);

DROP INDEX IF EXISTS idx_message_reads_lookup;
CREATE INDEX idx_message_reads_lookup
ON user_message_reads(challenge_id, user_id, last_read_at DESC);

-- Update RLS policies to handle text challenge IDs
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