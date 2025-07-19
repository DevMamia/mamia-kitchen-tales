
interface IngredientSubstitution {
  originalIngredient: string;
  alternatives: SubstitutionOption[];
  culturalContext: string;
  mamaAdvice: string;
}

interface SubstitutionOption {
  substitute: string;
  ratio: string; // e.g., "1:1", "2:1"
  flavorImpact: 'minimal' | 'noticeable' | 'significant';
  culturalAuthenticity: number; // 1-10
  availability: 'common' | 'specialty' | 'rare';
  notes: string;
}

interface SubstitutionRequest {
  ingredient: string;
  recipeId: string;
  mamaId: string;
  recipeCuisine: string;
  recipeType: string;
}

export class SmartSubstitutionService {
  private static instance: SmartSubstitutionService;
  private substitutionDatabase: Record<string, IngredientSubstitution[]>;

  constructor() {
    this.initializeDatabase();
  }

  static getInstance(): SmartSubstitutionService {
    if (!SmartSubstitutionService.instance) {
      SmartSubstitutionService.instance = new SmartSubstitutionService();
    }
    return SmartSubstitutionService.instance;
  }

  async getSubstitutions(request: SubstitutionRequest): Promise<IngredientSubstitution | null> {
    const normalizedIngredient = this.normalizeIngredientName(request.ingredient);
    console.log('[SmartSubstitution] Finding substitutions for:', normalizedIngredient);

    // Check exact matches first
    const exactMatch = this.findExactMatch(normalizedIngredient);
    if (exactMatch) {
      return this.customizeForMama(exactMatch, request.mamaId, request.recipeCuisine);
    }

    // Check partial matches
    const partialMatch = this.findPartialMatch(normalizedIngredient);
    if (partialMatch) {
      return this.customizeForMama(partialMatch, request.mamaId, request.recipeCuisine);
    }

    // Generate AI-powered substitution if no database match
    return this.generateAISubstitution(request);
  }

  private initializeDatabase() {
    this.substitutionDatabase = {
      // Italian substitutions
      'pecorino romano': [{
        originalIngredient: 'pecorino romano',
        alternatives: [
          {
            substitute: 'parmigiano reggiano',
            ratio: '1:1',
            flavorImpact: 'minimal',
            culturalAuthenticity: 9,
            availability: 'common',
            notes: 'Slightly milder but still very authentic'
          },
          {
            substitute: 'aged manchego',
            ratio: '1:1',
            flavorImpact: 'noticeable',
            culturalAuthenticity: 6,
            availability: 'specialty',
            notes: 'Different region but similar sheep milk profile'
          }
        ],
        culturalContext: 'Traditional Roman cheese, essential for authentic Carbonara',
        mamaAdvice: 'If you cannot find Pecorino, use good Parmigiano - it\'s still Italian famiglia!'
      }],
      
      'guajillo chilies': [{
        originalIngredient: 'guajillo chilies',
        alternatives: [
          {
            substitute: 'ancho chilies',
            ratio: '1:1',
            flavorImpact: 'minimal',
            culturalAuthenticity: 8,
            availability: 'specialty',
            notes: 'Slightly sweeter but similar heat level'
          },
          {
            substitute: 'chipotle + paprika',
            ratio: '0.5:1 + 0.5:1',
            flavorImpact: 'noticeable',
            culturalAuthenticity: 7,
            availability: 'common',
            notes: 'Mix for complexity'
          }
        ],
        culturalContext: 'Sacred chili in Mexican cuisine, brings deep red color and mild heat',
        mamaAdvice: '¡Mijo! If no guajillo, mix ancho with a little chipotle - trust Abuela!'
      }],

      'thai basil': [{
        originalIngredient: 'thai basil',
        alternatives: [
          {
            substitute: 'regular basil + mint',
            ratio: '0.7:1 + 0.3:1',
            flavorImpact: 'noticeable',
            culturalAuthenticity: 6,
            availability: 'common',
            notes: 'Mix to approximate anise flavor'
          },
          {
            substitute: 'holy basil',
            ratio: '1:1',
            flavorImpact: 'minimal',
            culturalAuthenticity: 9,
            availability: 'rare',
            notes: 'More peppery but very authentic'
          }
        ],
        culturalContext: 'Essential herb in Thai cooking, provides unique anise-like flavor',
        mamaAdvice: 'Dear child, regular basil with little mint can work, but find Thai basil for true taste!'
      }],

      // Common ingredients across cuisines
      'heavy cream': [{
        originalIngredient: 'heavy cream',
        alternatives: [
          {
            substitute: 'coconut cream',
            ratio: '1:1',
            flavorImpact: 'significant',
            culturalAuthenticity: 5,
            availability: 'common',
            notes: 'Adds coconut flavor, good for dairy-free'
          },
          {
            substitute: 'whole milk + butter',
            ratio: '0.75:1 + 0.25:1',
            flavorImpact: 'minimal',
            culturalAuthenticity: 8,
            availability: 'common',
            notes: 'Mix well while heating'
          }
        ],
        culturalContext: 'Creates richness and body in sauces',
        mamaAdvice: 'For creamy texture without cream, mix milk with butter - old trick!'
      }]
    };
  }

  private normalizeIngredientName(ingredient: string): string {
    return ingredient.toLowerCase()
      .replace(/\b(fresh|dried|organic|chopped|diced|sliced)\b/g, '')
      .replace(/[^\w\s]/g, '')
      .trim();
  }

  private findExactMatch(ingredient: string): IngredientSubstitution | null {
    return this.substitutionDatabase[ingredient]?.[0] || null;
  }

  private findPartialMatch(ingredient: string): IngredientSubstitution | null {
    for (const [key, substitutions] of Object.entries(this.substitutionDatabase)) {
      if (key.includes(ingredient) || ingredient.includes(key)) {
        return substitutions[0];
      }
    }
    return null;
  }

  private customizeForMama(substitution: IngredientSubstitution, mamaId: string, cuisine: string): IngredientSubstitution {
    const mamaAdvice = this.getMamaSpecificAdvice(substitution.originalIngredient, mamaId, cuisine);
    
    return {
      ...substitution,
      mamaAdvice: mamaAdvice || substitution.mamaAdvice
    };
  }

  private getMamaSpecificAdvice(ingredient: string, mamaId: string, cuisine: string): string {
    const adviceMap = {
      'nonna_lucia': {
        'pecorino romano': 'Tesoro, if no Pecorino, use Parmigiano - still Italian famiglia!',
        'heavy cream': 'For cremoso sauce without cream, mix latte with burro - Nonna\'s secret!',
        'default': 'Use what you have with amore, caro - cooking is about the heart!'
      },
      'abuela_rosa': {
        'guajillo chilies': '¡Mijo! Mix ancho with chipotle if no guajillo - Abuela knows best!',
        'heavy cream': 'For rich salsas, coconut cream works beautiful, mi amor!',
        'default': 'Cook with your corazón, mijo - the flavors will find their way!'
      },
      'yai_malee': {
        'thai basil': 'Dear child, regular basil with mint leaf can work in emergency.',
        'heavy cream': 'Coconut cream brings good harmony to Thai flavors, dear.',
        'default': 'Trust your instincts and taste as you go, dear one.'
      }
    };

    const mamaAdvice = adviceMap[mamaId] || adviceMap['nonna_lucia'];
    return mamaAdvice[ingredient] || mamaAdvice['default'];
  }

  private async generateAISubstitution(request: SubstitutionRequest): Promise<IngredientSubstitution | null> {
    try {
      // This would call an AI service to generate smart substitutions
      console.log('[SmartSubstitution] Generating AI substitution for:', request.ingredient);
      
      // Fallback substitution
      return {
        originalIngredient: request.ingredient,
        alternatives: [{
          substitute: 'Check local specialty store',
          ratio: '1:1',
          flavorImpact: 'minimal',
          culturalAuthenticity: 10,
          availability: 'specialty',
          notes: 'Best to find the authentic ingredient when possible'
        }],
        culturalContext: 'This ingredient is important for authentic flavor',
        mamaAdvice: 'Sometimes it\'s worth the extra trip to find the real thing, dear!'
      };
    } catch (error) {
      console.error('[SmartSubstitution] Error generating AI substitution:', error);
      return null;
    }
  }

  calculateFlavorImpactScore(substitution: SubstitutionOption): number {
    const impactScores = { minimal: 1, noticeable: 2, significant: 3 };
    return impactScores[substitution.flavorImpact];
  }

  getAvailabilityScore(substitution: SubstitutionOption): number {
    const availabilityScores = { common: 3, specialty: 2, rare: 1 };
    return availabilityScores[substitution.availability];
  }
}

export const smartSubstitutionService = SmartSubstitutionService.getInstance();
