-- Add new verification columns to challenges table
ALTER TABLE public.challenges
ADD COLUMN IF NOT EXISTS verifications_required integer DEFAULT 3,
ADD COLUMN IF NOT EXISTS verification_stages text DEFAULT 'every 7 days since start',
ADD COLUMN IF NOT EXISTS verification_count integer DEFAULT 0;

-- Create function to check verification stage eligibility
CREATE OR REPLACE FUNCTION is_verification_stage(
    p_started_at timestamptz,
    p_stage_pattern text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_days_since_start integer;
BEGIN
    v_days_since_start := EXTRACT(EPOCH FROM (now() - p_started_at)) / 86400;
    
    CASE p_stage_pattern
        WHEN 'every 7 days since start' THEN
            RETURN v_days_since_start % 7 = 0;
        WHEN 'every 3 days since start' THEN
            RETURN v_days_since_start % 3 = 0;
        WHEN 'every day since start' THEN
            RETURN true;
        ELSE
            RETURN false;
    END CASE;
END;
$$;

-- Create function to handle verification posts
CREATE OR REPLACE FUNCTION handle_verification_post(
    p_challenge_id text,
    p_user_id uuid,
    p_message_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_challenge record;
    v_verification_count integer;
    v_progress numeric;
BEGIN
    -- Get challenge details
    SELECT * INTO v_challenge
    FROM challenges
    WHERE challenge_id = p_challenge_id
    AND user_id = p_user_id
    AND status = 'active';

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Challenge not found');
    END IF;

    -- Check if in verification stage
    IF NOT is_verification_stage(v_challenge.started_at, v_challenge.verification_stages) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not in verification stage');
    END IF;

    -- Increment verification count
    UPDATE challenges
    SET 
        verification_count = verification_count + 1,
        progress = LEAST((verification_count + 1)::numeric / verifications_required * 100, 100),
        updated_at = now()
    WHERE challenge_id = p_challenge_id
    AND user_id = p_user_id
    RETURNING verification_count INTO v_verification_count;

    -- Calculate progress
    v_progress := LEAST((v_verification_count::numeric / v_challenge.verifications_required * 100), 100);

    RETURN jsonb_build_object(
        'success', true,
        'verification_count', v_verification_count,
        'progress', v_progress
    );
END;
$$;