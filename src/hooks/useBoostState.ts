import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { calculateStreakBonus } from '../lib/utils';
import { boosts } from '../data';
import type { BoostState } from '../types/dashboard';

export function useBoostState(userId: string | undefined) {
  const [selectedBoosts, setSelectedBoosts] = useState<BoostState[]>([]);
  const [weeklyBoosts, setWeeklyBoosts] = useState<BoostState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [daysUntilReset, setDaysUntilReset] = useState<number>(7);
  const [weekStartDate, setWeekStartDate] = useState<Date>(new Date());
  const [todayBoosts, setTodayBoosts] = useState<BoostState[]>([]);

  // Get today's completed boosts count and FP
  const getTodayStats = useCallback(async () => {
    if (!userId) return;
    
    // Get today's stats from RPC function
    const { data: stats, error: statsError } = await supabase
      .rpc('get_today_stats', {
        p_user_id: userId
      });

    if (statsError) {
      console.error('Error getting today\'s stats:', statsError);
      return;
    }
    
    // Get today's completed boosts
    const today = new Date().toISOString().split('T')[0];
    const { data: todayBoosts, error: boostsError } = await supabase
      .from('completed_boosts')
      .select('*')
      .eq('user_id', userId)
      .eq('completed_date', today);

    if (boostsError) {
      console.error('Error getting today\'s boosts:', boostsError);
      return;
    }

    // Set today's completed boosts
    setSelectedBoosts(todayBoosts?.map(boost => ({
      id: boost.boost_id,
      completedAt: new Date(boost.completed_at),
      weekStartDate: weekStartDate
    })) || []);
  }, [userId, weekStartDate]);

  // Get today's completed boosts count
  const getTodayBoostCount = useCallback(async () => {
    if (!userId) return 0;
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('completed_boosts')
      .select('*')
      .eq('user_id', userId)
      .eq('completed_date', today);

    if (error) {
      console.error('Error getting today\'s boosts:', error);
      return 0;
    }

    return data?.length || 0;
  }, [userId]);

  // Fetch completed boosts for current week
  useEffect(() => {
    if (!userId) return;

    const fetchCompletedBoosts = async () => {
      try {
        // Calculate week start
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);

        // Fetch completed boosts for this week
        const { data: completedBoosts, error } = await supabase
          .from('completed_boosts')
          .select('*')
          .eq('user_id', userId)
          .gte('completed_date', weekStart.toISOString().split('T')[0]);

        if (error) throw error;

        // Update weekly boosts state
        if (completedBoosts) {
          setWeeklyBoosts(completedBoosts.map(boost => ({
            id: boost.boost_id,
            completedAt: new Date(boost.completed_at),
            weekStartDate: weekStart
          })));
        }
      } catch (err) {
        console.error('Error fetching completed boosts:', err);
      }
    };

    fetchCompletedBoosts();
  }, [userId]);

  // Initialize today's stats on mount
  useEffect(() => {
    if (userId) {
      getTodayStats();
    }
  }, [getTodayStats]);

  useEffect(() => {
    if (!userId) return;
    
    const initializeBoosts = async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      setWeekStartDate(weekStart);
      
      // Clear all boost states at the start of a new week
      if (daysUntilReset === 7) {
        setWeeklyBoosts([]);
        setSelectedBoosts([]);
      }

      setIsLoading(false);
    };

    initializeBoosts();
  }, [userId, daysUntilReset]);

  // Calculate days until reset
  useEffect(() => {
    const calculateDaysUntilReset = () => {
      if (userId === '91@gmail.com' || userId === 'test25@gmail.com') {
        setDaysUntilReset(7);
        return;
      }

      const now = new Date();
      const nextSunday = new Date(now);
      const daysUntilSunday = 7 - now.getDay();
      nextSunday.setDate(now.getDate() + daysUntilSunday);
      nextSunday.setHours(0, 0, 0, 0);
      
      const diffTime = nextSunday.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilReset(diffDays);
    };

    calculateDaysUntilReset();
    const interval = setInterval(calculateDaysUntilReset, 1000 * 60 * 60);
    
    return () => clearInterval(interval);
  }, [userId]);

  // Schedule sync at midnight
  useEffect(() => {
    if (!userId || isLoading) return;
    
    // Reset selected boosts at start of new week
    const now = new Date();
    if (now >= weekStartDate) {
      setSelectedBoosts([]);
      setWeeklyBoosts([]);
    }

    // Refresh stats every minute
    const interval = setInterval(getTodayStats, 60000);
    return () => clearInterval(interval);
  }, [userId, weekStartDate, isLoading]);
  const completeBoost = useCallback(async (boostId: string) => {
    try {
      // Check if already at daily limit
      const todayCount = await getTodayBoostCount();
      if (todayCount >= 3) {
        console.log('Daily boost limit reached');
        return;
      }

      const { data, error } = await supabase
        .rpc('complete_boost', {
          p_user_id: userId,
          p_boost_id: boostId
        });

      if (error) {
        console.error('Error completing boost:', error);
        return;
      }

      // Refresh data after successful completion
      const { data: completedBoosts, error: fetchError } = await supabase
        .from('completed_boosts')
        .select('*')
        .eq('user_id', userId)
        .gte('completed_date', weekStartDate.toISOString().split('T')[0]);

      if (fetchError) throw fetchError;

      // Update weekly boosts state
      if (completedBoosts) {
        setWeeklyBoosts(completedBoosts.map(boost => ({
          id: boost.boost_id,
          completedAt: new Date(boost.completed_at),
          weekStartDate: weekStartDate
        })));

        // Update selected boosts for today
        const today = new Date().toISOString().split('T')[0];
        const todayBoosts = completedBoosts.filter(
          boost => boost.completed_date === today
        );
        setSelectedBoosts(todayBoosts.map(boost => ({
          id: boost.boost_id,
          completedAt: new Date(boost.completed_at),
          weekStartDate: weekStartDate
        })));
      }

    } catch (err) {
      console.error('Error completing boost:', err);
    }
  }, [userId, weekStartDate, getTodayBoostCount]);

  return {
    selectedBoosts,
    weeklyBoosts,
    daysUntilReset,
    completeBoost,
    isLoading
  };
}