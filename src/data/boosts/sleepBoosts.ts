import type { Boost } from '../../types/game';

export const sleepBoosts: Boost[] = [
  {
    id: 'sleep-101',
    name: 'Morning Light Protocol',
    description: 'Optimize circadian rhythm through strategic morning light exposure.',
    fuelPoints: 1,
    tier: 1,
    estimatedTime: '10-15 minutes',
    expertReference: {
      name: 'Dr. Andrew Huberman',
      expertise: 'Circadian biology, light exposure',
      protocol: 'Morning Light Entrainment'
    },
    instructions: [
      '1. Time your exposure (1 min):',
      '   - Within 30-60 minutes of waking',
      '   - Check local sunrise time',
      '2. Prepare for exposure (2 min):',
      '   - No sunglasses',
      '   - Direct outdoor access',
      '3. Light exposure (10 min):',
      '   - Face sun at 30-45 degree angle',
      '   - Maintain regular blinking',
      '   - Combine with light movement if desired',
      '4. Document completion (2 min)'
    ],
    successCriteria: [
      'Complete within wake window',
      'Achieve direct sunlight',
      'Maintain minimum duration'
    ],
    category: 'Sleep'
  },
  {
    id: 'sleep-102',
    name: 'Sleep Preparation Zone',
    description: 'Create optimal bedroom environment for quality sleep.',
    fuelPoints: 2,
    tier: 1,
    estimatedTime: '15-20 minutes',
    expertReference: {
      name: 'Dr. Matthew Walker',
      expertise: 'Sleep science, optimization protocols',
      protocol: 'Sleep Environment Optimization'
    },
    instructions: [
      '1. Temperature optimization (5 min):',
      '   - Set thermostat to 65-67°F/18-19°C',
      '   - Ensure proper ventilation',
      '   - Prepare appropriate bedding',
      '2. Light management (5 min):',
      '   - Install blackout solutions',
      '   - Remove/cover LED lights',
      '   - Test complete darkness',
      '3. Sound control (5 min):',
      '   - Address noise sources',
      '   - Consider white noise option',
      '   - Test sound levels',
      '4. Documentation (5 min)'
    ],
    successCriteria: [
      'Achieve target temperature',
      'Complete darkness',
      'Minimal noise disruption'
    ],
    category: 'Sleep'
  },
  {
    id: 'sleep-103',
    name: 'Digital Sunset Protocol',
    description: 'Implement systematic reduction of artificial light exposure.',
    fuelPoints: 3,
    tier: 1,
    estimatedTime: '20 minutes',
    expertReference: {
      name: 'Dr. Dan Pardi',
      expertise: 'Sleep technology, behavior change',
      protocol: 'Light Management System'
    },
    instructions: [
      '1. Device audit (5 min):',
      '   - Identify all light sources',
      '   - List active devices',
      '   - Note essential needs',
      '2. Light reduction (10 min):',
      '   - Activate blue light filters',
      '   - Dim household lights',
      '   - Switch to amber lighting',
      '3. Environment check (5 min):',
      '   - Verify settings',
      '   - Test light levels',
      '   - Document setup'
    ],
    successCriteria: [
      'Reduce blue light exposure',
      'Maintain dim environment',
      'Complete device audit'
    ],
    category: 'Sleep'
  },
  {
    id: 'sleep-104',
    name: 'Evening Wind-Down',
    description: 'Execute structured relaxation protocol for optimal sleep preparation.',
    fuelPoints: 4,
    tier: 1,
    estimatedTime: '25 minutes',
    expertReference: {
      name: 'Dr. Kirk Parsley',
      expertise: 'Sleep optimization for executives',
      protocol: 'Executive Sleep Preparation'
    },
    instructions: [
      '1. Mental download (10 min):',
      '   - Journal key thoughts',
      '   - List tomorrow\'s priorities',
      '   - Clear mental space',
      '2. Physical preparation (10 min):',
      '   - Light stretching',
      '   - Breathing exercises',
      '   - Progressive relaxation',
      '3. Environment check (5 min):',
      '   - Final room optimization',
      '   - Device shutdown',
      '   - Documentation'
    ],
    successCriteria: [
      'Complete mental download',
      'Execute relaxation sequence',
      'Optimize environment'
    ],
    category: 'Sleep'
  },
  {
    id: 'sleep-105',
    name: 'Sleep Schedule Alignment',
    description: 'Optimize sleep timing for circadian alignment and recovery.',
    fuelPoints: 5,
    tier: 1,
    estimatedTime: '30 minutes',
    expertReference: {
      name: 'Dr. Michael Breus',
      expertise: 'Chronotypes, sleep timing',
      protocol: 'Timing Optimization System'
    },
    instructions: [
      '1. Schedule analysis (10 min):',
      '   - Review current patterns',
      '   - Identify ideal windows',
      '   - Note constraints',
      '2. Timing optimization (10 min):',
      '   - Set target bedtime',
      '   - Calculate wake time',
      '   - Plan transition timing',
      '3. Implementation prep (10 min):',
      '   - Set up reminders',
      '   - Adjust daily routines',
      '   - Document plan'
    ],
    successCriteria: [
      'Create optimal schedule',
      'Set up implementation',
      'Document tracking system'
    ],
    category: 'Sleep'
  },
  {
    id: 'sleep-106',
    name: 'Recovery Breathing Protocol',
    description: 'Execute advanced breathing protocol for enhanced sleep quality.',
    fuelPoints: 6,
    tier: 1,
    estimatedTime: '30 minutes',
    expertReference: {
      name: 'Dr. Andrew Huberman',
      expertise: 'Neuroscience, stress management',
      protocol: 'Sleep Recovery Breathing'
    },
    instructions: [
      '1. Setup phase (5 min):',
      '   - Prepare quiet space',
      '   - Optimal position',
      '   - Check temperature',
      '2. Breathing practice (20 min):',
      '   - Physiological sigh sequence',
      '   - Box breathing progression',
      '   - Carbon dioxide tolerance',
      '3. Integration (5 min):',
      '   - Progressive relaxation',
      '   - State assessment',
      '   - Documentation'
    ],
    successCriteria: [
      'Complete full sequence',
      'Achieve relaxation state',
      'Document experience'
    ],
    category: 'Sleep'
  },
  // Tier 2 Sleep Boosts
  {
    id: 'sleep-201',
    name: 'Advanced Sleep Architecture Optimization',
    description: 'Execute comprehensive sleep stage optimization protocol with monitoring.',
    fuelPoints: 7,
    tier: 2,
    estimatedTime: '9-10 hours',
    expertReference: {
      name: 'Dr. Matthew Walker',
      expertise: 'Sleep science, performance optimization',
      protocol: 'Sleep Architecture Enhancement'
    },
    instructions: [
      '1. Preparation phase (30 min):',
      '   - Environment optimization',
      '   - Device calibration',
      '   - Protocol review',
      '2. Pre-sleep routine (60 min):',
      '   - Temperature management',
      '   - Light optimization',
      '   - Relaxation practice',
      '3. Sleep monitoring (7-8 hours):',
      '   - Stage tracking',
      '   - Environment maintenance',
      '   - Disruption logging',
      '4. Morning analysis (30 min):',
      '   - Data review',
      '   - Pattern documentation',
      '   - Protocol refinement'
    ],
    successCriteria: [
      'Optimal stage percentages',
      'Complete cycle count',
      'Recovery verification'
    ],
    category: 'Sleep'
  },
  {
    id: 'sleep-202',
    name: 'Circadian Reset Protocol',
    description: 'Complete 24-hour circadian optimization protocol with full monitoring.',
    fuelPoints: 8,
    tier: 2,
    estimatedTime: '24 hours',
    expertReference: {
      name: 'Dr. Andrew Huberman',
      expertise: 'Circadian biology, light exposure',
      protocol: 'Complete Circadian Reset'
    },
    instructions: [
      '1. Morning protocol (2 hours):',
      '   - Timed light exposure',
      '   - Temperature cycling',
      '   - Activity timing',
      '2. Daytime management (12 hours):',
      '   - Light exposure patterns',
      '   - Meal timing',
      '   - Activity optimization',
      '3. Evening protocol (2 hours):',
      '   - Light reduction',
      '   - Temperature manipulation',
      '   - Recovery practices',
      '4. Sleep optimization (8 hours):',
      '   - Environment control',
      '   - Recovery monitoring',
      '   - Pattern documentation'
    ],
    successCriteria: [
      'Complete protocol adherence',
      'Metric achievements',
      'Pattern optimization'
    ],
    category: 'Sleep'
  },
  {
    id: 'sleep-203',
    name: 'Elite Recovery Integration',
    description: 'Execute complete sleep optimization system with advanced monitoring and integration.',
    fuelPoints: 9,
    tier: 2,
    estimatedTime: '36 hours',
    expertReference: {
      name: 'Dr. Kirk Parsley',
      expertise: 'Sleep optimization for high performers',
      protocol: 'Elite Sleep Integration'
    },
    instructions: [
      '1. System preparation (2 hours):',
      '   - Environment setup',
      '   - Device calibration',
      '   - Protocol review',
      '2. Day 1 implementation (16 hours):',
      '   - Circadian optimization',
      '   - Performance tracking',
      '   - Recovery preparation',
      '3. Recovery phase (10 hours):',
      '   - Sleep optimization',
      '   - Stage enhancement',
      '   - Pattern monitoring',
      '4. Integration analysis (8 hours):',
      '   - Data review',
      '   - Pattern optimization',
      '   - System refinement'
    ],
    successCriteria: [
      'Full protocol completion',
      'Metric achievement',
      'System integration'
    ],
    category: 'Sleep'
  }
];