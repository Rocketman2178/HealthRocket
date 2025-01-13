import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';

export interface GuideMessage {
  id: string;
  message: string;
  isUserMessage: boolean;
  createdAt: Date;
  category?: string;
}

export class GuideService {
  static async getRecentMessages(userId: string): Promise<GuideMessage[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_recent_conversations', { 
          p_user_id: userId,
          p_limit: 10
        });

      if (error) throw error;

      return data.map((msg: any) => ({
        id: msg.id,
        message: msg.message,
        isUserMessage: msg.is_user_message,
        createdAt: new Date(msg.created_at),
        category: msg.category
      }));
    } catch (err) {
      console.error('Error loading messages:', err);
      throw err;
    }
  }

  static async sendMessage(userId: string, message: string, isUserMessage: boolean = true, category?: string) {
    try {
      const { data, error } = await supabase
        .from('guide_conversations')
        .insert({
          user_id: userId,
          message,
          is_user_message: isUserMessage,
          category
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  }

  static async submitFeedback(userId: string, feedback: string, rating: number | null, category: string = 'general') {
    try {
      const { error } = await supabase.rpc('submit_user_feedback', {
        p_user_id: userId,
        p_category: category,
        p_feedback: feedback,
        p_rating: rating || null,
        p_context: {}
      });

      if (error) {
        console.error('Feedback submission error:', error);
        throw new Error(error.message);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      throw err;
    }
  }

  static subscribeToMessages(userId: string, onMessage: (message: GuideMessage) => void) {
    return supabase
      .channel('guide_conversations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'guide_conversations',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newMessage = {
            id: payload.new.id,
            message: payload.new.message,
            isUserMessage: payload.new.is_user_message,
            createdAt: new Date(payload.new.created_at),
            category: payload.new.category
          };
          onMessage(newMessage);
        }
      )
      .subscribe();
  }
}