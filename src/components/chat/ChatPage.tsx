import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Users } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatService } from '../../lib/chat/ChatService';
import { supabase } from '../../lib/supabase';
import type { ChatMessage as ChatMessageType } from '../../types/chat';
import type { LeaderboardEntry } from '../../types/community';
import { useSupabase } from '../../contexts/SupabaseContext';
import { ChallengePlayerList } from './ChallengePlayerList';
import { PlayerProfileModal } from '../dashboard/rank/PlayerProfileModal';

export function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null);
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerification, setIsVerification] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useSupabase();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId || !user) return;
      try {
        setLoading(true);
        // Get player count
        const { data: count, error: countError } = await supabase.rpc(
          'get_challenge_players_count',
          { p_challenge_id: chatId.replace('c_', '') }
        );

        if (countError) throw countError;
        setPlayerCount(count || 0);

        // Get messages
        const { data: messages, error } = await supabase
          .rpc('get_challenge_messages', {
            p_chat_id: `c_${chatId}`
          });

        if (error) throw error;
        
        // Transform messages to match ChatMessage type
        const transformedMessages = messages?.map(msg => ({
          id: msg.id,
          chatId: msg.chat_id || `c_${chatId}`,
          userId: msg.user_id || user.id,
          content: msg.content,
          mediaUrl: msg.media_url,
          mediaType: msg.media_type,
          isVerification: msg.is_verification,
          createdAt: new Date(msg.created_at),
          updatedAt: new Date(msg.updated_at),
          user_name: msg.user_name,
          user_avatar_url: msg.user_avatar_url
        })) || [];

        setMessages(transformedMessages);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, user]);

  // Fetch players when player list is opened
  const fetchPlayers = async () => {
    if (!chatId || !user) return;
    const challengeId = chatId.replace('c_', '');
    setLoading(true);

    try {
      // Use the test_challenge_players function
      const { data: userData, error } = await supabase
        .rpc('test_challenge_players', {
          p_challenge_id: challengeId
        });

      if (error) throw error;

      if (!userData?.length) {
        setPlayers([]);
        setLoading(false);
        return;
      }

      // Map results to LeaderboardEntry format
      const mappedPlayers: LeaderboardEntry[] = userData.map((user: any) => ({
        userId: user.user_id,
        name: user.name,
        avatarUrl: user.avatar_url,
        level: user.level
      }));

      setPlayers(mappedPlayers);
    } catch (err) {
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch players when opening player list
  useEffect(() => {
    if (showPlayerList) {
      fetchPlayers();
    }
  }, [showPlayerList]);

  // Subscribe to new messages
  useEffect(() => {
    if (!user || !chatId) return;
    let subscription: { unsubscribe: () => void };

    subscription = ChatService.subscribeToMessages(`c_${chatId}`, (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [chatId, user]);

  // Update read status when window is focused
  useEffect(() => {
    if (!user || !chatId) return;

    const updateReadStatus = () => {
      ChatService.updateReadStatus(user.id, chatId);
    };

    // Update on mount and window focus
    updateReadStatus();
    window.addEventListener('focus', updateReadStatus);

    return () => {
      window.removeEventListener('focus', updateReadStatus);
    };
  }, [chatId, user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    scrollToBottom();
    // Add small delay to ensure scroll after content renders
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSend = async (content: string, mediaFile?: File) => {
    if (!user || !chatId) return;

    try {
      let mediaUrl;
      let mediaType;

      if (mediaFile) {
        // Upload media file
        const path = `${user.id}/c_${chatId}/${Date.now()}_${mediaFile.name}`;
        const { data: uploadData, error } = await ChatService.uploadMedia(path, mediaFile);
        if (error) throw error;
        mediaUrl = uploadData.publicUrl;
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
      }

      // Send message through ChatService
      await ChatService.sendMessage(
        user.id,
        content,
        `c_${chatId}`,
        isVerification,
        mediaUrl,
        mediaType
      );


      setIsVerification(false); // Reset verification flag after sending
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleDelete = async (message: ChatMessageType) => {
    if (!user) return;
    try {
      await ChatService.deleteMessage(user.id, message.id);
      setMessages(prev => prev.filter(m => m.id !== message.id));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                <MessageCircle className="text-orange-500" size={20} />
                <h1 className="text-lg font-semibold text-white">Challenge Chat</h1>
                <button
                  onClick={() => setShowPlayerList(true)}
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  <Users size={14} />
                  <span>{playerCount} Players</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-gray-800/80 rounded-lg shadow-xl">
          <div className="h-[calc(100vh-13rem)] overflow-y-auto p-4 space-y-4 flex flex-col bg-gray-600/20">
            <div className="flex-1" />
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <MessageCircle className="mx-auto mb-2" size={24} />
                <p>No messages yet</p>
              </div>
            ) : (
              messages.map(message => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onDelete={handleDelete}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            onSend={handleSend}
            isVerification={isVerification}
            onVerificationChange={setIsVerification}
            disabled={loading}
          />
        </div>
      </div>
      
      {showPlayerList && (
        <ChallengePlayerList
          players={players}
          loading={loading}
          onClose={() => setShowPlayerList(false)}
          onPlayerSelect={(player) => {
            setSelectedPlayer(player);
            setShowPlayerList(false);
          }}
        />
      )}

      {selectedPlayer && (
        <PlayerProfileModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}