-- Drop existing policies
DROP POLICY IF EXISTS "memberships_select_policy" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_insert_policy" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_update_policy" ON public.community_memberships;

-- Add admin role index if it doesn't exist
DROP INDEX IF EXISTS idx_community_memberships_admin;
CREATE INDEX idx_community_memberships_admin 
ON public.community_memberships USING btree (community_id) 
WHERE (settings->>'role' = 'admin');

-- Create simplified policies
CREATE POLICY "memberships_select_own" ON public.community_memberships
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "memberships_select_as_admin" ON public.community_memberships
    FOR SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.community_memberships admins
            WHERE admins.user_id = auth.uid()
            AND admins.community_id = community_id
            AND admins.settings->>'role' = 'admin'
        )
    );

CREATE POLICY "memberships_insert_own" ON public.community_memberships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "memberships_update_own" ON public.community_memberships
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "memberships_update_as_admin" ON public.community_memberships
    FOR UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.community_memberships admins
            WHERE admins.user_id = auth.uid()
            AND admins.community_id = community_id
            AND admins.settings->>'role' = 'admin'
        )
    );

-- Create helper function to check admin status
CREATE OR REPLACE FUNCTION is_community_admin(p_user_id uuid, p_community_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM community_memberships
        WHERE user_id = p_user_id
        AND community_id = p_community_id
        AND settings->>'role' = 'admin'
    );
$$;