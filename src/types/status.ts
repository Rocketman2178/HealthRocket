// Update the Prize interface
export interface Prize {
  id: string;
  tier: 'Legend' | 'Hero';
  name: string;
  value: number;
  partner: string;
  details: string;
  quantity: number;
  claimed: number;
  priority: number;
}

export interface WeightedEntry {
  playerId: string;
  weight: number;
}

// Add to existing types
export interface PrizePool {
  month: number;
  year: number;
  legendPrizes: Prize[];
  heroPrizes: Prize[];
  totalValue: number;
}

export interface PrizeDistribution {
  playerId: string;
  prizeId: string;
  timestamp: Date;
  tier: 'Legend' | 'Hero';
  status: Status;
}