import React from 'react';
import { Award, Calendar, Target } from 'lucide-react';
import { challenges } from '../../../data';

interface CompletedChallenge {
  id: string;
  challenge_id: string;
  completed_at: string;
  fp_earned: number;
  days_to_complete: number;
  final_progress: number;
}

interface CompletedChallengesListProps {
  challenges: CompletedChallenge[];
  loading?: boolean;
}

export function CompletedChallengesList({ challenges, loading }: CompletedChallengesListProps) {
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
      {challenges.map(challenge => (
        <div key={challenge.id} className="bg-gray-700/50 rounded-lg px-3 py-2 hover:bg-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Target className="text-orange-500" size={16} />
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">{challenge.challenge_id}</span>
                {challenge.status === 'canceled' && (
                  <span className="text-xs bg-gray-600 px-2 py-0.5 rounded text-gray-400">
                    Canceled
                  </span>
                )}
              <span className="text-sm text-white">
                {challenges.find(c => c.id === challenge.challenge_id)?.name || challenge.challenge_id}
              </span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Award size={14} />
              <span className="text-sm">+{challenge.fp_earned} FP</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>
                {new Date(challenge.completed_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <span>
              Completed in {challenge.days_to_complete} days
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}