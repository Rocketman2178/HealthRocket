import type { Quest } from '../../types/game';

export const biohackingQuests: Quest[] = [
  // Tier 1 Quests
  {
    id: 'bq1',
    tier: 1,
    name: 'Recovery Tech Master',
    focus: 'Basic recovery optimization',
    description: 'Establish fundamental recovery technology practices and protocols.',
    expertIds: ['asprey', 'greenfield'],
    challengeIds: ['bc1', 'bc2', 'bc3'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Temperature logs',
      'Response tracking',
      'Protocol completion metrics'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Biohacking'
  },
  {
    id: 'bq2',
    tier: 1,
    name: 'Stress Resilience',
    focus: 'Stress management optimization',
    description: 'Develop fundamental stress resilience through technology and protocols.',
    expertIds: ['maloof', 'land'],
    challengeIds: ['bc4', 'bc5', 'bc6'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Temperature logs',
      'Session documentation',
      'Protocol completion'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Biohacking'
  },
  {
    id: 'bq3',
    tier: 1,
    name: 'Performance Technology',
    focus: 'Basic performance enhancement',
    description: 'Establish fundamental performance enhancement through strategic technology use.',
    expertIds: ['asprey', 'sinclair'],
    challengeIds: ['bc7', 'bc8', 'bc9'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Sleep metrics',
      'Performance data',
      'Protocol completion'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Biohacking'
  },
  // Tier 2 Quests
  {
    id: 'bq4',
    tier: 2,
    name: 'Advanced Recovery Technology',
    focus: 'Elite recovery optimization',
    description: 'Master advanced recovery technology protocols for peak adaptation.',
    expertIds: ['asprey', 'greenfield'],
    challengeIds: ['bc10', 'bc11', 'bc12'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['bq1', 'bq2', 'bq3']
    },
    verificationMethods: [
      'Protocol logs',
      'Adaptation data',
      'System optimization'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Biohacking'
  },
  {
    id: 'bq5',
    tier: 2,
    name: 'Elite Performance Technology',
    focus: 'Advanced performance enhancement',
    description: 'Master elite-level performance enhancement through advanced technology integration.',
    expertIds: ['sinclair', 'maloof'],
    challengeIds: ['bc13', 'bc14', 'bc15'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['bq1', 'bq2', 'bq3']
    },
    verificationMethods: [
      'Tech usage logs',
      'Performance data',
      'System metrics'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Biohacking'
  },
  {
    id: 'bq6',
    tier: 2,
    name: 'Bio-Optimization Mastery',
    focus: 'Complete system optimization',
    description: 'Master comprehensive biological optimization through advanced technology integration.',
    expertIds: ['asprey', 'maloof'],
    challengeIds: ['bc16', 'bc17', 'bc18'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['bq1', 'bq2', 'bq3']
    },
    verificationMethods: [
      'Protocol logs',
      'System data',
      'Integration metrics'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Biohacking'
  }
];