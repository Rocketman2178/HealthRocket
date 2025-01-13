import type { Quest, Challenge, UserProgress } from '../../types/game';

export class QuestSystem {
  validateQuestRequirements(quest: Quest, userProgress: UserProgress): boolean {
    // Validate tier prerequisites
    if (quest.tier === 2 && !this.validateTier1Completion(userProgress.userId)) {
      return false;
    }

    // Validate challenge completion
    const completedRequiredChallenges = userProgress.completedChallenges.filter(
      completion => quest.challengeIds.includes(completion.challengeId)
    ).length;

    if (completedRequiredChallenges < quest.requirements.challengesRequired) {
      return false;
    }

    // Validate daily boosts
    if (userProgress.completedDailyBoosts.length < quest.requirements.dailyBoostsRequired) {
      return false;
    }

    return true;
  }

  validateTier1Completion(userId: string): boolean {
    // Implementation for checking Tier 1 completion
    return true; // Placeholder
  }

  calculateQuestProgress(quest: Quest, userProgress: UserProgress): number {
    const challengeWeight = 0.6;
    const boostWeight = 0.4;

    const challengeProgress = this.calculateChallengeProgress(quest, userProgress);
    const boostProgress = this.calculateBoostProgress(quest, userProgress);

    return (challengeProgress * challengeWeight) + (boostProgress * boostWeight);
  }

  private calculateChallengeProgress(quest: Quest, userProgress: UserProgress): number {
    const completedChallenges = userProgress.completedChallenges.filter(
      completion => quest.challengeIds.includes(completion.challengeId)
    ).length;

    return (completedChallenges / quest.requirements.challengesRequired) * 100;
  }

  private calculateBoostProgress(quest: Quest, userProgress: UserProgress): number {
    return (userProgress.completedDailyBoosts.length / quest.requirements.dailyBoostsRequired) * 100;
  }
}