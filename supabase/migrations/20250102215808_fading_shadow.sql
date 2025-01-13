-- Add game basics templates
INSERT INTO public.guide_templates (category, trigger_condition, template, priority) VALUES
('game_basics', 'fuel_points', 'Fuel Points (FP) are your progress currency. Earn them by:\n• Completing Daily Boosts (5 FP each)\n• Maintaining Burn Streaks (bonus FP at 3, 7, and 21 days)\n• Finishing Challenges (50+ FP)\n• Completing Quests (150+ FP)\n• Updating Health Assessments (10% of next level FP)', 100),

('game_basics', 'leaderboard', 'The Community Leaderboard shows your ranking based on monthly FP earnings. Achieve special status:\n• Hero Status (Top 50%) - 2X Prize Pool Multiplier\n• Legend Status (Top 10%) - 5X Prize Pool Multiplier\n\nPro Plan members are eligible for monthly prize distributions!', 100),

('game_basics', 'burn_streak', 'Burn Streaks reward daily consistency:\n• Complete at least 1 boost daily to maintain your streak\n• 3-Day Streak: +5 FP Bonus\n• 7-Day Streak: +10 FP Bonus\n• 21-Day Streak: +100 FP Bonus\n\nStreak bonuses are added to your daily FP total!', 100),

('game_basics', 'leveling', 'Your rocket levels up as you earn FP:\n• Each level requires progressively more FP\n• Higher levels unlock new rocket customizations\n• Level 3: Unlock color customization\n• Level 5: Unlock special effects\n• Level 8+: Unlock elite designs', 100),

('game_basics', 'rocket_customization', 'Make your rocket unique:\n• Change body and fin colors (Level 3+)\n• Add special effects like engine glow (Level 5+)\n• Choose from multiple rocket designs (Level 8+)\n• Showcase your progress with visual upgrades', 100),

('game_basics', 'health_assessment', 'Health Assessments track your progress:\n• Complete every 30 days\n• Measures improvements across all categories\n• Shows projected +HealthSpan years gained\n• Earn bonus FP (10% of next level requirement)\n• Track your progress toward 20+ year mission', 100),

-- Add health category templates
('health_tips', 'mindset', 'Mindset optimization strategies:\n• Practice daily gratitude/reflection\n• Use focused work blocks (25-45 min)\n• Take strategic breaks\n• Maintain a growth mindset\n• Track cognitive performance', 90),

('health_tips', 'sleep', 'Here are some key sleep optimization tips:\n• Maintain consistent sleep/wake times\n• Get morning sunlight exposure\n• Keep your bedroom cool and dark\n• Avoid screens 1-2 hours before bed', 90),

('health_tips', 'exercise', 'Key exercise principles:\n• Focus on consistency over intensity\n• Include both strength and cardio\n• Start where you are\n• Progress gradually\n• Listen to your body', 90),

('health_tips', 'nutrition', 'Nutrition fundamentals:\n• Eat whole, unprocessed foods\n• Include protein with every meal\n• Stay hydrated\n• Mind your meal timing\n• Track your responses', 90),

('health_tips', 'biohacking', 'Fundamental biohacking practices:\n• Track key biomarkers\n• Optimize light exposure\n• Practice temperature exposure\n• Monitor heart rate variability\n• Use recovery technology', 90);