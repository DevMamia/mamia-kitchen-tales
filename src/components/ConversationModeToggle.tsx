import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, MessageCircle, Volume2 } from 'lucide-react';
import { useHybridVoice } from '@/hooks/useHybridVoice';

interface ConversationModeToggleProps {
  mamaId: string;
  currentStepText: string;
  recipe?: any;
  subscriptionTier?: 'free' | 'premium' | 'family';
  className?: string;
}

export const ConversationModeToggle = ({ 
  mamaId, 
  currentStepText, 
  recipe, 
  subscriptionTier = 'free',
  className = ''
}: ConversationModeToggleProps) => {
  const { 
    status, 
    isConversationMode, 
    isConversationAvailable,
    toggleConversationMode,
    setSubscriptionTier 
  } = useHybridVoice();
  
  const [isToggling, setIsToggling] = useState(false);

  // Update subscription tier when prop changes
  useState(() => {
    setSubscriptionTier(subscriptionTier);
  });

  const handleToggle = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      await toggleConversationMode(mamaId, currentStepText, recipe);
    } catch (error) {
      console.error('Failed to toggle conversation mode:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const getStatusBadge = () => {
    if (status.ttsActive) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Volume2 className="w-3 h-3" />
          Reading Step
        </Badge>
      );
    }
    
    if (status.conversationActive) {
      return (
        <Badge variant="default" className="gap-1">
          <MessageCircle className="w-3 h-3" />
          Conversation Active
        </Badge>
      );
    }
    
    return null;
  };

  const getButtonText = () => {
    if (isToggling) return 'Switching...';
    if (isConversationMode) return 'End Chat';
    return 'Ask Questions';
  };

  const getButtonIcon = () => {
    if (isConversationMode) {
      return <MicOff className="w-4 h-4" />;
    }
    return <Mic className="w-4 h-4" />;
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Status Badge */}
      <div className="flex justify-center">
        {getStatusBadge()}
      </div>

      {/* Conversation Toggle Button */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleToggle}
          disabled={!isConversationAvailable || isToggling}
          variant={isConversationMode ? "outline" : "default"}
          size="sm"
          className="gap-2"
        >
          {getButtonIcon()}
          {getButtonText()}
        </Button>

        {/* Subscription Tier Info */}
        {!isConversationAvailable && (
          <div className="text-xs text-muted-foreground text-center">
            {subscriptionTier === 'free' 
              ? 'Upgrade to Premium for conversation mode'
              : 'Voice conversation not available'
            }
          </div>
        )}

        {/* Contextual Prompts */}
        {isConversationMode && (
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <div>Say "next step" to continue</div>
            <div>Ask questions about this recipe</div>
          </div>
        )}
      </div>
    </div>
  );
};