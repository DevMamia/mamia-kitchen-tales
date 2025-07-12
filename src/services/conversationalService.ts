interface ConversationMessage {
  type: 'transcript' | 'audio' | 'ping' | 'error';
  transcript?: {
    text: string;
    is_final: boolean;
  };
  audio?: {
    chunk: string; // base64 encoded audio
  };
  error?: string;
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
      this.config?.onError?.(`Failed to start conversation: ${error}`);
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
      // Note: API key will be sent in init message, not in headers for WebSocket

      this.websocket = new WebSocket('wss://api.elevenlabs.io/v1/conversation');
      
      this.websocket.onopen = () => {
        console.log('Conversational AI WebSocket connected');
        resolve();
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.websocket.onmessage = (event) => {
        this.handleWebSocketMessage(event.data);
      };

      this.websocket.onclose = () => {
        console.log('Conversational AI WebSocket closed');
        this.config?.onError?.('Connection closed');
      };
    });
  }

  private async sendInitMessage(stepText: string): Promise<void> {
    if (!this.websocket || !this.config) return;

    // For ConversationalAI, we need to get the API key from the existing Edge Function
    try {
      const { data } = await fetch('https://jfocambuvgkztcktukar.supabase.co/functions/v1/get-voice-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json()).catch(() => ({}));
      
      const apiKey = data?.ELEVENLABS_API_KEY;
      
      if (!apiKey) {
        throw new Error('ElevenLabs API key not available');
      }

      const initMessage = {
        type: 'init',
        api_key: apiKey,
        voice_id: this.config.voiceId,
        context: `You are a cooking assistant named after the voice character. Help the user with step: "${stepText}". Be encouraging, warm, and give specific cooking advice. Keep responses brief and conversational.`
      };

      this.websocket.send(JSON.stringify(initMessage));
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
      this.config?.onError?.('Failed to get API key for conversation');
    }
  }

  private handleWebSocketMessage(data: string): void {
    try {
      const message: ConversationMessage = JSON.parse(data);
      
      switch (message.type) {
        case 'transcript':
          if (message.transcript) {
            this.handleTranscript(message.transcript.text, message.transcript.is_final);
          }
          break;
        case 'audio':
          if (message.audio) {
            this.handleAudioChunk(message.audio.chunk);
          }
          break;
        case 'error':
          console.error('Conversation error:', message.error);
          this.config?.onError?.(message.error || 'Unknown error');
          break;
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
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
        type: 'message',
        text: text
      }));
    }
  }

  isConnected(): boolean {
    return this.websocket?.readyState === WebSocket.OPEN;
  }
}