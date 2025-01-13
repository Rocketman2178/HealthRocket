-- Add status column to completed_quests
ALTER TABLE public.completed_quests
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'completed'
  CHECK (status IN ('completed', 'canceled'));

-- Add status column to completed_challenges  
ALTER TABLE public.completed_challenges
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'completed'
  CHECK (status IN ('completed', 'canceled'));

-- Create or replace quest completion trigger function
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

-- Create quest completion trigger
DROP TRIGGER IF EXISTS on_quest_completion ON public.quests;
CREATE TRIGGER on_quest_completion
  AFTER UPDATE OF status ON public.quests
  FOR EACH ROW
  WHEN (NEW.status IN ('completed', 'canceled'))
  EXECUTE FUNCTION public.handle_quest_completion();

-- Create or replace challenge completion trigger function
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

-- Create challenge completion trigger
DROP TRIGGER IF EXISTS on_challenge_completion ON public.challenges;
CREATE TRIGGER on_challenge_completion
  AFTER UPDATE OF status ON public.challenges
  FOR EACH ROW
  WHEN (NEW.status IN ('completed', 'canceled'))
  EXECUTE FUNCTION public.handle_challenge_completion();