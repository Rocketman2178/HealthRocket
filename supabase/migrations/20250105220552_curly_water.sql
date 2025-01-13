-- Drop existing policies
DROP POLICY IF EXISTS "memberships_select" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_insert" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_update" ON public.community_memberships;

-- Create simplified policies without recursion
CREATE POLICY "memberships_select" ON public.community_memberships
    FOR SELECT USING (true);  -- Allow all reads, filter in application

CREATE POLICY "memberships_insert" ON public.community_memberships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "memberships_update" ON public.community_memberships
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to get user communities without recursion
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