-- Drop existing triggers first
DROP TRIGGER IF EXISTS on_quest_completion ON public.quests;
DROP TRIGGER IF EXISTS on_challenge_completion ON public.challenges;

-- Update status validation function
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
    RETURN NEW;
  ELSIF OLD.status = NEW.status THEN
    -- Prevent duplicate status updates
    RETURN NULL;
  ELSE
    RAISE EXCEPTION 'Invalid status transition from % to %', OLD.status, NEW.status;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create status validation triggers
CREATE TRIGGER validate_quest_status
  BEFORE UPDATE OF status ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_status_transition();

CREATE TRIGGER validate_challenge_status
  BEFORE UPDATE OF status ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_status_transition();

-- Update completion trigger functions
CREATE OR REPLACE FUNCTION public.handle_quest_completion()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'completed' THEN
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
      'completed'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
      COALESCE(NEW.fp_reward, 0),
      EXTRACT(DAY FROM (NEW.completed_at - NEW.started_at)),
      COALESCE(NEW.progress, 0),
      'completed'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create completion triggers
CREATE TRIGGER on_quest_completion
  AFTER UPDATE OF status ON public.quests
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION public.handle_quest_completion();

CREATE TRIGGER on_challenge_completion
  AFTER UPDATE OF status ON public.challenges
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION public.handle_challenge_completion();