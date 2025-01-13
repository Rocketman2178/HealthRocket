import React from 'react';
import { Paintbrush } from 'lucide-react';
import type { RocketColors } from '../../types/rocket';

interface ColorCustomizerProps {
  colors: RocketColors;
  onChange: (colors: RocketColors) => void;
  disabled?: boolean;
  className?: string;
}

export function ColorCustomizer({ colors, onChange, disabled, className = '' }: ColorCustomizerProps) {
  const handleColorChange = (key: keyof RocketColors, value: string) => {
    onChange({
      ...colors,
      [key]: value
    });
  };

  const colorOptions = [
    { key: 'primary', label: 'Body', value: colors.primary },
    { key: 'accent', label: 'Fins', value: colors.accent },
    { key: 'window', label: 'Window', value: colors.window }
  ];

  // Initialize default values to prevent controlled/uncontrolled warning
  const getColorValue = (key: keyof RocketColors) => colors[key] || '#000000';

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-white">
        <div className="flex items-center gap-2">
          <Paintbrush className="text-orange-500" size={20} />
          <h3 className="text-lg font-semibold">Color Customization</h3>
        </div>
        {disabled && (
          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">
            Unlock at Level 3
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {colorOptions.map(({ key, label, value }) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm text-gray-400">
              {label}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={getColorValue(key as keyof RocketColors)}
                onChange={(e) => handleColorChange(key as keyof RocketColors, e.target.value)}
                className={`w-8 h-8 rounded ${
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
                disabled={disabled}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}