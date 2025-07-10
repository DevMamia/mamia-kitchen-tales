import { useState, useEffect, useCallback } from 'react';
import { VoiceService, VoiceConfig } from '@/services/voiceService';

export const useVoice = () => {
  const [voiceService] = useState(() => VoiceService.getInstance());
  const [config, setConfig] = useState<VoiceConfig>(voiceService.getConfig());
  const [isPlaying, setIsPlaying] = useState(false);
  const [queueLength, setQueueLength] = useState(0);

  // Update local state when service state changes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying(voiceService.isCurrentlyPlaying());
      setQueueLength(voiceService.getQueueLength());
    }, 100);

    return () => clearInterval(interval);
  }, [voiceService]);

  const updateConfig = useCallback((newConfig: Partial<VoiceConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    voiceService.updateConfig(updatedConfig);
    setConfig(updatedConfig);
  }, [config, voiceService]);

  const speak = useCallback((text: string, mamaId: string) => {
    return voiceService.speak(text, mamaId);
  }, [voiceService]);

  const stopSpeaking = useCallback(() => {
    voiceService.stopCurrentAudio();
  }, [voiceService]);

  const clearQueue = useCallback(() => {
    voiceService.clearQueue();
  }, [voiceService]);

  return {
    config,
    updateConfig,
    speak,
    stopSpeaking,
    clearQueue,
    isPlaying,
    queueLength
  };
};