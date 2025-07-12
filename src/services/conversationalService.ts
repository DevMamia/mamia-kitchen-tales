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
  private recognition: any | null = null;
  private config: ConversationConfig | null = null;
  private isListening = false;
  private voiceService = VoiceService.getInstance();

  static getInstance(): ConversationalService {
    if (!ConversationalService.instance) {
      ConversationalService.instance = new ConversationalService();
    }
    return ConversationalService.instance;
  }

  private constructor() {}

  async startConversation(config: ConversationConfig, stepText: string): Promise<void> {
    try {
      this.config = config;
      
      // Check for Speech Recognition support
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition not supported in this browser');
      }

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        console.log('Speech recognition started');
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          this.config?.onTranscript?.(interimTranscript, false);
        }

        if (finalTranscript) {
          this.config?.onTranscript?.(finalTranscript, true);
          this.detectVoiceCommand(finalTranscript.toLowerCase());
          this.handleUserInput(finalTranscript);
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.config?.onError?.(`Speech recognition error: ${event.error}`);
      };

      this.recognition.onend = () => {
        console.log('Speech recognition ended');
        this.isListening = false;
        // Auto-restart if we're still in conversation mode
        if (this.config && this.recognition) {
          setTimeout(() => {
            if (this.recognition && this.config) {
              this.recognition.start();
            }
          }, 100);
        }
      };

      // Start listening
      this.recognition.start();

      // Speak the initial step text
      await this.voiceService.speak(stepText, config.mamaId);

    } catch (error) {
      console.error('Failed to start conversation:', error);
      this.config?.onError?.('Failed to start conversation: ' + (error instanceof Error ? error.message : String(error)));
      throw error;
    }
  }

  async stopConversation(): Promise<void> {
    this.isListening = false;
    
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    
    this.voiceService.stopCurrentAudio();
    this.config = null;
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
        return 'mae_malai';
      default:
        return mamaId; // Already in correct format
    }
  }

  isConnected(): boolean {
    return this.isListening && this.recognition !== null;
  }
}