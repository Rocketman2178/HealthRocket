import React from 'react';
import { Target, Clock, Trophy } from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import type { HealthMilestone } from '../../lib/health/types';

interface MissionProgressProps {
  yearsGained: number;
  missionProgress: number;
  nextMilestone: HealthMilestone;
  missionTimeRemaining: number;
}

export function MissionProgress({
  yearsGained,
  missionProgress,
  nextMilestone,
  missionTimeRemaining
}: MissionProgressProps) {
  const progressPercentage = missionProgress * 100;
  const timeRemainingYears = Math.floor(missionTimeRemaining);
  const timeRemainingMonths = Math.round((missionTimeRemaining % 1) * 12);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Target className="text-orange-500" size={24} />
          <div>
            <h3 className="text-lg font-bold text-white">5-Year Mission</h3>
            <p className="text-sm text-gray-400">Add 20+ Years to Your Life</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-lg">
          <Clock className="text-orange-500" size={16} />
          <span className="text-sm">
            <span className="text-white font-medium">
              {timeRemainingYears}y {timeRemainingMonths}m
            </span>
            <span className="text-gray-400"> remaining</span>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Progress value={progressPercentage} max={100} className="bg-gray-700 h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Mission Progress</span>
            <span className="text-orange-500">{progressPercentage.toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <Trophy className="text-lime-500" size={20} />
            <div>
              <div className="text-sm text-gray-400">Next Milestone</div>
              <div className="text-white font-medium">+{nextMilestone.years} Years</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Years Remaining</div>
            <div className="text-orange-500 font-medium">
              {nextMilestone.yearsRemaining.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}