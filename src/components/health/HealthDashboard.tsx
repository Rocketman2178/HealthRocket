import React from 'react';
import { X, Info } from 'lucide-react';
import { HealthSpanCard } from './HealthSpanCard';
import { HealthScoreCard } from './HealthScoreCard';
import { HealthUpdateTimer } from './HealthUpdateTimer';
import { DashboardGuide } from './DashboardGuide';
import { Tooltip } from '../ui/tooltip';
import { useUser } from '../../hooks/useUser'; 
import { useHealthAssessment } from '../../hooks/useHealthAssessment';
import { useSupabase } from '../../contexts/SupabaseContext'; 
import type { HealthUpdateData } from '../../lib/health/types';

interface HealthDashboardProps {
  healthSpanYears: number;
  healthScore: number;
  nextLevelFP: number;
  onClose: () => void;
}

export function HealthDashboard({ 
  healthSpanYears, 
  healthScore, 
  nextLevelFP,
  onClose 
}: HealthDashboardProps) {
  const { user } = useSupabase();
  const { healthData } = useUser(user?.id);
  const { submitAssessment, daysUntilUpdate, checkEligibility } = useHealthAssessment(user?.id);

  const handleUpdate = async (data: HealthUpdateData) => {
    try {
      await submitAssessment(data);
      // Force refresh health data
      await checkEligibility();
      window.dispatchEvent(new CustomEvent('dashboardUpdate'));
    } catch (err) {
      console.error('Error updating health assessment:', err);
    }
  };

  // Get projected milestones
  const projectedMilestones = {
    projectedTotalYears: 15,
    willReachTarget: false,
    estimatedTimeToTarget: 6.5,
    projectedMilestones: [
      { years: 5, projected: new Date(Date.now() + 7776000000) },
      { years: 10, projected: new Date(Date.now() + 15552000000) },
      { years: 15, projected: new Date(Date.now() + 23328000000) },
      { years: 20, projected: new Date(Date.now() + 31104000000) }
    ]
  };

  const categoryScores = {
    mindset: healthData?.mindset_score || 7.8,
    sleep: healthData?.sleep_score || 7.8,
    exercise: healthData?.exercise_score || 7.8,
    nutrition: healthData?.nutrition_score || 7.8,
    biohacking: healthData?.biohacking_score || 7.8
  };
  
  const now = new Date();
  const daysAgo = 45;
  const lastUpdate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4">
        <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl my-8">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Player Health</h2>
              <Tooltip content={<DashboardGuide />}>
                <Info size={16} className="text-gray-400 hover:text-gray-300" />
              </Tooltip>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-4 space-y-6">
            <HealthUpdateTimer 
              lastUpdate={lastUpdate}
              nextLevelFP={nextLevelFP} 
              onUpdate={handleUpdate}
            />

            <HealthSpanCard
              years={healthSpanYears}
              monthlyGain={0.3}
              totalPotential={20} 
              daysUntilUpdate={daysUntilUpdate}
              projectedHealthspan={healthData?.expected_healthspan || 85}
              projectedMilestones={projectedMilestones}
            />

            <HealthScoreCard 
              score={healthScore}
              categoryScores={categoryScores}
              daysUntilUpdate={daysUntilUpdate}
              recommendedFocus={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}