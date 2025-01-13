-- Add avatar_url column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create function to get community leaderboard with proper user fields
CREATE OR REPLACE FUNCTION get_community_leaderboard(
    p_community_id uuid,
    p_start_date timestamptz
)
RETURNS TABLE (
    user_id uuid,
    name text,
    level integer,
    burn_streak integer,
    total_fp bigint,
    rank bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    WITH monthly_totals AS (
        SELECT 
            cm.user_id,
            u.name,
            u.level,
            u.burn_streak,
            COALESCE(SUM(df.fp_earned), 0) as total_fp
        FROM community_memberships cm
        JOIN users u ON u.id = cm.user_id
        LEFT JOIN daily_fp df ON df.user_id = cm.user_id 
            AND df.date >= p_start_date::date
        WHERE cm.community_id = p_community_id
        AND cm.is_primary = true
        GROUP BY cm.user_id, u.name, u.level, u.burn_streak
    )
    SELECT 
        mt.user_id,
        mt.name,
        mt.level,
        mt.burn_streak,
        mt.total_fp,
        ROW_NUMBER() OVER (ORDER BY mt.total_fp DESC) as rank
    FROM monthly_totals mt
    ORDER BY mt.total_fp DESC;
$$;