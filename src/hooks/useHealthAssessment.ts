import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import type { CategoryScores } from '../lib/health/types';
import { calculateHealthScore } from '../lib/health/calculators/score';
import { DatabaseError } from '../lib/errors';

interface HealthUpdateData {
  expectedLifespan: number;
  expectedHealthspan: number;
  categoryScores: CategoryScores;
}

export function useHealthAssessment(userId: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [canUpdate, setCanUpdate] = useState(false);
  const [daysUntilUpdate, setDaysUntilUpdate] = useState<number>(30);
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Check if user can submit new assessment
  const checkEligibility = async () => {
    if (!userId) return false;

    setError(null);
    setHistoryLoading(true);
    try {
      const { data: assessments, error } = await supabase
        .from('health_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // PGRST116 means no rows, which is fine - user can submit first assessment
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setAssessmentHistory(assessments || []);
      
      // Calculate days until next update
      const lastAssessment = assessments?.[0];
      if (!lastAssessment) {
        setDaysUntilUpdate(0);
        setCanUpdate(true);
        return true;
      }
      
      const lastUpdate = new Date(lastAssessment.created_at);
      const nextUpdate = new Date(lastUpdate);
      nextUpdate.setDate(nextUpdate.getDate() + 30);
      
      const now = new Date();
      const diffTime = nextUpdate.getTime() - now.getTime();
      const days = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      
      setDaysUntilUpdate(days);
      setCanUpdate(days === 0);
      return days === 0;

    } catch (err) {
      console.error('Error checking eligibility:', err);
      setError(err instanceof Error ? err : new DatabaseError('Failed to check eligibility'));
      return false;
    }
  };

  // Check eligibility on mount and when userId changes
  useEffect(() => {
    checkEligibility();
  }, [userId]);
  // Submit new health assessment
  const submitAssessment = async (data: HealthUpdateData) => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (data.expectedLifespan < 50 || data.expectedLifespan > 200) {
        throw new Error('Expected lifespan must be between 50 and 200');
      }
      if (data.expectedHealthspan < 50 || data.expectedHealthspan > data.expectedLifespan) {
        throw new Error('Expected healthspan must be between 50 and your expected lifespan');
      }

      const now = new Date().toISOString();
      const healthScore = calculateHealthScore(data.categoryScores);

      // Validate health score
      if (isNaN(healthScore) || healthScore < 1 || healthScore > 10) {
        throw new Error('Invalid health score calculated');
      }

      const { data: result, error } = await supabase.rpc('update_health_assessment', {
        p_user_id: userId,
        p_test_user_id: '676c3382-1fef-404a-90aa-565da369995f',
        p_expected_lifespan: data.expectedLifespan,
        p_expected_healthspan: data.expectedHealthspan,
        p_health_score: healthScore,
        p_mindset_score: data.categoryScores.mindset,
        p_sleep_score: data.categoryScores.sleep,
        p_exercise_score: data.categoryScores.exercise,
        p_nutrition_score: data.categoryScores.nutrition,
        p_biohacking_score: data.categoryScores.biohacking,
        p_created_at: now
      });

      if (error) {
        // Handle specific database errors
        if (error.message.includes('Must wait 30 days')) {
          throw new Error('Must wait 30 days between health assessments');
        }
        throw error;
      }

      // Check if the function returned an error
      if (result && !result.success) {
        throw new Error(result.error || 'Failed to update health assessment');
      }
      // Wait briefly to ensure transaction completes
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refresh eligibility and history
      await checkEligibility();

      // Trigger refresh events
      window.dispatchEvent(new CustomEvent('healthUpdate'));
      window.dispatchEvent(new CustomEvent('dashboardUpdate'));
      return true;
      
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new DatabaseError('Failed to update health assessment');
      console.error('Error updating health assessment:', error);
      setError(error);
      throw err;
    } finally {
      setHistoryLoading(false);
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    canUpdate,
    assessmentHistory,
    historyLoading,
    daysUntilUpdate,
    checkEligibility,
    submitAssessment
  };
}