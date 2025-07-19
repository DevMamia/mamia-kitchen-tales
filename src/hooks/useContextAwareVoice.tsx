
import { useState, useEffect, useCallback } from 'react';
import { ContextAwareVoiceService, VoiceListeningState, CookingContext } from '@/services/contextAwareVoiceService';

export const useContextAwareVoice = () => {
  const [voiceService] = useState(() => ContextAwareVoiceService.getInstance());
  const [listeningState, setListeningState] = useState<VoiceListeningState>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const [serviceStatus, setServiceStatus] = useState<'ready' | 'loading' | 'error' | 'disabled'>('loading');
  const [showWakeWordPrompt, setShowWakeWordPrompt] = useState(false);
  const [wakeWordPrompt, setWakeWordPrompt] = useState('');

  // Update state periodically
  useEffect(() => {
    const updateState = () => {
      setListeningState(voiceService.getListeningState());
      setIsPlaying(voiceService.isCurrentlyPlaying());
      setQueueLength(voiceService.getQueueLength());
      setServiceStatus(voiceService.getVoiceServiceStatus());
      setShowWakeWordPrompt(voiceService.shouldShowWakeWordPrompt());
      
      if (voiceService.shouldShowWakeWordPrompt()) {
        setWakeWordPrompt(voiceService.getWakeWordPrompt());
      }
    };

    updateState();
    const interval = setInterval(updateState, 500);
    return () => clearInterval(interval);
  }, [voiceService]);

  const updateContext = useCallback((context: {
    cookingContext?: CookingContext;
    currentStep?: number;
    totalSteps?: number;
    mamaId?: string;
    recipeId?: string;
    userStruggling?: boolean;
  }) => {
    console.log('[useContextAwareVoice] Updating context:', context);
    voiceService.updateContext(context);
  }, [voiceService]);

  const speakWithContext = useCallback(async (text: string, options?: {
    priority?: 'high' | 'normal' | 'low';
    contextual?: boolean;
    interruption?: boolean;
  }) => {
    console.log(`[useContextAwareVoice] Speaking: "${text.substring(0, 30)}..." with options:`, options);
    return voiceService.speakWithContext(text, options);
  }, [voiceService]);

  // Simplified cooking instruction - MamiaV1 approach (direct text speaking)
  const speakCookingInstruction = useCallback(async (finalText: string, stepNumber: number) => {
    console.log(`[useContextAwareVoice] === SPEAKING FINAL TEXT (MamiaV1 approach) ===`);
    console.log(`[useContextAwareVoice] Step ${stepNumber}:`, finalText.substring(0, 80) + '...');
    
    // Update context to show current step
    updateContext({ currentStep: stepNumber });
    
    try {
      console.log('[useContextAwareVoice] 🔊 Speaking final concatenated text...');
      const result = await speakWithContext(finalText, {
        priority: 'high',
        contextual: true
      });
      console.log('[useContextAwareVoice] ✅ Final text spoken successfully');
      return result;
    } catch (error) {
      console.error('[useContextAwareVoice] ❌ Failed to speak final text:', error);
      throw error;
    }
  }, [speakWithContext, updateContext]);

  const encourageUser = useCallback(async () => {
    console.log('[useContextAwareVoice] Providing encouragement');
    updateContext({ userStruggling: false });
    return speakWithContext("You're doing great! Keep going!", {
      priority: 'high',
      contextual: true
    });
  }, [speakWithContext, updateContext]);

  const handleUserStruggling = useCallback(async () => {
    console.log('[useContextAwareVoice] User is struggling, providing help');
    updateContext({ userStruggling: true });
    return speakWithContext("Let me help you with that step by step.", {
      priority: 'high',
      contextual: true,
      interruption: true
    });
  }, [speakWithContext, updateContext]);

  const stopSpeaking = useCallback(() => {
    console.log('[useContextAwareVoice] Stopping speech');
    voiceService.stopSpeaking();
  }, [voiceService]);

  const clearQueue = useCallback(() => {
    console.log('[useContextAwareVoice] Clearing voice queue');
    voiceService.clearQueue();
  }, [voiceService]);

  const updateConfig = useCallback((config: any) => {
    console.log('[useContextAwareVoice] Updating config:', config);
    voiceService.updateConfig(config);
  }, [voiceService]);

  return {
    // State
    listeningState,
    isPlaying,
    queueLength,
    serviceStatus,
    showWakeWordPrompt,
    wakeWordPrompt,
    
    // Context management
    updateContext,
    getCurrentContext: () => voiceService.getCurrentContext(),
    
    // Speech functions
    speakWithContext,
    speakCookingInstruction, // Now simplified for MamiaV1 approach
    encourageUser,
    handleUserStruggling,
    
    // Control functions
    stopSpeaking,
    clearQueue,
    updateConfig,
    getConfig: () => voiceService.getConfig()
  };
};
