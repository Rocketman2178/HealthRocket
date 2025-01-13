-- Add additional game basics templates
INSERT INTO public.guide_templates (category, trigger_condition, template, priority) VALUES
('game_basics', 'fuel_points', 'Fuel Points (FP) are your progress currency. Earn them by:\n• Completing Daily Boosts (5 FP each)\n• Maintaining Burn Streaks (bonus FP at 3, 7, and 21 days)\n• Finishing Challenges (50+ FP)\n• Completing Quests (150+ FP)\n• Updating Health Assessments (10% of next level FP)', 100),

('game_basics', 'leaderboard', 'The Community Leaderboard shows your ranking based on monthly FP earnings. Achieve special status:\n• Hero Status (Top 50%) - 2X Prize Pool Multiplier\n• Legend Status (Top 10%) - 5X Prize Pool Multiplier\n\nPro Plan members are eligible for monthly prize distributions!', 100),

('game_basics', 'burn_streak', 'Burn Streaks reward daily consistency:\n• Complete at least 1 boost daily to maintain your streak\n• 3-Day Streak: +5 FP Bonus\n• 7-Day Streak: +10 FP Bonus\n• 21-Day Streak: +100 FP Bonus\n\nStreak bonuses are added to your daily FP total!', 100),

('game_basics', 'leveling', 'Your rocket levels up as you earn FP:\n• Each level requires progressively more FP\n• Higher levels unlock new rocket customizations\n• Level 3: Unlock color customization\n• Level 5: Unlock special effects\n• Level 8+: Unlock elite designs', 100),

('game_basics', 'rocket_customization', 'Make your rocket unique:\n• Change body and fin colors (Level 3+)\n• Add special effects like engine glow (Level 5+)\n• Choose from multiple rocket designs (Level 8+)\n• Showcase your progress with visual upgrades', 100),

('game_basics', 'health_assessment', 'Health Assessments track your progress:\n• Complete every 30 days\n• Measures improvements across all categories\n• Shows projected +HealthSpan years gained\n• Earn bonus FP (10% of next level requirement)\n• Track your progress toward 20+ year mission', 100),

-- Add mindset templates
('health_tips', 'mindset', 'Mindset optimization strategies:\n• Practice daily gratitude/reflection\n• Use focused work blocks (25-45 min)\n• Take strategic breaks\n• Maintain a growth mindset\n• Track cognitive performance', 90),

('health_tips', 'mindset_advanced', 'Advanced mindset techniques:\n• State change protocols\n• Meditation/breathwork practice\n• Stress resilience training\n• Peak performance triggers\n• Recovery integration', 90),

-- Add biohacking templates
('health_tips', 'biohacking', 'Fundamental biohacking practices:\n• Track key biomarkers\n• Optimize light exposure\n• Practice temperature exposure\n• Monitor heart rate variability\n• Use recovery technology', 90),

('health_tips', 'biohacking_advanced', 'Advanced biohacking strategies:\n• Cold/heat exposure protocols\n• Red light therapy\n• Glucose optimization\n• HRV training\n• Recovery tech stacking', 90);