import type { Boost } from '../../types/game';

// Tier 1 and Tier 2 Mindset Boosts
export const mindsetBoosts: Boost[] = [
  // Tier 1 Boosts
  {
    id: 'mindset-101',
    name: 'Morning Gratitude Practice',
    description: 'Start your day with a structured gratitude practice to enhance emotional resilience and set a positive mindset foundation.',
    fuelPoints: 1,
    tier: 1,
    estimatedTime: '5-10 minutes',
    expertReference: {
      name: 'Dr. Joe Dispenza',
      expertise: 'Mental performance, meditation',
      protocol: 'Emotional Elevation Protocol'
    },
    instructions: [
      '1. Find a quiet space and sit comfortably',
      '2. Take 3 deep breaths to center yourself',
      '3. Write down 3 specific things you\'re grateful for, including:',
      '   - One personal achievement',
      '   - One relationship element',
      '   - One future opportunity',
      '4. For each item, write 2-3 sentences about why it matters',
      '5. Spend 1 minute visualizing each item with positive emotion'
    ],
    successCriteria: [
      'Complete all three entries',
      'Include specific details',
      'Maintain focus during visualization'
    ],
    category: 'Mindset'
  },
  {
    id: 'mindset-102',
    name: 'Focus Block Session',
    description: 'Complete a focused work period using scientifically-proven concentration enhancement techniques.',
    fuelPoints: 2,
    tier: 1,
    estimatedTime: '25 minutes',
    expertReference: {
      name: 'Dr. Andrew Huberman',
      expertise: 'Neuroscience, focus, stress management',
      protocol: 'Neural Focus Enhancement'
    },
    instructions: [
      '1. Set up a distraction-free environment (5 min):',
      '   - Clear workspace',
      '   - Silence notifications',
      '   - Optimize lighting',
      '2. Define specific task objective',
      '3. Complete focusing breath work (2 min):',
      '   - Box breathing: 4 counts in, hold, out, hold',
      '4. Execute focused work period (15 min)',
      '5. Document completion and insights (3 min)'
    ],
    successCriteria: [
      'Zero interruptions',
      'Complete defined task',
      'Maintain environment standards'
    ],
    category: 'Mindset'
  },
  {
    id: 'mindset-103',
    name: 'Mindfulness Meditation',
    description: 'Practice structured mindfulness meditation for cognitive enhancement and stress reduction.',
    fuelPoints: 3,
    tier: 1,
    estimatedTime: '15 minutes',
    expertReference: {
      name: 'Sam Harris',
      expertise: 'Meditation, consciousness',
      protocol: 'Mindfulness Foundation'
    },
    instructions: [
      '1. Prepare meditation space (2 min):',
      '   - Find quiet location',
      '   - Set timer',
      '   - Establish comfortable posture',
      '2. Centering practice (1 min):',
      '   - Three deep breaths',
      '   - Body scan',
      '3. Main practice (10 min):',
      '   - Focus on breath',
      '   - Note distractions without judgment',
      '   - Return to breath',
      '4. Completion reflection (2 min)'
    ],
    successCriteria: [
      'Complete full duration',
      'Maintain awareness practice',
      'Document experience'
    ],
    category: 'Mindset'
  },
  {
    id: 'mindset-104',
    name: 'Growth Mindset Integration',
    description: 'Active practice of growth mindset principles through structured reflection and challenge reframing.',
    fuelPoints: 4,
    tier: 1,
    estimatedTime: '20 minutes',
    expertReference: {
      name: 'Dr. Carol Dweck',
      expertise: 'Growth mindset research',
      protocol: 'Mindset Development Framework'
    },
    instructions: [
      '1. Review current challenges (5 min):',
      '   - List 3 active challenges',
      '   - Rate difficulty 1-10',
      '   - Note current approach',
      '2. Growth reframing (10 min):',
      '   - Identify learning opportunities',
      '   - List potential skills to develop',
      '   - Create action steps',
      '3. Implementation planning (5 min):',
      '   - Set specific practice goals',
      '   - Schedule skill development',
      '   - Define success metrics'
    ],
    successCriteria: [
      'Complete all exercises',
      'Create actionable plans',
      'Document mindset shifts'
    ],
    category: 'Mindset'
  },
  {
    id: 'mindset-105',
    name: 'Peak State Activation',
    description: 'Execute complete peak state development protocol for optimal performance.',
    fuelPoints: 5,
    tier: 1,
    estimatedTime: '30 minutes',
    expertReference: {
      name: 'Tony Robbins',
      expertise: 'Peak performance psychology',
      protocol: 'Peak State Development'
    },
    instructions: [
      '1. Physical priming (10 min):',
      '   - Dynamic movement',
      '   - Power posture',
      '   - Breathing pattern',
      '2. Mental preparation (10 min):',
      '   - Visualization exercise',
      '   - Affirmation practice',
      '   - Goal review',
      '3. State anchoring (10 min):',
      '   - Create state trigger',
      '   - Test response',
      '   - Document process'
    ],
    successCriteria: [
      'Complete full protocol',
      'Establish reliable anchor',
      'Document state shift'
    ],
    category: 'Mindset'
  },
  {
    id: 'mindset-106',
    name: 'Mental Performance Optimization',
    description: 'Advanced cognitive enhancement protocol combining multiple modalities.',
    fuelPoints: 6,
    tier: 1,
    estimatedTime: '30 minutes',
    expertReference: {
      name: 'Dr. Andrew Huberman',
      expertise: 'Neuroscience, cognitive performance',
      protocol: 'Neural Performance Stack'
    },
    instructions: [
      '1. Environment optimization (5 min):',
      '   - Light exposure setting',
      '   - Temperature adjustment',
      '   - Sound optimization',
      '2. Physiological preparation (10 min):',
      '   - Breath work protocol',
      '   - Visual focusing exercise',
      '   - Body temperature regulation',
      '3. Mental training (15 min):',
      '   - Attention switching practice',
      '   - Working memory exercise',
      '   - Processing speed task'
    ],
    successCriteria: [
      'Complete all protocol elements',
      'Meet performance targets',
      'Document improvements'
    ],
    category: 'Mindset'
  },
  // Tier 2 Boosts
  {
    id: 'mindset-201',
    name: 'Advanced Meditation Integration',
    description: 'Execute advanced meditation protocol with brainwave monitoring and optimization.',
    fuelPoints: 7,
    tier: 2,
    estimatedTime: '45-60 minutes',
    expertReference: {
      name: 'Dr. Joe Dispenza',
      expertise: 'Advanced meditation, neuroplasticity',
      protocol: 'Advanced Meditation System'
    },
    instructions: [
      '1. Environment setup (10 min):',
      '   - Optimize meditation space',
      '   - Set up monitoring equipment',
      '   - Calibrate baseline readings',
      '2. Preparation phase (10 min):',
      '   - Progressive relaxation',
      '   - Breath synchronization',
      '   - State priming',
      '3. Main practice (30 min):',
      '   - Guided meditation sequence',
      '   - Brainwave monitoring',
      '   - State optimization',
      '4. Integration (10 min):',
      '   - Data review',
      '   - Pattern documentation',
      '   - Progress tracking'
    ],
    successCriteria: [
      'Achieve target brainwave states',
      'Maintain state consistency',
      'Complete full protocol'
    ],
    category: 'Mindset'
  },
  {
    id: 'mindset-202',
    name: 'Flow State Protocol',
    description: 'Complete flow state induction and maintenance protocol with performance tracking.',
    fuelPoints: 8,
    tier: 2,
    estimatedTime: '90-120 minutes',
    expertReference: {
      name: 'Dr. Andrew Huberman',
      expertise: 'Neural optimization, flow states',
      protocol: 'Flow State Induction'
    },
    instructions: [
      '1. Environment optimization (15 min):',
      '   - Space preparation',
      '   - Equipment setup',
      '   - Metric calibration',
      '2. State preparation (30 min):',
      '   - Physiological priming',
      '   - Neural warm-up',
      '   - Focus calibration',
      '3. Flow induction (45 min):',
      '   - Progressive challenge scaling',
      '   - State monitoring',
      '   - Performance tracking',
      '4. Integration (30 min):',
      '   - Data analysis',
      '   - Pattern documentation',
      '   - Protocol refinement'
    ],
    successCriteria: [
      'Achieve flow state',
      'Maintain optimal performance',
      'Complete full protocol'
    ],
    category: 'Mindset'
  },
  {
    id: 'mindset-203',
    name: 'Elite Mental Performance Integration',
    description: 'Execute comprehensive mental performance optimization protocol combining multiple modalities.',
    fuelPoints: 9,
    tier: 2,
    estimatedTime: '120-150 minutes',
    expertReference: {
      name: 'Dr. Andrew Huberman',
      expertise: 'Neuroscience, peak performance',
      protocol: 'Elite Performance Integration'
    },
    instructions: [
      '1. Preparation phase (30 min):',
      '   - Environment optimization',
      '   - System calibration',
      '   - Baseline measurements',
      '2. Physical priming (30 min):',
      '   - Movement protocol',
      '   - Breath work',
      '   - State activation',
      '3. Mental training (45 min):',
      '   - Cognitive enhancement',
      '   - State optimization',
      '   - Performance tracking',
      '4. Integration (15 min):',
      '   - Data analysis',
      '   - Protocol documentation',
      '   - Progress assessment'
    ],
    successCriteria: [
      'Complete full protocol',
      'Meet all performance targets',
      'Document system integration'
    ],
    category: 'Mindset'
  }
];