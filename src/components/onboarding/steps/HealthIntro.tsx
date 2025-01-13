import React from 'react';
import { Activity, ArrowRight } from 'lucide-react';
import { Logo } from '../../ui/logo';

interface HealthIntroProps {
  onContinue: () => void;
}

export function HealthIntro({ onContinue }: HealthIntroProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center">
          <Activity className="text-orange-500" size={32} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Complete Your Health Assessment
      </h2>
      
      <p className="text-gray-300 text-center mb-6">
        This will only take a minute.
      </p>

      <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-white mb-3">What We Measure:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <div className="mt-1.5">
              <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-300">
              Expected Lifespan
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1.5">
              <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-300">
              Expected HealthSpan
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1.5">
              <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-300">
              Current HealthScore
            </span>
          </li>
        </ul>
      </div>

      <button
        onClick={onContinue}
        className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center gap-2 group"
      >
        <span>Start Assessment</span>
        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}