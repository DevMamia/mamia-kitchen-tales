
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Pause, Play, Square, Loader2, AlertCircle, Lightbulb } from 'lucide-react';
import { VoiceListeningState, CookingContext } from '@/services/contextAwareVoiceService';
import { cn } from '@/lib/utils';

interface ContextAwareVoiceIndicatorProps {
  listeningState: VoiceListeningState;
  cookingContext: CookingContext;
  isPlaying: boolean;
  queueLength: number;
  serviceStatus: 'ready' | 'loading' | 'error' | 'disabled';
  showWakeWordPrompt: boolean;
  wakeWordPrompt: string;
  mamaName: string;
  onStopSpeaking?: () => void;
  onClearQueue?: () => void;
  className?: string;
}

export const ContextAwareVoiceIndicator: React.FC<ContextAwareVoiceIndicatorProps> = ({
  listeningState,
  cookingContext,
  isPlaying,
  queueLength,
  serviceStatus,
  showWakeWordPrompt,
  wakeWordPrompt,
  mamaName,
  onStopSpeaking,
  onClearQueue,
  className = ''
}) => {
  const getStatusIcon = () => {
    switch (serviceStatus) {
      case 'loading':
        return <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'disabled':
        return <MicOff className="h-4 w-4 text-muted-foreground" />;
      default:
        if (isPlaying) {
          return <Volume2 className="h-4 w-4 text-primary animate-pulse" />;
        }
        
        switch (listeningState) {
          case 'always_listening':
            return <Mic className="h-4 w-4 text-green-500 animate-pulse" />;
          case 'wake_word_required':
            return <Mic className="h-4 w-4 text-yellow-500" />;
          case 'processing':
            return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
          case 'responding':
            return <Volume2 className="h-4 w-4 text-primary" />;
          default:
            return <Mic className="h-4 w-4 text-muted-foreground" />;
        }
    }
  };

  const getStatusText = () => {
    switch (serviceStatus) {
      case 'loading':
        return 'Loading Voice...';
      case 'error':
        return 'Voice Error';
      case 'disabled':
        return 'Voice Disabled';
      default:
        if (isPlaying) return `${mamaName} is speaking...`;
        if (queueLength > 0) return `${queueLength} messages queued`;
        
        switch (listeningState) {
          case 'always_listening':
            return `Listening to help you cook`;
          case 'wake_word_required':
            return cookingContext === 'paused' ? 'Say "Continue" to resume' : `Say "Hey ${mamaName}" to start`;
          case 'processing':
            return 'Processing your request...';
          case 'responding':
            return `${mamaName} is responding...`;
          default:
            return 'Voice Ready';
        }
    }
  };

  const getStatusVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    switch (serviceStatus) {
      case 'error':
        return 'destructive';
      case 'loading':
        return 'secondary';
      case 'disabled':
        return 'outline';
      default:
        if (isPlaying) return 'default';
        if (listeningState === 'always_listening') return 'default';
        if (queueLength > 0) return 'secondary';
        return 'outline';
    }
  };

  const getCookingContextBadge = () => {
    const contextLabels = {
      'browsing': 'Browsing',
      'pre_cooking': 'Pre-Cooking',
      'active_cooking': 'Cooking',
      'paused': 'Paused',
      'completed': 'Complete'
    };

    const contextColors = {
      'browsing': 'bg-gray-100 text-gray-700',
      'pre_cooking': 'bg-blue-100 text-blue-700',
      'active_cooking': 'bg-green-100 text-green-700',
      'paused': 'bg-yellow-100 text-yellow-700',
      'completed': 'bg-purple-100 text-purple-700'
    };

    return (
      <Badge variant="outline" className={cn("text-xs", contextColors[cookingContext])}>
        {contextLabels[cookingContext]}
      </Badge>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Status Row */}
      <div className="flex items-center gap-2">
        {/* Status Badge */}
        <Badge variant={getStatusVariant()} className="flex items-center gap-1">
          {getStatusIcon()}
          <span className="text-xs">{getStatusText()}</span>
        </Badge>

        {/* Cooking Context Badge */}
        {getCookingContextBadge()}

        {/* Controls */}
        {serviceStatus === 'ready' && (isPlaying || queueLength > 0) && (
          <div className="flex items-center gap-1">
            {onStopSpeaking && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onStopSpeaking}
                className="h-6 w-6 p-0"
                title="Stop current audio"
              >
                <Square className="h-3 w-3" />
              </Button>
            )}
            
            {queueLength > 0 && onClearQueue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearQueue}
                className="h-6 w-6 p-0"
                title="Clear voice queue"
              >
                <Pause className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Wake Word Prompt */}
      {showWakeWordPrompt && wakeWordPrompt && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Voice Tip
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 font-handwritten">
                {wakeWordPrompt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Context-Aware Help Messages */}
      {listeningState === 'always_listening' && cookingContext === 'active_cooking' && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-700 dark:text-green-300">
            🎯 I'm listening! Say "next", "repeat", "help me", or ask questions
          </p>
        </div>
      )}
    </div>
  );
};
