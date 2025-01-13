import React from 'react';
import { Heart, Info } from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Tooltip } from '../ui/tooltip';
import { HealthSpanTooltip } from './HealthSpanTooltip';

interface HealthSpanCardProps {
  years: number;
  monthlyGain: number;
  totalPotential: number;
  daysUntilUpdate: number;
  projectedHealthspan: number;
  projectedMilestones: {
    projectedTotalYears: number;
  };
}

export function HealthSpanCard({ 
  years, 
  monthlyGain, 
  totalPotential,
  daysUntilUpdate,
  projectedHealthspan,
  projectedMilestones
}: HealthSpanCardProps) {
  const progress = (years / 20) * 100; // Calculate progress based on 20-year mission
  const isAvailable = daysUntilUpdate === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-white">+HealthSpan</h2>
        <Tooltip content={<HealthSpanTooltip />}>
          <Info size={16} className="text-gray-400 hover:text-gray-300" />
        </Tooltip>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Heart className="text-orange-500" size={28} />
            <div>
              <h3 className="font-bold text-white text-2xl">+{years.toFixed(1)}</h3>
              <p className="text-sm text-gray-400">Projected HealthSpan Increase</p>
            </div>
          </div>
          <div className="text-[11px] text-gray-400 ml-auto text-right">
            <div>Next Update</div>
            <div>
              <span className={isAvailable ? 'text-lime-500' : 'text-orange-500'}>
                {isAvailable ? 'Available Now!' : `${daysUntilUpdate} Days`}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progress} max={100} className="bg-gray-700 h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">5 Year Mission</span>
            <span className="text-orange-500">{years.toFixed(1)} / 20 Year Goal</span>
          </div>
        </div>
      </Card>
    </div>
  );
}