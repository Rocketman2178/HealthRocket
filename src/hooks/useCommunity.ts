import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Community } from '../types/community';
import { DatabaseError } from '../lib/errors';

export function useCommunity(userId: string | undefined) {
  const [primaryCommunity, setPrimaryCommunity] = useState<Community | null>(null);
  const [allCommunities, setAllCommunities] = useState<(Community & { isPrimary: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [updating, setUpdating] = useState(false);

  // Function to fetch communities
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const { data: communities, error: membershipError } = await supabase
        .rpc('get_user_communities', {
          p_user_id: userId
        });

      if (membershipError) throw membershipError;

      const transformedCommunities = communities ? communities.map(c => ({
        id: c.community_id,
        name: c.name,
        description: c.description,
        memberCount: c.member_count,
        settings: c.settings,
        isPrimary: c.is_primary
      })) : [];

      setAllCommunities(transformedCommunities);
      const primaryCommunity = transformedCommunities.find(c => c.isPrimary) || null;
      setPrimaryCommunity(primaryCommunity || null);

    } catch (err) {
      console.error('Error fetching communities:', err);
      setError(err instanceof Error ? err : new DatabaseError('Failed to fetch communities'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch communities
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setPrimaryCommunity(null);
      setAllCommunities([]);
      return;
    }

    fetchCommunities();
  }, [userId]);

  const handleMakePrimary = async (communityId: string) => {
    if (!userId || updating) return false;
    
    try {
      setUpdating(true);
      setError(null);

      const { data, error } = await supabase
        .rpc('update_primary_community', {
          p_user_id: userId,
          p_community_id: communityId
        });

      if (error) throw error;
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to update primary community');
      }
      
      // Immediately fetch updated data
      await fetchCommunities();

      // Trigger dashboard update
      window.dispatchEvent(new CustomEvent('dashboardUpdate'));
      
      return true;
    } catch (err) {
      console.error('Error updating primary community:', err);
      setError(err instanceof Error ? err : new DatabaseError('Failed to update primary community'));
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    primaryCommunity,
    allCommunities,
    loading,
    error,
    handleMakePrimary,
    updating
  };
}