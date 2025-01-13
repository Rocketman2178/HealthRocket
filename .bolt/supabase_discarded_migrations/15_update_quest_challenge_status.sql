-- Drop existing triggers first
DROP TRIGGER IF EXISTS on_quest_completion ON public.quests;
DROP TRIGGER IF EXISTS on_challenge_completion ON public.challenges;
DROP TRIGGER IF EXISTS validate_quest_status ON public.quests;
DROP TRIGGER IF EXISTS validate_challenge_status ON public.challenges;

-- Add status enum type for quests and challenges
DO $$ 
BEGIN
  DROP TYPE IF EXISTS activity_status CASCADE;
  CREATE TYPE activity_status AS ENUM ('active', 'completed', 'canceled');
END $$;

-- Add boosts_completed column to quests if it doesn't exist
ALTER TABLE public.quests
  ADD COLUMN IF NOT EXISTS boosts_completed integer NOT NULL DEFAULT 0;

-- Update quests table
ALTER TABLE public.quests DROP COLUMN IF EXISTS status CASCADE;
ALTER TABLE public.quests 
  ALTER COLUMN status TYPE activity_status 
  USING (CASE 
    WHEN status = 'active' THEN 'active'::activity_status
    WHEN status = 'completed' THEN 'completed'::activity_status
    WHEN status = 'canceled' THEN 'canceled'::activity_status
    ELSE 'active'::activity_status
  END);

ALTER TABLE public.quests
  ALTER COLUMN status SET DEFAULT 'active'::activity_status;

-- Update challenges table
ALTER TABLE public.challenges DROP COLUMN IF EXISTS status CASCADE;
ALTER TABLE public.challenges 
  ALTER COLUMN status TYPE activity_status 
  USING (CASE 
    WHEN status = 'active' THEN 'active'::activity_status
    WHEN status = 'completed' THEN 'completed'::activity_status
    WHEN status = 'canceled' THEN 'canceled'::activity_status
    ELSE 'active'::activity_status
  END);

ALTER TABLE public.challenges
  ALTER COLUMN status SET DEFAULT 'active'::activity_status;

-- Add constraints to ensure valid status transitions
CREATE OR REPLACE FUNCTION public.validate_status_transition() 
RETURNS trigger AS $$
BEGIN
  -- Only allow transitions from 'active' to 'completed' or 'canceled'
  IF OLD.status = 'active' AND NEW.status IN ('completed', 'canceled') THEN
    RETURN NEW;
  -- Allow setting initial status to 'active'
  ELSIF OLD.status IS NULL AND NEW.status = 'active' THEN
    RETURN NEW; 
  ELSE
    RAISE EXCEPTION 'Invalid status transition from % to %', OLD.status, NEW.status;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for status validation
DROP TRIGGER IF EXISTS validate_quest_status ON public.quests;
CREATE TRIGGER validate_quest_status
  BEFORE UPDATE OF status ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_status_transition();

DROP TRIGGER IF EXISTS validate_challenge_status ON public.challenges;
CREATE TRIGGER validate_challenge_status
  BEFORE UPDATE OF status ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_status_transition();

-- Recreate completion triggers
CREATE TRIGGER on_quest_completion
  AFTER UPDATE OF status ON public.quests
  FOR EACH ROW
  WHEN (NEW.status IN ('completed', 'canceled'))
  EXECUTE FUNCTION public.handle_quest_completion();

CREATE TRIGGER on_challenge_completion
  AFTER UPDATE OF status ON public.challenges
  FOR EACH ROW
  WHEN (NEW.status IN ('completed', 'canceled'))
  EXECUTE FUNCTION public.handle_challenge_completion();