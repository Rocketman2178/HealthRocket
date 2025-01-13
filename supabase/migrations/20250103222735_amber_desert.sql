-- Drop existing trigger and function
DROP TRIGGER IF EXISTS update_verification_count ON challenge_messages;
DROP FUNCTION IF EXISTS increment_verification_count CASCADE;

-- Create improved trigger function
CREATE OR REPLACE FUNCTION increment_verification_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_challenge record;
    v_new_count integer;
    v_progress numeric;
BEGIN
    -- Only proceed if this is a verification message
    IF NEW.is_verification = true THEN
        -- Get challenge details with locking
        SELECT * INTO v_challenge
        FROM challenges
        WHERE challenge_id = NEW.challenge_id
        AND user_id = NEW.user_id
        AND status = 'active'
        FOR UPDATE;

        IF FOUND THEN
            -- Calculate new values
            v_new_count := COALESCE(v_challenge.verification_count, 0) + 1;
            v_progress := LEAST((v_new_count::numeric / COALESCE(v_challenge.verifications_required, 3) * 100), 100);

            -- Update challenge
            UPDATE challenges
            SET 
                verification_count = v_new_count,
                progress = v_progress
            WHERE challenge_id = NEW.challenge_id
            AND user_id = NEW.user_id
            AND status = 'active';

            -- Log verification update for debugging
            RAISE NOTICE 'Updated verification count to % for challenge %', v_new_count, NEW.challenge_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- Create new trigger
CREATE TRIGGER update_verification_count
    AFTER INSERT ON challenge_messages
    FOR EACH ROW
    EXECUTE FUNCTION increment_verification_count();