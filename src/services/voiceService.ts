// Voice Service for ElevenLabs Integration with Enhanced Phrase Caching
import { getMamaById } from '@/data/mamas';
import { supabase } from '@/integrations/supabase/client';
import { PhraseCacheService, ENHANCED_CACHED_PHRASES } from './phraseCache';

export interface VoiceConfig {
  mode: 'full' | 'essential' | 'text';
  volume: number;
  speed: number;
  enabled: boolean;
  useCaching: boolean;
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

export type ConversationPhase = 'pre-cooking' | 'cooking' | 'post-cooking';
export type ResponseSource = 'instant' | 'cached' | 'ai' | 'fallback' | 'browser-tts';

interface QueuedMessage {
  text: string;
  voiceId: string;
  isDirectMessage?: boolean;
  priority?: 'high' | 'normal' | 'low';
  source?: ResponseSource;
  context?: ConversationPhase;
}

export class VoiceService {
  private static instance: VoiceService;
  private phraseCache: PhraseCacheService;
  private currentAudio: HTMLAudioElement | null = null;
  private audioQueue: QueuedMessage[] = [];
  private isProcessingQueue = false;
  private isCurrentlyPlayingState = false;
  private voiceIds: Record<string, string> = {};
  private voiceIdsInitialized = false;
  private conversationPhase: ConversationPhase = 'pre-cooking';
  private config: VoiceConfig = {
    mode: 'full',
    volume: 0.8,
    speed: 1.0,
    enabled: true,
    useCaching: true
  };

  private constructor() {
    console.log('[VoiceService] Initializing enhanced voice service with direct message support...');
    this.phraseCache = new PhraseCacheService();
    this.initializeVoiceIds();
  }

  private async initializeVoiceIds() {
    if (this.voiceIdsInitialized) {
      console.log('[VoiceService] Voice IDs already initialized');
      return;
    }

    try {
      console.log('[VoiceService] Fetching voice IDs from Supabase...');
      const { data, error } = await supabase.functions.invoke('get-voice-ids');
      if (data && !error) {
        this.voiceIds = {
          nonna_lucia: data.ELEVENLABS_NONNA_VOICE_ID,
          abuela_rosa: data.ELEVENLABS_ABUELA_VOICE_ID,
          yai_malee: data.ELEVENLABS_YAI_VOICE_ID
        };
        this.voiceIdsInitialized = true;
        console.log('[VoiceService] Voice IDs initialized successfully:', {
          nonna_lucia: this.voiceIds.nonna_lucia ? 'SET' : 'MISSING',
          abuela_rosa: this.voiceIds.abuela_rosa ? 'SET' : 'MISSING',
          yai_malee: this.voiceIds.yai_malee ? 'SET' : 'MISSING'
        });
        
        // Enhanced debug for Yai's voice ID
        if (!this.voiceIds.yai_malee) {
          console.error('[VoiceService] ❌ YAI MALEE VOICE ID IS MISSING!');
          console.error('[VoiceService] 🔍 Available data keys:', Object.keys(data || {}));
        } else {
          console.log('[VoiceService] ✅ Yai Malee voice ID confirmed:', this.voiceIds.yai_malee);
        }
      } else {
        console.error('[VoiceService] Error fetching voice IDs:', error);
        this.setFallbackVoiceIds();
      }
    } catch (error) {
      console.warn('[VoiceService] Could not fetch voice IDs, using fallbacks:', error);
      this.setFallbackVoiceIds();
    }
  }

  private setFallbackVoiceIds() {
    this.voiceIds = {
      nonna_lucia: 'nonna-fallback',
      abuela_rosa: 'abuela-fallback',
      yai_malee: 'yai-fallback'
    };
    this.voiceIdsInitialized = true;
    console.warn('[VoiceService] Using fallback voice IDs');
  }

  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  public updateConfig(config: Partial<VoiceConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('[VoiceService] Config updated:', this.config);
  }

  public getConfig(): VoiceConfig {
    return { ...this.config };
  }

  public setConversationPhase(phase: ConversationPhase): void {
    console.log(`[VoiceService] Conversation phase changed: ${this.conversationPhase} -> ${phase}`);
    this.conversationPhase = phase;
  }

  // Enhanced speak method with direct message support
  async speak(text: string, mamaId: string, options?: {
    isDirectMessage?: boolean;
    priority?: 'high' | 'normal' | 'low';
    source?: ResponseSource;
  }): Promise<void> {
    if (!this.config.enabled) {
      console.log('[VoiceService] Voice disabled, skipping speak request');
      return;
    }

    const { isDirectMessage = false, priority = 'normal', source = 'cached' } = options || {};

    console.log(`[VoiceService] Enhanced speak request:`, {
      text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      mamaId,
      isDirectMessage,
      priority,
      source,
      phase: this.conversationPhase
    });

    // Wait for voice IDs to be initialized
    if (!this.voiceIdsInitialized) {
      console.log('[VoiceService] Waiting for voice IDs to initialize...');
      await this.initializeVoiceIds();
    }

    const resolvedMamaId = this.resolveMamaId(mamaId);
    
    // Enhanced debug for Yai
    if (resolvedMamaId === 'yai_malee') {
      console.log('[VoiceService] 🔍 YAI MALEE REQUEST DETAILS:');
      console.log('  - Resolved ID:', resolvedMamaId);
      console.log('  - Voice ID available:', this.voiceIds.yai_malee || 'MISSING');
      console.log('  - Is direct message:', isDirectMessage);
      console.log('  - Phase:', this.conversationPhase);
    }

    // For direct messages, skip caching and use exact text
    if (isDirectMessage) {
      console.log(`[VoiceService] Direct message mode - using exact text`);
      await this.generateAndQueueAudio(text, resolvedMamaId, false, { priority, source });
      return;
    }

    // Smart caching logic for non-direct messages
    if (this.config.useCaching) {
      const cachedPhrase = this.phraseCache.findMatchingPhrase(text, resolvedMamaId);
      if (cachedPhrase) {
        console.log(`[VoiceService] Using cached phrase: ${cachedPhrase.id}`);
        
        if (cachedPhrase.isPreGenerated && cachedPhrase.audioUrl) {
          await this.playPreGeneratedAudio(cachedPhrase.audioUrl);
          return;
        } else {
          await this.generateAndQueueAudio(cachedPhrase.text, resolvedMamaId, true, { priority, source: 'cached' });
          return;
        }
      }
    }

    // Fall back to full TTS mode
    console.log(`[VoiceService] No cached phrase found, using full TTS`);
    await this.generateAndQueueAudio(text, resolvedMamaId, false, { priority, source: 'ai' });
  }

  // New method specifically for cooking instructions
  async speakCookingInstruction(instruction: string, mamaId: string, stepNumber?: number, tip?: string): Promise<void> {
    console.log(`[VoiceService] Speaking cooking instruction for step ${stepNumber || 'unknown'}`);
    
    let spokenText = instruction;
    
    // Add contextual intro for cooking phase
    if (this.conversationPhase === 'cooking' && stepNumber) {
      const mama = this.getMamaPersonality(mamaId);
      const stepIntro = this.getStepIntro(mama.accent, stepNumber);
      spokenText = `${stepIntro} ${instruction}`;
    }
    
    // Add tip if provided
    if (tip) {
      const mama = this.getMamaPersonality(mamaId);
      const tipPhrase = this.formatTip(mama.accent, tip);
      spokenText += ` ${tipPhrase}`;
    }
    
    await this.speak(spokenText, mamaId, {
      isDirectMessage: true,
      priority: 'high',
      source: 'instant'
    });
  }

  private getStepIntro(accent: string, stepNumber: number): string {
    switch (accent) {
      case 'Italian':
        return `Allora, step ${stepNumber}:`;
      case 'Mexican':
        return `Bueno, paso ${stepNumber}:`;
      case 'Thai':
        return `Now, step ${stepNumber}:`;
      default:
        return `Step ${stepNumber}:`;
    }
  }

  private formatTip(accent: string, tip: string): string {
    switch (accent) {
      case 'Italian':
        return `Ecco un consiglio: ${tip}`;
      case 'Mexican':
        return `Te doy un consejo: ${tip}`;
      case 'Thai':
        return `Here's a tip: ${tip}`;
      default:
        return `Tip: ${tip}`;
    }
  }

  private getMamaPersonality(mamaId: string) {
    const resolvedId = this.resolveMamaId(mamaId);
    const mama = getMamaById(resolvedId === 'nonna_lucia' ? 1 : resolvedId === 'abuela_rosa' ? 2 : 3);
    return mama || { accent: 'Italian' };
  }

  private async generateAndQueueAudio(
    text: string, 
    mamaId: string, 
    isCached: boolean, 
    options?: { priority?: string; source?: ResponseSource }
  ): Promise<void> {
    const actualVoiceId = this.voiceIds[mamaId];
    console.log(`[VoiceService] Generating audio - MamaId: ${mamaId}, VoiceId: ${actualVoiceId}, Cached: ${isCached}`);
    
    // Enhanced Yai debug
    if (mamaId === 'yai_malee') {
      console.log('[VoiceService] 🔍 YAI AUDIO GENERATION:');
      console.log('  - Mama ID:', mamaId);
      console.log('  - Voice ID:', actualVoiceId || 'UNDEFINED');
      console.log('  - All voice IDs:', this.voiceIds);
      console.log('  - Voice IDs initialized:', this.voiceIdsInitialized);
      
      if (!actualVoiceId) {
        console.error('[VoiceService] ❌ YAI VOICE ID MISSING - ATTEMPTING RECOVERY');
        // Try to reinitialize voice IDs
        await this.initializeVoiceIds();
        const retryVoiceId = this.voiceIds[mamaId];
        console.log('[VoiceService] 🔄 After retry, Yai voice ID:', retryVoiceId || 'STILL MISSING');
      }
    }
    
    if (actualVoiceId && actualVoiceId !== 'yai-fallback') {
      this.addToQueue({
        text,
        voiceId: actualVoiceId,
        isDirectMessage: true,
        priority: options?.priority as any || 'normal',
        source: options?.source,
        context: this.conversationPhase
      });
    } else {
      console.error(`[VoiceService] No valid voice ID for ${mamaId}. Available IDs:`, this.voiceIds);
      if (mamaId === 'yai_malee') {
        console.error('[VoiceService] ❌ YAI VOICE FAILURE - Using browser TTS fallback');
        this.useBrowserTTSFallback(text);
      }
    }
  }

  private useBrowserTTSFallback(text: string): void {
    console.log('[VoiceService] Using browser TTS fallback');
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.config.speed;
      utterance.volume = this.config.volume;
      window.speechSynthesis.speak(utterance);
    }
  }

  private async playPreGeneratedAudio(audioUrl: string): Promise<void> {
    console.log(`[VoiceService] Playing pre-generated audio: ${audioUrl}`);
    
    this.stopCurrentAudio();
    this.isCurrentlyPlayingState = true;
    
    try {
      this.currentAudio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        if (!this.currentAudio) {
          this.isCurrentlyPlayingState = false;
          reject(new Error('Failed to create audio element'));
          return;
        }

        this.currentAudio.onended = () => {
          console.log('[VoiceService] Pre-generated audio playback ended');
          this.currentAudio = null;
          this.isCurrentlyPlayingState = false;
          resolve();
        };

        this.currentAudio.onerror = (error) => {
          console.error('[VoiceService] Pre-generated audio playback error:', error);
          this.currentAudio = null;
          this.isCurrentlyPlayingState = false;
          reject(new Error('Audio playback failed'));
        };

        this.currentAudio.volume = this.config.volume;
        this.currentAudio.playbackRate = this.config.speed;
        this.currentAudio.play().catch(error => {
          console.error('[VoiceService] Failed to play pre-generated audio:', error);
          this.currentAudio = null;
          this.isCurrentlyPlayingState = false;
          reject(error);
        });
      });
    } catch (error) {
      console.error('[VoiceService] Pre-generated audio setup failed:', error);
      this.isCurrentlyPlayingState = false;
      throw error;
    }
  }

  async speakRecipeIntro(recipeId: string, mamaId: string): Promise<void> {
    const mama = getMamaById(parseInt(mamaId));
    if (!mama) return;

    // Use enhanced greeting from phrase cache
    const greeting = `Welcome to ${mama.name}'s kitchen! Let's cook together with love.`;
    await this.speak(greeting, mamaId);
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

  private addToQueue(message: QueuedMessage): void {
    console.log(`[VoiceService] Adding to priority queue:`, {
      text: message.text.substring(0, 30) + '...',
      priority: message.priority,
      source: message.source,
      context: message.context
    });
    
    // Priority queue management
    if (message.priority === 'high') {
      this.audioQueue.unshift(message);
    } else {
      this.audioQueue.push(message);
    }
    
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.audioQueue.length === 0) {
      return;
    }

    console.log(`[VoiceService] Processing enhanced queue with ${this.audioQueue.length} items`);
    this.isProcessingQueue = true;

    while (this.audioQueue.length > 0) {
      const message = this.audioQueue.shift()!;
      
      try {
        console.log(`[VoiceService] Processing message:`, {
          source: message.source,
          priority: message.priority,
          context: message.context,
          voiceId: message.voiceId
        });
        
        await this.generateAndPlaySpeech(message.text, message.voiceId);
      } catch (error) {
        console.error('[VoiceService] Error processing queue item:', error);
        this.isCurrentlyPlayingState = false;
        
        // Enhanced error recovery for Yai
        if (message.voiceId?.includes('yai') || message.text.includes('Yai')) {
          console.error('[VoiceService] 🔄 Yai voice error - attempting browser TTS fallback');
          this.useBrowserTTSFallback(message.text);
        }
      }
    }

    this.isProcessingQueue = false;
    console.log('[VoiceService] Enhanced queue processing completed');
  }

  private async generateAndPlaySpeech(text: string, voiceId: string): Promise<void> {
    try {
      // Stop any currently playing audio
      this.stopCurrentAudio();
      this.isCurrentlyPlayingState = true;
      
      console.log(`[VoiceService] Generating speech for: "${text.substring(0, 50)}..." with voiceId: ${voiceId}`);
      
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
          console.log(`[VoiceService] Audio loaded and ready to play: "${text.substring(0, 30)}..."`);
        };

        this.currentAudio.onplay = () => {
          console.log(`[VoiceService] Audio playback started`);
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

        this.currentAudio.volume = this.config.volume;
        this.currentAudio.playbackRate = this.config.speed;
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
      console.log('[VoiceService] Stopping current audio');
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      URL.revokeObjectURL(this.currentAudio.src);
      this.currentAudio = null;
    }
    this.isCurrentlyPlayingState = false;
  }

  public clearQueue(): void {
    console.log(`[VoiceService] Clearing queue with ${this.audioQueue.length} items`);
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

  public getVoiceServiceStatus(): 'ready' | 'loading' | 'error' | 'disabled' {
    if (!this.config.enabled) return 'disabled';
    if (!this.voiceIdsInitialized) return 'loading';
    if (Object.keys(this.voiceIds).length === 0) return 'error';
    return 'ready';
  }

  public getCacheStats() {
    return this.phraseCache.getCacheStats();
  }

  public clearPhraseCache(): void {
    this.phraseCache.clearCache();
    console.log('[VoiceService] Phrase cache cleared and reinitialized');
  }

  private resolveMamaId(mamaId: string): string {
    console.log(`[VoiceService] Resolving mama ID: ${mamaId}`);
    
    // First check if it's already a valid voice ID string
    const validVoiceIds = ['nonna_lucia', 'abuela_rosa', 'yai_malee'];
    if (validVoiceIds.includes(mamaId)) {
      console.log(`[VoiceService] Direct voice ID match: ${mamaId}`);
      return mamaId;
    }

    // Handle numeric IDs (both string and number)
    const numericId = typeof mamaId === 'string' ? parseInt(mamaId) : mamaId;
    console.log(`[VoiceService] Parsed numeric ID: ${numericId}`);
    
    switch (numericId) {
      case 1:
        console.log(`[VoiceService] Numeric ID 1 -> nonna_lucia`);
        return 'nonna_lucia';
      case 2:
        console.log(`[VoiceService] Numeric ID 2 -> abuela_rosa`);
        return 'abuela_rosa';
      case 3:
        console.log(`[VoiceService] Numeric ID 3 -> yai_malee`);
        return 'yai_malee';
      default:
        // Try to find by mama data lookup
        if (!isNaN(numericId)) {
          const mama = getMamaById(numericId);
          if (mama?.voiceId) {
            console.log(`[VoiceService] Found mama by ID ${numericId} -> ${mama.voiceId}`);
            return mama.voiceId;
          }
        }
        
        // Fallback - return the original string
        console.warn(`[VoiceService] Could not resolve mama ID: ${mamaId}, using as-is`);
        return mamaId;
    }
  }
}
