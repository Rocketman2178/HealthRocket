import { sleepBoosts } from './sleepBoosts';
import { mindsetBoosts } from './mindsetBoosts';

// Combine all boosts into a single collection
export const boosts = [
  ...sleepBoosts,
  ...mindsetBoosts
];