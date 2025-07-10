// Voice Service for ElevenLabs Integration
export interface VoiceConfig {
  mode: 'full' | 'essential' | 'text';
  volume: number;
  speed: number;
  enabled: boolean;
}

export interface MamaVoice {
  id: string;
  name: string;
  voiceId: string;
  accent: string;
}

// Mama Voice Configurations
export const MAMA_VOICES: Record<string, MamaVoice> = {
  nonna: {
    id: 'nonna',
    name: 'Nonna Maria',
    voiceId: 'VITE_NONNA_VOICE_ID', // Placeholder - replace with actual ElevenLabs voice ID
    accent: 'italian'
  },
  abuela: {
    id: 'abuela',
    name: 'Abuela Rosa',
    voiceId: 'VITE_ABUELA_VOICE_ID', // Placeholder - replace with actual ElevenLabs voice ID
    accent: 'spanish'
  },
  mae: {
    id: 'mae',
    name: 'Mae Thompson',
    voiceId: 'VITE_MAE_VOICE_ID', // Placeholder - replace with actual ElevenLabs voice ID
    accent: 'southern'
  }
};

// Pre-cached common phrases for Essential Mode
export const ESSENTIAL_PHRASES: Record<string, Record<string, string>> = {
  nonna: {
    welcome: "Benvenuti nella mia cucina, cari!",
    start_cooking: "Iniziamo a cucinare insieme!",
    next_step: "Ora, il prossimo passo...",
    well_done: "Bravissimi! Perfetto!",
    timer_done: "Il tempo è finito, tesoro!",
    taste_check: "Assaggia e dimmi com'è!"
  },
  abuela: {
    welcome: "¡Bienvenidos a mi cocina, mis queridos!",
    start_cooking: "¡Vamos a cocinar juntos!",
    next_step: "Ahora, el siguiente paso...",
    well_done: "¡Muy bien! ¡Perfecto!",
    timer_done: "¡Se acabó el tiempo, mi amor!",
    taste_check: "¡Pruébalo y dime qué tal!"
  },
  mae: {
    welcome: "Welcome to my kitchen, sugar!",
    start_cooking: "Let's get cookin' together!",
    next_step: "Now honey, the next step...",
    well_done: "Well done, darlin'! Perfect!",
    timer_done: "Time's up, sweet pea!",
    taste_check: "Go ahead and taste that for me!"
  }
};

export class VoiceService {
  private static instance: VoiceService;
  private currentAudio: HTMLAudioElement | null = null;
  private audioQueue: Array<{ text: string; voiceId: string }> = [];
  private isPlaying = false;
  private config: VoiceConfig = {
    mode: 'essential',
    volume: 0.8,
    speed: 1.0,
    enabled: true
  };

  private constructor() {}

  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  public updateConfig(config: Partial<VoiceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public getConfig(): VoiceConfig {
    return { ...this.config };
  }

  public async speak(text: string, mamaId: string): Promise<void> {
    if (!this.config.enabled || this.config.mode === 'text') {
      return;
    }

    const mama = MAMA_VOICES[mamaId];
    if (!mama) {
      console.warn(`Mama voice not found: ${mamaId}`);
      return;
    }

    // Check if we should use cached phrase or generate speech
    if (this.config.mode === 'essential') {
      const cachedPhrase = this.getCachedPhrase(text, mamaId);
      if (cachedPhrase) {
        await this.playEssentialPhrase(cachedPhrase);
        return;
      }
    }

    // Add to queue for full voice mode
    this.addToQueue(text, mama.voiceId);
  }

  private getCachedPhrase(text: string, mamaId: string): string | null {
    const phrases = ESSENTIAL_PHRASES[mamaId];
    if (!phrases) return null;

    // Simple text matching for common phrases
    const lowerText = text.toLowerCase();
    for (const [key, phrase] of Object.entries(phrases)) {
      if (lowerText.includes(key.replace('_', ' '))) {
        return phrase;
      }
    }
    return null;
  }

  private async playEssentialPhrase(phrase: string): Promise<void> {
    // For now, just log the phrase - in production this would play pre-recorded audio
    console.log(`Playing essential phrase: ${phrase}`);
    
    // Simulate audio playback delay
    await new Promise(resolve => setTimeout(resolve, phrase.length * 50));
  }

  private addToQueue(text: string, voiceId: string): void {
    this.audioQueue.push({ text, voiceId });
    if (!this.isPlaying) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const { text, voiceId } = this.audioQueue.shift()!;

    try {
      await this.generateAndPlaySpeech(text, voiceId);
    } catch (error) {
      console.error('Error playing speech:', error);
    }

    // Process next item in queue
    setTimeout(() => this.processQueue(), 100);
  }

  private async generateAndPlaySpeech(text: string, voiceId: string): Promise<void> {
    // Placeholder for ElevenLabs API integration
    // In production, this would:
    // 1. Call ElevenLabs API with text and voiceId
    // 2. Get audio blob back
    // 3. Create audio element and play
    
    console.log(`Generating speech for: "${text}" with voice: ${voiceId}`);
    
    // Stop any currently playing audio
    this.stopCurrentAudio();
    
    // Simulate API call and audio playback
    await new Promise(resolve => {
      const duration = Math.max(text.length * 80, 1000); // Estimate duration
      setTimeout(resolve, duration);
    });
  }

  public stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  public clearQueue(): void {
    this.audioQueue = [];
    this.stopCurrentAudio();
    this.isPlaying = false;
  }

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  public getQueueLength(): number {
    return this.audioQueue.length;
  }
}