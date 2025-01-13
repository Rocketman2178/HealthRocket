import React from 'react';
import { Target, Users, ChevronDown, ChevronUp, Clock, Trophy, CheckCircle, Flame } from 'lucide-react';
import type { StreakInfo } from '../../../types/dashboard';

interface MilestoneInfo {
  days: number;
  reward: number;
}

const MILESTONES: MilestoneInfo[] = [
  { days: 3, reward: 5 },
  { days: 7, reward: 10 },
  { days: 21, reward: 100 }
];

interface StreakProgressProps extends StreakInfo {
  burnStreak: number;
}

function getCurrentMilestoneInfo(streak: number): { 
  currentMilestone: MilestoneInfo, 
  nextMilestone: MilestoneInfo | null,
  progress: number 
} {
  // Find the next milestone
  const nextMilestoneIndex = MILESTONES.findIndex(m => m.days > streak);
  
  if (nextMilestoneIndex === -1) {
    // Past all milestones, on 21-day cycle
    const cycleProgress = streak % 21;
    return {
      currentMilestone: MILESTONES[MILESTONES.length - 1],
      nextMilestone: { days: Math.floor(streak / 21) * 21 + 21, reward: 200 },
      progress: (cycleProgress / 21) * 100
    };
  }
  
  // Calculate progress to next milestone
  const currentMilestone = nextMilestoneIndex === 0 ? 
    { days: 0, reward: 0 } : 
    MILESTONES[nextMilestoneIndex - 1];
  
  const nextMilestone = MILESTONES[nextMilestoneIndex];
  const progressToNext = (streak - currentMilestone.days) / 
    (nextMilestone.days - currentMilestone.days);
  
  return {
    currentMilestone,
    nextMilestone,
    progress: progressToNext * 100
  };
}

export function StreakProgress({ 
  burnStreak,
  dailyBoostsCompleted,
  maxDailyBoosts,
  availableBoosts
}: StreakProgressProps) {
  const { currentMilestone, nextMilestone, progress } = getCurrentMilestoneInfo(burnStreak);
  const daysUntilNext = nextMilestone ? nextMilestone.days - burnStreak : 21 - (burnStreak % 21);
  const nextReward = nextMilestone ? nextMilestone.reward : 200;

  return (
    <div className="space-y-2 mb-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 bg-gray-700 px-2 py-1.5 rounded-lg w-1/2">
          <Flame className="text-orange-500" size={20} />
          <div className="flex flex-col">
            <span className="text-white font-medium">Burn Streak: {burnStreak}</span>
            <span className="text-xs text-gray-400">Complete 1 Boost to maintain streak</span>
          </div>
        </div>
        <div className="text-sm flex flex-col items-end">
          <div className="text-gray-400">Next Bonus: {daysUntilNext} Days</div>
          <div className="text-orange-500">+{nextReward} FP</div>
        </div>
      </div>
      
      <div className="relative h-2 w-full bg-gray-700 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-orange-500 transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className={burnStreak >= 3 ? 'text-orange-500' : ''}>3d (+5 FP)</span>
          {burnStreak >= 3 && (
            <div className="w-4 h-4 rounded-full border border-orange-500 flex items-center justify-center">
              <CheckCircle className="text-orange-500" size={12} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className={burnStreak >= 7 ? 'text-orange-500' : ''}>7d (+10 FP)</span>
          {burnStreak >= 7 && (
            <div className="w-4 h-4 rounded-full border border-orange-500 flex items-center justify-center">
              <CheckCircle className="text-orange-500" size={12} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className={burnStreak >= 21 ? 'text-orange-500' : ''}>21d (+100 FP)</span>
          {burnStreak >= 21 && (
            <div className="w-4 h-4 rounded-full border border-orange-500 flex items-center justify-center">
              <CheckCircle className="text-orange-500" size={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}