-- Create completed quests table
CREATE TABLE IF NOT EXISTS public.completed_quests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  quest_id text NOT NULL,
  completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  fp_earned integer NOT NULL DEFAULT 0,
  challenges_completed integer NOT NULL DEFAULT 0,
  boosts_completed integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'completed'
    CHECK (status IN ('completed', 'canceled'))
);

-- Create completed challenges table
CREATE TABLE IF NOT EXISTS public.completed_challenges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  challenge_id text NOT NULL,
  quest_id text,  -- Optional reference to parent quest
  completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  fp_earned integer NOT NULL DEFAULT 0,
  days_to_complete integer NOT NULL,
  final_progress numeric(5,2) NOT NULL,
  status text NOT NULL DEFAULT 'completed'
    CHECK (status IN ('completed', 'canceled'))
);

-- Enable RLS
ALTER TABLE public.completed_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_challenges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own completed quests"
  ON public.completed_quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed quests"
  ON public.completed_quests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own completed challenges"
  ON public.completed_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed challenges"
  ON public.completed_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_completed_quests_user_id 
ON public.completed_quests(user_id);

CREATE INDEX IF NOT EXISTS idx_completed_challenges_user_id
ON public.completed_challenges(user_id);

-- Create completion trigger functions
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
DROP TRIGGER IF EXISTS on_quest_completion ON public.quests;
CREATE TRIGGER on_quest_completion
  AFTER UPDATE OF status ON public.quests
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION public.handle_quest_completion();

DROP TRIGGER IF EXISTS on_challenge_completion ON public.challenges;
CREATE TRIGGER on_challenge_completion
  AFTER UPDATE OF status ON public.challenges
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION public.handle_challenge_completion();