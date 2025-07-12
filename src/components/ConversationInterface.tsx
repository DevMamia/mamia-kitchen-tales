import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationInterfaceProps {
  isConnected: boolean;
  currentTranscript: string;
  partialTranscript: string;
  error: string | null;
  onStartConversation: () => void;
  onStopConversation: () => void;
}

export const ConversationInterface = ({
  isConnected,
  currentTranscript,
  partialTranscript,
  error,
  onStartConversation,
  onStopConversation
}: ConversationInterfaceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayText = partialTranscript || currentTranscript;

  return (
    <div className="space-y-3">
      {/* Live Caption Bar */}
      {(displayText || error) && (
        <Card className="p-3 bg-background/80 backdrop-blur-sm border-accent/20">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-4 h-4 mt-0.5 text-accent shrink-0" />
            <div className="flex-1 min-w-0">
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : (
                <p className={cn(
                  "text-sm",
                  partialTranscript ? "text-muted-foreground italic" : "text-foreground"
                )}>
                  {displayText}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Microphone Control */}
      <div className="flex justify-center">
        <Button
          variant={isConnected ? "destructive" : "default"}
          size="lg"
          className={cn(
            "rounded-full w-16 h-16 shadow-lg transition-all duration-200",
            isConnected && "animate-pulse scale-110 bg-destructive hover:bg-destructive/90"
          )}
          onClick={isConnected ? onStopConversation : onStartConversation}
          disabled={!!error}
        >
          {isConnected ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {error ? (
            "Voice chat unavailable"
          ) : isConnected ? (
            "Listening... Tap to end voice chat"
          ) : (
            "Tap to start voice chat with your Mama"
          )}
        </p>
      </div>
    </div>
  );
};