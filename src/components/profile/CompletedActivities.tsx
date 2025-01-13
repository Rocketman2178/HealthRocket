import React from 'react';
import { Award, Target, Calendar, Trophy } from 'lucide-react';
import { Card } from '../ui/card';
import { useCompletedActivities } from '../../hooks/useCompletedActivities';
import { challenges } from '../../data';

interface CompletedActivitiesProps {
  userId: string | undefined;
}

export function CompletedActivities({ userId }: CompletedActivitiesProps) {
  const { data, loading } = useCompletedActivities(userId);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-32 bg-gray-700/50 rounded-lg"></div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Award className="text-orange-500" size={20} />
          Achievements
        </h3>
        <div className="text-sm text-orange-500">
          +{data.totalFpEarned.toLocaleString()} FP Earned
        </div>
      </div>

      <div className="space-y-6">
        {/* Completed Quests */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Target size={16} className="text-orange-500" />
            Completed Quests
          </h4>
          <div className="space-y-2">
            {data.quests.filter(q => q.status === 'completed').map(quest => (
              <div key={quest.id} className="bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Award className="text-orange-500" size={16} />
                    <span className="text-sm text-white">{quest.quest_id}</span>
                  </div>
                  <span className="text-xs text-orange-500">+{quest.fp_earned} FP</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    <span>
                      {new Date(quest.completed_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <span>{quest.challenges_completed} Challenges • {quest.boosts_completed} Boosts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Challenges */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Trophy size={16} className="text-orange-500" />
            Completed Challenges
          </h4>
          <div className="space-y-2">
            {data.challenges.filter(c => c.status === 'completed').map(challenge => (
              <div key={challenge.id} className="bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Target className="text-orange-500" size={16} />
                    <span className="text-sm text-white">
                      {challenges.find(c => c.id === challenge.challenge_id)?.name || challenge.challenge_id}
                    </span>
                  </div>
                  <span className="text-xs text-orange-500">+{challenge.fp_earned} FP</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    <span>
                      {new Date(challenge.completed_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <span>Completed in {challenge.days_to_complete} days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}