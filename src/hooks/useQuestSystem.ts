import { useState, useEffect } from 'react';
import { QuestManager } from '../lib/game/QuestManager';
import { ProgressTracker } from '../lib/game/ProgressTracker';
import type { Quest, Challenge, UserProgress, CompletedActivity } from '../types/game';

export function useQuestSystem() {
  const [questManager] = useState(() => new QuestManager());
  const [progressTracker] = useState(() => new ProgressTracker());
  const [completedActivities, setCompletedActivities] = useState<CompletedActivity[]>([]);
  const [questCap, setQuestCap] = useState(1);
  const [challengeCap, setChallengeCap] = useState(2);

  // Update caps based on completed activities
  useEffect(() => {
    const { questCap: newQuestCap, challengeCap: newChallengeCap } = 
      questManager.calculateAvailableSlots(completedActivities);
    
    setQuestCap(newQuestCap);
    setChallengeCap(newChallengeCap);
  }, [completedActivities]);

  // Track progress for active quests and challenges
  useEffect(() => {
    const trackInterval = setInterval(() => {
      // Implementation for periodic progress tracking
    }, 60000); // Check every minute

    return () => clearInterval(trackInterval);
  }, []);

  const handleQuestCompletion = (questId: string) => {
    setCompletedActivities(prev => [
      ...prev,
      {
        id: questId,
        type: 'quest',
        completedAt: new Date()
      }
    ]);
  };

  const handleChallengeCompletion = (challengeId: string) => {
    setCompletedActivities(prev => [
      ...prev,
      {
        id: challengeId,
        type: 'challenge',
        completedAt: new Date()
      }
    ]);
  };

  return {
    questCap,
    challengeCap,
    completedActivities,
    handleQuestCompletion,
    handleChallengeCompletion
  };
}