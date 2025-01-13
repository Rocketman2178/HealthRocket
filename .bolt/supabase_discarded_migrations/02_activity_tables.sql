-- Create quests table
CREATE TABLE IF NOT EXISTS public.quests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  quest_id text NOT NULL,
  status text NOT NULL,
  progress numeric(5,2) DEFAULT 0,
  challenges_completed integer DEFAULT 0,
  boosts_completed integer DEFAULT 0,
  fp_reward integer NOT NULL DEFAULT 150,
  started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at timestamp with time zone
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  challenge_id text NOT NULL,
  status text NOT NULL,
  progress numeric(5,2) DEFAULT 0,
  started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at timestamp with time zone
);

-- Create completed boosts table
CREATE TABLE IF NOT EXISTS public.completed_boosts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  boost_id text NOT NULL,
  completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_date date DEFAULT current_date NOT NULL,
  CONSTRAINT unique_daily_boost UNIQUE (user_id, boost_id, completed_date)
);

-- Enable RLS
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_boosts ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Users can view own challenges"
  ON public.challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges"
  ON public.challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges"
  ON public.challenges FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own completed boosts"
  ON public.completed_boosts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed boosts"
  ON public.completed_boosts FOR INSERT
  WITH CHECK (auth.uid() = user_id);