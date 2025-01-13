import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { calculateNextLevelPoints } from '../lib/utils';
import { DatabaseError } from '../lib/errors';

interface DashboardData {
  level: number;
  fuelPoints: number;
  burnStreak: number;
  healthScore: number;
  healthSpanYears: number;
  healthSpanGap: number;
  nextLevelPoints: number;
  categoryScores: {
    mindset: number;
    sleep: number;
    exercise: number;
    nutrition: number;
    biohacking: number;
  };
  rankProgress: {
    rank: number;
    percentile: number;
    heroAchieved: boolean;
    currentPoints: number;
    legendThresholdPoints: number;
  };
  dailyStats: {
    boostsCompleted: number;
    fpEarned: number;
    challengesCompleted: number;
    questsCompleted: number;
  };
  completedBoosts: {
    id: string;
    completedAt: Date;
  }[];
}

export function useDashboardData(user: User | null) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Default dashboard data
  const defaultData: DashboardData = {
    level: 1,
    fuelPoints: 0,
    burnStreak: 0,
    healthScore: 7.8,
    healthSpanYears: 0,
    healthSpanGap: 0,
    nextLevelPoints: 1000,
    categoryScores: {
      mindset: 7.8,
      sleep: 7.8,
      exercise: 7.8,
      nutrition: 7.8,
      biohacking: 7.8
    },
    rankProgress: {
      rank: 99,
      percentile: 50,
      heroAchieved: false,
      currentPoints: 0,
      legendThresholdPoints: 2100
    },
    dailyStats: {
      boostsCompleted: 0,
      fpEarned: 0,
      challengesCompleted: 0,
      questsCompleted: 0
    },
    completedBoosts: []
  };

  const fetchDashboardData = async () => {
    try {
      if (!user) {
        setData(defaultData);
        setLoading(false);
        return;
      }

      // Fetch all required data in parallel
      const [
        { data: userData, error: userError },
        { data: statusHistory },
        { data: completedActivities, error: activitiesError },
        { data: boostsData, error: boostsError }
      ] = await Promise.all([
        supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single(),
        supabase
          .from('player_status_history')
          .select('*')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false })
          .limit(1),
        supabase
          .from('completed_boosts')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('completed_boosts')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
      ]);

      if (userError) {
        console.warn('Error fetching user data:', userError);
        setData(defaultData);
        return;
      }

      if (activitiesError && activitiesError.code !== 'PGRST116') {
        console.warn('Error fetching activities:', activitiesError);
      }

      if (boostsError) {
        console.warn('Error fetching boosts:', boostsError);
      }

      // Get latest status or use defaults
      const latestStatus = statusHistory?.[0] || {
        rank: defaultData.rankProgress.rank,
        percentile: defaultData.rankProgress.percentile,
        status: 'Pending',
        average_fp: defaultData.rankProgress.currentPoints
      };

      // Fetch latest category scores
      const { data: healthData, error: healthError } = await supabase
        .from('health_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (healthError && healthError.code !== 'PGRST116') {
        console.warn('Error fetching health assessment:', healthError);
      }
      
      let categoryScores = {
        mindset: healthData?.mindset_score || defaultData.categoryScores.mindset,
        sleep: healthData?.sleep_score || defaultData.categoryScores.sleep,
        exercise: healthData?.exercise_score || defaultData.categoryScores.exercise,
        nutrition: healthData?.nutrition_score || defaultData.categoryScores.nutrition,
        biohacking: healthData?.biohacking_score || defaultData.categoryScores.biohacking
      };

      // Fetch today's stats
      const today = new Date().toISOString().split('T')[0];
      let dailyStats = { ...defaultData.dailyStats };
      
      try {
        const { data: dailyData, error: dailyError } = await supabase
          .from('daily_fp')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .maybeSingle();  // Use maybeSingle() instead of single()

        if (!dailyError && dailyData) {
          dailyStats = {
            boostsCompleted: dailyData.boosts_completed || 0,
            fpEarned: dailyData.fp_earned || 0,
            challengesCompleted: dailyData.challenges_completed || 0,
            questsCompleted: dailyData.quests_completed || 0
          };
        }
      } catch (err) {
        console.warn('Using default daily stats:', err);
      }

      const nextLevelPoints = calculateNextLevelPoints(userData?.level || 1);

      setData({
        level: userData?.level || defaultData.level,
        fuelPoints: userData?.fuel_points || defaultData.fuelPoints,
        burnStreak: userData?.burn_streak || defaultData.burnStreak,
        healthScore: userData?.health_score || defaultData.healthScore,
        healthSpanYears: userData?.healthspan_years || defaultData.healthSpanYears,
        healthSpanGap: userData?.healthspan_gap || defaultData.healthSpanGap,
        nextLevelPoints,
        categoryScores,
        rankProgress: {
          rank: latestStatus.rank,
          percentile: latestStatus.percentile,
          heroAchieved: (latestStatus.status === 'Hero' || latestStatus.status === 'Legend'),
          currentPoints: latestStatus.average_fp,
          legendThresholdPoints: defaultData.rankProgress.legendThresholdPoints
        },
        dailyStats,
        completedBoosts: (boostsData || []).map(boost => ({
          id: boost.boost_id,
          completedAt: new Date(boost.completed_at)
        }))
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setData(defaultData); // Use default data on error
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshData = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  return {
    data,
    loading,
    error,
    refreshData,
    isRefreshing
  };
}