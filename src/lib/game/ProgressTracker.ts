import type { Quest, Challenge, UserProgress, CompletedActivity } from '../../types/game';

export class ProgressTracker {
  private static readonly DAILY_BOOST_EXPIRY_HOURS = 24;
  private static readonly CHALLENGE_EXPIRY_DAYS = 21;
  private static readonly QUEST_EXPIRY_DAYS = 90;

  trackQuestProgress(quest: Quest, userProgress: UserProgress): void {
    // Check for quest expiration
    const questStartDate = new Date(userProgress.startDate);
    const daysElapsed = this.calculateDaysElapsed(questStartDate);
    
    if (daysElapsed > this.QUEST_EXPIRY_DAYS) {
      this.handleQuestExpiration(quest, userProgress);
      return;
    }

    // Update progress
    const progress = this.calculateQuestProgress(quest, userProgress);
    quest.progress = progress;
    quest.daysRemaining = this.QUEST_EXPIRY_DAYS - daysElapsed;
  }

  trackChallengeProgress(challenge: Challenge, startDate: Date): void {
    const daysElapsed = this.calculateDaysElapsed(startDate);
    
    if (daysElapsed > this.CHALLENGE_EXPIRY_DAYS) {
      this.handleChallengeExpiration(challenge);
      return;
    }

    // Update progress
    challenge.progress = (daysElapsed / this.CHALLENGE_EXPIRY_DAYS) * 100;
    challenge.daysRemaining = this.CHALLENGE_EXPIRY_DAYS - daysElapsed;
  }

  validateDailyBoost(completedAt: Date): boolean {
    const hoursElapsed = this.calculateHoursElapsed(completedAt);
    return hoursElapsed <= this.DAILY_BOOST_EXPIRY_HOURS;
  }

  private calculateDaysElapsed(startDate: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private calculateHoursElapsed(timestamp: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - timestamp.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60));
  }

  private calculateQuestProgress(quest: Quest, userProgress: UserProgress): number {
    const completedChallenges = userProgress.completedChallenges.length;
    const completedBoosts = userProgress.completedDailyBoosts.length;

    const challengeProgress = (completedChallenges / quest.requirements.challengesRequired) * 100;
    const boostProgress = (completedBoosts / quest.requirements.dailyBoostsRequired) * 100;

    return Math.min(100, (challengeProgress + boostProgress) / 2);
  }

  private handleQuestExpiration(quest: Quest, userProgress: UserProgress): void {
    quest.status = 'failed';
    // Additional expiration handling logic
  }

  private handleChallengeExpiration(challenge: Challenge): void {
    challenge.status = 'failed';
    // Additional expiration handling logic
  }
}