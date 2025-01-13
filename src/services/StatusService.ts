import { StatusSystem, PrizeSystem, StatusAnalytics, StatusNotifications } from '../lib/statusSystem';
import type { Player, StatusUpdate, PrizeDistribution } from '../types/status';

export class StatusService {
  private statusSystem: StatusSystem;
  private prizeSystem: PrizeSystem;
  private analytics: StatusAnalytics;
  private notifications: StatusNotifications;

  constructor() {
    this.statusSystem = new StatusSystem();
    this.prizeSystem = new PrizeSystem();
    this.analytics = new StatusAnalytics();
    this.notifications = new StatusNotifications();
  }

  async updatePlayerStatus(player: Player): Promise<StatusUpdate> {
    // Get all player averages (mock data for MVP)
    const playerAverages = [120, 85, 65, 45, 30, 25, 20, 15, 10, 5];
    
    // Calculate thresholds
    const thresholds = this.statusSystem.calculateStatusThresholds(playerAverages);
    
    // Update player status
    const statusUpdate = this.statusSystem.updatePlayerStatus(player, thresholds);
    
    // Send notification if status changed
    await this.notifications.notifyStatusChange(player, statusUpdate);
    
    return statusUpdate;
  }

  async distributePrizes(players: Player[]): Promise<PrizeDistribution[]> {
    // Mock prize pool for MVP
    const prizePool = {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      legendPrizes: [
        { id: 'p1', tier: 'Legend', name: 'Health Tracker Pro', value: 199, partner: 'HealthTech', details: 'Premium health tracking device' },
        { id: 'p2', tier: 'Legend', name: 'Wellness Box', value: 75, partner: 'WellnessCo', details: 'Monthly wellness supplies' }
      ],
      heroPrizes: [
        { id: 'p3', tier: 'Hero', name: 'Fitness Bundle', value: 150, partner: 'FitGear', details: 'Essential fitness equipment' },
        { id: 'p4', tier: 'Hero', name: 'Nutrition Guide', value: 39, partner: 'NutriLife', details: 'Personalized nutrition plan' }
      ],
      totalValue: 463
    };

    // Distribute prizes
    const distributions = this.prizeSystem.distributeMonthlyPrizes(players, prizePool);
    
    // Notify winners
    for (const dist of distributions) {
      const player = players.find(p => p.id === dist.playerId);
      const prize = [...prizePool.legendPrizes, ...prizePool.heroPrizes].find(p => p.id === dist.prizeId);
      
      if (player && prize) {
        await this.notifications.notifyPrizeWin(player, prize);
      }
    }

    return distributions;
  }

  generateStatusReport(players: Player[]) {
    return this.analytics.generateStatusReport(players);
  }

  generatePlayerHistory(player: Player) {
    return this.analytics.generatePlayerStatusHistory(player);
  }
}