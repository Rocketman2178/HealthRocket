-- Fix incorrectly persisting completed boosts for Test User 25
DO $$ 
DECLARE
    v_user_id uuid;
    v_current_week_start date;
BEGIN
    -- Get Test User 25's ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'test25@gmail.com';

    -- Calculate start of current week (Sunday)
    v_current_week_start := CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::integer;

    -- Remove all completed boosts from before this week
    -- This will fix the UI showing old boosts as completed
    DELETE FROM completed_boosts
    WHERE user_id = v_user_id
    AND completed_date < v_current_week_start
    AND boost_id IN ('mindset-101', 'mindset-102', 'mindset-103', 'sleep-102');

    -- Update weekly totals to ensure they're correct
    WITH weekly_totals AS (
        SELECT 
            user_id,
            COUNT(*) as boost_count,
            SUM(COALESCE(
                (SELECT fp_value FROM boost_fp_values WHERE boost_id = completed_boosts.boost_id),
                0
            )) as fp_total
        FROM completed_boosts
        WHERE user_id = v_user_id
        AND completed_date >= v_current_week_start
        GROUP BY user_id
    )
    UPDATE users u
    SET 
        fuel_points = u.fuel_points - COALESCE((
            SELECT fp_total 
            FROM weekly_totals 
            WHERE user_id = u.id
        ), 0)
    WHERE id = v_user_id;

END $$;