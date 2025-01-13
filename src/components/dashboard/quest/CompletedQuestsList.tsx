import React from 'react';
import { Award, Calendar, Target } from 'lucide-react';
import { quests } from '../../../data';
import { Card } from '../../ui/card';

interface CompletedQuest {
  id: string;
  quest_id: string;
  completed_at: string;
  fp_earned: number;
  challenges_completed: number;
  boosts_completed: number;
}

interface CompletedQuestsListProps {
  quests: CompletedQuest[];
  loading?: boolean;
}

export function CompletedQuestsList({ quests, loading }: CompletedQuestsListProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-12 bg-gray-700/50 rounded-lg" />
        <div className="h-12 bg-gray-700/50 rounded-lg" />
        <div className="h-12 bg-gray-700/50 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {quests.map(quest => (
        <div key={quest.id} className="bg-gray-700/50 rounded-lg px-3 py-2 hover:bg-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Target className="text-orange-500" size={16} />
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">{quest.quest_id}</span>
                {quest.status === 'canceled' && (
                  <span className="text-xs bg-gray-600 px-2 py-0.5 rounded text-gray-400">
                    Canceled
                  </span>
                )}
              <span className="text-sm text-white">
                {quests.find(q => q.id === quest.quest_id)?.name || quest.quest_id}
              </span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Award size={14} />
              <span className="text-sm">+{quest.fp_earned} FP</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>
                {new Date(quest.completed_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <span>
              {quest.challenges_completed} Challenges • {quest.boosts_completed} Boosts
            </span>
          </div>
        </div>
      )) || null}
    </div>
  );
}