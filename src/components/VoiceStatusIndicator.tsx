
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Pause, Play, Square, Loader2, AlertCircle } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';
import { VoiceService } from '@/services/voiceService';

interface VoiceStatusIndicatorProps {
  className?: string;
  showControls?: boolean;
}

export const VoiceStatusIndicator = ({ className = '', showControls = true }: VoiceStatusIndicatorProps) => {
  const { config, isPlaying, queueLength, stopSpeaking, clearQueue } = useVoice();
  const [audioWave, setAudioWave] = useState(false);
  const [voiceServiceStatus, setVoiceServiceStatus] = useState<'ready' | 'loading' | 'error' | 'disabled'>('loading');

  // Update voice service status
  useEffect(() => {
    const updateStatus = () => {
      const service = VoiceService.getInstance();
      setVoiceServiceStatus(service.getVoiceServiceStatus());
    };
    
    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate audio wave when speaking
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setAudioWave(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setAudioWave(false);
    }
  }, [isPlaying]);

  if (config.mode === 'text') {
    return null;
  }

  const getStatusIcon = () => {
    switch (voiceServiceStatus) {
      case 'loading':
        return <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'disabled':
        return <MicOff className="h-4 w-4 text-muted-foreground" />;
      default:
        if (isPlaying) {
          return <Volume2 className={`h-4 w-4 text-primary ${audioWave ? 'scale-110' : 'scale-100'} transition-transform`} />;
        }
        return <Mic className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (voiceServiceStatus) {
      case 'loading':
        return 'Loading Voice...';
      case 'error':
        return 'Voice Error';
      case 'disabled':
        return 'Voice Disabled';
      default:
        if (isPlaying) return 'Speaking...';
        if (queueLength > 0) return `${queueLength} queued`;
        return 'Voice Ready';
    }
  };

  const getStatusVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    switch (voiceServiceStatus) {
      case 'error':
        return 'destructive';
      case 'loading':
        return 'secondary';
      case 'disabled':
        return 'outline';
      default:
        if (isPlaying) return 'default';
        if (queueLength > 0) return 'secondary';
        return 'outline';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status Badge */}
      <Badge variant={getStatusVariant()} className="flex items-center gap-1">
        {getStatusIcon()}
        <span className="text-xs">{getStatusText()}</span>
      </Badge>

      {/* Voice Mode Indicator */}
      <Badge variant="outline" className="text-xs">
        {config.mode === 'full' ? 'Full Voice' : 'Essential'}
      </Badge>

      {/* Controls */}
      {showControls && voiceServiceStatus === 'ready' && (isPlaying || queueLength > 0) && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={stopSpeaking}
            className="h-6 w-6 p-0"
            title="Stop current audio"
          >
            <Square className="h-3 w-3" />
          </Button>
          
          {queueLength > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearQueue}
              className="h-6 w-6 p-0"
              title="Clear voice queue"
            >
              <Pause className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
