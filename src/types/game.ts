// Core interfaces for the Quest System

export interface Expert {
  id: string;
  name: string;
  expertise: string[];
  reference: string;
}

export interface VerificationMethod {
  type: 'sleep_tracker_data' | 'daily_logs' | 'photo_verification' | 'environment_logs' | 'stress_metrics' | 'performance_data';
  description: string;
  requiredFrequency: 'daily' | 'weekly' | 'completion';
}

export interface Requirement {
  description: string;
  verificationMethod: string;
  minimumThreshold?: number;
}

export interface Challenge {
  id: string;
  name: string;
  tier: 0 | 1 | 2;
  duration: number;
  description: string;
  learningObjectives: string[];
  requirements: Requirement[];
  expertIds: string[];
  implementationProtocol: {
    week1: string;
    week2: string;
    week3: string;
  };
  verificationMethods: VerificationMethod[];
  successMetrics: string[];
  expertTips: string[];
  fuelPoints: number;
  status?: 'active' | 'available' | 'completed' | 'locked';
  progress?: number;
  daysRemaining?: number;
}

export interface Quest {
  id: string;
  tier: 1 | 2;
  name: string;
  focus: string;
  description: string;
  expertIds: string[];
  challengeIds: string[];
  requirements: {
    challengesRequired: number;
    dailyBoostsRequired: number;
    prerequisites?: string[];
  };
  verificationMethods: VerificationMethod[];
  fuelPoints: number;
  status?: 'active' | 'available' | 'completed' | 'locked';
  progress?: number;
  daysRemaining?: number;
  duration?: number;
}

export interface UserProgress {
  userId: string;
  questId: string;
  startDate: Date;
  completedChallenges: {
    challengeId: string;
    completionDate: Date;
    verificationData: any;
  }[];
  completedDailyBoosts: {
    boostId: string;
    completionDate: Date;
    verificationData: any;
  }[];
  status: 'in_progress' | 'completed' | 'failed';
}