import React from 'react';
import { Heart, Activity, Rocket, Clock, Target, Trophy } from 'lucide-react';

export function DashboardGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Player Health Dashboard</h3>
        <p className="text-gray-300 text-sm">
          Your comprehensive health optimization center, tracking your progress toward adding 20+ years of healthy life through the game.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-white text-sm mb-2">Key Metrics</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Heart className="text-orange-500 mt-1" size={16} />
            <div>
              <div className="text-gray-300 text-sm font-medium">+HealthSpan</div>
              <p className="text-gray-400 text-xs">Years of healthy life you're projected to add through optimization</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Activity className="text-lime-500 mt-1" size={16} />
            <div>
              <div className="text-gray-300 text-sm font-medium">HealthScore</div>
              <p className="text-gray-400 text-xs">Overall rating (1-10) combining all health categories</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Rocket className="text-orange-500 mt-1" size={16} />
            <div>
              <div className="text-gray-300 text-sm font-medium">Level</div>
              <p className="text-gray-400 text-xs">Your current game level based on Fuel Points (FP) earned</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-white text-sm mb-2">Dashboard Sections</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="text-orange-500 mt-1" size={16} />
            <div>
              <div className="text-gray-300 text-sm font-medium">Health Updates</div>
              <p className="text-gray-400 text-xs">90-day comprehensive health assessments with FP bonuses</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="text-orange-500 mt-1" size={16} />
            <div>
              <div className="text-gray-300 text-sm font-medium">Mission Progress</div>
              <p className="text-gray-400 text-xs">Track your 5-year mission to add 20+ years of healthy life</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Trophy className="text-lime-500 mt-1" size={16} />
            <div>
              <div className="text-gray-300 text-sm font-medium">Health Categories</div>
              <p className="text-gray-400 text-xs">Detailed scores and recommendations for each health area</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
        Click any section to view detailed information and track your progress
      </div>
    </div>
  );
}