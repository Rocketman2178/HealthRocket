import type { Quest } from '../../types/game';

export const sleepQuests: Quest[] = [
  {
    id: 'sq1',
    tier: 1,
    name: 'Sleep Quality Foundation',
    focus: 'Basic sleep optimization',
    description: 'Establish fundamental sleep habits and environment optimization for consistent quality rest.',
    expertIds: ['walker', 'parsley'],
    challengeIds: ['sc1', 'sc2', 'sc3'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Sleep tracker data',
      'Environment logs',
      'Protocol adherence'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Sleep'
  },
  {
    id: 'sq2',
    tier: 1,
    name: 'Circadian Reset',
    focus: 'Rhythm optimization',
    description: 'Align daily activities with natural circadian rhythms for optimal sleep-wake cycles.',
    expertIds: ['hubermanMind', 'breus'],
    challengeIds: ['sc4', 'sc5', 'sc6'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Light exposure logs',
      'Timing data',
      'Protocol completion'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Sleep'
  },
  {
    id: 'sq3',
    tier: 1,
    name: 'Recovery Foundation',
    focus: 'Basic recovery optimization',
    description: 'Establish fundamental recovery tracking and optimization protocols.',
    expertIds: ['parsley', 'pardi'],
    challengeIds: ['sc7', 'sc8', 'sc9'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Sleep tracker data',
      'Recovery metrics',
      'Protocol completion'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Sleep'
  },
  {
    id: 'sq4',
    tier: 2,
    name: 'Advanced Sleep Optimization',
    focus: 'Deep sleep enhancement',
    description: 'Master advanced sleep optimization techniques for maximum recovery.',
    expertIds: ['walker', 'parsley'],
    challengeIds: ['sc10', 'sc11', 'sc12'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['sq1', 'sq2', 'sq3']
    },
    verificationMethods: [
      'Detailed sleep data',
      'Temperature logs',
      'Protocol completion'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Sleep'
  },
  {
    id: 'sq5',
    tier: 2,
    name: 'Circadian Mastery',
    focus: 'Advanced rhythm optimization',
    description: 'Master advanced circadian alignment techniques for optimal performance timing.',
    expertIds: ['hubermanMind', 'breus'],
    challengeIds: ['sc13', 'sc14', 'sc15'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['sq1', 'sq2', 'sq3']
    },
    verificationMethods: [
      'Light exposure data',
      'Adaptation metrics',
      'Performance logs'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Sleep'
  },
  {
    id: 'sq6',
    tier: 2,
    name: 'Elite Recovery',
    focus: 'Advanced recovery systems',
    description: 'Master advanced recovery optimization for peak performance states.',
    expertIds: ['parsley', 'pardi'],
    challengeIds: ['sc16', 'sc17', 'sc18'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['sq1', 'sq2', 'sq3']
    },
    verificationMethods: [
      'Comprehensive data',
      'Recovery scores',
      'Performance metrics'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Sleep'
  }
];