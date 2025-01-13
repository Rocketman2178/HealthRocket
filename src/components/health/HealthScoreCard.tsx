import React, { useState } from 'react';
import { Activity, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Tooltip } from '../ui/tooltip';
import { HealthScoreTooltip } from './HealthScoreTooltip';
import { HealthCategoryCard } from './HealthCategoryCard';
import { CategoryOverview } from './CategoryOverview';
import { HEALTH_CATEGORIES } from '../../data/healthCategories';
import type { CategoryScores, FocusRecommendation } from '../../lib/health/types';

interface HealthScoreCardProps {
  score: number;
  categoryScores: CategoryScores;
  recommendedFocus: FocusRecommendation[];
  daysUntilUpdate: number;
}

export function HealthScoreCard({ 
  score,
  categoryScores,
  recommendedFocus,
  daysUntilUpdate
}: HealthScoreCardProps) {
  const [showDetailedCategories, setShowDetailedCategories] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const progress = (score / 10) * 100;
  
  const isAvailable = daysUntilUpdate === 0;
  
  // Ensure we have valid scores and they're properly typed
  const safeScores: CategoryScores = {
    mindset: categoryScores.mindset || 7.8,
    sleep: categoryScores.sleep || 7.8,
    exercise: categoryScores.exercise || 7.8,
    nutrition: categoryScores.nutrition || 7.8,
    biohacking: categoryScores.biohacking || 7.8
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-white">HealthScore</h2>
        <Tooltip content={<HealthScoreTooltip />}>
          <Info size={16} className="text-gray-400 hover:text-gray-300" />
        </Tooltip>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <Activity className="text-lime-500" size={28} />
            <div>
              <h3 className="font-bold text-white text-2xl">{score.toFixed(1)}</h3>
              <p className="text-sm text-gray-400">Overall Health Rating</p>
            </div>
          </div>
          <div className="text-[11px] text-gray-400 ml-auto text-right">
            <div>Next Update</div>
            <div>
              <span className={daysUntilUpdate === 0 ? 'text-lime-500' : 'text-orange-500'}>
                {isAvailable ? 'Available Now!' : `${daysUntilUpdate} Days`}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progress} max={100} className="bg-gray-700 h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Top 15% in Community</span>
            <span className="text-orange-500">{score.toFixed(1)} / 10</span>
          </div>
        </div>

        <div className="mt-4">
          {showDetailedCategories ? (
            <div className="space-y-4">
              <button
                onClick={() => setShowDetailedCategories(false)}
                className="w-full flex items-center justify-between p-2 text-sm text-gray-400 hover:text-gray-300"
              >
                <span>Show Less</span>
                <ChevronUp size={16} />
              </button>
              <div className="space-y-3">
                {HEALTH_CATEGORIES.map((category) => {
                  const focusItem = recommendedFocus.find(
                    f => f.category.toLowerCase() === category.id
                  );
                  
                  return (
                    <HealthCategoryCard
                      key={category.id}
                      category={category}
                      categoryScores={categoryScores}
                      isExpanded={expandedCategory === category.id}
                      onToggle={() => setExpandedCategory(
                        expandedCategory === category.id ? null : category.id
                      )}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <CategoryOverview 
                scores={safeScores}
                onExpandCategories={() => setShowDetailedCategories(true)}
              />
              <button
                onClick={() => setShowDetailedCategories(true)}
                className="w-full flex items-center justify-between p-2 text-sm text-gray-400 hover:text-gray-300"
              >
                <span>View Details</span>
                <ChevronDown size={16} />
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}