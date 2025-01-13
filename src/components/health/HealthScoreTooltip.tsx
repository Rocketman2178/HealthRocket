import React from 'react';

export function HealthScoreTooltip() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-white text-sm mb-1">About HealthScore</h4>
        <p className="text-gray-300 text-xs">
          Your HealthScore is a comprehensive rating of your overall health optimization, combining multiple factors into a single metric from 1-10.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-white text-sm mb-1">Score Components</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <div className="mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-500"></div>
            </div>
            <div>
              <div className="text-gray-300 font-medium text-xs">Category Scores</div>
              <p className="text-gray-400 text-xs">Combined ratings across all health categories</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-500"></div>
            </div>
            <div>
              <div className="text-gray-300 font-medium text-xs">Progress Tracking</div>
              <p className="text-gray-400 text-xs">Month-over-month improvements in key metrics</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-500"></div>
            </div>
            <div>
              <div className="text-gray-300 font-medium text-xs">Consistency</div>
              <p className="text-gray-400 text-xs">Regular completion of health-optimizing actions</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}