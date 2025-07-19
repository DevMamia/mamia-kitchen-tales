
interface VoiceCommand {
  patterns: RegExp[];
  action: string;
  priority: 'emergency' | 'navigation' | 'query' | 'social';
  requiresConfirmation: boolean;
  culturalVariants?: Record<string, string[]>;
}

interface CommandContext {
  currentStep: number;
  totalSteps: number;
  cookingPhase: 'pre-cooking' | 'cooking' | 'post-cooking';
  mamaId: string;
  strugglingSteps: number[];
  recentCommands: string[];
}

export class SmartVoiceCommandService {
  private static instance: SmartVoiceCommandService;
  private commands: VoiceCommand[] = [];
  private context: CommandContext = {
    currentStep: 1,
    totalSteps: 1,
    cookingPhase: 'pre-cooking',
    mamaId: 'nonna_lucia',
    strugglingSteps: [],
    recentCommands: []
  };

  static getInstance(): SmartVoiceCommandService {
    if (!SmartVoiceCommandService.instance) {
      SmartVoiceCommandService.instance = new SmartVoiceCommandService();
    }
    return SmartVoiceCommandService.instance;
  }

  private constructor() {
    this.initializeCommands();
  }

  private initializeCommands(): void {
    this.commands = [
      // Emergency commands (highest priority)
      {
        patterns: [
          /\b(help|emergency|fire|burning|smoke|disaster)\b/i,
          /\b(something wrong|went wrong|messed up)\b/i,
          /\b(ruined|disaster|terrible|awful)\b/i
        ],
        action: 'emergency_help',
        priority: 'emergency',
        requiresConfirmation: false,
        culturalVariants: {
          nonna_lucia: ['aiuto', 'madonna', 'disastro'],
          abuela_rosa: ['ayuda', 'socorro', 'dios mío'],
          yai_malee: ['chuay duay', 'help me']
        }
      },

      // Navigation commands
      {
        patterns: [
          /\b(next step|continue|move on|proceed)\b/i,
          /\b(what's next|next please|go forward)\b/i,
          /\b(done with this|finished|ready to continue)\b/i
        ],
        action: 'next_step',
        priority: 'navigation',
        requiresConfirmation: false
      },
      {
        patterns: [
          /\b(go back|previous step|back up|undo)\b/i,
          /\b(last step|step before|previous please)\b/i,
          /\b(I want to redo|do again|restart this)\b/i
        ],
        action: 'previous_step',
        priority: 'navigation',
        requiresConfirmation: true
      },
      {
        patterns: [
          /\b(repeat|say again|one more time)\b/i,
          /\b(didn't hear|missed that|what did you say)\b/i,
          /\b(tell me again|repeat please)\b/i
        ],
        action: 'repeat',
        priority: 'navigation',
        requiresConfirmation: false
      },

      // Cooking-specific queries
      {
        patterns: [
          /\b(how long|how much time|when will it be ready)\b/i,
          /\b(is it done|how do I know|what should it look like)\b/i,
          /\b(cooking time|timing|ready when)\b/i
        ],
        action: 'timing_question',
        priority: 'query',
        requiresConfirmation: false
      },
      {
        patterns: [
          /\b(what temperature|how hot|heat level)\b/i,
          /\b(stove setting|burner|flame)\b/i,
          /\b(medium heat|high heat|low heat)\b/i
        ],
        action: 'temperature_question',
        priority: 'query',
        requiresConfirmation: false
      },
      {
        patterns: [
          /\b(substitute|replace|don't have|alternative)\b/i,
          /\b(out of|missing|without)\b/i,
          /\b(can I use|instead of|swap)\b/i
        ],
        action: 'substitution_question',
        priority: 'query',
        requiresConfirmation: false
      },

      // Social/encouragement
      {
        patterns: [
          /\b(looks good|smells great|going well)\b/i,
          /\b(proud of|doing great|success)\b/i,
          /\b(delicious|amazing|perfect)\b/i
        ],
        action: 'positive_feedback',
        priority: 'social',
        requiresConfirmation: false
      },
      {
        patterns: [
          /\b(story|tell me about|culture|tradition)\b/i,
          /\b(family recipe|grandmother|history)\b/i,
          /\b(where does this come from|origin)\b/i
        ],
        action: 'cultural_story',
        priority: 'social',
        requiresConfirmation: false
      }
    ];

    console.log('[SmartVoiceCommandService] Commands initialized:', this.commands.length);
  }

  public updateContext(newContext: Partial<CommandContext>): void {
    this.context = { ...this.context, ...newContext };
    console.log('[SmartVoiceCommandService] Context updated:', this.context);
  }

  public processVoiceInput(input: string): {
    command: string | null;
    confidence: number;
    needsConfirmation: boolean;
    culturalContext?: string;
    suggestions?: string[];
  } {
    const lowerInput = input.toLowerCase().trim();
    console.log(`[SmartVoiceCommandService] Processing: "${lowerInput}"`);

    // Add to recent commands for pattern learning
    this.context.recentCommands = [lowerInput, ...this.context.recentCommands.slice(0, 4)];

    let bestMatch: VoiceCommand | null = null;
    let bestConfidence = 0;

    // Find best matching command
    for (const command of this.commands) {
      const confidence = this.calculateCommandConfidence(command, lowerInput);
      
      if (confidence > bestConfidence && confidence > 0.6) {
        bestMatch = command;
        bestConfidence = confidence;
      }
    }

    if (bestMatch) {
      const result = {
        command: bestMatch.action,
        confidence: bestConfidence,
        needsConfirmation: bestMatch.requiresConfirmation,
        culturalContext: this.getCulturalContext(bestMatch, lowerInput),
        suggestions: this.getContextualSuggestions(bestMatch.action)
      };

      console.log('[SmartVoiceCommandService] Command recognized:', result);
      return result;
    }

    // No command found, return suggestions
    return {
      command: null,
      confidence: 0,
      needsConfirmation: false,
      suggestions: this.getContextualSuggestions()
    };
  }

  private calculateCommandConfidence(command: VoiceCommand, input: string): number {
    let maxConfidence = 0;

    // Check main patterns
    for (const pattern of command.patterns) {
      if (pattern.test(input)) {
        maxConfidence = Math.max(maxConfidence, 0.8);
      }
    }

    // Check cultural variants
    if (command.culturalVariants && command.culturalVariants[this.context.mamaId]) {
      const variants = command.culturalVariants[this.context.mamaId];
      for (const variant of variants) {
        if (input.includes(variant.toLowerCase())) {
          maxConfidence = Math.max(maxConfidence, 0.9); // Higher confidence for cultural variants
        }
      }
    }

    // Adjust confidence based on context
    maxConfidence = this.adjustConfidenceByContext(command, maxConfidence);

    return maxConfidence;
  }

  private adjustConfidenceByContext(command: VoiceCommand, baseConfidence: number): number {
    let adjustedConfidence = baseConfidence;

    // Boost emergency commands if user is struggling
    if (command.priority === 'emergency' && this.context.strugglingSteps.length > 2) {
      adjustedConfidence *= 1.2;
    }

    // Boost navigation commands during cooking phase
    if (command.priority === 'navigation' && this.context.cookingPhase === 'cooking') {
      adjustedConfidence *= 1.1;
    }

    // Reduce confidence for repeated commands
    if (command.action === 'repeat' && this.context.recentCommands.some(cmd => cmd.includes('repeat'))) {
      adjustedConfidence *= 0.8;
    }

    return Math.min(adjustedConfidence, 1.0);
  }

  private getCulturalContext(command: VoiceCommand, input: string): string | undefined {
    if (command.culturalVariants && command.culturalVariants[this.context.mamaId]) {
      const variants = command.culturalVariants[this.context.mamaId];
      for (const variant of variants) {
        if (input.includes(variant.toLowerCase())) {
          return variant;
        }
      }
    }
    return undefined;
  }

  private getContextualSuggestions(currentAction?: string): string[] {
    const suggestions: string[] = [];
    const { currentStep, totalSteps, cookingPhase } = this.context;

    if (cookingPhase === 'cooking') {
      if (currentAction !== 'next_step' && currentStep < totalSteps) {
        suggestions.push('Say "next step" to continue');
      }
      
      if (currentAction !== 'repeat') {
        suggestions.push('Say "repeat" to hear again');
      }
      
      if (currentAction !== 'timing_question') {
        suggestions.push('Ask "how long?" for timing');
      }
      
      if (currentAction !== 'emergency_help') {
        suggestions.push('Say "help" if you need assistance');
      }
    } else if (cookingPhase === 'pre-cooking') {
      suggestions.push('Ask about ingredients');
      suggestions.push('Ask for cooking tips');
      suggestions.push('Ask about the recipe story');
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  public getEmergencyCommands(): string[] {
    return [
      'Help me!',
      'Something went wrong!',
      'Emergency!',
      'I need help now!',
      'Stop everything!'
    ];
  }

  public getNavigationCommands(): string[] {
    const { currentStep, totalSteps } = this.context;
    const commands = ['Repeat that', 'Help me'];
    
    if (currentStep > 1) {
      commands.push('Go back');
    }
    
    if (currentStep < totalSteps) {
      commands.push('Next step');
    }
    
    return commands;
  }

  public getCulturalCommands(): string[] {
    const culturalCommands: Record<string, string[]> = {
      nonna_lucia: ['Aiuto!', 'Perfetto!', 'Bravissimo!', 'Dimmi tutto!'],
      abuela_rosa: ['¡Ayuda!', '¡Órale!', '¡Qué bueno!', '¡Dime todo!'],
      yai_malee: ['Help me ka!', 'Sabai!', 'Mai pen rai!', 'Tell me more!']
    };

    return culturalCommands[this.context.mamaId] || [];
  }

  public clearCommandHistory(): void {
    this.context.recentCommands = [];
    console.log('[SmartVoiceCommandService] Command history cleared');
  }
}
