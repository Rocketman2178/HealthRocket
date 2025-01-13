-- Drop existing function
DROP FUNCTION IF EXISTS handle_verification_post;

-- Create simplified verification post handler
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

    -- Increment verification count
    UPDATE challenges
    SET 
        verification_count = COALESCE(verification_count, 0) + 1,
        progress = LEAST(((COALESCE(verification_count, 0) + 1)::numeric / COALESCE(verifications_required, 3) * 100), 100),
        updated_at = now()
    WHERE challenge_id = p_challenge_id
    AND user_id = p_user_id
    RETURNING verification_count INTO v_verification_count;

    -- Calculate progress
    v_progress := LEAST((v_verification_count::numeric / COALESCE(v_challenge.verifications_required, 3) * 100), 100);

    RETURN jsonb_build_object(
        'success', true,
        'verification_count', v_verification_count,
        'progress', v_progress
    );
END;
$$;