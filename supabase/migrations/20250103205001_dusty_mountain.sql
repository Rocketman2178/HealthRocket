-- Drop existing functions
DROP FUNCTION IF EXISTS handle_verification_post;
DROP FUNCTION IF EXISTS is_verification_stage;

-- Create improved verification stage check function
CREATE OR REPLACE FUNCTION is_verification_stage(
    p_started_at timestamptz,
    p_stage_pattern text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_days_since_start integer;
BEGIN
    -- Calculate days since challenge start
    v_days_since_start := EXTRACT(EPOCH FROM (now() - p_started_at)) / 86400;
    
    -- Allow verification on days 0-1, 7-8, 14-15 (giving a 48-hour window each week)
    RETURN (v_days_since_start BETWEEN 0 AND 1) OR
           (v_days_since_start BETWEEN 7 AND 8) OR
           (v_days_since_start BETWEEN 14 AND 15);
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

    -- Check if in verification stage
    IF NOT is_verification_stage(v_challenge.started_at, v_challenge.verification_stages) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not in verification stage');
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

    RETURN jsonb_build_object(
        'success', true,
        'verification_count', v_verification_count,
        'progress', v_progress
    );
END;
$$;