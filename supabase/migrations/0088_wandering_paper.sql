-- Create function to sync fuel points
CREATE OR REPLACE FUNCTION sync_fuel_points()
RETURNS trigger AS $$
BEGIN
    -- Update user's lifetime fuel points
    UPDATE users
    SET fuel_points = (
        SELECT COALESCE(SUM(fp_earned), 0)
        FROM daily_fp
        WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to maintain fuel points sync
DROP TRIGGER IF EXISTS sync_fuel_points_trigger ON daily_fp;
CREATE TRIGGER sync_fuel_points_trigger
    AFTER INSERT OR UPDATE ON daily_fp
    FOR EACH ROW
    EXECUTE FUNCTION sync_fuel_points();

-- Create function to get lifetime fuel points
CREATE OR REPLACE FUNCTION get_lifetime_fuel_points(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(SUM(fp_earned), 0)::integer
    FROM daily_fp
    WHERE user_id = p_user_id;
$$;