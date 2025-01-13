-- Add index to improve query performance for active challenges
CREATE INDEX IF NOT EXISTS idx_active_challenges 
ON public.challenges(user_id, challenge_id) 
WHERE status = 'active';

-- Add function to validate challenge creation
CREATE OR REPLACE FUNCTION public.validate_challenge_creation()
RETURNS trigger AS $$
BEGIN
  -- Check if challenge already exists as active
  IF EXISTS (
    SELECT 1 FROM public.challenges 
    WHERE user_id = NEW.user_id 
    AND challenge_id = NEW.challenge_id
    AND status = 'active'
  ) THEN
    RETURN NULL; -- Silently prevent duplicate active challenges
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for challenge validation
DROP TRIGGER IF EXISTS validate_challenge_creation ON public.challenges;
CREATE TRIGGER validate_challenge_creation
  BEFORE INSERT ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_challenge_creation();