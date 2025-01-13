import React from 'react';
import { cn } from '../../../lib/utils';

interface RocketBackgroundProps {
  stars?: boolean;
  isAnimated?: boolean;
  className?: string;
}

export function RocketBackground({ 
  stars = false,
  isAnimated = true,
  className 
}: RocketBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Star Background */}
      {stars && (
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-[#0A0A0A] w-full h-full"
          />
          {isAnimated && (
            <>
              <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle-1" />
              <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle-2" />
              <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle-3" />
            </>
          )}
        </div>
      )}
    </div>
  );
}