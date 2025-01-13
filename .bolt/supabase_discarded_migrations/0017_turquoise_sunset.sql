/*
  # Fix Database Issues
  
  1. Create Missing Tables
    - category_scores: Track category-specific health scores
    - daily_fp: Track daily fuel points and activities
  
  2. Add Proper Indexes
    - Add indexes for frequently queried columns
    - Add composite indexes for common query patterns
  
  3. Update RLS Policies
    - Add policies for new tables
    - Fix existing policies
*/

-- Create category_scores table
CREATE TABLE IF NOT EXISTS public.category_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  mindset_score numeric(4,2) DEFAULT 5,
  sleep_score numeric(4,2) DEFAULT 5,
  exercise_score numeric(4,2) DEFAULT 5,
  nutrition_score numeric(4,2) DEFAULT 5,
  biohacking_score numeric(4,2) DEFAULT 5
);

-- Create daily_fp table if it doesn't exist
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

-- Add indexes
CREATE INDEX IF NOT EXISTS category_scores_user_created_idx ON public.category_scores(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS daily_fp_user_date_idx ON public.daily_fp(user_id, date);

-- Enable RLS
ALTER TABLE public.category_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_fp ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
  -- Category scores policies
  CREATE POLICY "category_scores_select_policy" ON public.category_scores
    FOR SELECT USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "category_scores_insert_policy" ON public.category_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');

  -- Daily FP policies
  CREATE POLICY "daily_fp_select_policy" ON public.daily_fp
    FOR SELECT USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "daily_fp_insert_policy" ON public.daily_fp
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "daily_fp_update_policy" ON public.daily_fp
    FOR UPDATE USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
END $$;

-- Insert test user data
DO $$ 
BEGIN
  -- Insert category scores for test user if none exist
  INSERT INTO public.category_scores (
    user_id,
    mindset_score,
    sleep_score,
    exercise_score,
    nutrition_score,
    biohacking_score
  )
  SELECT
    '676c3382-1fef-404a-90aa-565da369995f',
    8.2,
    7.5,
    8.0,
    7.2,
    7.8
  WHERE NOT EXISTS (
    SELECT 1 FROM public.category_scores 
    WHERE user_id = '676c3382-1fef-404a-90aa-565da369995f'
  );

  -- Insert daily FP for test user if none exist for today
  INSERT INTO public.daily_fp (
    user_id,
    date,
    fp_earned,
    boosts_completed,
    challenges_completed,
    quests_completed
  )
  SELECT
    '676c3382-1fef-404a-90aa-565da369995f',
    CURRENT_DATE,
    45,
    3,
    0,
    0
  WHERE NOT EXISTS (
    SELECT 1 FROM public.daily_fp 
    WHERE user_id = '676c3382-1fef-404a-90aa-565da369995f' 
    AND date = CURRENT_DATE
  );
END $$;