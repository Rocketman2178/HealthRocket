-- Create function to get community leaderboard with proper joins
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
    rank bigint
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
            COALESCE(uf.total_fp, 0) as total_fp
        FROM community_memberships cm
        JOIN users u ON u.id = cm.user_id
        LEFT JOIN user_fp uf ON uf.user_id = cm.user_id
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
        ROW_NUMBER() OVER (ORDER BY total_fp DESC) as rank
    FROM community_members
    ORDER BY total_fp DESC;
$$;