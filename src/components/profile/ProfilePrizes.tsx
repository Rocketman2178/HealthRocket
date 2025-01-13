import React from 'react';
import { Gift } from 'lucide-react';
import { Card } from '../ui/card';

export function ProfilePrizes() {
  return (
    <Card className="bg-gray-800/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Gift className="text-orange-500" size={20} />
          <h3 className="text-lg font-semibold text-white">Prize History</h3>
        </div>
        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">
          Coming Soon
        </span>
      </div>
      <p className="text-sm text-gray-400">
        View your earned prizes and rewards from community competitions.
      </p>
    </Card>
  );
}