-- Create verification_posts table
CREATE TABLE IF NOT EXISTS public.verification_posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id text NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    message_id uuid REFERENCES public.challenge_messages ON DELETE CASCADE NOT NULL,
    week_number integer NOT NULL CHECK (week_number BETWEEN 1 AND 3),
    created_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE(challenge_id, user_id, week_number)
);

-- Enable RLS
ALTER TABLE public.verification_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "verification_posts_select" ON public.verification_posts
    FOR SELECT USING (true);

CREATE POLICY "verification_posts_insert" ON public.verification_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

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
    v_week_number integer;
    v_requirements jsonb;
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

    -- Calculate current week
    v_week_number := LEAST(
        FLOOR(EXTRACT(EPOCH FROM (now() - v_challenge.started_at)) / (7 * 24 * 60 * 60)) + 1,
        3
    )::integer;

    -- Insert verification post
    INSERT INTO verification_posts (
        challenge_id,
        user_id,
        message_id,
        week_number
    ) VALUES (
        p_challenge_id,
        p_user_id,
        p_message_id,
        v_week_number
    );

    -- Update challenge verification requirements
    v_requirements := v_challenge.verification_requirements;
    v_requirements := jsonb_set(
        v_requirements,
        ARRAY['week' || v_week_number, 'completed'],
        '1'::jsonb
    );

    -- Calculate progress (1 point per completed week)
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
        'week', v_week_number,
        'progress', v_progress,
        'requirements', v_requirements
    );
END;
$$;