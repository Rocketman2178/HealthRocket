import { CategoryScores } from '../types';
import { CATEGORY_WEIGHTS } from '../constants';

export function calculateHealthScore(scores: CategoryScores | null): number {
  if (!scores) {
    return 7.8; // Default score if no scores provided
  }

  // Calculate weighted average
  const weightedSum = Object.entries(scores).reduce((total, [category, score]) => {
    const weight = CATEGORY_WEIGHTS[category as keyof typeof CATEGORY_WEIGHTS] || 0.2;
    return total + (score * weight);
  }, 0);

  // Round to 1 decimal place
  return Math.round(weightedSum * 10) / 10;
}