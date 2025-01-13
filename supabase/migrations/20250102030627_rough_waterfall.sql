/*
  # Add pending boosts tracking

  1. New Tables
    - `pending_boosts` - Tracks boosts selected by users during the day
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `boost_id` (text)
      - `selected_at` (timestamptz)
      - `date` (date)

  2. Security
    - Enable RLS on `pending_boosts` table
    - Add policies for user access
*/

-- Create pending_boosts table
CREATE TABLE IF NOT EXISTS public.pending_boosts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    boost_id text NOT NULL,
    selected_at timestamptz DEFAULT now() NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    UNIQUE(user_id, boost_id, date)
);

-- Enable RLS
ALTER TABLE public.pending_boosts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own pending boosts"
ON public.pending_boosts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pending boosts"
ON public.pending_boosts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pending boosts"
ON public.pending_boosts
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_pending_boosts_user_date 
ON public.pending_boosts(user_id, date);

-- Create function to get user's pending boosts for today
CREATE OR REPLACE FUNCTION get_pending_boosts(p_user_id uuid)
RETURNS TABLE (
    boost_id text,
    selected_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT boost_id, selected_at
    FROM pending_boosts
    WHERE user_id = p_user_id
    AND date = CURRENT_DATE
    ORDER BY selected_at;
$$;