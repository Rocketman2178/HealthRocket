import React from 'react';
import { X, Target, Zap, ChevronDown, ChevronUp, Brain, Moon, Activity, Apple, Database, Award } from 'lucide-react';
import { quests, challenges, experts } from '../../../data';
import type { Quest } from '../../../types/game';
import { supabase } from '../../../lib/supabase';

interface QuestLibraryProps {
  userId: string | undefined;
  categoryScores: Record<string, number>;
  activeQuestsCount: number;
  onStartQuest: (questId: string) => Promise<void>;
  onClose: () => void;
}

export function QuestLibrary({ userId, categoryScores, activeQuestsCount, onStartQuest, onClose }: QuestLibraryProps) {
  const [expandedQuest, setExpandedQuest] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedQuest, setSelectedQuest] = React.useState<Quest | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [hasCompletedTier0, setHasCompletedTier0] = React.useState(false);
  const [completedQuestIds, setCompletedQuestIds] = React.useState<string[]>([]);

  const handleQuestStart = async (questId: string) => {
    try {
      // Get quest details before starting
      const questDetails = quests.find(q => q.id === questId);
      if (!questDetails) {
        throw new Error('Quest not found');
      }

      // Only pass the ID to start the quest
      await onStartQuest(questId);
      onClose();
    } catch (err) {
      console.error('Error starting quest:', err);
    }
  };

  // Auto-select category based on recommended challenges
  React.useEffect(() => {
    setLoading(false);
  }, [userId]);

  // Check if Tier 0 is completed
  React.useEffect(() => {
    async function checkTier0() {
      if (!userId) return;
      
      const { data } = await supabase
        .from('completed_challenges')
        .select('*')
        .eq('user_id', userId)
        .eq('challenge_id', 'tc0')
        .eq('status', 'completed')
        .maybeSingle();

      setHasCompletedTier0(!!data);
    }

    checkTier0();
  }, [userId]);

  // Check if all tier 1 quests are completed for a category
  const hasCompletedTier1 = React.useMemo(() => {
    if (!selectedCategory) return false;
    const categoryQuests = quests.filter(q => 
      q.category?.toLowerCase() === selectedCategory.toLowerCase() &&
      q.tier === 1
    );
    return categoryQuests.every(q => q.status === 'completed');
  }, [selectedCategory]);

  const categories = [
    { id: 'mindset', name: 'Mindset', icon: Brain },
    { id: 'sleep', name: 'Sleep', icon: Moon },
    { id: 'exercise', name: 'Exercise', icon: Activity },
    { id: 'nutrition', name: 'Nutrition', icon: Apple },
    { id: 'biohacking', name: 'Biohacking', icon: Database }
  ];

  const filteredQuests = React.useMemo(() => {
    if (!selectedCategory) return [];
    return quests.filter(quest => 
      quest.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Get current active quests count
  const maxQuests = 1; // Current cap is 1

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Target className="text-orange-500" size={20} />
            <div>
              <h2 className="text-xl font-bold text-white">Available Quests</h2>
              <p className="text-sm text-gray-300 mt-1">Select a Category to Explore</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-300"
          > 
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-4 border-b border-gray-700">
          {categories.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(selectedCategory === id ? null : id)}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors text-center ${
                selectedCategory === id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Icon size={16} />
              <span className="text-xs">{name}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!selectedCategory && !hasCompletedTier0 && (
            <div className="text-center text-orange-500 py-4 bg-orange-500/5 rounded-lg mb-4">
              Complete the Morning Basics Challenge to unlock all Tier 1 Quests
            </div>
          )}

          {!selectedCategory && (
            <div className="text-center text-gray-400 py-8">
              <p className="text-sm">Choose a category above to view available quests</p>
              <p className="text-xs text-gray-500 mt-2">Tier 2 quests unlock after completing Tier 1</p>
            </div>
          )}

          {filteredQuests.map(quest => (
            <div
              key={quest.id}
              className={`bg-gray-700/50 rounded-lg overflow-hidden ${
                quest.tier === 2 && !hasCompletedTier1 ? 'opacity-50' : ''
              }`}
            >
              <button
                onClick={() => setExpandedQuest(
                  expandedQuest === quest.id ? null : quest.id
                )}
                className="w-full text-left p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-orange-500">
                        <Zap size={14} />
                        <span className="text-sm font-medium">+{quest.fuelPoints} FP</span>
                      </div>
                      <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {quest.tier === 2 && (
                          <span className="text-xs bg-orange-500/10 px-2 py-0.5 rounded text-orange-500">
                            Pro
                          </span>
                        )}
                        {quest.tier === 2 && !hasCompletedTier1 && (
                          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">
                            Locked
                          </span>
                        )}
                      </div>
                      <ChevronDown className="text-gray-400" size={16} />
                      </div>
                    </div>
                    <h3 className="font-bold text-white">{quest.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-400">{quest.category}</span>
                      {quest.expertIds?.length > 0 && (
                        <>
                          <div className="flex items-center gap-1 text-xs text-orange-500">
                            <Award size={12} className="shrink-0" />
                            <span>{experts[quest.expertIds[0]]?.name}</span>
                          </div>
                        </>
                      )}
                      {completedQuestIds.includes(quest.id) && (
                        <span className="text-xs bg-lime-500/20 px-2 py-0.5 rounded text-lime-500">Completed</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {expandedQuest === quest.id && (
                <div className="px-4 pb-4 space-y-4 border-t border-gray-600/50 pt-4">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Description</h4>
                    <p className="text-sm text-gray-300">{quest.description}</p>
                  </div>
                  
                  {quest.expertReference && (
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">Expert Protocol</h4>
                      <div className="flex items-start gap-2 bg-gray-700/50 p-3 rounded-lg">
                        <Award size={16} className="text-orange-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-300">{quest.expertReference}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Requirements</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="mt-1.5">•</span>
                        <span>Complete 2 {quest.category} Challenges</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="mt-1.5">•</span>
                        <span>Complete 45 {quest.category} Daily Boosts</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Required Challenges</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-300">Complete 2 of 3:</span>
                        {quest.challengeIds?.map((challengeId) => {
                          const challenge = challenges.find(c => c.id === challengeId);
                          
                          if (!challenge) return null;
                          
                          return (
                            <div key={challengeId} className="bg-gray-700/50 p-3 rounded-lg mt-2">
                              <div className="text-sm text-gray-300">{challenge.name}</div>
                              <div className="text-xs text-gray-400 mt-1">{challenge.description}</div>
                              {challenge.expertIds?.length > 0 && (
                                <div className="flex items-start gap-2 mt-2">
                                  <Award size={14} className="text-orange-500 mt-0.5 shrink-0" />
                                  <div className="space-y-0.5">
                                    <p className="text-xs text-gray-300">
                                      {challenge.expertIds.map(id => experts[id]?.name).join(' & ')}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {challenge.expertIds.map(id => experts[id]?.reference).join(' • ')}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Verification Methods</h4>
                    <ul className="space-y-2">
                      {quest.verificationMethods.map((method, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="mt-1.5">•</span>
                          <span>{method}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {quest.status === 'available' && (
                    <div className="flex justify-end">
                      <button
                        disabled={
                          activeQuestsCount >= maxQuests || 
                          (quest.tier === 2 && !hasCompletedTier1) ||
                          (!hasCompletedTier0 && quest.tier === 1)
                        }
                        onClick={() => {
                          handleQuestStart(quest.id);
                        }}
                        className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                          activeQuestsCount >= maxQuests || 
                          (quest.tier === 2 && !hasCompletedTier1) ||
                          (!hasCompletedTier0 && quest.tier === 1)
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        {quest.tier === 2 && !hasCompletedTier1 
                          ? 'Complete Tier 1 First' 
                          : !hasCompletedTier0 && quest.tier === 1
                          ? 'Complete First Challenge'
                          : activeQuestsCount >= maxQuests 
                            ? 'No Slots Available' 
                            : 'Launch Quest'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}