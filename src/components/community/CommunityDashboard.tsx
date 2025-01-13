import React, { useState } from 'react';
import { Users, Trophy } from 'lucide-react';
import { Card } from '../ui/card';
import { CommunityLeaderboard } from './CommunityLeaderboard';
import { useCommunity } from '../../hooks/useCommunity';
import { useSupabase } from '../../contexts/SupabaseContext';

export function CommunityDashboard() {
  const { user } = useSupabase();
  const { primaryCommunity, loading } = useCommunity(user?.id);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-20 bg-gray-700/50 rounded-lg"></div>
      </Card>
    );
  }

  if (!primaryCommunity) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-6">
          <Users className="text-orange-500 mb-3" size={24} />
          <h3 className="text-lg font-medium text-white mb-1">No Community Selected</h3>
          <p className="text-sm text-gray-400">Join a community to see stats and leaderboards</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{primaryCommunity.name}</h3>
            <p className="text-sm text-gray-400">{primaryCommunity.member_count} Members</p>
          </div>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 transition-colors"
          >
            <Trophy size={16} />
            <span>View Leaderboard</span>
          </button>
        </div>
      </Card>

      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <CommunityLeaderboard
              communityId={primaryCommunity.id}
              userId={user?.id}
              onClose={() => setShowLeaderboard(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}