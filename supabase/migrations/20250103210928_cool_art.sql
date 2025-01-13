-- Add verification_info column to challenge_messages
ALTER TABLE public.challenge_messages
ADD COLUMN verification_info jsonb DEFAULT NULL;

-- Create function to handle verification posts
CREATE OR REPLACE FUNCTION handle_verification_post(
    p_challenge_id text,
    p_user_id uuid,
    p_message_id uuid,
    p_verification_week integer
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
    -- Validate verification week
    IF p_verification_week NOT BETWEEN 1 AND 3 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid verification week');
    END IF;

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

    -- Check if this week has already been verified
    IF EXISTS (
        SELECT 1 FROM challenge_messages
        WHERE challenge_id = p_challenge_id
        AND user_id = p_user_id
        AND is_verification = true
        AND verification_info->>'week' = p_verification_week::text
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Week ' || p_verification_week || ' has already been verified');
    END IF;

    -- Update message with verification info
    UPDATE challenge_messages
    SET 
        verification_info = jsonb_build_object(
            'week', p_verification_week,
            'verified_at', now()
        )
    WHERE id = p_message_id;

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
        'progress', v_progress,
        'week', p_verification_week
    );
END;
$$;