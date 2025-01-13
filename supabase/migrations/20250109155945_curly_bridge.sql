-- Create trigger function to update challenge verification count
CREATE OR REPLACE FUNCTION update_challenge_verification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_challenge_id text;
    v_verification_count integer;
BEGIN
    -- Only proceed if this is a verification message
    IF NEW.is_verification = true THEN
        -- Extract challenge_id from chat_id (remove 'c_' prefix)
        v_challenge_id := substring(NEW.chat_id from 3);
        
        -- Get current verification count
        SELECT COUNT(*)
        INTO v_verification_count
        FROM chat_messages
        WHERE chat_id = NEW.chat_id
        AND user_id = NEW.user_id
        AND is_verification = true;

        -- Update challenge verification count and progress
        UPDATE challenges
        SET 
            verification_count = v_verification_count,
            progress = LEAST((v_verification_count::numeric / COALESCE(verifications_required, 3) * 100), 100),
            updated_at = now()
        WHERE challenge_id = v_challenge_id
        AND user_id = NEW.user_id
        AND status = 'active';
    END IF;

    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS update_verification_count ON chat_messages;
CREATE TRIGGER update_verification_count
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_challenge_verification();

-- Fix existing verification counts
DO $$
DECLARE
    v_challenge record;
    v_verification_count integer;
BEGIN
    FOR v_challenge IN (
        SELECT c.*, u.email
        FROM challenges c
        JOIN users u ON u.id = c.user_id
        WHERE c.status = 'active'
    ) LOOP
        -- Get actual verification count
        SELECT COUNT(*)
        INTO v_verification_count
        FROM chat_messages
        WHERE chat_id = 'c_' || v_challenge.challenge_id
        AND user_id = v_challenge.user_id
        AND is_verification = true;

        -- Update challenge
        UPDATE challenges
        SET 
            verification_count = v_verification_count,
            progress = LEAST((v_verification_count::numeric / COALESCE(verifications_required, 3) * 100), 100)
        WHERE id = v_challenge.id;

        -- Log the update
        RAISE NOTICE 'Updated challenge % for user %: Count=%', 
            v_challenge.challenge_id,
            v_challenge.email,
            v_verification_count;
    END LOOP;
END $$;