import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Mic, MicOff, Settings, Play, Square } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';
import { MAMA_VOICES, MamaVoice } from '@/services/voiceService';

export const VoiceConfigPanel = () => {
  const { config, updateConfig, isPlaying, queueLength, clearQueue, stopSpeaking } = useVoice();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleModeChange = (mode: 'full' | 'essential' | 'text') => {
    updateConfig({ mode });
  };

  const handleVolumeChange = (volume: number[]) => {
    updateConfig({ volume: volume[0] });
  };

  const handleSpeedChange = (speed: number[]) => {
    updateConfig({ speed: speed[0] });
  };

  const handleEnabledToggle = (enabled: boolean) => {
    updateConfig({ enabled });
    if (!enabled) {
      clearQueue();
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'full':
        return 'AI generates speech for all instructions';
      case 'essential':
        return 'Pre-recorded phrases for common actions';
      case 'text':
        return 'Text-only with Mama character display';
      default:
        return '';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'full':
        return 'bg-primary';
      case 'essential':
        return 'bg-secondary';
      case 'text':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Voice Settings
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Voice Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.enabled ? (
              isPlaying ? (
                <Mic className="h-4 w-4 text-primary animate-pulse" />
              ) : (
                <Mic className="h-4 w-4 text-muted-foreground" />
              )
            ) : (
              <MicOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              {isPlaying ? 'Speaking...' : 'Ready'}
            </span>
          </div>
          
          {queueLength > 0 && (
            <Badge variant="secondary">
              {queueLength} in queue
            </Badge>
          )}
          
          {isPlaying && (
            <Button
              variant="outline"
              size="sm"
              onClick={stopSpeaking}
              className="h-7 px-2"
            >
              <Square className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Voice Mode Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Voice Mode</Label>
          <div className="grid gap-2">
            {(['full', 'essential', 'text'] as const).map((mode) => (
              <div
                key={mode}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  config.mode === mode 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => handleModeChange(mode)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${config.mode === mode ? getModeColor(mode) : 'bg-muted'}`} />
                    <span className="font-medium capitalize">{mode} Voice Mode</span>
                  </div>
                  {config.mode === mode && <Badge variant="secondary">Active</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-4">
                  {getModeDescription(mode)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Master Enable/Disable */}
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-enabled" className="text-sm font-medium">
                Voice Enabled
              </Label>
              <Switch
                id="voice-enabled"
                checked={config.enabled}
                onCheckedChange={handleEnabledToggle}
              />
            </div>

            {/* Volume Control */}
            {config.enabled && config.mode !== 'text' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    {config.volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    Volume
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(config.volume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[config.volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}

            {/* Speed Control */}
            {config.enabled && config.mode !== 'text' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Speech Speed</Label>
                  <span className="text-sm text-muted-foreground">
                    {config.speed}x
                  </span>
                </div>
                <Slider
                  value={[config.speed]}
                  onValueChange={handleSpeedChange}
                  max={1.2}
                  min={0.8}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}

            {/* Voice Preview */}
            {config.enabled && config.mode !== 'text' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Voice Preview</Label>
                <div className="grid gap-2">
                  {Object.values(MAMA_VOICES).map((mama) => (
                    <Button
                      key={mama.id}
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      disabled={isPlaying}
                    >
                      <Play className="h-3 w-3 mr-2" />
                      {mama.name} ({mama.accent})
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Configuration Info */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
          <strong>Note:</strong> Voice features require ElevenLabs API key. 
          Configure in environment variables when ready.
        </div>
      </CardContent>
    </Card>
  );
};