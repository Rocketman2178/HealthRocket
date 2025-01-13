import React from 'react';
import { History } from 'lucide-react';
import { useCompletedActivities } from '../../../hooks/useCompletedActivities';
import { useSupabase } from '../../../contexts/SupabaseContext';

interface CompletedQuestsFooterProps {
  onViewHistory: () => void;
}

export function CompletedQuestsFooter({ onViewHistory }: CompletedQuestsFooterProps) {
  const { user } = useSupabase();
  const { data } = useCompletedActivities(user?.id);

  if (!data.questsCompleted) return null;

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-gray-400 border-t border-gray-700/50 pt-4">
      <span>{data.questsCompleted} Quest{data.questsCompleted !== 1 ? 's' : ''} Completed</span>
      <button
        onClick={onViewHistory}
        className="flex items-center gap-1.5 text-orange-500 hover:text-orange-400 transition-colors"
      >
        <History size={14} />
        <span>View History</span>
      </button>
    </div>
  );
}