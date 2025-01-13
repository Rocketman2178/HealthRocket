-- Create trigger function to handle verification count updates
CREATE OR REPLACE FUNCTION increment_verification_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_new_count integer;
    v_progress numeric;
BEGIN
    -- Only proceed if this is a verification message
    IF NEW.is_verification = true THEN
        -- Get current count and calculate new values
        SELECT 
            COALESCE(verification_count, 0) + 1,
            LEAST(((COALESCE(verification_count, 0) + 1)::numeric / COALESCE(verifications_required, 3) * 100), 100)
        INTO v_new_count, v_progress
        FROM challenges
        WHERE challenge_id = NEW.challenge_id
        AND user_id = NEW.user_id
        AND status = 'active'
        FOR UPDATE;

        -- Update challenge with new count and progress
        UPDATE challenges
        SET 
            verification_count = v_new_count,
            progress = v_progress,
            updated_at = now()
        WHERE challenge_id = NEW.challenge_id
        AND user_id = NEW.user_id
        AND status = 'active';
    END IF;

    RETURN NEW;
END;
$$;

-- Create trigger on challenge_messages table
DROP TRIGGER IF EXISTS update_verification_count ON challenge_messages;
CREATE TRIGGER update_verification_count
    AFTER INSERT ON challenge_messages
    FOR EACH ROW
    EXECUTE FUNCTION increment_verification_count();