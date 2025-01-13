import React from 'react';
import { Sparkles, Flame, Star, Cloud } from 'lucide-react';
import type { RocketEffects } from '../../types/rocket';

interface EffectsToggleProps {
  effects: RocketEffects;
  onChange: (effects: RocketEffects) => void;
  disabled?: boolean;
  className?: string;
}

export function EffectsToggle({ effects, onChange, disabled, className = '' }: EffectsToggleProps) {
  const toggleEffect = (key: keyof RocketEffects) => {
    onChange({
      ...effects,
      [key]: !effects[key]
    });
  };

  const effectButtons = [
    { key: 'glow', icon: Flame, label: 'Engine Glow' },
    { key: 'stars', icon: Star, label: 'Stars' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="text-orange-500" size={20} />
          <h3 className="text-lg font-semibold">Special Effects</h3>
        </div>
        {disabled && (
          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">
            Unlock at Level 5
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {effectButtons.map(({ key, icon: Icon, label }) => {
          const isActive = effects[key as keyof RocketEffects];
          
          return (
            <button
              key={key}
              onClick={() => toggleEffect(key as keyof RocketEffects)}
              disabled={disabled}
              className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-orange-500 text-white' 
                  : disabled
                    ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              <Icon size={16} />
              <span className="text-sm">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}