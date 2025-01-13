import { useState, useEffect } from 'react';
import { StatusService } from '../services/StatusService';
import type { Player, StatusUpdate, PrizeDistribution } from '../types/status';

export function useStatus(player: Player) {
  const [statusUpdate, setStatusUpdate] = useState<StatusUpdate | null>(null);
  const [prizeDistributions, setPrizeDistributions] = useState<PrizeDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusService = new StatusService();

  useEffect(() => {
    async function updateStatus() {
      try {
        setIsLoading(true);
        const update = await statusService.updatePlayerStatus(player);
        setStatusUpdate(update);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update status');
      } finally {
        setIsLoading(false);
      }
    }

    updateStatus();
  }, [player]);

  // Check for prize distributions monthly
  useEffect(() => {
    const now = new Date();
    const isFirstDayOfMonth = now.getDate() === 1;
    
    if (isFirstDayOfMonth) {
      statusService.distributePrizes([player])
        .then(setPrizeDistributions)
        .catch(err => setError(err instanceof Error ? err.message : 'Failed to distribute prizes'));
    }
  }, [player]);

  return {
    status: statusUpdate?.newStatus,
    averageFP: statusUpdate?.averageFP,
    thresholds: statusUpdate?.thresholds,
    prizeDistributions,
    isLoading,
    error
  };
}