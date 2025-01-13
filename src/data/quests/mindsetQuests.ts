import type { Quest } from '../../types/game';

export const mindsetQuests: Quest[] = [
  {
    id: 'mq1',
    tier: 1,
    name: 'Mental Clarity Foundation',
    focus: 'Basic cognitive optimization',
    description: 'Establish fundamental mindset practices and cognitive enhancement protocols.',
    expertIds: ['hubermanMind', 'harris'],
    challengeIds: ['mc1', 'mc2', 'mc3'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Focus session logs',
      'Performance metrics',
      'Progress tracking data'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Mindset'
  },
  {
    id: 'mq2',
    tier: 1,
    name: 'Emotional Mastery',
    focus: 'Emotional intelligence and resilience',
    description: 'Develop advanced emotional control and resilience strategies.',
    expertIds: ['robbins', 'dispenza'],
    challengeIds: ['mc4', 'mc5', 'mc6'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'State change logs',
      'Implementation tracking',
      'Success metrics'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Mindset'
  },
  {
    id: 'mq3',
    tier: 1,
    name: 'Growth Mindset Integration',
    focus: 'Belief system optimization',
    description: 'Develop and integrate growth-oriented belief systems and practices.',
    expertIds: ['dweck', 'dispenza'],
    challengeIds: ['mc7', 'mc8', 'mc9'],
    requirements: {
      challengesRequired: 2,
      dailyBoostsRequired: 45,
      prerequisites: []
    },
    verificationMethods: [
      'Challenge logs',
      'Response tracking',
      'Progress metrics'
    ],
    fuelPoints: 150,
    status: 'available',
    duration: 90,
    category: 'Mindset'
  },
  {
    id: 'mq4',
    tier: 2,
    name: 'Advanced Cognitive Optimization',
    focus: 'Elite mental performance',
    description: 'Master advanced cognitive enhancement and performance optimization protocols.',
    expertIds: ['hubermanMind', 'harris'],
    challengeIds: ['mc10', 'mc11', 'mc12'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['mq1', 'mq2', 'mq3']
    },
    verificationMethods: [
      'Focus session data',
      'Performance metrics',
      'Neural fatigue indicators'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Mindset'
  },
  {
    id: 'mq5',
    tier: 2,
    name: 'Emotional Mastery Elite',
    focus: 'Advanced emotional control',
    description: 'Master elite-level emotional control and state management protocols.',
    expertIds: ['robbins', 'dispenza'],
    challengeIds: ['mc13', 'mc14', 'mc15'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['mq1', 'mq2', 'mq3']
    },
    verificationMethods: [
      'State change logs',
      'Stack success rates',
      'Performance metrics'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Mindset'
  },
  {
    id: 'mq6',
    tier: 2,
    name: 'Peak Performance Integration',
    focus: 'Complete system optimization',
    description: 'Develop and implement comprehensive peak performance protocols integrating all aspects of mental mastery.',
    expertIds: ['hubermanMind', 'robbins'],
    challengeIds: ['mc16', 'mc17', 'mc18'],
    requirements: {
      challengesRequired: 3,
      dailyBoostsRequired: 63,
      prerequisites: ['mq1', 'mq2', 'mq3']
    },
    verificationMethods: [
      'Performance logs',
      'Integration data',
      'Success metrics'
    ],
    fuelPoints: 300,
    status: 'locked',
    duration: 90,
    category: 'Mindset'
  }
];