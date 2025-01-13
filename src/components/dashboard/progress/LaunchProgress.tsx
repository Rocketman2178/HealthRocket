import React from 'react';
import { Rocket } from 'lucide-react';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';

interface LaunchProgressProps {
  fuelPoints: number;
  nextLevelPoints: number;
}

export function LaunchProgress({ fuelPoints, nextLevelPoints }: LaunchProgressProps) {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <Rocket className="text-orange-500" size={28} />
          <h2 className="text-xl font-bold text-white">Launch Progress</h2>
        </div>
        <div className="text-gray-400">
          {fuelPoints} / {nextLevelPoints} FP
        </div>
      </div>
      <Progress value={fuelPoints} max={nextLevelPoints} className="bg-gray-700" />
    </Card>
  );
}