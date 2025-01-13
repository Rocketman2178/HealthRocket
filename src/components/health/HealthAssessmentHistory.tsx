import React from 'react';
import { X, TrendingUp, TrendingDown, Minus, Activity, Calendar } from 'lucide-react';
import type { HealthAssessment } from '../../types/health';

interface HealthAssessmentHistoryProps {
  assessments: HealthAssessment[];
  onClose: () => void;
}

export function HealthAssessmentHistory({ assessments, onClose }: HealthAssessmentHistoryProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Activity className="text-orange-500" size={20} />
            <h2 className="text-lg font-semibold text-white">Health Assessment History</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {assessments.map((assessment, index) => {
              const prevAssessment = assessments[index + 1];
              
              const getTrend = (current: number, previous?: number) => {
                if (!previous) return null;
                if (current > previous) return <TrendingUp className="text-lime-500" size={14} />;
                if (current < previous) return <TrendingDown className="text-orange-500" size={14} />;
                return <Minus className="text-gray-400" size={14} />;
              };

              return (
                <div key={assessment.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-300">
                        {new Date(assessment.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">HealthScore</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">
                          {assessment.health_score.toFixed(1)}
                        </span>
                        {getTrend(assessment.health_score, prevAssessment?.health_score)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-1">+HealthSpan</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">
                          +{assessment.healthspan_years.toFixed(1)} years
                        </span>
                        {getTrend(assessment.healthspan_years, prevAssessment?.healthspan_years)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="text-sm text-gray-400 mb-2">Category Scores</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries({
                        Mindset: assessment.mindset_score,
                        Sleep: assessment.sleep_score,
                        Exercise: assessment.exercise_score,
                        Nutrition: assessment.nutrition_score,
                        Biohacking: assessment.biohacking_score
                      }).map(([category, score]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white">{score.toFixed(1)}</span>
                            {getTrend(
                              score,
                              prevAssessment?.[`${category.toLowerCase()}_score` as keyof typeof prevAssessment] as number
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}