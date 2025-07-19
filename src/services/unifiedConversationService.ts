import { ConversationalService } from './conversationalService';
import { VoiceService } from './voiceService';
import { getMamaById } from '@/data/mamas';

interface TemplateResponse {
  pattern: RegExp;
  responses: string[];
  priority: 'high' | 'normal' | 'low';
  requiresPersonalization: boolean;
}

interface ConversationConfig {
  mamaId: string;
  recipeContext?: string;
  currentStep?: number;
  userSkillLevel?: 'beginner' | 'intermediate' | 'advanced';
  culturalContext?: boolean;
}

export class UnifiedConversationService {
  private static instance: UnifiedConversationService;
  private conversationalService = ConversationalService.getInstance();
  private voiceService = VoiceService.getInstance();
  private templateResponses: Record<string, TemplateResponse[]> = {};
  private responseCache = new Map<string, { response: string; timestamp: number }>();
  private config: ConversationConfig = { mamaId: 'nonna_lucia' };

  static getInstance(): UnifiedConversationService {
    if (!UnifiedConversationService.instance) {
      UnifiedConversationService.instance = new UnifiedConversationService();
    }
    return UnifiedConversationService.instance;
  }

  private constructor() {
    this.initializeTemplateResponses();
  }

  private initializeTemplateResponses(): void {
    // Italian Nonna Lucia responses
    this.templateResponses.nonna_lucia = [
      {
        pattern: /\b(help|stuck|confused|wrong)\b/i,
        responses: [
          "Non ti preoccupare, tesoro! Even Nonna makes mistakes sometimes. Tell me what happened.",
          "Calma, caro! We fix this together. What's troubling you?",
          "Madonna mia! Don't worry, bambino. These things happen in the kitchen!"
        ],
        priority: 'high',
        requiresPersonalization: false
      },
      {
        pattern: /\b(how long|how much time|when ready)\b/i,
        responses: [
          "Ah, the eternal question! Trust your nose, tesoro. When it smells like heaven, it's ready!",
          "In my kitchen, we cook with amore, not just timers. Watch the color, smell the aromas.",
          "Bene, caro! Cooking time depends on your stove and your heart. Be patient!"
        ],
        priority: 'normal',
        requiresPersonalization: true
      },
      {
        pattern: /\b(good|great|perfect|delicious)\b/i,
        responses: [
          "Bravissimo! You're becoming a real chef, just like Nonna always knew!",
          "Perfetto! My heart sings when I hear this. You make me so proud!",
          "Madonna! You have the magic touch! Your famiglia will be so happy!"
        ],
        priority: 'normal',
        requiresPersonalization: false
      }
    ];

    // Mexican Abuela Rosa responses
    this.templateResponses.abuela_rosa = [
      {
        pattern: /\b(help|stuck|confused|wrong)\b/i,
        responses: [
          "Ay, mi amor! Don't worry, mijo. Abuela will help you fix this, sí?",
          "No te preocupes, corazón! Even I burn the beans sometimes. What happened?",
          "Órale! These things happen, mija. Tell me what's wrong and we'll solve it together!"
        ],
        priority: 'high',
        requiresPersonalization: false
      },
      {
        pattern: /\b(how long|how much time|when ready)\b/i,
        responses: [
          "Mijo, cooking is not about watching the clock! It's about putting your corazón into it.",
          "When the smell fills your kitchen and your neighbors start knocking, then it's ready!",
          "Trust your senses, mi amor. The food will tell you when it's perfect!"
        ],
        priority: 'normal',
        requiresPersonalization: true
      },
      {
        pattern: /\b(good|great|perfect|delicious)\b/i,
        responses: [
          "¡Qué bueno! You're cooking like a true mexicana now, mija!",
          "¡Perfecto! Abuela's heart is full of pride! Your familia will feast like kings!",
          "¡Órale! You have the gift, corazón! Keep cooking with that passion!"
        ],
        priority: 'normal',
        requiresPersonalization: false
      }
    ];

    // Thai Yai Malee responses
    this.templateResponses.yai_malee = [
      {
        pattern: /\b(help|stuck|confused|wrong)\b/i,
        responses: [
          "Mai pen rai! Don't worry, little one. In Thai cooking, patience solves everything.",
          "Take a deep breath, child. Tell Yai what you're seeing and we'll work through it together.",
          "It's okay, dear. Every cook has these moments. What can I help you with?"
        ],
        priority: 'high',
        requiresPersonalization: false
      },
      {
        pattern: /\b(how long|how much time|when ready)\b/i,
        responses: [
          "In Thai cooking, we listen to the food, not the clock. Let your senses guide you.",
          "When the aromas dance together in harmony, then you know it's ready, ka!",
          "Cook with mindfulness, dear. The food will show you when it's perfect."
        ],
        priority: 'normal',
        requiresPersonalization: true
      },
      {
        pattern: /\b(good|great|perfect|delicious)\b/i,
        responses: [
          "Sabai! Very good! You have beautiful cooking energy, child!",
          "Excellent! Your cooking spirit is strong! The flavors are dancing with joy!",
          "Wonderful! You understand the Thai way of cooking with heart and balance!"
        ],
        priority: 'normal',
        requiresPersonalization: false
      }
    ];

    console.log('[UnifiedConversationService] Template responses initialized');
  }

  public updateConfig(newConfig: Partial<ConversationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[UnifiedConversationService] Config updated:', this.config);
  }

  public async handleUserInput(input: string, options?: {
    forceAI?: boolean;
    priority?: 'high' | 'normal' | 'low';
  }): Promise<string> {
    const { forceAI = false, priority = 'normal' } = options || {};
    const startTime = Date.now();

    console.log(`[UnifiedConversationService] Processing input: "${input.substring(0, 30)}..."`);

    try {
      // Check cache first (unless forced AI)
      if (!forceAI) {
        const cached = this.checkCache(input);
        if (cached) {
          console.log(`[UnifiedConversationService] Cache hit (${Date.now() - startTime}ms)`);
          return cached;
        }
      }

      // Try template matching for fast responses
      if (!forceAI && priority === 'high') {
        const templateResponse = this.findTemplateMatch(input);
        if (templateResponse) {
          const response = this.personalizeResponse(templateResponse, input);
          this.cacheResponse(input, response);
          console.log(`[UnifiedConversationService] Template match (${Date.now() - startTime}ms)`);
          return response;
        }
      }

      // Fall back to AI conversation service
      console.log('[UnifiedConversationService] Using AI conversation service');
      const aiResponse = await this.getAIResponse(input);
      this.cacheResponse(input, aiResponse);
      
      console.log(`[UnifiedConversationService] AI response (${Date.now() - startTime}ms)`);
      return aiResponse;

    } catch (error) {
      console.error('[UnifiedConversationService] Error processing input:', error);
      return this.getFallbackResponse();
    }
  }

  private checkCache(input: string): string | null {
    const cacheKey = this.generateCacheKey(input);
    const cached = this.responseCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < 300000) { // 5 minute cache
      return cached.response;
    }
    
    return null;
  }

  private findTemplateMatch(input: string): string | null {
    const mamaTemplates = this.templateResponses[this.config.mamaId] || [];
    const lowerInput = input.toLowerCase();

    for (const template of mamaTemplates) {
      if (template.pattern.test(lowerInput)) {
        const randomResponse = template.responses[Math.floor(Math.random() * template.responses.length)];
        return randomResponse;
      }
    }

    return null;
  }

  private personalizeResponse(response: string, originalInput: string): string {
    // Add contextual personalization based on current cooking state
    let personalizedResponse = response;

    if (this.config.currentStep) {
      personalizedResponse = personalizedResponse.replace(
        /\b(step|paso|now)\b/gi, 
        `step ${this.config.currentStep}`
      );
    }

    if (this.config.recipeContext) {
      personalizedResponse = personalizedResponse.replace(
        /\b(dish|recipe|this)\b/gi,
        this.config.recipeContext
      );
    }

    // Add cultural context if enabled
    if (this.config.culturalContext) {
      const mama = getMamaById(this.config.mamaId === 'nonna_lucia' ? 1 : 
                              this.config.mamaId === 'abuela_rosa' ? 2 : 3);
      if (mama && Math.random() > 0.7) {
        personalizedResponse += ` ${mama.emoji}`;
      }
    }

    return personalizedResponse;
  }

  private async getAIResponse(input: string): Promise<string> {
    // Use existing conversational service for complex queries
    return new Promise((resolve) => {
      // Generate contextual response using existing mama personality system
      const responses = this.generateMamaResponse(input, this.config.mamaId);
      const response = responses.length > 0 ? responses[0] : this.getFallbackResponse();
      resolve(response);
    });
  }

  private generateMamaResponse(input: string, mamaId: string): string[] {
    // Reuse logic from conversational service but enhance it
    const lowerInput = input.toLowerCase();
    
    // Enhanced cooking questions and responses
    if (lowerInput.includes('substitute') || lowerInput.includes('replace')) {
      if (mamaId === 'nonna_lucia') {
        return ["Mamma mia! Substitutions are tricky, caro. Tell me what you need to replace and I'll help you find the perfect alternative!"];
      } else if (mamaId === 'abuela_rosa') {
        return ["¡Ay, substitutions! Don't worry, mijo. Mexican cooking is all about adapting. What ingredient do you need to replace?"];
      } else {
        return ["In Thai cooking, balance is key. What ingredient are you missing? I'll help you find a good substitute that keeps the harmony."];
      }
    }

    if (lowerInput.includes('spicy') || lowerInput.includes('hot')) {
      if (mamaId === 'nonna_lucia') {
        return ["Ah, you want more fuoco! Add a pinch of red pepper flakes, but careful - start small, tesoro!"];
      } else if (mamaId === 'abuela_rosa') {
        return ["¡Órale! You want some calor! Add more chile, but taste as you go, mi amor. Too much heat kills the flavor!"];
      } else {
        return ["For Thai heat, add more chilies gradually. We want the fire to dance with the other flavors, not overpower them!"];
      }
    }

    // Return enhanced fallback
    return [this.getFallbackResponse()];
  }

  private getFallbackResponse(): string {
    const fallbacks = {
      nonna_lucia: "Dimmi tutto, caro! I'm here to help you cook with amore!",
      abuela_rosa: "Cuéntame todo, mijo! Abuela is here to help you succeed!",
      yai_malee: "Tell me more, dear! Yai is here to guide you through any cooking challenge!"
    };

    return fallbacks[this.config.mamaId as keyof typeof fallbacks] || fallbacks.nonna_lucia;
  }

  private generateCacheKey(input: string): string {
    return `${this.config.mamaId}_${input.toLowerCase().substring(0, 20)}`;
  }

  private cacheResponse(input: string, response: string): void {
    const cacheKey = this.generateCacheKey(input);
    this.responseCache.set(cacheKey, {
      response,
      timestamp: Date.now()
    });

    // Clean old cache entries (keep only last 50)
    if (this.responseCache.size > 50) {
      const entries = Array.from(this.responseCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      entries.slice(0, 10).forEach(([key]) => this.responseCache.delete(key));
    }
  }

  public async speakResponse(response: string): Promise<void> {
    try {
      await this.voiceService.speak(response, this.config.mamaId, {
        isDirectMessage: true,
        priority: 'high',
        source: 'ai'
      });
    } catch (error) {
      console.error('[UnifiedConversationService] Failed to speak response:', error);
    }
  }

  public clearCache(): void {
    this.responseCache.clear();
    console.log('[UnifiedConversationService] Response cache cleared');
  }
}
