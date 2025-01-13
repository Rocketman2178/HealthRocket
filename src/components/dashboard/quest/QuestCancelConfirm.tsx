import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface QuestCancelConfirmProps {
  onConfirm: () => void;
  onClose: () => void;
}

export function QuestCancelConfirm({ onConfirm, onClose }: QuestCancelConfirmProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-orange-500" size={24} />
            <h3 className="text-lg font-semibold text-white">Cancel Quest</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-3">
          <p className="text-gray-300">Are you sure you want to cancel this quest?</p>
          <p className="text-sm text-gray-400">
            Your progress will be reset and you'll need to start over if you choose to accept this quest again.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
          >
            Keep Quest
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
}