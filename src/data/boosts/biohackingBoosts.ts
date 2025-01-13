import type { Boost } from '../../types/game';

export const biohackingBoosts: Boost[] = [
  {
    id: 'biohack-101',
    name: 'Basic Cold Exposure',
    description: 'Complete foundational cold exposure protocol for hormetic stress.',
    fuelPoints: 1,
    tier: 1,
    estimatedTime: '5-10 minutes',
    expertReference: {
      name: 'Ben Greenfield',
      expertise: 'Performance optimization',
      protocol: 'Cold Thermogenesis'
    },
    instructions: [
      '1. Preparation (2 min):',
      '   - Temperature verification',
      '   - Timer setup',
      '   - Safety check',
      '2. Exposure (3-5 min):',
      '   - Progressive immersion',
      '   - Breathing control',
      '   - Time monitoring',
      '3. Documentation (3 min):',
      '   - Temperature log',
      '   - Duration record',
      '   - Response notes'
    ],
    successCriteria: [
      'Complete duration',
      'Proper temperature',
      'Controlled breathing'
    ],
    category: 'Biohacking'
  },
  {
    id: 'biohack-102',
    name: 'Red Light Session',
    description: 'Complete targeted red light therapy session.',
    fuelPoints: 2,
    tier: 1,
    estimatedTime: '15-20 minutes',
    expertReference: {
      name: 'Dave Asprey',
      expertise: 'Performance optimization, recovery tech',
      protocol: 'Light Optimization'
    },
    instructions: [
      '1. Setup (5 min):',
      '   - Device positioning',
      '   - Distance measurement',
      '   - Timer configuration',
      '2. Session (10-15 min):',
      '   - Target area exposure',
      '   - Position maintenance',
      '   - Time tracking',
      '3. Documentation (2 min):',
      '   - Session parameters',
      '   - Exposure tracking',
      '   - Response notes'
    ],
    successCriteria: [
      'Proper positioning',
      'Complete duration',
      'Protocol adherence'
    ],
    category: 'Biohacking'
  },
  {
    id: 'biohack-103',
    name: 'HRV Breathing Protocol',
    description: 'Execute structured HRV optimization breathing session.',
    fuelPoints: 3,
    tier: 1,
    estimatedTime: '20 minutes',
    expertReference: {
      name: 'Dr. Molly Maloof',
      expertise: 'Health optimization medicine',
      protocol: 'HRV Enhancement'
    },
    instructions: [
      '1. Setup (5 min):',
      '   - HRV monitor connection',
      '   - Position optimization',
      '   - Baseline reading',
      '2. Practice (12 min):',
      '   - Breathing pattern',
      '   - Real-time monitoring',
      '   - Pattern adjustment',
      '3. Integration (3 min):',
      '   - Data review',
      '   - Pattern documentation',
      '   - Response notes'
    ],
    successCriteria: [
      'Complete session',
      'Achieve coherence',
      'Data collection'
    ],
    category: 'Biohacking'
  },
  {
    id: 'biohack-104',
    name: 'Heat Exposure Protocol',
    description: 'Complete structured heat exposure session for adaptation.',
    fuelPoints: 4,
    tier: 1,
    estimatedTime: '25 minutes',
    expertReference: {
      name: 'Ben Greenfield',
      expertise: 'Performance optimization',
      protocol: 'Heat Adaptation'
    },
    instructions: [
      '1. Preparation (5 min):',
      '   - Temperature verification',
      '   - Hydration check',
      '   - Safety protocol',
      '2. Exposure (15 min):',
      '   - Progressive acclimation',
      '   - Position rotation',
      '   - Response monitoring',
      '3. Recovery (5 min):',
      '   - Cool-down process',
      '   - Hydration protocol',
      '   - Session documentation'
    ],
    successCriteria: [
      'Complete duration',
      'Temperature adherence',
      'Proper recovery'
    ],
    category: 'Biohacking'
  },
  {
    id: 'biohack-105',
    name: 'Recovery Tech Stack',
    description: 'Implement multi-modality recovery technology session.',
    fuelPoints: 5,
    tier: 1,
    estimatedTime: '30 minutes',
    expertReference: {
      name: 'Dave Asprey',
      expertise: 'Performance optimization, recovery tech',
      protocol: 'Recovery Stack Integration'
    },
    instructions: [
      '1. Setup (5 min):',
      '   - Equipment preparation',
      '   - Protocol review',
      '   - Baseline measures',
      '2. Implementation (20 min):',
      '   - Modality rotation',
      '   - Response monitoring',
      '   - Time management',
      '3. Documentation (5 min):',
      '   - Session logging',
      '   - Response tracking',
      '   - Integration notes'
    ],
    successCriteria: [
      'Complete protocol',
      'Proper sequencing',
      'Response documentation'
    ],
    category: 'Biohacking'
  },
  {
    id: 'biohack-106',
    name: 'Metabolic Enhancement',
    description: 'Execute comprehensive metabolic optimization protocol.',
    fuelPoints: 6,
    tier: 1,
    estimatedTime: '45 minutes',
    expertReference: {
      name: 'Siim Land',
      expertise: 'Metabolic optimization',
      protocol: 'Metabolic Enhancement'
    },
    instructions: [
      '1. Assessment (10 min):',
      '   - Baseline measurements',
      '   - Protocol review',
      '   - Equipment setup',
      '2. Implementation (25 min):',
      '   - Protocol execution',
      '   - Response monitoring',
      '   - Adjustment tracking',
      '3. Integration (10 min):',
      '   - Data analysis',
      '   - Pattern identification',
      '   - Protocol refinement'
    ],
    successCriteria: [
      'Complete protocol',
      'Data collection',
      'Pattern analysis'
    ],
    category: 'Biohacking'
  },
  {
    id: 'biohack-201',
    name: 'Advanced Recovery Integration',
    description: 'Execute comprehensive recovery technology protocol with full monitoring.',
    fuelPoints: 7,
    tier: 2,
    estimatedTime: '90 minutes',
    expertReference: {
      name: 'Dave Asprey',
      expertise: 'Performance optimization, recovery tech',
      protocol: 'Advanced Recovery System'
    },
    instructions: [
      '1. Preparation (15 min):',
      '   - System setup',
      '   - Baseline measurements',
      '   - Protocol review',
      '2. Implementation (60 min):',
      '   - Multi-modality integration',
      '   - Response monitoring',
      '   - Pattern tracking',
      '3. Analysis (15 min):',
      '   - Data compilation',
      '   - Pattern analysis',
      '   - Protocol refinement'
    ],
    successCriteria: [
      'Protocol completion',
      'Data collection',
      'Pattern analysis'
    ],
    category: 'Biohacking'
  },
  {
    id: 'biohack-202',
    name: 'Longevity Protocol Integration',
    description: 'Implement comprehensive longevity enhancement protocol.',
    fuelPoints: 8,
    tier: 2,
    estimatedTime: '120 minutes',
    expertReference: {
      name: 'Dr. David Sinclair',
      expertise: 'Longevity research',
      protocol: 'Longevity Enhancement'
    },
    instructions: [
      '1. Setup (20 min):',
      '   - System preparation',
      '   - Baseline measures',
      '   - Protocol review',
      '2. Implementation (80 min):',
      '   - Protocol execution',
      '   - Response monitoring',
      '   - Data collection',
      '3. Analysis (20 min):',
      '   - Data compilation',
      '   - Pattern analysis',
      '   - System optimization'
    ],
    successCriteria: [
      'Complete protocol',
      'Data collection',
      'Marker optimization'
    ],
    category: 'Biohacking'
  },
  {
    id: 'biohack-203',
    name: 'Complete Performance Integration',
    description: 'Execute elite-level performance optimization protocol.',
    fuelPoints: 9,
    tier: 2,
    estimatedTime: '150 minutes',
    expertReference: {
      name: 'Ben Greenfield',
      expertise: 'Advanced biohacking protocols',
      protocol: 'Elite Performance System'
    },
    instructions: [
      '1. Preparation (30 min):',
      '   - Full system setup',
      '   - Baseline assessment',
      '   - Protocol review',
      '2. Implementation (90 min):',
      '   - Multi-system integration',
      '   - Performance monitoring',
      '   - Adaptation tracking',
      '3. Analysis (30 min):',
      '   - Complete data review',
      '   - System optimization',
      '   - Protocol refinement'
    ],
    successCriteria: [
      'Complete protocol',
      'Full data collection',
      'System integration'
    ],
    category: 'Biohacking'
  }
];