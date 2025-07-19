
import { useState, useEffect, useCallback } from 'react';
import { VoiceService, VoiceConfig, ConversationPhase, ResponseSource } from '@/services/voiceService';

export const useVoice = () => {
  const [voiceService] = useState(() => VoiceService.getInstance());
  const [config, setConfig] = useState<VoiceConfig>(voiceService.getConfig());
  const [isPlaying, setIsPlaying] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const [serviceStatus, setServiceStatus] = useState<'ready' | 'loading' | 'error' | 'disabled'>('loading');

  // Update local state when service state changes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying(voiceService.isCurrentlyPlaying());
      setQueueLength(voiceService.getQueueLength());
      setServiceStatus(voiceService.getVoiceServiceStatus());
    }, 100);

    return () => clearInterval(interval);
  }, [voiceService]);

  const updateConfig = useCallback((newConfig: Partial<VoiceConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    voiceService.updateConfig(updatedConfig);
    setConfig(updatedConfig);
  }, [config, voiceService]);

  const setConversationPhase = useCallback((phase: ConversationPhase) => {
    voiceService.setConversationPhase(phase);
  }, [voiceService]);

  const speak = useCallback((text: string, mamaId: string, options?: {
    isDirectMessage?: boolean;
    priority?: 'high' | 'normal' | 'low';
    source?: ResponseSource;
  }) => {
    return voiceService.speak(text, mamaId, options);
  }, [voiceService]);

  const speakCookingInstruction = useCallback((
    instruction: string, 
    mamaId: string, 
    stepNumber?: number, 
    tip?: string
  ) => {
    return voiceService.speakCookingInstruction(instruction, mamaId, stepNumber, tip);
  }, [voiceService]);

  const speakWithTip = useCallback((instruction: string, tip: string | undefined, mamaId: string, timing: 'before' | 'during' | 'after' = 'before') => {
    let spokenText = instruction;
    
    if (tip) {
      switch (timing) {
        case 'before':
          spokenText = `${tip} Now, ${instruction}`;
          break;
        case 'during':
          spokenText = `${instruction} Remember: ${tip}`;
          break;
        case 'after':
          spokenText = `${instruction} And here's a tip: ${tip}`;
          break;
      }
    }
    
    return voiceService.speak(spokenText, mamaId, { isDirectMessage: true, priority: 'high' });
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
    setConversationPhase,
    speak,
    speakCookingInstruction,
    speakWithTip,
    stopSpeaking,
    clearQueue,
    isPlaying,
    queueLength,
    serviceStatus
  };
};
