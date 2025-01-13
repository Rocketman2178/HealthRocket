import React from 'react';
import { Trophy, Star, Award, Info, Users, Gift } from 'lucide-react';
import { Card } from '../../ui/card';
import { Tooltip } from '../../ui/tooltip';
import { LeaderboardTooltip } from './LeaderboardTooltip';
import { CommunityLeaderboard } from './CommunityLeaderboard';
import { PrizePoolInfo } from './PrizePoolInfo';
import { useCommunity } from '../../../hooks/useCommunity';
import { useSupabase } from '../../../contexts/SupabaseContext';
import type { RankProgress } from '../../../types/dashboard';

interface RankStatusProps {
  rankProgress: RankProgress;
}

export function RankStatus({ rankProgress }: RankStatusProps) {
  const { user } = useSupabase();
  const { primaryCommunity } = useCommunity(user?.id);

  return (
    <div className="space-y-4">
      <CommunityLeaderboard 
        communityId={primaryCommunity?.id || ''}
        userId={user?.id}
      />
    </div>
  );
}