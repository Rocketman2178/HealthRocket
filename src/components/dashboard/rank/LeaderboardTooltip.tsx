import React from 'react';
import { Trophy, Award, Gift } from 'lucide-react';

export function LeaderboardTooltip() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-white text-sm mb-1">Status & Rankings</h4>
        <p className="text-gray-300 text-xs">
          Your rank and status are calculated based on your Fuel Points (FP) earned compared to other players in your community.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-white text-sm mb-1">Status Levels</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Trophy size={14} className="text-orange-500 mt-1" />
            <div>
              <div className="text-gray-300 font-medium text-xs">Legend Status (Top 10%)</div>
              <p className="text-gray-400 text-xs">5X Prize Pool Multiplier</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Award size={14} className="text-lime-500 mt-1" />
            <div>
              <div className="text-gray-300 font-medium text-xs">Hero Status (Top 50%)</div>
              <p className="text-gray-400 text-xs">2X Prize Pool Multiplier</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Trophy size={14} className="text-gray-400 mt-1" />
            <div>
              <div className="text-gray-300 font-medium text-xs">Commander Status</div>
              <p className="text-gray-400 text-xs">Base Prize Pool Eligibility</p>
            </div>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-white text-sm mb-1">Monthly Prizes</h4>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Gift size={14} className="text-orange-500 mt-1" />
            <div className="text-gray-400 text-xs">
              Prizes are awarded monthly based on your status level and prize pool multiplier
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Gift size={14} className="text-orange-500 mt-1" />
            <div className="text-gray-400 text-xs">
              Pro Plan members are eligible for monthly prize pools
            </div>
          </li>
        </ul>
      </div>

      <div className="text-[10px] text-gray-400 pt-2 border-t border-gray-700">
        Rankings update daily based on your community's performance
      </div>
    </div>
  );
}