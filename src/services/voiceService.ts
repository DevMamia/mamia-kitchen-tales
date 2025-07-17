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
  'yai_malee': {
    id: 'yai_malee',
    name: 'Yai Malee', 
    voiceId: 'yai-voice', // Will be replaced with actual ID from secrets
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
  'yai_malee': {
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
  private isProcessingQueue = false;
  private isCurrentlyPlayingState = false;
  private voiceIds: Record<string, string> = {};
  private config: VoiceConfig = {
    mode: 'full', // Changed to 'full' for better reliability
    volume: 0.8,
    speed: 1.0,
    enabled: true
  };

  private constructor() {
    // Initialize voice IDs immediately
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
          yai_malee: data.ELEVENLABS_YAI_VOICE_ID
        };
        console.log('Voice IDs initialized successfully', this.voiceIds);
      } else {
        console.error('Error fetching voice IDs:', error);
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

    console.log(`[VoiceService] Speaking text: "${text}" for mama: ${mamaId}`);

    // Wait for voice IDs to be initialized if needed
    if (Object.keys(this.voiceIds).length === 0) {
      console.log('[VoiceService] Waiting for voice IDs to initialize...');
      await this.initializeVoiceIds();
    }

    // Resolve mama ID (handle both numeric and voice IDs)
    const resolvedMamaId = this.resolveMamaId(mamaId);
    console.log(`[VoiceService] Resolved mama ID: ${resolvedMamaId}`);

    // In essential mode, try pre-cached phrases first, then fall back to full TTS
    if (this.config.mode === 'essential') {
      const phrase = ESSENTIAL_PHRASES[resolvedMamaId]?.[text];
      if (phrase) {
        console.log(`[VoiceService] Playing cached phrase for ${resolvedMamaId}: ${phrase}`);
        await this.playEssentialPhrase(phrase);
        return;
      }
      console.log(`[VoiceService] No cached phrase found, falling back to full TTS`);
    }

    // Fall back to full TTS mode for any text not in essential phrases
    const actualVoiceId = this.voiceIds[resolvedMamaId];
    console.log(`[VoiceService] Using voice ID: ${actualVoiceId} for ${resolvedMamaId}`);
    
    if (actualVoiceId) {
      this.addToQueue(text, actualVoiceId);
    } else {
      console.warn(`[VoiceService] No voice ID found for ${resolvedMamaId}. Available IDs:`, this.voiceIds);
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
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.audioQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.audioQueue.length > 0) {
      const { text, voiceId } = this.audioQueue.shift()!;
      
      try {
        await this.generateAndPlaySpeech(text, voiceId);
      } catch (error) {
        console.error('[VoiceService] Error processing queue item:', error);
        this.isCurrentlyPlayingState = false;
        // Continue with next item instead of stopping the queue
      }
    }

    this.isProcessingQueue = false;
  }

  private async generateAndPlaySpeech(text: string, voiceId: string): Promise<void> {
    try {
      // Stop any currently playing audio
      this.stopCurrentAudio();
      this.isCurrentlyPlayingState = true;
      
      console.log(`[VoiceService] Calling TTS for: "${text.substring(0, 50)}..." with voiceId: ${voiceId}`);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voiceId
        }
      });

      if (error) {
        console.error('[VoiceService] Edge function error details:', error);
        this.isCurrentlyPlayingState = false;
        throw new Error(`Voice service error: ${error.message || 'Edge Function error'}`);
      }

      if (!data?.audioData) {
        console.error('[VoiceService] No audio data in response:', data);
        this.isCurrentlyPlayingState = false;
        throw new Error('No audio data received from voice service');
      }

      console.log(`[VoiceService] Received audio data, length: ${data.audioData.length}`);

      // Create audio blob from base64 data
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0))], 
        { type: 'audio/mpeg' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      this.currentAudio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        if (!this.currentAudio) {
          this.isCurrentlyPlayingState = false;
          reject(new Error('Failed to create audio element'));
          return;
        }

        this.currentAudio.onloadeddata = () => {
          console.log(`[VoiceService] Audio loaded and playing: "${text.substring(0, 30)}..."`);
        };

        this.currentAudio.onended = () => {
          console.log('[VoiceService] Audio playback ended');
          if (this.currentAudio) {
            URL.revokeObjectURL(this.currentAudio.src);
          }
          this.currentAudio = null;
          this.isCurrentlyPlayingState = false;
          resolve();
        };

        this.currentAudio.onerror = (error) => {
          console.error('[VoiceService] Audio playback error:', error);
          if (this.currentAudio) {
            URL.revokeObjectURL(this.currentAudio.src);
          }
          this.currentAudio = null;
          this.isCurrentlyPlayingState = false;
          reject(new Error('Audio playback failed'));
        };

        this.currentAudio.play().catch(error => {
          console.error('[VoiceService] Failed to play audio:', error);
          if (this.currentAudio) {
            URL.revokeObjectURL(this.currentAudio.src);
          }
          this.currentAudio = null;
          this.isCurrentlyPlayingState = false;
          reject(error);
        });
      });

    } catch (error) {
      console.error('[VoiceService] Speech generation failed:', error);
      this.isCurrentlyPlayingState = false;
      throw error;
    }
  }

  public stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      URL.revokeObjectURL(this.currentAudio.src);
      this.currentAudio = null;
    }
    this.isCurrentlyPlayingState = false;
  }

  public clearQueue(): void {
    this.audioQueue = [];
    this.stopCurrentAudio();
    this.isCurrentlyPlayingState = false;
  }

  public isCurrentlyPlaying(): boolean {
    return this.isCurrentlyPlayingState || (this.currentAudio !== null && !this.currentAudio.paused);
  }

  public getQueueLength(): number {
    return this.audioQueue.length;
  }

  private resolveMamaId(mamaId: string): string {
    // First check if it's already a valid voice ID string
    const validVoiceIds = ['nonna_lucia', 'abuela_rosa', 'yai_malee'];
    if (validVoiceIds.includes(mamaId)) {
      return mamaId;
    }

    // Handle numeric IDs from Cook page
    switch (mamaId) {
      case '1':
        return 'nonna_lucia';
      case '2':
        return 'abuela_rosa';
      case '3':
        return 'yai_malee';
      default:
        // Try to find by numeric ID from mamas.ts
        const numericId = parseInt(mamaId);
        if (!isNaN(numericId)) {
          const mama = getMamaById(numericId);
          return mama?.voiceId || mamaId;
        }
        // Return the original string if all else fails
        return mamaId;
    }
  }
}