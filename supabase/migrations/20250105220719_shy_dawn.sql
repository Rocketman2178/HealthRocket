-- Create function to get player profile data
CREATE OR REPLACE FUNCTION get_player_profile(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_profile jsonb;
BEGIN
    SELECT jsonb_build_object(
        'id', u.id,
        'name', u.name,
        'avatarUrl', u.avatar_url,
        'level', u.level,
        'healthScore', u.health_score,
        'healthspanYears', u.healthspan_years,
        'createdAt', u.created_at,
        'community', (
            SELECT c.name
            FROM community_memberships cm
            JOIN communities c ON c.id = cm.community_id
            WHERE cm.user_id = u.id
            AND cm.is_primary = true
            LIMIT 1
        )
    ) INTO v_profile
    FROM users u
    WHERE u.id = p_user_id;

    RETURN v_profile;
END;
$$;

-- Create index to optimize community lookups
CREATE INDEX IF NOT EXISTS idx_community_memberships_primary
ON community_memberships(user_id) 
WHERE is_primary = true;