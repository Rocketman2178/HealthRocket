-- Drop and recreate status validation function with better error handling
CREATE OR REPLACE FUNCTION public.validate_status_transition() 
RETURNS trigger AS $$
BEGIN
  -- Allow initial status setting
  IF OLD.status IS NULL THEN
    RETURN NEW;
  END IF;

  -- Only allow specific transitions
  IF OLD.status = 'active' AND NEW.status IN ('completed', 'canceled') THEN
    RETURN NEW;
  ELSIF OLD.status = NEW.status THEN
    -- Prevent duplicate status updates
    RETURN NULL;
  ELSE
    RAISE EXCEPTION 'Invalid status transition from % to %', OLD.status, NEW.status;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add status column to completed_quests if it doesn't exist
ALTER TABLE public.completed_quests 
  ADD COLUMN IF NOT EXISTS status activity_status NOT NULL DEFAULT 'completed';

-- Add status column to completed_challenges if it doesn't exist  
ALTER TABLE public.completed_challenges
  ADD COLUMN IF NOT EXISTS status activity_status NOT NULL DEFAULT 'completed';

-- Update completion trigger functions to handle status
CREATE OR REPLACE FUNCTION public.handle_quest_completion()
RETURNS trigger AS $$
BEGIN
  IF NEW.status IN ('completed', 'canceled') THEN
    INSERT INTO public.completed_quests (
      user_id,
      quest_id,
      completed_at,
      fp_earned,
      challenges_completed,
      boosts_completed,
      status
    )
    VALUES (
      NEW.user_id,
      NEW.quest_id,
      COALESCE(NEW.completed_at, now()),
      COALESCE(NEW.fp_reward, 0),
      COALESCE(NEW.challenges_completed, 0),
      COALESCE(NEW.boosts_completed, 0),
      NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_challenge_completion()
RETURNS trigger AS $$
BEGIN
  IF NEW.status IN ('completed', 'canceled') THEN
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
      COALESCE(NEW.completed_at, now()),
      COALESCE(NEW.fp_reward, 0),
      EXTRACT(DAY FROM (COALESCE(NEW.completed_at, now()) - NEW.started_at)),
      COALESCE(NEW.progress, 0),
      NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;