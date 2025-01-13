import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  iconColor?: string;
  showProgress?: boolean;
  progressValue?: number;
  progressMax?: number;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
  iconColor = 'text-health-primary',
  showProgress = false,
  progressValue,
  progressMax,
}: StatsCardProps) {
  return (
    <Card title={title} className="transition-transform hover:scale-102">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${iconColor} bg-opacity-10 bg-current`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-health-light">{value}</p>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {showProgress && progressValue !== undefined && progressMax !== undefined && (
        <div className="mt-4">
          <Progress
            value={progressValue}
            max={progressMax}
            label="Active users"
          />
        </div>
      )}
    </Card>
  );
}