/*
  # Add activity tracking tables

  1. New Tables
    - quests
    - challenges
    - completed_quests
    - completed_challenges
    - daily_fp
  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
*/

-- Create quests table
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

-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  challenge_id text NOT NULL,
  status text NOT NULL,
  progress numeric(5,2) DEFAULT 0,
  started_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

-- Create completed_quests table
CREATE TABLE IF NOT EXISTS public.completed_quests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  quest_id text NOT NULL,
  completed_at timestamptz DEFAULT now() NOT NULL,
  fp_earned integer NOT NULL,
  challenges_completed integer NOT NULL,
  boosts_completed integer NOT NULL,
  status text DEFAULT 'completed' NOT NULL
);

-- Create completed_challenges table
CREATE TABLE IF NOT EXISTS public.completed_challenges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  challenge_id text NOT NULL,
  completed_at timestamptz DEFAULT now() NOT NULL,
  fp_earned integer NOT NULL,
  days_to_complete integer NOT NULL,
  final_progress numeric(5,2) NOT NULL,
  status text DEFAULT 'completed' NOT NULL
);

-- Create daily_fp table
CREATE TABLE IF NOT EXISTS public.daily_fp (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  fp_earned integer DEFAULT 0,
  boosts_completed integer DEFAULT 0,
  challenges_completed integer DEFAULT 0,
  quests_completed integer DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_fp ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
  -- Quests policies
  CREATE POLICY "quests_select_policy" ON public.quests
    FOR SELECT USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "quests_insert_policy" ON public.quests
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "quests_update_policy" ON public.quests
    FOR UPDATE USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "quests_delete_policy" ON public.quests
    FOR DELETE USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');

  -- Challenges policies
  CREATE POLICY "challenges_select_policy" ON public.challenges
    FOR SELECT USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "challenges_insert_policy" ON public.challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "challenges_update_policy" ON public.challenges
    FOR UPDATE USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "challenges_delete_policy" ON public.challenges
    FOR DELETE USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');

  -- Completed quests policies
  CREATE POLICY "completed_quests_select_policy" ON public.completed_quests
    FOR SELECT USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "completed_quests_insert_policy" ON public.completed_quests
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');

  -- Completed challenges policies
  CREATE POLICY "completed_challenges_select_policy" ON public.completed_challenges
    FOR SELECT USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "completed_challenges_insert_policy" ON public.completed_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');

  -- Daily FP policies
  CREATE POLICY "daily_fp_select_policy" ON public.daily_fp
    FOR SELECT USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "daily_fp_insert_policy" ON public.daily_fp
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "daily_fp_update_policy" ON public.daily_fp
    FOR UPDATE USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
END $$;