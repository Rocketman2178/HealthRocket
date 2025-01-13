import { sleepQuests } from './sleepQuests';
import { mindsetQuests } from './mindsetQuests';
import { nutritionQuests } from './nutritionQuests';
import { exerciseQuests } from './exerciseQuests';
import { biohackingQuests } from './biohackingQuests';

// Combine all quests into a single collection
export const quests = [
  ...sleepQuests,
  ...mindsetQuests,
  ...nutritionQuests,
  ...exerciseQuests,
  ...biohackingQuests
];