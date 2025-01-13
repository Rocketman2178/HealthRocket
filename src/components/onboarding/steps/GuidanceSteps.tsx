import React from 'react';
import { Rocket, Heart, Award, Target, Zap, Brain, Moon, Activity, Apple, Database, Check } from 'lucide-react';

interface GuidanceStepProps {
  onContinue: () => void;
  isLoading?: boolean;
}

export function GameBasicsStep({ onContinue }: GuidanceStepProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center">
          <Rocket className="text-orange-500" size={32} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Game Basics
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Zap className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-white font-medium">Daily Boosts</p>
              <p className="text-xs text-gray-400">Complete up to 3 quick actions daily for Fuel Points (FP)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Target className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-white font-medium">Challenges</p>
              <p className="text-xs text-gray-400">21-day focused improvements in specific areas</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Award className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-white font-medium">Quests</p>
              <p className="text-xs text-gray-400">90-day transformational journeys combining challenges</p>
            </div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center gap-2 group"
        >
          <span>Continue</span>
        </button>
      </div>
    </div>
  );
}

export function HealthCategoriesStep({ onContinue }: GuidanceStepProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center">
          <Heart className="text-orange-500" size={32} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Health Categories
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Brain className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-white font-medium">Mindset</p>
              <p className="text-xs text-gray-400">Mental resilience and cognitive performance</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Moon className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-white font-medium">Sleep</p>
              <p className="text-xs text-gray-400">Recovery optimization and circadian enhancement</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Activity className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-white font-medium">Exercise</p>
              <p className="text-xs text-gray-400">Physical performance and longevity training</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Apple className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-white font-medium">Nutrition</p>
              <p className="text-xs text-gray-400">Metabolic optimization and precision fueling</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Database className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-white font-medium">Biohacking</p>
              <p className="text-xs text-gray-400">Health optimization and performance technology</p>
            </div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center gap-2 group"
        >
          <span>Continue</span>
        </button>
      </div>
    </div>
  );
}

export function LaunchStep({ onContinue, isLoading }: GuidanceStepProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center">
          <Rocket className="text-orange-500" size={32} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Your First Mission!
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-1">
              <Check className="text-white" size={14} />
            </div>
            <div>
              <p className="text-sm text-white font-medium">Complete Daily Boosts</p>
              <p className="text-xs text-gray-400">Build momentum with quick daily actions</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-1">
              <Check className="text-white" size={14} />
            </div>
            <div>
              <p className="text-sm text-white font-medium">Achieve a Burn Streak of 3 Days</p>
              <p className="text-xs text-gray-400">Complete at least one boost daily</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-1">
              <Check className="text-white" size={14} />
            </div>
            <div>
              <p className="text-sm text-white font-medium">Select Your First Challenge</p>
              <p className="text-xs text-gray-400">Begin with Morning Basics to unlock more</p>
            </div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Launching...</span>
            </div>
          ) : (
            <>
              <span>Launch</span>
              <Rocket size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}