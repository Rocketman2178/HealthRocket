-- Drop existing policies
DROP POLICY IF EXISTS "memberships_select_policy" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_insert_policy" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_update_policy" ON public.community_memberships;

-- Create new optimized policies
CREATE POLICY "memberships_select_policy" ON public.community_memberships
    FOR SELECT USING (
        -- Users can view their own memberships
        auth.uid() = user_id OR
        -- Admins can view memberships for their communities
        EXISTS (
            SELECT 1
            FROM public.community_memberships admin_membership
            WHERE admin_membership.user_id = auth.uid()
            AND admin_membership.community_id = community_id
            AND admin_membership.settings->>'role' = 'admin'
        )
    );

CREATE POLICY "memberships_insert_policy" ON public.community_memberships
    FOR INSERT WITH CHECK (
        -- Users can only insert their own memberships
        auth.uid() = user_id
    );

CREATE POLICY "memberships_update_policy" ON public.community_memberships
    FOR UPDATE USING (
        -- Users can update their own memberships
        auth.uid() = user_id OR
        -- Admins can update memberships in their communities
        EXISTS (
            SELECT 1
            FROM public.community_memberships admin_membership
            WHERE admin_membership.user_id = auth.uid()
            AND admin_membership.community_id = community_id
            AND admin_membership.settings->>'role' = 'admin'
        )
    );

-- Add index to improve policy performance
CREATE INDEX IF NOT EXISTS idx_community_memberships_admin 
ON public.community_memberships ((settings->>'role')) 
WHERE settings->>'role' = 'admin';