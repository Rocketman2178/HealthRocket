import React, { useState, useEffect } from 'react';
import { Trophy, Users, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../ui/card';
import type { LeaderboardEntry } from '../../types/community';
import { supabase } from '../../lib/supabase';

interface CommunityLeaderboardProps {
  communityId: string;
  userId?: string;
  onClose: () => void;
}

export function CommunityLeaderboard({ communityId, userId, onClose }: CommunityLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Get first day of current month
  const getMonthStart = () => {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data, error } = await supabase
          .rpc('get_community_leaderboard', {
            p_community_id: communityId,
            p_start_date: getMonthStart()
          });

        if (error) throw error;

        const mappedEntries: LeaderboardEntry[] = data.map((row: any) => ({
          userId: row.user_id,
          name: row.name,
          rank: row.rank,
          fuelPoints: row.total_fp,
          level: row.level,
          burnStreak: row.burn_streak
        }));

        setEntries(mappedEntries);

        // Set user's rank if they're in the list
        const userEntry = mappedEntries.find(entry => entry.userId === userId);
        setUserRank(userEntry || null);

      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [communityId, userId]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-96 bg-gray-700/50 rounded-lg"></div>
      </Card>
    );
  }

  return (
    <Card className="p-4 max-h-[85vh] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-orange-500" size={20} />
          <h3 className="text-lg font-semibold text-white">Monthly Leaderboard</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* User's Rank */}
      {userRank && (
        <div className="bg-orange-500/10 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 text-center font-medium text-orange-500">
                #{userRank.rank}
              </div>
              <div>
                <div className="text-white font-medium">Your Rank</div>
                <div className="text-xs text-gray-400">Level {userRank.level}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-orange-500">
                <Trophy size={14} />
                <span>+{userRank.fuelPoints} FP</span>
              </div>
              {userRank.burnStreak > 0 && (
                <div className="text-xs text-lime-500">
                  {userRank.burnStreak} Day Streak
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Leaderboard */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.userId}
            className={`flex items-center justify-between p-2 rounded-lg ${
              entry.userId === userId ? 'bg-orange-500/10' : 'hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 text-center font-medium text-gray-400">
                #{entry.rank}
              </div>
              <div>
                <div className="text-white font-medium">{entry.name}</div>
                <div className="text-xs text-gray-400">Level {entry.level}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-orange-500">
                <Trophy size={14} />
                <span>+{entry.fuelPoints} FP</span>
              </div>
              {entry.burnStreak > 0 && (
                <div className="text-xs text-lime-500">
                  {entry.burnStreak} Day Streak
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-center text-gray-400">
        {entries.length} Participants
      </div>
    </Card>
  );
}