-- Create prize pool partners table
CREATE TABLE IF NOT EXISTS public.prize_pool_partners (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    prize_description text NOT NULL,
    website_url text NOT NULL,
    logo_url text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.prize_pool_partners ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for viewing partners
CREATE POLICY "Anyone can view active partners"
ON public.prize_pool_partners
FOR SELECT
USING (is_active = true);

-- Insert some initial partners
INSERT INTO public.prize_pool_partners 
(name, description, prize_description, website_url) VALUES
(
    'WHOOP',
    'Leading wearable technology for recovery optimization and performance tracking.',
    'Monthly drawing for WHOOP 4.0 bands and 6-month memberships.',
    'https://www.whoop.com'
),
(
    'Eight Sleep',
    'Smart mattress technology for temperature regulation and sleep optimization.',
    'Quarterly drawing for Pod 3 Cover and 1-year membership.',
    'https://www.eightsleep.com'
),
(
    'Levels Health',
    'Continuous glucose monitoring and metabolic health optimization platform.',
    'Monthly drawing for 3-month CGM program with coaching.',
    'https://www.levelshealth.com'
),
(
    'LMNT',
    'Science-based electrolyte drink mix for optimal hydration.',
    'Monthly supply of electrolytes for top performers.',
    'https://drinklmnt.com'
),
(
    'Thorne',
    'Research-backed supplements and at-home health tests.',
    'Monthly supplement packages and health test kits.',
    'https://www.thorne.com'
);

-- Create function to get active partners
CREATE OR REPLACE FUNCTION get_prize_pool_partners()
RETURNS TABLE (
    id uuid,
    name text,
    description text,
    prize_description text,
    website_url text,
    logo_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        id,
        name,
        description,
        prize_description,
        website_url,
        logo_url
    FROM prize_pool_partners
    WHERE is_active = true
    ORDER BY name ASC;
$$;