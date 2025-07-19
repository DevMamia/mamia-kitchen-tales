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

  // Enhanced tip validation and processing
  const validateTipForStep = useCallback((tip: string, instruction: string, stepNumber: number): boolean => {
    console.log(`[useContextAwareVoice] Validating tip for step ${stepNumber}:`, {
      tip: tip.substring(0, 50) + '...',
      instruction: instruction.substring(0, 50) + '...'
    });

    // Basic validation - tip should be relevant to the step
    const tipWords = tip.toLowerCase().split(' ');
    const instructionWords = instruction.toLowerCase().split(' ');
    
    // Check for common cooking keywords overlap
    const commonWords = tipWords.filter(word => 
      instructionWords.includes(word) && 
      word.length > 3 && // Skip short words
      !['with', 'from', 'that', 'this', 'will', 'your'].includes(word)
    );

    const isValid = commonWords.length > 0 || tip.length < 50; // Short tips are usually generic and safe
    
    console.log(`[useContextAwareVoice] Tip validation result:`, {
      stepNumber,
      isValid,
      commonWords,
      reason: isValid ? 'Valid tip-instruction alignment' : 'No contextual overlap found'
    });

    return isValid;
  }, []);

  const speakCookingInstruction = useCallback(async (
    instruction: string,
    stepNumber: number,
    tip?: string
  ) => {
    console.log(`[useContextAwareVoice] === COOKING INSTRUCTION PROCESSING ===`);
    console.log(`[useContextAwareVoice] Step ${stepNumber} instruction:`, {
      instruction: instruction.substring(0, 60) + '...',
      hasTip: !!tip,
      tipPreview: tip ? tip.substring(0, 40) + '...' : 'none'
    });
    
    // Update context to show current step
    updateContext({ currentStep: stepNumber });
    
    let fullInstruction = instruction;
    let processingNotes = [];

    if (tip) {
      // Validate tip before adding
      const isValidTip = validateTipForStep(tip, instruction, stepNumber);
      
      if (isValidTip) {
        console.log('[useContextAwareVoice] ✅ Adding validated tip to instruction');
        fullInstruction += `. Here's a tip from experience: ${tip}`;
        processingNotes.push('tip_added');
      } else {
        console.warn('[useContextAwareVoice] ⚠️ Tip validation failed - skipping tip for safety');
        processingNotes.push('tip_skipped_validation_failed');
      }
    } else {
      processingNotes.push('no_tip_provided');
    }
    
    console.log('[useContextAwareVoice] Final instruction processing:', {
      stepNumber,
      finalLength: fullInstruction.length,
      processingNotes,
      preview: fullInstruction.substring(0, 80) + '...'
    });
    
    try {
      console.log('[useContextAwareVoice] 🔊 Attempting to speak instruction...');
      const result = await speakWithContext(fullInstruction, {
        priority: 'high',
        contextual: true
      });
      console.log('[useContextAwareVoice] ✅ Instruction spoken successfully');
      return result;
    } catch (error) {
      console.error('[useContextAwareVoice] ❌ Failed to speak instruction:', {
        error: error.message,
        stepNumber,
        instructionLength: fullInstruction.length
      });
      
      // Fallback: try speaking without tip if tip was the problem
      if (tip && processingNotes.includes('tip_added')) {
        console.log('[useContextAwareVoice] 🔄 Retrying without tip as fallback...');
        try {
          const fallbackResult = await speakWithContext(instruction, {
            priority: 'high',
            contextual: true
          });
          console.log('[useContextAwareVoice] ✅ Fallback instruction (without tip) spoken successfully');
          return fallbackResult;
        } catch (fallbackError) {
          console.error('[useContextAwareVoice] ❌ Fallback also failed:', fallbackError);
          throw fallbackError;
        }
      }
      
      throw error;
    }
  }, [speakWithContext, updateContext, validateTipForStep]);

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
    speakCookingInstruction,
    encourageUser,
    handleUserStruggling,
    
    // Control functions
    stopSpeaking,
    clearQueue,
    updateConfig,
    getConfig: () => voiceService.getConfig()
  };
};
