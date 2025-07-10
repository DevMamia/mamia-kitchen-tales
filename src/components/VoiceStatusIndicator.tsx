import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Pause, Play, Square } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';

interface VoiceStatusIndicatorProps {
  className?: string;
  showControls?: boolean;
}

export const VoiceStatusIndicator = ({ className = '', showControls = true }: VoiceStatusIndicatorProps) => {
  const { config, isPlaying, queueLength, stopSpeaking, clearQueue } = useVoice();
  const [audioWave, setAudioWave] = useState(false);

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
    if (!config.enabled) {
      return <MicOff className="h-4 w-4 text-muted-foreground" />;
    }
    if (isPlaying) {
      return <Mic className={`h-4 w-4 text-primary ${audioWave ? 'scale-110' : 'scale-100'} transition-transform`} />;
    }
    return <Volume2 className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (!config.enabled) return 'Voice Disabled';
    if (isPlaying) return 'Speaking...';
    if (queueLength > 0) return `${queueLength} queued`;
    return 'Voice Ready';
  };

  const getStatusVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (!config.enabled) return 'outline';
    if (isPlaying) return 'default';
    if (queueLength > 0) return 'secondary';
    return 'outline';
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
      {showControls && isPlaying && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={stopSpeaking}
            className="h-6 w-6 p-0"
          >
            <Square className="h-3 w-3" />
          </Button>
          
          {queueLength > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearQueue}
              className="h-6 w-6 p-0"
            >
              <Pause className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};