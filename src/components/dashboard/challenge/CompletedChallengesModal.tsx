import React, { useState } from 'react';
import { X, Target, Award, Calendar } from 'lucide-react';
import { useCompletedActivities } from '../../../hooks/useCompletedActivities';
import { challenges } from '../../../data';
import { useSupabase } from '../../../contexts/SupabaseContext';

export function CompletedChallengesModal({ onClose }: { onClose: () => void }) {
  const { user } = useSupabase();
  const { data, loading } = useCompletedActivities(user?.id);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[50] flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-xl w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Target className="text-orange-500" size={20} />
            <h2 className="text-lg font-semibold text-white">Challenge History</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
            </div>
          ) : !data?.challenges?.length ? (
            <div className="text-center py-8">
              <Target className="text-orange-500 mx-auto mb-3" size={24} />
              <p className="text-gray-400">No completed challenges yet</p>
              <p className="text-sm text-gray-500 mt-2">Complete challenges to see them here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.challenges.map(challenge => (
                <div
                  key={challenge.id}
                  className="bg-gray-700/50 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Target className="text-orange-500" size={16} />
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
                    <div className="flex items-center gap-1.5">
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
          )}
        </div>
      </div>
    </div>
  );
}