import React, { useState } from 'react';
import { X, Heart, Activity, Info } from 'lucide-react';
import { Card } from '../ui/card';
import { Tooltip } from '../ui/tooltip';
import { Logo } from '../ui/logo';
import type { CategoryScores } from '../../lib/health/types';

interface HealthUpdateFormProps {
  onClose: () => void;
  onSubmit: (data: HealthUpdateData) => void;
  loading?: boolean;
  error?: Error | null;
  isOnboarding?: boolean;
}

interface HealthUpdateData {
  expectedLifespan: number;
  expectedHealthspan: number;
  categoryScores: CategoryScores;
}

export function HealthUpdateForm({ 
  onClose, 
  onSubmit, 
  loading = false, 
  error = null,
  isOnboarding = false 
}: HealthUpdateFormProps) {
  const [formData, setFormData] = useState<HealthUpdateData>({
    expectedLifespan: 85,
    expectedHealthspan: 75,
    categoryScores: {
      mindset: 5,
      sleep: 5,
      exercise: 5,
      nutrition: 5,
      biohacking: 5
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSubmit(formData);
    } catch (err) {
      console.error('Form validation error:', err);
      // Let parent component handle errors
    }
  };

  const handleScoreChange = (category: keyof CategoryScores, value: number) => {
    setFormData(prev => ({
      ...prev,
      categoryScores: {
        ...prev.categoryScores,
        [category]: value
      }
    }));
  };

  const renderScoreTooltip = (category: string) => {
    const tooltips = {
      mindset: "Rate your mental well-being, stress management, and cognitive performance",
      sleep: "Evaluate your sleep quality, duration, and recovery effectiveness",
      exercise: "Assess your physical activity level, strength, and endurance",
      nutrition: "Rate your diet quality, eating habits, and nutritional balance",
      biohacking: "Evaluate your use of health optimization tools and technologies"
    };
    return tooltips[category as keyof typeof tooltips];
  };

  return (
    <div className={isOnboarding ? '' : 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'}>
      <div className={`w-full max-w-lg bg-gray-800 rounded-lg shadow-xl ${isOnboarding ? 'mt-0' : ''}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Activity className="text-orange-500" size={24} />
            <h2 className="text-xl font-bold text-white mb-1">
              {isOnboarding ? 'Complete Health Assessment' : 'Update Health Profile'}
            </h2>
          </div>
          {!isOnboarding && <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>}
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Life Expectancy Section */}
          <Card className="p-4 bg-gray-700/50">
            <div className="flex flex-col gap-2 mb-4">
              <Heart className="text-orange-500" size={20} />
              <h3 className="text-lg font-bold text-white">Lifespan and HealthSpan</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex flex-col gap-2 mb-2">
                  <label className="text-sm text-gray-300">Expected Lifespan</label>
                  <p className="text-xs text-gray-400">Your estimated total lifespan based on current health trajectory and family history. Enter a value of 50 or greater.</p>
                </div>
                <input
                  type="number"
                  min="50"
                  max="200"
                  value={formData.expectedLifespan}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedLifespan: +e.target.value }))}
                  className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <div className="flex flex-col gap-2 mb-2">
                  <label className="text-sm text-gray-300">Expected HealthSpan</label>
                  <p className="text-xs text-gray-400">The number of years you expect to maintain good health, mobility, and independence. Enter a value of 50 or greater, but less than your Expected Lifespan.</p>
                </div>
                <input
                  type="number"
                  min="50"
                  max={Math.min(formData.expectedLifespan, 200)}
                  value={formData.expectedHealthspan}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedHealthspan: +e.target.value }))}
                  className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          </Card>

          {/* Health Categories Section */}
          <Card className="p-4 bg-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4">Health Categories</h3>
            <div className="space-y-4">
              {Object.entries(formData.categoryScores).map(([category, score]) => (
                <div key={category}>
                  <div className="flex flex-col gap-2 mb-2">
                    <label className="text-sm text-gray-300 capitalize">{category}</label>
                    <p className="text-xs text-gray-400">{renderScoreTooltip(category)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={score}
                      onChange={(e) => handleScoreChange(category as keyof CategoryScores, +e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-white font-medium w-12 text-right">
                      {score.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {error && (
            <div className="text-sm text-red-400 text-center">
              {error.message}
            </div>
          )}

          <div className="flex justify-end gap-3">
            {!isOnboarding && <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {loading ? 'Processing...' : isOnboarding ? 'Complete Assessment' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}