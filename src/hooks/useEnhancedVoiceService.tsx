
import { useState, useEffect, useCallback } from 'react';
import { EnhancedVoiceService, EnhancedVoiceConfig, VoiceStatus, ResponseSource } from '@/services/enhancedVoiceService';
import { ConversationPhase } from '@/services/voiceService';

export const useEnhancedVoiceService = () => {
  const [voiceService] = useState(() => EnhancedVoiceService.getInstance());
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('loading');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the service
  useEffect(() => {
    const initializeService = async () => {
      try {
        await voiceService.initialize();
        setIsInitialized(true);
        console.log('[useEnhancedVoiceService] Service initialized successfully');
      } catch (error) {
        console.error('[useEnhancedVoiceService] Failed to initialize:', error);
        setVoiceStatus('error');
      }
    };

    initializeService();
  }, [voiceService]);

  // Update state periodically
  useEffect(() => {
    const updateState = () => {
      setIsPlaying(voiceService.isCurrentlyPlaying());
      setVoiceStatus(voiceService.getVoiceStatus());
    };

    if (isInitialized) {
      updateState();
      const interval = setInterval(updateState, 500);
      return () => clearInterval(interval);
    }
  }, [voiceService, isInitialized]);

  const speak = useCallback(async (text: string, mamaId: string, options?: {
    priority?: 'high' | 'normal' | 'low';
    source?: ResponseSource;
    forceInstant?: boolean;
  }) => {
    if (!isInitialized) {
      console.warn('[useEnhancedVoiceService] Service not initialized, waiting...');
      await voiceService.initialize();
    }
    
    return voiceService.speakWithFallback(text, mamaId, options);
  }, [voiceService, isInitialized]);

  const speakGreeting = useCallback(async (mamaId: string, recipeName?: string) => {
    if (!isInitialized) {
      console.warn('[useEnhancedVoiceService] Service not initialized for greeting');
      await voiceService.initialize();
    }
    
    return voiceService.speakGreeting(mamaId, recipeName);
  }, [voiceService, isInitialized]);

  const speakCookingInstruction = useCallback(async (
    instruction: string, 
    mamaId: string, 
    stepNumber?: number, 
    tip?: string
  ) => {
    if (!isInitialized) {
      console.warn('[useEnhancedVoiceService] Service not initialized for instruction');
      await voiceService.initialize();
    }
    
    return voiceService.speakCookingInstruction(instruction, mamaId, stepNumber, tip);
  }, [voiceService, isInitialized]);

  const setConversationPhase = useCallback((phase: ConversationPhase) => {
    voiceService.setConversationPhase(phase);
  }, [voiceService]);

  const stopSpeaking = useCallback(() => {
    voiceService.stopSpeaking();
  }, [voiceService]);

  const clearQueue = useCallback(() => {
    voiceService.clearQueue();
  }, [voiceService]);

  const updateConfig = useCallback((config: Partial<EnhancedVoiceConfig>) => {
    voiceService.updateConfig(config);
  }, [voiceService]);

  return {
    speak,
    speakGreeting,
    speakCookingInstruction,
    setConversationPhase,
    stopSpeaking,
    clearQueue,
    updateConfig,
    isPlaying,
    voiceStatus,
    isInitialized
  };
};
