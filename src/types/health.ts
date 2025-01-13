import { LucideIcon } from 'lucide-react';

export interface HealthCategory {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  keyComponents: string[];
  icon: LucideIcon;
  score: number;
  trend: string;
}

export interface HealthAssessment {
  id: string;
  user_id: string;
  created_at: string;
  expected_lifespan: number;
  expected_healthspan: number;
  health_score: number;
  healthspan_years: number;
  previous_healthspan: number;
  mindset_score: number;
  sleep_score: number;
  exercise_score: number;
  nutrition_score: number;
  biohacking_score: number;
}

export interface HealthMetric {
  category: HealthCategory;
  isExpanded: boolean;
}