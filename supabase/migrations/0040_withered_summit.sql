-- Create communities table
CREATE TABLE IF NOT EXISTS public.communities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    member_count integer DEFAULT 0,
    settings jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create community_memberships table
CREATE TABLE IF NOT EXISTS public.community_memberships (
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    community_id uuid REFERENCES public.communities ON DELETE CASCADE NOT NULL,
    is_primary boolean DEFAULT false,
    joined_at timestamptz DEFAULT now(),
    global_leaderboard_opt_in boolean DEFAULT true,
    monthly_invite_allocation integer DEFAULT 0,
    invite_reset_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, community_id)
);

-- Create invite_codes table
CREATE TABLE IF NOT EXISTS public.invite_codes (
    code text PRIMARY KEY,
    community_id uuid REFERENCES public.communities ON DELETE CASCADE NOT NULL,
    type text NOT NULL CHECK (type IN ('ADMIN', 'USER')),
    creator_id uuid REFERENCES public.users ON DELETE SET NULL,
    expires_at timestamptz,
    used_by_id uuid REFERENCES public.users ON DELETE SET NULL,
    used_at timestamptz,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_memberships_user ON community_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_community_memberships_community ON community_memberships(community_id);
CREATE INDEX IF NOT EXISTS idx_invite_codes_community ON invite_codes(community_id);
CREATE INDEX IF NOT EXISTS idx_invite_codes_creator ON invite_codes(creator_id);

-- Enable RLS
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
    -- Communities policies
    CREATE POLICY "communities_select_policy" ON public.communities
        FOR SELECT USING (true);  -- Anyone can view communities

    CREATE POLICY "communities_insert_policy" ON public.communities
        FOR INSERT WITH CHECK (false);  -- Only through functions

    CREATE POLICY "communities_update_policy" ON public.communities
        FOR UPDATE USING (false);  -- Only through functions

    -- Community memberships policies
    CREATE POLICY "memberships_select_policy" ON public.community_memberships
        FOR SELECT USING (
            auth.uid() = user_id OR  -- Users can view their own memberships
            EXISTS (                  -- Community admins can view all memberships
                SELECT 1 
                FROM public.community_memberships cm
                WHERE cm.community_id = community_id 
                AND cm.user_id = auth.uid()
                AND (cm.settings->>'role')::text = 'admin'
            )
        );

    CREATE POLICY "memberships_insert_policy" ON public.community_memberships
        FOR INSERT WITH CHECK (auth.uid() = user_id);  -- Users can only insert their own memberships

    CREATE POLICY "memberships_update_policy" ON public.community_memberships
        FOR UPDATE USING (auth.uid() = user_id);  -- Users can only update their own memberships

    -- Invite codes policies
    CREATE POLICY "invite_codes_select_policy" ON public.invite_codes
        FOR SELECT USING (
            auth.uid() = creator_id OR  -- Creator can view their codes
            EXISTS (                     -- Community admins can view codes
                SELECT 1 
                FROM public.community_memberships cm
                WHERE cm.community_id = community_id 
                AND cm.user_id = auth.uid()
                AND (cm.settings->>'role')::text = 'admin'
            )
        );

    CREATE POLICY "invite_codes_insert_policy" ON public.invite_codes
        FOR INSERT WITH CHECK (
            EXISTS (                     -- Only admins can create invite codes
                SELECT 1 
                FROM public.community_memberships cm
                WHERE cm.community_id = community_id 
                AND cm.user_id = auth.uid()
                AND (cm.settings->>'role')::text = 'admin'
            )
        );

    CREATE POLICY "invite_codes_update_policy" ON public.invite_codes
        FOR UPDATE USING (
            auth.uid() = creator_id OR   -- Creator can update their codes
            EXISTS (                      -- Community admins can update codes
                SELECT 1 
                FROM public.community_memberships cm
                WHERE cm.community_id = community_id 
                AND cm.user_id = auth.uid()
                AND (cm.settings->>'role')::text = 'admin'
            )
        );
END $$;