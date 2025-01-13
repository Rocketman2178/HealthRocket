import type { Challenge } from '../../types/game';

export const exerciseChallenges: Challenge[] = [
  // Tier 1 Challenges
  {
    id: 'ec1',
    name: 'Movement Pattern Mastery',
    tier: 1,
    duration: 21,
    description: 'Master fundamental movement patterns for optimal joint health and performance.',
    expertReference: 'Ben Patrick - Movement pattern optimization and joint health',
    learningObjectives: [
      'Understand movement mechanics',
      'Master basic patterns',
      'Develop joint control'
    ],
    requirements: [
      {
        description: 'Daily movement practice',
        verificationMethod: 'movement_logs'
      },
      {
        description: 'Pattern progression',
        verificationMethod: 'pattern_logs'
      },
      {
        description: 'Joint preparation',
        verificationMethod: 'joint_logs'
      }
    ],
    expertIds: ['patrick'],
    implementationProtocol: {
      week1: 'Movement assessment and baseline',
      week2: 'Pattern development and control',
      week3: 'Integration and flow mastery'
    },
    verificationMethods: [
      {
        type: 'movement_logs',
        description: 'Movement pattern verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Movement quality score >85%',
      'Joint mobility improvements',
      'Pattern mastery assessment'
    ],
    expertTips: [
      '"Quality movement precedes loading" - Ben Patrick',
      'Focus on control before speed',
      'Build systematic progression'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Exercise'
  },
  {
    id: 'ec2',
    name: 'Joint Health Protocol',
    tier: 1,
    duration: 21,
    description: 'Develop comprehensive joint health through strategic mobility and stability work.',
    expertReference: 'Ben Patrick - Joint health optimization and mobility development',
    learningObjectives: [
      'Master joint preparation',
      'Optimize mobility work',
      'Develop stability systems'
    ],
    requirements: [
      {
        description: 'Daily joint preparation',
        verificationMethod: 'joint_logs'
      },
      {
        description: 'Progressive mobility',
        verificationMethod: 'mobility_logs'
      },
      {
        description: 'Stability training',
        verificationMethod: 'stability_logs'
      }
    ],
    expertIds: ['patrick'],
    implementationProtocol: {
      week1: 'Joint assessment and baseline',
      week2: 'Mobility progression',
      week3: 'Stability integration'
    },
    verificationMethods: [
      {
        type: 'joint_logs',
        description: 'Joint health verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Mobility improvements >30%',
      'Stability test scores',
      'Pain reduction metrics'
    ],
    expertTips: [
      '"Preparation enables performance" - Ben Patrick',
      'Progress gradually',
      'Monitor joint feedback'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Exercise'
  },
  {
    id: 'ec3',
    name: 'Basic Strength Foundation',
    tier: 1,
    duration: 21,
    description: 'Establish foundational strength practices through proper movement patterns.',
    expertReference: 'Dr. Andy Galpin - Foundational strength development and movement mastery',
    learningObjectives: [
      'Master basic lifts',
      'Develop movement quality',
      'Build strength foundation'
    ],
    requirements: [
      {
        description: 'Pattern practice',
        verificationMethod: 'pattern_logs'
      },
      {
        description: 'Progressive loading',
        verificationMethod: 'loading_logs'
      },
      {
        description: 'Form mastery',
        verificationMethod: 'form_logs'
      }
    ],
    expertIds: ['galpin'],
    implementationProtocol: {
      week1: 'Movement pattern mastery',
      week2: 'Loading progression',
      week3: 'Integration practice'
    },
    verificationMethods: [
      {
        type: 'strength_logs',
        description: 'Strength development verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Form mastery score >90%',
      'Strength progression rate',
      'Recovery optimization'
    ],
    expertTips: [
      '"Form mastery enables progress" - Dr. Galpin',
      'Build systematic loading',
      'Monitor recovery capacity'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Exercise'
  },
  {
    id: 'ec4',
    name: 'Zone 2 Foundation',
    tier: 1,
    duration: 21,
    description: 'Establish foundational aerobic capacity through structured Zone 2 training.',
    expertReference: 'Dr. Peter Attia - Zone 2 training and metabolic health optimization',
    learningObjectives: [
      'Understand zone training',
      'Master intensity control',
      'Develop aerobic base'
    ],
    requirements: [
      {
        description: 'Heart rate monitoring',
        verificationMethod: 'hr_logs'
      },
      {
        description: 'Zone adherence',
        verificationMethod: 'zone_logs'
      },
      {
        description: 'Duration progression',
        verificationMethod: 'duration_logs'
      }
    ],
    expertIds: ['attia'],
    implementationProtocol: {
      week1: 'Zone identification and baseline',
      week2: 'Duration development',
      week3: 'Protocol optimization'
    },
    verificationMethods: [
      {
        type: 'zone2_logs',
        description: 'Zone 2 training verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Zone accuracy >90%',
      'Duration targets met',
      'Recovery optimization'
    ],
    expertTips: [
      '"Zone 2 builds the engine" - Dr. Attia',
      'Focus on consistency',
      'Monitor recovery needs'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Exercise'
  },
  {
    id: 'ec5',
    name: 'Strength Development Protocol',
    tier: 1,
    duration: 21,
    description: 'Build foundational strength through progressive loading and movement mastery.',
    expertReference: 'Dr. Andy Galpin - Progressive strength development and movement optimization',
    learningObjectives: [
      'Master loading progression',
      'Optimize movement patterns',
      'Develop strength base'
    ],
    requirements: [
      {
        description: 'Progressive overload',
        verificationMethod: 'loading_logs'
      },
      {
        description: 'Form maintenance',
        verificationMethod: 'form_logs'
      },
      {
        description: 'Recovery management',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['galpin'],
    implementationProtocol: {
      week1: 'Movement mastery',
      week2: 'Loading strategy',
      week3: 'Integration mastery'
    },
    verificationMethods: [
      {
        type: 'strength_logs',
        description: 'Strength development verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Form maintenance >90%',
      'Strength progression',
      'Recovery optimization'
    ],
    expertTips: [
      '"Quality enables quantity" - Dr. Galpin',
      'Progress systematically',
      'Monitor fatigue signals'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Exercise'
  },
  {
    id: 'ec6',
    name: 'Power Integration',
    tier: 1,
    duration: 21,
    description: 'Develop basic power output through progressive movement integration.',
    expertReference: 'Dr. Andy Galpin - Power development and movement integration',
    learningObjectives: [
      'Master power mechanics',
      'Develop explosiveness',
      'Build systematic progression'
    ],
    requirements: [
      {
        description: 'Movement progression',
        verificationMethod: 'movement_logs'
      },
      {
        description: 'Power development',
        verificationMethod: 'power_logs'
      },
      {
        description: 'Technical mastery',
        verificationMethod: 'tech_logs'
      }
    ],
    expertIds: ['galpin'],
    implementationProtocol: {
      week1: 'Technical foundation',
      week2: 'Power development',
      week3: 'Integration mastery'
    },
    verificationMethods: [
      {
        type: 'power_logs',
        description: 'Power development verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Technical mastery >90%',
      'Power development',
      'Recovery optimization'
    ],
    expertTips: [
      '"Power requires precision" - Dr. Galpin',
      'Build progressive complexity',
      'Monitor fatigue levels'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Exercise'
  },
  {
    id: 'ec7',
    name: 'Recovery Pattern Development',
    tier: 1,
    duration: 21,
    description: 'Establish optimal recovery patterns through systematic monitoring and adjustment.',
    expertReference: 'Dr. Peter Attia - Recovery pattern optimization and monitoring',
    learningObjectives: [
      'Master recovery monitoring',
      'Optimize sleep integration',
      'Develop recovery protocols'
    ],
    requirements: [
      {
        description: 'Daily recovery tracking',
        verificationMethod: 'recovery_logs'
      },
      {
        description: 'Sleep optimization',
        verificationMethod: 'sleep_logs'
      },
      {
        description: 'Load management',
        verificationMethod: 'load_logs'
      }
    ],
    expertIds: ['attia'],
    implementationProtocol: {
      week1: 'Recovery assessment',
      week2: 'Protocol development',
      week3: 'System optimization'
    },
    verificationMethods: [
      {
        type: 'recovery_logs',
        description: 'Recovery pattern verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Recovery scores >85%',
      'Sleep quality metrics',
      'Load management optimization'
    ],
    expertTips: [
      '"Recovery enables progression" - Dr. Attia',
      'Monitor all variables',
      'Track adaptation signs'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Exercise'
  },
  {
    id: 'ec8',
    name: 'Muscle Recovery Protocol',
    tier: 1,
    duration: 21,
    description: 'Optimize muscle recovery through strategic nutrition and loading patterns.',
    expertReference: 'Dr. Gabrielle Lyon - Muscle recovery optimization and nutrition timing',
    learningObjectives: [
      'Master recovery nutrition',
      'Optimize loading patterns',
      'Develop monitoring systems'
    ],
    requirements: [
      {
        description: 'Nutrition timing',
        verificationMethod: 'nutrition_logs'
      },
      {
        description: 'Load management',
        verificationMethod: 'load_logs'
      },
      {
        description: 'Recovery tracking',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['lyon'],
    implementationProtocol: {
      week1: 'Baseline assessment',
      week2: 'Protocol optimization',
      week3: 'System integration'
    },
    verificationMethods: [
      {
        type: 'muscle_recovery_logs',
        description: 'Muscle recovery verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Recovery optimization',
      'Loading pattern effectiveness',
      'Nutrition timing accuracy'
    ],
    expertTips: [
      '"Recovery nutrition drives adaptation" - Dr. Lyon',
      'Time nutrients strategically',
      'Monitor recovery markers'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Exercise'
  },
  {
    id: 'ec9',
    name: 'Work-Life Integration',
    tier: 1,
    duration: 21,
    description: 'Develop sustainable training patterns that integrate with professional demands.',
    expertReference: 'Eugene Trufkin - Training optimization for business professionals',
    learningObjectives: [
      'Master time efficiency',
      'Optimize energy management',
      'Develop sustainable patterns'
    ],
    requirements: [
      {
        description: 'Schedule optimization',
        verificationMethod: 'schedule_logs'
      },
      {
        description: 'Energy management',
        verificationMethod: 'energy_logs'
      },
      {
        description: 'Recovery integration',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['trufkin'],
    implementationProtocol: {
      week1: 'Schedule mapping',
      week2: 'Energy optimization',
      week3: 'Pattern integration'
    },
    verificationMethods: [
      {
        type: 'integration_logs',
        description: 'Work-life integration verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Schedule optimization',
      'Energy management',
      'Pattern sustainability'
    ],
    expertTips: [
      '"Sustainability drives success" - Eugene Trufkin',
      'Focus on efficiency',
      'Monitor energy patterns'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Exercise'
  },
  // Tier 2 Challenges
  {
    id: 'ec10',
    name: 'Elite Movement Integration',
    tier: 2,
    duration: 21,
    description: 'Master advanced movement patterns and integrated control systems.',
    expertReference: 'Ben Patrick - Advanced movement integration and control mastery',
    learningObjectives: [
      'Master complex patterns',
      'Develop integrated control',
      'Optimize movement quality'
    ],
    requirements: [
      {
        description: 'Advanced pattern practice',
        verificationMethod: 'pattern_logs'
      },
      {
        description: 'Integration protocols',
        verificationMethod: 'integration_logs'
      },
      {
        description: 'Control development',
        verificationMethod: 'control_logs'
      }
    ],
    expertIds: ['patrick'],
    implementationProtocol: {
      week1: 'Pattern assessment',
      week2: 'Integration development',
      week3: 'Control mastery'
    },
    verificationMethods: [
      {
        type: 'movement_logs',
        description: 'Movement integration verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Pattern mastery >95%',
      'Control development',
      'Integration success'
    ],
    expertTips: [
      '"Integration enables mastery" - Ben Patrick',
      'Build systematic control',
      'Monitor movement quality'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Exercise'
  },
  {
    id: 'ec11',
    name: 'Advanced Joint Development',
    tier: 2,
    duration: 21,
    description: 'Optimize joint health through advanced mobility and stability protocols.',
    expertReference: 'Ben Patrick - Advanced joint health and mobility optimization',
    learningObjectives: [
      'Master joint mechanics',
      'Optimize tissue quality',
      'Develop advanced control'
    ],
    requirements: [
      {
        description: 'Advanced mobility work',
        verificationMethod: 'mobility_logs'
      },
      {
        description: 'Stability protocols',
        verificationMethod: 'stability_logs'
      },
      {
        description: 'Tissue preparation',
        verificationMethod: 'tissue_logs'
      }
    ],
    expertIds: ['patrick'],
    implementationProtocol: {
      week1: 'Joint assessment',
      week2: 'Protocol advancement',
      week3: 'Integration mastery'
    },
    verificationMethods: [
      {
        type: 'joint_logs',
        description: 'Joint development verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Joint mobility >95%',
      'Stability mastery',
      'Control development'
    ],
    expertTips: [
      '"Joint health enables performance" - Ben Patrick',
      'Progress systematically',
      'Monitor tissue response'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Exercise'
  },
  {
    id: 'ec12',
    name: 'Movement System Integration',
    tier: 2,
    duration: 21,
    description: 'Create and implement comprehensive movement optimization systems.',
    expertReference: 'Dr. Andy Galpin - Advanced movement system integration',
    learningObjectives: [
      'Master system design',
      'Optimize integration',
      'Develop maintenance'
    ],
    requirements: [
      {
        description: 'System development',
        verificationMethod: 'system_logs'
      },
      {
        description: 'Integration protocols',
        verificationMethod: 'integration_logs'
      },
      {
        description: 'Maintenance strategies',
        verificationMethod: 'maintenance_logs'
      }
    ],
    expertIds: ['galpin'],
    implementationProtocol: {
      week1: 'System design',
      week2: 'Integration development',
      week3: 'Maintenance mastery'
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
      'Maintenance optimization'
    ],
    expertTips: [
      '"Systems enable excellence" - Dr. Galpin',
      'Build comprehensive protocols',
      'Monitor all variables'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Exercise'
  },
  {
    id: 'ec13',
    name: 'Advanced Strength Protocol',
    tier: 2,
    duration: 21,
    description: 'Master advanced strength development through integrated protocols.',
    expertReference: 'Dr. Andy Galpin - Advanced strength development and integration',
    learningObjectives: [
      'Master loading strategies',
      'Optimize force production',
      'Develop advanced protocols'
    ],
    requirements: [
      {
        description: 'Advanced loading',
        verificationMethod: 'loading_logs'
      },
      {
        description: 'Force optimization',
        verificationMethod: 'force_logs'
      },
      {
        description: 'Recovery integration',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['galpin'],
    implementationProtocol: {
      week1: 'Protocol development',
      week2: 'Loading optimization',
      week3: 'System mastery'
    },
    verificationMethods: [
      {
        type: 'strength_logs',
        description: 'Strength protocol verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Force development',
      'Loading optimization',
      'Recovery efficiency'
    ],
    expertTips: [
      '"Force development requires precision" - Dr. Galpin',
      'Progress systematically',
      'Monitor fatigue markers'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Exercise'
  },
  {
    id: 'ec14',
    name: 'Zone Integration Protocol',
    tier: 2,
    duration: 21,
    description: 'Master advanced zone training and metabolic optimization.',
    expertReference: 'Dr. Peter Attia - Advanced zone training and metabolic optimization',
    learningObjectives: [
      'Master zone transitions',
      'Optimize energy systems',
      'Develop metabolic efficiency'
    ],
    requirements: [
      {
        description: 'Zone progression',
        verificationMethod: 'zone_logs'
      },
      {
        description: 'System integration',
        verificationMethod: 'system_logs'
      },
      {
        description: 'Recovery management',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['attia'],
    implementationProtocol: {
      week1: 'Zone assessment',
      week2: 'System integration',
      week3: 'Protocol mastery'
    },
    verificationMethods: [
      {
        type: 'zone_logs',
        description: 'Zone integration verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Zone mastery',
      'System integration',
      'Recovery optimization'
    ],
    expertTips: [
      '"Zone mastery enables adaptation" - Dr. Attia',
      'Build systematic progression',
      'Monitor recovery needs'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Exercise'
  },
  {
    id: 'ec15',
    name: 'Performance Integration Protocol',
    tier: 2,
    duration: 21,
    description: 'Create and implement comprehensive performance optimization systems.',
    expertReference: 'Dr. Andy Galpin - Advanced performance system integration',
    learningObjectives: [
      'Master system integration',
      'Optimize performance',
      'Develop maintenance'
    ],
    requirements: [
      {
        description: 'System development',
        verificationMethod: 'system_logs'
      },
      {
        description: 'Performance tracking',
        verificationMethod: 'performance_logs'
      },
      {
        description: 'Recovery integration',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['galpin'],
    implementationProtocol: {
      week1: 'System design',
      week2: 'Integration optimization',
      week3: 'Protocol mastery'
    },
    verificationMethods: [
      {
        type: 'performance_logs',
        description: 'Performance integration verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'System effectiveness',
      'Integration success',
      'Performance optimization'
    ],
    expertTips: [
      '"Integration drives performance" - Dr. Galpin',
      'Monitor all variables',
      'Track adaptation signs'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Exercise'
  },
  {
    id: 'ec16',
    name: 'Advanced Recovery Protocol',
    tier: 2,
    duration: 21,
    description: 'Master advanced recovery systems and optimization protocols.',
    expertReference: 'Dr. Peter Attia - Advanced recovery system optimization',
    learningObjectives: [
      'Master recovery systems',
      'Optimize protocols',
      'Develop maintenance'
    ],
    requirements: [
      {
        description: 'System development',
        verificationMethod: 'system_logs'
      },
      {
        description: 'Protocol optimization',
        verificationMethod: 'protocol_logs'
      },
      {
        description: 'Recovery tracking',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['attia'],
    implementationProtocol: {
      week1: 'System assessment',
      week2: 'Protocol optimization',
      week3: 'Integration mastery'
    },
    verificationMethods: [
      {
        type: 'recovery_logs',
        description: 'Recovery protocol verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Recovery optimization',
      'Protocol effectiveness',
      'Integration success'
    ],
    expertTips: [
      '"Recovery mastery enables progression" - Dr. Attia',
      'Monitor all variables',
      'Track adaptation signs'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Exercise'
  },
  {
    id: 'ec17',
    name: 'Muscle Recovery Mastery',
    tier: 2,
    duration: 21,
    description: 'Optimize muscle recovery through advanced protocols and systems.',
    expertReference: 'Dr. Gabrielle Lyon - Advanced muscle recovery optimization',
    learningObjectives: [
      'Master recovery nutrition',
      'Optimize loading patterns',
      'Develop monitoring systems'
    ],
    requirements: [
      {
        description: 'Advanced nutrition timing',
        verificationMethod: 'nutrition_logs'
      },
      {
        description: 'Loading optimization',
        verificationMethod: 'loading_logs'
      },
      {
        description: 'Recovery tracking',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['lyon'],
    implementationProtocol: {
      week1: 'Protocol assessment',
      week2: 'System optimization',
      week3: 'Integration mastery'
    },
    verificationMethods: [
      {
        type: 'muscle_recovery_logs',
        description: 'Muscle recovery verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Recovery optimization',
      'Loading effectiveness',
      'System integration'
    ],
    expertTips: [
      '"Nutrition drives recovery" - Dr. Lyon',
      'Monitor all variables',
      'Track adaptation patterns'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Exercise'
  },
  {
    id: 'ec18',
    name: 'Complete System Integration',
    tier: 2,
    duration: 21,
    description: 'Create and implement fully optimized recovery systems.',
    expertReference: 'Dr. Peter Attia - Complete system optimization and integration', learningObjectives: [
      'Master system design',
      'Optimize integration',
      'Develop maintenance'
    ],
    requirements: [
      {
        description: 'System development',
        verificationMethod: 'system_logs'
      },
      {
        description: 'Integration protocols',
        verificationMethod: 'protocol_logs'
      },
      {
        description: 'Recovery tracking',
        verificationMethod: 'recovery_logs'
      }
    ],
    expertIds: ['attia'],
    implementationProtocol: {
      week1: 'System design',
      week2: 'Integration optimization',
      week3: 'Protocol mastery'
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
      'Protocol optimization'
    ],
    expertTips: [
      '"Systems enable mastery" - Dr. Attia',
      'Monitor all variables',
      'Track adaptation signs'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Exercise'
  }
];