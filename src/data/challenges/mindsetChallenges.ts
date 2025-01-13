import type { Challenge } from '../../types/game';

export const mindsetChallenges: Challenge[] = [
  {
    id: 'mc1',
    name: 'Focus Protocol Development',
    tier: 1,
    duration: 21,
    description: 'Establish a systematic approach to enhancing focus and cognitive performance through structured protocols and environmental optimization.',
    expertReference: 'Dr. Andrew Huberman - Focus enhancement and neural state optimization',
    learningObjectives: [
      'Understand focus mechanism',
      'Master attention control',
      'Develop sustained concentration'
    ],
    requirements: [
      {
        description: 'Daily focus blocks (starting at 25 minutes)',
        verificationMethod: 'focus_session_logs'
      },
      {
        description: 'Environment optimization',
        verificationMethod: 'environment_logs'
      }
    ],
    expertIds: ['hubermanMind'],
    implementationProtocol: {
      week1: 'Baseline assessment and setup',
      week2: 'Protocol refinement',
      week3: 'Advanced implementation'
    },
    verificationMethods: [
      {
        type: 'focus_session_logs',
        description: 'Focus tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Increased focus duration',
      'Reduced distractions',
      'Improved task completion'
    ],
    expertTips: [
      '"Focus is a skill that requires progressive training" - Dr. Huberman',
      'Start with shorter sessions',
      'Build systematic progression'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Mindset'
  },
  {
    id: 'mc2',
    name: 'Meditation Foundation',
    tier: 1,
    duration: 21,
    description: 'Build a solid foundation in mindfulness meditation practice, focusing on awareness, presence, and mental clarity.',
    expertReference: 'Sam Harris - Meditation fundamentals and awareness training',
    learningObjectives: [
      'Understand meditation basics',
      'Develop consistent practice',
      'Master basic techniques'
    ],
    requirements: [
      {
        description: 'Daily meditation practice',
        verificationMethod: 'meditation_logs'
      },
      {
        description: 'Progressive duration increase',
        verificationMethod: 'practice_logs'
      }
    ],
    expertIds: ['harris'],
    implementationProtocol: {
      week1: 'Basic technique introduction',
      week2: 'Practice stabilization',
      week3: 'Technique refinement'
    },
    verificationMethods: [
      {
        type: 'meditation_logs',
        description: 'Practice verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Practice consistency',
      'Duration increases',
      'Technique proficiency'
    ],
    expertTips: [
      '"Consistency matters more than duration" - Sam Harris',
      'Focus on quality over quantity',
      'Build systematic practice'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Mindset'
  },
  {
    id: 'mc3',
    name: 'Morning Mindset Protocol',
    tier: 1,
    duration: 21,
    description: 'Develop a comprehensive morning routine that sets up optimal mental states and emotional resilience for peak daily performance.',
    expertReference: 'Tony Robbins - Peak state activation and emotional mastery',
    learningObjectives: [
      'Master state management',
      'Develop morning discipline',
      'Create success patterns'
    ],
    requirements: [
      {
        description: 'Structured morning routine',
        verificationMethod: 'routine_logs'
      },
      {
        description: 'State priming exercises',
        verificationMethod: 'practice_logs'
      }
    ],
    expertIds: ['robbins'],
    implementationProtocol: {
      week1: 'Routine establishment',
      week2: 'State mastery',
      week3: 'Protocol optimization'
    },
    verificationMethods: [
      {
        type: 'routine_logs',
        description: 'Morning routine verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Routine adherence',
      'State improvement',
      'Energy optimization'
    ],
    expertTips: [
      '"Your morning creates your day" - Tony Robbins',
      'Start with basic components',
      'Build progressive complexity'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Mindset'
  },
  {
    id: 'mc4',
    name: 'State Change Mastery',
    tier: 1,
    duration: 21,
    description: 'Master rapid state change techniques for emotional control and peak performance access.',
    expertReference: 'Tony Robbins - Peak performance psychology and state control',
    learningObjectives: [
      'Understand state mechanics',
      'Master change techniques',
      'Develop state control'
    ],
    requirements: [
      {
        description: 'Daily state practices',
        verificationMethod: 'state_logs'
      },
      {
        description: 'Pattern interruption mastery',
        verificationMethod: 'practice_logs'
      }
    ],
    expertIds: ['robbins'],
    implementationProtocol: {
      week1: 'Technique learning',
      week2: 'Pattern mastery',
      week3: 'Advanced implementation'
    },
    verificationMethods: [
      {
        type: 'state_logs',
        description: 'State change verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Change speed improvement',
      'State stability increase',
      'Implementation success'
    ],
    expertTips: [
      '"State control is life control" - Tony Robbins',
      'Practice in various contexts',
      'Build reliable triggers'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Mindset'
  },
  {
    id: 'mc5',
    name: 'Emotional Integration',
    tier: 1,
    duration: 21,
    description: 'Develop advanced emotional awareness and integration techniques for enhanced resilience.',
    expertReference: 'Dr. Joe Dispenza - Advanced meditation and brain optimization',
    learningObjectives: [
      'Master emotional awareness',
      'Develop integration skills',
      'Build emotional resilience'
    ],
    requirements: [
      {
        description: 'Daily emotional check-ins',
        verificationMethod: 'emotion_logs'
      },
      {
        description: 'Integration practices',
        verificationMethod: 'practice_logs'
      }
    ],
    expertIds: ['dispenza'],
    implementationProtocol: {
      week1: 'Awareness building',
      week2: 'Integration practice',
      week3: 'Pattern optimization'
    },
    verificationMethods: [
      {
        type: 'emotion_logs',
        description: 'Emotional tracking verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Awareness improvement',
      'Integration success',
      'Resilience increase'
    ],
    expertTips: [
      '"Awareness precedes change" - Dr. Dispenza',
      'Track patterns consistently',
      'Build systematic response'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Mindset'
  },
  {
    id: 'mc6',
    name: 'Stress Response Protocol',
    tier: 1,
    duration: 21,
    description: 'Develop advanced stress management and response optimization techniques.',
    expertReference: 'Dr. Andrew Huberman - Stress management and neural adaptation',
    learningObjectives: [
      'Understand stress mechanics',
      'Master response protocols',
      'Build stress resilience'
    ],
    requirements: [
      {
        description: 'Daily stress practices',
        verificationMethod: 'stress_logs'
      },
      {
        description: 'Response optimization',
        verificationMethod: 'practice_logs'
      }
    ],
    expertIds: ['hubermanMind'],
    implementationProtocol: {
      week1: 'Protocol learning',
      week2: 'Response optimization',
      week3: 'System integration'
    },
    verificationMethods: [
      {
        type: 'stress_logs',
        description: 'Stress response verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Response improvement',
      'Recovery enhancement',
      'Protocol success'
    ],
    expertTips: [
      '"Stress response is trainable" - Dr. Huberman',
      'Build progressive exposure',
      'Track recovery metrics'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Mindset'
  },
  {
    id: 'mc7',
    name: 'Growth Challenge Protocol',
    tier: 1,
    duration: 21,
    description: 'Systematically develop and integrate growth mindset practices through structured challenges and reflection.',
    expertReference: 'Dr. Carol Dweck - Growth mindset development and optimization',
    learningObjectives: [
      'Master growth mindset principles',
      'Develop challenge response',
      'Build systematic resilience'
    ],
    requirements: [
      {
        description: 'Daily growth challenges',
        verificationMethod: 'challenge_logs'
      },
      {
        description: 'Response tracking',
        verificationMethod: 'practice_logs'
      }
    ],
    expertIds: ['dweck'],
    implementationProtocol: {
      week1: 'Mindset assessment',
      week2: 'Challenge integration',
      week3: 'Pattern optimization'
    },
    verificationMethods: [
      {
        type: 'challenge_logs',
        description: 'Growth challenge verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Challenge completion rate',
      'Response improvement',
      'Pattern development'
    ],
    expertTips: [
      '"Embrace challenges as growth opportunities" - Dr. Dweck',
      'Document learning processes',
      'Track pattern changes'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Mindset'
  },
  {
    id: 'mc8',
    name: 'Belief System Optimization',
    tier: 1,
    duration: 21,
    description: 'Develop and implement advanced belief system change protocols for enhanced performance.',
    expertReference: 'Dr. Joe Dispenza - Belief system transformation and neural rewiring',
    learningObjectives: [
      'Understand belief mechanics',
      'Master change protocols',
      'Implement new patterns'
    ],
    requirements: [
      {
        description: 'Daily practice sessions',
        verificationMethod: 'practice_logs'
      },
      {
        description: 'Belief tracking',
        verificationMethod: 'belief_logs'
      }
    ],
    expertIds: ['dispenza'],
    implementationProtocol: {
      week1: 'System assessment',
      week2: 'Protocol practice',
      week3: 'Integration mastery'
    },
    verificationMethods: [
      {
        type: 'belief_logs',
        description: 'Belief change verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Protocol adherence',
      'Pattern changes',
      'Implementation success'
    ],
    expertTips: [
      '"Change happens at the level of belief" - Dr. Dispenza',
      'Track systematic changes',
      'Build consistent practice'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Mindset'
  },
  {
    id: 'mc9',
    name: 'Learning Optimization',
    tier: 1,
    duration: 21,
    description: 'Master advanced learning strategies and optimization protocols for accelerated growth.',
    expertReference: 'Dr. Carol Dweck & Dr. Andrew Huberman - Learning optimization and cognitive enhancement',
    learningObjectives: [
      'Understand learning mechanics',
      'Develop optimization strategies',
      'Master implementation'
    ],
    requirements: [
      {
        description: 'Daily learning practices',
        verificationMethod: 'learning_logs'
      },
      {
        description: 'Strategy implementation',
        verificationMethod: 'practice_logs'
      }
    ],
    expertIds: ['dweck', 'hubermanMind'],
    implementationProtocol: {
      week1: 'Strategy development',
      week2: 'Implementation practice',
      week3: 'System optimization'
    },
    verificationMethods: [
      {
        type: 'learning_logs',
        description: 'Learning optimization verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Strategy implementation',
      'Learning efficiency',
      'Pattern development'
    ],
    expertTips: [
      '"Learning is a skill that can be optimized" - Dr. Huberman',
      'Focus on process improvement',
      'Track success patterns'
    ],
    fuelPoints: 50,
    status: 'available',
    category: 'Mindset'
  },
  {
    id: 'mc10',
    name: 'Elite Focus Protocol',
    tier: 2,
    duration: 21,
    description: 'Master advanced focus and cognitive performance protocols for elite mental output.',
    expertReference: 'Dr. Andrew Huberman - Advanced focus protocols and neural optimization',
    learningObjectives: [
      'Master deep work states',
      'Optimize cognitive performance',
      'Develop elite focus capacity'
    ],
    requirements: [
      {
        description: 'Advanced focus blocks (2-4 hours)',
        verificationMethod: 'focus_session_logs'
      },
      {
        description: 'Environment mastery',
        verificationMethod: 'environment_logs'
      }
    ],
    expertIds: ['hubermanMind'],
    implementationProtocol: {
      week1: 'Focus capacity baseline and neurological assessment',
      week2: 'Progressive deep work blocks with recovery optimization',
      week3: 'Flow state triggering and sustained performance protocol'
    },
    verificationMethods: [
      {
        type: 'focus_session_logs',
        description: 'Advanced focus verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Sustained deep work sessions (2-4 hours)',
      'Task completion speed increase (25%+)',
      'Cognitive stamina indicators (85%+ performance maintenance)'
    ],
    expertTips: [
      '"Elite focus requires systematic development" - Dr. Huberman',
      'Build progressive capacity',
      'Monitor recovery needs'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Mindset'
  },
  {
    id: 'mc11',
    name: 'Advanced Meditation Integration',
    tier: 2,
    duration: 21,
    description: 'Master advanced meditation techniques and state control for enhanced cognitive performance.',
    expertReference: 'Sam Harris - Advanced meditation and consciousness optimization',
    learningObjectives: [
      'Master advanced techniques',
      'Develop state control',
      'Optimize integration'
    ],
    requirements: [
      {
        description: 'Extended practice sessions',
        verificationMethod: 'meditation_logs'
      },
      {
        description: 'State manipulation',
        verificationMethod: 'state_logs'
      }
    ],
    expertIds: ['harris'],
    implementationProtocol: {
      week1: 'Technique advancement',
      week2: 'State development',
      week3: 'Full integration'
    },
    verificationMethods: [
      {
        type: 'meditation_logs',
        description: 'Advanced practice verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Technique mastery',
      'State control',
      'Integration success'
    ],
    expertTips: [
      '"Advanced practice requires systematic approach" - Sam Harris',
      'Build consistent foundation',
      'Track state changes'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Mindset'
  },
  {
    id: 'mc12',
    name: 'Cognitive Enhancement Stack',
    tier: 2,
    duration: 21,
    description: 'Develop and implement a comprehensive cognitive enhancement protocol combining multiple modalities.',
    expertReference: 'Dr. Andrew Huberman & Sam Harris - Advanced cognitive optimization',
    learningObjectives: [
      'Master protocol integration',
      'Optimize stack implementation',
      'Develop system mastery'
    ],
    requirements: [
      {
        description: 'Multiple modality integration',
        verificationMethod: 'stack_logs'
      },
      {
        description: 'Timing optimization',
        verificationMethod: 'performance_logs'
      }
    ],
    expertIds: ['hubermanMind', 'harris'],
    implementationProtocol: {
      week1: 'Individual modality testing and response mapping',
      week2: 'Synergistic combination trials and timing optimization',
      week3: 'Complete stack integration with performance metrics'
    },
    verificationMethods: [
      {
        type: 'stack_logs',
        description: 'Stack implementation verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Stack optimization',
      'Performance enhancement',
      'System integration'
    ],
    expertTips: [
      '"Stack development requires careful monitoring" - Dr. Huberman',
      'Build progressive complexity',
      'Track all variables'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Mindset'
  },
  {
    id: 'mc13',
    name: 'Advanced State Mastery',
    tier: 2,
    duration: 21,
    description: 'Master elite-level emotional state control and rapid state change protocols for peak performance access.',
    expertReference: 'Tony Robbins - Advanced state control and performance psychology',
    learningObjectives: [
      'Master instant state change',
      'Develop state stacking',
      'Create reliable anchors'
    ],
    requirements: [
      {
        description: 'Multiple state mastery',
        verificationMethod: 'state_logs'
      },
      {
        description: 'Rapid change protocols',
        verificationMethod: 'performance_logs'
      }
    ],
    expertIds: ['robbins'],
    implementationProtocol: {
      week1: 'Protocol mastery',
      week2: 'Stack development',
      week3: 'Full integration'
    },
    verificationMethods: [
      {
        type: 'state_logs',
        description: 'State change verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Change speed (<30 seconds)',
      'State stability (>30 minutes)',
      'Stack effectiveness'
    ],
    expertTips: [
      '"Elite performance requires instant state access" - Tony Robbins',
      'Build reliable triggers',
      'Practice in varied conditions'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Mindset'
  },
  {
    id: 'mc14',
    name: 'Emotional Intelligence Optimization',
    tier: 2,
    duration: 21,
    description: 'Develop advanced emotional intelligence and response optimization protocols for elite performance states.',
    expertReference: 'Dr. Joe Dispenza - Advanced emotional mastery and neural integration',
    learningObjectives: [
      'Master emotional reading',
      'Develop response control',
      'Optimize social dynamics'
    ],
    requirements: [
      {
        description: 'Advanced EQ practices',
        verificationMethod: 'eq_logs'
      },
      {
        description: 'Response optimization',
        verificationMethod: 'response_logs'
      }
    ],
    expertIds: ['dispenza'],
    implementationProtocol: {
      week1: 'Assessment mastery',
      week2: 'Response development',
      week3: 'Social integration'
    },
    verificationMethods: [
      {
        type: 'eq_logs',
        description: 'EQ optimization verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Reading accuracy',
      'Response optimization',
      'Social effectiveness'
    ],
    expertTips: [
      '"Emotional mastery is pattern recognition" - Dr. Dispenza',
      'Track subtle signals',
      'Build response libraries'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Mindset'
  },
  {
    id: 'mc15',
    name: 'Peak State Integration',
    tier: 2,
    duration: 21,
    description: 'Create and implement comprehensive peak state access and maintenance protocols for sustained elite performance.',
    expertReference: 'Tony Robbins & Dr. Joe Dispenza - Advanced state integration',
    learningObjectives: [
      'Master state stacking',
      'Develop maintenance protocols',
      'Create access systems'
    ],
    requirements: [
      {
        description: 'Peak state mapping',
        verificationMethod: 'state_logs'
      },
      {
        description: 'Access protocol development',
        verificationMethod: 'protocol_logs'
      }
    ],
    expertIds: ['robbins', 'dispenza'],
    implementationProtocol: {
      week1: 'State development',
      week2: 'Access mastery',
      week3: 'System integration'
    },
    verificationMethods: [
      {
        type: 'state_logs',
        description: 'Peak state verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Access reliability',
      'State maintenance',
      'Performance impact'
    ],
    expertTips: [
      '"Peak states require systematic development" - Tony Robbins',
      'Build progressive access',
      'Monitor energy management'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Mindset'
  },
  {
    id: 'mc16',
    name: 'Elite Performance Protocol',
    tier: 2,
    duration: 21,
    description: 'Create and implement a comprehensive peak performance system integrating cognitive, emotional, and state optimization protocols.',
    expertReference: 'Dr. Andrew Huberman & Tony Robbins - Elite performance integration',
    learningObjectives: [
      'Master system integration',
      'Optimize performance timing',
      'Develop maintenance protocols'
    ],
    requirements: [
      {
        description: 'Multiple system integration',
        verificationMethod: 'system_logs'
      },
      {
        description: 'Performance tracking',
        verificationMethod: 'performance_logs'
      }
    ],
    expertIds: ['hubermanMind', 'robbins'],
    implementationProtocol: {
      week1: 'System development',
      week2: 'Integration mastery',
      week3: 'Performance optimization'
    },
    verificationMethods: [
      {
        type: 'system_logs',
        description: 'System integration verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'System reliability',
      'Performance enhancement',
      'Recovery efficiency'
    ],
    expertTips: [
      '"Elite performance requires complete integration" - Dr. Huberman',
      'Monitor all variables',
      'Track recovery needs'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Mindset'
  },
  {
    id: 'mc17',
    name: 'Advanced Integration Mastery',
    tier: 2,
    duration: 21,
    description: 'Master the integration of advanced cognitive, emotional, and spiritual practices for comprehensive performance enhancement.',
    expertReference: 'Dr. Joe Dispenza & Sam Harris - Advanced practice integration',
    learningObjectives: [
      'Master practice integration',
      'Develop synergy protocols',
      'Optimize implementation'
    ],
    requirements: [
      {
        description: 'Multiple practice integration',
        verificationMethod: 'practice_logs'
      },
      {
        description: 'Synergy development',
        verificationMethod: 'synergy_logs'
      }
    ],
    expertIds: ['dispenza', 'harris'],
    implementationProtocol: {
      week1: 'Practice combination',
      week2: 'Synergy development',
      week3: 'System mastery'
    },
    verificationMethods: [
      {
        type: 'practice_logs',
        description: 'Integration verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'Practice integration',
      'Synergy development',
      'Implementation success'
    ],
    expertTips: [
      '"Integration requires systematic approach" - Dr. Dispenza',
      'Build progressive complexity',
      'Monitor energy balance'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Mindset'
  },
  {
    id: 'mc18',
    name: 'Complete System Optimization',
    tier: 2,
    duration: 21,
    description: 'Develop and implement a fully optimized system integrating all aspects of mental mastery for peak performance.',
    expertReference: 'Dr. Andrew Huberman & Tony Robbins - Complete system optimization',
    learningObjectives: [
      'Master system design',
      'Optimize implementation',
      'Develop maintenance'
    ],
    requirements: [
      {
        description: 'Complete system integration',
        verificationMethod: 'system_logs'
      },
      {
        description: 'Optimization protocols',
        verificationMethod: 'protocol_logs'
      }
    ],
    expertIds: ['hubermanMind', 'robbins'],
    implementationProtocol: {
      week1: 'System integration',
      week2: 'Optimization practice',
      week3: 'Maintenance mastery'
    },
    verificationMethods: [
      {
        type: 'system_logs',
        description: 'System optimization verification',
        requiredFrequency: 'daily'
      }
    ],
    successMetrics: [
      'System reliability',
      'Performance optimization',
      'Maintenance success'
    ],
    expertTips: [
      '"System optimization requires both structure and flexibility" - Dr. Huberman',
      'Monitor all components',
      'Maintain recovery focus'
    ],
    fuelPoints: 100,
    status: 'locked',
    category: 'Mindset'
  }
];