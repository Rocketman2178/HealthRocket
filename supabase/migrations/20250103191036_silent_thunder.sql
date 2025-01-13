-- Add explicit type casting for verification_week
CREATE OR REPLACE FUNCTION update_challenge_verification(
    p_challenge_id text,
    p_user_id uuid,
    p_verification_week integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_challenge record;
    v_requirements jsonb;
    v_week_key text;
    v_progress numeric;
BEGIN
    -- Validate verification week
    IF p_verification_week NOT BETWEEN 1 AND 3 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid verification week');
    END IF;

    -- Get challenge details
    SELECT * INTO v_challenge
    FROM challenges
    WHERE challenge_id = p_challenge_id
    AND user_id = p_user_id
    AND status = 'active';

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Challenge not found');
    END IF;

    -- Construct week key
    v_week_key := 'week' || p_verification_week;

    -- Get current requirements
    v_requirements := v_challenge.verification_requirements;

    -- Update completion count for the week
    v_requirements := jsonb_set(
        v_requirements,
        ARRAY[v_week_key, 'completed'],
        (COALESCE((v_requirements->v_week_key->>'completed')::integer, 0) + 1)::text::jsonb
    );

    -- Calculate new progress percentage
    SELECT (
        (COALESCE((v_requirements->'week1'->>'completed')::integer, 0) > 0)::integer +
        (COALESCE((v_requirements->'week2'->>'completed')::integer, 0) > 0)::integer +
        (COALESCE((v_requirements->'week3'->>'completed')::integer, 0) > 0)::integer
    )::numeric * 100 / 3 INTO v_progress;

    -- Update challenge
    UPDATE challenges
    SET 
        verification_requirements = v_requirements,
        progress = v_progress,
        updated_at = now()
    WHERE challenge_id = p_challenge_id
    AND user_id = p_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'progress', v_progress,
        'requirements', v_requirements
    );
END;
$$;