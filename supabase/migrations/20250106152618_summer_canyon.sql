-- Create view for community memberships with user and community names
CREATE OR REPLACE VIEW community_memberships_view AS
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
JOIN communities c ON c.id = cm.community_id;

-- Enable RLS on the view
ALTER VIEW community_memberships_view SET (security_invoker = true);

-- Create policy for the view
CREATE POLICY "Users can view their own memberships"
    ON community_memberships_view
    FOR SELECT
    USING (auth.uid() = user_id);