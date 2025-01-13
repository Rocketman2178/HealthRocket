-- Create function to handle user signup with Pro Plan default
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        name,
        plan,
        level,
        fuel_points,
        burn_streak,
        health_score,
        healthspan_years,
        lifespan,
        healthspan,
        onboarding_completed
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        'Pro Plan',  -- Set default plan to Pro Plan
        1,
        0,
        0,
        7.8,
        0,
        85,
        75,
        false
    );
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();