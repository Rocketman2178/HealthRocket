-- Drop fp_progress column from users table
ALTER TABLE public.users
DROP COLUMN IF EXISTS fp_progress;

-- Update sync_user_stats function to remove fp_progress
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
        fuel_points = (v_level_data->>'progress_fp')::integer,  -- Store progress towards next level
        lifetime_fp = v_total_fp  -- Track total lifetime FP earned
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$;