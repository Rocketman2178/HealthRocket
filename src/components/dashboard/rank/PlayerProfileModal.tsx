import React from 'react';
import { X, Trophy, Heart, Activity, Users, Star } from 'lucide-react';
import { ModalContainer } from '../../ui/modal-container';
import { useCommunity } from '../../../hooks/useCommunity';
import type { LeaderboardEntry } from '../../../types/community';

interface PlayerProfileModalProps {
  player: LeaderboardEntry;
  onClose: () => void;
}

export function PlayerProfileModal({ player, onClose }: PlayerProfileModalProps) {
  const { allCommunities } = useCommunity(player.userId);

  return (
    <ModalContainer onClose={onClose}>
      <div className="max-w-md w-full p-4 mt-16 sm:mt-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              {player.avatarUrl ? (
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <Trophy className="text-white" size={32} />
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">{player.name}</h2>
              <div className="text-xs text-gray-400">Member Since: {
                player.createdAt ? new Date(player.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'Unknown'
              }</div>
              <div className="text-xs text-gray-400">Level {player.level}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Rocket and Stats */}
        <div className="flex gap-4 mb-6">
          {/* Rocket Display */}
          <div className="p-2 bg-gray-700/50 rounded-lg flex items-center justify-center">
            <div className="relative w-24 h-24">
              <img
                src="/rockets/rocket-green.png"
                alt="Player Rocket"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="text-orange-500" size={14} />
                <span className="text-sm text-gray-400">HealthScore</span>
              </div>
              <div className="text-lg font-bold text-white pl-6">{player.healthScore?.toFixed(1) || '0.0'}</div>
            </div>
            
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="text-orange-500" size={14} />
                <span className="text-sm text-gray-400">+HealthSpan</span>
              </div>
              <div className="text-lg font-bold text-white pl-6">+{player.healthspanYears?.toFixed(1) || '0.0'}</div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <div className="p-3 bg-gray-700/50 rounded-lg text-sm">
            <div className="flex items-center gap-2">
              <Users className="text-orange-500" size={16} />
              <span className="text-gray-400">Communities:</span>
            </div>
            <div className="mt-2 space-y-2">
              {allCommunities?.map((community) => (
                <div 
                  key={community.id}
                  className="flex items-center gap-2 pl-6 py-1"
                >
                  {community.isPrimary && (
                    <Star size={12} className="text-orange-500 shrink-0" />
                  )}
                  <span className="text-sm text-gray-300">{community.name}</span>
                </div>
              ))}
              {(!allCommunities?.length) && (
                <div className="pl-6 text-sm text-gray-500 italic">
                  No communities joined
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
}