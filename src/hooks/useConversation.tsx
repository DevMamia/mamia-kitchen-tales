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

      // Map mama ID to the correct voice ID format
      const mamaToVoiceMapping = {
        'nonna_lucia': 'ELEVENLABS_NONNA_VOICE_ID',
        'abuela_rosa': 'ELEVENLABS_ABUELA_VOICE_ID', 
        'yai_malee': 'ELEVENLABS_YAI_VOICE_ID'
      };
      
      const voiceSecretName = mamaToVoiceMapping[mamaId as keyof typeof mamaToVoiceMapping];
      if (!voiceSecretName) {
        throw new Error(`Unknown mama ID: ${mamaId}`);
      }

      // Get voice ID from the edge function
      const { data: voiceData } = await fetch('https://jfocambuvgkztcktukar.supabase.co/functions/v1/get-voice-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json()).catch(() => ({ data: null }));
      
      const voiceId = voiceData?.[voiceSecretName];
      
      if (!voiceId) {
        throw new Error(`Voice ID not found for ${mamaId} (${voiceSecretName})`);
      }

      await conversationalService.startConversation({
        voiceId,
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
      try {
        await voiceService.speak(stepText, mamaId);
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