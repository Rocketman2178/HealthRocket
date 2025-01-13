-- Add column for FP progress towards next level
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS fp_progress integer DEFAULT 0;

-- Create function to calculate level and progress
CREATE OR REPLACE FUNCTION calculate_level_and_progress(p_total_fp integer)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    v_current_level integer := 1;
    v_remaining_fp integer := p_total_fp;
    v_next_level_points integer;
BEGIN
    -- Keep leveling up while we have enough FP
    WHILE true LOOP
        -- Calculate points needed for next level
        v_next_level_points := calculate_next_level_points(v_current_level);
        
        -- Exit if we don't have enough FP for next level
        IF v_remaining_fp < v_next_level_points THEN
            EXIT;
        END IF;
        
        -- Level up and calculate remaining FP
        v_remaining_fp := v_remaining_fp - v_next_level_points;
        v_current_level := v_current_level + 1;
    END LOOP;

    RETURN jsonb_build_object(
        'level', v_current_level,
        'progress_fp', v_remaining_fp,
        'next_level_points', calculate_next_level_points(v_current_level)
    );
END;
$$;

-- Create function to sync user stats
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
        fp_progress = (v_level_data->>'progress_fp')::integer  -- Store progress towards next level
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$;

-- Create trigger for syncing user stats
DROP TRIGGER IF EXISTS sync_user_stats_trigger ON daily_fp;
CREATE TRIGGER sync_user_stats_trigger
    AFTER INSERT OR UPDATE OF fp_earned ON daily_fp
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_stats();

-- Fix Test User 25's stats
DO $$
DECLARE
    v_user_id uuid;
    v_total_fp integer;
    v_level_data jsonb;
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Calculate total lifetime FP
    SELECT COALESCE(SUM(fp_earned), 0)
    INTO v_total_fp
    FROM daily_fp
    WHERE user_id = v_user_id;

    -- Calculate level and progress
    v_level_data := calculate_level_and_progress(v_total_fp);

    -- Update user with correct values
    UPDATE users
    SET 
        level = (v_level_data->>'level')::integer,
        fuel_points = v_total_fp,  -- Store total lifetime FP
        fp_progress = (v_level_data->>'progress_fp')::integer,  -- Store progress towards next level
        burn_streak = 0  -- Reset burn streak
    WHERE id = v_user_id;

    -- Log results
    RAISE NOTICE 'Updated user data: Total FP: %, Level: %, Progress FP: %, Next Level Points: %',
        v_total_fp,
        v_level_data->>'level',
        v_level_data->>'progress_fp',
        v_level_data->>'next_level_points';
END $$;