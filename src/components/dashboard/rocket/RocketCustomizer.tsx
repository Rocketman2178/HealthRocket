import React from 'react';
import { X, Check } from 'lucide-react';

interface RocketCustomizerProps {
  onClose: () => void;
}

export function RocketCustomizer({ onClose }: RocketCustomizerProps) {
  const rocketStyles = [
    { id: 'classic', name: 'Classic', color: 'Green' },
    { id: 'stealth', name: 'Stealth', color: 'Black' },
    { id: 'flame', name: 'Flame', color: 'Orange' },
    { id: 'ice', name: 'Ice', color: 'Blue' },
    { id: 'neon', name: 'Neon', color: 'Purple' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-white">Customize Your Rocket</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {rocketStyles.map((style) => (
              <button
                key={style.id}
                className="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-white">{style.name}</div>
                  <div className="text-sm text-gray-400">{style.color}</div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center">
                  {style.id === 'classic' && (
                    <Check size={14} className="text-orange-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="text-center text-sm text-gray-400 mt-4">
            More styles unlock at higher levels!
          </div>
        </div>
      </div>
    </div>
  );
}