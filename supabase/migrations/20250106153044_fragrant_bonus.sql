-- Create function to get community membership details
CREATE OR REPLACE FUNCTION get_community_membership_details(p_user_id uuid)
RETURNS TABLE (
    user_id uuid,
    community_id uuid,
    is_primary boolean,
    joined_at timestamptz,
    settings jsonb,
    user_name text,
    community_name text,
    member_count integer,
    community_description text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        cm.user_id,
        cm.community_id,
        cm.is_primary,
        cm.joined_at,
        cm.settings,
        u.name as user_name,
        c.name as community_name,
        c.member_count,
        c.description as community_description
    FROM community_memberships cm
    JOIN users u ON u.id = cm.user_id
    JOIN communities c ON c.id = cm.community_id
    WHERE cm.user_id = p_user_id
    ORDER BY cm.is_primary DESC, c.name ASC;
$$;