import React, { useState, useEffect } from 'react';
import { Rocket, Maximize2, Zap, ArrowUpCircle, Info, Palette, Sparkles, Target, X, Star, Crown, Gem, Gift, Medal, Trophy } from 'lucide-react';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { RocketCustomizer } from '../../rocket/RocketCustomizer';
import { RocketDisplay } from '../../rocket/RocketDisplay';
import { Tooltip } from '../../ui/tooltip';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { usePlayerStats } from '../../../hooks/usePlayerStats';
import type { RocketConfig } from '../../../types/rocket';
import { supabase } from '../../../lib/supabase';

interface RocketInfoModalProps {
  level: number;
  onClose: () => void;
}

function RocketInfoModal({ level, onClose }: RocketInfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="text-orange-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Blastoff!</h2>
          </div>
          <p className="text-lg text-gray-300">You've reached Level {level}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Gift className="text-orange-500" size={20} />
            <span>Keep Earning FP to Unlock</span>
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Target size={18} className="text-orange-500 mt-1 shrink-0" />
                  <div>
                    <p className="text-white">New Features at Higher Levels</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Palette size={18} className="text-orange-500 mt-1 shrink-0" />
                  <div>
                    <p className="text-white">Custom Rocket Colors, Decals & Effects</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Trophy size={18} className="text-orange-500 mt-1 shrink-0" />
                  <div>
                    <p className="text-white">New Challenges & Quests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 text-center space-y-4">
        <div className="text-4xl font-bold text-orange-500 mb-2">BLASTOFF! 🚀</div>
        <h2 className="text-2xl font-bold text-white">
          Level {level} Achieved!
        </h2>
        <div className="space-y-4 mt-4">
          <p className="text-gray-300">
            Keep earning FP to unlock:
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 justify-center text-gray-300">
              <Target size={18} className="text-orange-500" />
              <span>New Features at Higher Levels</span>
            </li>
            <li className="flex items-center gap-2 justify-center text-gray-300">
              <Palette size={18} className="text-orange-500" />
              <span>Custom Rocket Colors, Decals & Effects</span>
            </li>
            <li className="flex items-center gap-2 justify-center text-gray-300">
              <Sparkles size={18} className="text-orange-500" />
              <span>New Challenges & Quests</span>
            </li>
          </ul>
        </div>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mt-4"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

interface MyRocketProps {
  nextLevelPoints: number;
  hasUpgrade: boolean;
  level: number;
  fuelPoints: number;
}

const defaultConfig: RocketConfig = {
  colors: {
    primary: '#22C55E',  // Green
    accent: '#FF0000',   // Red fins
    window: '#E5E7EB',   // Light gray
  },
  effects: {
    glow: false,
    stars: false
  },
  design: 'basic',
  level: 1
};

export function MyRocket({ 
  nextLevelPoints,
  hasUpgrade = true,
  level,
  fuelPoints
}: MyRocketProps) {
  const { user } = useSupabase();
  const { stats, loading, showLevelUpModal, setShowLevelUpModal } = usePlayerStats(user?.id);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showRocketInfo, setShowRocketInfo] = useState(false);
  const [showLargeRocket, setShowLargeRocket] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [config, setConfig] = useState<RocketConfig>({
    ...defaultConfig,
    level,
    design: level >= 5 ? 'advanced' : 'basic'
  });

  const handleSaveConfig = (newConfig: RocketConfig) => {
    setConfig(newConfig);
    setIsCustomizing(false);
  };

  // Calculate progress percentage and FP needed using fuel_points
  const progressPercentage = Math.min(100, Math.max(0, (fuelPoints / nextLevelPoints) * 100));
  const fpNeeded = Math.max(0, nextLevelPoints - fuelPoints);
  const readyToLevelUp = progressPercentage >= 100;

  const handleLaunch = async () => {
    if (isLaunching) return;
    setIsLaunching(true);

    if (!user) {
      setIsLaunching(false);
      return;
    }

    try {
      // Call the level up function
      const { data, error } = await supabase.rpc('handle_level_up', {
        p_user_id: user.id,
        p_current_fp: fuelPoints
      });

      if (error) throw error;

      // Show celebration modal
      setShowLevelUpModal(true);

      // Trigger dashboard refresh
      window.dispatchEvent(new CustomEvent('dashboardUpdate'));
    } catch (err) {
      console.error('Error leveling up:', err);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">My Rocket</h2>
        </div>

        <Card>
          <div className="flex gap-4">
            {/* Progress Info - Left Side (66%) */}
            <div className="flex-[2]">
              {/* Launch Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Rocket className="text-orange-500" size={16} />
                    <span className="text-sm text-gray-400">Launch Progress</span>                    
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Zap className="text-orange-500" size={14} />
                    <span className="text-orange-500 font-medium">{progressPercentage.toFixed(1)}%</span>
                    <button
                      onClick={() => setShowRocketInfo(true)}
                      className="text-gray-400 hover:text-gray-300 ml-1"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                </div>
                <Progress 
                  value={fuelPoints} 
                  max={nextLevelPoints} 
                  className="bg-gray-700 h-3" 
                />
                <div className="flex justify-between mt-1.5">
                  {readyToLevelUp ? (
                    <button
                      onClick={handleLaunch}
                      disabled={isLaunching}
                      className="text-sm text-orange-500 hover:text-orange-400 flex items-center gap-1"
                    >
                      <span>{isLaunching ? 'Launching...' : 'Launch My Rocket'}</span>
                      <Rocket size={14} className="animate-bounce" />
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">{fpNeeded} FP needed</span>
                  )}
                  <span className="text-xs text-gray-400">{fuelPoints} / {nextLevelPoints} FP</span>
                </div>
              </div>
            </div>

            {/* Rocket Display - Right Side (33%) */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-16 h-16">
                <div 
                  className="group relative w-full h-full bg-gray-800/50 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
                  style={{ minHeight: '4rem', background: config.colors.background }}
                  onClick={() => setShowLargeRocket(true)}
                >
                  <RocketDisplay
                    config={config}
                    className="w-12 h-12"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="text-white/90" size={20} />
                  </div>
                </div>
                {hasUpgrade && (
                  <button
                    onClick={() => setIsCustomizing(true)}
                    className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-1.5 rounded-lg hover:bg-orange-600 transition-colors shadow-lg group z-20"
                  >
                    <ArrowUpCircle size={14} className="transform group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {isCustomizing && (
          <RocketCustomizer 
            onClose={() => setIsCustomizing(false)}
            onSave={handleSaveConfig}
            initialConfig={config}
            playerLevel={level}
          />
        )}
      </div>

      {/* Large Rocket View */}
      {showLargeRocket && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setShowLargeRocket(false)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white"
            >
              <X size={24} />
            </button>
            <div className="w-full aspect-square flex items-center justify-center">
              <RocketDisplay
                config={config}
                className="w-64 h-64"
                showEffects={true}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Rocket Info Modal */}
      {showRocketInfo && (
        <RocketInfoModal
          level={level}
          onClose={() => setShowRocketInfo(false)}
        />
      )}

      {/* Level Up Celebration Modal */}
      {showLevelUpModal && (
        <LevelUpModal
          level={level}
          onClose={() => setShowLevelUpModal(false)}
        />
      )}
    </>
  );
}