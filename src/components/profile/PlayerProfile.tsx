import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Camera, Award, LogOut, Shield, X, Trophy } from 'lucide-react';
import { Card } from '../ui/card';
import { ModalContainer } from '../ui/modal-container';
import { PlayerProfileModal } from '../dashboard/rank/PlayerProfileModal';
import { PlayerList } from '../dashboard/rank/PlayerList';
import { ProfileStats } from './ProfileStats';
import { ProfilePrizes } from './ProfilePrizes';
import { RankHistory } from './RankHistory';
import { CompletedActivities } from './CompletedActivities';
import { SubscriptionPlan } from './SubscriptionPlan';
import { EditableField } from './EditableField';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useUser } from '../../hooks/useUser';
import { uploadProfileImage } from '../../lib/profile';

interface PlayerProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubscriptionPlanProps {
  onOpenChange?: (isOpen: boolean) => void;
}

export function PlayerProfile({ isOpen, onClose }: PlayerProfileProps) {
  const { user, signOut } = useSupabase();
  const { userData, healthData, isLoading } = useUser(user?.id);
  const [uploading, setUploading] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(userData?.avatar_url || null);

  useEffect(() => {
    setAvatarUrl(userData?.avatar_url || null);
  }, [userData?.avatar_url]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    event.target.value = ''; // Reset input to allow selecting same file again

    try {
      setUploading(true);
      const newAvatarUrl = await uploadProfileImage(file, user.id);
      setAvatarUrl(newAvatarUrl);
      
      // Add cache buster to force image refresh
      setAvatarUrl(`${newAvatarUrl}?t=${Date.now()}`);
    } catch (error) {
      console.error('Error uploading profile image:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
        <div className={`sticky top-0 bg-gray-900 p-4 border-b border-gray-800 z-[110] ${isSubscriptionOpen ? 'hidden' : ''}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Player Profile</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img 
                    src={`${avatarUrl}?${Date.now()}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Trophy className="text-white" size={40} />
                )}
              </div>
              <label className={`absolute bottom-0 right-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer border border-gray-700 hover:bg-gray-700 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Camera size={16} className="text-gray-300" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">
                {isLoading ? (
                  <div className="h-8 w-48 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  userData?.name || 'Player'
                )}
              </h3>
              <SubscriptionPlan 
                onOpenChange={setIsSubscriptionOpen}
              />
              <div className="grid grid-cols-1 gap-2 text-sm mt-3">
                <EditableField
                  icon={Mail}
                  value={userData?.email || ''}
                  onChange={() => {}} // Email changes not supported
                  placeholder="Email address"
                />
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  <span>Member Since: {new Date(userData?.created_at || Date.now()).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <ProfileStats userData={userData} healthData={healthData} />

          <RankHistory />
          <ProfilePrizes />
        </div>
      </div>
    </div>
  );
}