-- Create daily fuel points tracking table
CREATE TABLE IF NOT EXISTS public.daily_fp (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  fp_earned integer NOT NULL DEFAULT 0,
  boosts_completed integer NOT NULL DEFAULT 0,
  challenges_completed integer NOT NULL DEFAULT 0,
  quests_completed integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_daily_fp UNIQUE (user_id, date)
);

-- Create player status history table
CREATE TABLE IF NOT EXISTS public.player_status_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status text NOT NULL,
  started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  ended_at timestamp with time zone,
  average_fp numeric(8,2) NOT NULL,
  percentile numeric(5,2) NOT NULL
);

-- Enable RLS
ALTER TABLE public.daily_fp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_status_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own daily fp"
  ON public.daily_fp FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily fp"
  ON public.daily_fp FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily fp"
  ON public.daily_fp FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own status history"
  ON public.player_status_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own status history"
  ON public.player_status_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);