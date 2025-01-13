import { HealthMilestone, ProjectedMilestones } from '../types';

export function calculateNextMilestone(yearsGained: number): HealthMilestone {
  const milestones = [5, 10, 15, 20];
  const nextMilestone = milestones.find(m => m > yearsGained) || 20;
  
  return {
    years: nextMilestone,
    yearsRemaining: nextMilestone - yearsGained,
    type: nextMilestone >= 20 ? 'MISSION_COMPLETE' : 'INTERMEDIATE'
  };
}

export function calculateProjectedMilestones(
  currentYearsGained: number,
  healthScore: number,
  timeRemaining: number,
  targetYears: number
): ProjectedMilestones {
  const improvementRate = (healthScore - 5) / 5 * 2;
  const projectedAdditionalYears = improvementRate * timeRemaining;
  const totalProjectedYears = currentYearsGained + projectedAdditionalYears;

  return {
    projectedTotalYears: totalProjectedYears,
    willReachTarget: totalProjectedYears >= targetYears,
    estimatedTimeToTarget: estimateTimeToTarget(
      currentYearsGained,
      improvementRate,
      targetYears
    ),
    projectedMilestones: [5, 10, 15, 20].map(milestone => ({
      years: milestone,
      projected: projectMilestoneDate(
        currentYearsGained,
        improvementRate,
        milestone
      )
    }))
  };
}

function estimateTimeToTarget(
  currentYears: number,
  improvementRate: number,
  targetYears: number
): number | null {
  if (improvementRate <= 0) return null;
  return (targetYears - currentYears) / improvementRate;
}

function projectMilestoneDate(
  currentYears: number,
  improvementRate: number,
  milestone: number
): Date | null {
  const timeNeeded = estimateTimeToTarget(
    currentYears,
    improvementRate,
    milestone
  );
  
  if (timeNeeded === null) return null;
  
  const projectedDate = new Date();
  projectedDate.setFullYear(projectedDate.getFullYear() + timeNeeded);
  return projectedDate;
}