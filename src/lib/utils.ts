import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateNextLevelPoints(currentLevel: number): number {
  // Base points needed for level 1 
  const basePoints = 20;  // Level 1 requires 20 FP to complete
  
  // Each level requires 41% more points than the previous level
  return Math.round(basePoints * Math.pow(1.41, currentLevel - 1));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function calculateGrowth(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

// Calculate streak bonus FP
export function calculateStreakBonus(streak: number): number {
  if (streak >= 21) return 100;  // 21+ days: 100 FP
  if (streak >= 7) return 10;    // 7-20 days: 10 FP
  if (streak >= 3) return 5;     // 3-6 days: 5 FP
  return 0;                      // 0-2 days: no bonus
}
// Calculate FP earned from boosts
function calculateBoostFP(boosts: CompletedBoost[], allBoosts: any[]): number {
  return boosts.reduce((total, boost) => {
    const boostDetails = allBoosts.find(b => b.id === boost.id);
    return total + (boostDetails?.fuelPoints || 0);
  }, 0);
}

export function calculateStreakInfo(
  currentStreak: number,
  completedBoosts: CompletedBoost[],
  selectedBoostsCount: number,
  maxDailyBoosts: number,
  dailyFpEarned: number
): StreakInfo {
  const availableBoosts = maxDailyBoosts - selectedBoostsCount;
  const bonusMultiplier = selectedBoostsCount;
  const today = new Date().toDateString();
  const todayBoosts = completedBoosts.filter(
    boost => new Date(boost.completedAt).toDateString() === today
  );

  // Calculate next milestone and reward
  let nextMilestone: number;
  let milestoneReward: number;

  // After hitting 21, reset milestone tracking but keep counting streak
  if (currentStreak >= 21) {
    nextMilestone = 3;
    milestoneReward = 5;
  } else if (currentStreak < 3) {
    nextMilestone = 3;
    milestoneReward = 5;
  } else if (currentStreak < 7) {
    nextMilestone = 7;
    milestoneReward = 10;
  } else {
    nextMilestone = 21;
    milestoneReward = 20;
  }

  // Calculate progress to next milestone
  const progress = currentStreak >= 21 
    ? ((currentStreak % 3) / 3) * 100  // Progress to next 3-day milestone
    : (currentStreak / nextMilestone) * 100;  // Progress to next regular milestone

  return {
    currentStreak,
    nextMilestone,
    milestoneReward,
    progress,
    dailyBoostsCompleted: selectedBoostsCount,
    maxDailyBoosts: 3,
    availableBoosts,
    bonusMultiplier,
    dailyFpEarned
  };
}