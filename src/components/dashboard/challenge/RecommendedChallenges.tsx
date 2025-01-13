import React, { useState } from 'react';
import { Award, ChevronRight, Clock, Zap } from 'lucide-react';
import { Card } from '../../ui/card';
import { challenges } from '../../../data';
import { ChallengeDetails } from './ChallengeDetails';

interface RecommendedChallengesProps {
  challengeIds: string[];
  currentChallenges: { challenge_id: string; status: string; }[];
  onStartChallenge: (challengeId: string) => Promise<void>;
  activeChallengesCount: number;
}

export function RecommendedChallenges({ 
  challengeIds,
  onStartChallenge,
  currentChallenges,
  activeChallengesCount
}: RecommendedChallengesProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  
  // Get challenge details from data
  const recommendedChallenges = (challengeIds || [])
    // Filter out active challenges
    .filter(id => {
      // Remove if challenge is already active
      const isActive = currentChallenges.some(c => c.challenge_id === id);
      return !isActive;
    })
    .map(id => challenges.find(c => c.id === id))
    .filter(Boolean);

  if (!recommendedChallenges.length) return null;

  const handleStartChallenge = async (challengeId: string) => {
    try {
      await onStartChallenge(challengeId);
      setSelectedChallenge(null);
    } catch (err) {
      console.error('Error starting challenge:', err);
    }
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="text-orange-500" size={20} />
            <div>
              <h3 className="text-sm font-medium text-white">Required Challenges for Your Quest</h3>
              <p className="text-xs text-gray-400 mt-0.5">Complete 2 of 3</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {recommendedChallenges.map(challenge => (
            <div 
              key={challenge.id}
              className="bg-gray-700/50 p-3 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">{challenge.name}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={12} />
                  <span>21 Days</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 mb-2">{challenge.description}</p>
              <div className="flex items-center justify-between">
                {challenge.expertReference && (
                  <div className="flex items-center gap-1 text-xs text-orange-500">
                    <Award size={12} />
                    <span>{challenge.expertReference.split(' - ')[0]}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-orange-500">
                    <Zap size={12} />
                    <span>+{challenge.fuelPoints} FP</span>
                  </div>
                  <button
                    onClick={() => setSelectedChallenge(challenge)}
                    disabled={currentChallenges.some(c => c.challenge_id === challenge.id)}
                    className="px-3 py-1 text-xs text-orange-500 hover:text-orange-400 transition-colors bg-orange-500/10 hover:bg-orange-500/20 rounded"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {selectedChallenge && (
        <ChallengeDetails
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onStart={() => handleStartChallenge(selectedChallenge.id)}
          activeChallengesCount={activeChallengesCount}
          maxChallenges={2}
          currentChallenges={currentChallenges}
        />
      )}
    </>
  );
}