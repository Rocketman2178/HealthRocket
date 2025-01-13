-- Create function to get actual verification count
CREATE OR REPLACE FUNCTION get_challenge_verification_count(p_challenge_id text, p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(*)::integer
    FROM chat_messages
    WHERE chat_id = 'c_' || p_challenge_id
    AND user_id = p_user_id
    AND is_verification = true;
$$;

-- Fix verification counts for all challenges
DO $$
DECLARE
    v_challenge record;
BEGIN
    FOR v_challenge IN (
        SELECT c.*, u.email
        FROM challenges c
        JOIN users u ON u.id = c.user_id
        WHERE c.status = 'active'
    ) LOOP
        -- Get actual verification count
        UPDATE challenges
        SET verification_count = (
            SELECT get_challenge_verification_count(
                challenge_id,
                user_id
            )
        ),
        progress = LEAST((
            SELECT get_challenge_verification_count(
                challenge_id,
                user_id
            )::numeric / COALESCE(verifications_required, 3) * 100
        ), 100)
        WHERE id = v_challenge.id;

        -- Log the update
        RAISE NOTICE 'Updated challenge % for user %: Count=%', 
            v_challenge.challenge_id,
            v_challenge.email,
            (SELECT get_challenge_verification_count(
                v_challenge.challenge_id,
                v_challenge.user_id
            ));
    END LOOP;
END $$;