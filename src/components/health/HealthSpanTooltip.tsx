import React from 'react';

export function HealthSpanTooltip() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-white text-sm mb-1">About HealthSpan</h4>
        <p className="text-gray-300 text-xs">
          HealthSpan represents the number of healthy, active years you're projected to add to your life through your health optimization journey.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-white text-sm mb-1">How It's Calculated</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <div className="mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
            </div>
            <div>
              <div className="text-gray-300 font-medium text-xs">Daily Actions</div>
              <p className="text-gray-400 text-xs">Your consistent health-optimizing behaviors</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
            </div>
            <div>
              <div className="text-gray-300 font-medium text-xs">Biomarker Improvements</div>
              <p className="text-gray-400 text-xs">Measurable improvements in your health metrics</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
            </div>
            <div>
              <div className="text-gray-300 font-medium text-xs">Scientific Research</div>
              <p className="text-gray-400 text-xs">Based on longevity research and clinical studies</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}