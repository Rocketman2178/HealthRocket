import React from 'react';
import { TopicTags } from './TopicTags';
import { cn } from '../../lib/utils';
import { ChevronLeft } from 'lucide-react';

interface GuideMessageProps {
  message: string;
  isUserMessage: boolean;
  category?: string;
  showTopics?: boolean;
  onTopicSelect?: (message: string) => void;
  onBackToTopics?: () => void;
  showBackButton?: boolean;
  className?: string;
}

export function GuideMessage({
  message,
  isUserMessage,
  category,
  showTopics,
  onTopicSelect,
  onBackToTopics,
  showBackButton = false,
  className
}: GuideMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-2",
        isUserMessage ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          isUserMessage
            ? "bg-orange-500 text-white"
            : "bg-gray-700/80 text-gray-100"
        )}
      >
        <div className="text-sm whitespace-pre-wrap space-y-4">
          {message.split('\n\n').map((section, i) => {
            const [title, ...content] = section.split('\n');
            return content.length > 0 ? (
              <div key={i} className="space-y-2">
                <h4 className="text-orange-500 font-medium">{title}</h4>
                <div className="space-y-1 text-gray-200">
                  {content.map((line, j) => (
                    <p key={j} className={cn(
                      line.startsWith('•') && 'pl-4',
                      line.startsWith('-') && 'pl-6 text-gray-300'
                    )}>{line}</p>
                  ))}
                </div>
              </div>
            ) : (
              <p key={i}>{title}</p>
            );
          })}
        </div>
        
        {showTopics && onTopicSelect && (
          <div className="mt-4">
            <TopicTags onSelect={onTopicSelect} />
          </div>
        )}
        
        {showBackButton && onBackToTopics && (
          <button
            onClick={onBackToTopics}
            className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-gray-600/50 text-gray-300 hover:text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            <ChevronLeft size={16} />
            Back to Topics
          </button>
        )}

      </div>
    </div>
  );
}