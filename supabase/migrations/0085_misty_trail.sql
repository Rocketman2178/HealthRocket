-- Create monthly FP rollup table
CREATE TABLE IF NOT EXISTS public.monthly_fp_totals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL CHECK (month BETWEEN 1 AND 12),
    total_fp integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, year, month)
);

-- Enable RLS
ALTER TABLE public.monthly_fp_totals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own monthly totals"
ON public.monthly_fp_totals
FOR SELECT
USING (auth.uid() = user_id);

-- Create function to update monthly totals
CREATE OR REPLACE FUNCTION update_monthly_fp_total()
RETURNS trigger AS $$
BEGIN
    INSERT INTO monthly_fp_totals (
        user_id,
        year,
        month,
        total_fp
    )
    VALUES (
        NEW.user_id,
        EXTRACT(year FROM NEW.date),
        EXTRACT(month FROM NEW.date),
        NEW.fp_earned
    )
    ON CONFLICT (user_id, year, month)
    DO UPDATE SET
        total_fp = monthly_fp_totals.total_fp + NEW.fp_earned,
        updated_at = now();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to maintain monthly totals
DROP TRIGGER IF EXISTS update_monthly_fp_totals_trigger ON daily_fp;
CREATE TRIGGER update_monthly_fp_totals_trigger
    AFTER INSERT ON daily_fp
    FOR EACH ROW
    EXECUTE FUNCTION update_monthly_fp_total();

-- Create function to get monthly FP total
CREATE OR REPLACE FUNCTION get_monthly_fp_total(
    p_user_id uuid,
    p_year integer DEFAULT EXTRACT(year FROM CURRENT_DATE),
    p_month integer DEFAULT EXTRACT(month FROM CURRENT_DATE)
)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT total_fp
    FROM monthly_fp_totals
    WHERE user_id = p_user_id
    AND year = p_year
    AND month = p_month;
$$;