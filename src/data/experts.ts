import type { Expert } from '../types/game';

export const experts: Record<string, Expert> = {
  // Mindset Category Experts
  dispenza: {
    id: 'dispenza',
    name: 'Dr. Joe Dispenza',
    expertise: ['Mental performance', 'neuroplasticity', 'meditation'],
    reference: 'Brain optimization and meditation practices'
  },
  hubermanMind: {
    id: 'hubermanMind',
    name: 'Dr. Andrew Huberman',
    expertise: ['Neuroscience', 'stress management', 'focus'],
    reference: 'Science-based protocols for mental performance'
  },
  robbins: {
    id: 'robbins',
    name: 'Tony Robbins',
    expertise: ['Peak performance psychology', 'emotional mastery'],
    reference: 'Mental strategies for high performers'
  },
  dweck: {
    id: 'dweck',
    name: 'Dr. Carol Dweck',
    expertise: ['Growth mindset research'],
    reference: 'Mindset development strategies'
  },
  harris: {
    id: 'harris',
    name: 'Sam Harris',
    expertise: ['Meditation', 'consciousness', 'rational thinking'],
    reference: 'Practical meditation techniques'
  },

  // Sleep Category Experts
  walker: {
    id: 'walker',
    name: 'Dr. Matthew Walker',
    expertise: ['Sleep science', 'sleep optimization'],
    reference: 'Sleep optimization protocols'
  },
  parsley: {
    id: 'parsley',
    name: 'Dr. Kirk Parsley',
    expertise: ['Sleep optimization', 'recovery'],
    reference: 'Sleep strategies for busy professionals'
  },
  breus: {
    id: 'breus',
    name: 'Dr. Michael Breus',
    expertise: ['Chronotypes', 'circadian biology'],
    reference: 'Sleep scheduling optimization'
  },
  pardi: {
    id: 'pardi',
    name: 'Dan Pardi, PhD',
    expertise: ['Sleep technology', 'recovery optimization'],
    reference: 'Sleep tracking and optimization'
  },
  kryger: {
    id: 'kryger',
    name: 'Dr. Meir Kryger',
    expertise: ['Sleep disorders', 'optimization'],
    reference: 'Sleep quality improvement'
  },

  // Exercise Category Experts
  attia: {
    id: 'attia',
    name: 'Dr. Peter Attia',
    expertise: ['Longevity', 'performance optimization'],
    reference: 'Evidence-based exercise protocols'
  },
  galpin: {
    id: 'galpin',
    name: 'Dr. Andy Galpin',
    expertise: ['Muscle physiology', 'performance'],
    reference: 'Research-backed strength methods'
  },
  lyon: {
    id: 'lyon',
    name: 'Dr. Gabrielle Lyon',
    expertise: ['Muscle-centric medicine'],
    reference: 'Strength optimization for longevity'
  },
  patrick: {
    id: 'patrick',
    name: 'Ben Patrick',
    expertise: ['Joint health', 'mobility'],
    reference: 'Injury prevention and mobility'
  },
  trufkin: {
    id: 'trufkin',
    name: 'Eugene Trufkin',
    expertise: ['Business leader fitness'],
    reference: 'Time-efficient training'
  },

  // Nutrition Category Experts
  means: {
    id: 'means',
    name: 'Dr. Casey Means',
    expertise: ['Metabolic health', 'CGM optimization'],
    reference: 'Glucose optimization and metabolic health'
  },
  hyman: {
    id: 'hyman',
    name: 'Dr. Mark Hyman',
    expertise: ['Functional medicine', 'nutrition'],
    reference: 'System optimization through nutrition'
  },
  patrick: {
    id: 'patrick',
    name: 'Dr. Rhonda Patrick',
    expertise: ['Nutrigenomics', 'supplementation'],
    reference: 'Research-based nutrition protocols'
  },
  gundry: {
    id: 'gundry',
    name: 'Dr. Steven Gundry',
    expertise: ['Longevity through nutrition'],
    reference: 'Anti-inflammatory nutrition'
  },
  kresser: {
    id: 'kresser',
    name: 'Chris Kresser',
    expertise: ['Functional medicine', 'nutrition'],
    reference: 'Evidence-based nutrition approach'
  },

  // Biohacking Category Experts
  asprey: {
    id: 'asprey',
    name: 'Dave Asprey',
    expertise: ['Biohacking', 'performance optimization'],
    reference: 'Cutting-edge optimization'
  },
  sinclair: {
    id: 'sinclair',
    name: 'Dr. David Sinclair',
    expertise: ['Longevity research'],
    reference: 'Aging optimization'
  },
  greenfield: {
    id: 'greenfield',
    name: 'Ben Greenfield',
    expertise: ['Performance optimization'],
    reference: 'Advanced biohacking'
  },
  maloof: {
    id: 'maloof',
    name: 'Dr. Molly Maloof',
    expertise: ['Health optimization medicine'],
    reference: 'Personalized medicine'
  },
  land: {
    id: 'land',
    name: 'Siim Land',
    expertise: ['Metabolic optimization'],
    reference: 'Performance enhancement'
  }
};