-- Update handling of canceled activities

-- Add function to handle activity deletion
CREATE OR REPLACE FUNCTION public.handle_activity_deletion()
RETURNS trigger AS $$
BEGIN
  -- For canceled activities, simply delete the record
  IF NEW.status = 'canceled' THEN
    DELETE FROM public.quests 
    WHERE id = OLD.id;
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to handle challenge deletion
CREATE OR REPLACE FUNCTION public.handle_challenge_deletion()
RETURNS trigger AS $$
BEGIN
  -- For canceled challenges, simply delete the record
  IF NEW.status = 'canceled' THEN
    DELETE FROM public.challenges 
    WHERE id = OLD.id;
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for deletion
CREATE TRIGGER on_quest_canceled
  BEFORE UPDATE OF status ON public.quests
  FOR EACH ROW
  WHEN (NEW.status = 'canceled')
  EXECUTE FUNCTION public.handle_activity_deletion();

CREATE TRIGGER on_challenge_canceled
  BEFORE UPDATE OF status ON public.challenges
  FOR EACH ROW
  WHEN (NEW.status = 'canceled')
  EXECUTE FUNCTION public.handle_challenge_deletion();

-- Clean up any existing canceled activities
DELETE FROM public.quests WHERE status = 'canceled';
DELETE FROM public.challenges WHERE status = 'canceled';