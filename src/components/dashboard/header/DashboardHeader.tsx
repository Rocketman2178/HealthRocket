import React, { useState, useEffect } from 'react';
import { Heart, Activity, Rocket, Info } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { HealthDashboard } from '../../health/HealthDashboard';
import { Tooltip } from '../../ui/tooltip';
import { useHealthAssessment } from '../../../hooks/useHealthAssessment';
import { useSupabase } from '../../../contexts/SupabaseContext';

interface DashboardHeaderProps {
  healthSpanYears: number;
  healthScore: number;
  nextLevelPoints: number;
  level: number;
}

export function DashboardHeader({ 
  healthSpanYears, 
  healthScore, 
  nextLevelPoints,
  level
}: DashboardHeaderProps) {
  const [showHealthDashboard, setShowHealthDashboard] = useState(false);
  const { user } = useSupabase();
  const { canUpdate } = useHealthAssessment(user?.id);

  return (
    <>
      <div className="bg-gray-800 py-4 sm:py-5 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            {/* Beta indicator */}
            <div className="absolute -top-5 right-4">
              <div className="bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium text-orange-500 border border-orange-500/30">
                v1.0 Beta
              </div>
            </div>
            <button 
              onClick={() => setShowHealthDashboard(true)}
              className="flex-1 max-w-[200px]"
            >
              <MetricCard
                icon={<Heart size={20} className="text-orange-500" />}
                label="+HealthSpan"
                value={`${healthSpanYears} years`}
                showNotification={canUpdate}
              />
            </button>
            <button 
              onClick={() => setShowHealthDashboard(true)}
              className="flex-1 max-w-[200px]"
            >
              <MetricCard
                icon={<Activity size={20} className="text-lime-500" />}
                label="HealthScore"
                value={healthScore.toString()}
                showNotification={canUpdate}
              />
            </button>
            <div className="flex-1 max-w-[200px]">
              <MetricCard
                icon={<Rocket size={20} className="text-orange-500" />}
                label="Level"
                value={level.toString()}
              />
            </div>
          </div>
        </div>
      </div>

      {showHealthDashboard && (
        <HealthDashboard
          healthSpanYears={healthSpanYears}
          healthScore={healthScore}
          nextLevelFP={nextLevelPoints}
          onClose={() => setShowHealthDashboard(false)}
        />
      )}
    </>
  );
}