import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { quests as questData } from '../data';
import { QuestStateManager } from '../lib/quest/QuestStateManager';
import { QuestDataService } from '../lib/quest/QuestDataService';
import type { Quest } from '../types/dashboard';
import { DatabaseError, EmptyResultError } from '../lib/errors';

export function useQuestManager(userId: string | undefined) {
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasCompletedTier0, setHasCompletedTier0] = useState(false);

  // Fetch active quest from Supabase
  const fetchActiveQuest = async () => {
    if (!userId) {
      setLoading(false);
      setActiveQuest(null);
      return;
    }

    // Check if Tier 0 challenge is completed
    const { data: tier0Data } = await supabase
      .from('completed_challenges')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_id', 'tc0')
      .eq('status', 'completed')
      .maybeSingle();

    setHasCompletedTier0(!!tier0Data);

    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116') {
          // No active quest found
          setActiveQuest(null);
          return;
        }
        throw error;
      }

      // Handle case where no quests exist yet
      if (!data) {
        setActiveQuest(null);
        return;
      }

      // Find quest details from data
      const details = QuestDataService.getQuestDetails(data.quest_id);
      if (!details) {
        console.warn('Quest details not found for:', data.quest_id);
        setActiveQuest(null);
        return;
      }

      const daysElapsed = Math.floor(
        (new Date().getTime() - new Date(data.started_at).getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      const daysRemaining = Math.max(0, (details.duration || 90) - daysElapsed);

      setActiveQuest({
        ...data,
        name: details.name,
        description: details.description,
        category: details.category,
        verificationMethods: details.verificationMethods || [],
        expertReference: details.expertReference,
        fuelPoints: details.fuelPoints,
        challengeIds: details.challengeIds,
        duration: details.duration || 90,
        daysRemaining
      });
    } catch (err) {
      console.error('Error fetching active quest:', err);
      setError(err instanceof Error ? err : new DatabaseError('Failed to fetch active quest'));
    } finally {
      setLoading(false);
    }
  };

  // Start a new quest
  const startQuest = async (questId: string) => {
    if (!userId) return;
    setLoading(true);

    try {
      const questDetails = QuestDataService.getQuestDetails(questId);
      if (!questDetails) throw new Error('Quest not found');

      // Create quest in Supabase
      const { data, error } = await supabase
        .from('quests')
        .insert({
          user_id: userId,
          quest_id: questId,
          status: 'active',
          progress: 0,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger quest selected event with challenge IDs
      window.dispatchEvent(new CustomEvent('questSelected', {
        detail: { questId, challengeIds: questDetails.challengeIds }
      }));

      // Update local state with combined data
      setActiveQuest({
        ...data,
        name: questDetails.name,
        description: questDetails.description,
        category: questDetails.category,
        verificationMethods: questDetails.verificationMethods || [],
        expertReference: questDetails.expertReference,
        fuelPoints: questDetails.fuelPoints,
        challengeIds: questDetails.challengeIds || [],
        duration: 90,
        daysRemaining: 90
      });

      return data;
    } catch (err) {
      console.error('Error starting quest:', err);
      setError(err instanceof Error ? err : new DatabaseError('Failed to start quest'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel active quest
  const cancelQuest = async () => {
    if (!userId || !activeQuest) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('quests')
        .delete()
        .eq('user_id', userId)
        .eq('quest_id', activeQuest.quest_id);

      if (error) throw error;

      // Update local state
      setActiveQuest(null);
      
      // Trigger quest canceled event
      window.dispatchEvent(new CustomEvent('questCanceled'));
      
      // Trigger dashboard refresh
      window.dispatchEvent(new CustomEvent('dashboardUpdate'));
    } catch (err) {
      console.error('Error canceling quest:', err);
      setError(err instanceof Error ? err : new DatabaseError('Failed to cancel quest'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchActiveQuest();
  }, [userId]);

  return {
    activeQuest,
    loading,
    hasCompletedTier0,
    error,
    startQuest,
    cancelQuest
  };
}