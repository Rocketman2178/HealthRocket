import { Brain, Moon, Activity, Apple, Database } from 'lucide-react';
import type { HealthCategory } from '../types/health';

export const HEALTH_CATEGORIES: HealthCategory[] = [
  {
    id: "mindset",
    name: "Mindset",
    subtitle: "Mental Resilience & Cognitive Performance",
    description: "The Mindset category focuses on optimizing your mental performance and emotional well-being. It encompasses meditation, stress management, focus training, and cognitive enhancement practices.",
    keyComponents: [
      "Meditation and mindfulness practices",
      "Stress management techniques",
      "Focus and concentration training",
      "Cognitive performance optimization",
      "Emotional resilience building",
      "Mental recovery protocols",
      "Peak performance psychology",
      "Flow state activation"
    ],
    icon: Brain,
    score: 8.2,
    trend: '+0.3'
  },
  {
    id: "sleep",
    name: "Sleep",
    subtitle: "Recovery Optimization & Circadian Enhancement",
    description: "The Sleep category is dedicated to maximizing your body's natural recovery processes through optimal sleep patterns and circadian rhythm alignment.",
    keyComponents: [
      "Sleep cycle optimization",
      "Circadian rhythm alignment",
      "Recovery protocol development",
      "Deep sleep enhancement",
      "REM sleep optimization",
      "Sleep environment design",
      "Evening wind-down routines",
      "Morning activation protocols"
    ],
    icon: Moon,
    score: 7.5,
    trend: '+0.5'
  },
  {
    id: "exercise",
    name: "Exercise",
    subtitle: "Physical Performance & Longevity Training",
    description: "The Exercise category integrates both high-intensity performance training and longevity-focused movement protocols.",
    keyComponents: [
      "Strength and conditioning",
      "Cardiovascular optimization",
      "Mobility and flexibility work",
      "Recovery protocols",
      "Movement pattern optimization",
      "Performance tracking",
      "Injury prevention",
      "Functional fitness development"
    ],
    icon: Activity,
    score: 8.0,
    trend: '+0.2'
  },
  {
    id: "nutrition",
    name: "Nutrition",
    subtitle: "Metabolic Optimization & Precision Fueling",
    description: "The Nutrition category focuses on optimizing your body's fuel utilization through strategic nutrition protocols.",
    keyComponents: [
      "Macronutrient optimization",
      "Micronutrient protocols",
      "Meal timing strategies",
      "Metabolic flexibility",
      "Strategic supplementation",
      "Hydration optimization",
      "Gut health protocols",
      "Performance fueling"
    ],
    icon: Apple,
    score: 7.2,
    trend: '+0.4'
  },
  {
    id: "biohacking",
    name: "Biohacking",
    subtitle: "Health Optimization & Performance Technology",
    description: "The Biohacking category represents the intersection of technology and biological optimization.",
    keyComponents: [
      "Biomarker tracking and analysis",
      "Recovery technology utilization",
      "Sleep optimization tools",
      "Heart rate variability (HRV) monitoring",
      "Continuous glucose monitoring",
      "Red light therapy",
      "Cold/heat exposure protocols",
      "Advanced performance metrics"
    ],
    icon: Database,
    score: 7.8,
    trend: '+0.6'
  }
];