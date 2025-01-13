import { quests } from '../../data';
import type { Quest } from '../../types/game';

export class QuestDataService {
  static getQuestDetails(questId: string): Quest | undefined {
    return quests.find(q => q.id === questId);
  }

  static validateQuest(questId: string): boolean {
    const quest = this.getQuestDetails(questId);
    return !!quest;
  }

  static getQuestProgress(
    challengesCompleted: number,
    boostsCompleted: number,
    duration: number
  ): number {
    const challengeWeight = 0.6;
    const boostWeight = 0.4;
    
    const challengeProgress = Math.min(challengesCompleted / 2, 1) * 100;
    const boostProgress = Math.min(boostsCompleted / 45, 1) * 100;
    
    return ((challengeProgress * challengeWeight) + (boostProgress * boostWeight)) / duration * 100;
  }
}