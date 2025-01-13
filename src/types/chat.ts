export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  isVerification: boolean;
  createdAt: Date;
  updatedAt: Date;
  user_name?: string;
  user_avatar_url?: string;
}

export interface MessageReadStatus {
  userId: string;
  chatId: string;
  lastReadAt: Date;
}

export interface ChatParticipant {
  userId: string;
  name: string;
  avatarUrl?: string;
  level: number;
  healthScore: number;
  healthspanYears: number;
  plan: string;
}