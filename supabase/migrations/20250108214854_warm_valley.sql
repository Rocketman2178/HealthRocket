-- Create function to handle verification posts
CREATE OR REPLACE FUNCTION handle_verification_post(
    p_challenge_id text,
    p_user_id uuid,
    p_message_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_challenge record;
    v_verification_count integer;
    v_progress numeric;
BEGIN
    -- Get challenge details with FOR UPDATE to prevent race conditions
    SELECT * INTO v_challenge
    FROM challenges
    WHERE challenge_id = p_challenge_id
    AND user_id = p_user_id
    AND status = 'active'
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Challenge not found');
    END IF;

    -- Get current verification count
    v_verification_count := COALESCE(v_challenge.verification_count, 0);

    -- Check if we've already hit the maximum verifications
    IF v_verification_count >= COALESCE(v_challenge.verifications_required, 3) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Maximum verifications reached');
    END IF;

    -- Increment verification count
    v_verification_count := v_verification_count + 1;
    
    -- Calculate new progress
    v_progress := LEAST((v_verification_count::numeric / COALESCE(v_challenge.verifications_required, 3) * 100), 100);

    -- Update challenge
    UPDATE challenges
    SET 
        verification_count = v_verification_count,
        progress = v_progress,
        updated_at = now()
    WHERE challenge_id = p_challenge_id
    AND user_id = p_user_id;

    -- Update message to mark it as a verification
    UPDATE chat_messages
    SET is_verification = true
    WHERE id = p_message_id;

    RETURN jsonb_build_object(
        'success', true,
        'verification_count', v_verification_count,
        'progress', v_progress
    );
END;
$$;

-- Create trigger function to handle verification messages
CREATE OR REPLACE FUNCTION handle_chat_verification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only handle verification messages
    IF NEW.is_verification = true THEN
        -- Extract challenge_id from chat_id (remove 'c_' prefix)
        PERFORM handle_verification_post(
            substring(NEW.chat_id from 3),
            NEW.user_id,
            NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger for chat messages
DROP TRIGGER IF EXISTS chat_verification_trigger ON chat_messages;
CREATE TRIGGER chat_verification_trigger
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    WHEN (NEW.is_verification = true)
    EXECUTE FUNCTION handle_chat_verification();