-- Insert initial guide templates
INSERT INTO public.guide_templates (category, trigger_condition, template, priority) VALUES
('game_basics', 'daily_boosts', 'Daily Boosts are quick actions you can complete each day to build momentum. You can complete up to 3 boosts per day, and they reset at midnight. Each boost gives you Fuel Points (FP) which help level up your rocket!', 100),
('game_basics', 'challenges', 'Challenges are 21-day focused improvements in specific areas. You can have up to 2 active challenges at once. Complete daily actions and track your progress to earn big FP rewards!', 100),
('game_basics', 'quests', 'Quests are 90-day transformational journeys that combine multiple challenges and daily boosts. They''re designed by experts to create lasting change in specific areas of your health.', 100),
('health_tips', 'sleep', 'Here are some key sleep optimization tips:\n• Maintain consistent sleep/wake times\n• Get morning sunlight exposure\n• Keep your bedroom cool and dark\n• Avoid screens 1-2 hours before bed', 90),
('health_tips', 'exercise', 'Key exercise principles:\n• Focus on consistency over intensity\n• Include both strength and cardio\n• Start where you are\n• Progress gradually\n• Listen to your body', 90),
('health_tips', 'nutrition', 'Nutrition fundamentals:\n• Eat whole, unprocessed foods\n• Include protein with every meal\n• Stay hydrated\n• Mind your meal timing\n• Track your responses', 90);

-- Create function to record user metrics
CREATE OR REPLACE FUNCTION record_user_metric(
    p_user_id uuid,
    p_metric_type text,
    p_metric_value jsonb,
    p_context jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO user_metrics (
        user_id,
        metric_type,
        metric_value,
        context
    ) VALUES (
        p_user_id,
        p_metric_type,
        p_metric_value,
        p_context
    );
END;
$$;