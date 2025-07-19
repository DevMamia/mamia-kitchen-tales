
import { VoiceService, VoiceConfig, ConversationPhase } from './voiceService';
import { getMamaById } from '@/data/mamas';

export type VoiceListeningState = 'idle' | 'wake_word_required' | 'always_listening' | 'processing' | 'responding';
export type CookingContext = 'browsing' | 'pre_cooking' | 'active_cooking' | 'paused' | 'completed';

interface ContextAwareConfig extends VoiceConfig {
  smartWakeWord: boolean;
  contextAwareness: boolean;
  intelligentInterruption: boolean;
}

interface VoiceContext {
  cookingContext: CookingContext;
  currentStep: number;
  totalSteps: number;
  mamaId: string;
  recipeId?: string;
  userStruggling: boolean;
  lastInteraction: number;
}

export class ContextAwareVoiceService {
  private static instance: ContextAwareVoiceService;
  private voiceService: VoiceService;
  private listeningState: VoiceListeningState = 'idle';
  private voiceContext: VoiceContext = {
    cookingContext: 'browsing',
    currentStep: 1,
    totalSteps: 1,
    mamaId: 'nonna_lucia',
    userStruggling: false,
    lastInteraction: Date.now()
  };
  
  private config: ContextAwareConfig = {
    mode: 'full',
    volume: 0.8,
    speed: 1.0,
    enabled: true,
    useCaching: true,
    smartWakeWord: true,
    contextAwareness: true,
    intelligentInterruption: true
  };

  private contextualPhrases = {
    wake_word_prompts: {
      idle: ["Say 'Hey Nonna' to start cooking", "Need help? Just say 'Hey Abuela'", "Say 'Hello Yai' when ready"],
      paused: ["Say 'Continue' to resume cooking", "Ready to continue? Say 'Hey {mama}'"]
    },
    encouragement: {
      struggling: [
        "Don't worry tesoro, even I make mistakes sometimes!",
        "No te preocupes mija, we'll fix this together!",
        "Take a deep breath, dear. Cooking is about patience."
      ],
      success: [
        "Bravissimo! You're becoming a real chef!",
        "¡Perfecto! Abuela is so proud of you!",
        "Excellent work! You have good cooking spirit."
      ]
    }
  };

  static getInstance(): ContextAwareVoiceService {
    if (!ContextAwareVoiceService.instance) {
      ContextAwareVoiceService.instance = new ContextAwareVoiceService();
    }
    return ContextAwareVoiceService.instance;
  }

  private constructor() {
    this.voiceService = VoiceService.getInstance();
    console.log('[ContextAwareVoiceService] Initialized with smart wake word and context awareness');
  }

  public updateContext(context: Partial<VoiceContext>): void {
    const previousContext = { ...this.voiceContext };
    this.voiceContext = { ...this.voiceContext, ...context, lastInteraction: Date.now() };
    
    console.log('[ContextAwareVoiceService] Context updated:', {
      from: previousContext.cookingContext,
      to: this.voiceContext.cookingContext,
      step: this.voiceContext.currentStep,
      struggling: this.voiceContext.userStruggling
    });

    // Update listening state based on context
    this.updateListeningState();
    
    // Update voice service phase
    const phase: ConversationPhase = 
      this.voiceContext.cookingContext === 'pre_cooking' ? 'pre-cooking' :
      this.voiceContext.cookingContext === 'active_cooking' ? 'cooking' : 'post-cooking';
    
    this.voiceService.setConversationPhase(phase);
  }

  private updateListeningState(): void {
    const previousState = this.listeningState;
    
    switch (this.voiceContext.cookingContext) {
      case 'browsing':
        this.listeningState = this.config.smartWakeWord ? 'wake_word_required' : 'idle';
        break;
      case 'pre_cooking':
        this.listeningState = 'wake_word_required';
        break;
      case 'active_cooking':
        this.listeningState = 'always_listening';
        break;
      case 'paused':
        this.listeningState = 'wake_word_required';
        break;
      case 'completed':
        this.listeningState = 'wake_word_required';
        break;
      default:
        this.listeningState = 'idle';
    }

    if (previousState !== this.listeningState) {
      console.log(`[ContextAwareVoiceService] Listening state: ${previousState} → ${this.listeningState}`);
    }
  }

  public async speakWithContext(text: string, options?: {
    priority?: 'high' | 'normal' | 'low';
    contextual?: boolean;
    interruption?: boolean;
  }): Promise<void> {
    const { priority = 'normal', contextual = true, interruption = false } = options || {};

    let enhancedText = text;
    
    // Add contextual personality based on mama and situation
    if (contextual) {
      enhancedText = this.enhanceWithContext(text);
    }

    // Handle intelligent interruption
    if (interruption && this.config.intelligentInterruption) {
      this.voiceService.clearQueue();
    }

    console.log(`[ContextAwareVoiceService] Speaking with context:`, {
      original: text.substring(0, 30) + '...',
      enhanced: enhancedText.substring(0, 30) + '...',
      context: this.voiceContext.cookingContext,
      priority
    });

    return this.voiceService.speak(enhancedText, this.voiceContext.mamaId, {
      isDirectMessage: true,
      priority,
      source: 'instant'
    });
  }

  private enhanceWithContext(text: string): string {
    const mama = getMamaById(this.voiceContext.mamaId === 'nonna_lucia' ? 1 : 
                            this.voiceContext.mamaId === 'abuela_rosa' ? 2 : 3);
    
    if (!mama) return text;

    // Add contextual personality based on cooking situation
    if (this.voiceContext.userStruggling) {
      const encouragement = this.getRandomPhrase('encouragement.struggling');
      return `${encouragement} Now, ${text.toLowerCase()}`;
    }

    // Add step context for active cooking
    if (this.voiceContext.cookingContext === 'active_cooking') {
      const stepContext = this.getStepContextIntro(mama.accent);
      return `${stepContext} ${text}`;
    }

    // Add cultural flair based on mama
    return this.addCulturalFlair(text, mama.accent);
  }

  private getStepContextIntro(accent: string): string {
    const { currentStep, totalSteps } = this.voiceContext;
    
    switch (accent) {
      case 'Italian':
        return `Allora, step ${currentStep} of ${totalSteps}:`;
      case 'Mexican':
        return `Bueno mija, paso ${currentStep} de ${totalSteps}:`;
      case 'Thai':
        return `Now, step ${currentStep} of ${totalSteps}:`;
      default:
        return `Step ${currentStep}:`;
    }
  }

  private addCulturalFlair(text: string, accent: string): string {
    switch (accent) {
      case 'Italian':
        return Math.random() > 0.7 ? `Ecco! ${text} Bene!` : text;
      case 'Mexican':
        return Math.random() > 0.7 ? `¡Órale! ${text} ¿Sí, mija?` : text;
      case 'Thai':
        return Math.random() > 0.7 ? `${text} Ka!` : text;
      default:
        return text;
    }
  }

  private getRandomPhrase(category: string): string {
    const keys = category.split('.');
    let phrases: any = this.contextualPhrases;
    
    for (const key of keys) {
      phrases = phrases[key];
      if (!phrases) return '';
    }
    
    if (Array.isArray(phrases)) {
      return phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    return '';
  }

  public getListeningState(): VoiceListeningState {
    return this.listeningState;
  }

  public getCurrentContext(): VoiceContext {
    return { ...this.voiceContext };
  }

  public shouldShowWakeWordPrompt(): boolean {
    return this.listeningState === 'wake_word_required' && 
           this.config.smartWakeWord &&
           (Date.now() - this.voiceContext.lastInteraction) > 10000; // 10 seconds
  }

  public getWakeWordPrompt(): string {
    const mama = getMamaById(this.voiceContext.mamaId === 'nonna_lucia' ? 1 : 
                            this.voiceContext.mamaId === 'abuela_rosa' ? 2 : 3);
    
    const contextKey = this.voiceContext.cookingContext === 'paused' ? 'paused' : 'idle';
    const prompt = this.contextualPhrases.wake_word_prompts[contextKey][0];
    
    return prompt.replace('{mama}', mama?.name || 'Mama');
  }

  public updateConfig(config: Partial<ContextAwareConfig>): void {
    this.config = { ...this.config, ...config };
    this.voiceService.updateConfig(config);
    console.log('[ContextAwareVoiceService] Config updated:', this.config);
  }

  public getConfig(): ContextAwareConfig {
    return { ...this.config };
  }

  // Delegate other methods to voice service
  public isCurrentlyPlaying(): boolean {
    return this.voiceService.isCurrentlyPlaying();
  }

  public getQueueLength(): number {
    return this.voiceService.getQueueLength();
  }

  public stopSpeaking(): void {
    this.voiceService.stopCurrentAudio();
  }

  public clearQueue(): void {
    this.voiceService.clearQueue();
  }

  public getVoiceServiceStatus(): 'ready' | 'loading' | 'error' | 'disabled' {
    return this.voiceService.getVoiceServiceStatus();
  }
}
