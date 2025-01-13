-- Create monthly_fp_totals table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.monthly_fp_totals (
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL CHECK (month BETWEEN 1 AND 12),
    total_fp integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, year, month)
);

-- Enable RLS
ALTER TABLE public.monthly_fp_totals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own monthly totals"
ON public.monthly_fp_totals
FOR SELECT
USING (auth.uid() = user_id);

-- Create function to update monthly totals
CREATE OR REPLACE FUNCTION update_monthly_fp_total()
RETURNS trigger AS $$
BEGIN
    -- Insert or update monthly total
    INSERT INTO monthly_fp_totals (
        user_id,
        year,
        month,
        total_fp
    )
    VALUES (
        NEW.user_id,
        EXTRACT(year FROM NEW.date),
        EXTRACT(month FROM NEW.date),
        NEW.fp_earned
    )
    ON CONFLICT (user_id, year, month)
    DO UPDATE SET
        total_fp = monthly_fp_totals.total_fp + NEW.fp_earned,
        updated_at = now();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for monthly FP totals
DROP TRIGGER IF EXISTS update_monthly_fp_totals_trigger ON daily_fp;
CREATE TRIGGER update_monthly_fp_totals_trigger
    AFTER INSERT ON daily_fp
    FOR EACH ROW
    EXECUTE FUNCTION update_monthly_fp_total();

-- Fix burn streak calculation in sync_daily_boosts
CREATE OR REPLACE FUNCTION sync_daily_boosts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_yesterday date := CURRENT_DATE - interval '1 day';
    v_user_record record;
    v_fp_earned integer;
    v_streak_bonus integer;
    v_boosts_completed integer;
    v_had_boosts_yesterday boolean;
BEGIN
    -- Process each user's completed boosts
    FOR v_user_record IN (
        SELECT DISTINCT user_id 
        FROM completed_boosts 
        WHERE completed_date = v_yesterday
    ) LOOP
        -- Calculate FP from boosts using lookup values
        v_fp_earned := calculate_boost_fp(v_user_record.user_id, v_yesterday);
        
        -- Count completed boosts
        SELECT COUNT(*)
        INTO v_boosts_completed
        FROM completed_boosts
        WHERE user_id = v_user_record.user_id
        AND completed_date = v_yesterday;

        -- Check if user had boosts yesterday
        SELECT EXISTS (
            SELECT 1 FROM completed_boosts
            WHERE user_id = v_user_record.user_id
            AND completed_date = v_yesterday - 1
        ) INTO v_had_boosts_yesterday;

        -- Calculate streak bonus
        SELECT 
            CASE 
                WHEN burn_streak >= 21 THEN 100
                WHEN burn_streak >= 7 THEN 10
                WHEN burn_streak >= 3 THEN 5
                ELSE 0
            END INTO v_streak_bonus
        FROM users
        WHERE id = v_user_record.user_id;

        -- Update daily FP
        INSERT INTO daily_fp (
            user_id,
            date,
            fp_earned,
            source,
            boosts_completed,
            streak_bonus
        ) VALUES (
            v_user_record.user_id,
            v_yesterday,
            COALESCE(v_fp_earned, 0) + COALESCE(v_streak_bonus, 0),
            'boost',
            v_boosts_completed,
            COALESCE(v_streak_bonus, 0)
        )
        ON CONFLICT (user_id, date) 
        DO UPDATE SET
            fp_earned = EXCLUDED.fp_earned,
            boosts_completed = EXCLUDED.boosts_completed,
            streak_bonus = EXCLUDED.streak_bonus;

        -- Update user's burn streak and total FP
        UPDATE users
        SET 
            -- Only increment streak by 1 if had boosts yesterday and today
            burn_streak = CASE 
                WHEN v_boosts_completed > 0 AND v_had_boosts_yesterday THEN burn_streak + 1
                WHEN v_boosts_completed > 0 THEN 1
                ELSE 0
            END,
            fuel_points = fuel_points + COALESCE(v_fp_earned, 0) + COALESCE(v_streak_bonus, 0)
        WHERE id = v_user_record.user_id;
    END LOOP;
END;
$$;

-- Update leaderboard functions to use monthly totals
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
    WITH monthly_totals AS (
        SELECT 
            user_id,
            total_fp
        FROM monthly_fp_totals
        WHERE year = EXTRACT(year FROM p_start_date)
        AND month = EXTRACT(month FROM p_start_date)
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
            COALESCE(mt.total_fp, 0) as total_fp,
            c.name as community_name,
            u.created_at
        FROM community_memberships cm
        JOIN users u ON u.id = cm.user_id
        LEFT JOIN monthly_totals mt ON mt.user_id = cm.user_id
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

-- Fix Test User 25's burn streak
DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Reset burn streak to correct value (2)
    UPDATE users
    SET burn_streak = 2
    WHERE id = v_user_id;

    -- Ensure monthly FP total is correct
    INSERT INTO monthly_fp_totals (
        user_id,
        year,
        month,
        total_fp
    )
    SELECT
        v_user_id,
        EXTRACT(year FROM CURRENT_DATE),
        EXTRACT(month FROM CURRENT_DATE),
        6  -- Set to correct total of 6 FP
    ON CONFLICT (user_id, year, month)
    DO UPDATE SET
        total_fp = 6,
        updated_at = now();
END $$;