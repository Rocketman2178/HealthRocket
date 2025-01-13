-- Add fp_reward column to challenges table
ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS fp_reward integer NOT NULL DEFAULT 50;

-- Update challenge completion trigger to handle fp_reward
CREATE OR REPLACE FUNCTION public.handle_challenge_completion()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    INSERT INTO public.completed_challenges (
      user_id,
      challenge_id,
      completed_at,
      fp_earned,
      days_to_complete,
      final_progress,
      status
    )
    VALUES (
      NEW.user_id,
      NEW.challenge_id,
      NEW.completed_at,
      COALESCE(NEW.fp_reward, 50), -- Default to 50 if not set
      EXTRACT(DAY FROM (NEW.completed_at - NEW.started_at)),
      COALESCE(NEW.progress, 0),
      'completed'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;