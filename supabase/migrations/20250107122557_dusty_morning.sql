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

-- Create function to reset burn streaks at midnight EDT
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