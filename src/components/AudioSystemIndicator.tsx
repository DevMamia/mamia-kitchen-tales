import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Volume2, MessageCircle, Mic, MicOff } from 'lucide-react';
import { useHybridVoice } from '@/hooks/useHybridVoice';

interface AudioSystemIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export const AudioSystemIndicator = ({ 
  className = '',
  showDetails = false 
}: AudioSystemIndicatorProps) => {
  const { status, isConversationMode } = useHybridVoice();
  const [isListening, setIsListening] = useState(false);

  // Simulate listening state for conversation mode
  useEffect(() => {
    if (isConversationMode && status.conversationActive) {
      const interval = setInterval(() => {
        setIsListening(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setIsListening(false);
    }
  }, [isConversationMode, status.conversationActive]);

  const getMainIndicator = () => {
    if (status.ttsActive) {
      return {
        icon: <Volume2 className="w-4 h-4 animate-pulse" />,
        text: 'Mama Speaking',
        variant: 'secondary' as const,
        className: 'bg-primary/10 text-primary border-primary/20'
      };
    }

    if (status.conversationActive) {
      return {
        icon: isListening ? <Mic className="w-4 h-4 animate-pulse text-red-500" /> : <MessageCircle className="w-4 h-4" />,
        text: isListening ? 'Listening...' : 'Ready to Chat',
        variant: 'default' as const,
        className: 'bg-green-500/10 text-green-600 border-green-500/20'
      };
    }

    return null;
  };

  const mainIndicator = getMainIndicator();

  if (!mainIndicator) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Badge 
        variant={mainIndicator.variant}
        className={`gap-2 px-3 py-1 ${mainIndicator.className}`}
      >
        {mainIndicator.icon}
        {mainIndicator.text}
      </Badge>

      {showDetails && (
        <div className="flex gap-2 justify-center">
          {status.canInterrupt && (
            <Badge variant="outline" className="text-xs">
              Tap to interrupt
            </Badge>
          )}
          
          {isConversationMode && (
            <Badge variant="outline" className="text-xs">
              Voice commands active
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};