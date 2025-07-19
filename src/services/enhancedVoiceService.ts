
import { VoiceService, VoiceConfig, ConversationPhase } from './voiceService';
import { getMamaById } from '@/data/mamas';

export interface EnhancedVoiceConfig extends VoiceConfig {
  fallbackToTTS: boolean;
  instantResponses: boolean;
  contextAware: boolean;
}

export type ResponseSource = 'instant' | 'cached' | 'ai' | 'fallback' | 'browser-tts';
export type VoiceStatus = 'ready' | 'loading' | 'error' | 'disabled' | 'fallback';

interface InstantResponse {
  text: string;
  priority: 'high' | 'normal' | 'low';
  context?: ConversationPhase;
}

const INSTANT_RESPONSES: Record<string, Record<string, InstantResponse>> = {
  nonna_lucia: {
    greeting: { text: "Ciao bambino! Welcome to Nonna's kitchen!", priority: 'high' },
    next_step: { text: "Perfetto! Let's continue!", priority: 'normal' },
    help: { text: "Non ti preoccupare, I'm here to help you!", priority: 'high' },
    encouragement: { text: "Bravissimo! You're doing wonderful!", priority: 'normal' }
  },
  abuela_rosa: {
    greeting: { text: "¡Hola mi amor! Welcome to Abuela's cocina!", priority: 'high' },
    next_step: { text: "¡Muy bien! Next step, mijo!", priority: 'normal' },
    help: { text: "Ay, don't worry corazón, we'll figure it out!", priority: 'high' },
    encouragement: { text: "¡Qué bueno! You're cooking like a pro!", priority: 'normal' }
  },
  yai_malee: {
    greeting: { text: "Sawasdee ka! Welcome to Yai's kitchen!", priority: 'high' },
    next_step: { text: "Very good! Let's continue cooking!", priority: 'normal' },
    help: { text: "Don't worry, child. Take your time!", priority: 'high' },
    encouragement: { text: "Excellent! Your cooking spirit is strong!", priority: 'normal' }
  }
};

export class EnhancedVoiceService {
  private static instance: EnhancedVoiceService;
  private voiceService: VoiceService;
  private config: EnhancedVoiceConfig;
  private currentPhase: ConversationPhase = 'pre-cooking';
  private isInitialized = false;

  private constructor() {
    this.voiceService = VoiceService.getInstance();
    this.config = {
      ...this.voiceService.getConfig(),
      fallbackToTTS: true,
      instantResponses: true,
      contextAware: true
    };
    console.log('[EnhancedVoiceService] Initialized with enhanced features');
  }

  public static getInstance(): EnhancedVoiceService {
    if (!EnhancedVoiceService.instance) {
      EnhancedVoiceService.instance = new EnhancedVoiceService();
    }
    return EnhancedVoiceService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    console.log('[EnhancedVoiceService] Initializing enhanced voice service...');
    
    // Wait for base voice service to be ready
    let attempts = 0;
    while (this.voiceService.getVoiceServiceStatus() === 'loading' && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    
    this.isInitialized = true;
    console.log('[EnhancedVoiceService] Enhanced voice service ready');
  }

  async speakWithFallback(text: string, mamaId: string, options?: {
    priority?: 'high' | 'normal' | 'low';
    source?: ResponseSource;
    forceInstant?: boolean;
  }): Promise<void> {
    const { priority = 'normal', source = 'ai', forceInstant = false } = options || {};
    
    console.log(`[EnhancedVoiceService] Speaking with fallback: "${text.substring(0, 30)}..." for ${mamaId}`);
    
    // Check if we should use instant response
    if (this.config.instantResponses && (forceInstant || priority === 'high')) {
      const instantText = this.getInstantResponse(text, mamaId);
      if (instantText) {
        console.log('[EnhancedVoiceService] Using instant response');
        return this.speakWithRetry(instantText, mamaId, 'instant');
      }
    }
    
    // Try ElevenLabs first
    try {
      await this.speakWithRetry(text, mamaId, source);
    } catch (error) {
      console.warn('[EnhancedVoiceService] ElevenLabs failed, using browser TTS fallback:', error);
      this.speakWithBrowserTTS(text, mamaId);
    }
  }

  private async speakWithRetry(text: string, mamaId: string, source: ResponseSource, retries = 2): Promise<void> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await this.voiceService.speak(text, mamaId, {
          isDirectMessage: true,
          priority: 'high',
          source: source
        });
        return;
      } catch (error) {
        console.warn(`[EnhancedVoiceService] Attempt ${attempt + 1} failed:`, error);
        if (attempt === retries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  private speakWithBrowserTTS(text: string, mamaId: string): void {
    if (!('speechSynthesis' in window)) {
      console.error('[EnhancedVoiceService] Browser TTS not supported');
      return;
    }

    console.log('[EnhancedVoiceService] Using browser TTS fallback');
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.config.speed;
    utterance.volume = this.config.volume;
    
    // Try to match voice to mama's accent
    const voices = speechSynthesis.getVoices();
    const mama = this.getMamaPersonality(mamaId);
    
    if (mama.accent === 'Italian') {
      const italianVoice = voices.find(v => v.lang.includes('it') || v.name.includes('Italian'));
      if (italianVoice) utterance.voice = italianVoice;
    } else if (mama.accent === 'Mexican') {
      const spanishVoice = voices.find(v => v.lang.includes('es') || v.name.includes('Spanish'));
      if (spanishVoice) utterance.voice = spanishVoice;
    }
    
    speechSynthesis.speak(utterance);
  }

  private getInstantResponse(originalText: string, mamaId: string): string | null {
    const resolvedMamaId = this.resolveMamaId(mamaId);
    const responses = INSTANT_RESPONSES[resolvedMamaId];
    
    if (!responses) return null;
    
    const lowerText = originalText.toLowerCase();
    
    // Match common patterns to instant responses
    if (lowerText.includes('welcome') || lowerText.includes('hello') || lowerText.includes('ciao')) {
      return responses.greeting?.text || null;
    }
    
    if (lowerText.includes('next') || lowerText.includes('continue')) {
      return responses.next_step?.text || null;
    }
    
    if (lowerText.includes('help') || lowerText.includes('worry')) {
      return responses.help?.text || null;
    }
    
    if (lowerText.includes('good') || lowerText.includes('great') || lowerText.includes('perfect')) {
      return responses.encouragement?.text || null;
    }
    
    return null;
  }

  async speakGreeting(mamaId: string, recipeName?: string): Promise<void> {
    console.log(`[EnhancedVoiceService] Speaking greeting for ${mamaId}`);
    
    const resolvedMamaId = this.resolveMamaId(mamaId);
    const mama = this.getMamaPersonality(mamaId);
    
    let greeting = INSTANT_RESPONSES[resolvedMamaId]?.greeting?.text || `Welcome to ${mama.name}'s kitchen!`;
    
    if (recipeName) {
      switch (resolvedMamaId) {
        case 'nonna_lucia':
          greeting += ` Today we make beautiful ${recipeName} together!`;
          break;
        case 'abuela_rosa':
          greeting += ` We're going to cook delicious ${recipeName}, mijo!`;
          break;
        case 'yai_malee':
          greeting += ` Let's prepare wonderful ${recipeName} together!`;
          break;
      }
    }
    
    await this.speakWithFallback(greeting, mamaId, {
      priority: 'high',
      source: 'instant',
      forceInstant: false
    });
  }

  async speakCookingInstruction(instruction: string, mamaId: string, stepNumber?: number, tip?: string): Promise<void> {
    console.log(`[EnhancedVoiceService] Speaking cooking instruction for step ${stepNumber}`);
    
    const resolvedMamaId = this.resolveMamaId(mamaId);
    const mama = this.getMamaPersonality(mamaId);
    
    let spokenText = instruction;
    
    // Add contextual intro for cooking phase
    if (this.currentPhase === 'cooking' && stepNumber) {
      const stepIntro = this.getStepIntro(mama.accent, stepNumber);
      spokenText = `${stepIntro} ${instruction}`;
    }
    
    // Add tip if provided
    if (tip) {
      const tipPhrase = this.formatTip(mama.accent, tip);
      spokenText += ` ${tipPhrase}`;
    }
    
    await this.speakWithFallback(spokenText, mamaId, {
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

  setConversationPhase(phase: ConversationPhase): void {
    console.log(`[EnhancedVoiceService] Phase changed: ${this.currentPhase} -> ${phase}`);
    this.currentPhase = phase;
    this.voiceService.setConversationPhase(phase);
  }

  getVoiceStatus(): VoiceStatus {
    const baseStatus = this.voiceService.getVoiceServiceStatus();
    
    if (!this.config.enabled) return 'disabled';
    if (baseStatus === 'error' && this.config.fallbackToTTS) return 'fallback';
    return baseStatus as VoiceStatus;
  }

  stopSpeaking(): void {
    this.voiceService.stopCurrentAudio();
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  clearQueue(): void {
    this.voiceService.clearQueue();
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  isCurrentlyPlaying(): boolean {
    return this.voiceService.isCurrentlyPlaying() || ('speechSynthesis' in window && speechSynthesis.speaking);
  }

  updateConfig(newConfig: Partial<EnhancedVoiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.voiceService.updateConfig(newConfig);
  }

  private getMamaPersonality(mamaId: string) {
    const resolvedId = this.resolveMamaId(mamaId);
    const mama = getMamaById(resolvedId === 'nonna_lucia' ? 1 : resolvedId === 'abuela_rosa' ? 2 : 3);
    return mama || { accent: 'Italian', name: 'Nonna' };
  }

  private resolveMamaId(mamaId: string): string {
    const validVoiceIds = ['nonna_lucia', 'abuela_rosa', 'yai_malee'];
    if (validVoiceIds.includes(mamaId)) return mamaId;
    
    const numericId = typeof mamaId === 'string' ? parseInt(mamaId) : mamaId;
    switch (numericId) {
      case 1: return 'nonna_lucia';
      case 2: return 'abuela_rosa';
      case 3: return 'yai_malee';
      default: return mamaId;
    }
  }
}
