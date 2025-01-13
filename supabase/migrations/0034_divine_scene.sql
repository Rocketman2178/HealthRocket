/*
  # Add Community System Functions

  1. Functions
    - validate_invite_code: Validates an invite code and returns community info
    - join_community: Handles community joining logic with invite code
    - create_invite_code: Creates new invite codes with proper validation
    - update_community_stats: Updates member count and other community stats
*/

-- Function to validate invite code
CREATE OR REPLACE FUNCTION validate_invite_code(p_code text)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_invite invite_codes%ROWTYPE;
    v_community communities%ROWTYPE;
BEGIN
    -- Get invite code details
    SELECT * INTO v_invite
    FROM invite_codes
    WHERE code = p_code AND is_active = true;

    -- Check if code exists and is valid
    IF v_invite.id IS NULL THEN
        RETURN jsonb_build_object(
            'isValid', false,
            'error', 'Invalid invite code'
        );
    END IF;

    -- Check if code is expired
    IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < now() THEN
        RETURN jsonb_build_object(
            'isValid', false,
            'error', 'Invite code has expired'
        );
    END IF;

    -- Check if single-use code is already used
    IF v_invite.type = 'single_use' AND v_invite.used_by_id IS NOT NULL THEN
        RETURN jsonb_build_object(
            'isValid', false,
            'error', 'Invite code has already been used'
        );
    END IF;

    -- Get community details
    SELECT * INTO v_community
    FROM communities
    WHERE id = v_invite.community_id;

    -- Check if community is active
    IF NOT v_community.is_active THEN
        RETURN jsonb_build_object(
            'isValid', false,
            'error', 'Community is not active'
        );
    END IF;

    -- Return success with community details
    RETURN jsonb_build_object(
        'isValid', true,
        'community', jsonb_build_object(
            'id', v_community.id,
            'name', v_community.name,
            'description', v_community.description,
            'memberCount', v_community.member_count
        )
    );
END;
$$;

-- Function to join community
CREATE OR REPLACE FUNCTION join_community(
    p_user_id uuid,
    p_code text,
    p_set_primary boolean DEFAULT false
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_invite invite_codes%ROWTYPE;
    v_existing_membership community_memberships%ROWTYPE;
    v_membership_id uuid;
BEGIN
    -- Verify user permissions
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Unauthorized';
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

-- Function to create invite code
CREATE OR REPLACE FUNCTION create_invite_code(
    p_community_id uuid,
    p_type text,
    p_expires_at timestamptz DEFAULT NULL
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_creator_role text;
    v_code text;
    v_invite_id uuid;
BEGIN
    -- Check if user is admin of community
    SELECT settings->>'role' INTO v_creator_role
    FROM community_memberships
    WHERE user_id = auth.uid()
    AND community_id = p_community_id;

    IF v_creator_role != 'admin' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Only community admins can create invite codes'
        );
    END IF;

    -- Generate unique invite code
    v_code := encode(gen_random_bytes(6), 'base64');
    v_code := replace(replace(replace(v_code, '/', ''), '+', ''), '=', '');

    -- Create invite code
    INSERT INTO invite_codes (
        code,
        community_id,
        type,
        creator_id,
        expires_at
    )
    VALUES (
        v_code,
        p_community_id,
        p_type,
        auth.uid(),
        p_expires_at
    )
    RETURNING id INTO v_invite_id;

    -- Return success response
    RETURN jsonb_build_object(
        'success', true,
        'inviteCode', v_code,
        'id', v_invite_id
    );
END;
$$;

-- Function to update community stats
CREATE OR REPLACE FUNCTION update_community_stats(p_community_id uuid)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE communities
    SET 
        member_count = (
            SELECT count(*)
            FROM community_memberships
            WHERE community_id = p_community_id
        ),
        updated_at = now()
    WHERE id = p_community_id;
END;
$$;