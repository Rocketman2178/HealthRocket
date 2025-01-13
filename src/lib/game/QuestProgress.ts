import type { Quest, UserProgress } from '../../types/game';

export class QuestProgress {
  static validateQuestRequirements(
    quest: Quest,
    userProgress: UserProgress
  ): boolean {
    // Check tier prerequisites
    if (quest.tier === 2) {
      const hasCompletedTier1 = this.validateTier1Completion(userProgress.userId);
      if (!hasCompletedTier1) return false;
    }

    // Check challenge completion
    const completedChallenges = userProgress.completedChallenges.length;
    if (completedChallenges < quest.requirements.challengesRequired) return false;

    // Check daily boosts completion
    const completedBoosts = userProgress.completedDailyBoosts.length;
    if (completedBoosts < quest.requirements.dailyBoostsRequired) return false;

    return true;
  }

  static validateTier1Completion(userId: string): boolean {
    // Implementation to check if user has completed all Tier 1 quests
    return true; // Placeholder
  }

  static calculateProgress(
    quest: Quest,
    userProgress: UserProgress
  ): { 
    challengeProgress: number;
    boostProgress: number;
    overallProgress: number;
  } {
    const challengeProgress = (userProgress.completedChallenges.length / quest.requirements.challengesRequired) * 100;
    const boostProgress = (userProgress.completedDailyBoosts.length / quest.requirements.dailyBoostsRequired) * 100;
    
    return {
      challengeProgress,
      boostProgress,
      overallProgress: (challengeProgress + boostProgress) / 2
    };
  }
}