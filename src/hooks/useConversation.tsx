import { useState, useCallback, useEffect } from 'react';
import { ConversationalService } from '@/services/conversationalService';
import { VoiceService } from '@/services/voiceService';

interface ConversationState {
  isConnected: boolean;
  currentTranscript: string;
  partialTranscript: string;
  error: string | null;
}

export const useConversation = () => {
  const [conversationalService] = useState(() => ConversationalService.getInstance());
  const [voiceService] = useState(() => VoiceService.getInstance());
  const [state, setState] = useState<ConversationState>({
    isConnected: false,
    currentTranscript: '',
    partialTranscript: '',
    error: null
  });

  const updateState = useCallback((updates: Partial<ConversationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const startConversation = useCallback(async (
    mamaId: string,
    stepText: string,
    recipe?: any,
    onCommand?: (command: string) => void
  ) => {
    try {
      updateState({ error: null, isConnected: false });

      // Let the backend handle voice ID resolution entirely
      // No need to validate voice IDs on the frontend
      await conversationalService.startConversation({
        mamaId,
        onTranscript: (text: string, isFinal: boolean) => {
          if (isFinal) {
            updateState({ 
              currentTranscript: text,
              partialTranscript: ''
            });
          } else {
            updateState({ partialTranscript: text });
          }
        },
        onCommand: (command: string) => {
          console.log('Voice command detected:', command);
          onCommand?.(command);
        },
        onError: (error: string) => {
          console.error('Conversation error:', error);
          updateState({ error, isConnected: false });
        }
      }, stepText, recipe);

      updateState({ isConnected: true });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      updateState({ 
        error: error instanceof Error ? error.message : 'Failed to start conversation',
        isConnected: false 
      });
      
      // Fallback to regular TTS
      console.log('[useConversation] Falling back to VoiceService TTS with:', stepText, mamaId);
      try {
        await voiceService.speak(stepText, mamaId);
        console.log('[useConversation] Fallback TTS succeeded');
      } catch (fallbackError) {
        console.error('Fallback TTS also failed:', fallbackError);
      }
    }
  }, [conversationalService, voiceService, updateState]);

  const stopConversation = useCallback(async () => {
    try {
      await conversationalService.stopConversation();
      updateState({ 
        isConnected: false,
        currentTranscript: '',
        partialTranscript: '',
        error: null
      });
    } catch (error) {
      console.error('Failed to stop conversation:', error);
    }
  }, [conversationalService, updateState]);

  const sendMessage = useCallback((text: string) => {
    if (state.isConnected) {
      conversationalService.sendMessage(text);
    }
  }, [conversationalService, state.isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      conversationalService.stopConversation().catch(console.error);
    };
  }, [conversationalService]);

  return {
    ...state,
    startConversation,
    stopConversation,
    sendMessage,
    isConnected: state.isConnected && conversationalService.isConnected()
  };
};