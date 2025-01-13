-- Drop existing policies
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

-- Create function to update primary community
CREATE OR REPLACE FUNCTION update_primary_community(
    p_user_id uuid,
    p_community_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Verify user permissions
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Unauthorized';
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

        RETURN true;
    EXCEPTION WHEN OTHERS THEN
        RETURN false;
    END;
END;
$$;