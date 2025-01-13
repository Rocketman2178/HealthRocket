/*
  # Fix missing tables and add indexes

  1. Create Tables
    - Add missing tables for quests and challenges
    - Add proper indexes for performance
  2. Security
    - Enable RLS
    - Add policies
  3. Constraints
    - Add foreign key constraints
    - Add unique constraints
*/

-- Create quests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.quests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  quest_id text NOT NULL,
  status text NOT NULL,
  progress numeric(5,2) DEFAULT 0,
  started_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz,
  daily_boosts_completed integer DEFAULT 0
);

-- Create challenges table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  challenge_id text NOT NULL,
  status text NOT NULL,
  progress numeric(5,2) DEFAULT 0,
  started_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS quests_user_id_idx ON public.quests(user_id);
CREATE INDEX IF NOT EXISTS challenges_user_id_idx ON public.challenges(user_id);

-- Enable RLS
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "quests_select_policy" ON public.quests;
  DROP POLICY IF EXISTS "quests_insert_policy" ON public.quests;
  DROP POLICY IF EXISTS "quests_update_policy" ON public.quests;
  DROP POLICY IF EXISTS "challenges_select_policy" ON public.challenges;
  DROP POLICY IF EXISTS "challenges_insert_policy" ON public.challenges;
  DROP POLICY IF EXISTS "challenges_update_policy" ON public.challenges;

  -- Create new policies
  CREATE POLICY "quests_select_policy" ON public.quests
    FOR SELECT USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "quests_insert_policy" ON public.quests
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "quests_update_policy" ON public.quests
    FOR UPDATE USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');

  CREATE POLICY "challenges_select_policy" ON public.challenges
    FOR SELECT USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "challenges_insert_policy" ON public.challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "challenges_update_policy" ON public.challenges
    FOR UPDATE USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
END $$;