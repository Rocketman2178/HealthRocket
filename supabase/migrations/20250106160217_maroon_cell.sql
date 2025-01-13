-- Drop view if it exists
DROP VIEW IF EXISTS community_memberships_view;

-- Create function to get community memberships with details
CREATE OR REPLACE FUNCTION get_community_memberships()
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
    WHERE cm.user_id = auth.uid()
    ORDER BY cm.is_primary DESC, c.name ASC;
$$;