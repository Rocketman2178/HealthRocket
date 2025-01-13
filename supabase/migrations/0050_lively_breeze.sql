-- Drop all existing policies
DROP POLICY IF EXISTS "memberships_select" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_insert" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_update" ON public.community_memberships;

-- Create maximally simplified policies
CREATE POLICY "memberships_select" ON public.community_memberships
    FOR SELECT USING (true);  -- Allow all reads, filter in application

CREATE POLICY "memberships_insert" ON public.community_memberships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "memberships_update" ON public.community_memberships
    FOR UPDATE USING (auth.uid() = user_id);

-- Optimize indexes
DROP INDEX IF EXISTS idx_community_memberships_lookup;
CREATE INDEX idx_memberships_user_primary ON public.community_memberships(user_id, is_primary);
CREATE INDEX idx_memberships_community ON public.community_memberships(community_id);

-- Create efficient view for primary memberships
CREATE OR REPLACE VIEW user_primary_community AS
SELECT 
    cm.user_id,
    c.id as community_id,
    c.name,
    c.description,
    c.member_count,
    c.settings
FROM community_memberships cm
JOIN communities c ON c.id = cm.community_id
WHERE cm.is_primary = true;