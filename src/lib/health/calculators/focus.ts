import { CategoryScores, FocusRecommendation, ImpactLevel } from '../types';

export function calculateRecommendedFocus(scores: CategoryScores): FocusRecommendation[] {
  return Object.entries(scores)
    .map(([category, score]) => ({
      category,
      score,
      impact: calculateCategoryImpact(score),
      potentialYearsGain: calculatePotentialYearsGain(score)
    }))
    .sort((a, b) => b.potentialYearsGain - a.potentialYearsGain);
}

function calculatePotentialYearsGain(currentScore: number): number {
  const possibleImprovement = 10 - currentScore;
  return possibleImprovement * 2;
}

function calculateCategoryImpact(score: number): ImpactLevel {
  if (score <= 3) return 'CRITICAL';
  if (score <= 5) return 'HIGH';
  if (score <= 7) return 'MEDIUM';
  return 'LOW';
}