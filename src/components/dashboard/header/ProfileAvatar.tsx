import React, { useState } from 'react';
import { User } from 'lucide-react';
import { PlayerProfile } from '../../profile/PlayerProfile';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { useUser } from '../../../hooks/useUser';

export function ProfileAvatar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useSupabase();
  const { userData } = useUser(user?.id);

  return (
    <>
      <div className="relative">
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
        >
          {userData?.avatar_url ? (
            <img 
              src={userData.avatar_url} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="text-white" size={20} />
          )}
        </button>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-lime-500 rounded-full border-2 border-gray-800" />
      </div>
      
      <PlayerProfile 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}