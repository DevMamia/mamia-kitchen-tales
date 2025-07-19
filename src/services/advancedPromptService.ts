
import { Recipe } from '@/data/recipes';
import { Mama } from '@/data/mamas';

interface CookingContext {
  phase: 'pre-cooking' | 'cooking' | 'post-cooking';
  currentStep: number;
  totalSteps: number;
  timeElapsed: number;
  strugglingSteps: number[];
  completedSteps: number[];
  userQuestions: string[];
  emergencyCount: number;
}

interface UserProfile {
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  cookingHistory: string[];
  preferredComplexity: 'simple' | 'moderate' | 'complex';
  culturalFamiliarity: number; // 0-100
  relationshipDepth: number; // 0-100
  lastSessionDate?: Date;
  achievements: string[];
}

export class AdvancedPromptService {
  private static instance: AdvancedPromptService;

  static getInstance(): AdvancedPromptService {
    if (!AdvancedPromptService.instance) {
      AdvancedPromptService.instance = new AdvancedPromptService();
    }
    return AdvancedPromptService.instance;
  }

  public generateDynamicPrompt(
    mama: Mama,
    recipe: Recipe,
    cookingContext: CookingContext,
    userProfile: UserProfile,
    userInput: string
  ): string {
    const basePersonality = this.buildBasePersonality(mama, userProfile);
    const cookingGuidance = this.buildCookingGuidance(recipe, cookingContext, userProfile);
    const culturalContext = this.buildCulturalContext(mama, userProfile);
    const adaptiveResponse = this.buildAdaptiveResponse(cookingContext, userProfile, userInput);

    return `${basePersonality}

COOKING CONTEXT:
${cookingGuidance}

CULTURAL CONTEXT:
${culturalContext}

ADAPTIVE RESPONSE GUIDANCE:
${adaptiveResponse}

USER INPUT: "${userInput}"

Respond as ${mama.name} with authentic ${mama.accent} personality, providing helpful cooking guidance while maintaining cultural authenticity and warmth.`;
  }

  private buildBasePersonality(mama: Mama, userProfile: UserProfile): string {
    const relationshipLevel = this.getRelationshipLevel(userProfile.relationshipDepth);
    
    let personality = `You are ${mama.name}, a ${mama.accent} cooking teacher`;
    
    switch (mama.accent) {
      case 'Italian':
        personality += ` who speaks with warmth and passion. Use Italian expressions like "caro/cara", "tesoro", "bene!", "madonna mia!" naturally. You're nurturing but passionate about proper technique.`;
        break;
      case 'Mexican':
        personality += ` who brings joy and vibrance to cooking. Use Spanish expressions like "mijo/mija", "órale!", "¡qué rico!", "mi amor" naturally. You're enthusiastic and love sharing family traditions.`;
        break;
      case 'Thai':
        personality += ` who emphasizes balance and mindfulness. Use gentle expressions and talk about harmony in cooking and life. You're wise and patient, teaching with calm guidance.`;
        break;
    }

    // Adapt personality based on relationship depth
    if (relationshipLevel === 'intimate') {
      personality += ` You know this cook well and can reference their past cooking experiences and preferences. You're like family now.`;
    } else if (relationshipLevel === 'familiar') {
      personality += ` You're getting to know this cook and can remember some of their previous questions and progress.`;
    } else {
      personality += ` You're just getting to know this cook, so be extra welcoming and patient.`;
    }

    return personality;
  }

  private buildCookingGuidance(recipe: Recipe, context: CookingContext, userProfile: UserProfile): string {
    let guidance = `Recipe: ${recipe.title} (${recipe.difficulty} level, step ${context.currentStep}/${context.totalSteps})`;
    
    if (context.strugglingSteps.length > 0) {
      guidance += `\nUser has struggled with steps: ${context.strugglingSteps.join(', ')}. Provide extra encouragement and detailed guidance.`;
    }

    if (context.emergencyCount > 2) {
      guidance += `\nUser seems stressed (${context.emergencyCount} emergency questions). Be extra calm and reassuring.`;
    }

    // Adapt to user skill level
    switch (userProfile.skillLevel) {
      case 'beginner':
        guidance += `\nUser is a beginner - explain techniques clearly, provide encouragement, and don't assume knowledge.`;
        break;
      case 'intermediate':
        guidance += `\nUser has some experience - provide tips and alternatives, explain the "why" behind techniques.`;
        break;
      case 'advanced':
        guidance += `\nUser is experienced - share advanced tips, cultural variations, and professional insights.`;
        break;
    }

    return guidance;
  }

  private buildCulturalContext(mama: Mama, userProfile: UserProfile): string {
    const culturalDepth = userProfile.culturalFamiliarity;
    let context = `Share ${mama.accent} cooking culture authentically.`;

    if (culturalDepth < 30) {
      context += ` Introduce cultural concepts gently, explain traditions simply, and focus on welcoming them to your culture.`;
    } else if (culturalDepth < 70) {
      context += ` Share deeper cultural stories, family memories, and regional variations. They're ready for more authentic cultural expressions.`;
    } else {
      context += ` Share intimate family stories, regional secrets, and treat them like family. Use more cultural expressions naturally.`;
    }

    // Add seasonal or contextual cultural elements
    const currentMonth = new Date().getMonth();
    if (mama.accent === 'Italian' && (currentMonth === 11 || currentMonth === 0)) {
      context += ` Reference Christmas traditions and family celebrations.`;
    } else if (mama.accent === 'Mexican' && currentMonth === 10) {
      context += ` Reference Día de los Muertos and family remembrance through food.`;
    }

    return context;
  }

  private buildAdaptiveResponse(context: CookingContext, userProfile: UserProfile, userInput: string): string {
    let guidance = '';

    // Detect user emotional state from input
    const userEmotion = this.detectEmotionalState(userInput);
    
    switch (userEmotion) {
      case 'frustrated':
        guidance += `User seems frustrated. Be extra patient, break down instructions into smaller steps, and provide lots of encouragement.`;
        break;
      case 'excited':
        guidance += `User seems excited! Match their energy while keeping them focused on the cooking steps.`;
        break;
      case 'confused':
        guidance += `User seems confused. Ask clarifying questions, explain step-by-step, and check for understanding.`;
        break;
      case 'confident':
        guidance += `User seems confident. Provide tips for enhancement and share advanced techniques.`;
        break;
    }

    // Context-specific guidance
    if (context.phase === 'pre-cooking') {
      guidance += ` Focus on building excitement, explaining ingredients, and sharing cultural stories about the dish.`;
    } else if (context.phase === 'cooking') {
      guidance += ` Provide practical, step-by-step guidance with encouragement and technique tips.`;
    } else {
      guidance += ` Celebrate their success, provide feedback, and suggest next cooking adventures.`;
    }

    return guidance;
  }

  private detectEmotionalState(input: string): 'frustrated' | 'excited' | 'confused' | 'confident' | 'neutral' {
    const frustrated = /\b(stuck|wrong|disaster|ruined|terrible|awful|frustrated|angry)\b/i;
    const excited = /\b(amazing|wonderful|love|fantastic|incredible|excited|great)\b/i;
    const confused = /\b(confused|don't understand|what|how|why|help|lost)\b/i;
    const confident = /\b(got it|easy|ready|bring it|let's go|perfect)\b/i;

    if (frustrated.test(input)) return 'frustrated';
    if (excited.test(input)) return 'excited';
    if (confused.test(input)) return 'confused';
    if (confident.test(input)) return 'confident';
    return 'neutral';
  }

  private getRelationshipLevel(depth: number): 'new' | 'familiar' | 'intimate' {
    if (depth < 30) return 'new';
    if (depth < 70) return 'familiar';
    return 'intimate';
  }

  public analyzeRecipeComplexity(recipe: Recipe): {
    overallComplexity: number;
    techniqueComplexity: number;
    ingredientComplexity: number;
    timeComplexity: number;
    difficultyPoints: string[];
  } {
    let overallComplexity = 0;
    let techniqueComplexity = 0;
    let ingredientComplexity = 0;
    let timeComplexity = 0;
    const difficultyPoints: string[] = [];

    // Analyze techniques in instructions
    const complexTechniques = [
      'tempering', 'emulsify', 'fold', 'caramelize', 'reduce', 'sauté', 'braise', 'confit'
    ];
    
    recipe.instructions.forEach((instruction, index) => {
      const lowerInstruction = instruction.toLowerCase();
      complexTechniques.forEach(technique => {
        if (lowerInstruction.includes(technique)) {
          techniqueComplexity += 10;
          difficultyPoints.push(`Step ${index + 1}: ${technique} technique requires precision`);
        }
      });
    });

    // Analyze cooking time
    if (recipe.cookTimeMin > 60) {
      timeComplexity += 20;
      difficultyPoints.push('Long cooking time requires patience and monitoring');
    }

    // Analyze ingredients
    if (recipe.ingredients.length > 10) {
      ingredientComplexity += 15;
      difficultyPoints.push('Many ingredients require careful organization');
    }

    overallComplexity = (techniqueComplexity + ingredientComplexity + timeComplexity) / 3;

    return {
      overallComplexity: Math.min(overallComplexity, 100),
      techniqueComplexity: Math.min(techniqueComplexity, 100),
      ingredientComplexity: Math.min(ingredientComplexity, 100),
      timeComplexity: Math.min(timeComplexity, 100),
      difficultyPoints
    };
  }
}
