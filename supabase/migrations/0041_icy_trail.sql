-- Drop existing policies
DROP POLICY IF EXISTS "memberships_select_policy" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_insert_policy" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_update_policy" ON public.community_memberships;

-- Create new policies without circular references
CREATE POLICY "memberships_select_policy" ON public.community_memberships
    FOR SELECT USING (
        -- Users can view their own memberships
        auth.uid() = user_id OR
        -- Admins can view memberships for their communities
        community_id IN (
            SELECT cm.community_id
            FROM public.community_memberships cm
            WHERE cm.user_id = auth.uid()
            AND cm.settings->>'role' = 'admin'
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
        community_id IN (
            SELECT cm.community_id
            FROM public.community_memberships cm
            WHERE cm.user_id = auth.uid()
            AND cm.settings->>'role' = 'admin'
        )
    );