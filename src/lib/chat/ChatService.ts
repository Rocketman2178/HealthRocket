import { supabase } from '../supabase';
import type { ChatMessage, MessageReadStatus } from '../../types/chat';
import { DatabaseError } from '../errors';

export class ChatService {
  static async getMessages(
    chatId: string,
    limit = 20,
    before?: Date
  ): Promise<ChatMessage[]> {
    try {
      const { data: messages, error } = await supabase
        .rpc('get_challenge_messages', { p_chat_id: chatId });

      if (error) throw error;

      return messages.map(message => ({
        id: message.id,
        chatId: message.chat_id,
        userId: message.user_id,
        content: message.content,
        mediaUrl: message.media_url,
        mediaType: message.media_type,
        isVerification: message.is_verification,
        createdAt: new Date(message.created_at),
        updatedAt: new Date(message.updated_at),
        user_name: message.user_name,
        user_avatar_url: message.user_avatar_url
      }));
    } catch (err) {
      console.error('Error fetching messages:', err);
      throw err;
    }
  }

  static async sendMessage(
    userId: string,
    content: string,
    chatId: string,
    isVerification: boolean,
    mediaPublicUrl?: string,
    mediaType?: 'image' | 'video'
  ): Promise<ChatMessage> {
    try {
      // Insert message with a single query that returns all needed fields
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          chat_id: chatId,
          content,
          media_url: mediaPublicUrl,
          media_type: mediaType,
          is_verification: isVerification
        })
        .select(`
          id,
          chat_id,
          user_id,
          content,
          media_url,
          media_type,
          is_verification,
          created_at,
          updated_at,
          user:users!chat_messages_user_id_fkey (
            name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      return {
        id: data.id,
        chatId: data.chat_id,
        userId: data.user_id,
        content: data.content,
        mediaUrl: data.media_url,
        mediaType: data.media_type,
        isVerification: Boolean(data.is_verification),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        user_name: data.user?.name,
        user_avatar_url: data.user?.avatar_url
      };
    } catch (err) {
      console.error('Error sending message:', err);
      throw new DatabaseError('Failed to send message');
    }
  }

  static async deleteMessage(userId: string, messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting message:', err);
      throw new DatabaseError('Failed to delete message');
    }
  }

  static async updateReadStatus(
    userId: string,
    chatId: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('message_read_status')
        .upsert({
          user_id: userId,
          chat_id: chatId,
          last_read_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error updating read status:', err);
      throw new DatabaseError('Failed to update read status');
    }
  }

  static async getUnreadCount(
    userId: string,
    chatId: string
  ): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('get_unread_message_count', {
          p_user_id: userId,
          p_chat_id: chatId
        });

      if (error) throw error;

      return data || 0;
    } catch (err) {
      console.error('Error getting unread count:', err);
      throw new DatabaseError('Failed to get unread count');
    }
  }

  static subscribeToMessages(
    chatId: string,
    onMessage: (message: ChatMessage) => void
  ) {
    const filter = { chat_id: chatId };

    return supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter
        },
        async (payload) => {
          try {
            // Get user details for the message
            const { data: userData } = await supabase
              .rpc('get_challenge_messages', { p_chat_id: chatId })
              .select()
              .eq('id', payload.new.id)
              .single();

            if (error) throw error;
            if (!userData) throw new Error('Message data not found');
            const message: ChatMessage = {
              id: payload.new.id,
              chatId: payload.new.chat_id,
              userId: payload.new.user_id,
              content: payload.new.content,
              mediaUrl: payload.new.media_url,
              mediaType: payload.new.media_type,
              isVerification: Boolean(payload.new.is_verification),
              createdAt: new Date(payload.new.created_at),
              updatedAt: new Date(payload.new.updated_at),
              user_name: userData.user_name,
              user_avatar_url: userData.user_avatar_url
            };
            onMessage(message);
          } catch (err) {
            console.error('Error processing real-time message:', err);
          }
        }
      )
      .subscribe();
  }

  static async uploadMedia(path: string, file: File) {
    try {
      const { data, error } = await supabase.storage
        .from('chat-media')
        .upload(path, file);
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat-media')
        .getPublicUrl(path);

      return { 
        data: { 
          path,
          publicUrl
        }, 
        error: null 
      };
    } catch (err) {
      console.error('Error uploading media:', err);
      throw new DatabaseError('Failed to upload media');
    }
  }
}