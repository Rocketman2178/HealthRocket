import type { Player, Prize, PrizeDistribution, WeightedEntry } from '../types/status';

export class PrizeSelectionSystem {
  async distributePrizes(
    players: Player[],
    prizePool: PrizePool
  ): Promise<PrizeDistribution[]> {
    const distributions: PrizeDistribution[] = [];
    
    // Create weighted entries for prize draw
    const legendEntries = this.createWeightedEntries(
      players.filter(p => p.currentStatus === 'Legend'),
      2  // Legend players get 2 entries
    );
    
    const heroEntries = this.createWeightedEntries(
      players.filter(p => p.currentStatus === 'Hero'),
      1  // Hero players get 1 entry
    );

    // Sort prizes by priority
    const sortedLegendPrizes = [...prizePool.legendPrizes]
      .sort((a, b) => b.priority - a.priority);
    const sortedHeroPrizes = [...prizePool.heroPrizes]
      .sort((a, b) => b.priority - a.priority);

    // Distribute prizes
    await this.distributePoolPrizes(legendEntries, sortedLegendPrizes, distributions, 'Legend');
    await this.distributePoolPrizes(heroEntries, sortedHeroPrizes, distributions, 'Hero');

    return distributions;
  }

  private createWeightedEntries(players: Player[], entriesPerPlayer: number): WeightedEntry[] {
    return players.flatMap(player => 
      Array(entriesPerPlayer).fill({
        playerId: player.id,
        weight: this.calculatePlayerWeight(player)
      })
    );
  }

  private calculatePlayerWeight(player: Player): number {
    const baseWeight = 1000;
    let multiplier = 1;

    // Reward consistent engagement
    const daysActive = this.getActiveDaysInMonth(player);
    multiplier += (daysActive / 30) * 0.5;

    // Reward status retention
    const monthsAtStatus = this.getMonthsAtCurrentStatus(player);
    multiplier += Math.min(monthsAtStatus * 0.1, 0.5);

    return baseWeight * multiplier;
  }

  private async distributePoolPrizes(
    entries: WeightedEntry[],
    prizes: Prize[],
    distributions: PrizeDistribution[],
    tier: 'Legend' | 'Hero'
  ): Promise<void> {
    const remainingEntries = [...entries];
    
    for (const prize of prizes) {
      const availableQuantity = prize.quantity - prize.claimed;
      
      for (let i = 0; i < availableQuantity && remainingEntries.length > 0; i++) {
        const winner = this.selectWeightedWinner(remainingEntries);
        this.removePlayerEntries(remainingEntries, winner.playerId);
        
        distributions.push({
          playerId: winner.playerId,
          prizeId: prize.id,
          tier,
          timestamp: new Date(),
          status: tier
        });

        prize.claimed++;
      }
    }
  }

  private selectWeightedWinner(entries: WeightedEntry[]): WeightedEntry {
    const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const entry of entries) {
      random -= entry.weight;
      if (random <= 0) {
        return entry;
      }
    }
    
    return entries[entries.length - 1];
  }

  private removePlayerEntries(entries: WeightedEntry[], playerId: string): void {
    let i = entries.length;
    while (i--) {
      if (entries[i].playerId === playerId) {
        entries.splice(i, 1);
      }
    }
  }

  private getActiveDaysInMonth(player: Player): number {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return player.fuelPointsLog
      .filter(entry => new Date(entry.date) >= monthStart)
      .length;
  }

  private getMonthsAtCurrentStatus(player: Player): number {
    const currentStatusPeriod = player.statusHistory
      .find(period => period.status === player.currentStatus);
    
    if (!currentStatusPeriod) return 0;
    
    const start = new Date(currentStatusPeriod.startDate);
    const now = new Date();
    
    return (now.getFullYear() - start.getFullYear()) * 12 + 
           (now.getMonth() - start.getMonth());
  }
}