import React from 'react';
import { Rocket, Battery, Flame, Target, Heart, Trophy, Brain } from 'lucide-react';

interface Topic {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TopicTagsProps {
  onSelect: (topic: string) => void;
}

const topics: Topic[] = [
  {
    id: 'how-to-play',
    label: 'How to Play the Game',
    icon: <Rocket size={16} />
  },
  {
    id: 'fuel-points',
    label: 'Fuel Points & Levels',
    icon: <Battery size={16} />
  },
  {
    id: 'boosts',
    label: 'Boosts & Burn Streaks',
    icon: <Flame size={16} />
  },
  {
    id: 'challenges',
    label: 'Challenges & Quests',
    icon: <Target size={16} />
  },
  {
    id: 'health',
    label: 'HealthScore & +HealthSpan',
    icon: <Heart size={16} />
  },
  {
    id: 'prizes',
    label: 'Prize Pools & Rewards',
    icon: <Trophy size={16} />
  },
  {
    id: 'experts',
    label: 'Reference Experts',
    icon: <Brain size={16} />
  }
];

export function TopicTags({ onSelect }: TopicTagsProps) {
  return (
    <div className="flex flex-col gap-2">
      {topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onSelect(topic.id)}
          className="flex items-center gap-2 px-3 py-2.5 bg-gray-700/50 text-gray-200 rounded-lg hover:bg-gray-700 hover:scale-102 active:scale-98 transition-all text-left group border border-gray-600/50"
        >
          <div className="text-orange-500 group-hover:scale-110 transition-transform">
            {topic.icon}
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium leading-tight">{topic.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}