import type { Quest } from '../../types/game';

export const exerciseQuests: Quest[] = [
  // Tier 1 Quests
  {
    id: 'eq1',
    tier: 1,
    name: 'Movement Foundation',
    focus: 'Basic movement quality',
    description: 'Establish fundamental movement patterns and joint health protocols.',
    expertIds: ['patrick', 'galpin'],
    challengeIds: ['ec1', 'ec2', 'ec3'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Movement screening videos',
      'Pattern assessment logs',
      'Progress documentation'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Exercise'
  },
  {
    id: 'eq2',
    tier: 1,
    name: 'Performance Foundation',
    focus: 'Basic performance development',
    description: 'Establish fundamental performance practices through progressive protocols.',
    expertIds: ['attia', 'galpin'],
    challengeIds: ['ec4', 'ec5', 'ec6'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Heart rate data',
      'Loading progression logs',
      'Performance metrics'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Exercise'
  },
  {
    id: 'eq3',
    tier: 1,
    name: 'Recovery Foundation',
    focus: 'Basic recovery optimization',
    description: 'Establish foundational recovery practices and monitoring protocols.',
    expertIds: ['lyon', 'attia'],
    challengeIds: ['ec7', 'ec8', 'ec9'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Recovery metrics',
      'Load management data',
      'Progress tracking'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Exercise'
  },
  // Tier 2 Quests
  {
    id: 'eq4',
    tier: 2,
    name: 'Advanced Movement Mastery',
    focus: 'Elite movement quality',
    description: 'Master advanced movement patterns and integrated performance systems.',
    expertIds: ['patrick', 'galpin'],
    challengeIds: ['ec10', 'ec11', 'ec12'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['eq1', 'eq2', 'eq3']
    },
    verificationMethods: [
      'Advanced movement screening',
      'Integration metrics',
      'System optimization data'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Exercise'
  },
  {
    id: 'eq5',
    tier: 2,
    name: 'Elite Performance Development',
    focus: 'Advanced performance optimization',
    description: 'Master elite-level performance development and optimization protocols.',
    expertIds: ['galpin', 'attia'],
    challengeIds: ['ec13', 'ec14', 'ec15'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['eq1', 'eq2', 'eq3']
    },
    verificationMethods: [
      'Performance metrics',
      'System integration data',
      'Protocol optimization logs'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Exercise'
  },
  {
    id: 'eq6',
    tier: 2,
    name: 'Elite Recovery Mastery',
    focus: 'Advanced recovery optimization',
    description: 'Master elite-level recovery systems and optimization protocols.',
    expertIds: ['lyon', 'attia'],
    challengeIds: ['ec16', 'ec17', 'ec18'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['eq1', 'eq2', 'eq3']
    },
    verificationMethods: [
      'Recovery system data',
      'Integration metrics',
      'Protocol optimization logs'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Exercise'
  }
];