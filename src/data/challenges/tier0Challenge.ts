import type { Challenge } from '../../types/game';

export const tier0Challenge: Challenge = {
  id: 'tc0',
  name: 'Morning Basics',
  tier: 0,
  duration: 21,
  description: 'Establish a simple but powerful morning routine that touches all five health categories: Mindset, Sleep, Nutrition, Exercise and Biohacking. (Unlocks Tier 1 Expert Challenges)',
  expertReference: 'The Health Rocket Team - Gamifying Health to Increase HealthSpan',
  learningObjectives: [
    'Establish morning routine fundamentals',
    'Build cross-category consistency',
    'Develop verification habits'
  ],
  requirements: [
    {
      description: 'Complete at least 3 morning actions daily',
      verificationMethod: 'daily_logs'
    },
    {
      description: 'Submit weekly verification posts',
      verificationMethod: 'verification_posts'
    },
    {
      description: 'Share challenge takeaways',
      verificationMethod: 'reflection_post'
    }
  ],
  implementationProtocol: {
    week1: 'Complete at least 3 daily actions within 2 hours of waking:\n- Mindset: 2-minute gratitude reflection\n- Sleep: Record total sleep time or sleep quality score\n- Exercise: 5-minute stretch\n- Nutrition: Glass of water\n- Biohacking: 5 minutes of morning sunlight exposure',
    week2: 'Continue daily actions and document sleep metrics',
    week3: 'Maintain routine and prepare challenge reflection'
  },
  verificationMethods: [
    {
      type: 'verification_posts',
      description: 'Week 1: Selfie with morning sunlight exposure\nWeek 2: Screenshot of weekly sleep score or time log\nWeek 3: Three takeaway thoughts from this Challenge',
      requiredFrequency: 'weekly'
    }
  ],
  successMetrics: [
    'Daily action completion rate >80%',
    'Weekly verification posts submitted',
    'Challenge reflection completed'
  ],
  expertTips: [
    'Start with the easiest actions first',
    'Stack habits by connecting them to existing routines',
    'Focus on consistency over perfection'
  ],
  fuelPoints: 50,
  status: 'available',
  category: 'Bonus'
};