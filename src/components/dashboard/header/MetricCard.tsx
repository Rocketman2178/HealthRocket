import React from 'react';
import { Bell } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  showNotification?: boolean;
}

export function MetricCard({ icon, label, value, showNotification }: MetricCardProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 bg-gray-700/50 px-3 py-2 sm:px-4 sm:py-3 rounded-lg w-full">
      <div className="flex items-center justify-center relative">
        {icon}
        {showNotification && (
          <div className="absolute -top-1 -right-1">
            <Bell className="text-lime-500 fill-current animate-pulse" size={12} />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center min-w-0">
        <span className="text-xs sm:text-sm text-gray-400 leading-none truncate text-center">{label}</span>
        <span className="text-sm sm:text-base font-semibold text-white leading-tight truncate text-center">{value}</span>
      </div>
    </div>
  );
}