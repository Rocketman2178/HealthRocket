import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/card';

interface HealthMetricCardProps {
  icon: LucideIcon;
  value: string | number;
  unit?: string;
  label: string;
  iconColor: string;
  bgColor: string;
}

export function HealthMetricCard({ 
  icon: Icon, 
  value, 
  unit, 
  label, 
  iconColor, 
  bgColor 
}: HealthMetricCardProps) {
  return (
    <Card className={`${bgColor} relative overflow-hidden`}>
      <div className="flex items-center gap-4 p-4">
        <div className={`p-3 ${iconColor} rounded-lg shrink-0`}>
          <Icon size={24} className={iconColor.replace('bg-', 'text-').replace('/20', '')} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-2xl font-bold text-white">{value}</span>
            {unit && <span className="text-base text-white">{unit}</span>}
          </div>
          <div className="text-sm text-gray-400 whitespace-normal">{label}</div>
        </div>
      </div>
    </Card>
  );
}