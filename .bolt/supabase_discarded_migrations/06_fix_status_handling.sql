-- Add status type if it doesn't exist
DO $$ BEGIN
  CREATE TYPE activity_status AS ENUM ('active', 'completed', 'canceled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update quests table
ALTER TABLE public.quests 
  ALTER COLUMN status TYPE activity_status 
  USING status::activity_status;

ALTER TABLE public.quests
  ALTER COLUMN status SET DEFAULT 'active'::activity_status;

-- Update challenges table
ALTER TABLE public.challenges 
  ALTER COLUMN status TYPE activity_status 
  USING status::activity_status;

ALTER TABLE public.challenges
  ALTER COLUMN status SET DEFAULT 'active'::activity_status;

-- Update trigger functions to handle cancellation
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