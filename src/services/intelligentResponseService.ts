import { Recipe } from '@/data/recipes';
import { Mama } from '@/data/mamas';

interface ResponseContext {
  mama: Mama;
  recipe: Recipe;
  currentStep: number;
  conversationPhase: 'pre-cooking' | 'cooking';
  userInput: string;
  isInterruption?: boolean;
}

export class IntelligentResponseService {
  private static instance: IntelligentResponseService;

  static getInstance(): IntelligentResponseService {
    if (!IntelligentResponseService.instance) {
      IntelligentResponseService.instance = new IntelligentResponseService();
    }
    return IntelligentResponseService.instance;
  }

  // Template responses for common cooking scenarios (60-80%)
  private readonly templateResponses = {
    italian: {
      encouragement: [
        "Bene! You're doing magnifico!",
        "Perfetto! Just like my nonna taught me!",
        "Sì, sì! You have good instincts, caro!",
        "Bellissimo! You're a natural in the kitchen!"
      ],
      stepConfirmation: [
        "Bene! Now we...",
        "Perfetto! Next step is...",
        "Sì! Now let's...",
        "Excellent! Time to..."
      ],
      interruption: [
        "Sì, tesoro? What do you need?",
        "Certo! Tell me, what's happening?",
        "Dimmi tutto! What can I help you with?",
        "Of course, cara! What's the matter?"
      ],
      troubleshooting: [
        "Eh, no problem! This happens sometimes...",
        "Madonna mia! Don't worry, we fix this together!",
        "Listen to me - this is not so bad. We can save this!",
        "Tranquillo! Even Nonna made mistakes!"
      ]
    },
    mexican: {
      encouragement: [
        "¡Qué bueno! You're learning fast, mija!",
        "¡Perfecto! You have good hands for cooking!",
        "¡Órale! That's exactly right!",
        "¡Excelente! You make your abuela proud!"
      ],
      stepConfirmation: [
        "¡Perfecto! Now we...",
        "¡Sí! Next thing is...",
        "¡Bueno! Time to...",
        "¡Órale! Let's..."
      ],
      interruption: [
        "¿Sí, mija? What do you need?",
        "¡Claro! Tell me what's happening!",
        "¿Qué pasa? How can abuela help?",
        "Of course, mi amor! What's wrong?"
      ],
      troubleshooting: [
        "¡Ay, no te preocupes! We fix this together!",
        "¡No problema! This happened to me too when I was learning!",
        "¡Tranquila! Even your abuela burned things sometimes!",
        "Don't worry, mija! We make it work!"
      ]
    },
    thai: {
      encouragement: [
        "Beautiful work, darling! You have good intuition!",
        "Perfect technique! You're learning the Thai way!",
        "Wonderful! You understand the balance!",
        "Excellent! Your hands know what they're doing!"
      ],
      stepConfirmation: [
        "Beautiful! Now we...",
        "Perfect! Time to...",
        "Lovely! Next we...",
        "Wonderful! Let's..."
      ],
      interruption: [
        "Yes, dear? How can I help?",
        "Of course! What do you need to know?",
        "Tell me, darling - what's happening?",
        "Sabai sabai! What can I explain?"
      ],
      troubleshooting: [
        "No worries, dear! Like the river, we find another way!",
        "This is normal! Even in Thailand, we adjust as we cook!",
        "Don't stress, darling! Cooking is about patience and flow!",
        "It's okay! Every cook learns through these moments!"
      ]
    }
  };

  private readonly voiceCommands = {
    next: ['next', 'continue', 'move on', 'what\'s next'],
    previous: ['back', 'previous', 'go back', 'last step'],
    repeat: ['repeat', 'say again', 'what did you say', 'again'],
    help: ['help', 'stuck', 'confused', 'don\'t understand'],
    timer: ['timer', 'time', 'how long', 'when'],
    ingredients: ['ingredients', 'what do i need', 'shopping'],
    technique: ['how', 'why', 'technique', 'method']
  };

  detectVoiceCommand(input: string): string | null {
    const lowercaseInput = input.toLowerCase();
    
    for (const [command, phrases] of Object.entries(this.voiceCommands)) {
      if (phrases.some(phrase => lowercaseInput.includes(phrase))) {
        return command;
      }
    }
    
    return null;
  }

  isTemplateResponse(input: string, context: ResponseContext): boolean {
    const command = this.detectVoiceCommand(input);
    
    // Common commands and simple questions use templates
    if (command) return true;
    
    // Simple greetings and acknowledgments
    if (/^(yes|no|ok|good|great|thanks|hello|hi)$/i.test(input.trim())) {
      return true;
    }
    
    // Short responses (< 5 words) typically use templates
    if (input.split(' ').length < 5) return true;
    
    return false;
  }

  getTemplateResponse(input: string, context: ResponseContext): string {
    const { mama, isInterruption } = context;
    const accent = mama.accent.toLowerCase() as keyof typeof this.templateResponses;
    const responses = this.templateResponses[accent] || this.templateResponses.italian;
    
    if (isInterruption) {
      return this.getRandomResponse(responses.interruption);
    }
    
    const command = this.detectVoiceCommand(input);
    
    switch (command) {
      case 'help':
        return this.getRandomResponse(responses.troubleshooting);
      default:
        return this.getRandomResponse(responses.encouragement);
    }
  }

  async generateDynamicResponse(input: string, context: ResponseContext): Promise<string> {
    // For complex questions, cultural context, and detailed explanations
    // This would integrate with OpenAI for dynamic responses
    
    const { mama, recipe, currentStep, conversationPhase } = context;
    
    const systemPrompt = `You are ${mama.name}, a ${mama.accent} cooking teacher. 
    You're helping someone ${conversationPhase === 'pre-cooking' ? 'learn about' : 'cook'} ${recipe.title}.
    ${conversationPhase === 'cooking' ? `They're currently on step ${currentStep}.` : ''}
    
    Respond in character with your ${mama.accent} personality, accent, and cultural expressions.
    Keep responses warm, encouraging, and conversational (2-3 sentences max).
    
    User said: "${input}"`;
    
    try {
      // This would call OpenAI API for dynamic responses
      // For now, return a fallback template response
      const accent = mama.accent.toLowerCase() as keyof typeof this.templateResponses;
      const responses = this.templateResponses[accent] || this.templateResponses.italian;
      return this.getRandomResponse(responses.encouragement);
    } catch (error) {
      console.error('Dynamic response generation failed:', error);
      // Fallback to template
      return this.getTemplateResponse(input, context);
    }
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Enhanced response with cooking context
  addCookingContext(response: string, context: ResponseContext): string {
    const { recipe, currentStep, conversationPhase } = context;
    
    if (conversationPhase === 'cooking' && currentStep <= recipe.instructions.length) {
      const currentInstruction = recipe.instructions[currentStep - 1];
      
      // Add step reference for longer responses
      if (response.length > 50 && Math.random() > 0.7) {
        return `${response} Remember, we're ${currentInstruction.toLowerCase()}.`;
      }
    }
    
    return response;
  }
}

export const intelligentResponseService = IntelligentResponseService.getInstance();