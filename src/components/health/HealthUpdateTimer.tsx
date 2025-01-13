import React, { useState, useEffect } from 'react';
import { Clock, Plus, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { HealthUpdateForm } from './HealthUpdateForm';
import { HealthAssessmentHistory } from './HealthAssessmentHistory';
import { useHealthAssessment } from '../../hooks/useHealthAssessment';
import { useSupabase } from '../../contexts/SupabaseContext';
import type { HealthUpdateData } from '../../lib/health/types';

interface HealthUpdateTimerProps {
  lastUpdate: Date;
  nextLevelFP: number;
  onUpdate?: (data: HealthUpdateData) => void;
}

export function HealthUpdateTimer({ lastUpdate, nextLevelFP, onUpdate }: HealthUpdateTimerProps) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { user } = useSupabase();
  const { 
    canUpdate, 
    daysUntilUpdate, 
    error,
    checkEligibility,
    assessmentHistory,
    historyLoading 
  } = useHealthAssessment(user?.id);

  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);
  
  // Calculate FP bonus (10% of next level requirement)
  const fpBonus = Math.round(nextLevelFP * 0.1);

  const handleUpdate = (data: HealthUpdateData) => {
    try {
      if (onUpdate) {
        onUpdate(data);
        setShowUpdateForm(false);
      }
    } catch (err) {
      console.error('Error updating health assessment:', err);
    }
  };

  return (
    <>
      <Card className="bg-gray-700/50">
        <div className="flex items-center py-0.5 px-3">
          {/* Left side - Status */}
          <div className="flex-[3] flex items-center gap-3">
            <div className="p-1.5 bg-lime-500/20 rounded-lg">
              <Clock className="text-lime-500" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Update Player Health</h3>
              <span className={`text-xs ${canUpdate ? 'text-lime-500' : 'text-gray-400'}`}>
                {canUpdate
                  ? 'Available Now!'
                  : `${daysUntilUpdate} Days Until Available`}
              </span>
            </div>
          </div>

          {/* Right side - Update Button & FP Bonus */}
          <div className="flex-1 flex flex-col items-end gap-0.5">
            <button
              onClick={() => canUpdate && setShowUpdateForm(true)}
              className={`p-1 rounded-lg transition-colors ${
                canUpdate 
                  ? 'bg-lime-500/20 hover:bg-lime-500/30' 
                  : 'bg-gray-600/20 cursor-not-allowed'
              }`}
            >
              <Plus 
                className={canUpdate ? 'text-lime-500' : 'text-gray-500'} 
                size={14} 
              />
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
            >
              View History
            </button>
            <div className="text-xs text-gray-400 w-full text-right flex items-center justify-end gap-1">
              <span>Bonus:</span>
              <span className={`flex items-center gap-0.5 ${canUpdate ? 'text-lime-500' : 'text-orange-500'}`}>
                <Zap size={12} className="shrink-0" />
                <span>{fpBonus}</span>
                <span>FP</span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {showUpdateForm && (
        <HealthUpdateForm
          onClose={() => setShowUpdateForm(false)}
          error={error}
          onSubmit={handleUpdate}
        />
      )}
      {showHistory && !historyLoading && (
        <HealthAssessmentHistory
          assessments={assessmentHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}