import React from 'react';
import { cn } from '../../lib/utils';
import { ProgressProps } from '../../types/dashboard';

export function Progress({ 
  value = 0, 
  max = 100, 
  className, 
  label 
}: ProgressProps) {
  // Ensure value is between 0 and max
  const clampedValue = Math.max(0, Math.min(value, max));
  const percentage = (clampedValue / max) * 100;

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex justify-between text-sm text-gray-400">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div 
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-gray-700",
          className
        )}
      >
        <div
          className="h-full bg-health-primary transition-all duration-500 ease-in-out"
          style={{ 
            width: `${Math.round(percentage)}%`,
            transition: 'width 0.5s ease-in-out'
          }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}