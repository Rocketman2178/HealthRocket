import React, { useState } from 'react';
import { Users, ChevronRight, Target, AlertTriangle, Building2, Check } from 'lucide-react';
import { useInviteCode } from '../../../hooks/useInviteCode';
import { useSupabase } from '../../../contexts/SupabaseContext';
import type { Community } from '../../../types/community';
import { supabase } from '../../../lib/supabase';

interface CommunitySelectProps {
  onContinue: () => void;
}

export function CommunitySelect({ onContinue }: CommunitySelectProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
  const [community, setCommunity] = useState<Community | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { validateCode, joinCommunity, validating, joining } = useInviteCode();
  const { user } = useSupabase();

  // Fetch available communities
  React.useEffect(() => {
    async function fetchCommunities() {
      try {
        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setCommunities(data);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError('Failed to load communities');
      }
    }

    fetchCommunities();
  }, []);

  const handleValidate = async () => {
    if (!inviteCode.trim() || !selectedCommunityId) return;
    
    try {
      setError(null);
      const response = await validateCode(inviteCode);
      
      if (!response.isValid) {
        setError(response.error || 'Invalid invite code');
        return;
      }

      // Verify code matches selected community
      if (response.community?.id !== selectedCommunityId) {
        setError('Invite code does not match selected community');
        return;
      }

      setCommunity(response.community);
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

      onContinue();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join community');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center">
          <Users className="text-orange-500" size={32} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-2">
        Join Your Community
      </h2>
      
      <p className="text-gray-300 text-center mb-6">
        Enter your invite code to join your community and start your journey
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Your Community
          </label>
          <select
            value={selectedCommunityId}
            onChange={(e) => {
              setSelectedCommunityId(e.target.value);
              setCommunity(null); // Reset validation when community changes
              setError(null);
            }}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select a community...</option>
            {communities.map(community => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCommunityId && !community && (
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="text-orange-500" size={20} />
              <h3 className="text-lg font-medium text-white">
                {communities.find(c => c.id === selectedCommunityId)?.name}
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              {communities.find(c => c.id === selectedCommunityId)?.description}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter Invite Code
          </label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => {
              setInviteCode(e.target.value.toUpperCase());
              setCommunity(null); // Reset validation when code changes
              setError(null);
            }}
            placeholder="Enter invite code"
            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              error ? 'border-red-400' : 'border-gray-600'
            }`}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={community ? handleJoin : handleValidate}
          disabled={validating || joining || !inviteCode.trim() || !selectedCommunityId}
          className={`w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group ${
            validating || joining ? 'opacity-75' : ''
          }`}
        >
          <span>
            {validating ? 'Validating...' : 
             joining ? 'Joining...' : 
             community ? (
               <div className="flex items-center gap-2">
                 <span>Join Community</span>
                 <Check size={16} className="text-lime-500" />
               </div>
             ) : 
             'Validate Code'}
          </span>
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="text-xs text-center text-gray-400">
          Need an invite code? Contact a current player in your community or contact Health Rocket
        </div>
      </div>
    </div>
  );
}