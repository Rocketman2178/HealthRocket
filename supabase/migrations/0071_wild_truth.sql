-- Drop existing policies and functions
DROP POLICY IF EXISTS "memberships_select" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_insert" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_update" ON public.community_memberships;
DROP FUNCTION IF EXISTS get_user_communities;
DROP FUNCTION IF EXISTS update_primary_community;

-- Create maximally simplified policies
CREATE POLICY "memberships_select" ON public.community_memberships
    FOR SELECT USING (true);  -- Allow all reads, filter in application

CREATE POLICY "memberships_insert" ON public.community_memberships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "memberships_update" ON public.community_memberships
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to get user communities
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

-- Create function to update primary community
CREATE OR REPLACE FUNCTION update_primary_community(
    p_user_id uuid,
    p_community_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result jsonb;
BEGIN
    -- Verify user permissions
    IF auth.uid() != p_user_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
    END IF;

    -- Verify membership exists
    IF NOT EXISTS (
        SELECT 1 FROM community_memberships 
        WHERE user_id = p_user_id AND community_id = p_community_id
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not a member of this community');
    END IF;

    -- Start transaction
    BEGIN
        -- Unset all primary flags for user
        UPDATE community_memberships
        SET is_primary = false
        WHERE user_id = p_user_id;

        -- Set new primary community
        UPDATE community_memberships
        SET is_primary = true
        WHERE user_id = p_user_id
        AND community_id = p_community_id;

        RETURN jsonb_build_object('success', true);
    EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', SQLERRM);
    END;
END;
$$;