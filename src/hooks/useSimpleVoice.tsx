import { useState, useCallback } from 'react';
import { VoiceService } from '@/services/voiceService';

interface SimpleVoiceStatus {
  isSpeaking: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useSimpleVoice = () => {
  const [status, setStatus] = useState<SimpleVoiceStatus>({
    isSpeaking: false,
    isLoading: false,
    error: null
  });

  const speak = useCallback(async (text: string, mamaId: string) => {
    if (!text.trim()) {
      console.warn('[useSimpleVoice] Empty text provided');
      return;
    }

    try {
      setStatus({ isSpeaking: false, isLoading: true, error: null });
      console.log(`[useSimpleVoice] Speaking: "${text}" for mama: ${mamaId}`);
      
      const voiceService = VoiceService.getInstance();
      
      // Set speaking state when audio starts
      setStatus({ isSpeaking: true, isLoading: false, error: null });
      
      await voiceService.speak(text, mamaId);
      
      // Reset when done
      setStatus({ isSpeaking: false, isLoading: false, error: null });
      
    } catch (error) {
      console.error('[useSimpleVoice] Speech error:', error);
      setStatus({ 
        isSpeaking: false, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Speech failed' 
      });
    }
  }, []);

  const stop = useCallback(() => {
    try {
      const voiceService = VoiceService.getInstance();
      voiceService.stopCurrentAudio();
      setStatus({ isSpeaking: false, isLoading: false, error: null });
    } catch (error) {
      console.error('[useSimpleVoice] Stop error:', error);
    }
  }, []);

  return {
    speak,
    stop,
    status
  };
};