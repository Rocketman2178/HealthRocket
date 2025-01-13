import React from 'react';
import { Rocket, Heart, Award, ArrowRight, Trophy } from 'lucide-react';
import { Logo } from '../../ui/logo';

interface MissionIntroProps {
  onAccept: () => void;
}

export function MissionIntro({ onAccept }: MissionIntroProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center">
          <Rocket className="text-orange-500" size={32} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-2">
        Your Mission:
      </h2>

      <div className="space-y-6">
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-bold text-orange-500">
            Add 20+ Years of Healthy Life
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Launching HealthSpan for Business Leaders
          </p> 
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Heart className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-white font-medium">Extend Your Healthspan</p>
              <p className="text-xs text-gray-400">Add decades of healthy years to your life</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Award className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-white font-medium">Expert-Driven Guidance</p>
              <p className="text-xs text-gray-400">Follow proven protocols from leading experts</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Trophy className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-white font-medium">Win Exclusive Prizes</p>
              <p className="text-xs text-gray-400">A gamified approach to level up your health</p>
            </div>
          </div>

        </div>

        <button
          onClick={onAccept}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center gap-2 group"
        >
          <span>Accept Mission</span>
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}