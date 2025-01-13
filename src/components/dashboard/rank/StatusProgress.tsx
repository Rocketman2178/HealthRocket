import React from 'react';
import { Award, Star } from 'lucide-react';
import { Progress } from '../../ui/progress';

interface StatusProgressProps {
  currentPoints: number;
  legendThresholdPoints: number;
}

export function StatusProgress({ currentPoints, legendThresholdPoints }: StatusProgressProps) {
  return (
    <div className="space-y-2">
      <Progress 
        value={currentPoints} 
        max={legendThresholdPoints}
        className="bg-gray-700 h-4"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span className="flex items-center">
          <Award className="text-lime-500 mr-1" size={14} />
          Hero Status: 2X Prize Pool
        </span>
        <span className="flex items-center">
          <Star className="text-orange-500 mr-1" size={14} />
          Legend Status: 5X Prize Pool
        </span>
      </div>
    </div>
  );
}