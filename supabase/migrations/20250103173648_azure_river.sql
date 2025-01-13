-- Add verification tracking columns to challenges table
ALTER TABLE public.challenges
ADD COLUMN verification_requirements jsonb DEFAULT jsonb_build_object(
  'week1', jsonb_build_object('required', 1, 'completed', 0, 'deadline', NULL),
  'week2', jsonb_build_object('required', 1, 'completed', 0, 'deadline', NULL),
  'week3', jsonb_build_object('required', 1, 'completed', 0, 'deadline', NULL)
);

-- Add verification tracking columns to challenge_messages table
ALTER TABLE public.challenge_messages
ADD COLUMN verification_week integer CHECK (verification_week BETWEEN 1 AND 3);

-- Create function to update challenge verification progress
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
    v_progress := (
        SELECT (
            (COALESCE((v_requirements->'week1'->>'completed')::integer, 0) > 0)::integer +
            (COALESCE((v_requirements->'week2'->>'completed')::integer, 0) > 0)::integer +
            (COALESCE((v_requirements->'week3'->>'completed')::integer, 0) > 0)::integer
        )::numeric / 3 * 100;
    );

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

-- Create function to initialize challenge verification deadlines
CREATE OR REPLACE FUNCTION initialize_verification_deadlines(
    p_challenge_id text,
    p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_start_date timestamptz;
BEGIN
    -- Get challenge start date
    SELECT started_at INTO v_start_date
    FROM challenges
    WHERE challenge_id = p_challenge_id
    AND user_id = p_user_id;

    -- Update verification deadlines
    UPDATE challenges
    SET verification_requirements = jsonb_build_object(
        'week1', jsonb_build_object(
            'required', 1,
            'completed', 0,
            'deadline', v_start_date + interval '7 days'
        ),
        'week2', jsonb_build_object(
            'required', 1,
            'completed', 0,
            'deadline', v_start_date + interval '14 days'
        ),
        'week3', jsonb_build_object(
            'required', 1,
            'completed', 0,
            'deadline', v_start_date + interval '21 days'
        )
    )
    WHERE challenge_id = p_challenge_id
    AND user_id = p_user_id;
END;
$$;

-- Create function to check verification deadlines
CREATE OR REPLACE FUNCTION check_verification_deadlines()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Cancel challenges that missed verification deadlines
    UPDATE challenges
    SET 
        status = 'canceled',
        updated_at = now()
    WHERE status = 'active'
    AND (
        -- Week 1 deadline passed without verification
        (
            (verification_requirements->'week1'->>'deadline')::timestamptz < now()
            AND (verification_requirements->'week1'->>'completed')::integer = 0
        )
        OR
        -- Week 2 deadline passed without verification
        (
            (verification_requirements->'week2'->>'deadline')::timestamptz < now()
            AND (verification_requirements->'week2'->>'completed')::integer = 0
        )
        OR
        -- Week 3 deadline passed without verification
        (
            (verification_requirements->'week3'->>'deadline')::timestamptz < now()
            AND (verification_requirements->'week3'->>'completed')::integer = 0
        )
    );
END;
$$;