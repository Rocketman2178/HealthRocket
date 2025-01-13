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

-- Enable RLS
ALTER TABLE public.daily_fp ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own daily fp"
  ON public.daily_fp FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily fp"
  ON public.daily_fp FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily fp"
  ON public.daily_fp FOR UPDATE
  USING (auth.uid() = user_id);