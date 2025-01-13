-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_completed_quests_status 
ON public.completed_quests(status);

CREATE INDEX IF NOT EXISTS idx_completed_challenges_status
ON public.completed_challenges(status);

-- Clean up any duplicate or invalid entries
DELETE FROM public.completed_quests a
USING public.completed_quests b
WHERE a.id > b.id 
AND a.user_id = b.user_id 
AND a.quest_id = b.quest_id;

DELETE FROM public.completed_challenges a
USING public.completed_challenges b
WHERE a.id > b.id 
AND a.user_id = b.user_id 
AND a.challenge_id = b.challenge_id;

-- Update status validation function to be more strict
CREATE OR REPLACE FUNCTION public.validate_status_transition() 
RETURNS trigger AS $$
BEGIN
  -- Allow initial status setting
  IF OLD.status IS NULL THEN
    NEW.completed_at = NULL;
    RETURN NEW;
  END IF;

  -- Only allow specific transitions
  IF OLD.status = 'active' AND NEW.status IN ('completed', 'canceled') THEN
    -- Set completed_at timestamp for status changes
    NEW.completed_at = now();
    
    -- Ensure we have a valid user_id
    IF NEW.user_id IS NULL THEN
      RAISE EXCEPTION 'user_id cannot be null';
    END IF;
    
    RETURN NEW;
  ELSIF OLD.status = NEW.status THEN
    -- Prevent duplicate status updates
    RETURN NULL;
  ELSE
    RAISE EXCEPTION 'Invalid status transition from % to %', OLD.status, NEW.status;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update completion handlers to be more robust
CREATE OR REPLACE FUNCTION public.handle_quest_completion()
RETURNS trigger AS $$
BEGIN
  IF NEW.status IN ('completed', 'canceled') AND OLD.status = 'active' THEN
    -- Only insert if no existing record
    IF NOT EXISTS (
      SELECT 1 FROM public.completed_quests 
      WHERE user_id = NEW.user_id 
      AND quest_id = NEW.quest_id
    ) THEN
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
        NEW.completed_at,
        COALESCE(NEW.fp_reward, 0),
        COALESCE(NEW.challenges_completed, 0),
        COALESCE(NEW.boosts_completed, 0),
        NEW.status
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_challenge_completion()
RETURNS trigger AS $$
BEGIN
  IF NEW.status IN ('completed', 'canceled') AND OLD.status = 'active' THEN
    -- Only insert if no existing record
    IF NOT EXISTS (
      SELECT 1 FROM public.completed_challenges 
      WHERE user_id = NEW.user_id 
      AND challenge_id = NEW.challenge_id
    ) THEN
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
        COALESCE(NEW.fp_reward, 0),
        EXTRACT(DAY FROM (NEW.completed_at - NEW.started_at)),
        COALESCE(NEW.progress, 0),
        NEW.status
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean up any challenges that don't have proper status
UPDATE public.challenges 
SET status = 'active'
WHERE status IS NULL;

UPDATE public.quests
SET status = 'active' 
WHERE status IS NULL;