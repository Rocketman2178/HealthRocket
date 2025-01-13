import type { Challenge } from '../../types/game';

export const sleepChallenges: Challenge[] = [
  // Sleep Quality Foundation Challenges
  {
    id: 'sc1',
    name: 'Sleep Schedule Mastery',
    tier: 1,
    duration: 21,
    description: 'Establish a consistent sleep schedule that aligns with your circadian rhythm, creating a foundation for optimal sleep quality.',
    expertReference: 'Dr. Matthew Walker - Sleep consistency and circadian rhythm optimization',
    learningObjectives: [
      'Understand sleep timing consistency',
      'Master schedule adjustment techniques',
      'Learn to maintain timing through different scenarios'
    ],
    requirements: [
      {
        description: 'Fixed bedtime/wake time (±30 min window)',
        verificationMethod: 'sleep_tracker_data'
      },
      {
        description: 'Weekend consistency (no more than 1-hour deviation)',
        verificationMethod: 'sleep_tracker_data'
      },
      {
        description: 'Minimum 7 hours sleep opportunity',
        verificationMethod: 'sleep_tracker_data'
      }
    ],
    expertIds: ['walker'],
    implementationProtocol: {
      week1: 'Establish baseline and set target times',
      week2: 'Refine schedule and handle disruptions',
      week3: 'Master consistency and optimization'
    },
    verificationMethods: [
      {
        type: 'sleep_tracker_data',
        description: 'Sleep tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      '90% adherence to sleep/wake times',
      'Consistent weekend timing',
      'Improved sleep onset latency'
    ],
    expertTips: [
      '"The timing of sleep is nearly as important as the quantity" - Dr. Walker',
      'Start with your wake time and work backwards',
      'Use morning light to anchor your rhythm'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Sleep'
  },
  {
    id: 'sc2',
    name: 'Recovery Environment Setup',
    tier: 1,
    duration: 21,
    description: 'Create an optimal sleep environment that supports deep recovery by controlling key environmental factors that influence sleep quality.',
    expertReference: 'Dr. Kirk Parsley - Sleep environment optimization for recovery',
    learningObjectives: [
      'Understand environmental impact on sleep quality',
      'Master temperature regulation for sleep',
      'Optimize light and sound control'
    ],
    requirements: [
      {
        description: 'Temperature optimization (65-67°F/18-19°C)',
        verificationMethod: 'environment_logs'
      },
      {
        description: 'Complete darkness during sleep',
        verificationMethod: 'environment_logs'
      },
      {
        description: 'Noise reduction/masking',
        verificationMethod: 'environment_logs'
      }
    ],
    expertIds: ['parsley'],
    implementationProtocol: {
      week1: 'Assessment and baseline setup',
      week2: 'Fine-tune environmental controls',
      week3: 'Optimize and maintain conditions'
    },
    verificationMethods: [
      {
        type: 'environment_logs',
        description: 'Environment tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Consistent temperature maintenance',
      'Complete darkness achievement',
      'Reduced environmental disruptions'
    ],
    expertTips: [
      '"Your bedroom should be a cave: cool, dark, and quiet" - Dr. Parsley',
      'Test different temperatures within range',
      'Use blackout solutions for complete darkness'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Sleep'
  },
  {
    id: 'sc3',
    name: 'Evening Wind-Down Protocol',
    tier: 1,
    duration: 21,
    description: 'Develop a comprehensive evening routine that prepares your body and mind for optimal sleep.',
    expertReference: 'Dr. Matthew Walker & Dr. Kirk Parsley - Evening routine optimization',
    learningObjectives: [
      'Understand sleep pressure and wind-down importance',
      'Master digital sunset techniques',
      'Develop effective relaxation practices'
    ],
    requirements: [
      {
        description: '2-hour pre-sleep routine',
        verificationMethod: 'evening_routine_logs'
      },
      {
        description: 'Complete screen elimination 90 minutes before bed',
        verificationMethod: 'device_tracking'
      },
      {
        description: 'Structured relaxation practice',
        verificationMethod: 'practice_logs'
      }
    ],
    expertIds: ['walker', 'parsley'],
    implementationProtocol: {
      week1: 'Establish basic routine framework',
      week2: 'Add relaxation techniques',
      week3: 'Optimize and personalize protocol'
    },
    verificationMethods: [
      {
        type: 'evening_routine_logs',
        description: 'Evening routine verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      '90% routine completion rate',
      'Screen-free success rate',
      'Reduced sleep onset time'
    ],
    expertTips: [
      '"The power of routine is in its predictability" - Dr. Walker',
      'Begin with light stretching or reading',
      'Maintain routine even on weekends'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Sleep'
  },
  // Circadian Reset Challenges
  {
    id: 'sc4',
    name: 'Morning Light Protocol',
    tier: 1,
    duration: 21,
    description: 'Optimize your circadian rhythm through strategic morning light exposure. This challenge focuses on using natural light to reset your biological clock and enhance daytime alertness while improving nighttime sleep quality.',
    expertReference: 'Dr. Andrew Huberman - Circadian biology and light exposure optimization',
    learningObjectives: [
      'Understand circadian biology and light timing',
      'Master morning light exposure techniques',
      'Learn to maintain timing across seasons'
    ],
    requirements: [
      {
        description: 'Direct sunlight exposure within 30-60 minutes of waking',
        verificationMethod: 'light_exposure_logs'
      },
      {
        description: 'Minimum 10 minutes exposure time',
        verificationMethod: 'light_exposure_logs'
      },
      {
        description: 'Outdoor positioning optimization',
        verificationMethod: 'light_exposure_logs'
      }
    ],
    expertIds: ['hubermanMin'],
    implementationProtocol: {
      week1: 'Establish baseline and initial exposure',
      week2: 'Refine timing and technique',
      week3: 'Optimize and maintain protocol'
    },
    verificationMethods: [
      {
        type: 'light_exposure_logs',
        description: 'Light exposure tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Consistent morning light exposure',
      'Improved morning alertness',
      'Enhanced sleep quality'
    ],
    expertTips: [
      '"First light is your biological reset button" - Dr. Huberman',
      'Prioritize outdoor exposure',
      'Avoid sunglasses during initial exposure'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Sleep'
  },
  {
    id: 'sc5',
    name: 'Evening Light Management',
    tier: 1,
    duration: 21,
    description: 'Master the control of artificial light exposure in the evening hours to support natural melatonin production and prepare for quality sleep.',
    expertReference: 'Dr. Michael Breus - Evening light management and melatonin optimization',
    learningObjectives: [
      'Understand artificial light\'s impact on sleep',
      'Master digital device management',
      'Develop optimal evening lighting'
    ],
    requirements: [
      {
        description: 'Blue light reduction 3 hours before bed',
        verificationMethod: 'light_meter_logs'
      },
      {
        description: 'Progressive dimming protocol',
        verificationMethod: 'light_meter_logs'
      },
      {
        description: 'Device usage optimization',
        verificationMethod: 'device_logs'
      }
    ],
    expertIds: ['breus'],
    implementationProtocol: {
      week1: 'Implement basic light controls',
      week2: 'Optimize device management',
      week3: 'Fine-tune evening environment'
    },
    verificationMethods: [
      {
        type: 'light_meter_logs',
        description: 'Light exposure verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Consistent device cutoff time',
      'Proper light spectrum transition',
      'Improved sleep onset'
    ],
    expertTips: [
      '"Light is a drug - dose it carefully" - Dr. Breus',
      'Use amber glasses for unavoidable screens',
      'Create zones of declining brightness'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Sleep'
  },
  {
    id: 'sc6',
    name: 'Meal Timing Alignment',
    tier: 1,
    duration: 21,
    description: 'Synchronize your eating patterns with your circadian rhythm to optimize both digestion and sleep quality.',
    expertReference: 'Dr. Andrew Huberman & Dr. Michael Breus - Metabolic timing and circadian optimization',
    learningObjectives: [
      'Understand metabolic timing',
      'Master eating windows',
      'Optimize caffeine and hydration'
    ],
    requirements: [
      {
        description: 'Consistent meal timing windows',
        verificationMethod: 'meal_logs'
      },
      {
        description: 'Caffeine cutoff (10 hours before bed)',
        verificationMethod: 'caffeine_logs'
      },
      {
        description: 'Hydration strategy implementation',
        verificationMethod: 'hydration_logs'
      }
    ],
    expertIds: ['hubermanMind', 'breus'],
    implementationProtocol: {
      week1: 'Establish eating windows',
      week2: 'Optimize caffeine/hydration',
      week3: 'Master consistent timing'
    },
    verificationMethods: [
      {
        type: 'meal_logs',
        description: 'Meal timing verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      '90% adherence to eating windows',
      'Caffeine compliance rate',
      'Hydration goal achievement'
    ],
    expertTips: [
      '"Time-restricted feeding is a powerful circadian lever" - Dr. Huberman',
      'Start with 12-hour eating window',
      'Front-load caffeine consumption'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Sleep'
  },
  {
    id: 'sc7',
    name: 'Sleep Duration Extension',
    tier: 1,
    duration: 21,
    description: 'Systematically extend your sleep duration to optimize recovery and performance.',
    expertReference: 'Dr. Kirk Parsley - Sleep duration optimization and recovery enhancement',
    learningObjectives: [
      'Understand optimal sleep duration',
      'Master progressive extension',
      'Learn recovery optimization'
    ],
    requirements: [
      {
        description: 'Baseline sleep assessment',
        verificationMethod: 'sleep_logs'
      },
      {
        description: 'Progressive duration increase',
        verificationMethod: 'sleep_logs'
      },
      {
        description: 'Quality monitoring',
        verificationMethod: 'quality_logs'
      }
    ],
    expertIds: ['parsley'],
    implementationProtocol: {
      week1: 'Establish baseline and targets',
      week2: 'Implement extension strategy',
      week3: 'Optimize and stabilize duration'
    },
    verificationMethods: [
      {
        type: 'sleep_logs',
        description: 'Sleep duration verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Achieved target duration',
      'Maintained sleep efficiency',
      'Consistent timing adherence'
    ],
    expertTips: [
      '"Quality and quantity are equally important" - Dr. Parsley',
      'Add time in 15-minute increments',
      'Focus on sleep opportunity window'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Sleep'
  },
  {
    id: 'sc8',
    name: 'Stress Management Protocol',
    tier: 1,
    duration: 21,
    description: 'Develop and implement effective stress management techniques that support optimal recovery and sleep quality.',
    expertReference: 'Dan Pardi, PhD - Stress management and sleep recovery optimization',
    learningObjectives: [
      'Understand stress-sleep relationship',
      'Master relaxation techniques',
      'Develop recovery mindset'
    ],
    requirements: [
      {
        description: 'Evening relaxation routine',
        verificationMethod: 'relaxation_logs'
      },
      {
        description: 'Mindfulness practice integration',
        verificationMethod: 'mindfulness_logs'
      },
      {
        description: 'Stress response tracking',
        verificationMethod: 'stress_logs'
      }
    ],
    expertIds: ['pardi'],
    implementationProtocol: {
      week1: 'Learn basic techniques',
      week2: 'Deepen practice integration',
      week3: 'Master stress response'
    },
    verificationMethods: [
      {
        type: 'stress_logs',
        description: 'Stress management verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Improved HRV scores',
      'Reduced evening tension',
      'Enhanced recovery metrics'
    ],
    expertTips: [
      '"Recovery begins before bedtime" - Dan Pardi',
      'Start with 5-minute sessions',
      'Build consistent practice times'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Sleep'
  },
  {
    id: 'sc9',
    name: 'Basic Recovery Tracking',
    tier: 1,
    duration: 21,
    description: 'Master the fundamentals of recovery monitoring using both objective and subjective measures.',
    expertReference: 'Dr. Kirk Parsley & Dan Pardi - Recovery monitoring and optimization',
    learningObjectives: [
      'Understand recovery metrics',
      'Master tracking tools',
      'Learn data interpretation'
    ],
    requirements: [
      {
        description: 'Daily HRV monitoring',
        verificationMethod: 'hrv_logs'
      },
      {
        description: 'Sleep stage tracking',
        verificationMethod: 'sleep_stage_logs'
      },
      {
        description: 'Energy assessment protocol',
        verificationMethod: 'energy_logs'
      }
    ],
    expertIds: ['parsley', 'pardi'],
    implementationProtocol: {
      week1: 'Setup tracking systems',
      week2: 'Learn data interpretation',
      week3: 'Optimize based on trends'
    },
    verificationMethods: [
      {
        type: 'recovery_logs',
        description: 'Recovery tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Consistent tracking compliance',
      'Improved HRV trends',
      'Better energy stability'
    ],
    expertTips: [
      '"What gets measured gets managed" - Dr. Parsley',
      'Take readings at same time daily',
      'Focus on trends over daily scores'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Sleep'
  },
  {
    id: 'sc10',
    name: 'Advanced Sleep Tracking',
    tier: 2,
    duration: 21,
    description: 'Master advanced sleep architecture optimization using sophisticated tracking and analysis techniques.',
    expertReference: 'Dr. Matthew Walker - Advanced sleep architecture and performance optimization',
    learningObjectives: [
      'Master sleep stage architecture',
      'Understand performance correlations',
      'Optimize recovery cycles'
    ],
    requirements: [
      {
        description: 'Detailed sleep stage monitoring',
        verificationMethod: 'sleep_stage_logs'
      },
      {
        description: 'Cycle optimization protocol',
        verificationMethod: 'cycle_logs'
      },
      {
        description: 'Performance correlation tracking',
        verificationMethod: 'performance_logs'
      }
    ],
    expertIds: ['walker'],
    implementationProtocol: {
      week1: 'Baseline assessment and stage tracking',
      week2: 'Cycle optimization and adjustment',
      week3: 'Performance correlation mastery'
    },
    verificationMethods: [
      {
        type: 'sleep_stage_logs',
        description: 'Sleep architecture verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Improved deep sleep percentage',
      'Optimized REM cycles',
      'Enhanced recovery scores'
    ],
    expertTips: [
      '"Focus on the architecture, not just the duration" - Dr. Walker',
      'Track cognitive performance alongside sleep stages',
      'Note exercise timing impacts on deep sleep'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Sleep'
  },
  {
    id: 'sc11',
    name: 'Temperature Manipulation',
    tier: 2,
    duration: 21,
    description: 'Master advanced temperature regulation protocols for optimal sleep architecture.',
    expertReference: 'Dr. Kirk Parsley - Advanced temperature regulation and sleep optimization',
    learningObjectives: [
      'Understand thermoregulation impact',
      'Master core temperature manipulation',
      'Optimize environmental controls'
    ],
    requirements: [
      {
        description: 'Progressive temperature protocols',
        verificationMethod: 'temperature_logs'
      },
      {
        description: 'Core body temp tracking',
        verificationMethod: 'core_temp_logs'
      },
      {
        description: 'Environment manipulation',
        verificationMethod: 'environment_logs'
      }
    ],
    expertIds: ['parsley'],
    implementationProtocol: {
      week1: 'Temperature mapping and baseline',
      week2: 'Protocol implementation and tracking',
      week3: 'Optimization and refinement'
    },
    verificationMethods: [
      {
        type: 'temperature_logs',
        description: 'Temperature control verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Consistent temperature control',
      'Improved sleep latency',
      'Enhanced deep sleep metrics'
    ],
    expertTips: [
      '"Temperature is the most powerful non-pharmacological driver of sleep" - Dr. Parsley',
      'Start cooling 2-3 hours before bed',
      'Monitor morning temperature impact'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Sleep'
  },
  {
    id: 'sc12',
    name: 'Advanced Wind-Down',
    tier: 2,
    duration: 21,
    description: 'Develop an advanced evening recovery protocol that integrates multiple sleep optimization techniques.',
    expertReference: 'Dr. Matthew Walker & Dr. Kirk Parsley - Advanced recovery protocol integration',
    learningObjectives: [
      'Master state manipulation',
      'Integrate multiple protocols',
      'Optimize recovery preparation'
    ],
    requirements: [
      {
        description: 'Multi-phase wind-down system',
        verificationMethod: 'protocol_logs'
      },
      {
        description: 'Progressive relaxation mastery',
        verificationMethod: 'relaxation_logs'
      },
      {
        description: 'Physiological state tracking',
        verificationMethod: 'state_logs'
      }
    ],
    expertIds: ['walker', 'parsley'],
    implementationProtocol: {
      week1: 'Protocol establishment',
      week2: 'Integration and refinement',
      week3: 'Mastery and optimization'
    },
    verificationMethods: [
      {
        type: 'protocol_logs',
        description: 'Wind-down protocol verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Improved HRV evening trends',
      'Reduced sleep latency',
      'Enhanced recovery scores'
    ],
    expertTips: [
      '"The quality of your wind-down determines the quality of your sleep" - Dr. Walker',
      'Layer protocols progressively',
      'Adjust timing based on response'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Sleep'
  },
  {
    id: 'sc13',
    name: 'Advanced Light Protocol',
    tier: 2,
    duration: 21,
    description: 'Master the precision timing and intensity of light exposure for optimal circadian entrainment. This challenge focuses on creating a sophisticated light exposure strategy that enhances both cognitive performance and sleep quality.',
    expertReference: 'Dr. Andrew Huberman - Advanced light exposure and circadian optimization',
    learningObjectives: [
      'Master precision light timing',
      'Understand intensity optimization',
      'Learn adaptation strategies'
    ],
    requirements: [
      {
        description: 'Dawn simulation protocol',
        verificationMethod: 'light_exposure_logs'
      },
      {
        description: 'Precision timing windows',
        verificationMethod: 'light_exposure_logs'
      },
      {
        description: 'Intensity management',
        verificationMethod: 'light_exposure_logs'
      }
    ],
    expertIds: ['hubermanMind'],
    implementationProtocol: {
      week1: 'Establish precision timing',
      week2: 'Intensity and spectrum mastery',
      week3: 'Integration and optimization'
    },
    verificationMethods: [
      {
        type: 'light_exposure_logs',
        description: 'Light exposure verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Precise timing adherence',
      'Improved sleep onset',
      'Enhanced morning alertness'
    ],
    expertTips: [
      '"Time your light exposure like a prescription drug" - Dr. Huberman',
      'Use maximum intensity in morning',
      'Create clear light boundaries'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Sleep'
  },
  {
    id: 'sc14',
    name: 'Travel Adaptation System',
    tier: 2,
    duration: 21,
    description: 'Develop advanced strategies for maintaining circadian stability during travel and rapid time zone changes. This challenge focuses on mastering pre-emptive adaptation and recovery techniques.',
    expertReference: 'Dr. Michael Breus - Advanced travel adaptation and circadian realignment',
    learningObjectives: [
      'Master jet lag prevention',
      'Understand time zone adaptation',
      'Learn recovery acceleration'
    ],
    requirements: [
      {
        description: 'Pre-travel adaptation protocol',
        verificationMethod: 'adaptation_logs'
      },
      {
        description: 'Light exposure scheduling',
        verificationMethod: 'light_exposure_logs'
      },
      {
        description: 'Meal timing strategies',
        verificationMethod: 'meal_timing_logs'
      }
    ],
    expertIds: ['breus'],
    implementationProtocol: {
      week1: 'Pre-adaptation techniques',
      week2: 'Time zone transition mastery',
      week3: 'Recovery optimization'
    },
    verificationMethods: [
      {
        type: 'adaptation_logs',
        description: 'Adaptation tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Reduced adaptation time',
      'Maintained performance',
      'Sleep schedule stability'
    ],
    expertTips: [
      '"Start adapting before you travel" - Dr. Breus',
      'Use strategic fasting',
      'Anchor new time zones with light'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Sleep'
  },
  {
    id: 'sc15',
    name: 'Chronotype Optimization',
    tier: 2,
    duration: 21,
    description: 'Create a personalized rhythm optimization protocol based on your chronotype while maintaining professional and social obligations. This challenge focuses on aligning your natural rhythm with peak performance requirements.',
    expertReference: 'Dr. Michael Breus & Dr. Andrew Huberman - Advanced chronotype optimization',
    learningObjectives: [
      'Master chronotype assessment',
      'Optimize performance timing',
      'Balance rhythm with reality'
    ],
    requirements: [
      {
        description: 'Detailed chronotype analysis',
        verificationMethod: 'chronotype_logs'
      },
      {
        description: 'Performance timing mapping',
        verificationMethod: 'performance_logs'
      },
      {
        description: 'Energy management protocol',
        verificationMethod: 'energy_logs'
      }
    ],
    expertIds: ['breus', 'hubermanMind'],
    implementationProtocol: {
      week1: 'Chronotype analysis and mapping',
      week2: 'Performance timing integration',
      week3: 'Schedule mastery and optimization'
    },
    verificationMethods: [
      {
        type: 'chronotype_logs',
        description: 'Chronotype tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Aligned peak performance',
      'Improved energy stability',
      'Enhanced productivity'
    ],
    expertTips: [
      '"Work with your chronotype, not against it" - Dr. Breus',
      'Schedule critical tasks during peaks',
      'Create buffer zones for flexibility'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Sleep'
  },
  {
    id: 'sc16',
    name: 'Recovery Stack Implementation',
    tier: 2,
    duration: 21,
    description: 'Master the implementation of a comprehensive recovery optimization stack, combining multiple modalities for maximum effectiveness. This challenge focuses on integrating various recovery techniques into a cohesive system.',
    expertReference: 'Dr. Kirk Parsley - Advanced recovery system integration',
    learningObjectives: [
      'Master multiple recovery modalities',
      'Understand timing synergies',
      'Optimize protocol stacking'
    ],
    requirements: [
      {
        description: 'Multi-modal recovery system',
        verificationMethod: 'recovery_logs'
      },
      {
        description: 'Timing optimization',
        verificationMethod: 'timing_logs'
      },
      {
        description: 'Protocol integration',
        verificationMethod: 'protocol_logs'
      }
    ],
    expertIds: ['parsley'],
    implementationProtocol: {
      week1: 'Individual modality mastery',
      week2: 'Integration and timing',
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
      'Improved recovery scores',
      'Enhanced HRV trends',
      'Better sleep efficiency',
      'Reduced recovery time'
    ],
    expertTips: [
      '"Layer recovery modalities strategically" - Dr. Parsley',
      'Start with foundation techniques',
      'Progress based on response'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Sleep'
  },
  {
    id: 'sc17',
    name: 'Stress Resilience Protocol',
    tier: 2,
    duration: 21,
    description: 'Develop advanced stress management and resilience techniques that enhance recovery capacity. This challenge focuses on building sophisticated stress adaptation and management systems.',
    expertReference: 'Dan Pardi, PhD - Advanced stress resilience and recovery optimization',
    learningObjectives: [
      'Master stress response control',
      'Develop adaptation techniques',
      'Optimize recovery patterns'
    ],
    requirements: [
      {
        description: 'Advanced breathing protocols',
        verificationMethod: 'breathing_logs'
      },
      {
        description: 'HRV training progression',
        verificationMethod: 'hrv_logs'
      },
      {
        description: 'Stress response mapping',
        verificationMethod: 'stress_logs'
      }
    ],
    expertIds: ['pardi'],
    implementationProtocol: {
      week1: 'Response assessment and training',
      week2: 'Protocol advancement',
      week3: 'Integration mastery'
    },
    verificationMethods: [
      {
        type: 'stress_logs',
        description: 'Stress response verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Improved HRV baseline',
      'Enhanced stress tolerance',
      'Faster recovery rates',
      'Better performance stability'
    ],
    expertTips: [
      '"Build stress capacity systematically" - Dan Pardi',
      'Use progressive exposure',
      'Monitor recovery markers'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Sleep'
  },
  {
    id: 'sc18',
    name: 'Recovery Metric Mastery',
    tier: 2,
    duration: 21,
    description: 'Master the advanced analysis and interpretation of recovery metrics to optimize personal protocols. This challenge focuses on sophisticated data collection and analysis for maximum recovery enhancement.',
    expertReference: 'Dr. Kirk Parsley & Dan Pardi - Advanced recovery metrics and analysis',
    learningObjectives: [
      'Master complex data analysis',
      'Understand metric correlations',
      'Optimize protocol adjustments'
    ],
    requirements: [
      {
        description: 'Advanced metric tracking',
        verificationMethod: 'metric_logs'
      },
      {
        description: 'Data analysis protocol',
        verificationMethod: 'analysis_logs'
      },
      {
        description: 'Correlation mapping',
        verificationMethod: 'correlation_logs'
      }
    ],
    expertIds: ['parsley', 'pardi'],
    implementationProtocol: {
      week1: 'Advanced tracking setup',
      week2: 'Analysis system development',
      week3: 'Protocol refinement'
    },
    verificationMethods: [
      {
        type: 'metric_logs',
        description: 'Recovery metrics verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Data analysis proficiency',
      'Protocol optimization success',
      'Improved recovery trends',
      'Enhanced performance correlations'
    ],
    expertTips: [
      '"Let the data guide your protocols" - Dr. Parsley',
      'Focus on trend analysis',
      'Correlate multiple metrics'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Sleep'
  }
];