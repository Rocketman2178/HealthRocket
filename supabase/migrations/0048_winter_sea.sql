-- Drop all existing policies
DROP POLICY IF EXISTS "memberships_select" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_insert" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_update" ON public.community_memberships;

-- Create final simplified policies
CREATE POLICY "memberships_select" ON public.community_memberships
    FOR SELECT USING (true);  -- Allow all reads, filtering happens in application

CREATE POLICY "memberships_insert" ON public.community_memberships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "memberships_update" ON public.community_memberships
    FOR UPDATE USING (auth.uid() = user_id);

-- Optimize indexes
DROP INDEX IF EXISTS idx_community_memberships_user_primary;
CREATE INDEX idx_community_memberships_lookup 
ON public.community_memberships(user_id, is_primary, community_id);

-- Add function to safely get primary community
CREATE OR REPLACE FUNCTION get_primary_community(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_community jsonb;
BEGIN
    SELECT jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'description', c.description,
        'member_count', c.member_count
    ) INTO v_community
    FROM community_memberships cm
    JOIN communities c ON c.id = cm.community_id
    WHERE cm.user_id = p_user_id
    AND cm.is_primary = true;

    RETURN v_community;
END;
$$;