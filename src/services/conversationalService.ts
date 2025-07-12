interface ConversationMessage {
  type: 'connected' | 'user_transcript' | 'agent_response_audio' | 'agent_response_transcript' | 'error' | 'disconnected';
  transcript?: string;
  is_final?: boolean;
  audio?: string; // base64 encoded audio
  message?: string;
}

interface ConversationConfig {
  voiceId: string;
  mamaId: string;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onAudioChunk?: (audioData: ArrayBuffer) => void;
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
  private websocket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private audioQueue: AudioBuffer[] = [];
  private isPlaying = false;
  private pingInterval: number | null = null;
  private config: ConversationConfig | null = null;

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
      await this.initializeAudioContext();
      await this.connectWebSocket();
      await this.sendInitMessage(stepText);
      this.startPingInterval();
    } catch (error) {
      console.error('Failed to start conversation:', error);
      this.config?.onError?.('Failed to start conversation: ' + (error instanceof Error ? error.message : String(error)));
      throw error;
    }
  }

  async stopConversation(): Promise<void> {
    this.clearPingInterval();
    
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
    
    this.audioQueue = [];
    this.isPlaying = false;
    this.config = null;
  }

  private async initializeAudioContext(): Promise<void> {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Connect to our Supabase edge function relay
      this.websocket = new WebSocket('wss://jfocambuvgkztcktukar.supabase.co/functions/v1/conversational-ai');
      
      this.websocket.onopen = () => {
        console.log('Connected to conversational AI relay');
        resolve();
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.config?.onError?.('WebSocket connection failed');
        reject(new Error('WebSocket connection failed'));
      };

      this.websocket.onmessage = (event) => {
        this.handleWebSocketMessage(event.data);
      };

      this.websocket.onclose = () => {
        console.log('WebSocket connection closed');
        this.config?.onError?.('Connection closed');
      };
    });
  }

  private async sendInitMessage(stepText: string): Promise<void> {
    if (!this.websocket || !this.config) return;

    const initMessage = {
      type: 'init',
      voiceId: this.config.voiceId,
      mamaId: this.config.mamaId,
      stepText: stepText
    };

    this.websocket.send(JSON.stringify(initMessage));
  }

  private handleWebSocketMessage(data: string): void {
    try {
      const message: ConversationMessage = JSON.parse(data);
      
      switch (message.type) {
        case 'connected':
          console.log('Conversation initialized');
          break;
          
        case 'user_transcript':
          if (message.transcript) {
            this.handleTranscript(message.transcript, message.is_final || false);
          }
          break;
          
        case 'agent_response_audio':
          if (message.audio) {
            this.handleAudioChunk(message.audio);
          }
          break;
          
        case 'agent_response_transcript':
          console.log('Agent transcript:', message.transcript);
          break;
          
        case 'error':
          console.error('Conversation error:', message.message);
          this.config?.onError?.(message.message || 'Unknown error');
          break;

        case 'disconnected':
          console.log('ElevenLabs disconnected');
          this.config?.onError?.('ElevenLabs disconnected');
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleTranscript(text: string, isFinal: boolean): void {
    this.config?.onTranscript?.(text, isFinal);
    
    if (isFinal) {
      this.detectVoiceCommand(text.toLowerCase());
    }
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

  private async handleAudioChunk(base64Audio: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const binaryData = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioQueue.push(audioBuffer);
      
      if (!this.isPlaying) {
        this.playNextAudio();
      }
    } catch (error) {
      console.error('Failed to process audio chunk:', error);
    }
  }

  private playNextAudio(): void {
    if (!this.audioContext || this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioBuffer = this.audioQueue.shift()!;
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    
    source.onended = () => {
      this.playNextAudio();
    };
    
    source.start();
  }

  private startPingInterval(): void {
    this.pingInterval = window.setInterval(() => {
      if (this.websocket?.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 25000); // Ping every 25 seconds
  }

  private clearPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  sendMessage(text: string): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        type: 'user_message',
        text: text
      }));
    }
  }

  isConnected(): boolean {
    return this.websocket?.readyState === WebSocket.OPEN;
  }
}