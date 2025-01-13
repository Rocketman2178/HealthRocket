import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../ui/card';
import type { HealthCategory } from '../../types/health';
import type { CategoryScores } from '../../lib/health/types';

interface HealthCategoryCardProps {
  category: HealthCategory;
  categoryScores: CategoryScores;
  isExpanded: boolean;
  onToggle: () => void;
}

export function HealthCategoryCard({ 
  category, 
  categoryScores,
  isExpanded, 
  onToggle 
}: HealthCategoryCardProps) {
  const Icon = category.icon;
  
  // Calculate impact based on relative scores
  const calculateImpact = () => {
    const currentScore = categoryScores[category.id.toLowerCase() as keyof CategoryScores];
    const healthScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / 5;

    if (currentScore > healthScore + 0.5) return 'POSITIVE';
    if (currentScore < healthScore - 0.5) return 'NEGATIVE';
    return 'NEUTRAL';
  };

  const impact = calculateImpact();
  const impactColors = {
    POSITIVE: 'text-lime-500',
    NEUTRAL: 'text-gray-400',
    NEGATIVE: 'text-orange-500'
  };

  const score = categoryScores[category.id.toLowerCase() as keyof CategoryScores] || 7.8;

  return (
    <Card className="bg-gray-700/50 overflow-hidden">
      <button
        className="w-full text-left"
        onClick={onToggle}
      > 
        <div className="p-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/20 rounded-lg shrink-0">
              <Icon className="text-orange-500" size={16} />
            </div>
            <h3 className="text-sm font-medium text-white">{category.name}</h3>
          </div>
          <p className="text-xs text-gray-400">{category.subtitle}</p>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <span className={`text-xs ${impactColors[impact]}`}>
                Impact: {impact}
              </span>
              <div className="text-lg font-bold text-white">
                {categoryScores[category.id.toLowerCase() as keyof CategoryScores]?.toFixed(1)}
              </div>
              {isExpanded ? (
                <ChevronUp className="text-gray-400" size={16} />
              ) : (
                <ChevronDown className="text-gray-400" size={16} />
              )}
            </div>
          </div>
        </div>
      </button>

      <div 
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-3 pb-3 pt-1 border-t border-gray-600/50">
          {/* Focus Impact */}
          <div className="mb-3 p-2.5 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-400">Score Impact</span>
              <span className={`text-xs font-medium ${impactColors[impact]}`}>{impact}</span>
            </div>
            <div className="text-xs text-gray-400">
              Comparison to overall HealthScore average
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <div className="text-xs font-medium text-gray-400 mb-1">Description</div>
            <div className="text-xs text-gray-400 leading-relaxed">
              {category.description}
            </div>
          </div>

          {/* Key Components */}
          <div>
            <div className="text-xs font-medium text-gray-400 mb-2">Key Components</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {category.keyComponents.map((component, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="mt-1.5 shrink-0">
                    <div className="w-1 h-1 bg-orange-500 rounded-full" />
                  </div>
                  <span className="text-xs text-gray-400 leading-tight">{component}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}