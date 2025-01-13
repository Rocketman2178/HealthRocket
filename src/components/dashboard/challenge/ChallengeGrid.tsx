import React, { useState, useEffect, useCallback } from 'react';
import { Award, Zap, History, Target } from 'lucide-react';
import { Card } from '../../ui/card';
import { ChallengeCard } from './ChallengeCard';
import { ChallengeLibrary } from './ChallengeLibrary';
import { RecommendedChallenges } from './RecommendedChallenges';
import { CompletedChallengesModal } from './CompletedChallengesModal';
import { useChallengeManager } from '../../../hooks/useChallengeManager';
import { useCompletedActivities } from '../../../hooks/useCompletedActivities';
import { quests } from '../../../data';
import type { Challenge } from '../../../types/dashboard';

interface ChallengeGridProps {
  userId: string | undefined;
  categoryScores: Record<string, number>;
}

export function ChallengeGrid({ userId, categoryScores }: ChallengeGridProps) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [recommendedChallenges, setRecommendedChallenges] = useState<string[]>([]);
  const [activeQuestDetails, setActiveQuestDetails] = useState<Quest | null>(null);
  const [showCompletedChallenges, setShowCompletedChallenges] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { data: completedActivities } = useCompletedActivities(userId);
  const {
    activeChallenges, 
    loading, 
    startChallenge, 
    cancelChallenge
  } = useChallengeManager(userId);

  // Listen for quest selection events
  useEffect(() => {
    const handleQuestSelected = (event: CustomEvent) => {
      const { questId, challengeIds } = event.detail;
      const questDetails = quests.find(q => q.id === questId);
      if (questDetails) {
        setRecommendedChallenges(challengeIds || []);
        setActiveQuestDetails(questDetails);
      }
    };

    const handleQuestCanceled = () => {
      setRecommendedChallenges([]);
      setActiveQuestDetails(null);
    };

    window.addEventListener('questSelected', handleQuestSelected as EventListener);
    window.addEventListener('questCanceled', handleQuestCanceled as EventListener);

    return () => {
      window.removeEventListener('questSelected', handleQuestSelected as EventListener);
      window.removeEventListener('questCanceled', handleQuestCanceled as EventListener);
    };
  }, [setRecommendedChallenges, setActiveQuestDetails]);

  const maxChallenges = 2;
  const activeChallengeCount = activeChallenges.length;

  if (loading && activeChallenges.length === 0) {
    return (
      <Card className="animate-pulse">
        <div className="h-32 bg-gray-700/50 rounded-lg"></div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white">Challenges</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {activeChallenges.length}/2 Active
          </span>
          <button
            onClick={() => setShowLibrary(true)}
            className="text-sm text-orange-500 hover:text-orange-400"
          >
            View All
          </button>
        </div>
      </div>
      
      {/* Active Challenges */}
      {activeChallenges.length > 0 ? (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-orange-500" size={20} />
            <h3 className="text-sm font-medium text-white">Active Challenges</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeChallenges.map(challenge => (
              <ChallengeCard
                key={`${challenge.id}-${challenge.name}`}
                challenge={challenge}
                activeQuest={activeQuestDetails}
                onCancel={(challengeId) => cancelChallenge(challengeId)}
              />
            ))}
          </div>
        </Card>
      ) : (
        <Card className="relative">
          <div className="flex flex-col items-center justify-center py-2.5 space-y-1.5">
            <div className="flex items-center gap-2">
              <Award className="text-orange-500" size={24} />
              <h3 className="text-lg font-medium text-white">No Active Challenges</h3>
            </div>
            <button
              onClick={() => setShowLibrary(true)}
              className="flex items-center gap-2 px-3.5 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Award size={16} />
              Select a Challenge
            </button>
          </div>
        </Card>
      )}
      
      {/* Show Recommended Challenges if there's an active quest */}
      {activeQuestDetails && recommendedChallenges.length > 0 && activeChallengeCount < maxChallenges && (
        <RecommendedChallenges
          challengeIds={recommendedChallenges}
          onStartChallenge={startChallenge}
          currentChallenges={activeChallenges.map(c => ({ 
            challenge_id: c.challenge_id,
            status: c.status
          }))}
          activeChallengesCount={activeChallengeCount}
        />
      )}
      
      <div className="text-xs text-gray-400 italic text-center">
        Unlock More Challenges After Completion
      </div>
      
      {/* Completed Challenges Section */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Award className="text-orange-500" size={16} />
              <span>Completed Challenges ({completedActivities.challengesCompleted})</span>
            </h3>
          </div>
          <button
            onClick={() => setShowCompletedChallenges(true)}
            className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-400 transition-colors"
          >
            <History size={14} />
            <span>View History</span>
          </button>
        </div>
      </Card>

      {showCompletedChallenges && (
        <CompletedChallengesModal
          onClose={() => setShowCompletedChallenges(false)}
        />
      )}

      {showLibrary && (
        <ChallengeLibrary
          userId={userId}
          categoryScores={categoryScores}
          recommendedChallenges={activeQuestDetails?.challengeIds || []}
          currentChallenges={activeChallenges}
          onClose={() => setShowLibrary(false)}
          onStartChallenge={startChallenge}
          activeChallengesCount={activeChallenges.length}
        />
      )}
    </div>
  );
}