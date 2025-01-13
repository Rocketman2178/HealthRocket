-- Drop existing cron job if it exists (with better error handling)
DO $$
BEGIN
    -- First check if pg_cron extension exists
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
    ) THEN
        -- Only try to unschedule if the job exists
        IF EXISTS (
            SELECT 1 FROM cron.job WHERE jobname = 'reset-burn-streaks'
        ) THEN
            PERFORM cron.unschedule('reset-burn-streaks');
        END IF;
    END IF;
EXCEPTION
    WHEN undefined_table THEN
        -- Handle case where cron schema doesn't exist
        NULL;
END $$;

-- Create cron extension if not exists
CREATE EXTENSION IF NOT EXISTS pg_cron CASCADE;

-- Revoke existing permissions to clean slate
DO $$
BEGIN
    -- Revoke all permissions from postgres role
    EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA cron FROM postgres';
    EXECUTE 'REVOKE USAGE ON SCHEMA cron FROM postgres';
EXCEPTION
    WHEN undefined_table OR undefined_object THEN
        NULL;
END $$;

-- Grant minimal required permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT SELECT ON cron.job TO postgres;

-- Create function to handle burn streak reset
CREATE OR REPLACE FUNCTION reset_burn_streaks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_yesterday date;
BEGIN
    -- Get yesterday's date in EDT
    v_yesterday := (current_timestamp AT TIME ZONE 'America/New_York' - interval '1 day')::date;

    -- Reset burn streak for users who didn't complete any boosts yesterday
    UPDATE users u
    SET burn_streak = 0
    WHERE NOT EXISTS (
        SELECT 1 FROM completed_boosts cb
        WHERE cb.user_id = u.id
        AND cb.completed_date = v_yesterday
    )
    AND burn_streak > 0;
END;
$$;

-- Schedule burn streak reset with proper error handling
DO $$
BEGIN
    -- Schedule the job with proper function call
    PERFORM cron.schedule(
        'reset-burn-streaks',
        '0 0 * * *',  -- Run at midnight
        'SELECT reset_burn_streaks();'
    );
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'Insufficient privileges to schedule cron job';
    WHEN undefined_function THEN
        RAISE NOTICE 'Function reset_burn_streaks() must be created first';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error scheduling cron job: %', SQLERRM;
END $$;