/*
  # Add Community System

  1. New Tables
    - `communities`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `member_count` (integer)
      - `settings` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `community_memberships`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `community_id` (uuid, references communities)
      - `is_primary` (boolean)
      - `joined_at` (timestamptz)
      - `global_leaderboard_opt_in` (boolean)

    - `invite_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `community_id` (uuid, references communities)
      - `type` (text)
      - `creator_id` (uuid, references users)
      - `expires_at` (timestamptz)
      - `used_by_id` (uuid, references users)
      - `used_at` (timestamptz)
      - `is_active` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Create communities table
CREATE TABLE public.communities (
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
CREATE TABLE public.community_memberships (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    community_id uuid REFERENCES public.communities ON DELETE CASCADE NOT NULL,
    is_primary boolean DEFAULT false,
    joined_at timestamptz DEFAULT now(),
    global_leaderboard_opt_in boolean DEFAULT true,
    UNIQUE(user_id, community_id)
);

-- Create invite_codes table
CREATE TABLE public.invite_codes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    code text UNIQUE NOT NULL,
    community_id uuid REFERENCES public.communities ON DELETE CASCADE NOT NULL,
    type text NOT NULL CHECK (type IN ('single_use', 'multi_use', 'time_limited')),
    creator_id uuid REFERENCES public.users ON DELETE SET NULL,
    expires_at timestamptz,
    used_by_id uuid REFERENCES public.users ON DELETE SET NULL,
    used_at timestamptz,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX community_memberships_user_id_idx ON public.community_memberships(user_id);
CREATE INDEX community_memberships_community_id_idx ON public.community_memberships(community_id);
CREATE INDEX invite_codes_code_idx ON public.invite_codes(code);
CREATE INDEX invite_codes_community_id_idx ON public.invite_codes(community_id);

-- Enable RLS
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
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
            auth.uid() IN (          -- Community admins can view all memberships
                SELECT cm.user_id 
                FROM public.community_memberships cm
                WHERE cm.community_id = community_id 
                AND (settings->>'role')::text = 'admin'
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
            auth.uid() IN (              -- Community admins can view codes
                SELECT cm.user_id 
                FROM public.community_memberships cm
                WHERE cm.community_id = community_id 
                AND (settings->>'role')::text = 'admin'
            )
        );

    CREATE POLICY "invite_codes_insert_policy" ON public.invite_codes
        FOR INSERT WITH CHECK (
            auth.uid() IN (              -- Only admins can create invite codes
                SELECT cm.user_id 
                FROM public.community_memberships cm
                WHERE cm.community_id = community_id 
                AND (settings->>'role')::text = 'admin'
            )
        );

    CREATE POLICY "invite_codes_update_policy" ON public.invite_codes
        FOR UPDATE USING (
            auth.uid() = creator_id OR   -- Creator can update their codes
            auth.uid() IN (              -- Community admins can update codes
                SELECT cm.user_id 
                FROM public.community_memberships cm
                WHERE cm.community_id = community_id 
                AND (settings->>'role')::text = 'admin'
            )
        );
END $$;