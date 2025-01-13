-- Create cron extension if not exists
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Drop existing cron job if it exists (wrapped in PL/pgSQL to handle case where job doesn't exist)
DO $$
BEGIN
    PERFORM cron.unschedule('reset-burn-streaks');
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Schedule burn streak reset
SELECT cron.schedule(
    'reset-burn-streaks',
    '0 0 * * *',  -- Run at midnight EDT
    $$
    SELECT reset_burn_streaks();
    $$
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;