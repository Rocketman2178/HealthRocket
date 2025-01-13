-- Add lifetime_fp column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS lifetime_fp integer DEFAULT 0;

-- Update sync_user_stats function to track lifetime FP
CREATE OR REPLACE FUNCTION sync_user_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_fp integer;
    v_level_data jsonb;
BEGIN
    -- Calculate total lifetime FP
    SELECT COALESCE(SUM(fp_earned), 0)
    INTO v_total_fp
    FROM daily_fp
    WHERE user_id = NEW.user_id;

    -- Calculate level and progress
    v_level_data := calculate_level_and_progress(v_total_fp);

    -- Update user with correct values
    UPDATE users
    SET 
        level = (v_level_data->>'level')::integer,
        fuel_points = v_total_fp,  -- Store total lifetime FP
        fp_progress = (v_level_data->>'progress_fp')::integer,  -- Store progress towards next level
        lifetime_fp = v_total_fp  -- Track total lifetime FP earned
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$;

-- Update all users' lifetime_fp with their total earned FP
UPDATE users u
SET lifetime_fp = COALESCE((
    SELECT SUM(fp_earned)
    FROM daily_fp
    WHERE user_id = u.id
), 0);