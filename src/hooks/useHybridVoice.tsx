import { useState, useCallback, useEffect } from 'react';
import { HybridVoiceService, AudioSystemStatus, HybridVoiceConfig, SubscriptionTier } from '@/services/hybridVoiceService';

export const useHybridVoice = () => {
  const [hybridService] = useState(() => HybridVoiceService.getInstance());
  const [status, setStatus] = useState<AudioSystemStatus>(hybridService.getStatus());
  const [isConversationMode, setIsConversationMode] = useState(false);

  // Poll status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(hybridService.getStatus());
    }, 100);

    return () => clearInterval(interval);
  }, [hybridService]);

  /**
   * Configure the hybrid system
   */
  const updateConfig = useCallback((config: Partial<HybridVoiceConfig>) => {
    hybridService.updateConfig(config);
  }, [hybridService]);

  /**
   * Set subscription tier (affects available features)
   */
  const setSubscriptionTier = useCallback((tier: SubscriptionTier) => {
    hybridService.updateConfig({ subscriptionTier: tier });
  }, [hybridService]);

  /**
   * Set recipe context for conversation awareness
   */
  const setRecipeContext = useCallback((recipe: any, currentStep: number) => {
    hybridService.setRecipeContext(recipe, currentStep);
  }, [hybridService]);

  /**
   * Set step progression callback
   */
  const setStepProgressCallback = useCallback((callback: (action: 'next' | 'previous' | 'repeat') => void) => {
    hybridService.setStepProgressCallback(callback);
  }, [hybridService]);

  /**
   * Speak structured content (steps, tips, greetings)
   */
  const speakStep = useCallback(async (text: string, mamaId: string) => {
    return hybridService.speakStructuredContent(text, mamaId, 'step');
  }, [hybridService]);

  const speakTip = useCallback(async (text: string, mamaId: string) => {
    return hybridService.speakStructuredContent(text, mamaId, 'tip');
  }, [hybridService]);

  const speakGreeting = useCallback(async (text: string, mamaId: string) => {
    return hybridService.speakStructuredContent(text, mamaId, 'greeting');
  }, [hybridService]);

  /**
   * Start/stop conversation mode
   */
  const startConversation = useCallback(async (mamaId: string, stepText: string, recipe?: any) => {
    if (!hybridService.isConversationAvailable()) {
      throw new Error('Conversation mode not available for current subscription tier');
    }
    
    setIsConversationMode(true);
    try {
      await hybridService.startConversation(mamaId, stepText, recipe);
    } catch (error) {
      setIsConversationMode(false);
      throw error;
    }
  }, [hybridService]);

  const stopConversation = useCallback(async () => {
    await hybridService.stopConversation();
    setIsConversationMode(false);
  }, [hybridService]);

  /**
   * Toggle conversation mode
   */
  const toggleConversationMode = useCallback(async (mamaId: string, stepText: string, recipe?: any) => {
    if (isConversationMode) {
      await stopConversation();
    } else {
      await startConversation(mamaId, stepText, recipe);
    }
  }, [isConversationMode, startConversation, stopConversation]);

  /**
   * Stop all audio
   */
  const stopAll = useCallback(async () => {
    await hybridService.stopAll();
    setIsConversationMode(false);
  }, [hybridService]);

  /**
   * Check if conversation is available for current tier
   */
  const isConversationAvailable = useCallback(() => {
    return hybridService.isConversationAvailable();
  }, [hybridService]);

  return {
    status,
    isConversationMode,
    isConversationAvailable: isConversationAvailable(),
    
    // Configuration
    updateConfig,
    setSubscriptionTier,
    setRecipeContext,
    setStepProgressCallback,
    
    // TTS functions
    speakStep,
    speakTip,
    speakGreeting,
    
    // Conversation functions
    startConversation,
    stopConversation,
    toggleConversationMode,
    
    // Control
    stopAll
  };
};