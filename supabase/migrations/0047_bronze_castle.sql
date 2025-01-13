-- Drop all existing policies
DROP POLICY IF EXISTS "memberships_select" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_insert" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_update" ON public.community_memberships;

-- Create simplified policies
CREATE POLICY "memberships_select" ON public.community_memberships
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "memberships_insert" ON public.community_memberships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "memberships_update" ON public.community_memberships
    FOR UPDATE USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_community_memberships_user_primary 
ON public.community_memberships(user_id, is_primary) 
WHERE is_primary = true;