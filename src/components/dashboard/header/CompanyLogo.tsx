import React from 'react';
import { ProfileAvatar } from './ProfileAvatar';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { useUser } from '../../../hooks/useUser';

export function CompanyLogo() {
  const { user } = useSupabase();
  const { userData, isLoading } = useUser(user?.id);

  return (
    <div className="bg-black py-3">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="w-1/2 sm:w-auto">
            <img 
              src="/health-rocket-logo.png" 
              alt="Health Rocket" 
              className="h-10 sm:h-16"
            />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 w-24 bg-gray-700 rounded"></div>
                  <div className="h-3 w-16 bg-gray-700 rounded mt-1"></div>
                </div>
              ) : (
                <>
                  <div className="text-sm sm:text-base font-medium text-white">
                    {userData?.name || 'Player'}
                  </div>
                  <div className="text-xs sm:text-sm text-orange-500">
                    Pro Plan
                  </div>
                </>
              )}
            </div>
            <ProfileAvatar />
          </div>
        </div>
      </div>
    </div>
  );
}