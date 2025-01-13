-- Create function to handle tc0 challenge creation
CREATE OR REPLACE FUNCTION handle_challenge_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Set verifications_required to 10 for tc0 challenges
    IF NEW.challenge_id = 'tc0' THEN
        NEW.verifications_required := 10;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for new challenges
DROP TRIGGER IF EXISTS set_challenge_requirements ON challenges;
CREATE TRIGGER set_challenge_requirements
    BEFORE INSERT ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION handle_challenge_creation();

-- Update existing tc0 challenges
UPDATE challenges
SET 
    verifications_required = 10,
    progress = LEAST((verification_count::numeric / 10 * 100), 100)  -- Recalculate progress based on new requirement
WHERE challenge_id = 'tc0'
AND status = 'active';

-- Log the changes
DO $$
DECLARE
    v_updated_count integer;
BEGIN
    SELECT COUNT(*)
    INTO v_updated_count
    FROM challenges
    WHERE challenge_id = 'tc0'
    AND status = 'active';

    RAISE NOTICE 'Updated % active tc0 challenges to require 10 verifications', v_updated_count;
END $$;