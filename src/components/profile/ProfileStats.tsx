import { useState, useEffect } from 'react';
import { Activity, Zap, Target, Trophy } from 'lucide-react';
import { Card } from '../ui/card';
import { useCompletedActivities } from '../../hooks/useCompletedActivities';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useUser } from '../../hooks/useUser';

export function ProfileStats() {
  const { user } = useSupabase();
  const { data } = useCompletedActivities(user?.id);
  const { userData, isLoading } = useUser(user?.id);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
      <Card className="bg-gray-800/50">
        <div className="p-4 text-center">
          <Zap className="text-orange-500 mx-auto mb-2" size={24} />
          <div className="text-2xl font-bold text-white mb-1">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-700 rounded animate-pulse mx-auto" />
            ) : (
              (userData?.lifetime_fp || 0).toLocaleString()
            )}
          </div>
          <div className="text-xs text-gray-400">Lifetime Fuel Points</div>
        </div>
      </Card>
      
      <Card className="bg-gray-800/50">
        <div className="p-4 text-center">
          <Activity className="text-orange-500 mx-auto mb-2" size={24} />
          <div className="text-2xl font-bold text-white mb-1">{data.totalBoostsCompleted || 0}</div>
          <div className="text-xs text-gray-400">Lifetime Daily Boosts</div>
        </div>
      </Card>
      
      <Card className="bg-gray-800/50">
        <div className="p-4 text-center">
          <Target className="text-orange-500 mx-auto mb-2" size={24} />
          <div className="text-2xl font-bold text-white mb-1">{data.questsCompleted || 0}</div>
          <div className="text-xs text-gray-400">Quests Completed</div>
        </div>
      </Card>
      
      <Card className="bg-gray-800/50">
        <div className="p-4 text-center">
          <Trophy className="text-orange-500 mx-auto mb-2" size={24} />
          <div className="text-2xl font-bold text-white mb-1">{data.challengesCompleted || 0}</div>
          <div className="text-xs text-gray-400">Challenges Completed</div>
        </div>
      </Card>
    </div>
  );
}