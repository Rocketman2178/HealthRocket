-- Drop existing policies and functions
DROP POLICY IF EXISTS "memberships_select" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_insert" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_update" ON public.community_memberships;
DROP FUNCTION IF EXISTS get_user_communities;

-- Create maximally simplified policies
CREATE POLICY "memberships_select" ON public.community_memberships
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "memberships_insert" ON public.community_memberships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "memberships_update" ON public.community_memberships
    FOR UPDATE USING (auth.uid() = user_id);

-- Create optimized function to get user's communities
CREATE OR REPLACE FUNCTION get_user_communities(p_user_id uuid)
RETURNS TABLE (
    community_id uuid,
    name text,
    description text,
    member_count integer,
    settings jsonb,
    is_primary boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        c.id as community_id,
        c.name,
        c.description,
        c.member_count,
        c.settings,
        cm.is_primary
    FROM community_memberships cm
    JOIN communities c ON c.id = cm.community_id
    WHERE cm.user_id = p_user_id
    ORDER BY cm.is_primary DESC, c.name ASC;
$$;

-- Create function to get player communities for profile
CREATE OR REPLACE FUNCTION get_player_communities(p_user_id uuid)
RETURNS TABLE (
    id uuid,
    name text,
    is_primary boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        c.id,
        c.name,
        cm.is_primary
    FROM community_memberships cm
    JOIN communities c ON c.id = cm.community_id
    WHERE cm.user_id = p_user_id
    ORDER BY cm.is_primary DESC, c.name ASC;
$$;