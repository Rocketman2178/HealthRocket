import { useState, useEffect } from 'react';
import HealthMetricsSystem from '../lib/health/HealthMetricsSystem';
import type { PlayerHealth, MissionReport } from '../lib/health/types';

export function useHealthMetrics() {
  const [missionReport, setMissionReport] = useState<MissionReport>({
    currentHealthScore: 7.8,
    projectedHealthspan: 85,
    yearsGained: 3.2,
    missionProgress: 0.125, // 2.5 / 20 years
    missionTimeRemaining: 4.5, // 4.5 years remaining in 5-year mission
    categoryScores: {
      mindset: 7.8,
      sleep: 7.8,
      exercise: 7.8,
      nutrition: 7.8,
      biohacking: 7.8
    },
    recommendedFocus: [],
    nextMilestone: {
      years: 5,
      yearsRemaining: 2.5,
      type: 'INTERMEDIATE'
    },
    projectedMilestones: {
      projectedTotalYears: 15,
      willReachTarget: false,
      estimatedTimeToTarget: 6.5,
      projectedMilestones: [
        { years: 5, projected: new Date(Date.now() + 7776000000) }, // +90 days
        { years: 10, projected: new Date(Date.now() + 15552000000) }, // +180 days
        { years: 15, projected: new Date(Date.now() + 23328000000) }, // +270 days
        { years: 20, projected: new Date(Date.now() + 31104000000) }  // +360 days
      ]
    }
  });

  const healthMetrics = new HealthMetricsSystem();

  useEffect(() => {
    // Mock player data
    const playerHealth: PlayerHealth = {
      expectedLifespan: 85,
      expectedHealthspan: 75,
      initialHealthspan: 72.5,
      missionStartDate: new Date(Date.now() - 15552000000), // 6 months ago
      lastUpdated: new Date(),
      categoryScores: {
        mindset: 8.2,
        sleep: 7.5,
        exercise: 8.0,
        nutrition: 7.2,
        biohacking: 7.8
      },
      healthHistory: []
    };

    const report = healthMetrics.generateMissionReport(playerHealth, 35);
    setMissionReport(report);
  }, []);

  return { missionReport };
}