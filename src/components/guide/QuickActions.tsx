import React from 'react';
import { HelpCircle, MessageCircle, Star, Activity } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  message: string;
}

interface QuickActionsProps {
  onActionSelect: (message: string) => void;
}

const quickActions: QuickAction[] = [
  {
    id: 'help',
    label: 'Game Help',
    icon: <HelpCircle size={14} />,
    message: 'I need help understanding how to play the game.'
  },
  {
    id: 'health',
    label: 'Health Tips',
    icon: <Activity size={14} />,
    message: 'Can you give me some health optimization tips?'
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: <Star size={14} />,
    message: 'I\'d like to provide feedback about the game.'
  },
  {
    id: 'chat',
    label: 'Just Chat',
    icon: <MessageCircle size={14} />,
    message: 'I\'d like to have a general conversation.'
  }
];

export function QuickActions({ onActionSelect }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionSelect(action.message)}
          className="flex items-center gap-2 px-3 py-2 text-xs bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          {action.icon}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}