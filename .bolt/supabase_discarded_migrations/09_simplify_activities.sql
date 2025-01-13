-- Drop existing tables and recreate with simpler schema
DROP TABLE IF EXISTS public.quests CASCADE;
DROP TABLE IF EXISTS public.challenges CASCADE;

-- Create simplified quests table
CREATE TABLE IF NOT EXISTS public.quests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  quest_id text NOT NULL,
  progress numeric(5,2) DEFAULT 0,
  challenges_completed integer DEFAULT 0,
  boosts_completed integer DEFAULT 0,
  fp_reward integer NOT NULL DEFAULT 150,
  started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_active_quest UNIQUE (user_id, quest_id)
);

-- Create simplified challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  challenge_id text NOT NULL,
  progress numeric(5,2) DEFAULT 0,
  fp_reward integer NOT NULL DEFAULT 50,
  started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_active_challenge UNIQUE (user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own quests"
  ON public.quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quests"
  ON public.quests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quests"
  ON public.quests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quests"
  ON public.quests FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own challenges"
  ON public.challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges"
  ON public.challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges"
  ON public.challenges FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges"
  ON public.challenges FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quests_user_id ON public.quests(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON public.challenges(user_id);