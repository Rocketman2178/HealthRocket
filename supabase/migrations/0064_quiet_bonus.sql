-- Drop existing functions
DROP FUNCTION IF EXISTS get_global_leaderboard(timestamptz);
DROP FUNCTION IF EXISTS get_community_leaderboard(uuid, timestamptz);

-- Create global leaderboard function
CREATE OR REPLACE FUNCTION get_global_leaderboard(
    p_start_date timestamptz
)
RETURNS TABLE (
    user_id uuid,
    name text,
    avatar_url text,
    level integer,
    burn_streak integer,
    health_score numeric,
    healthspan_years numeric,
    plan text,
    total_fp bigint,
    rank bigint,
    community_name text,
    created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    WITH user_fp AS (
        SELECT 
            df.user_id,
            COALESCE(SUM(df.fp_earned), 0) as total_fp
        FROM daily_fp df
        WHERE df.date >= p_start_date::date
        GROUP BY df.user_id
    ),
    ranked_users AS (
        SELECT 
            u.id as user_id,
            u.name,
            u.avatar_url,
            u.level,
            u.burn_streak,
            u.health_score,
            u.healthspan_years,
            u.plan,
            COALESCE(uf.total_fp, u.fuel_points) as total_fp,
            c.name as community_name,
            u.created_at
        FROM users u
        LEFT JOIN user_fp uf ON uf.user_id = u.id
        LEFT JOIN community_memberships cm ON cm.user_id = u.id AND cm.is_primary = true
        LEFT JOIN communities c ON c.id = cm.community_id
        WHERE u.onboarding_completed = true
    )
    SELECT 
        user_id,
        name,
        avatar_url,
        level,
        burn_streak,
        health_score,
        healthspan_years,
        plan,
        total_fp,
        ROW_NUMBER() OVER (ORDER BY total_fp DESC) as rank,
        community_name,
        created_at
    FROM ranked_users
    ORDER BY total_fp DESC;
$$;

-- Create community leaderboard function
CREATE OR REPLACE FUNCTION get_community_leaderboard(
    p_community_id uuid,
    p_start_date timestamptz
)
RETURNS TABLE (
    user_id uuid,
    name text,
    avatar_url text,
    level integer,
    burn_streak integer,
    health_score numeric,
    healthspan_years numeric,
    plan text,
    total_fp bigint,
    rank bigint,
    community_name text,
    created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    WITH user_fp AS (
        SELECT 
            df.user_id,
            COALESCE(SUM(df.fp_earned), 0) as total_fp
        FROM daily_fp df
        WHERE df.date >= p_start_date::date
        GROUP BY df.user_id
    ),
    community_members AS (
        SELECT 
            cm.user_id,
            u.name,
            u.avatar_url,
            u.level,
            u.burn_streak,
            u.health_score,
            u.healthspan_years,
            u.plan,
            COALESCE(uf.total_fp, u.fuel_points) as total_fp,
            c.name as community_name,
            u.created_at
        FROM community_memberships cm
        JOIN users u ON u.id = cm.user_id
        LEFT JOIN user_fp uf ON uf.user_id = cm.user_id
        LEFT JOIN communities c ON c.id = cm.community_id
        WHERE cm.community_id = p_community_id
        AND cm.is_primary = true
    )
    SELECT 
        user_id,
        name,
        avatar_url,
        level,
        burn_streak,
        health_score,
        healthspan_years,
        plan,
        total_fp,
        ROW_NUMBER() OVER (ORDER BY total_fp DESC) as rank,
        community_name,
        created_at
    FROM community_members
    ORDER BY total_fp DESC;
$$;