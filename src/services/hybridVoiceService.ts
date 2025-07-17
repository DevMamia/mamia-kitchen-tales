import { VoiceService } from './voiceService';
import { ConversationalService } from './conversationalService';

export type AudioMode = 'tts-only' | 'conversation-only' | 'hybrid';
export type SubscriptionTier = 'free' | 'premium' | 'family';

export interface HybridVoiceConfig {
  mode: AudioMode;
  subscriptionTier: SubscriptionTier;
  allowInterruption: boolean;
  autoProgressSteps: boolean;
}

export interface AudioSystemStatus {
  ttsActive: boolean;
  conversationActive: boolean;
  currentSystem: 'tts' | 'conversation' | 'none';
  canInterrupt: boolean;
}

/**
 * HybridVoiceService coordinates between TTS and Conversational AI
 * - TTS handles structured content (steps, tips, greetings)
 * - Conversational AI handles dynamic interaction (questions, stories)
 * - Provides seamless handoff and tier-based access control
 */
export class HybridVoiceService {
  private static instance: HybridVoiceService;
  private voiceService = VoiceService.getInstance();
  private conversationalService = ConversationalService.getInstance();
  
  private config: HybridVoiceConfig = {
    mode: 'hybrid',
    subscriptionTier: 'free',
    allowInterruption: true,
    autoProgressSteps: false
  };

  private status: AudioSystemStatus = {
    ttsActive: false,
    conversationActive: false,
    currentSystem: 'none',
    canInterrupt: true
  };

  private stepProgressCallback?: (action: 'next' | 'previous' | 'repeat') => void;
  private currentStep = 0;
  private recipe: any = null;

  static getInstance(): HybridVoiceService {
    if (!HybridVoiceService.instance) {
      HybridVoiceService.instance = new HybridVoiceService();
    }
    return HybridVoiceService.instance;
  }

  private constructor() {}

  /**
   * Configure the hybrid system
   */
  updateConfig(newConfig: Partial<HybridVoiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[HybridVoiceService] Config updated:', this.config);
  }

  /**
   * Set the step progression callback for conversation-triggered navigation
   */
  setStepProgressCallback(callback: (action: 'next' | 'previous' | 'repeat') => void): void {
    this.stepProgressCallback = callback;
  }

  /**
   * Set current recipe context for conversation awareness
   */
  setRecipeContext(recipe: any, currentStep: number): void {
    this.recipe = recipe;
    this.currentStep = currentStep;
  }

  /**
   * Speak structured content using TTS (steps, tips, greetings)
   */
  async speakStructuredContent(text: string, mamaId: string, type: 'step' | 'tip' | 'greeting' = 'step'): Promise<void> {
    console.log(`[HybridVoiceService] Speaking ${type}:`, text);

    // Stop any active conversation if interruption is allowed
    if (this.status.conversationActive && this.config.allowInterruption) {
      await this.stopConversation();
    }

    this.updateStatus({ ttsActive: true, currentSystem: 'tts' });

    try {
      await this.voiceService.speak(text, mamaId);
    } catch (error) {
      console.error('[HybridVoiceService] TTS failed:', error);
      throw error;
    } finally {
      this.updateStatus({ ttsActive: false, currentSystem: 'none' });
    }
  }

  /**
   * Start conversational mode for dynamic interaction
   */
  async startConversation(mamaId: string, stepText: string, recipe?: any): Promise<void> {
    // Check subscription tier access
    if (this.config.subscriptionTier === 'free' && this.config.mode === 'conversation-only') {
      throw new Error('Conversation mode requires premium subscription');
    }

    if (this.config.mode === 'tts-only') {
      console.log('[HybridVoiceService] TTS-only mode, conversation not available');
      return;
    }

    // Stop any active TTS if interruption is allowed
    if (this.status.ttsActive && this.config.allowInterruption) {
      this.voiceService.stopCurrentAudio();
    }

    this.updateStatus({ conversationActive: true, currentSystem: 'conversation' });

    try {
      await this.conversationalService.startConversation({
        mamaId,
        onTranscript: (text: string, isFinal: boolean) => {
          if (isFinal) {
            this.handleConversationInput(text, mamaId);
          }
        },
        onCommand: (command: string) => {
          this.handleVoiceCommand(command);
        },
        onError: (error: string) => {
          console.error('[HybridVoiceService] Conversation error:', error);
          this.updateStatus({ conversationActive: false, currentSystem: 'none' });
        }
      }, stepText, recipe);
    } catch (error) {
      console.error('[HybridVoiceService] Conversation start failed:', error);
      this.updateStatus({ conversationActive: false, currentSystem: 'none' });
      throw error;
    }
  }

  /**
   * Stop conversation mode
   */
  async stopConversation(): Promise<void> {
    if (!this.status.conversationActive) return;

    try {
      await this.conversationalService.stopConversation();
    } catch (error) {
      console.error('[HybridVoiceService] Error stopping conversation:', error);
    } finally {
      this.updateStatus({ conversationActive: false, currentSystem: 'none' });
    }
  }

  /**
   * Handle conversation input and detect step navigation commands
   */
  private handleConversationInput(text: string, mamaId: string): void {
    const lowerText = text.toLowerCase();

    // Check for step navigation commands
    if (lowerText.includes('next step') || lowerText.includes('continue')) {
      this.triggerStepProgress('next');
      return;
    }

    if (lowerText.includes('previous step') || lowerText.includes('go back')) {
      this.triggerStepProgress('previous');
      return;
    }

    if (lowerText.includes('repeat') || lowerText.includes('say that again')) {
      this.triggerStepProgress('repeat');
      return;
    }

    // Check for step reading requests
    if (lowerText.includes('read the step') || lowerText.includes('what\'s the current step')) {
      this.readCurrentStep(mamaId);
      return;
    }

    // For other conversation, let the conversational AI handle it normally
    console.log('[HybridVoiceService] General conversation:', text);
  }

  /**
   * Handle voice commands
   */
  private handleVoiceCommand(command: string): void {
    console.log('[HybridVoiceService] Voice command:', command);
    
    const lowerCommand = command.toLowerCase();
    
    if (['next', 'continue'].includes(lowerCommand)) {
      this.triggerStepProgress('next');
    } else if (['back', 'previous'].includes(lowerCommand)) {
      this.triggerStepProgress('previous');
    } else if (['repeat'].includes(lowerCommand)) {
      this.triggerStepProgress('repeat');
    }
  }

  /**
   * Trigger step progression via callback and read with TTS
   */
  private triggerStepProgress(action: 'next' | 'previous' | 'repeat'): void {
    console.log(`[HybridVoiceService] Triggering step ${action}`);
    
    if (this.stepProgressCallback) {
      this.stepProgressCallback(action);
    }
  }

  /**
   * Read current step using TTS (triggered by conversation)
   */
  private async readCurrentStep(mamaId: string): Promise<void> {
    if (!this.recipe || !this.recipe.steps || !this.recipe.steps[this.currentStep]) {
      console.warn('[HybridVoiceService] No current step available');
      return;
    }

    const currentStepText = this.recipe.steps[this.currentStep].instruction;
    await this.speakStructuredContent(currentStepText, mamaId, 'step');
  }

  /**
   * Get current audio system status
   */
  getStatus(): AudioSystemStatus {
    return { ...this.status };
  }

  /**
   * Check if conversation mode is available for current tier
   */
  isConversationAvailable(): boolean {
    if (this.config.mode === 'tts-only') return false;
    if (this.config.subscriptionTier === 'free' && this.config.mode === 'conversation-only') return false;
    return true;
  }

  /**
   * Stop all audio systems
   */
  async stopAll(): Promise<void> {
    this.voiceService.stopCurrentAudio();
    await this.stopConversation();
    this.updateStatus({ 
      ttsActive: false, 
      conversationActive: false, 
      currentSystem: 'none' 
    });
  }

  /**
   * Update internal status
   */
  private updateStatus(updates: Partial<AudioSystemStatus>): void {
    this.status = { ...this.status, ...updates };
    console.log('[HybridVoiceService] Status updated:', this.status);
  }
}