import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CompletedQuest {
  id: string;
  quest_id: string;
  completed_at: string;
  fp_earned: number;
  challenges_completed: number;
  boosts_completed: number;
}

interface CompletedChallenge {
  id: string;
  challenge_id: string;
  quest_id?: string;
  completed_at: string;
  fp_earned: number;
  days_to_complete: number;
  final_progress: number;
}

interface CompletedActivities {
  quests: CompletedQuest[];
  challenges: CompletedChallenge[];
  totalBoostsCompleted: number;
  totalFpEarned: number;
  questsCompleted: number;
  challengesCompleted: number;
}

export function useCompletedActivities(userId: string | undefined) {
  const [data, setData] = useState<CompletedActivities>({
    quests: [],
    challenges: [],
    totalBoostsCompleted: 0,
    totalFpEarned: 0,
    questsCompleted: 0,
    challengesCompleted: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const countTotalBoosts = (boosts: any[] | null): number => {
    if (!boosts) return 0;
    return new Set(boosts.map(boost => boost.boost_id)).size;
  }

  useEffect(() => {
    async function fetchCompletedActivities() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch completed boosts
        const { data: boostsData, error: boostsError } = await supabase
          .from('completed_boosts') 
          .select('boost_id, completed_at')
          .eq('user_id', userId);

        if (boostsError && boostsError.code !== 'PGRST116') {
          console.error('Error fetching completed boosts:', boostsError);
          throw boostsError;
        }

        // Initialize with default values if no data
        const defaultData = {
          quests: [],
          challenges: [],
          totalBoostsCompleted: 0,
          questsCompleted: 0,
          challengesCompleted: 0,
          totalFpEarned: 0
        };

        // Fetch completed quests
        const { data: questsData, error: questsError } = await supabase
          .from('completed_quests')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .maybeSingle();

        if (questsError && questsError.code !== 'PGRST116') {
          console.error('Error fetching completed quests:', questsError);
          throw questsError;
        }

        // Fetch completed challenges
        const { data: challengesData, error: challengesError } = await supabase
          .from('completed_challenges')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false });

        if (challengesError && challengesError.code !== 'PGRST116') {
          console.error('Error fetching completed challenges:', challengesError);
          throw challengesError;
        }

        const completedQuests = questsData || [];
        const completedChallenges = challengesData || [];
        
        // Calculate totals from completed activities
        const totalFpEarned = (questsData || []).reduce((sum, q) => sum + (q.fp_earned || 0), 0) +
                             (challengesData || []).reduce((sum, c) => sum + (c.fp_earned || 0), 0);

        setData({
          quests: questsData || [],
          challenges: challengesData || [],
          totalBoostsCompleted: countTotalBoosts(boostsData || []),
          totalFpEarned,
          questsCompleted: (questsData || []).length,
          challengesCompleted: (challengesData || []).length
        });
      } catch (err) {
        console.error('Error fetching completed activities:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch completed activities'));
      } finally {
        setLoading(false);
      }
    }

    fetchCompletedActivities();
  }, [userId]);

  return { data, loading, error };
}