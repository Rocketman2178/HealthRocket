import type { Boost } from '../../types/game';

export const exerciseBoosts: Boost[] = [
  {
    id: 'exercise-101',
    name: 'Movement Pattern Practice',
    description: 'Master fundamental movement patterns for optimal joint health and performance.',
    fuelPoints: 1,
    tier: 1,
    estimatedTime: '15 minutes',
    expertReference: {
      name: 'Dr. Andy Galpin',
      expertise: 'Muscle physiology, performance',
      protocol: 'Movement Pattern Mastery'
    },
    instructions: [
      '1. Warm-up (3 min):',
      '   - Light joint circles',
      '   - Dynamic stretching',
      '   - Movement preparation',
      '2. Pattern practice (10 min):',
      '   - Squat pattern (10 reps)',
      '   - Hinge pattern (10 reps)',
      '   - Push/pull patterns (10 reps each)',
      '   - Focus on quality and control',
      '3. Cool-down (2 min):',
      '   - Movement reflection',
      '   - Pattern assessment',
      '   - Document completion'
    ],
    successCriteria: [
      'Complete all patterns',
      'Maintain proper form',
      'Document progress'
    ],
    category: 'Exercise'
  },
  {
    id: 'exercise-102',
    name: 'Morning Movement Flow',
    description: 'Complete structured morning movement sequence for mobility and activation.',
    fuelPoints: 2,
    tier: 1,
    estimatedTime: '20 minutes',
    expertReference: {
      name: 'Eugene Trufkin',
      expertise: 'Business leader fitness optimization',
      protocol: 'Morning Movement Integration'
    },
    instructions: [
      '1. Mobility sequence (7 min):',
      '   - Spine mobility flow',
      '   - Hip opener series',
      '   - Shoulder mobility work',
      '2. Activation drills (7 min):',
      '   - Core engagement exercises',
      '   - Glute activation series',
      '   - Upper back activation',
      '3. Integration (6 min):',
      '   - Movement combinations',
      '   - Flow sequences',
      '   - Progress documentation'
    ],
    successCriteria: [
      'Complete full sequence',
      'Maintain movement quality',
      'Hit time targets'
    ],
    category: 'Exercise'
  },
  {
    id: 'exercise-103',
    name: 'Zone 2 Training Session',
    description: 'Complete Zone 2 cardiovascular training for metabolic health.',
    fuelPoints: 3,
    tier: 1,
    estimatedTime: '30 minutes',
    expertReference: {
      name: 'Dr. Peter Attia',
      expertise: 'Longevity-focused training',
      protocol: 'Zone 2 Cardiac Output'
    },
    instructions: [
      '1. Preparation (5 min):',
      '   - Heart rate monitor setup',
      '   - Calculate Zone 2 range',
      '   - Warm-up movement',
      '2. Main session (20 min):',
      '   - Maintain Zone 2 heart rate',
      '   - Monitor breathing (nasal)',
      '   - Track perceived effort',
      '3. Cool-down (5 min):',
      '   - Gradual reduction',
      '   - Data review',
      '   - Session documentation'
    ],
    successCriteria: [
      '80%+ time in Zone 2',
      'Complete duration',
      'Maintain form'
    ],
    category: 'Exercise'
  },
  {
    id: 'exercise-104',
    name: 'Strength Foundation',
    description: 'Execute fundamental strength training session focusing on major movement patterns.',
    fuelPoints: 4,
    tier: 1,
    estimatedTime: '45 minutes',
    expertReference: {
      name: 'Dr. Gabrielle Lyon',
      expertise: 'Muscle-centric medicine',
      protocol: 'Foundational Strength'
    },
    instructions: [
      '1. Warm-up (10 min):',
      '   - Movement preparation',
      '   - Pattern practice',
      '   - Progressive loading',
      '2. Main session (30 min):',
      '   - Squat pattern (3 sets)',
      '   - Hinge pattern (3 sets)',
      '   - Push/pull (3 sets each)',
      '   - Core work (2 sets)',
      '3. Cool-down (5 min):',
      '   - Movement reflection',
      '   - Session documentation',
      '   - Recovery assessment'
    ],
    successCriteria: [
      'Complete all sets',
      'Maintain form',
      'Progressive overload'
    ],
    category: 'Exercise'
  },
  {
    id: 'exercise-105',
    name: 'Recovery Integration',
    description: 'Complete structured recovery session combining multiple modalities.',
    fuelPoints: 5,
    tier: 1,
    estimatedTime: '45 minutes',
    expertReference: {
      name: 'Dr. Andy Galpin',
      expertise: 'Recovery optimization',
      protocol: 'Active Recovery System'
    },
    instructions: [
      '1. Assessment (5 min):',
      '   - Movement screening',
      '   - Fatigue evaluation',
      '   - Target identification',
      '2. Active recovery (30 min):',
      '   - Light movement flow',
      '   - Mobility work',
      '   - Tissue quality',
      '3. Integration (10 min):',
      '   - Recovery breathing',
      '   - Progress tracking',
      '   - Next session planning'
    ],
    successCriteria: [
      'Complete protocol',
      'Improve movement quality',
      'Track progress'
    ],
    category: 'Exercise'
  },
  {
    id: 'exercise-106',
    name: 'Movement Integration Protocol',
    description: 'Execute comprehensive movement optimization session.',
    fuelPoints: 6,
    tier: 1,
    estimatedTime: '60 minutes',
    expertReference: {
      name: 'Dr. Andy Galpin',
      expertise: 'Movement optimization',
      protocol: 'Complete Movement Integration'
    },
    instructions: [
      '1. Assessment (10 min):',
      '   - Movement screening',
      '   - Pattern evaluation',
      '   - Goal setting',
      '2. Development (40 min):',
      '   - Mobility work',
      '   - Strength patterns',
      '   - Power development',
      '   - Endurance integration',
      '3. Integration (10 min):',
      '   - Cool-down protocol',
      '   - Progress documentation',
      '   - Next session planning'
    ],
    successCriteria: [
      'Complete full protocol',
      'Quality maintenance',
      'Progress documentation'
    ],
    category: 'Exercise'
  },
  // Tier 2 Exercise Boosts
  {
    id: 'exercise-201',
    name: 'Advanced Performance Protocol',
    description: 'Execute comprehensive performance optimization session with monitoring.',
    fuelPoints: 7,
    tier: 2,
    estimatedTime: '90 minutes',
    expertReference: {
      name: 'Dr. Andy Galpin',
      expertise: 'Performance optimization',
      protocol: 'Elite Performance Integration'
    },
    instructions: [
      '1. Preparation (20 min):',
      '   - Biometric assessment',
      '   - Movement screening',
      '   - Equipment setup',
      '2. Performance session (60 min):',
      '   - Power development',
      '   - Strength integration',
      '   - Metabolic optimization',
      '   - Movement mastery',
      '3. Recovery integration (10 min):',
      '   - Cool-down protocol',
      '   - Data analysis',
      '   - Recovery planning'
    ],
    successCriteria: [
      'Meet performance targets',
      'Maintain movement quality',
      'Complete data collection'
    ],
    category: 'Exercise'
  },
  {
    id: 'exercise-202',
    name: 'Elite Strength Development',
    description: 'Complete advanced strength training protocol with full monitoring.',
    fuelPoints: 8,
    tier: 2,
    estimatedTime: '120 minutes',
    expertReference: {
      name: 'Dr. Gabrielle Lyon',
      expertise: 'Muscle-centric medicine',
      protocol: 'Advanced Strength System'
    },
    instructions: [
      '1. Assessment (20 min):',
      '   - Movement analysis',
      '   - Strength testing',
      '   - Equipment setup',
      '2. Main session (80 min):',
      '   - Primary lifts',
      '   - Accessory work',
      '   - Performance sets',
      '   - Form refinement',
      '3. Integration (20 min):',
      '   - Recovery protocol',
      '   - Data analysis',
      '   - Progress planning'
    ],
    successCriteria: [
      'Hit performance targets',
      'Maintain technique',
      'Complete data tracking'
    ],
    category: 'Exercise'
  },
  {
    id: 'exercise-203',
    name: 'Complete Performance Integration',
    description: 'Execute elite-level performance integration protocol.',
    fuelPoints: 9,
    tier: 2,
    estimatedTime: '150 minutes',
    expertReference: {
      name: 'Dr. Peter Attia',
      expertise: 'Performance longevity',
      protocol: 'Complete Performance System'
    },
    instructions: [
      '1. Preparation (30 min):',
      '   - Full assessment',
      '   - System setup',
      '   - Protocol review',
      '2. Performance block (90 min):',
      '   - Strength work',
      '   - Power development',
      '   - Metabolic conditioning',
      '   - Movement mastery',
      '3. Integration (30 min):',
      '   - Recovery protocols',
      '   - Data analysis',
      '   - System optimization'
    ],
    successCriteria: [
      'Complete full protocol',
      'Meet all metrics',
      'Optimize integration'
    ],
    category: 'Exercise'
  }
];