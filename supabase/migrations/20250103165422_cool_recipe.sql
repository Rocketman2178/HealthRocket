-- Modify challenges table to use text IDs
ALTER TABLE public.challenges
ALTER COLUMN challenge_id TYPE text;

-- Add constraint to ensure challenge_id matches pattern
ALTER TABLE public.challenges
ADD CONSTRAINT challenges_challenge_id_check
CHECK (challenge_id ~ '^[a-zA-Z0-9_-]+$');

-- Create optimized index
DROP INDEX IF EXISTS idx_challenges_lookup;
CREATE INDEX idx_challenges_lookup 
ON public.challenges(challenge_id, user_id, status);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view own challenges" ON public.challenges;
DROP POLICY IF EXISTS "Users can insert own challenges" ON public.challenges;
DROP POLICY IF EXISTS "Users can update own challenges" ON public.challenges;

CREATE POLICY "challenges_select" ON public.challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "challenges_insert" ON public.challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "challenges_update" ON public.challenges
    FOR UPDATE USING (auth.uid() = user_id);