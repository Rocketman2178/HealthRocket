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

-- Schedule burn streak reset with proper error handling
DO $$
BEGIN
    -- Schedule the job with DO block
    PERFORM cron.schedule(
        'reset-burn-streaks',
        '0 0 * * *',  -- Run at midnight
        $$
        DO $$ 
        BEGIN
            PERFORM reset_burn_streaks();
        END $$;
        $$
    );
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'Insufficient privileges to schedule cron job';
    WHEN undefined_function THEN
        RAISE NOTICE 'Function reset_burn_streaks() must be created first';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error scheduling cron job: %', SQLERRM;
END $$;