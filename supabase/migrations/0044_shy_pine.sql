-- Drop admin-related policies and functions
DROP POLICY IF EXISTS "memberships_select_as_admin" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_update_as_admin" ON public.community_memberships;
DROP FUNCTION IF EXISTS is_community_admin;
DROP INDEX IF EXISTS idx_community_memberships_admin;

-- Simplify community_memberships table
ALTER TABLE public.community_memberships 
DROP COLUMN IF EXISTS monthly_invite_allocation,
DROP COLUMN IF EXISTS invite_reset_at;

-- Update existing policies to focus on user's own data
DROP POLICY IF EXISTS "memberships_select_own" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_insert_own" ON public.community_memberships;
DROP POLICY IF EXISTS "memberships_update_own" ON public.community_memberships;

CREATE POLICY "memberships_select" ON public.community_memberships
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "memberships_insert" ON public.community_memberships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "memberships_update" ON public.community_memberships
    FOR UPDATE USING (auth.uid() = user_id);