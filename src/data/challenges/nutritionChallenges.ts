import type { Challenge } from '../../types/game';

export const nutritionChallenges: Challenge[] = [
  // Tier 1 Challenges
  {
    id: 'nc1',
    name: 'Glucose Guardian',
    tier: 1,
    duration: 21,
    description: 'Master glucose response patterns through strategic food choices and timing.',
    expertReference: 'Dr. Casey Means - Glucose optimization and metabolic health',
    learningObjectives: [
      'Understand glucose dynamics',
      'Master response patterns',
      'Develop optimal timing'
    ],
    requirements: [
      {
        description: 'Daily glucose monitoring',
        verificationMethod: 'glucose_logs'
      },
      {
        description: 'Food response tracking',
        verificationMethod: 'response_logs'
      },
      {
        description: 'Pattern identification',
        verificationMethod: 'pattern_logs'
      }
    ],
    expertIds: ['means'],
    implementationProtocol: {
      week1: 'Baseline monitoring and pattern identification',
      week2: 'Strategic intervention testing',
      week3: 'Protocol optimization and habits'
    },
    verificationMethods: [
      {
        type: 'glucose_logs',
        description: 'Glucose tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Post-meal glucose <120mg/dL',
      'Daily variability <15mg/dL',
      'Pattern recognition >90%'
    ],
    expertTips: [
      '"Glucose stability is the foundation" - Dr. Means',
      'Track meal timing impact',
      'Monitor exercise effects'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Nutrition'
  },
  {
    id: 'nc2',
    name: 'Nutrient Density Protocol',
    tier: 1,
    duration: 21,
    description: 'Optimize nutrient intake through strategic food selection and preparation methods.',
    expertReference: 'Dr. Rhonda Patrick - Nutrient optimization and absorption enhancement',
    learningObjectives: [
      'Master food quality assessment',
      'Optimize preparation methods',
      'Maximize nutrient absorption'
    ],
    requirements: [
      {
        description: 'Daily nutrient tracking',
        verificationMethod: 'nutrient_logs'
      },
      {
        description: 'Food quality assessment',
        verificationMethod: 'quality_logs'
      },
      {
        description: 'Preparation optimization',
        verificationMethod: 'prep_logs'
      }
    ],
    expertIds: ['patrick'],
    implementationProtocol: {
      week1: 'Food quality baseline and assessment',
      week2: 'Preparation method optimization',
      week3: 'Absorption protocol mastery'
    },
    verificationMethods: [
      {
        type: 'nutrient_logs',
        description: 'Nutrient tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Micronutrient targets met',
      'Preparation mastery score',
      'Quality consistency >90%'
    ],
    expertTips: [
      '"Quality drives outcomes" - Dr. Patrick',
      'Focus on food synergies',
      'Track absorption factors'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Nutrition'
  },
  {
    id: 'nc3',
    name: 'Meal Timing Master',
    tier: 1,
    duration: 21,
    description: 'Develop optimal meal timing strategies for enhanced metabolic health.',
    expertReference: 'Dr. Mark Hyman - Metabolic optimization through strategic timing',
    learningObjectives: [
      'Master meal timing',
      'Optimize feeding windows',
      'Enhance metabolic flexibility'
    ],
    requirements: [
      {
        description: 'Consistent meal timing',
        verificationMethod: 'timing_logs'
      },
      {
        description: 'Window optimization',
        verificationMethod: 'window_logs'
      },
      {
        description: 'Response tracking',
        verificationMethod: 'response_logs'
      }
    ],
    expertIds: ['hyman'],
    implementationProtocol: {
      week1: 'Timing baseline and assessment',
      week2: 'Window optimization',
      week3: 'Pattern mastery'
    },
    verificationMethods: [
      {
        type: 'timing_logs',
        description: 'Meal timing verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Timing consistency >90%',
      'Energy stability score',
      'Metabolic adaptation'
    ],
    expertTips: [
      '"Timing is as important as content" - Dr. Hyman',
      'Monitor energy patterns',
      'Track adaptation signs'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Nutrition'
  },
  {
    id: 'nc4',
    name: 'Elimination Protocol',
    tier: 1,
    duration: 21,
    description: 'Master the systematic elimination and reintroduction of potential inflammatory foods.',
    expertReference: 'Dr. Steven Gundry - Systematic elimination and inflammation reduction',
    learningObjectives: [
      'Understand inflammation triggers',
      'Master elimination process',
      'Develop reintroduction protocol'
    ],
    requirements: [
      {
        description: 'Systematic elimination',
        verificationMethod: 'elimination_logs'
      },
      {
        description: 'Response tracking',
        verificationMethod: 'response_logs'
      },
      {
        description: 'Pattern identification',
        verificationMethod: 'pattern_logs'
      }
    ],
    expertIds: ['gundry'],
    implementationProtocol: {
      week1: 'Baseline and elimination initiation',
      week2: 'Response monitoring and adjustment',
      week3: 'Strategic reintroduction protocol'
    },
    verificationMethods: [
      {
        type: 'elimination_logs',
        description: 'Elimination tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Elimination adherence >95%',
      'Response identification rate',
      'Pattern recognition accuracy'
    ],
    expertTips: [
      '"Systematic elimination reveals truth" - Dr. Gundry',
      'Track all responses',
      'Document patterns carefully'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Nutrition'
  },
  {
    id: 'nc5',
    name: 'Gut Health Protocol',
    tier: 1,
    duration: 21,
    description: 'Optimize gut health through strategic food choices and microbiome support.',
    expertReference: 'Dr. Mark Hyman - Gut health optimization and microbiome enhancement',
    learningObjectives: [
      'Understand gut health markers',
      'Master prebiotic integration',
      'Optimize microbiome support'
    ],
    requirements: [
      {
        description: 'Daily prebiotic focus',
        verificationMethod: 'prebiotic_logs'
      },
      {
        description: 'Fermented food integration',
        verificationMethod: 'fermented_logs'
      },
      {
        description: 'Gut response tracking',
        verificationMethod: 'response_logs'
      }
    ],
    expertIds: ['hyman'],
    implementationProtocol: {
      week1: 'Baseline assessment and initial protocol',
      week2: 'Progressive food integration',
      week3: 'Full protocol optimization'
    },
    verificationMethods: [
      {
        type: 'gut_health_logs',
        description: 'Gut health verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Protocol adherence >90%',
      'Digestive improvement score',
      'Pattern recognition accuracy'
    ],
    expertTips: [
      '"Gut health drives systemic health" - Dr. Hyman',
      'Track digestive responses',
      'Monitor energy patterns'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Nutrition'
  },
  {
    id: 'nc6',
    name: 'Anti-Inflammatory Foods Master',
    tier: 1,
    duration: 21,
    description: 'Develop mastery in selecting and preparing anti-inflammatory foods for optimal health.',
    expertReference: 'Chris Kresser - Anti-inflammatory food selection and preparation',
    learningObjectives: [
      'Master food selection',
      'Optimize preparation methods',
      'Track inflammation markers'
    ],
    requirements: [
      {
        description: 'Strategic food selection',
        verificationMethod: 'selection_logs'
      },
      {
        description: 'Preparation optimization',
        verificationMethod: 'prep_logs'
      },
      {
        description: 'Response monitoring',
        verificationMethod: 'response_logs'
      }
    ],
    expertIds: ['kresser'],
    implementationProtocol: {
      week1: 'Food selection mastery',
      week2: 'Preparation method optimization',
      week3: 'Complete system integration'
    },
    verificationMethods: [
      {
        type: 'food_logs',
        description: 'Food selection verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Selection accuracy >95%',
      'Preparation mastery score',
      'Inflammatory reduction markers'
    ],
    expertTips: [
      '"Preparation is key to effectiveness" - Chris Kresser',
      'Focus on quality sourcing',
      'Monitor all responses'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Nutrition'
  },
  {
    id: 'nc7',
    name: 'Protein Optimization',
    tier: 1,
    duration: 21,
    description: 'Master protein timing and quality for optimal performance and recovery.',
    expertReference: 'Dr. Rhonda Patrick - Protein optimization and timing strategies',
    learningObjectives: [
      'Understand protein dynamics',
      'Master timing protocols',
      'Optimize sources and quality'
    ],
    requirements: [
      {
        description: 'Daily protein targets',
        verificationMethod: 'protein_logs'
      },
      {
        description: 'Timing optimization',
        verificationMethod: 'timing_logs'
      },
      {
        description: 'Quality assessment',
        verificationMethod: 'quality_logs'
      }
    ],
    expertIds: ['patrick'],
    implementationProtocol: {
      week1: 'Baseline assessment and target setting',
      week2: 'Timing optimization and quality focus',
      week3: 'Complete protocol mastery'
    },
    verificationMethods: [
      {
        type: 'protein_logs',
        description: 'Protein tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Target achievement >90%',
      'Timing accuracy score',
      'Quality consistency rating'
    ],
    expertTips: [
      '"Timing amplifies benefits" - Dr. Patrick',
      'Track recovery patterns',
      'Monitor energy levels'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Nutrition'
  },
  {
    id: 'nc8',
    name: 'Performance Energy Protocol',
    tier: 1,
    duration: 21,
    description: 'Develop optimal energy management through strategic nutrition timing.',
    expertReference: 'Dr. Casey Means - Energy optimization through strategic nutrition',
    learningObjectives: [
      'Master energy management',
      'Optimize fuel selection',
      'Enhance performance timing'
    ],
    requirements: [
      {
        description: 'Energy monitoring',
        verificationMethod: 'energy_logs'
      },
      {
        description: 'Fuel timing strategy',
        verificationMethod: 'timing_logs'
      },
      {
        description: 'Performance tracking',
        verificationMethod: 'performance_logs'
      }
    ],
    expertIds: ['means'],
    implementationProtocol: {
      week1: 'Energy baseline and assessment',
      week2: 'Fuel strategy optimization',
      week3: 'Performance protocol mastery'
    },
    verificationMethods: [
      {
        type: 'energy_logs',
        description: 'Energy tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Energy stability score',
      'Performance improvement',
      'Strategy effectiveness'
    ],
    expertTips: [
      '"Energy stability drives performance" - Dr. Means',
      'Monitor performance patterns',
      'Track recovery needs'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Nutrition'
  },
  {
    id: 'nc9',
    name: 'Nutrient Timing Master',
    tier: 1,
    duration: 21,
    description: 'Master the timing of nutrients for optimal performance and recovery.',
    expertReference: 'Dr. Rhonda Patrick - Advanced nutrient timing and absorption',
    learningObjectives: [
      'Master nutrient timing',
      'Optimize absorption windows',
      'Enhance recovery protocols'
    ],
    requirements: [
      {
        description: 'Strategic timing protocols',
        verificationMethod: 'timing_logs'
      },
      {
        description: 'Absorption optimization',
        verificationMethod: 'absorption_logs'
      },
      {
        description: 'Recovery monitoring',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['patrick'],
    implementationProtocol: {
      week1: 'Timing baseline and strategy',
      week2: 'Absorption enhancement',
      week3: 'Recovery optimization'
    },
    verificationMethods: [
      {
        type: 'timing_logs',
        description: 'Timing verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Timing accuracy >90%',
      'Absorption optimization',
      'Recovery enhancement'
    ],
    expertTips: [
      '"Timing precision matters" - Dr. Patrick',
      'Track absorption factors',
      'Monitor recovery patterns'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Nutrition'
  },
  // Tier 2 Challenges
  {
    id: 'nc10',
    name: 'Glucose Mastery Protocol',
    tier: 2,
    duration: 21,
    description: 'Develop elite-level glucose control and metabolic flexibility.',
    expertReference: 'Dr. Casey Means - Advanced glucose control and metabolic optimization',
    learningObjectives: [
      'Master glucose manipulation',
      'Optimize metabolic flexibility',
      'Enhance performance timing'
    ],
    requirements: [
      {
        description: 'Advanced glucose monitoring',
        verificationMethod: 'glucose_logs'
      },
      {
        description: 'Response optimization',
        verificationMethod: 'response_logs'
      },
      {
        description: 'Pattern mastery',
        verificationMethod: 'pattern_logs'
      }
    ],
    expertIds: ['means'],
    implementationProtocol: {
      week1: 'Advanced monitoring and baseline',
      week2: 'Pattern optimization and response',
      week3: 'Performance integration mastery'
    },
    verificationMethods: [
      {
        type: 'glucose_logs',
        description: 'Advanced glucose verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Glucose stability <10 mg/dL variance',
      'Response predictability >95%',
      'Performance correlation score'
    ],
    expertTips: [
      '"Elite performance requires glucose mastery" - Dr. Means',
      'Track all variables',
      'Monitor adaptation signs'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Nutrition'
  },
  {
    id: 'nc11',
    name: 'Metabolic Flexibility Development',
    tier: 2,
    duration: 21,
    description: 'Master the ability to efficiently switch between fuel sources.',
    expertReference: 'Dr. Mark Hyman - Advanced metabolic flexibility and adaptation',
    learningObjectives: [
      'Enhance substrate switching',
      'Optimize energy systems',
      'Develop metabolic efficiency'
    ],
    requirements: [
      {
        description: 'Fuel source tracking',
        verificationMethod: 'fuel_logs'
      },
      {
        description: 'Transition protocols',
        verificationMethod: 'transition_logs'
      },
      {
        description: 'Performance monitoring',
        verificationMethod: 'performance_logs'
      }
    ],
    expertIds: ['hyman'],
    implementationProtocol: {
      week1: 'Baseline assessment and protocol',
      week2: 'Transition optimization',
      week3: 'System integration'
    },
    verificationMethods: [
      {
        type: 'metabolic_logs',
        description: 'Metabolic flexibility verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Transition efficiency score',
      'Performance maintenance',
      'Adaptation rate'
    ],
    expertTips: [
      '"Flexibility is the key to stability" - Dr. Hyman',
      'Monitor transition signs',
      'Track energy patterns'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Nutrition'
  },
  {
    id: 'nc12',
    name: 'Performance Nutrition Integration',
    tier: 2,
    duration: 21,
    description: 'Create and implement comprehensive performance nutrition protocols.',
    expertReference: 'Dr. Casey Means - Advanced performance nutrition integration',
    learningObjectives: [
      'Master system integration',
      'Optimize timing strategies',
      'Enhance recovery protocols'
    ],
    requirements: [
      {
        description: 'Multiple system integration',
        verificationMethod: 'system_logs'
      },
      {
        description: 'Timing optimization',
        verificationMethod: 'timing_logs'
      },
      {
        description: 'Recovery enhancement',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['means'],
    implementationProtocol: {
      week1: 'System assessment and baseline',
      week2: 'Integration optimization',
      week3: 'Complete protocol mastery'
    },
    verificationMethods: [
      {
        type: 'integration_logs',
        description: 'System integration verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'System integration score',
      'Performance enhancement',
      'Recovery optimization'
    ],
    expertTips: [
      '"Integration drives optimization" - Dr. Means',
      'Focus on synergies',
      'Track all variables'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Nutrition'
  },
  {
    id: 'nc13',
    name: 'Advanced Elimination Protocol',
    tier: 2,
    duration: 21,
    description: 'Master advanced elimination and reintroduction strategies.',
    expertReference: 'Dr. Steven Gundry - Advanced elimination and inflammation control',
    learningObjectives: [
      'Master systematic elimination',
      'Optimize reintroduction',
      'Enhance pattern recognition'
    ],
    requirements: [
      {
        description: 'Advanced elimination tracking',
        verificationMethod: 'elimination_logs'
      },
      {
        description: 'Response optimization',
        verificationMethod: 'response_logs'
      },
      {
        description: 'Pattern mastery',
        verificationMethod: 'pattern_logs'
      }
    ],
    expertIds: ['gundry'],
    implementationProtocol: {
      week1: 'Advanced elimination baseline',
      week2: 'Response pattern mastery',
      week3: 'System optimization'
    },
    verificationMethods: [
      {
        type: 'elimination_logs',
        description: 'Advanced elimination verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Elimination accuracy >95%',
      'Response recognition rate',
      'Pattern mastery score'
    ],
    expertTips: [
      '"Patterns reveal truth" - Dr. Gundry',
      'Track subtle changes',
      'Document all responses'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Nutrition'
  },
  {
    id: 'nc14',
    name: 'Anti-Inflammatory Mastery',
    tier: 2,
    duration: 21,
    description: 'Develop elite-level understanding and control of inflammatory responses.',
    expertReference: 'Chris Kresser - Advanced inflammation control and optimization',
    learningObjectives: [
      'Master inflammation control',
      'Optimize response patterns',
      'Enhance recovery protocols'
    ],
    requirements: [
      {
        description: 'Inflammation monitoring',
        verificationMethod: 'inflammation_logs'
      },
      {
        description: 'Response optimization',
        verificationMethod: 'response_logs'
      },
      {
        description: 'Recovery enhancement',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['kresser'],
    implementationProtocol: {
      week1: 'Advanced monitoring setup',
      week2: 'Response optimization',
      week3: 'Protocol mastery'
    },
    verificationMethods: [
      {
        type: 'inflammation_logs',
        description: 'Inflammation control verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Response control >90%',
      'Pattern recognition rate',
      'Recovery optimization'
    ],
    expertTips: [
      '"Control precedes optimization" - Chris Kresser',
      'Monitor all variables',
      'Track adaptation signs'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Nutrition'
  },
  {
    id: 'nc15',
    name: 'System Integration Protocol',
    tier: 2,
    duration: 21,
    description: 'Create and implement comprehensive anti-inflammatory systems.',
    expertReference: 'Dr. Steven Gundry - Advanced system integration and optimization',
    learningObjectives: [
      'Master system design',
      'Optimize implementation',
      'Enhance maintenance'
    ],
    requirements: [
      {
        description: 'System integration',
        verificationMethod: 'system_logs'
      },
      {
        description: 'Protocol optimization',
        verificationMethod: 'protocol_logs'
      },
      {
        description: 'Maintenance development',
        verificationMethod: 'maintenance_logs'
      }
    ],
    expertIds: ['gundry'],
    implementationProtocol: {
      week1: 'System baseline and design',
      week2: 'Integration mastery',
      week3: 'Maintenance optimization'
    },
    verificationMethods: [
      {
        type: 'system_logs',
        description: 'System integration verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'System effectiveness',
      'Integration success',
      'Maintenance reliability'
    ],
    expertTips: [
      '"Systems drive success" - Dr. Gundry',
      'Focus on consistency',
      'Track all components'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Nutrition'
  },
  {
    id: 'nc16',
    name: 'Elite Performance Protocol',
    tier: 2,
    duration: 21,
    description: 'Develop elite-level performance nutrition strategies and systems.',
    expertReference: 'Dr. Rhonda Patrick - Advanced performance nutrition optimization',
    learningObjectives: [
      'Master performance nutrition',
      'Optimize timing protocols',
      'Enhance recovery systems'
    ],
    requirements: [
      {
        description: 'Advanced performance tracking',
        verificationMethod: 'performance_logs'
      },
      {
        description: 'Timing optimization',
        verificationMethod: 'timing_logs'
      },
      {
        description: 'Recovery enhancement',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['patrick'],
    implementationProtocol: {
      week1: 'Performance baseline',
      week2: 'Protocol optimization',
      week3: 'System mastery'
    },
    verificationMethods: [
      {
        type: 'performance_logs',
        description: 'Performance tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Protocol effectiveness',
      'Timing accuracy',
      'Recovery optimization'
    ],
    expertTips: [
      '"Elite performance requires precision" - Dr. Patrick',
      'Monitor all variables',
      'Track adaptation signs'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Nutrition'
  },
  {
    id: 'nc17',
    name: 'Recovery Optimization Protocol',
    tier: 2,
    duration: 21,
    description: 'Master advanced recovery nutrition and timing strategies.',
    expertReference: 'Dr. Casey Means - Advanced recovery nutrition optimization',
    learningObjectives: [
      'Master recovery nutrition',
      'Optimize timing protocols',
      'Enhance system integration'
    ],
    requirements: [
      {
        description: 'Recovery tracking',
        verificationMethod: 'recovery_logs'
      },
      {
        description: 'Protocol optimization',
        verificationMethod: 'protocol_logs'
      },
      {
        description: 'System integration',
        verificationMethod: 'system_logs'
      }
    ],
    expertIds: ['means'],
    implementationProtocol: {
      week1: 'Recovery baseline',
      week2: 'Protocol mastery',
      week3: 'System optimization'
    },
    verificationMethods: [
      {
        type: 'recovery_logs',
        description: 'Recovery tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Recovery enhancement',
      'Protocol effectiveness',
      'System integration'
    ],
    expertTips: [
      '"Recovery drives progress" - Dr. Means',
      'Track all variables',
      'Monitor adaptation'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Nutrition'
  },
  {
    id: 'nc18',
    name: 'Complete System Mastery',
    tier: 2,
    duration: 21,
    description: 'Develop and implement fully optimized performance nutrition systems.',
    expertReference: 'Dr. Rhonda Patrick - Advanced system optimization and integration',
    learningObjectives: [
      'Master system integration',
      'Optimize protocols',
      'Enhance maintenance'
    ],
    requirements: [
      {
        description: 'System tracking',
        verificationMethod: 'system_logs'
      },
      {
        description: 'Protocol optimization',
        verificationMethod: 'protocol_logs'
      },
      {
        description: 'Maintenance development',
        verificationMethod: 'maintenance_logs'
      }
    ],
    expertIds: ['patrick'],
    implementationProtocol: {
      week1: 'System baseline',
      week2: 'Integration mastery',
      week3: 'Maintenance optimization'
    },
    verificationMethods: [
      {
        type: 'system_logs',
        description: 'System tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'System effectiveness',
      'Protocol success',
      'Maintenance reliability'
    ],
    expertTips: [
      '"Systems enable excellence" - Dr. Patrick',
      'Track all components',
      'Monitor adaptation'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Nutrition'
  }
];