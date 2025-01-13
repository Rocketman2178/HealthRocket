import { sleepChallenges } from './sleepChallenges';
import { mindsetChallenges } from './mindsetChallenges';
import { nutritionChallenges } from './nutritionChallenges';
import { exerciseChallenges } from './exerciseChallenges';
import { biohackingChallenges } from './biohackingChallenges';
import { tier0Challenge as tier0 } from './tier0Challenge';
import type { Challenge } from '../../types/game';

// Export tier0Challenge separately
export const tier0Challenge = tier0;

// Export all challenges including Tier 0
export const challenges: Challenge[] = [
  tier0,
  ...sleepChallenges,
  ...mindsetChallenges,
  ...nutritionChallenges,
  ...exerciseChallenges,
  ...biohackingChallenges
];