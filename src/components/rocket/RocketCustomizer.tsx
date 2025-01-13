import React, { useState } from 'react';
import { Rocket, X } from 'lucide-react';
import { RocketDisplay } from './RocketDisplay';
import { ColorCustomizer } from './ColorCustomizer';
import { EffectsToggle } from './EffectsToggle';
import type { RocketConfig } from '../../types/rocket';

const defaultConfig: RocketConfig = {
  colors: {
    primary: '#22C55E',  // Green
    accent: '#FF0000',    // Red fins
    window: '#E5E7EB'     // Light gray
  },
  effects: {
    glow: false,
    stars: false
  },
  design: 'basic',
  level: 1
};

interface RocketCustomizerProps {
  onClose: () => void;
  onSave: (config: RocketConfig) => void;
  initialConfig?: Partial<RocketConfig>;
  playerLevel?: number;
}

export function RocketCustomizer({ 
  onClose,
  onSave,
  initialConfig = {},
  playerLevel = 1
}: RocketCustomizerProps) {
  const [config, setConfig] = useState<RocketConfig>({
    ...defaultConfig,
    ...initialConfig,
    level: playerLevel,
    design: playerLevel >= 5 ? 'advanced' : 'basic'
  });

  const canCustomizeColors = playerLevel >= 3;
  const canCustomizeEffects = playerLevel >= 5;

  const handleSave = () => {
    // Only save customizations if they're unlocked
    const updatedConfig = {
      ...config,
      colors: canCustomizeColors ? config.colors : defaultConfig.colors,
      effects: canCustomizeEffects ? config.effects : defaultConfig.effects
    };
    onSave(updatedConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 mb-24">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Rocket className="text-orange-500" size={24} />
            <h2 className="text-xl font-bold text-white">Customize Your Rocket</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Section */}
          <div className="flex flex-col items-center justify-center p-2 bg-gray-900/50 rounded-lg">
            <div className="mb-2 text-center">
              <h3 className="text-white font-medium">Preview</h3>
              <p className="text-sm text-gray-400">Tier {playerLevel} Rocket</p>
            </div>
            <div className="relative w-32 h-64">
              <RocketDisplay config={config} />
            </div>
          </div>

          {/* Customization Controls */}
          <div className="space-y-6">
            <ColorCustomizer
              colors={config.colors}
              onChange={(colors) => setConfig(prev => ({ ...prev, colors }))}
              disabled={!canCustomizeColors}
            />

            <EffectsToggle
              effects={config.effects}
              onChange={(effects) => setConfig(prev => ({ ...prev, effects }))}
              disabled={!canCustomizeEffects}
            />

            {/* Level-based features notice */}
            <div className="text-center text-sm text-gray-400 mt-4">
              More customization options unlock at higher levels!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-700 mb-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}