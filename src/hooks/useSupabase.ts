import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type Quest = Tables['quests']['Row'];
type Challenge = Tables['challenges']['Row'];
type CompletedBoost = Tables['completed_boosts']['Row'];

export function useSupabase(userId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedBoosts, setCompletedBoosts] = useState<CompletedBoost[]>([]);

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user data'));
      }
    }

    fetchUserData();
  }, [userId]);

  // Fetch quests
  useEffect(() => {
    async function fetchQuests() {
      try {
        const { data, error } = await supabase
          .from('quests')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        setQuests(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch quests'));
      }
    }

    fetchQuests();
  }, [userId]);

  // Fetch challenges
  useEffect(() => {
    async function fetchChallenges() {
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        setChallenges(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch challenges'));
      }
    }

    fetchChallenges();
  }, [userId]);

  // Fetch completed boosts
  useEffect(() => {
    async function fetchCompletedBoosts() {
      try {
        const { data, error } = await supabase
          .from('completed_boosts')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        setCompletedBoosts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch completed boosts'));
      } finally {
        setLoading(false);
      }
    }

    fetchCompletedBoosts();
  }, [userId]);

  // Update user data
  const updateUser = async (updates: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user'));
      throw err;
    }
  };

  // Start a quest
  const startQuest = async (questId: string) => {
    try {
      const { error } = await supabase
        .from('quests')
        .insert({
          user_id: userId,
          quest_id: questId,
          status: 'active',
          progress: 0,
          started_at: new Date().toISOString()
        });

      if (error) throw error;
      // Refresh quests
      const { data, error: fetchError } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', userId);

      if (fetchError) throw fetchError;
      setQuests(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start quest'));
      throw err;
    }
  };

  // Start a challenge
  const startChallenge = async (challengeId: string) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .insert({
          user_id: userId,
          challenge_id: challengeId,
          status: 'active',
          progress: 0,
          started_at: new Date().toISOString()
        });

      if (error) throw error;
      // Refresh challenges
      const { data, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', userId);

      if (fetchError) throw fetchError;
      setChallenges(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start challenge'));
      throw err;
    }
  };

  // Complete a boost
  const completeBoost = async (boostId: string) => {
    try {
      const { error } = await supabase
        .from('completed_boosts')
        .insert({
          user_id: userId,
          boost_id: boostId,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
      // Refresh completed boosts
      const { data, error: fetchError } = await supabase
        .from('completed_boosts')
        .select('*')
        .eq('user_id', userId);

      if (fetchError) throw fetchError;
      setCompletedBoosts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to complete boost'));
      throw err;
    }
  };

  return {
    loading,
    error,
    user,
    quests,
    challenges,
    completedBoosts,
    updateUser,
    startQuest,
    startChallenge,
    completeBoost
  };
}