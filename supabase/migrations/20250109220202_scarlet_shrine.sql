-- Create function to handle tc0 challenge creation
CREATE OR REPLACE FUNCTION handle_challenge_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Set verifications_required to 10 for tc0 challenges
    IF NEW.challenge_id = 'tc0' THEN
        NEW.verifications_required := 10;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for new challenges
DROP TRIGGER IF EXISTS set_challenge_requirements ON challenges;
CREATE TRIGGER set_challenge_requirements
    BEFORE INSERT ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION handle_challenge_creation();

-- Update existing tc0 challenges
UPDATE challenges
SET 
    verifications_required = 10,
    progress = LEAST((verification_count::numeric / 10 * 100), 100)  -- Recalculate progress based on new requirement
WHERE challenge_id = 'tc0'
AND status = 'active';

-- Create function to handle community membership
CREATE OR REPLACE FUNCTION join_community(
    p_user_id uuid,
    p_code text,
    p_set_primary boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_invite invite_codes%ROWTYPE;
    v_existing_membership community_memberships%ROWTYPE;
    v_membership_id uuid;
BEGIN
    -- Verify user exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User not found'
        );
    END IF;

    -- Get and validate invite code
    SELECT * INTO v_invite
    FROM invite_codes
    WHERE code = p_code AND is_active = true;

    IF v_invite.id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid invite code'
        );
    END IF;

    -- Check for existing membership
    SELECT * INTO v_existing_membership
    FROM community_memberships
    WHERE user_id = p_user_id AND community_id = v_invite.community_id;

    IF v_existing_membership.id IS NOT NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Already a member of this community'
        );
    END IF;

    -- Start transaction
    BEGIN
        -- If setting as primary, unset any existing primary memberships
        IF p_set_primary THEN
            UPDATE community_memberships
            SET is_primary = false
            WHERE user_id = p_user_id AND is_primary = true;
        END IF;

        -- Create membership
        INSERT INTO community_memberships (
            user_id,
            community_id,
            is_primary,
            global_leaderboard_opt_in
        )
        VALUES (
            p_user_id,
            v_invite.community_id,
            p_set_primary,
            true
        )
        RETURNING id INTO v_membership_id;

        -- Update invite code usage for single-use codes
        IF v_invite.type = 'single_use' THEN
            UPDATE invite_codes
            SET 
                used_by_id = p_user_id,
                used_at = now(),
                is_active = false
            WHERE id = v_invite.id;
        END IF;

        -- Update community member count
        UPDATE communities
        SET 
            member_count = member_count + 1,
            updated_at = now()
        WHERE id = v_invite.community_id;

        -- Return success response
        RETURN jsonb_build_object(
            'success', true,
            'membershipId', v_membership_id
        );

    EXCEPTION WHEN OTHERS THEN
        -- Rollback and return error
        RAISE;
    END;
END;
$$;

-- Log the changes
DO $$
DECLARE
    v_updated_count integer;
BEGIN
    SELECT COUNT(*)
    INTO v_updated_count
    FROM challenges
    WHERE challenge_id = 'tc0'
    AND status = 'active';

    RAISE NOTICE 'Updated % active tc0 challenges to require 10 verifications', v_updated_count;
END $$;