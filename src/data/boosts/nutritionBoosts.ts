import type { Boost } from '../../types/game';

export const nutritionBoosts: Boost[] = [
  {
    id: 'nutrition-101',
    name: 'Nutrient Density Protocol',
    description: 'Optimize one meal for maximum nutrient density using food-first approach.',
    fuelPoints: 1,
    tier: 1,
    estimatedTime: '15 minutes',
    expertReference: {
      name: 'Dr. Rhonda Patrick',
      expertise: 'Nutrigenomics, supplementation',
      protocol: 'Nutrient Optimization'
    },
    instructions: [
      '1. Meal Planning (5 min):',
      '   - Select target nutrients',
      '   - Choose food sources',
      '   - Plan portions',
      '2. Assembly (7 min):',
      '   - Prepare components',
      '   - Optimize combinations',
      '   - Document process',
      '3. Review (3 min):',
      '   - Photo documentation',
      '   - Nutrient checklist',
      '   - Notes for optimization'
    ],
    successCriteria: [
      'Include all target nutrients',
      'Optimal combinations',
      'Complete documentation'
    ],
    category: 'Nutrition'
  },
  {
    id: 'nutrition-102',
    name: 'Anti-Inflammatory Meal',
    description: 'Prepare one meal following anti-inflammatory principles.',
    fuelPoints: 2,
    tier: 1,
    estimatedTime: '20 minutes',
    expertReference: {
      name: 'Dr. Steven Gundry',
      expertise: 'Longevity nutrition',
      protocol: 'Anti-Inflammatory Nutrition'
    },
    instructions: [
      '1. Selection (5 min):',
      '   - Choose approved foods',
      '   - Verify combinations',
      '   - Plan portions',
      '2. Preparation (10 min):',
      '   - Proper preparation methods',
      '   - Cooking temperature control',
      '   - Combination optimization',
      '3. Documentation (5 min):',
      '   - Photo evidence',
      '   - Method notes',
      '   - Compliance checklist'
    ],
    successCriteria: [
      'All approved ingredients',
      'Proper preparation',
      'Complete documentation'
    ],
    category: 'Nutrition'
  },
  {
    id: 'nutrition-103',
    name: 'Meal Timing Protocol',
    description: 'Execute precise meal timing for metabolic health.',
    fuelPoints: 3,
    tier: 1,
    estimatedTime: '25 minutes + tracking',
    expertReference: {
      name: 'Dr. Mark Hyman',
      expertise: 'Functional nutrition',
      protocol: 'Metabolic Timing'
    },
    instructions: [
      '1. Planning (10 min):',
      '   - Set eating window',
      '   - Plan meal spacing',
      '   - Identify meal sizes',
      '2. Implementation (throughout day):',
      '   - Track exact timing',
      '   - Note meal sizes',
      '   - Monitor energy',
      '3. Review (15 min):',
      '   - Analyze timing',
      '   - Document patterns',
      '   - Plan adjustments'
    ],
    successCriteria: [
      'Meet timing windows',
      'Proper spacing',
      'Complete tracking'
    ],
    category: 'Nutrition'
  },
  {
    id: 'nutrition-104',
    name: 'Personalized Protocol Design',
    description: 'Create customized meal protocol based on personal patterns.',
    fuelPoints: 4,
    tier: 1,
    estimatedTime: '30 minutes',
    expertReference: {
      name: 'Chris Kresser',
      expertise: 'Functional medicine, personalized nutrition',
      protocol: 'Personal Paleo Code'
    },
    instructions: [
      '1. Assessment (10 min):',
      '   - Review current patterns',
      '   - Note reactions/preferences',
      '   - Identify optimal timing',
      '2. Protocol Design (15 min):',
      '   - Create meal template',
      '   - Adjust for preferences',
      '   - Plan modifications',
      '3. Documentation (5 min):',
      '   - Complete protocol',
      '   - Implementation plan',
      '   - Success metrics'
    ],
    successCriteria: [
      'Complete protocol',
      'Personal adaptations',
      'Clear metrics'
    ],
    category: 'Nutrition'
  },
  {
    id: 'nutrition-105',
    name: 'Micronutrient Optimization',
    description: 'Design and implement comprehensive micronutrient protocol.',
    fuelPoints: 5,
    tier: 1,
    estimatedTime: '45 minutes',
    expertReference: {
      name: 'Dr. Rhonda Patrick',
      expertise: 'Nutrigenomics, supplementation',
      protocol: 'Micronutrient Mastery'
    },
    instructions: [
      '1. Assessment (15 min):',
      '   - Review current intake',
      '   - Identify gaps',
      '   - Set targets',
      '2. Protocol Design (20 min):',
      '   - Food selection',
      '   - Timing strategy',
      '   - Absorption optimization',
      '3. Implementation Plan (10 min):',
      '   - Create schedule',
      '   - Document protocol',
      '   - Set tracking method'
    ],
    successCriteria: [
      'Complete protocol',
      'Optimal combinations',
      'Clear tracking'
    ],
    category: 'Nutrition'
  },
  {
    id: 'nutrition-106',
    name: 'Metabolic Health Planning',
    description: 'Create comprehensive metabolic health nutrition plan.',
    fuelPoints: 6,
    tier: 1,
    estimatedTime: '60 minutes',
    expertReference: {
      name: 'Dr. Mark Hyman',
      expertise: 'Functional nutrition',
      protocol: 'Metabolic Optimization'
    },
    instructions: [
      '1. Assessment (20 min):',
      '   - Current state review',
      '   - Pattern identification',
      '   - Goal setting',
      '2. Plan Development (30 min):',
      '   - Meal structure',
      '   - Timing strategy',
      '   - Food selection',
      '3. Implementation Design (10 min):',
      '   - Create schedule',
      '   - Shopping lists',
      '   - Tracking methods'
    ],
    successCriteria: [
      'Comprehensive plan',
      'Clear strategy',
      'Complete resources'
    ],
    category: 'Nutrition'
  },
  {
    id: 'nutrition-201',
    name: 'Advanced Glucose Optimization',
    description: 'Execute comprehensive glucose response protocol with monitoring.',
    fuelPoints: 7,
    tier: 2,
    estimatedTime: '12 hours active monitoring',
    expertReference: {
      name: 'Dr. Casey Means',
      expertise: 'Metabolic health, CGM optimization',
      protocol: 'Glucose Mastery'
    },
    instructions: [
      '1. Setup Phase (30 min):',
      '   - CGM calibration',
      '   - Baseline readings',
      '   - Protocol review',
      '2. Monitoring (10 hours):',
      '   - Meal documentation',
      '   - Response tracking',
      '   - Activity noting',
      '3. Analysis (90 min):',
      '   - Data review',
      '   - Pattern identification',
      '   - Protocol refinement'
    ],
    successCriteria: [
      'Complete monitoring',
      'Pattern analysis',
      'Protocol optimization'
    ],
    category: 'Nutrition'
  },
  {
    id: 'nutrition-202',
    name: 'Advanced Functional Protocol',
    description: 'Implement comprehensive functional nutrition optimization.',
    fuelPoints: 8,
    tier: 2,
    estimatedTime: '16 hours',
    expertReference: {
      name: 'Dr. Mark Hyman',
      expertise: 'Functional nutrition',
      protocol: 'Complete Functional System'
    },
    instructions: [
      '1. Preparation (2 hours):',
      '   - System setup',
      '   - Baseline metrics',
      '   - Protocol review',
      '2. Implementation (12 hours):',
      '   - Timed nutrition',
      '   - Response monitoring',
      '   - Pattern tracking',
      '3. Analysis (2 hours):',
      '   - Data compilation',
      '   - Pattern analysis',
      '   - System refinement'
    ],
    successCriteria: [
      'Protocol completion',
      'Data collection',
      'Pattern analysis'
    ],
    category: 'Nutrition'
  },
  {
    id: 'nutrition-203',
    name: 'Elite Nutrition Integration',
    description: 'Execute complete nutrition optimization protocol.',
    fuelPoints: 9,
    tier: 2,
    estimatedTime: '24 hours',
    expertReference: {
      name: 'Dr. Rhonda Patrick',
      expertise: 'Nutrigenomics, supplementation',
      protocol: 'Complete Nutrition System'
    },
    instructions: [
      '1. Preparation (2 hours):',
      '   - System setup',
      '   - Baseline assessment',
      '   - Protocol review',
      '2. Implementation (20 hours):',
      '   - Timed nutrition',
      '   - Response monitoring',
      '   - System optimization',
      '3. Analysis (2 hours):',
      '   - Data compilation',
      '   - Pattern analysis',
      '   - System refinement'
    ],
    successCriteria: [
      'Full protocol completion',
      'Data collection',
      'System integration'
    ],
    category: 'Nutrition'
  }
];