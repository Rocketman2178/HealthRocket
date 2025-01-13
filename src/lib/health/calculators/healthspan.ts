import { PlayerHealth, ProjectedHealthspan } from '../types';

export function calculateProjectedHealthspan(
  playerHealth: PlayerHealth,
  currentAge: number,
  healthScore: number,
  maxTargetYears: number
): ProjectedHealthspan {
  const baseHealthspan = playerHealth.initialHealthspan;
  const scoreImpact = (healthScore - 5) / 5;
  
  const maxPossibleImprovement = Math.min(
    playerHealth.expectedLifespan - baseHealthspan,
    baseHealthspan
  );

  const actualImprovement = maxPossibleImprovement * scoreImpact;
  
  const projectedHealthspan = Math.min(
    playerHealth.expectedLifespan,
    baseHealthspan + actualImprovement
  );

  const yearsGained = projectedHealthspan - baseHealthspan;
  const missionProgress = Math.min(1, yearsGained / maxTargetYears);

  return {
    projectedHealthspan,
    yearsGained,
    missionProgress,
    scoreImpact,
    maxPossibleImprovement
  };
}