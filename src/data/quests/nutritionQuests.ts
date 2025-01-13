import type { Quest } from '../../types/game';

export const nutritionQuests: Quest[] = [
  // Tier 1 Quests
  {
    id: 'nq1',
    tier: 1,
    name: 'Metabolic Health Master',
    focus: 'Basic metabolic optimization',
    description: 'Establish fundamental nutrition practices and metabolic health protocols.',
    expertIds: ['means', 'hyman'],
    challengeIds: ['nc1', 'nc2', 'nc3'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Glucose monitoring data',
      'Meal response logs',
      'Protocol completion metrics'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Nutrition'
  },
  {
    id: 'nq2',
    tier: 1,
    name: 'Anti-Inflammatory Foundation',
    focus: 'Inflammation reduction',
    description: 'Develop fundamental anti-inflammatory nutrition practices and monitoring protocols.',
    expertIds: ['gundry', 'kresser'],
    challengeIds: ['nc4', 'nc5', 'nc6'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Food elimination logs',
      'Response tracking data',
      'Protocol completion metrics'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Nutrition'
  },
  {
    id: 'nq3',
    tier: 1,
    name: 'Performance Nutrition Foundation',
    focus: 'Performance optimization',
    description: 'Establish fundamental performance nutrition practices and timing protocols.',
    expertIds: ['patrick', 'means'],
    challengeIds: ['nc7', 'nc8', 'nc9'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Protein timing logs',
      'Performance metrics',
      'Protocol completion data'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Nutrition'
  },
  // Tier 2 Quests
  {
    id: 'nq4',
    tier: 2,
    name: 'Advanced Metabolic Optimization',
    focus: 'Elite metabolic performance',
    description: 'Master advanced metabolic optimization protocols for peak health and performance.',
    expertIds: ['means', 'hyman'],
    challengeIds: ['nc10', 'nc11', 'nc12'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['nq1', 'nq2', 'nq3']
    },
    verificationMethods: [
      'Advanced glucose data',
      'Metabolic markers',
      'Performance correlation'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Nutrition'
  },
  {
    id: 'nq5',
    tier: 2,
    name: 'Elite Anti-Inflammatory Protocol',
    focus: 'Advanced inflammation control',
    description: 'Master elite-level inflammation control and optimization protocols.',
    expertIds: ['gundry', 'kresser'],
    challengeIds: ['nc13', 'nc14', 'nc15'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['nq1', 'nq2', 'nq3']
    },
    verificationMethods: [
      'Inflammation markers',
      'Response patterns',
      'System integration'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Nutrition'
  },
  {
    id: 'nq6',
    tier: 2,
    name: 'Performance Nutrition Mastery',
    focus: 'Elite performance nutrition',
    description: 'Master advanced performance nutrition protocols and timing strategies.',
    expertIds: ['patrick', 'means'],
    challengeIds: ['nc16', 'nc17', 'nc18'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['nq1', 'nq2', 'nq3']
    },
    verificationMethods: [
      'Performance data',
      'Recovery metrics',
      'System optimization'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Nutrition'
  }
];