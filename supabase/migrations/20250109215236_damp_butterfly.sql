-- Update verification requirements for tc0 challenges
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