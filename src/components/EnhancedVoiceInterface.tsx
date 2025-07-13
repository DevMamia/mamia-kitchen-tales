import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, VolumeX, Volume2, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Mama } from '@/data/mamas';

interface EnhancedVoiceInterfaceProps {
  mama: Mama;
  isConnected: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  currentTranscript: string;
  partialTranscript: string;
  error: string | null;
  currentStep: number;
  totalSteps: number;
  onStartConversation: () => void;
  onStopConversation: () => void;
  onInterrupt: () => void;
}

type VoiceState = 'idle' | 'listening' | 'speaking' | 'thinking' | 'interrupted';

export const EnhancedVoiceInterface = ({
  mama,
  isConnected,
  isSpeaking,
  isListening,
  currentTranscript,
  partialTranscript,
  error,
  currentStep,
  totalSteps,
  onStartConversation,
  onStopConversation,
  onInterrupt
}: EnhancedVoiceInterfaceProps) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');

  // Update voice state based on props
  useEffect(() => {
    if (error) {
      setVoiceState('idle');
    } else if (isSpeaking) {
      setVoiceState('speaking');
    } else if (isListening || partialTranscript) {
      setVoiceState('listening');
    } else if (isConnected) {
      setVoiceState('thinking');
    } else {
      setVoiceState('idle');
    }
  }, [error, isSpeaking, isListening, partialTranscript, isConnected]);

  const getStateConfig = (state: VoiceState) => {
    switch (state) {
      case 'listening':
        return {
          icon: Mic,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          animation: 'animate-pulse',
          message: "I'm listening, amore..."
        };
      case 'speaking':
        return {
          icon: Volume2,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          animation: 'animate-bounce',
          message: `${mama.name} is speaking`
        };
      case 'thinking':
        return {
          icon: Mic,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          animation: 'animate-pulse',
          message: "Thinking..."
        };
      case 'interrupted':
        return {
          icon: Square,
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30',
          animation: '',
          message: "Sì, tesoro?"
        };
      default:
        return {
          icon: MicOff,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-muted',
          animation: '',
          message: `Tap to talk with ${mama.name}`
        };
    }
  };

  const stateConfig = getStateConfig(voiceState);
  const Icon = stateConfig.icon;
  const displayText = partialTranscript || currentTranscript;

  return (
    <div className="space-y-4">
      {/* Progress Context */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps} • Voice Cooking Mode
        </p>
      </div>

      {/* Live Caption Bar */}
      {(displayText || error) && (
        <Card className={cn(
          "p-4 transition-all duration-300",
          error ? "bg-destructive/10 border-destructive/20" : "bg-background/80 backdrop-blur-sm border-accent/20"
        )}>
          <div className="text-center">
            {error ? (
              <p className="text-sm text-destructive font-medium">{error}</p>
            ) : (
              <p className={cn(
                "text-sm",
                partialTranscript ? "text-muted-foreground italic" : "text-foreground font-medium"
              )}>
                {displayText}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Large Voice Indicator */}
      <div className="flex flex-col items-center space-y-4">
        <div
          className={cn(
            "relative w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300",
            stateConfig.bgColor,
            stateConfig.borderColor,
            stateConfig.animation
          )}
        >
          {/* Cultural styling ring */}
          <div className="absolute inset-0 rounded-full border-2 border-orange-200 dark:border-orange-800 opacity-50" />
          
          {/* Main icon */}
          <Icon className={cn("w-12 h-12", stateConfig.color)} />
          
          {/* Mama emoji overlay */}
          <div className="absolute -top-2 -right-2 text-2xl bg-background rounded-full p-1 border-2 border-background">
            {mama.emoji}
          </div>
        </div>

        {/* State Message */}
        <div className="text-center">
          <p className={cn(
            "text-lg font-medium font-handwritten",
            voiceState === 'speaking' ? "text-blue-600 dark:text-blue-400" : "text-foreground"
          )}>
            {stateConfig.message}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {/* Main Voice Button */}
        <Button
          variant={isConnected ? "destructive" : "default"}
          size="lg"
          className={cn(
            "w-20 h-20 rounded-full text-lg font-bold transition-all duration-200",
            isConnected && "scale-110"
          )}
          onClick={isConnected ? onStopConversation : onStartConversation}
          disabled={!!error}
        >
          {isConnected ? "Stop" : "Start"}
        </Button>

        {/* Emergency Interrupt Button */}
        {isConnected && (
          <Button
            variant="outline"
            size="lg"
            className="w-20 h-20 rounded-full bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20"
            onClick={onInterrupt}
          >
            <Square className="w-6 h-6 text-orange-600" />
          </Button>
        )}
      </div>

      {/* Cultural Interaction Hints */}
      <Card className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200">
        <div className="text-center space-y-1">
          <p className="text-xs text-orange-700 dark:text-orange-300 font-handwritten">
            {voiceState === 'idle' && `Try: "Hello ${mama.name}!" or "What are we cooking?"`}
            {voiceState === 'listening' && "Say 'next', 'repeat', or ask a question!"}
            {voiceState === 'speaking' && "Interrupt anytime by tapping the orange button"}
            {voiceState === 'thinking' && "Processing your request..."}
          </p>
        </div>
      </Card>
    </div>
  );
};