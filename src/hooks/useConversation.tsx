import { useState, useCallback, useEffect } from 'react';
import { ConversationalService } from '@/services/conversationalService';
import { VoiceService } from '@/services/voiceService';

interface ConversationState {
  isConnected: boolean;
  isRecording: boolean;
  currentTranscript: string;
  partialTranscript: string;
  error: string | null;
}

export const useConversation = () => {
  const [conversationalService] = useState(() => ConversationalService.getInstance());
  const [voiceService] = useState(() => VoiceService.getInstance());
  const [state, setState] = useState<ConversationState>({
    isConnected: false,
    isRecording: false,
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
    onCommand?: (command: string) => void
  ) => {
    try {
      updateState({ error: null, isConnected: false });

      // Get voice ID for the mama using the existing Edge Function
      const { data: voiceData } = await fetch('https://jfocambuvgkztcktukar.supabase.co/functions/v1/get-voice-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json()).catch(() => ({ data: null }));
      
      const voiceId = voiceData?.[`ELEVENLABS_${mamaId.toUpperCase()}_VOICE_ID`] || 'default-voice';
      
      if (!voiceId) {
        throw new Error(`Voice ID not found for ${mamaId}`);
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
      }, stepText);

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
        isRecording: false,
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