import React, { useState, useEffect } from 'react';
import { Target, Zap, Ban, Compass, CheckCircle2, Clock, X, Award, Info, History } from 'lucide-react';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { challenges } from '../../../data';
import type { Quest } from '../../../types/dashboard';
import { QuestLibrary } from './QuestLibrary';
import { QuestCancelConfirm } from './QuestCancelConfirm';
import { CompletedQuestsModal } from './CompletedQuestsModal';
import { useCompletedActivities } from '../../../hooks/useCompletedActivities';
import { useQuestManager } from '../../../hooks/useQuestManager';
import { supabase } from '../../../lib/supabase';

interface QuestCardProps {
  userId: string | undefined;
  categoryScores: Record<string, number>;
}

export function QuestCard({ 
  userId,
  categoryScores
}: QuestCardProps) {
  const { data: completedActivities } = useCompletedActivities(userId);
  const { 
    activeQuest, 
    loading, 
    hasCompletedTier0,
    startQuest, 
    cancelQuest 
  } = useQuestManager(userId);

  const [showLibrary, setShowLibrary] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCompletedQuests, setShowCompletedQuests] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const handleCancelQuest = async () => {
    try {
      await cancelQuest();
      setShowCancelConfirm(false);
      setShowLibrary(false);
    } catch (err) {
      console.error('Error canceling quest:', err);
    }
  };

  if (loading && !activeQuest) {
    return (
      <Card className="animate-pulse">
        <div className="h-32 bg-gray-700/50 rounded-lg"></div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white">Quests</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {activeQuest ? '1' : '0'}/1 Active
          </span>
          <button
            onClick={() => setShowLibrary(true)}
            className="text-sm text-orange-500 hover:text-orange-400"
          >
            View All
          </button>
        </div>
      </div>

      {activeQuest ? (
        <Card>
          <div
            onClick={() => setShowDescription(true)}
            className="w-full text-left cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Target className="text-orange-500" size={24} />
                <div>
                <h3 className="font-bold text-white">{activeQuest.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{activeQuest.category}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCancelConfirm(true);
                    }} 
                    className="text-gray-500 hover:text-gray-400"
                    title="Cancel Quest"
                  >
                    <Ban size={14} />
                  </button>
                </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-orange-500 font-medium">{activeQuest.daysRemaining}</span>
                <span className="text-xs text-gray-400">Days Left</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-3 mt-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Requirements</span>
              <span className="text-xs text-gray-500">Progress</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-300">Complete {activeQuest?.category} Challenges</span>
                </div>
                <span className="text-sm text-orange-500">0/2</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-300">{activeQuest?.category} Daily Boosts</span>
                </div>
                <span className="text-sm text-orange-500">0/45</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Progress 
              value={activeQuest.progress}
              max={activeQuest.duration}
              className="bg-gray-700 h-2"
            />
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Progress</span>
              <div className="flex items-center gap-1">
                <Zap size={12} className="text-orange-500" />
                <span className="text-orange-500">+{activeQuest.fuelPoints} FP</span>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="relative">
          {!hasCompletedTier0 && (
            <div className="text-center text-orange-500 py-4 bg-orange-500/5 rounded-lg mb-4">
              Complete the Morning Basics Challenge to unlock all Tier 1 Quests
            </div>
          )}

          <div className="flex flex-col items-center justify-center py-2.5 space-y-1.5">
            <div className="flex items-center gap-3">
              <Target className="text-orange-500" size={24} />
              <h3 className="text-lg font-medium text-white">No Active Quests</h3>
            </div>
            <button
              disabled={!hasCompletedTier0}
              onClick={() => setShowLibrary(true)}
              className={`flex items-center gap-2 px-3.5 py-1 rounded-lg transition-colors ${
                hasCompletedTier0 
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Compass size={16} />
              {hasCompletedTier0 ? 'Select a Quest' : 'Complete First Challenge'}
            </button>
          </div>
        </Card>
      )}
      
      <div className="text-xs text-gray-400 italic text-center">
        Unlock More Quests After Completion
      </div>
      
      {/* Completed Quests Section */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Award className="text-orange-500" size={16} />
              <span>Completed Quests ({completedActivities.questsCompleted})</span>
            </h3>
          </div>
          <button
            onClick={() => setShowCompletedQuests(true)}
            className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-400 transition-colors"
          >
            <History size={14} />
            <span>View History</span>
          </button>
        </div>
      </Card>

      {showDescription && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="text-orange-500" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-white">{activeQuest?.name}</h3>
                  <p className="text-sm text-gray-400">{activeQuest?.category}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDescription(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Description</h4>
                <p className="text-sm text-gray-300">{activeQuest?.description}</p>
                {activeQuest?.expertReference && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-white mb-2">Reference Experts</h4>
                    <div className="flex items-start gap-2">
                      <Award size={16} className="text-orange-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-300">{activeQuest.expertReference}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2">Requirements</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-1.5">•</span>
                    <span>Complete 2 {activeQuest?.category} Challenges</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-1.5">•</span>
                    <span>Complete 45 {activeQuest?.category} Daily Boosts from this category</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2">Required Challenges</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Complete 2 of 3:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {quests.filter(q => q.id === activeQuest?.id)
                      .flatMap(q => q.challengeIds || [])
                      .map((challengeId, index) => {
                        const challenge = challenges.find(c => c.id === challengeId);
                        
                        return challenge ? (
                          <div 
                            key={index}
                            className="bg-gray-700/50 p-3 rounded-lg space-y-2"
                          >
                            <div>
                              <div className="text-sm text-gray-300">{challenge.name}</div>
                              <div className="text-xs text-gray-400 mt-1">{challenge.description}</div>
                              {challenge.expertReference && (
                                <div className="flex items-start gap-2 mt-2">
                                  <Award size={14} className="text-orange-500 mt-0.5 shrink-0" />
                                  <p className="text-xs text-gray-300">{challenge.expertReference}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : null;
                      })
                    }
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2">Verification Methods</h4>
                <ul className="space-y-2">
                  {activeQuest?.verificationMethods.map((method, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="mt-1.5">•</span>
                      <span>{method}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Reward:</span>
                  <div className="flex items-center gap-1">
                    <Zap size={14} className="text-orange-500" />
                    <span className="text-orange-500">+{activeQuest?.fpReward} FP</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDescription(false)}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLibrary && (
        <QuestLibrary
          userId={userId}
          activeQuestsCount={activeQuest ? 1 : 0}
          categoryScores={categoryScores}
          onStartQuest={startQuest}
          onClose={() => setShowLibrary(false)}
        />
      )}
      
      {showCancelConfirm && (
        <QuestCancelConfirm
          onConfirm={() => {
            handleCancelQuest();
          }}
          onClose={() => setShowCancelConfirm(false)}
        />
      )}
      
      {showCompletedQuests && (
        <CompletedQuestsModal
          onClose={() => setShowCompletedQuests(false)}
        />
      )}
    </div>
  );
}