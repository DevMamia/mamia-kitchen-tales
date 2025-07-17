import { useConversation } from '@11labs/react';
import { Mama } from '@/data/mamas';
import { Recipe } from '@/data/recipes';

export interface ConversationAgentConfig {
  mama: Mama;
  recipe: Recipe;
  currentStep?: number;
  userContext?: {
    name?: string;
    cookingLevel?: string;
    preferences?: string[];
    pastSessions?: number;
  };
}

export interface AgentPersonality {
  mamaId: string;
  promptOverride: string;
  firstMessage: string;
  voiceId: string;
  language: 'en' | 'es' | 'it' | 'th';
}

// Mama personality configurations for ElevenLabs agents
export const AGENT_PERSONALITIES: Record<string, AgentPersonality> = {
  'nonna_lucia': {
    mamaId: 'nonna_lucia',
    promptOverride: `You are Nonna Lucia, a warm Italian grandmother who loves to cook with passion and share stories. You use Italian expressions like "caro/cara", "bene!", and "ecco!". You're nurturing but also a perfectionist about technique. Share cooking wisdom, family stories, and encourage with Italian warmth. Keep responses conversational and loving, like talking to your grandchild in the kitchen.`,
    firstMessage: "Ciao caro! I'm so happy you're here in my kitchen. Tell me, how are you feeling about cooking today?",
    voiceId: 'nonna_lucia',
    language: 'en'
  },
  'abuela_rosa': {
    mamaId: 'abuela_rosa', 
    promptOverride: `You are Abuela Rosa, an enthusiastic Mexican grandmother who fills the kitchen with joy and cultural stories. You use Spanish expressions like "mija/mijo", "órale!", and "¡qué rico!". You're vibrant, storytelling, and passionate about sharing Mexican culinary traditions. Weave in cultural context, family memories, and encourage with Mexican warmth and excitement.`,
    firstMessage: "¡Hola mi amor! Welcome to Abuela's kitchen. I'm so excited to cook with you today - tell me what's on your mind!",
    voiceId: 'abuela_rosa',
    language: 'en'
  },
  'yai_malee': {
    mamaId: 'yai_malee',
    promptOverride: `You are Yai Malee, a gentle Thai grandmother who brings wisdom and mindfulness to cooking. You emphasize balance, patience, and the philosophy behind Thai cooking. You're nurturing but also teach about harmony in flavors and life. Share Thai cooking wisdom, talk about balance and mindfulness, and guide with gentle encouragement and wisdom.`,
    firstMessage: "Hello dear, welcome to my kitchen. Cooking is like life - it's all about balance. How can I help you find your balance today?",
    voiceId: 'yai_malee', 
    language: 'en'
  }
};

export class ConversationAgentService {
  private conversation: ReturnType<typeof useConversation> | null = null;
  private currentConfig: ConversationAgentConfig | null = null;
  private isInitialized = false;

  constructor() {
    // Initialize will be called when needed
  }

  public initialize(conversation: ReturnType<typeof useConversation>) {
    this.conversation = conversation;
    this.isInitialized = true;
    console.log('[ConversationAgentService] Initialized with ElevenLabs conversation');
  }

  public async startConversation(config: ConversationAgentConfig, agentId: string): Promise<string | null> {
    if (!this.conversation || !this.isInitialized) {
      console.error('[ConversationAgentService] Not initialized');
      return null;
    }

    this.currentConfig = config;
    const personality = AGENT_PERSONALITIES[config.mama.voiceId];
    
    if (!personality) {
      console.error(`[ConversationAgentService] No personality found for mama: ${config.mama.voiceId}`);
      return null;
    }

    try {
      // Create conversation overrides with cooking context
      const overrides = {
        agent: {
          prompt: {
            prompt: this.buildContextualPrompt(personality.promptOverride, config)
          },
          firstMessage: this.buildContextualFirstMessage(personality.firstMessage, config)
        },
        tts: {
          voiceId: config.mama.voiceId
        }
      };

      console.log('[ConversationAgentService] Starting conversation with overrides:', overrides);

      // Start the conversation with the agent
      const conversationId = await this.conversation.startSession({
        agentId: agentId,
        overrides
      });

      console.log('[ConversationAgentService] Conversation started:', conversationId);
      return conversationId;

    } catch (error) {
      console.error('[ConversationAgentService] Failed to start conversation:', error);
      return null;
    }
  }

  public async endConversation(): Promise<void> {
    if (!this.conversation) return;

    try {
      await this.conversation.endSession();
      console.log('[ConversationAgentService] Conversation ended');
    } catch (error) {
      console.error('[ConversationAgentService] Error ending conversation:', error);
    }
  }

  public getConversationStatus(): string {
    return this.conversation?.status || 'disconnected';
  }

  public isAgentSpeaking(): boolean {
    return this.conversation?.isSpeaking || false;
  }

  private buildContextualPrompt(basePrompt: string, config: ConversationAgentConfig): string {
    const contextualInfo = [];
    
    // Add recipe context
    contextualInfo.push(`We're cooking ${config.recipe.title} today.`);
    contextualInfo.push(`It's a ${config.recipe.difficulty} level dish that serves ${config.recipe.servings} people.`);
    
    // Add current step context if provided
    if (config.currentStep && config.recipe.instructions[config.currentStep - 1]) {
      contextualInfo.push(`We're currently on step ${config.currentStep}: ${config.recipe.instructions[config.currentStep - 1]}`);
    }
    
    // Add user context if available
    if (config.userContext?.name) {
      contextualInfo.push(`The person cooking is named ${config.userContext.name}.`);
    }
    
    if (config.userContext?.cookingLevel) {
      contextualInfo.push(`They have ${config.userContext.cookingLevel} cooking experience.`);
    }

    const contextualPrompt = `${basePrompt}

COOKING CONTEXT:
${contextualInfo.join(' ')}

Remember to:
- Stay in character as ${config.mama.name}
- Help with cooking questions and provide encouragement
- Share relevant stories and cultural context
- Be conversational, not instructional (TTS handles recipe steps)
- Ask follow-up questions to keep the conversation engaging
- Respond to struggles with helpful tips and reassurance`;

    return contextualPrompt;
  }

  private buildContextualFirstMessage(baseMessage: string, config: ConversationAgentConfig): string {
    const userName = config.userContext?.name || 'dear';
    return baseMessage.replace(/caro|mi amor|dear/g, userName);
  }

  public updateCookingContext(currentStep: number, instruction: string): void {
    if (this.currentConfig) {
      this.currentConfig.currentStep = currentStep;
      // In a full implementation, we might send context updates to the agent
      console.log(`[ConversationAgentService] Updated context - Step ${currentStep}: ${instruction}`);
    }
  }
}