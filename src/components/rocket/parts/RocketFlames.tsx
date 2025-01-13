import React from 'react';
import { cn } from '../../../lib/utils';
import type { RocketColors } from '../../../types/rocket';

interface RocketFlamesProps {
  colors: RocketColors;
  isAnimated?: boolean;
  className?: string;
}

export function RocketFlames({ colors, isAnimated = true, className }: RocketFlamesProps) {
  return (
    <div className={cn("relative", className)}>
      <svg viewBox="0 0 60 80" className="w-12 h-16">
        {/* Main Flame */}
        <path
          d="M30 0 C45 20 45 40 30 60 C15 40 15 20 30 0"
          fill={colors.flame || '#FF6B00'}
          className={cn(
            "transition-colors duration-300",
            isAnimated && "animate-flame"
          )}
        />
        
        {/* Inner Flame */}
        <path
          d="M30 10 C40 25 40 40 30 50 C20 40 20 25 30 10"
          fill={colors.innerFlame || '#FFD700'}
          className={cn(
            "transition-colors duration-300",
            isAnimated && "animate-inner-flame"
          )}
        />
      </svg>

      {/* Flame Particles */}
      {isAnimated && (
        <div className="absolute inset-0 flex justify-center">
          <div className="w-1 h-1 bg-orange-500 rounded-full animate-particle-1" />
          <div className="w-1 h-1 bg-yellow-500 rounded-full animate-particle-2" />
          <div className="w-1 h-1 bg-orange-400 rounded-full animate-particle-3" />
        </div>
      )}
    </div>
  );
}