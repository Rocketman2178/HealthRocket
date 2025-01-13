-- Update handling of canceled activities to keep them in the database

-- Drop triggers from previous migration
DROP TRIGGER IF EXISTS on_quest_canceled ON public.quests;
DROP TRIGGER IF EXISTS on_challenge_canceled ON public.challenges;
DROP FUNCTION IF EXISTS public.handle_activity_deletion();
DROP FUNCTION IF EXISTS public.handle_challenge_deletion();

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

-- Recreate triggers for completion only
DROP TRIGGER IF EXISTS on_quest_completion ON public.quests;
DROP TRIGGER IF EXISTS on_challenge_completion ON public.challenges;

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

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_quests_status 
ON public.quests(status);

CREATE INDEX IF NOT EXISTS idx_challenges_status
ON public.challenges(status);

-- Remove canceled items from completed_activities tables
-- but keep them in main tables
DELETE FROM public.completed_quests WHERE status = 'canceled';
DELETE FROM public.completed_challenges WHERE status = 'canceled';