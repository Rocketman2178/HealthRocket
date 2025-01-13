-- Simplify handling of canceled activities

-- Remove canceled activities from completed_quests
DELETE FROM public.completed_quests
WHERE status = 'canceled';

-- Remove canceled activities from completed_challenges
DELETE FROM public.completed_challenges
WHERE status = 'canceled';

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_quest_completion ON public.quests;
DROP TRIGGER IF EXISTS on_challenge_completion ON public.challenges;

-- Update completion trigger functions to only track completed activities
CREATE OR REPLACE FUNCTION public.handle_quest_completion()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    -- Only insert completed quests
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
    -- Only insert completed challenges
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

-- Recreate triggers
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