import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, ChevronDown, ChevronUp, Heart, User, Activity, Zap, Users, Info, Star } from 'lucide-react';
import { Card } from '../../ui/card';
import { Tooltip } from '../../ui/tooltip';
import { PlayerList } from './PlayerList';
import { PlayerProfileModal } from './PlayerProfileModal';
import { LeaderboardTooltip } from './LeaderboardTooltip';
import { LeaderboardToggle } from './LeaderboardToggle';
import { PrizePoolInfo } from './PrizePoolInfo';
import type { LeaderboardEntry } from '../../../types/community';
import { supabase } from '../../../lib/supabase';
import { useCommunity } from '../../../hooks/useCommunity';
import { useSupabase } from '../../../contexts/SupabaseContext';

interface CommunityLeaderboardProps {
  communityId: string;
  userId?: string;
}

type TimeFrame = 'month' | 'quarter' | 'year';

export function CommunityLeaderboard({ communityId, userId }: CommunityLeaderboardProps) {
  const { user } = useSupabase();
  const { primaryCommunity, allCommunities, loading: communityLoading } = useCommunity(user?.id);
  const [isGlobal, setIsGlobal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null);
  const [timeframe, setTimeframe] = useState<TimeFrame>('month');
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showCommunitySelector, setShowCommunitySelector] = useState(false);
  const { handleMakePrimary, updating } = useCommunity(user?.id);

  const handleCommunityChange = async (communityId: string) => {
    if (updating) return;
    try {
      const success = await handleMakePrimary(communityId);
      if (success) {
        setShowCommunitySelector(false);
      }
    } catch (err) {
      console.error('Failed to update primary community:', err);
    }
  };

  // Get start date based on timeframe
  const getStartDate = () => {
    const date = new Date();
    
    switch (timeframe) {
      case 'month':
        date.setDate(1);
        break;
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3);
        date.setMonth(quarter * 3, 1);
        break;
      case 'year':
        date.setMonth(0, 1);
        break;
    }
    
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        // Don't fetch if no valid communityId
        if (!isGlobal && (!communityId || communityId === '')) {
          setEntries([]);
          setUserRank(null);
          setLoading(false);
          return;
        }

        const { data, error } = isGlobal 
          ? await supabase.rpc('get_global_leaderboard', {
              p_start_date: getStartDate()
            })
          : await supabase.rpc('get_community_leaderboard', {
              p_community_id: communityId,
              p_start_date: getStartDate()
            });

        if (error) throw error;

        const mappedEntries: LeaderboardEntry[] = data.map(row => ({
          userId: row.user_id,
          name: row.name,
          createdAt: row.created_at,
          rank: Number(row.rank),
          fuelPoints: Number(row.total_fp),
          level: row.level,
          communityName: row.community_name,
          burnStreak: row.burn_streak,
          avatarUrl: row.avatar_url,
          healthScore: Number(row.health_score),
          healthspanYears: Number(row.healthspan_years),
          plan: row.plan
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
  }, [communityId, timeframe, userId, isGlobal]);

  if (loading || communityLoading) {
    return (
      <Card className="animate-pulse">
        <div className="p-4">
          <div className="h-6 w-48 bg-gray-700/50 rounded mb-4"></div>
          <div className="h-32 bg-gray-700/50 rounded"></div>
        </div>
      </Card>
    );
  }
  
  // Show message if no community is selected
  if (!communityId || !primaryCommunity) {
    return (
      <Card>
        <div className="relative">
          <div className="flex flex-col items-center justify-center py-2.5 space-y-1.5">
            <div className="flex items-center gap-2">
              <Trophy className="text-orange-500" size={24} />
              <h3 className="text-lg font-medium text-white">Select Your Community</h3>
            </div>
            <div className="text-sm text-gray-400">Join a community to see stats and leaderboards</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <LeaderboardToggle 
            isGlobal={isGlobal}
            onToggle={() => {
              setIsGlobal(!isGlobal);
              setExpanded(false);
            }}
          />
          <PrizePoolInfo />
          <Tooltip content={<LeaderboardTooltip />}>
            <Info size={16} className="text-gray-400 hover:text-gray-300" />
          </Tooltip>
        </div>
      </div>

      {/* Community Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => !isGlobal && setShowCommunitySelector(prev => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                isGlobal ? 'bg-gray-700/50 text-gray-400' : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
              }`}
              disabled={isGlobal}
            >
              <span className="text-xs font-medium">{primaryCommunity?.name || 'Loading...'}</span>
              <ChevronDown size={16} />
            </button>

            {showCommunitySelector && (
              <div className="absolute mt-1 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                {allCommunities?.map((community) => (
                  <div
                    key={community.id}
                    className="p-3 hover:bg-gray-700/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">{community.name}</span>
                      {community.isPrimary && (
                        <Star size={12} className="text-orange-500" />
                      )}
                    </div>
                    {!community.isPrimary && (
                      <button
                        onClick={() => handleCommunityChange(community.id)}
                        className="text-xs text-gray-400 hover:text-orange-500"
                      >
                        Make Default
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Users size={16} />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowPlayerList(true);
              }}
              className="hover:text-white transition-colors"
            >
              {entries.length} Players
            </button>
          </div>
        </div>
      </div>

      {/* User's Rank */}
      {userRank && (
        <div className="bg-gray-700/50 rounded-lg p-3 mb-6">
          <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700/50">
            {/* Top Row - Rank & Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white">#{userRank.rank}</span>
                  <span className="text-xs text-gray-400">{userRank.rank}/{entries.length}</span>
                </div>
                <div className="h-12 w-px bg-gray-700/50" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-1">Status</span>
                  <div className={`px-3 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1.5 ${
                    userRank.rank <= Math.ceil(entries.length * 0.1) ? 'bg-orange-500/20 text-orange-500' : 
                    userRank.rank <= Math.ceil(entries.length * 0.5) ? 'bg-lime-500/20 text-lime-500' : 
                    'bg-gray-700/50 text-gray-400'
                  }`}>
                    <Trophy size={12} />
                    <span>
                      {userRank.rank <= Math.ceil(entries.length * 0.1) ? 'Legend' :
                       userRank.rank <= Math.ceil(entries.length * 0.5)
                         ? 'Hero'
                         : 'Commander'} 
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1">Resets Monthly</span>
                </div>
                <div className="h-12 w-px bg-gray-700/50" />
                <div className="flex flex-col items-end">
                  <div className="flex flex-col items-center">
                    <Zap size={16} className="text-orange-500" />
                    <span className="text-2xl font-bold text-white">{userRank.fuelPoints.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">FP</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Bars */}
            <div className="space-y-3 mt-4 pt-4 border-t border-gray-700/50">
              {/* Hero Progress */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Trophy size={12} className="text-lime-500" />
                      <span className="text-lime-500">Hero Status</span>
                    </div>
                    <span className="text-[10px] text-lime-500 bg-lime-500/10 px-1.5 py-0.5 rounded">2X Prize Pool</span>
                  </div>
                  <span className="text-gray-400">{Math.round(Math.min(100, (userRank.rank <= Math.ceil(entries.length * 0.5) ? 100 : (Math.ceil(entries.length * 0.5) / userRank.rank * 100))))}%</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-lime-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(Math.min(100, (userRank.rank <= Math.ceil(entries.length * 0.5) ? 100 : (Math.ceil(entries.length * 0.5) / userRank.rank * 100))))}%` }}
                  />
                </div>
              </div>
              
              {/* Legend Progress */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Trophy size={12} className="text-orange-500" />
                      <span className="text-orange-500">Legend Status</span>
                    </div>
                    <span className="text-[10px] text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded">5X Prize Pool</span>
                  </div>
                  <span className="text-gray-400">{Math.round(Math.min(100, (userRank.rank <= Math.ceil(entries.length * 0.1) ? 100 : (Math.ceil(entries.length * 0.1) / userRank.rank * 100))))}%</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(Math.min(100, (userRank.rank <= Math.ceil(entries.length * 0.1) ? 100 : (Math.ceil(entries.length * 0.1) / userRank.rank * 100))))}%` }}
                  />
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center mt-2">
                *Pro Plan Players Are Eligible For Monthly Prize Pools
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Players */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-orange-500" size={16} />
          <h3 className="text-lg font-bold text-white">Leaderboard</h3>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as TimeFrame)}
          className="bg-gray-700 text-xs text-white rounded-lg px-2 py-1 border border-gray-600"
        >
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="year">Year</option>
        </select>
      </div>

      <div className="space-y-2 mb-4">
        {entries.slice(0, 3).map((entry) => (
          <div
            onClick={() => setSelectedPlayer(entry)}
            key={entry.userId}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
              entry.userId === userId ? 'bg-orange-500/10' : entry.rank % 2 === 0 ? 'bg-gray-700/10' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 text-center font-medium text-gray-400 shrink-0">
                #{entry.rank}
              </div>
              {entry.avatarUrl ? (
                <img src={entry.avatarUrl} alt="" className="w-8 h-8 rounded-full shrink-0" />
              ) : (
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center shrink-0">
                  <User size={16} className="text-gray-400" />
                </div>
              )}
              <div className="flex flex-col justify-between flex-1 gap-1">
                <div className="flex items-center justify-between">
                  <div className="text-white text-sm font-medium">{entry.name}</div>
                  <div className="text-gray-400 text-xs text-right ml-2">Level {entry.level}</div>
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="text-xs text-orange-500 min-w-[80px]">
                    {entry.rank <= Math.ceil(entries.length * 0.1) 
                      ? 'Legend' 
                      : entry.rank <= Math.ceil(entries.length * 0.5)
                        ? 'Hero'
                        : 'Commander'}
                  </span>
                  <div className="flex items-center">
                    <div className="flex items-center gap-0.5 px-1 py-0.5 bg-gray-700/50 rounded text-xs w-[40px] justify-end">
                      <Activity size={12} />
                      <span>{entry.healthScore.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-0.5 px-1 py-0.5 bg-lime-500/10 rounded text-xs w-[60px] justify-end">
                      <Heart size={12} />
                      <span>+{entry.healthspanYears}</span>
                    </div> 
                    <div className="flex items-center gap-0.5 px-1 py-0.5 bg-orange-500/10 rounded text-xs w-[60px] justify-end">
                      <Zap size={12} className="text-orange-500" />
                      <span>{entry.fuelPoints}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {entries.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 text-sm text-orange-500 hover:text-orange-400 py-2"
        >
          <span>{expanded ? 'Show Less' : 'View More'}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}

      {/* Expanded List */}
      {expanded && (
        <div className="space-y-2 mt-4 max-h-96 overflow-y-auto">
          {entries.slice(3).map(entry => (
            <button
              onClick={() => setSelectedPlayer(entry)}
              key={entry.userId}
              className={`w-full flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                entry.userId === userId ? 'bg-orange-500/10' : entry.rank % 2 === 0 ? 'bg-gray-700/10' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 text-center font-medium text-gray-400 shrink-0">
                  #{entry.rank}
                </div>
                {entry.avatarUrl ? (
                  <img src={entry.avatarUrl} alt="" className="w-8 h-8 rounded-full shrink-0" />
                ) : (
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center shrink-0">
                    <User size={16} className="text-gray-400" />
                  </div>
                )}
                <div className="flex flex-col justify-between flex-1 gap-1">
                  <div className="flex items-center justify-between">
                    <div className="text-white text-sm font-medium">{entry.name}</div>
                    <div className="text-gray-400 text-xs text-right ml-2">Level {entry.level}</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-xs text-orange-500 min-w-[80px]">
                      {entry.rank <= Math.ceil(entries.length * 0.1) ? 'Legend' :
                       entry.rank <= Math.ceil(entries.length * 0.5) ? 'Hero' :
                       'Commander'}
                    </span>
                    <div className="flex items-center">
                      <div className="flex items-center gap-0.5 px-1 py-0.5 bg-gray-700/50 rounded text-xs w-[40px] justify-end">
                        <Activity size={12} />
                        <span>{entry.healthScore.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-0.5 px-1 py-0.5 bg-lime-500/10 rounded text-xs w-[60px] justify-end">
                        <Heart size={12} />
                        <span>+{entry.healthspanYears}</span>
                      </div> 
                      <div className="flex items-center gap-0.5 px-1 py-0.5 bg-orange-500/10 rounded text-xs w-[60px] justify-end">
                        <Zap size={12} className="text-orange-500" />
                        <span>{entry.fuelPoints}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {selectedPlayer && (
        <PlayerProfileModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
      {showPlayerList && (
        <PlayerList
          players={entries}
          onClose={() => setShowPlayerList(false)}
        />
      )}
    </Card>
  );
}