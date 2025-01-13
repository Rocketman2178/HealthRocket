export interface RocketColors {
  primary: string;
  accent: string;
  window: string;
}

export interface RocketEffects {
  glow: boolean;
  stars: boolean;
}

export type RocketDesign = 'basic' | 'advanced' | 'elite';

export interface RocketConfig {
  colors: RocketColors;
  effects: RocketEffects;
  design: RocketDesign;
  level: number;
}