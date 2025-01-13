import { useState, useEffect } from 'react';
import { GuideService, GuideMessage } from '../lib/guide/GuideService';
import { useSupabase } from '../contexts/SupabaseContext';

export function useGuideChat() {
  const [messages, setMessages] = useState<GuideMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useSupabase();

  // Load initial messages
  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        setMessages([]); // Start fresh each time
        setInitialized(true);
      } catch (err) {
        console.error('Error loading messages:', err);
        setError(err instanceof Error ? err : new Error('Failed to load messages'));
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [user]);

  const resetChat = () => {
    setMessages([]);
    setInitialized(false);
  };

  const sendMessage = async (message: string, category?: string) => {
    if (!user) return;

    const getGuideResponse = (userMessage: string) => {
      // Map user messages to appropriate guide responses
      const responses: Record<string, string> = {
        'I\'d like to learn about playing the game, earning Fuel Points, and winning prizes.':
          "Great! Let me explain the key ways to progress and earn rewards:\n\n" +
          "1. Fuel Points (FP)\n" +
          "• Complete Daily Boosts: FP varies by tier (1-9 FP)\n" +
          "• Maintain Burn Streaks: Bonus FP at 3, 7, and 21 days\n" +
          "• Finish Challenges: 50+ FP\n" +
          "• Complete Quests: 150+ FP\n" +
          "• Update Health Assessment: 10% of next level FP\n\n" +
          "2. Prizes & Leaderboard\n" +
          "• Hero Status (Top 50%): 2X Prize Pool Multiplier\n" +
          "• Legend Status (Top 10%): 5X Prize Pool Multiplier\n" +
          "• Pro Plan members eligible for monthly prizes\n\n" +
          "Would you like to learn more about Daily Boosts, Challenges, or the Prize Pool?",
        
        'Can you explain how Boosts, Challenges and Quests work?':
          "Here's how our core activities work:\n\n" +
          "1. Daily Boosts\n" +
          "• Quick 5-15 minute actions\n" +
          "• Complete up to 3 per day\n" +
          "• Reset at midnight\n" +
          "• Build Burn Streaks for bonus FP\n\n" +
          "2. Challenges (21 days)\n" +
          "• Focused improvement in one area\n" +
          "• Expert-designed protocols\n" +
          "• Up to 2 active at once\n" +
          "• Earn 50+ FP on completion\n\n" +
          "3. Quests (90 days)\n" +
          "• Combine multiple challenges\n" +
          "• Transform specific health areas\n" +
          "• One active quest at a time\n" +
          "• Earn 150+ FP on completion\n\n" +
          "Would you like to learn more about any of these activities?",
        
        'I need help fixing an issue with the game.':
          "I'll help you resolve any issues. What specific problem are you experiencing?\n\n" +
          "Common areas:\n" +
          "• Tracking not working correctly\n" +
          "• Unable to complete an activity\n" +
          "• App performance issues\n" +
          "• Account or profile problems\n\n" +
          "Please describe your issue and I'll guide you through the solution.",

        'I\'d like to provide feedback or request a feature.':
          "We value your input! Would you like to:\n\n" +
          "• Submit general feedback\n" +
          "• Report a bug\n" +
          "• Request a new feature\n" +
          "• Provide content feedback\n\n" +
          "Let me know which type of feedback you'd like to share."
      };

      return responses[userMessage] || "How can I assist you with that?";
    };

    try {
      setLoading(true);
      // Add user message immediately
      const userMessage = {
        id: crypto.randomUUID(),
        message,
        isUserMessage: true,
        createdAt: new Date(),
        category
      };
      setMessages(prev => [...prev, userMessage]);

      // Add AI response immediately
      const aiResponse = {
        id: crypto.randomUUID(),
        message: getGuideResponse(message),
        isUserMessage: false,
        createdAt: new Date(),
        category: category || 'general'
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err : new Error('Failed to send message'));
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    resetChat,
    setMessages
  };
}