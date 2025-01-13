-- Create function to handle daily FP sync and burn streak
CREATE OR REPLACE FUNCTION sync_daily_fp()
RETURNS trigger AS $$
DECLARE
    v_yesterday date := CURRENT_DATE - interval '1 day';
    v_had_boosts_yesterday boolean;
BEGIN
    -- Check if user had boosts yesterday
    SELECT EXISTS (
        SELECT 1 FROM completed_boosts
        WHERE user_id = NEW.user_id
        AND completed_date = v_yesterday
    ) INTO v_had_boosts_yesterday;

    -- Update user's burn streak and total fuel points
    UPDATE users
    SET 
        -- Increment streak if had boosts yesterday, reset if not
        burn_streak = CASE 
            WHEN v_had_boosts_yesterday THEN burn_streak + 1
            ELSE 0
        END,
        -- Add new FP to lifetime total
        fuel_points = fuel_points + NEW.fp_earned
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for daily FP sync
DROP TRIGGER IF EXISTS sync_daily_fp_trigger ON daily_fp;
CREATE TRIGGER sync_daily_fp_trigger
    AFTER INSERT OR UPDATE ON daily_fp
    FOR EACH ROW
    EXECUTE FUNCTION sync_daily_fp();

-- Create function to get current month's FP for leaderboards
CREATE OR REPLACE FUNCTION get_current_month_fp(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COALESCE(SUM(fp_earned), 0)::integer
    FROM daily_fp
    WHERE user_id = p_user_id
    AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE);
$$;

-- Update leaderboard functions to use current month FP
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
    WITH monthly_fp AS (
        SELECT 
            user_id,
            COALESCE(SUM(fp_earned), 0) as month_fp
        FROM daily_fp
        WHERE date >= date_trunc('month', CURRENT_DATE)
        GROUP BY user_id
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
            COALESCE(mf.month_fp, 0) as total_fp,
            c.name as community_name,
            u.created_at
        FROM community_memberships cm
        JOIN users u ON u.id = cm.user_id
        LEFT JOIN monthly_fp mf ON mf.user_id = cm.user_id
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