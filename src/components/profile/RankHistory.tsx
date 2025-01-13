import React from 'react';
import { Trophy } from 'lucide-react';
import { Card } from '../ui/card';

export function RankHistory() {
  return (
    <Card className="bg-gray-800/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Trophy className="text-orange-500" size={20} />
          <h3 className="text-lg font-semibold text-white">Ranking History</h3>
        </div>
        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">
          Coming Soon
        </span>
      </div>
      <p className="text-sm text-gray-400">
        Track your ranking progress and performance history over time.
      </p>
    </Card>
  );
}