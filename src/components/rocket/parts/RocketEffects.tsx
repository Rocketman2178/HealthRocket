import React from 'react';
import { cn } from '../../../lib/utils';

interface RocketEffectsProps {
  glow?: boolean;
  sparkles?: boolean;
  isAnimated?: boolean;
  className?: string;
}

export function RocketEffects({ 
  glow = false, 
  sparkles = false,
  isAnimated = true,
  className 
}: RocketEffectsProps) {
  return (
    <div className={cn("pointer-events-none", className)}>
      {/* Glow Effect */}
      {glow && (
        <div 
          className={cn(
            "absolute inset-0 bg-orange-500/20 blur-xl rounded-full",
            isAnimated && "animate-pulse"
          )}
        />
      )}

      {/* Sparkle Effects */}
      {sparkles && isAnimated && (
        <div className="absolute inset-0">
          <div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle-1" />
          <div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle-2" />
          <div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle-3" />
          <div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle-4" />
          <div className="absolute w-1 h-1 bg-white rounded-full animate-sparkle-5" />
        </div>
      )}
    </div>
  );
}