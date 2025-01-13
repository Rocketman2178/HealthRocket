-- Drop existing function if it exists
DROP FUNCTION IF EXISTS migrate_challenge_messages();

-- Create improved migration function that handles duplicates
CREATE OR REPLACE FUNCTION migrate_challenge_messages()
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
    DELETE FROM user_message_reads;

    -- Insert deduplicated records
    INSERT INTO user_message_reads (user_id, challenge_id, last_read_at)
    SELECT user_id, challenge_id, last_read_at
    FROM temp_message_reads;

    -- Drop temporary table
    DROP TABLE temp_message_reads;

    -- Update challenge IDs to match challenge_id field from challenges table
    UPDATE user_message_reads mr
    SET challenge_id = c.challenge_id
    FROM challenges c
    WHERE mr.challenge_id = c.id::text;

    -- Add unique constraint if it doesn't exist
    ALTER TABLE user_message_reads
    DROP CONSTRAINT IF EXISTS user_message_reads_pkey;
    
    ALTER TABLE user_message_reads
    ADD PRIMARY KEY (user_id, challenge_id);
END;
$$;

-- Run migration
SELECT migrate_challenge_messages();

-- Drop migration function
DROP FUNCTION migrate_challenge_messages();

-- Add constraint to ensure challenge_id matches pattern
ALTER TABLE user_message_reads
DROP CONSTRAINT IF EXISTS user_message_reads_challenge_id_check;

ALTER TABLE user_message_reads
ADD CONSTRAINT user_message_reads_challenge_id_check
CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$');

-- Create optimized index
DROP INDEX IF EXISTS idx_message_reads_lookup;
CREATE INDEX idx_message_reads_lookup
ON user_message_reads(challenge_id, user_id);

-- Update RLS policies
DROP POLICY IF EXISTS "message_reads_select_policy" ON user_message_reads;
DROP POLICY IF EXISTS "message_reads_insert_policy" ON user_message_reads;
DROP POLICY IF EXISTS "message_reads_update_policy" ON user_message_reads;

CREATE POLICY "message_reads_select_policy"
ON user_message_reads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "message_reads_insert_policy"
ON user_message_reads FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "message_reads_update_policy"
ON user_message_reads FOR UPDATE
USING (auth.uid() = user_id);