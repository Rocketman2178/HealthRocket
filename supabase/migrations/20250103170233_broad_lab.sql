-- Drop existing indexes first
DROP INDEX IF EXISTS idx_challenge_messages_new_lookup;
DROP INDEX IF EXISTS idx_message_reads_new_lookup;
DROP INDEX IF EXISTS idx_challenge_messages_lookup;
DROP INDEX IF EXISTS idx_message_reads_lookup;

-- Create new tables with _new suffix
CREATE TABLE IF NOT EXISTS public.challenge_messages_new (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id text NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    media_urls jsonb DEFAULT '[]'::jsonb,
    is_verification boolean DEFAULT false,
    parent_id uuid REFERENCES public.challenge_messages_new(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT challenge_messages_new_challenge_id_check CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$')
);

CREATE TABLE IF NOT EXISTS public.user_message_reads_new (
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    challenge_id text NOT NULL,
    last_read_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, challenge_id),
    CONSTRAINT user_message_reads_new_challenge_id_check CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$')
);

-- Create indexes on new tables
CREATE INDEX idx_challenge_messages_new_lookup 
ON public.challenge_messages_new(challenge_id, user_id, created_at DESC);

CREATE INDEX idx_message_reads_new_lookup
ON public.user_message_reads_new(challenge_id, user_id);

-- Enable RLS on new tables
ALTER TABLE public.challenge_messages_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_message_reads_new ENABLE ROW LEVEL SECURITY;

-- Create policies on new tables
CREATE POLICY "challenge_messages_new_select" 
ON public.challenge_messages_new FOR SELECT
USING (true);

CREATE POLICY "challenge_messages_new_insert" 
ON public.challenge_messages_new FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM challenges c
        WHERE c.user_id = auth.uid()
        AND c.status = 'active'
        AND c.challenge_id = challenge_messages_new.challenge_id
    )
);

CREATE POLICY "challenge_messages_new_update" 
ON public.challenge_messages_new FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "challenge_messages_new_delete" 
ON public.challenge_messages_new FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "message_reads_new_select"
ON public.user_message_reads_new FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "message_reads_new_insert"
ON public.user_message_reads_new FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "message_reads_new_update"
ON public.user_message_reads_new FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to migrate data
CREATE OR REPLACE FUNCTION migrate_challenge_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Migrate messages with explicit column references
    INSERT INTO challenge_messages_new (
        id,
        challenge_id,
        user_id,
        content,
        media_urls,
        is_verification,
        parent_id,
        created_at,
        updated_at
    )
    SELECT 
        cm.id,
        c.challenge_id,
        cm.user_id,
        cm.content,
        cm.media_urls,
        cm.is_verification,
        cm.parent_id,
        cm.created_at,
        cm.updated_at
    FROM challenge_messages cm
    JOIN challenges c ON c.id::text = cm.challenge_id::text;

    -- Migrate message reads with explicit column references
    INSERT INTO user_message_reads_new (
        user_id,
        challenge_id,
        last_read_at
    )
    SELECT DISTINCT ON (mr.user_id, c.challenge_id)
        mr.user_id,
        c.challenge_id,
        mr.last_read_at
    FROM user_message_reads mr
    JOIN challenges c ON c.id::text = mr.challenge_id::text
    ORDER BY mr.user_id, c.challenge_id, mr.last_read_at DESC;

END;
$$;

-- Run migration
SELECT migrate_challenge_messages();

-- Drop old tables and rename new ones
DROP TABLE IF EXISTS public.challenge_messages CASCADE;
DROP TABLE IF EXISTS public.user_message_reads CASCADE;

ALTER TABLE public.challenge_messages_new RENAME TO challenge_messages;
ALTER TABLE public.user_message_reads_new RENAME TO user_message_reads;

-- Create final indexes
CREATE INDEX idx_challenge_messages_lookup 
ON public.challenge_messages(challenge_id, user_id, created_at DESC);

CREATE INDEX idx_message_reads_lookup
ON public.user_message_reads(challenge_id, user_id);

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