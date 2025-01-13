import React, { useEffect } from 'react';
import { Card } from '../../ui/card';
import { StreakProgress } from './StreakProgress';
import { BoostCategory } from './BoostCategory';
import { boostCategories } from '../../../data/boostCategories';
import { calculateStreakInfo } from '../../../lib/utils';

interface DailyBoostsProps {
  burnStreak: number;
  completedBoosts: CompletedBoost[];
  selectedBoosts: BoostState[] | [];
  weeklyBoosts: BoostState[] | [];
  daysUntilReset: number;
  onCompleteBoost?: (id: string) => Promise<void>;
}

export function DailyBoosts({ 
  completedBoosts,
  selectedBoosts,
  weeklyBoosts,
  daysUntilReset,
  onCompleteBoost,
  burnStreak
}: DailyBoostsProps) {
  const maxDailyBoosts = 3;
  const availableBoosts = maxDailyBoosts - selectedBoosts.length;
  
  // Get total FP earned today from completed boosts
  const dailyFpEarned = selectedBoosts.reduce((total, boost) => {
    const boostValue = boostCategories
      .flatMap(cat => cat.boosts)
      .find(b => b.id === boost.id)?.fuelPoints || 0;
    return total + boostValue;
  }, 0);

  const streakInfo = calculateStreakInfo(
    burnStreak,
    completedBoosts,
    selectedBoosts.length,
    maxDailyBoosts,
    dailyFpEarned
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Daily Boosts</h2>
      </div>

      <Card>
        <StreakProgress 
          burnStreak={burnStreak}
          {...streakInfo}
        />
        
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-1">
              <div className="text-sm">
                <span className="text-gray-400">Daily Boosts Available: </span>
                <span className="text-orange-500">{maxDailyBoosts - selectedBoosts.length}/{maxDailyBoosts}</span>
              </div>
              <div className="text-sm text-gray-400">FP Earned Today: <span className="text-orange-500">+{dailyFpEarned}</span></div>
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-orange-500">{daysUntilReset}</span> {daysUntilReset === 1 ? 'Day' : 'Days'} Until Reset
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400 italic text-center">Complete 1 Boost per Category to Unlock More</div>
          <div className="mt-1 text-xs text-gray-400 italic text-center">Burn Streaks based on EST Time</div>
        </div>
        
        {/* Boost Categories */}
        <div className="space-y-6 mt-6">
          {boostCategories.map(category => (
            <BoostCategory
              key={category.name}
              name={category.name}
              icon={category.icon}
              boosts={category.boosts}
              completedBoosts={completedBoosts}
              selectedBoosts={selectedBoosts}
              weeklyBoosts={weeklyBoosts}
              boostsRemaining={availableBoosts}
              onComplete={async (id) => {
                if (availableBoosts <= 0) {
                  return; // Don't allow more than 3 boosts per day
                }
                if (onCompleteBoost) {
                  await onCompleteBoost(id);
                }
              }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}