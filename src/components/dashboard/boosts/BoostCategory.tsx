import React, { useState } from 'react';
import { LucideIcon, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { BoostItem } from './BoostItem';
import { boostCategories } from '../../../data/boostCategories'; 
import { Tooltip } from '../../ui/tooltip';
import type { Boost, CompletedBoost, BoostState } from '../../../types/dashboard';

interface BoostCategoryProps {
  name: string;
  icon: LucideIcon;
  boosts: Boost[];
  completedBoosts: CompletedBoost[];
  selectedBoosts: BoostState[] | [];
  weeklyBoosts: BoostState[] | [];
  boostsRemaining: number;
  onComplete?: (id: string) => void;
}

export function BoostCategory({ 
  name, 
  icon: Icon, 
  boosts, 
  completedBoosts,
  selectedBoosts,
  weeklyBoosts,
  boostsRemaining,
  onComplete 
}: BoostCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get the start of the current week
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  // Filter boosts completed this week
  const thisWeeksCompletedBoosts = completedBoosts.filter(boost => 
    new Date(boost.completedAt) >= startOfWeek
  );

  // Check if at least one tier 1 boost from each category is completed this week
  const categoriesWithCompletedTier1 = boostCategories.map(category => {
    const categoryTier1Boosts = category.boosts.filter(boost => boost.tier === 1);
    return categoryTier1Boosts.some(boost => 
      weeklyBoosts?.some(completed => completed.id === boost.id)
    );
  });

  // Check if all categories have at least one completed tier 1 boost
  const allCategoriesHaveTier1Completed = categoriesWithCompletedTier1.every(
    hasCompleted => hasCompleted
  );

  // Get category ID from name
  const categoryId = name.toLowerCase();

  // Separate boosts by tier
  const tier1Boosts = boosts.filter(boost => boost.tier === 1);
  const tier2Boosts = boosts.filter(boost => boost.tier === 2);
  
  // Sort boosts by FP within each tier
  const sortedTier1Boosts = [...tier1Boosts].sort((a, b) => a.fuelPoints - b.fuelPoints);
  const sortedTier2Boosts = [...tier2Boosts].sort((a, b) => a.fuelPoints - b.fuelPoints);

  // Combine all boosts
  const allBoosts = [...sortedTier1Boosts, ...sortedTier2Boosts];
  
  // Determine which boosts to show 
  const visibleBoosts = isExpanded ? allBoosts : allBoosts.slice(0, 3);
  const hasMoreBoosts = allBoosts.length > 3;
  const safeWeeklyBoosts = weeklyBoosts || [];
  const safeSelectedBoosts = selectedBoosts || [];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className="text-orange-500" size={20} />
          <h3 className="text-sm font-medium text-gray-400">{name}</h3>
          <Tooltip categoryId={categoryId}>
            <Info size={14} className="text-gray-500 hover:text-gray-400" />
          </Tooltip>
        </div>
        {hasMoreBoosts && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400 transition-colors"
          >
            <span>{isExpanded ? 'Show Less' : 'View More'}</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {visibleBoosts.map(boost => {
          const completedBoost = completedBoosts.find(completed => completed.id === boost.id);
          const isSelected = selectedBoosts && selectedBoosts.some(b => b.id === boost.id);
          const isCompleted = !!completedBoost;
          const isCompletedThisWeek = weeklyBoosts && weeklyBoosts.some(b => b.id === boost.id);
          const isPreviousDay = isCompleted && !isSelected;
          const isLocked = boost.tier === 2 && !allCategoriesHaveTier1Completed;
          const isDisabled = !isSelected && boostsRemaining === 0;

          return (
            <BoostItem
              key={boost.id}
              id={boost.id}
              estimatedTime={boost.estimatedTime}
              expertReference={boost.expertReference}
              instructions={boost.instructions}
              successCriteria={boost.successCriteria}
              name={boost.name}
              description={boost.description}
              fuelPoints={boost.fuelPoints}
              tier={boost.tier}
              isCompletedThisWeek={isCompletedThisWeek}
              isCompleted={isSelected}
              isPreviousDay={isPreviousDay}
              isLocked={isLocked}
              isDisabled={isDisabled}
              onComplete={onComplete}
            />
          );
        })}
      </div>
    </div>
  );
}