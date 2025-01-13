-- Add lifetime_fp column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS lifetime_fp integer DEFAULT 0;

-- Create function to calculate lifetime FP
CREATE OR REPLACE FUNCTION calculate_lifetime_fp(p_user_id uuid)
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

-- Create trigger function to update lifetime_fp
CREATE OR REPLACE FUNCTION update_lifetime_fp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update user's lifetime_fp
    UPDATE users
    SET lifetime_fp = calculate_lifetime_fp(NEW.user_id)
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$;

-- Create trigger to maintain lifetime_fp
DROP TRIGGER IF EXISTS update_lifetime_fp_trigger ON daily_fp;
CREATE TRIGGER update_lifetime_fp_trigger
    AFTER INSERT OR UPDATE OF fp_earned ON daily_fp
    FOR EACH ROW
    EXECUTE FUNCTION update_lifetime_fp();

-- Update all users' lifetime_fp with their total earned FP
UPDATE users u
SET lifetime_fp = calculate_lifetime_fp(u.id);