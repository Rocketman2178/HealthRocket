import React from 'react';
import { cn } from '../../lib/utils';
import { RocketBase } from './parts/RocketBase';
import { RocketEffects } from './parts/RocketEffects';
import { RocketBackground } from './parts/RocketBackground';
import type { RocketConfig } from '../../types/rocket';

interface RocketDisplayProps {
  config: RocketConfig;
  className?: string;
  showEffects?: boolean;
  isAnimated?: boolean;
}

export function RocketDisplay({ 
  config,
  className = '',
  showEffects = true,
  isAnimated = true
}: RocketDisplayProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Background Effects Layer */}
      {showEffects && (
        <RocketBackground
          stars={config.effects.stars}
          isAnimated={isAnimated}
          className={cn("absolute inset-0 z-0")}
        />
      )}
      
      {/* Main Rocket Layer */}
      <div className={cn(
        "relative z-10 w-full h-full flex items-center justify-center",
        config.effects.stars ? "bg-black/50" : "bg-black/90"
      )}>
        <RocketBase
          colors={config.colors}
          design={config.design}
          level={config.level}
          className="w-full h-full"
        />
      </div>

      {/* Special Effects Layer */}
      {showEffects && config.effects.glow && (
        <RocketEffects
          glow={true}
          className="absolute inset-0"
        />
      )}
    </div>
  );
}