import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface ChallengeMessageButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  challengeId: string;
  size?: number;
  hideCount?: boolean;
}

export function ChallengeMessageButton({ challengeId, size = 16, hideCount = false, ...props }: ChallengeMessageButtonProps) {
  const [playerCount, setPlayerCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayerCount = async () => {
      const { data: challengeData } = await supabase
        .from('challenges')
        .select('user_id')
        .eq('challenge_id', challengeId)
        .eq('status', 'active');

      setPlayerCount(challengeData?.length || 0);
    };

    fetchPlayerCount();
  }, [challengeId]);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/chat/${challengeId}`);
        }}
        className="relative p-2 text-white transition-colors rounded-lg hover:bg-gray-700/50 flex items-center gap-2 ring-1 ring-orange-500"
        {...props}
      >
        <MessageCircle size={size} />
        {!hideCount && <span className="text-sm">{playerCount} Players</span>}
      </button>
    </>
  );
}