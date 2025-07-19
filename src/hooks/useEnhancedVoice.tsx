
import { useState, useEffect, useCallback } from 'react';
import { VoiceService, VoiceConfig } from '@/services/voiceService';

export interface EnhancedVoiceState {
  config: VoiceConfig;
  isPlaying: boolean;
  queueLength: number;
  serviceStatus: 'ready' | 'loading' | 'error' | 'disabled';
  cacheStats: {
    size: number;
    preGenerated: number;
    categories: Record<string, number>;
  };
}

export const useEnhancedVoice = () => {
  const [voiceService] = useState(() => VoiceService.getInstance());
  const [state, setState] = useState<EnhancedVoiceState>({
    config: voiceService.getConfig(),
    isPlaying: false,
    queueLength: 0,
    serviceStatus: 'loading',
    cacheStats: { size: 0, preGenerated: 0, categories: {} }
  });

  // Update state periodically
  useEffect(() => {
    const updateState = () => {
      setState({
        config: voiceService.getConfig(),
        isPlaying: voiceService.isCurrentlyPlaying(),
        queueLength: voiceService.getQueueLength(),
        serviceStatus: voiceService.getVoiceServiceStatus(),
        cacheStats: voiceService.getCacheStats()
      });
    };

    updateState();
    const interval = setInterval(updateState, 500);
    return () => clearInterval(interval);
  }, [voiceService]);

  const updateConfig = useCallback((newConfig: Partial<VoiceConfig>) => {
    const updatedConfig = { ...state.config, ...newConfig };
    voiceService.updateConfig(updatedConfig);
    console.log('[useEnhancedVoice] Config updated:', updatedConfig);
  }, [state.config, voiceService]);

  const speak = useCallback((text: string, mamaId: string) => {
    console.log(`[useEnhancedVoice] Speak request: "${text.substring(0, 30)}..." for ${mamaId}`);
    return voiceService.speak(text, mamaId);
  }, [voiceService]);

  const speakCachedPhrase = useCallback((phraseKey: string, mamaId: string) => {
    console.log(`[useEnhancedVoice] Cached phrase request: ${phraseKey} for ${mamaId}`);
    return voiceService.speak(phraseKey, mamaId);
  }, [voiceService]);

  const stopSpeaking = useCallback(() => {
    console.log('[useEnhancedVoice] Stop speaking requested');
    voiceService.stopCurrentAudio();
  }, [voiceService]);

  const clearQueue = useCallback(() => {
    console.log('[useEnhancedVoice] Clear queue requested');
    voiceService.clearQueue();
  }, [voiceService]);

  const clearCache = useCallback(() => {
    console.log('[useEnhancedVoice] Clear cache requested');
    voiceService.clearPhraseCache();
  }, [voiceService]);

  const toggleCaching = useCallback((enabled: boolean) => {
    console.log(`[useEnhancedVoice] Caching ${enabled ? 'enabled' : 'disabled'}`);
    updateConfig({ useCaching: enabled });
  }, [updateConfig]);

  return {
    ...state,
    updateConfig,
    speak,
    speakCachedPhrase,
    stopSpeaking,
    clearQueue,
    clearCache,
    toggleCaching,
    
    // Convenience methods for common phrases
    speakWelcome: (mamaId: string) => speakCachedPhrase('welcome', mamaId),
    speakNextStep: (mamaId: string) => speakCachedPhrase('next_step', mamaId),
    speakEncouragement: (mamaId: string) => speakCachedPhrase('well_done', mamaId),
    speakTimerAlert: (mamaId: string) => speakCachedPhrase('timer_done', mamaId)
  };
};
