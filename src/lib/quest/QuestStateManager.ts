import { supabase } from '../supabase';
import { QuestDataService } from './QuestDataService';

export class QuestStateManager {
  static async getActiveQuest(userId: string) {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async startQuest(userId: string, questId: string) {
    // Validate quest exists
    if (!QuestDataService.validateQuest(questId)) {
      throw new Error('Quest not found');
    }

    const questDetails = QuestDataService.getQuestDetails(questId);
    if (!questDetails) {
      throw new Error('Quest details not found');
    }

    // Create quest in database
    const { data, error } = await supabase
      .from('quests')
      .insert({
        user_id: userId,
        quest_id: questId,
        progress: 0,
        challenges_completed: 0,
        boosts_completed: 0,
        fp_reward: questDetails.fuelPoints,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async cancelQuest(userId: string, questId: string) {
    const { error } = await supabase
      .from('quests')
      .delete()
      .eq('user_id', userId)
      .eq('quest_id', questId);

    if (error) throw error;
  }
}