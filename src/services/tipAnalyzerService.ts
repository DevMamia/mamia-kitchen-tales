
// Tip Analyzer Service for Smart Recipe Tip Contextual Alignment
export interface TipAnalysis {
  originalStep: number;
  suggestedStep: number;
  confidence: number;
  reason: string;
  keywords: string[];
}

export interface TipPlacement {
  stepNumber: number;
  tip: string;
  timing: 'before' | 'during' | 'after';
  category: 'technique' | 'timing' | 'ingredient' | 'safety';
}

export class TipAnalyzerService {
  // Keywords that indicate specific cooking stages
  private static readonly STEP_KEYWORDS = {
    preparation: ['pat', 'dry', 'clean', 'trim', 'wash', 'rinse', 'prepare', 'ready'],
    seasoning: ['season', 'salt', 'pepper', 'spice', 'rub', 'marinade', 'flavor'],
    cooking: ['cook', 'heat', 'boil', 'fry', 'sauté', 'simmer', 'bake', 'roast'],
    timing: ['until', 'minutes', 'seconds', 'golden', 'tender', 'done', 'ready'],
    technique: ['stir', 'fold', 'whisk', 'mix', 'combine', 'blend', 'toss']
  };

  // Ingredients that need early preparation
  private static readonly EARLY_PREP_INGREDIENTS = [
    'chicken', 'meat', 'fish', 'seafood', 'beef', 'pork', 'lamb'
  ];

  /**
   * Analyzes recipe tips and suggests optimal step placement
   */
  public static analyzeTipPlacement(
    tip: string, 
    currentStep: number, 
    instructions: string[]
  ): TipAnalysis {
    const tipLower = tip.toLowerCase();
    const keywords = this.extractKeywords(tipLower);
    
    // Check for preparation-related tips
    if (this.containsKeywords(tipLower, this.STEP_KEYWORDS.preparation)) {
      const suggestedStep = this.findPreparationStep(instructions);
      return {
        originalStep: currentStep,
        suggestedStep,
        confidence: 0.9,
        reason: 'Preparation tips should come before cooking begins',
        keywords
      };
    }

    // Check for seasoning tips
    if (this.containsKeywords(tipLower, this.STEP_KEYWORDS.seasoning)) {
      const suggestedStep = this.findSeasoningStep(instructions);
      return {
        originalStep: currentStep,
        suggestedStep,
        confidence: 0.85,
        reason: 'Seasoning tips should align with seasoning instructions',
        keywords
      };
    }

    // Check for cooking technique tips
    if (this.containsKeywords(tipLower, this.STEP_KEYWORDS.technique)) {
      const suggestedStep = this.findTechniqueStep(tipLower, instructions);
      return {
        originalStep: currentStep,
        suggestedStep,
        confidence: 0.8,
        reason: 'Technique tips should match cooking method steps',
        keywords
      };
    }

    // Default - no change suggested
    return {
      originalStep: currentStep,
      suggestedStep: currentStep,
      confidence: 0.5,
      reason: 'No specific context indicators found',
      keywords
    };
  }

  /**
   * Creates optimized tip placements for a recipe
   */
  public static optimizeTipPlacements(
    stepVoiceTips: Record<number, string> | undefined,
    instructions: string[]
  ): Record<number, TipPlacement> {
    const optimizedTips: Record<number, TipPlacement> = {};
    
    if (!stepVoiceTips) return optimizedTips;

    Object.entries(stepVoiceTips).forEach(([stepStr, tip]) => {
      const originalStep = parseInt(stepStr);
      const analysis = this.analyzeTipPlacement(tip, originalStep, instructions);
      
      // Only move tip if confidence is high enough
      const finalStep = analysis.confidence > 0.7 ? analysis.suggestedStep : originalStep;
      
      optimizedTips[finalStep] = {
        stepNumber: finalStep,
        tip,
        timing: this.determineTiming(tip),
        category: this.categorize(tip)
      };
    });

    return optimizedTips;
  }

  private static extractKeywords(text: string): string[] {
    const allKeywords = Object.values(this.STEP_KEYWORDS).flat();
    return allKeywords.filter(keyword => text.includes(keyword));
  }

  private static containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private static findPreparationStep(instructions: string[]): number {
    // Look for the first step that mentions preparation activities
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i].toLowerCase();
      if (this.containsKeywords(instruction, this.STEP_KEYWORDS.preparation) ||
          this.EARLY_PREP_INGREDIENTS.some(ingredient => instruction.includes(ingredient))) {
        return i + 1; // Steps are 1-indexed
      }
    }
    return 1; // Default to first step
  }

  private static findSeasoningStep(instructions: string[]): number {
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i].toLowerCase();
      if (this.containsKeywords(instruction, this.STEP_KEYWORDS.seasoning)) {
        return i + 1;
      }
    }
    return 1; // Default to first step if no seasoning step found
  }

  private static findTechniqueStep(tip: string, instructions: string[]): number {
    const tipKeywords = this.extractKeywords(tip);
    
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i].toLowerCase();
      const matchingKeywords = tipKeywords.filter(keyword => instruction.includes(keyword));
      
      if (matchingKeywords.length > 0) {
        return i + 1;
      }
    }
    
    return 1; // Default fallback
  }

  private static determineTiming(tip: string): 'before' | 'during' | 'after' {
    const tipLower = tip.toLowerCase();
    
    if (tipLower.includes('before') || tipLower.includes('first') || 
        this.containsKeywords(tipLower, this.STEP_KEYWORDS.preparation)) {
      return 'before';
    }
    
    if (tipLower.includes('while') || tipLower.includes('during') ||
        this.containsKeywords(tipLower, this.STEP_KEYWORDS.technique)) {
      return 'during';
    }
    
    return 'before'; // Default to before step starts
  }

  private static categorize(tip: string): 'technique' | 'timing' | 'ingredient' | 'safety' {
    const tipLower = tip.toLowerCase();
    
    if (this.containsKeywords(tipLower, this.STEP_KEYWORDS.technique)) {
      return 'technique';
    }
    
    if (this.containsKeywords(tipLower, this.STEP_KEYWORDS.timing)) {
      return 'timing';
    }
    
    if (this.EARLY_PREP_INGREDIENTS.some(ingredient => tipLower.includes(ingredient))) {
      return 'ingredient';
    }
    
    return 'technique'; // Default fallback
  }

  /**
   * Validates tip placement and provides suggestions
   */
  public static validateTipPlacement(
    stepNumber: number,
    tip: string,
    instruction: string
  ): { isValid: boolean; suggestion?: string } {
    const tipLower = tip.toLowerCase();
    const instructionLower = instruction.toLowerCase();
    
    // Check if tip mentions ingredients not in the instruction
    const tipIngredients = this.EARLY_PREP_INGREDIENTS.filter(ing => tipLower.includes(ing));
    const instructionIngredients = this.EARLY_PREP_INGREDIENTS.filter(ing => instructionLower.includes(ing));
    
    const missingIngredients = tipIngredients.filter(ing => !instructionIngredients.includes(ing));
    
    if (missingIngredients.length > 0) {
      return {
        isValid: false,
        suggestion: `This tip mentions ${missingIngredients.join(', ')} but the instruction doesn't. Consider moving to an earlier step.`
      };
    }
    
    return { isValid: true };
  }
}
