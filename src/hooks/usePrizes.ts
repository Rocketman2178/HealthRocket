import { useState, useEffect } from 'react';
import { PrizeSelectionSystem } from '../lib/prizeSystem';
import type { Player, PrizeDistribution, Prize } from '../types/status';

export function usePrizes(player: Player) {
  const [distributions, setDistributions] = useState<PrizeDistribution[]>([]);
  const [eligiblePrizes, setEligiblePrizes] = useState<Prize[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prizeSystem = new PrizeSelectionSystem();

  useEffect(() => {
    async function checkPrizeEligibility() {
      try {
        setIsLoading(true);
        
        // Check if player is on a paid plan
        const isPaidPlan = ['Pro Plan', 'Family Plan', 'Company Plan'].includes(player.plan);
        
        if (!isPaidPlan) {
          setEligiblePrizes([]);
          return;
        }

        // Get available prizes based on status
        const availablePrizes = player.currentStatus === 'Legend' 
          ? [...mockPrizePool.legendPrizes]
          : player.currentStatus === 'Hero'
            ? [...mockPrizePool.heroPrizes]
            : [];

        setEligiblePrizes(availablePrizes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check prize eligibility');
      } finally {
        setIsLoading(false);
      }
    }

    checkPrizeEligibility();
  }, [player]);

  return {
    distributions,
    eligiblePrizes,
    isLoading,
    error
  };
}

// Mock prize pool for development
const mockPrizePool = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  legendPrizes: [
    {
      id: 'l1',
      tier: 'Legend',
      name: 'Health Tracker Pro',
      value: 199,
      partner: 'HealthTech',
      details: 'Premium health tracking device',
      quantity: 5,
      claimed: 0,
      priority: 1
    },
    // Add more legend prizes...
  ],
  heroPrizes: [
    {
      id: 'h1',
      tier: 'Hero',
      name: 'Wellness Box',
      value: 75,
      partner: 'WellnessCo',
      details: 'Monthly wellness supplies',
      quantity: 10,
      claimed: 0,
      priority: 1
    },
    // Add more hero prizes...
  ],
  totalValue: 2500
};