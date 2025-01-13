-- Add verification tracking function with simplified approach
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
    -- Get challenge details
    SELECT * INTO v_challenge
    FROM challenges
    WHERE challenge_id = p_challenge_id
    AND user_id = p_user_id
    AND status = 'active';

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Challenge not found');
    END IF;

    -- Update message verification week
    UPDATE challenge_messages
    SET verification_week = p_verification_week
    WHERE challenge_id = p_challenge_id
    AND user_id = p_user_id
    AND is_verification = true
    AND id = (
        SELECT id FROM challenge_messages 
        WHERE challenge_id = p_challenge_id 
        AND user_id = p_user_id
        ORDER BY created_at DESC 
        LIMIT 1
    );

    -- Update challenge verification requirements
    v_week_key := 'week' || p_verification_week;
    v_requirements := v_challenge.verification_requirements;
    
    -- Update completion count
    v_requirements := jsonb_set(
        v_requirements,
        ARRAY[v_week_key, 'completed'],
        (COALESCE((v_requirements->v_week_key->>'completed')::integer, 0) + 1)::text::jsonb
    );

    -- Calculate progress
    v_progress := (
        (COALESCE((v_requirements->'week1'->>'completed')::integer, 0) > 0)::integer +
        (COALESCE((v_requirements->'week2'->>'completed')::integer, 0) > 0)::integer +
        (COALESCE((v_requirements->'week3'->>'completed')::integer, 0) > 0)::integer
    )::numeric * 100 / 3;

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