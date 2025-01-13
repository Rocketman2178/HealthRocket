import React, { useState } from 'react';
import { Target, Users, ChevronRight } from 'lucide-react';
import { Card } from '../ui/card';
import { useInviteCode } from '../../hooks/useInviteCode';
import { useSupabase } from '../../contexts/SupabaseContext';
import type { Community } from '../../types/community';

interface CommunitySelectProps {
  onComplete: () => void;
}

export function CommunitySelect({ onComplete }: CommunitySelectProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [community, setCommunity] = useState<Community | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { validateCode, joinCommunity, validating, joining } = useInviteCode();
  const { user } = useSupabase();

  const handleValidate = async () => {
    if (!inviteCode.trim()) return;
    
    try {
      setError(null);
      const response = await validateCode(inviteCode);
      
      if (!response.isValid) {
        setError(response.error || 'Invalid invite code');
        return;
      }

      setCommunity(response.community || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate code');
    }
  };

  const handleJoin = async () => {
    if (!user || !inviteCode || !community) return;

    try {
      setError(null);
      const response = await joinCommunity(user.id, inviteCode, true);
      
      if (!response.success) {
        setError(response.error || 'Failed to join community');
        return;
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join community');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-orange-500" size={24} />
        <div>
          <h2 className="text-xl font-bold text-white">Join Your Community</h2>
          <p className="text-sm text-gray-400">Enter your invite code to get started</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter invite code"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {error && (
          <div className="text-sm text-red-400 text-center">{error}</div>
        )}

        {community && (
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-orange-500" size={20} />
              <h3 className="text-lg font-medium text-white">{community.name}</h3>
            </div>
            {community.description && (
              <p className="text-sm text-gray-400 mb-3">{community.description}</p>
            )}
            <div className="text-sm text-gray-400">
              {community.memberCount} {community.memberCount === 1 ? 'Member' : 'Members'}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          {!community ? (
            <button
              onClick={handleValidate}
              disabled={validating || !inviteCode.trim()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>Validate Code</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>Join Community</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}