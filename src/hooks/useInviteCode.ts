import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ValidateInviteCodeResponse, JoinCommunityResponse } from '../types/community';
import { DatabaseError } from '../lib/errors';

export function useInviteCode() {
  const [validating, setValidating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const validateCode = async (code: string): Promise<ValidateInviteCodeResponse> => {
    setValidating(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .rpc('validate_invite_code', { p_code: code });

      if (error) throw error;

      return data as ValidateInviteCodeResponse;
    } catch (err) {
      console.error('Error validating invite code:', err);
      const error = err instanceof Error ? err : new DatabaseError('Failed to validate code');
      setError(error);
      throw error;
    } finally {
      setValidating(false);
    }
  };

  const joinCommunity = async (
    userId: string,
    code: string,
    setPrimary = false
  ): Promise<JoinCommunityResponse> => {
    setJoining(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .rpc('join_community', {
          p_user_id: userId,
          p_code: code,
          p_set_primary: setPrimary
        });

      if (error) throw error;

      return data as JoinCommunityResponse;
    } catch (err) {
      console.error('Error joining community:', err);
      const error = err instanceof Error ? err : new DatabaseError('Failed to join community');
      setError(error);
      throw error;
    } finally {
      setJoining(false);
    }
  };

  return {
    validateCode,
    joinCommunity,
    validating,
    joining,
    error
  };
}