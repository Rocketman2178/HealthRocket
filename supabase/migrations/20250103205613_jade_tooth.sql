-- Drop existing functions
DROP FUNCTION IF EXISTS handle_verification_post;
DROP FUNCTION IF EXISTS get_verification_week;

-- Create function to get current verification stage (week)
CREATE OR REPLACE FUNCTION get_verification_stage(p_started_at timestamptz)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_days_since_start integer;
BEGIN
    -- Calculate days since challenge start
    v_days_since_start := EXTRACT(EPOCH FROM (now() - p_started_at)) / 86400;
    
    -- Return current stage (1-3)
    RETURN LEAST(FLOOR(v_days_since_start / 7) + 1, 3)::integer;
END;
$$;

-- Create improved verification post handler
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
    v_current_stage integer;
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

    -- Get current stage
    v_current_stage := get_verification_stage(v_challenge.started_at);

    -- Get current verification count
    v_verification_count := COALESCE(v_challenge.verification_count, 0);

    -- Check if we've already hit the maximum verifications
    IF v_verification_count >= COALESCE(v_challenge.verifications_required, 3) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Maximum verifications reached');
    END IF;

    -- Check if we already have a verification counted for this stage
    IF EXISTS (
        SELECT 1 FROM challenge_messages
        WHERE challenge_id = p_challenge_id
        AND user_id = p_user_id
        AND is_verification = true
        AND verification_week = v_current_stage
        AND id != p_message_id  -- Exclude current message
        AND created_at >= v_challenge.started_at + ((v_current_stage - 1) * interval '7 days')
        AND created_at < v_challenge.started_at + (v_current_stage * interval '7 days')
    ) THEN
        -- Allow the post but don't increment verification count
        UPDATE challenge_messages
        SET verification_week = v_current_stage
        WHERE id = p_message_id;

        RETURN jsonb_build_object(
            'success', true,
            'stage', v_current_stage,
            'verification_count', v_verification_count,
            'progress', v_progress,
            'message', 'Verification post added but stage already counted'
        );
    END IF;

    -- Update message with verification stage
    UPDATE challenge_messages
    SET verification_week = v_current_stage
    WHERE id = p_message_id;

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

    RETURN jsonb_build_object(
        'success', true,
        'stage', v_current_stage,
        'verification_count', v_verification_count,
        'progress', v_progress
    );
END;
$$;