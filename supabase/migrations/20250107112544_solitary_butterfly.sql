-- Create cron extension if not exists
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule process_pending_boosts to run at midnight EDT/EST
SELECT cron.schedule(
    'process-pending-boosts',  -- unique job name
    '0 0 * * *',             -- cron schedule (midnight)
    $cron$
    SELECT process_pending_boosts();
    $cron$
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Add logging table for boost processing
CREATE TABLE IF NOT EXISTS public.boost_processing_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    processed_at timestamptz DEFAULT now(),
    boosts_processed integer,
    details jsonb
);

-- Modify process_pending_boosts to include logging
CREATE OR REPLACE FUNCTION process_pending_boosts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_yesterday date;
    v_boosts_processed integer;
    v_details jsonb;
BEGIN
    -- Get yesterday's date in EDT
    v_yesterday := (current_timestamp AT TIME ZONE 'America/New_York' - interval '1 day')::date;

    -- Count boosts to be processed
    SELECT COUNT(*) INTO v_boosts_processed
    FROM pending_boosts
    WHERE date = v_yesterday;

    -- Move pending boosts to completed_boosts
    INSERT INTO completed_boosts (
        user_id,
        boost_id,
        completed_at,
        completed_date
    )
    SELECT 
        user_id,
        boost_id,
        (v_yesterday + interval '23 hours 59 minutes 59 seconds') AT TIME ZONE 'America/New_York',
        v_yesterday
    FROM pending_boosts
    WHERE date = v_yesterday
    ON CONFLICT (user_id, boost_id, completed_date) DO NOTHING;

    -- Build details for logging
    SELECT jsonb_build_object(
        'date', v_yesterday,
        'boosts_processed', v_boosts_processed,
        'timezone', current_setting('TIMEZONE')
    ) INTO v_details;

    -- Log the processing
    INSERT INTO boost_processing_logs (
        boosts_processed,
        details
    ) VALUES (
        v_boosts_processed,
        v_details
    );

    -- Clean up processed pending boosts
    DELETE FROM pending_boosts
    WHERE date = v_yesterday;

    -- Run sync function to update FP and streaks
    PERFORM sync_daily_boosts();
END;
$$;