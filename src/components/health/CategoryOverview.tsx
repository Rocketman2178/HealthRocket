import React from 'react';
import { Brain, Moon, Activity, Apple, Database } from 'lucide-react';
import { CategoryScores } from '../../lib/health/types';

interface CategoryOverviewProps {
  scores: CategoryScores;
  onExpandCategories: () => void;
}

export function CategoryOverview({ scores, onExpandCategories }: CategoryOverviewProps) {
  const categories = [
    { id: 'mindset', name: 'Mindset', icon: Brain, score: scores.mindset },
    { id: 'sleep', name: 'Sleep', icon: Moon, score: scores.sleep },
    { id: 'exercise', name: 'Exercise', icon: Activity, score: scores.exercise },
    { id: 'nutrition', name: 'Nutrition', icon: Apple, score: scores.nutrition },
    { id: 'biohacking', name: 'Biohacking', icon: Database, score: scores.biohacking }
  ];

  return (
    <button 
      onClick={onExpandCategories}
      className="w-full grid grid-cols-5 gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors"
    >
      {categories.map(({ id, name, icon: Icon, score }) => (
        <div key={id} className="flex flex-col items-center gap-1">
          <Icon size={16} className="text-orange-500" />
          <div className="text-[10px] text-gray-400 text-center leading-tight">{name}</div>
          <div className="text-xs font-medium text-white">{scores[id]?.toFixed(1)}</div>
        </div>
      ))}
    </button>
  );
}