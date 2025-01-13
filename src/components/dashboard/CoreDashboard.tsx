import React, { useState, useEffect } from 'react';
import { CompanyLogo } from './header/CompanyLogo';
import { DashboardHeader } from './header/DashboardHeader';
import { MyRocket } from './rocket/MyRocket';
import { RankStatus } from './rank/RankStatus';
import { QuestCard } from './quest/QuestCard';
import { ChallengeGrid } from './challenge/ChallengeGrid';
import { DailyBoosts } from './boosts/DailyBoosts';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import { usePlayerStats } from '../../hooks/usePlayerStats';
import { useBoostState } from '../../hooks/useBoostState';
import { supabase } from '../../lib/supabase';

interface DashboardUpdateEvent extends Event {
  type: 'dashboardUpdate';
}

export function CoreDashboard() {
  const { user } = useSupabase();
  const { data, loading: dashboardLoading, refreshData } = useDashboardData(user);
  const { stats, loading: statsLoading, refreshStats } = usePlayerStats(user);
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    selectedBoosts, 
    weeklyBoosts,
    daysUntilReset,
    completeBoost, 
    isLoading: boostLoading 
  } = useBoostState(user?.id);

  // Listen for dashboard update events
  useEffect(() => {
    const handleDashboardUpdate = async () => {
      if (isUpdating) return;
      setIsUpdating(true);
      try {
        await Promise.all([refreshData(), refreshStats()]);
      } catch (err) {
        console.error('Error updating dashboard:', err);
      } finally {
        setIsUpdating(false);
      }
    };

    const handleUpdate = (event: Event) => {
      if (event.type === 'dashboardUpdate') {
        handleDashboardUpdate();
      }
    };

    window.addEventListener('dashboardUpdate', handleUpdate);
    return () => window.removeEventListener('dashboardUpdate', handleUpdate);
  }, [refreshData, refreshStats, isUpdating]);

  // Show loading state while data is being fetched
  if ((dashboardLoading || statsLoading) && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Ensure we have data before rendering
  if (!data) {
    return null;
  }

  return (
    <div className="relative">
      <CompanyLogo />
      <DashboardHeader
        healthSpanYears={data.healthSpanYears}
        healthScore={data.healthScore}
        level={stats.level}
        nextLevelPoints={stats.nextLevelPoints}
      />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <MyRocket
          level={stats.level}
          fuelPoints={stats.fuelPoints}
          nextLevelPoints={stats.nextLevelPoints}
          hasUpgrade={true}
        />
        <div id="leaderboard" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Player Standings</h2>
          </div>
          <RankStatus rankProgress={data.rankProgress} />
        </div>
        <div id="quests">
          <QuestCard
            userId={user?.id}
            categoryScores={data.categoryScores}
          />
        </div>
        <div id="challenges">
          <ChallengeGrid 
            userId={user?.id}
            categoryScores={data.categoryScores}
            verificationRequirements={data.verificationRequirements}
          />
        </div>
        <div id="boosts">
          <DailyBoosts 
            burnStreak={stats.burnStreak}
            completedBoosts={data.completedBoosts}
            selectedBoosts={selectedBoosts}
            weeklyBoosts={weeklyBoosts}
            daysUntilReset={daysUntilReset}
            onCompleteBoost={completeBoost}
          />
        </div>
      </main>
    </div>
  );
}