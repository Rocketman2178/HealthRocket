import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChallengeDetails } from './ChallengeDetails';
import { challenges, tier0Challenge } from '../../../data/challenges';
import type { Challenge } from '../../../types/dashboard';

export function ChallengePage() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  
  useEffect(() => {
    if (challengeId) {
      // Look for challenge in both tier 0 and regular challenges
      let challengeDetails;
      if (challengeId === 'tc0') {
        challengeDetails = tier0Challenge;
      } else {
        challengeDetails = challenges.find(c => c.challenge_id === challengeId || c.id === challengeId);
      }
      setChallenge(challengeDetails || null);
      setLoading(false);
    }
  }, [challengeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }
  
  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Challenge Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-orange-500 hover:text-orange-400"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <ChallengeDetails
        challenge={challenge}
        activeChallengesCount={1}
        maxChallenges={2}
        currentChallenges={[{
          challenge_id: challenge.id || 'tc0',
          status: 'active'
        }]}
        hasCompletedTier0={true}
        onClose={() => navigate('/')}
        onStart={() => {}}
      />
    </div>
  );
}