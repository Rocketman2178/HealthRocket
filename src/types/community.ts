// Community Types
export interface Community {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  settings: CommunitySettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunitySettings {
  role?: 'admin' | 'member';
  features?: {
    leaderboard: boolean;
    challenges: boolean;
    quests: boolean;
    prizes: boolean;
  };
  customization?: {
    primaryColor?: string;
    logo?: string;
  };
  privacy?: {
    memberListVisibility: 'public' | 'members' | 'admin';
    activityVisibility: 'public' | 'members' | 'admin';
  };
}

export interface CommunityMembership {
  id: string;
  userId: string;
  communityId: string;
  isPrimary: boolean;
  joinedAt: Date;
  globalLeaderboardOptIn: boolean;
}

export interface InviteCode {
  id: string;
  code: string;
  communityId: string;
  type: 'single_use' | 'multi_use' | 'time_limited';
  creatorId: string;
  expiresAt: Date | null;
  usedById: string | null;
  usedAt: Date | null;
  isActive: boolean;
  createdAt: Date;
}

// API Types
export interface ValidateInviteCodeResponse {
  isValid: boolean;
  community?: Community;
  error?: string;
}

export interface JoinCommunityResponse {
  success: boolean;
  membership?: CommunityMembership;
  error?: string;
}

export interface CreateInviteCodeRequest {
  communityId: string;
  type: 'single_use' | 'multi_use' | 'time_limited';
  expiresAt?: Date;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  rank: number;
  fuelPoints: number;
  level: number;
  healthScore: number;
  healthspanYears: number;
  healthScore: number;
  healthspanYears: number;
  communityName?: string;
  plan: string;
  avatarUrl?: string;
  createdAt: string;
  burnStreak: number;
  communities?: {
    id: string;
    name: string;
    isPrimary: boolean;
  }[];
}

export interface CommunityLeaderboard {
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all_time';
  entries: LeaderboardEntry[];
  userRank?: LeaderboardEntry;
  totalParticipants: number;
}