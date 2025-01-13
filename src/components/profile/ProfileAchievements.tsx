import React from 'react';
import { Star } from 'lucide-react';
import { Card } from '../ui/card';

export function ProfileAchievements() {
  const achievements = [
    { title: 'Early Bird', description: '30-day morning routine streak', date: '2024-01-15' },
    { title: 'Sleep Master', description: 'Perfect sleep score for 7 days', date: '2024-01-10' },
    { title: 'Mindfulness Guru', description: 'Completed 50 meditation sessions', date: '2024-01-05' },
    { title: 'Health Pioneer', description: 'First week completion bonus', date: '2024-01-01' },
  ];

  return (
    <Card className="bg-gray-800/50 p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Achievements</h3>
      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-700 last:border-0 last:pb-0">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
              <Star className="text-orange-500" size={16} />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium">{achievement.title}</h4>
              <p className="text-sm text-gray-400">{achievement.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(achievement.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}