/*
  # Update daily_fp table for streak bonuses

  1. Changes
    - Add streak_bonus column to daily_fp table
    - Update existing records with default value
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add streak_bonus column to daily_fp
ALTER TABLE public.daily_fp 
ADD COLUMN IF NOT EXISTS streak_bonus integer DEFAULT 0;

-- Update existing records to have 0 streak bonus
UPDATE public.daily_fp 
SET streak_bonus = 0 
WHERE streak_bonus IS NULL;