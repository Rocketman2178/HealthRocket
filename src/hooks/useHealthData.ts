import { useState, useEffect } from 'react';
import type { Quest, Challenge, RankProgress, CompletedBoost } from '../types/dashboard';
import { sleepQuests } from '../data/sleep/quests';
import { sleepChallenges } from '../data/sleep/challenges';
import { experts } from '../data/experts';
import { mindsetQuests } from '../data/mindset/quests';
import { mindsetChallenges } from '../data/mindset/challenges';

interface CompletedActivity {
  id: string;
  type: 'quest' | 'challenge';
  completedAt: Date;
}

export function useHealthData() {
  const [level, setLevel] = useState(3);
  const [fuelPoints, setFuelPoints] = useState(1250);
  const [nextLevelPoints] = useState(1600);
  const [completedActivities, setCompletedActivities] = useState<CompletedActivity[]>([]);
  const [questCap, setQuestCap] = useState(1);
  const [challengeCap, setChallengeCap] = useState(2);

  // Calculate available slots based on completion history
  const calculateAvailableSlots = () => {
    const completedQuests = completedActivities.filter(a => a.type === 'quest').length;
    const completedChallenges = completedActivities.filter(a => a.type === 'challenge').length;
    
    // Increase caps based on completions
    setQuestCap(Math.min(3, 1 + Math.floor(completedQuests / 2)));
    setChallengeCap(Math.min(5, 2 + Math.floor(completedChallenges / 3)));
  };

  useEffect(() => {
    calculateAvailableSlots();
  }, [completedActivities]);
  const [healthScore] = useState(7.8);
  const [healthSpanYears] = useState(2.5);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [burnStreak, setBurnStreak] = useState(14);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [currentChallenges, setCurrentChallenges] = useState<Challenge[]>([]);
  
  // Initialize available quests from sleep quests data
  const [availableQuests, setAvailableQuests] = useState<Quest[]>(() => {
    const allQuests = [...sleepQuests, ...mindsetQuests]
    return allQuests
      .filter(quest => quest.expertIds?.length)
      .map(quest => ({
        ...quest,
        title: quest.name,
        fpReward: quest.fuelPoints,
        category: quest.category,
        expertReference: `${quest.expertIds.map(id => experts[id]?.name || '').filter(Boolean).join(' & ')}`,
        status: 'available',
        progress: 0,
        daysRemaining: quest.duration || 90
      }));
  });

  // Initialize available challenges from sleep challenges data
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>(() => {
    const allChallenges = [...sleepChallenges, ...mindsetChallenges]
    return allChallenges.map(challenge => {
      // Get expert reference from the challenge data
      const expertRef = challenge.expertReference || '';
      const tier = challenge.tier || 1;
      
      return {
        ...challenge,
        title: challenge.name,
        category: challenge.category,
        fpReward: challenge.fuelPoints,
        status: 'available',
        progress: 0,
        daysRemaining: challenge.duration || 21,
        expertReference: expertRef,
        tier
      };
    });
  });

  // Example completed boosts with dates
  const [completedBoosts, setCompletedBoosts] = useState<CompletedBoost[]>([
    // Today's completed boosts
    { id: 'mindset-1', completedAt: new Date() },
    { id: 'sleep-2', completedAt: new Date() },
    
    // Yesterday's completed boosts
    { id: 'exercise-1', completedAt: new Date(Date.now() - 86400000) },
    { id: 'nutrition-2', completedAt: new Date(Date.now() - 86400000) },
    { id: 'tech-3', completedAt: new Date(Date.now() - 86400000) },
    
    // Previous day's completed boosts
    { id: 'mindset-2', completedAt: new Date(Date.now() - 172800000) },
    { id: 'sleep-1', completedAt: new Date(Date.now() - 172800000) },
    { id: 'exercise-2', completedAt: new Date(Date.now() - 172800000) }
  ]);

  const [rankProgress] = useState<RankProgress>({
    rank: 14,
    percentile: 42,
    heroAchieved: true,
    pointsToLegend: 850,
    currentPoints: 1250,
    legendThresholdPoints: 2100
  });

  const handleStartQuest = (questId: string) => {
    const quest = availableQuests.find(q => q.id === questId);
    const currentActiveQuests = availableQuests.filter(q => q.status === 'active').length;
    
    if (quest && quest.status === 'available' && currentActiveQuests < questCap) {
      setActiveQuest(quest);
      setAvailableQuests(quests => 
        quests.map(q => 
          q.id === questId 
            ? { ...q, status: 'active' as const } 
            : q
        )
      );
    }
  };

  const handleCancelQuest = () => {
    if (activeQuest) {
      // Only update the quest status, don't affect challenges
      setAvailableQuests(quests =>
        quests.map(q =>
          q.id === activeQuest.id
            ? { ...q, status: 'available' as const, progress: 0, daysRemaining: q.duration }
            : q
        )
      );
      setActiveQuest(null);
    }
  };

  const handleStartChallenge = (challengeId: string) => {
    const challenge = availableChallenges.find(c => c.id === challengeId);
    const currentActiveChallenges = currentChallenges.length;
    
    // Check if challenge is already active
    const isAlreadyActive = currentChallenges.some(c => c.id === challengeId);
    
    if (challenge && 
        challenge.status === 'available' && 
        currentActiveChallenges < challengeCap &&
        !isAlreadyActive) {
      setCurrentChallenges(prev => [...prev, { ...challenge, status: 'active' }]);
    }
  };

  const handleCancelChallenge = (challengeId?: string) => {
    // If no challengeId provided, cancel the first challenge (legacy behavior)
    const challengeToCancel = challengeId 
      ? currentChallenges.find(c => c.id === challengeId)
      : currentChallenges[0];

    if (challengeToCancel) {
      setCurrentChallenges(prev => prev.filter(c => c.id !== challengeToCancel.id));
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setLastRefresh(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleCompleteBoost = (id: string) => {
    const today = new Date().toDateString();
    
    // Check if the boost is already completed today
    const existingBoost = completedBoosts.find(
      boost => boost.id === id && new Date(boost.completedAt).toDateString() === today
    );

    if (existingBoost) {
      // If boost exists for today, remove it (toggle off)
      setCompletedBoosts(completedBoosts.filter(boost => 
        !(boost.id === id && new Date(boost.completedAt).toDateString() === today)
      ));
    } else {
      // If not completed today, add it (toggle on)
      setCompletedBoosts([...completedBoosts, { id, completedAt: new Date() }]);
    }
  };

  return {
    level,
    fuelPoints,
    nextLevelPoints,
    questCap,
    challengeCap,
    healthScore,
    healthSpanYears,
    burnStreak,
    completedBoosts,
    rankProgress,
    activeQuest,
    availableQuests,
    currentChallenges,
    handleCompleteBoost,
    handleStartQuest,
    handleCancelQuest,
    handleStartChallenge,
    handleCancelChallenge,
    availableChallenges
  };
}