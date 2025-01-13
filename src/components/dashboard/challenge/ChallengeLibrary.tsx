import React from 'react';
import { X, Award, Zap, ChevronDown, ChevronUp, Brain, Moon, Activity, Apple, Database, Clock, CheckCircle2, Calendar, Target } from 'lucide-react';
import { ChallengeDetails } from './ChallengeDetails';
import { challenges } from '../../../data';
import type { Challenge } from '../../../types/dashboard';

interface ChallengeLibraryProps {
  userId: string | undefined;
  categoryScores: Record<string, number>;
  recommendedChallenges: string[];
  onClose: () => void;
  currentChallenges: Challenge[];
  onStartChallenge: (challengeId: string) => Promise<void>;
  activeChallengesCount: number;
}

export function ChallengeLibrary({ 
  userId, 
  categoryScores, 
  recommendedChallenges,
  onClose,
  currentChallenges,
  onStartChallenge,
  activeChallengesCount
}: ChallengeLibraryProps) {
  const [expandedChallenge, setExpandedChallenge] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = React.useState<Challenge | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Auto-select category based on recommended challenges
  React.useEffect(() => {
    if (recommendedChallenges.length > 0) {
      // Find the first recommended challenge to get its category
      const firstChallenge = challenges.find(c => c.id === recommendedChallenges[0]);
      if (firstChallenge) {
        setSelectedCategory(firstChallenge.category.toLowerCase());
      }
    }
  }, [recommendedChallenges]);

  // Handle auto-expansion of recommended challenge
  React.useEffect(() => {
    const expandChallengeId = localStorage.getItem('expandChallenge');
    if (expandChallengeId) {
      // Find the challenge to expand
      const challenge = challenges.find(c => c.id === expandChallengeId);
      if (challenge) {
        // Set the category and expand the challenge
        setSelectedCategory(challenge.category.toLowerCase());
        setExpandedChallenge(expandChallengeId);
        // Clear the stored ID
        localStorage.removeItem('expandChallenge');
        
        // Scroll to the challenge after a brief delay
        setTimeout(() => {
          const challengeEl = document.getElementById(`challenge-${expandChallengeId}`);
          if (challengeEl) {
            challengeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 200);
      }
    }
  }, []);

  // Get all available challenges from data files
  const availableChallenges = React.useMemo(() => {
    return challenges.map(challenge => ({
      ...challenge,
      status: 'available'
    }));
  }, []);

  React.useEffect(() => {
    setLoading(false);
  }, [userId]);

  // Check if all tier 1 challenges are completed for a category
  const hasCompletedTier1 = React.useMemo(() => {
    if (!selectedCategory) return false;
    const categoryChallenges = availableChallenges.filter(c => 
      c.category?.toLowerCase() === selectedCategory.toLowerCase() &&
      c.tier === 1
    );
    return categoryChallenges.every(c => c.status === 'completed');
  }, [availableChallenges, selectedCategory]);

  // Check if Tier 0 is completed
  const hasCompletedTier0 = React.useMemo(() => {
    return availableChallenges.some(c => c.tier === 0 && c.status === 'completed');
  }, [availableChallenges]);

  const categories = [
    { id: 'mindset', name: 'Mindset', icon: Brain },
    { id: 'sleep', name: 'Sleep', icon: Moon },
    { id: 'exercise', name: 'Exercise', icon: Activity },
    { id: 'nutrition', name: 'Nutrition', icon: Apple },
    { id: 'biohacking', name: 'Biohacking', icon: Database },
    { id: 'bonus', name: 'Bonus', icon: Target }
  ];

  const filteredChallenges = React.useMemo(() => {
    if (!selectedCategory) return [];
    
    // Get all challenges for the selected category
    const categoryMatches = availableChallenges.filter(challenge => 
      challenge.category?.toLowerCase() === selectedCategory.toLowerCase());
    
    // Sort to put recommended challenges first
    return categoryMatches.sort((a, b) => {
      const aIsRecommended = recommendedChallenges.includes(a.id);
      const bIsRecommended = recommendedChallenges.includes(b.id);
      if (aIsRecommended && !bIsRecommended) return -1;
      if (!aIsRecommended && bIsRecommended) return 1;
      return 0;
    });
  }, [selectedCategory, availableChallenges, recommendedChallenges]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
      </div>
    );
  }

  const maxChallenges = 2; // Current cap is 2

  const handleStartChallenge = async (challengeId: string) => {
    try {
      // Check if challenge is already active
      if (currentChallenges.some(c => c.challenge_id === challengeId)) {
        return;
      }

      // Check if challenge is already active
      if (currentChallenges.some(c => c.challenge_id === challengeId)) {
        return;
      }

      await onStartChallenge(challengeId);
      onClose();
    } catch (err) {
      console.error('Failed to start challenge', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Target className="text-orange-500" size={20} />
            <div>
              <h2 className="text-xl font-bold text-white">Available Challenges</h2>
              <p className="text-sm text-gray-300 mt-1">Select a Category to Explore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-4 border-b border-gray-700">
          {categories.map(({ id, name, icon: Icon }) => (
            <button
              data-category={id}
              key={id}
              onClick={() => setSelectedCategory(selectedCategory === id ? null : id)}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors text-center ${
                selectedCategory === id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Icon size={16} />
              <span className="text-xs">{name}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Show Tier 0 Challenge by default when not completed and no category selected */}
          {!hasCompletedTier0 && !selectedCategory && (
            <div className="mb-6">
              <div className="text-center mb-4 bg-orange-500/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white">Required First Challenge</h3>
                <p className="text-sm text-gray-400">Complete this challenge to unlock all Tier 1 challenges</p>
              </div>
              <div 
                className="bg-orange-500/10 rounded-lg overflow-hidden border border-orange-500/20 cursor-pointer"
                onClick={() => {
                  const tier0 = availableChallenges.find(c => c.tier === 0);
                  if (tier0) {
                    setSelectedChallenge(tier0);
                  }
                }}
              >
                {renderChallenge(availableChallenges.find(c => c.tier === 0)!)}
              </div>
            </div>
          )}

          {!selectedCategory && (
            <div className="text-center text-gray-400 py-8">
              <p className="text-sm">Choose a category above to view available challenges</p>
              <p className="text-xs text-gray-500 mt-2">Tier 2 challenges unlock after completing Tier 1</p>
            </div>
          )}
          
          {selectedCategory && filteredChallenges.map(challenge => (
            <div
              key={challenge.id}
              onClick={() => setSelectedChallenge(challenge)}
              id={`challenge-${challenge.id}`}
              className={`bg-gray-700/50 rounded-lg overflow-hidden ${
                challenge.tier === 2 && !hasCompletedTier1 ? 'opacity-50' : ''
              } cursor-pointer hover:bg-gray-700/70 transition-colors`}
            >
              {renderChallenge(challenge)}
            </div>
          ))}
        </div>
      </div>
      {selectedChallenge && (
        <ChallengeDetails
          challenge={selectedChallenge}
          activeChallengesCount={activeChallengesCount}
          maxChallenges={2}
          currentChallenges={currentChallenges}
          hasCompletedTier0={hasCompletedTier0}
          onClose={() => setSelectedChallenge(null)}
          onStart={() => {
            onStartChallenge(selectedChallenge.id);
            onClose();
          }}
        />
      )}
    </div>
  );

  function renderChallenge(challenge: Challenge) {
    return (
      <>
        <div className="w-full text-left p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-orange-500">
                  <Zap size={14} />
                  <span className="text-sm font-medium">+{challenge.fuelPoints} FP</span>
                </div>
                <div className="flex items-center gap-2">
                  {challenge.tier === 2 && (
                    <span className="text-xs bg-orange-500/10 px-2 py-0.5 rounded text-orange-500">
                      Pro
                    </span>
                  )}
                  {((challenge.tier === 1 && !hasCompletedTier0) || (challenge.tier === 2 && !hasCompletedTier1)) && (
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">
                      Locked
                    </span>
                  )}
                  <ChevronDown className="text-gray-400" size={16} />
                </div>
              </div>
              <h3 className="font-bold text-white">{challenge.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-400">{challenge.category}</span>
                {challenge.expertReference && (
                  <div className="flex items-center gap-1 text-xs text-orange-500">
                    <Award size={12} />
                    <span>{challenge.expertReference.split(' - ')[0]}</span>
                  </div>
                )}
                {currentChallenges.some(c => c.id === challenge.id) && (
                  <span className="text-xs bg-lime-500/20 px-2 py-0.5 rounded text-lime-500">Completed</span>
                )}
                {recommendedChallenges.includes(challenge.id) && (
                  <span className="text-xs text-orange-500 font-medium px-2 py-0.5 bg-orange-500/10 rounded ml-auto">
                    Required
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}