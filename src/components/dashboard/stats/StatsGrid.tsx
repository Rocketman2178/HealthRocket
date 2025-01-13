import React from 'react';
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { formatCurrency } from '../../../lib/utils';
import { DashboardStats } from '../../../types/dashboard';

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        icon={Users}
        subtitle="Registered users"
        iconColor="text-health-primary"
      />

      <StatsCard
        title="Active Users"
        value={stats.activeUsers.toLocaleString()}
        icon={Activity}
        iconColor="text-health-secondary"
        showProgress={true}
        progressValue={stats.activeUsers}
        progressMax={stats.totalUsers}
      />

      <StatsCard
        title="Revenue"
        value={formatCurrency(stats.revenue)}
        icon={DollarSign}
        subtitle="Total revenue"
        iconColor="text-health-primary"
      />

      <StatsCard
        title="Growth"
        value={`+${stats.growth}%`}
        icon={TrendingUp}
        subtitle="From last month"
        iconColor="text-health-secondary"
      />
    </div>
  );
}