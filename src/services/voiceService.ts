// Voice Service for ElevenLabs Integration
import { getMamaById } from '@/data/mamas';
import { supabase } from '@/integrations/supabase/client';

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

// Voice mappings for different Mamas - voice IDs will be fetched from Supabase secrets
export const MAMA_VOICES: Record<string, MamaVoice> = {
  'nonna_lucia': {
    id: 'nonna_lucia',
    name: 'Nonna Lucia',
    voiceId: 'nonna-voice', // Will be replaced with actual ID from secrets
    accent: 'Italian'
  },
  'abuela_rosa': {
    id: 'abuela_rosa', 
    name: 'Abuela Rosa',
    voiceId: 'abuela-voice', // Will be replaced with actual ID from secrets
    accent: 'Mexican'
  },
  'mae_malai': {
    id: 'mae_malai',
    name: 'Mae Malai', 
    voiceId: 'mae-voice', // Will be replaced with actual ID from secrets
    accent: 'Thai'
  }
};

// Pre-cached common phrases for Essential Mode
const ESSENTIAL_PHRASES: Record<string, Record<string, string>> = {
  'nonna_lucia': {
    welcome: "Benvenuti nella mia cucina, cari!",
    start_cooking: "Iniziamo a cucinare insieme!",
    next_step: "Ora, il prossimo passo...",
    well_done: "Bravissimi! Perfetto!",
    timer_done: "Il tempo è finito, tesoro!",
    taste_check: "Assaggia e dimmi com'è!"
  },
  'abuela_rosa': {
    welcome: "¡Bienvenidos a mi cocina, mis queridos!",
    start_cooking: "¡Vamos a cocinar juntos!",
    next_step: "Ahora, el siguiente paso...",
    well_done: "¡Muy bien! ¡Perfecto!",
    timer_done: "¡Se acabó el tiempo, mi amor!",
    taste_check: "¡Pruébalo y dime qué tal!"
  },
  'mae_malai': {
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
  private voiceIds: Record<string, string> = {};
  private config: VoiceConfig = {
    mode: 'essential',
    volume: 0.8,
    speed: 1.0,
    enabled: true
  };

  private constructor() {
    this.initializeVoiceIds();
  }

  private async initializeVoiceIds() {
    try {
      // Get voice IDs from Supabase Edge Function secrets via a helper function
      const { data, error } = await supabase.functions.invoke('get-voice-ids');
      if (data && !error) {
        this.voiceIds = {
          nonna_lucia: data.ELEVENLABS_NONNA_VOICE_ID,
          abuela_rosa: data.ELEVENLABS_ABUELA_VOICE_ID,
          mae_malai: data.ELEVENLABS_MAE_VOICE_ID
        };
        console.log('Voice IDs initialized successfully');
      }
    } catch (error) {
      console.warn('Could not fetch voice IDs, using defaults:', error);
    }
  }

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

  async speak(text: string, mamaId: string): Promise<void> {
    if (!this.config.enabled) return;

    // Get mama info to determine voice
    const mama = getMamaById(parseInt(mamaId));
    const voiceKey = mama?.voiceId || 'nonna_lucia';

    // In essential mode, use pre-cached phrases
    if (this.config.mode === 'essential') {
      const phrase = ESSENTIAL_PHRASES[voiceKey]?.[text];
      if (phrase) {
        // Play pre-cached audio (placeholder)
        console.log(`Playing cached phrase for ${mama?.name}: ${phrase}`);
        return;
      }
    }

    // In full mode, add to queue for TTS generation
    if (this.config.mode === 'full') {
      // Get the actual voice ID for this mama
      const actualVoiceId = this.voiceIds[voiceKey] || MAMA_VOICES[voiceKey]?.voiceId;
      if (actualVoiceId) {
        this.addToQueue(text, actualVoiceId);
      }
    }
  }

  async speakRecipeIntro(recipeId: string, mamaId: string): Promise<void> {
    const mama = getMamaById(parseInt(mamaId));
    if (!mama) return;

    // This would fetch the recipe's voice intro from the data
    // For now, we'll use a placeholder
    const introText = `Welcome to ${mama.name}'s kitchen! Let's cook together with love.`;
    await this.speak(introText, mamaId);
  }

  async speakVoiceTip(tip: string, mamaId: string): Promise<void> {
    const mama = getMamaById(parseInt(mamaId));
    if (!mama) return;

    // Add mama's personality to the tip
    const personalizedTip = this.addMamaPersonality(tip, mama.accent);
    await this.speak(personalizedTip, mamaId);
  }

  private addMamaPersonality(text: string, accent: string): string {
    switch (accent) {
      case 'Italian':
        return `Ecco! ${text} Bene!`;
      case 'Mexican':
        return `¡Órale! ${text} ¿Sí, mija?`;
      case 'Thai':
        return `${text} Ka!`;
      default:
        return text;
    }
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
    try {
      console.log(`[VoiceService] Generating speech for: "${text}" with voice: ${voiceId}`);
      
      // Stop any currently playing audio
      this.stopCurrentAudio();

      // Call our Supabase Edge Function for text-to-speech
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voiceId,
          model: 'eleven_multilingual_v2',
          stability: 0.5,
          similarity_boost: 0.75
        }
      });

      if (error) {
        throw new Error(`Voice service error: ${error.message}`);
      }

      if (!data?.audioData) {
        throw new Error('No audio data received from voice service');
      }

      // Create and play audio from base64 data
      const audioBlob = new Blob([
        Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0))
      ], { type: 'audio/mpeg' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Apply volume setting
      audio.volume = this.config.volume;
      
      // Set current audio reference
      this.currentAudio = audio;
      this.isPlaying = true;

      // Play audio and handle completion
      await new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          this.isPlaying = false;
          this.currentAudio = null;
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = () => {
          this.isPlaying = false;
          this.currentAudio = null;
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Audio playback failed'));
        };
        
        audio.play().catch(reject);
      });
      
      console.log(`[VoiceService] Finished playing: "${text}"`);
    } catch (error) {
      this.isPlaying = false;
      this.currentAudio = null;
      console.error('[VoiceService] Error generating speech:', error);
      throw error;
    }
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