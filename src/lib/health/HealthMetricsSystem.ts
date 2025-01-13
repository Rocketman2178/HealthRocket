import { 
  PlayerHealth, 
  HealthSnapshot,
  MissionReport 
} from './types';
import { MISSION_TARGET_YEARS, MISSION_DURATION_YEARS } from './constants';
import { calculateHealthScore } from './calculators/score';
import { calculateProjectedHealthspan } from './calculators/healthspan';
import { calculateNextMilestone, calculateProjectedMilestones } from './calculators/milestones';
import { calculateRecommendedFocus } from './calculators/focus';

class HealthMetricsSystem {
  createHealthSnapshot(
    playerHealth: PlayerHealth,
    currentAge: number
  ): HealthSnapshot {
    const healthScore = calculateHealthScore(playerHealth.categoryScores);
    const projection = calculateProjectedHealthspan(
      playerHealth,
      currentAge,
      healthScore,
      MISSION_TARGET_YEARS
    );

    return {
      date: new Date(),
      healthScore,
      categoryScores: { ...playerHealth.categoryScores },
      projectedHealthspan: projection.projectedHealthspan,
      yearsGained: projection.yearsGained
    };
  }

  generateMissionReport(
    playerHealth: PlayerHealth,
    currentAge: number
  ): MissionReport {
    const healthScore = calculateHealthScore(playerHealth.categoryScores);
    const projection = calculateProjectedHealthspan(
      playerHealth,
      currentAge,
      healthScore,
      MISSION_TARGET_YEARS
    );

    const missionElapsed = (Date.now() - playerHealth.missionStartDate.getTime()) / 
      (1000 * 60 * 60 * 24 * 365);
    const missionTimeRemaining = Math.max(0, MISSION_DURATION_YEARS - missionElapsed);

    return {
      currentHealthScore: healthScore,
      projectedHealthspan: projection.projectedHealthspan,
      yearsGained: projection.yearsGained,
      missionProgress: projection.missionProgress,
      missionTimeRemaining,
      categoryScores: playerHealth.categoryScores,
      recommendedFocus: calculateRecommendedFocus(playerHealth.categoryScores),
      nextMilestone: calculateNextMilestone(projection.yearsGained),
      projectedMilestones: calculateProjectedMilestones(
        projection.yearsGained,
        healthScore,
        missionTimeRemaining,
        MISSION_TARGET_YEARS
      )
    };
  }
}

export default HealthMetricsSystem;