import type { Quest, Challenge, UserProgress, CompletedActivity } from '../../types/game';

export class QuestManager {
  private static readonly QUEST_CAP_INCREASE_THRESHOLD = 2; // Complete 2 quests to increase cap
  private static readonly CHALLENGE_CAP_INCREASE_THRESHOLD = 3; // Complete 3 challenges to increase cap
  private static readonly MAX_QUEST_CAP = 3;
  private static readonly MAX_CHALLENGE_CAP = 5;

  calculateAvailableSlots(completedActivities: CompletedActivity[]): {
    questCap: number;
    challengeCap: number;
  } {
    const completedQuests = completedActivities.filter(a => a.type === 'quest').length;
    const completedChallenges = completedActivities.filter(a => a.type === 'challenge').length;

    const questCap = Math.min(
      this.MAX_QUEST_CAP,
      1 + Math.floor(completedQuests / this.QUEST_CAP_INCREASE_THRESHOLD)
    );

    const challengeCap = Math.min(
      this.MAX_CHALLENGE_CAP,
      2 + Math.floor(completedChallenges / this.CHALLENGE_CAP_INCREASE_THRESHOLD)
    );

    return { questCap, challengeCap };
  }

  canStartQuest(
    quest: Quest,
    activeQuests: Quest[],
    questCap: number,
    userProgress: UserProgress
  ): boolean {
    // Check if under cap
    if (activeQuests.length >= questCap) {
      return false;
    }

    // Check tier prerequisites
    if (quest.tier === 2 && !this.validateTier1Completion(userProgress.userId)) {
      return false;
    }

    return true;
  }

  canStartChallenge(
    challenge: Challenge,
    activeChallenges: Challenge[],
    challengeCap: number,
    userProgress: UserProgress
  ): boolean {
    // Check if under cap
    if (activeChallenges.length >= challengeCap) {
      return false;
    }

    // Check tier prerequisites
    if (challenge.tier === 2 && !this.validateTier1Completion(userProgress.userId)) {
      return false;
    }

    return true;
  }

  private validateTier1Completion(userId: string): boolean {
    // Implementation to check if user has completed required Tier 1 content
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