-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS validate_quest_status ON public.quests;
DROP TRIGGER IF EXISTS validate_challenge_status ON public.challenges;
DROP TRIGGER IF EXISTS on_quest_completion ON public.quests;
DROP TRIGGER IF EXISTS on_challenge_completion ON public.challenges;
DROP FUNCTION IF EXISTS public.validate_status_transition();
DROP FUNCTION IF EXISTS public.handle_quest_completion();
DROP FUNCTION IF EXISTS public.handle_challenge_completion();

-- Simplify quests table
ALTER TABLE public.quests
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS completed_at;

-- Simplify challenges table
ALTER TABLE public.challenges
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS completed_at;

-- Add delete policies
CREATE POLICY "Users can delete own quests"
  ON public.quests FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges"
  ON public.challenges FOR DELETE
  USING (auth.uid() = user_id);