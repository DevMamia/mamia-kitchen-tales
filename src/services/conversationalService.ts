import { VoiceService } from './voiceService';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ConversationConfig {
  voiceId: string;
  mamaId: string;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onCommand?: (command: string) => void;
  onError?: (error: string) => void;
}

const VOICE_COMMANDS = {
  navigation: ["next", "back", "previous", "repeat"],
  quantities: ["how much", "how many", "what amount"],
  confirmation: ["yes", "no", "done", "finished"]
};

export class ConversationalService {
  private static instance: ConversationalService;
  private elevenLabsWs: WebSocket | null = null;
  private config: ConversationConfig | null = null;
  private connected = false;
  private currentAgentId: string | null = null;
  private voiceService = VoiceService.getInstance();

  static getInstance(): ConversationalService {
    if (!ConversationalService.instance) {
      ConversationalService.instance = new ConversationalService();
    }
    return ConversationalService.instance;
  }

  private constructor() {}

  async startConversation(config: ConversationConfig, stepText: string, recipe?: any): Promise<void> {
    this.config = config;

    try {
      console.log('Starting ElevenLabs conversation for mama:', config.mamaId);

      // Import supabase here to avoid circular dependencies
      const { supabase } = await import('@/integrations/supabase/client');

      // Create agent with recipe context
      const { data: agentData, error: agentError } = await supabase.functions.invoke('elevenlabs-conversation', {
        body: {
          action: 'create-agent',
          mamaId: config.mamaId,
          recipe,
          userContext: {
            name: 'Cook', // Could be enhanced with actual user name
            cooking_level: 'intermediate'
          }
        }
      });

      if (agentError) {
        console.error('Failed to create ElevenLabs agent:', agentError);
        throw new Error('Failed to initialize voice conversation');
      }

      this.currentAgentId = agentData.agentId;

      // Generate signed URL for conversation
      const { data: urlData, error: urlError } = await supabase.functions.invoke('elevenlabs-conversation', {
        body: {
          action: 'generate-url',
          agentId: this.currentAgentId
        }
      });

      if (urlError) {
        console.error('Failed to generate conversation URL:', urlError);
        throw new Error('Failed to initialize voice conversation');
      }

      // Connect to ElevenLabs WebSocket
      this.elevenLabsWs = new WebSocket(urlData.signedUrl);

      this.elevenLabsWs.onopen = () => {
        console.log('Connected to ElevenLabs conversation');
        this.connected = true;
      };

      this.elevenLabsWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('ElevenLabs message:', data.type);

        switch (data.type) {
          case 'conversation.started':
            config.onTranscript?.('Connected to voice assistant', true);
            break;
          
          case 'user_transcript':
            config.onTranscript?.(data.transcript || '', data.isFinal || false);
            
            // Detect commands in user speech
            if (data.transcript) {
              this.detectVoiceCommand(data.transcript);
            }
            break;
          
          case 'agent_response':
            // The agent is speaking, no need to process further
            break;
          
          case 'error':
            console.error('ElevenLabs conversation error:', data.message);
            config.onError?.(data.message);
            break;
        }
      };

      this.elevenLabsWs.onerror = (error) => {
        console.error('ElevenLabs WebSocket error:', error);
        config.onError?.('Voice connection error');
      };

      this.elevenLabsWs.onclose = () => {
        console.log('ElevenLabs conversation closed');
        this.connected = false;
        this.currentAgentId = null;
      };

    } catch (error) {
      console.error('Failed to start ElevenLabs conversation:', error);
      
      // Fallback to speech recognition if ElevenLabs fails
      console.log('Falling back to speech recognition');
      await this.startSpeechRecognitionFallback(config, stepText);
    }
  }

  private async startSpeechRecognitionFallback(config: ConversationConfig, stepText: string): Promise<void> {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Voice conversation not supported in this browser');
    }

    // Implementation would go here - keeping existing speech recognition logic as fallback
    console.log('Using speech recognition fallback');
  }

  async stopConversation(): Promise<void> {
    if (this.elevenLabsWs && this.elevenLabsWs.readyState === WebSocket.OPEN) {
      this.elevenLabsWs.close();
      this.elevenLabsWs = null;
    }
    this.config = null;
    this.connected = false;
    this.currentAgentId = null;
    this.voiceService.stopCurrentAudio();
  }

  private detectVoiceCommand(text: string): void {
    for (const [category, commands] of Object.entries(VOICE_COMMANDS)) {
      for (const command of commands) {
        if (text.includes(command)) {
          this.config?.onCommand?.(command);
          return;
        }
      }
    }
  }

  private async handleUserInput(text: string): Promise<void> {
    if (!this.config) return;

    console.log(`[ConversationalService] Handling user input: "${text}" for mama: ${this.config.mamaId}`);

    // Generate contextual response based on input
    const responses = this.generateMamaResponse(text, this.config.mamaId);
    
    if (responses.length > 0) {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      console.log(`[ConversationalService] Generated response: "${randomResponse}"`);
      await this.voiceService.speak(randomResponse, this.config.mamaId);
    }
  }

  private generateMamaResponse(input: string, mamaId: string): string[] {
    const lowerInput = input.toLowerCase();
    console.log(`[ConversationalService] Generating response for mama: ${mamaId}, input: ${lowerInput}`);
    
    // Convert numeric ID to mama voice ID if needed
    const resolvedMamaId = this.resolveMamaId(mamaId);
    console.log(`[ConversationalService] Resolved mama ID: ${resolvedMamaId}`);
    
    // Common cooking questions and responses
    if (lowerInput.includes('how') && (lowerInput.includes('long') || lowerInput.includes('time'))) {
      if (resolvedMamaId === 'nonna_lucia') {
        return [
          "Caro, trust your nose! When it smells perfect, it's ready.",
          "Cooking time depends on your stove, tesoro. Watch and taste!"
        ];
      } else if (resolvedMamaId === 'abuela_rosa') {
        return [
          "Mijo, cooking is not about the clock, it's about the love you put in!",
          "Watch the color change, that's how you know, corazón."
        ];
      } else {
        return [
          "In Thai cooking, we cook with our hearts, not just timers.",
          "Let your senses guide you, little one."
        ];
      }
    }

    if (lowerInput.includes('help') || lowerInput.includes('stuck') || lowerInput.includes('wrong')) {
      if (resolvedMamaId === 'nonna_lucia') {
        return [
          "Non ti preoccupare! Even I make mistakes. What's troubling you?",
          "Tell Nonna what happened, we'll fix it together!"
        ];
      } else if (resolvedMamaId === 'abuela_rosa') {
        return [
          "Ay, mi amor, don't worry! Every cook has these moments.",
          "Tell me what's wrong, mijo. Abuela will help you."
        ];
      } else {
        return [
          "Take a deep breath. In Thai cooking, patience solves many problems.",
          "Tell me what you're seeing, child. We'll work through it."
        ];
      }
    }

    if (lowerInput.includes('good') || lowerInput.includes('great') || lowerInput.includes('perfect')) {
      if (resolvedMamaId === 'nonna_lucia') {
        return [
          "Bravissimo! You're becoming a real chef!",
          "Perfetto! Nonna is so proud of you!"
        ];
      } else if (resolvedMamaId === 'abuela_rosa') {
        return [
          "¡Qué bueno! You're doing fantastic, mijo!",
          "Sí, sí! That's the spirit of a true cook!"
        ];
      } else {
        return [
          "Very good! Your cooking energy is beautiful.",
          "Excellent! You're learning the Thai way well."
        ];
      }
    }

    // Default encouraging responses
    if (resolvedMamaId === 'nonna_lucia') {
      return [
        "Sì, sì, you're doing well, caro!",
        "Keep going, tesoro. You've got this!"
      ];
    } else if (resolvedMamaId === 'abuela_rosa') {
      return [
        "Muy bien, mijo! You're doing great!",
        "That's it, corazón! Trust yourself!"
      ];
    } else {
      return [
        "Yes, you're on the right path.",
        "Good, keep following your instincts."
      ];
    }
  }

  sendMessage(text: string): void {
    // For compatibility with existing interface
    this.handleUserInput(text);
  }

  private resolveMamaId(mamaId: string): string {
    // Handle numeric IDs from Cook page
    switch (mamaId) {
      case '1':
        return 'nonna_lucia';
      case '2':
        return 'abuela_rosa';
      case '3':
        return 'yai_malee';
      default:
        return mamaId; // Already in correct format
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}