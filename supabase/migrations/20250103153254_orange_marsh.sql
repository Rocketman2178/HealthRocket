-- Drop existing function if it exists
DROP FUNCTION IF EXISTS fix_challenge_message_ids();

-- Create improved function to fix message IDs with proper duplicate handling
CREATE OR REPLACE FUNCTION fix_challenge_message_ids()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create temporary table for deduplication
    CREATE TEMP TABLE temp_message_reads AS
    SELECT DISTINCT ON (user_id, challenge_id) 
        user_id,
        challenge_id,
        last_read_at
    FROM user_message_reads
    ORDER BY user_id, challenge_id, last_read_at DESC;

    -- Delete all existing records
    TRUNCATE user_message_reads;

    -- Insert deduplicated records
    INSERT INTO user_message_reads (user_id, challenge_id, last_read_at)
    SELECT 
        user_id,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM challenges c 
                WHERE c.id::text = temp_message_reads.challenge_id
            ) THEN (
                SELECT challenge_id FROM challenges 
                WHERE id::text = temp_message_reads.challenge_id
                LIMIT 1
            )
            ELSE challenge_id
        END,
        last_read_at
    FROM temp_message_reads;

    -- Drop temporary table
    DROP TABLE temp_message_reads;

    -- Update challenge messages to use challenge_id from challenges table
    UPDATE challenge_messages cm
    SET challenge_id = c.challenge_id
    FROM challenges c
    WHERE cm.challenge_id = c.id::text
    OR cm.challenge_id = c.challenge_id;

    -- Clean up any orphaned messages
    DELETE FROM challenge_messages
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