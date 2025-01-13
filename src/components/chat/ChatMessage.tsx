import React from 'react';
import { User, Check, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useSupabase } from '../../contexts/SupabaseContext';
import type { ChatMessage as ChatMessageType } from '../../types/chat';
import { cn } from '../../lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  onDelete?: (message: ChatMessageType) => void;
  className?: string;
}

export function ChatMessage({ message, onDelete, className }: ChatMessageProps) {
  const { user } = useSupabase();
  const isOwnMessage = user?.id === message.userId;

  return (
    <div className={cn("flex flex-col gap-1 mb-4", className)}>
      {/* Message Container */}
      <div className={cn(
        "flex items-end gap-2",
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar - only show for other users */}
        {!isOwnMessage && (
          message.user_avatar_url ? (
            <img 
              src={message.user_avatar_url} 
              alt={message.user_name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="text-gray-400" size={16} />
            </div>
          )
        )}

        {/* Message Content */}
        <div className="max-w-[75%] space-y-1">
          {/* Content */}
          <div className={cn(
            "px-3 py-2 rounded-lg break-words relative border border-orange-500/20",
            isOwnMessage
              ? "bg-gray-800 text-white rounded-tr-none"
              : "bg-gray-700 text-white rounded-tl-none"
          )}>
            {/* Verification Badge */}
            {message.isVerification && (
              <div className={cn(
                "absolute -top-2 right-2 bg-lime-500/20 text-lime-500 px-1.5 py-0.5 rounded text-[10px] font-medium",
                isOwnMessage ? "-right-2" : "-left-2"
              )}>
                <div className="flex items-center gap-1">
                  <Check size={10} />
                  <span>Verification</span>
                </div>
              </div>
            )}

            {/* Name and Verification Badge */}
            {!isOwnMessage && (
              <div className="text-xs text-orange-500 font-medium mb-1">
                {message.user_name || 'Unknown User'}
              </div>
            )}

            {/* Media */}
            {message.mediaUrl && (
              <div className="mt-2">
                {message.mediaType === 'image' ? (
                  <img 
                    src={message.mediaUrl} 
                    alt="Message attachment"
                    className="max-w-sm max-h-[200px] object-contain rounded-lg"
                    loading="lazy"
                  />
                ) : message.mediaType === 'video' ? (
                  <video
                    src={message.mediaUrl}
                    controls
                    className="max-w-sm max-h-[200px] object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <ImageIcon size={16} />
                    <span>Media attachment</span>
                  </div>
                )}
              </div>
            )}

            {message.content}

            {/* Timestamp and Actions */}
            <div className={cn(
              "flex items-center gap-2 mt-1",
              isOwnMessage ? "justify-end" : "justify-start"
            )}>
              <span className="text-[10px] text-gray-400">
                {new Date(message.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
              {isOwnMessage && onDelete && (
                <button
                  onClick={() => onDelete(message)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}