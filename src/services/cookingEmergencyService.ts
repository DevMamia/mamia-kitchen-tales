
import { Recipe } from '@/data/recipes';
import { Mama } from '@/data/mamas';

interface EmergencyDetection {
  type: 'burnt' | 'oversalt' | 'undersalt' | 'overcooked' | 'undercooked' | 'texture_wrong' | 'flavor_off' | 'timing_disaster';
  confidence: number;
  keywords: string[];
}

interface EmergencySolution {
  immediate: string[];
  explanation: string;
  prevention: string;
  culturalWisdom?: string;
}

export class CookingEmergencyService {
  private static instance: CookingEmergencyService;

  static getInstance(): CookingEmergencyService {
    if (!CookingEmergencyService.instance) {
      CookingEmergencyService.instance = new CookingEmergencyService();
    }
    return CookingEmergencyService.instance;
  }

  private emergencyPatterns: Record<string, EmergencyDetection> = {
    burnt: {
      type: 'burnt',
      confidence: 0.9,
      keywords: ['burnt', 'burned', 'black', 'smoke', 'char', 'crispy bottom', 'stuck']
    },
    oversalt: {
      type: 'oversalt',
      confidence: 0.85,
      keywords: ['too salty', 'salty', 'salt', 'oversalted', 'sodium']
    },
    undersalt: {
      type: 'undersalt',
      confidence: 0.8,
      keywords: ['bland', 'no flavor', 'tasteless', 'needs salt', 'flat']
    },
    overcooked: {
      type: 'overcooked',
      confidence: 0.85,
      keywords: ['overcooked', 'tough', 'dry', 'rubbery', 'mushy', 'falling apart']
    },
    undercooked: {
      type: 'undercooked',
      confidence: 0.85,
      keywords: ['raw', 'undercooked', 'hard', 'crunchy', 'not done', 'pink inside']
    },
    texture_wrong: {
      type: 'texture_wrong',
      confidence: 0.75,
      keywords: ['texture', 'consistency', 'lumpy', 'grainy', 'separated', 'curdled']
    },
    flavor_off: {
      type: 'flavor_off',
      confidence: 0.7,
      keywords: ['weird taste', 'off flavor', 'bitter', 'sour', 'metallic', 'wrong taste']
    },
    timing_disaster: {
      type: 'timing_disaster',
      confidence: 0.8,
      keywords: ['behind', 'running late', 'timing', 'not ready', 'taking too long']
    }
  };

  public detectEmergency(userInput: string, recipe?: Recipe): EmergencyDetection | null {
    const input = userInput.toLowerCase();
    let bestMatch: EmergencyDetection | null = null;
    let highestScore = 0;

    for (const [key, pattern] of Object.entries(this.emergencyPatterns)) {
      let score = 0;
      let keywordMatches = 0;

      for (const keyword of pattern.keywords) {
        if (input.includes(keyword)) {
          keywordMatches++;
          score += pattern.confidence;
        }
      }

      // Boost score for urgent words
      const urgentWords = ['disaster', 'ruined', 'help', 'emergency', 'wrong', 'failed'];
      if (urgentWords.some(word => input.includes(word))) {
        score *= 1.5;
      }

      if (score > highestScore && keywordMatches > 0) {
        highestScore = score;
        bestMatch = pattern;
      }
    }

    return bestMatch && highestScore > 0.7 ? bestMatch : null;
  }

  public getEmergencySolution(
    emergencyType: EmergencyDetection,
    mama: Mama,
    recipe?: Recipe,
    currentStep?: number
  ): EmergencySolution {
    const solutions: Record<string, EmergencySolution> = {
      burnt: {
        immediate: [
          'Turn off heat immediately',
          'Remove from hot surface',
          'Transfer unburnt portion to new pan',
          'Scrape off burnt parts carefully'
        ],
        explanation: 'Burnt food happens when heat is too high or food is left too long. The key is salvaging what you can.',
        prevention: 'Keep heat at medium or lower, stir frequently, and stay close to the stove.',
        culturalWisdom: this.getCulturalWisdom(mama.accent, 'burnt')
      },
      oversalt: {
        immediate: [
          'Add unsalted liquid (water, broth, or cream)',
          'Add starchy ingredient (potato, rice, or bread)',
          'Add acid (lemon juice or vinegar) to balance',
          'Dilute by making more of the base recipe'
        ],
        explanation: 'Salt dissolves into liquids and gets absorbed by starches. Acid can help balance the taste.',
        prevention: 'Always taste as you go and add salt gradually - you can add more, but you can\'t take it away.',
        culturalWisdom: this.getCulturalWisdom(mama.accent, 'oversalt')
      },
      undersalt: {
        immediate: [
          'Add salt gradually, tasting after each addition',
          'Try finishing salt like sea salt or kosher salt',
          'Add umami ingredients (soy sauce, parmesan, or fish sauce)',
          'Use acidic ingredients to brighten flavors'
        ],
        explanation: 'Under-seasoned food lacks depth. Salt enhances all other flavors in the dish.',
        prevention: 'Season in layers throughout cooking, not just at the end.',
        culturalWisdom: this.getCulturalWisdom(mama.accent, 'undersalt')
      },
      overcooked: {
        immediate: [
          'Stop cooking immediately',
          'Add moisture if possible (broth, cream, or butter)',
          'For proteins: slice thin and use in soups or sandwiches',
          'For vegetables: puree into soup or sauce'
        ],
        explanation: 'Overcooked food has lost moisture and become tough. Adding liquid and changing preparation can help.',
        prevention: 'Use timers, check doneness frequently, and remember cooking continues even after removing from heat.',
        culturalWisdom: this.getCulturalWisdom(mama.accent, 'overcooked')
      },
      undercooked: {
        immediate: [
          'Continue cooking with lower heat',
          'Cover to trap steam and heat',
          'Add small amount of liquid if needed',
          'Test doneness frequently'
        ],
        explanation: 'Undercooked food needs more time and gentle heat. Rushing will cause uneven cooking.',
        prevention: 'Use appropriate heat levels and don\'t rush. Better to cook slowly and evenly.',
        culturalWisdom: this.getCulturalWisdom(mama.accent, 'undercooked')
      },
      texture_wrong: {
        immediate: [
          'Stop stirring if it\'s breaking apart',
          'Use immersion blender if it\'s lumpy',
          'Strain through fine mesh if needed',
          'Add binding agent (egg, cornstarch, or flour)'
        ],
        explanation: 'Texture problems usually come from temperature changes or over-mixing.',
        prevention: 'Control temperature carefully and mix gently. Some textures develop with time.',
        culturalWisdom: this.getCulturalWisdom(mama.accent, 'texture')
      },
      flavor_off: {
        immediate: [
          'Add acid (lemon, vinegar) to brighten',
          'Add sweetness to balance bitterness',
          'Add fresh herbs to refresh',
          'Taste and identify what\'s missing'
        ],
        explanation: 'Off flavors can often be balanced with complementary tastes.',
        prevention: 'Taste frequently during cooking and adjust seasonings gradually.',
        culturalWisdom: this.getCulturalWisdom(mama.accent, 'flavor')
      },
      timing_disaster: {
        immediate: [
          'Focus on what can be finished quickly',
          'Use higher heat carefully to speed up',
          'Prepare simple sides while main cooks',
          'Accept that some things take time'
        ],
        explanation: 'Timing disasters happen. The key is adapting and making the best of the situation.',
        prevention: 'Read the entire recipe first, prep ingredients before starting, and work backwards from serving time.',
        culturalWisdom: this.getCulturalWisdom(mama.accent, 'timing')
      }
    };

    return solutions[emergencyType.type] || {
      immediate: ['Stay calm', 'Assess the situation', 'Taste and adjust'],
      explanation: 'Cooking challenges happen to everyone. The key is learning from them.',
      prevention: 'Practice makes perfect, and even disasters can become learning experiences.',
      culturalWisdom: 'Every cook has burned something - it\'s how we learn!'
    };
  }

  private getCulturalWisdom(accent: string, emergencyType: string): string {
    const wisdom = {
      italian: {
        burnt: 'My nonna used to say, "Anche i grandi chef bruciano la pasta!" - Even great chefs burn pasta! Don\'t worry, tesoro.',
        oversalt: 'In Italia, we say "Il sale è come l\'amore - troppo rovina tutto!" Salt is like love - too much ruins everything!',
        undersalt: 'Ricorda, caro - "Senza sale, anche il pane è triste." Without salt, even bread is sad.',
        overcooked: 'Madonna mia! But you know what? My zio used to overcook everything and we still loved his cooking!',
        undercooked: 'Pazienza, tesoro! Good cooking cannot be rushed. "Chi va piano, va sano e va lontano."',
        texture: 'Sometimes food has a mind of its own! We adapt, we fix, we make it work - this is the Italian way!',
        flavor: 'Taste, adjust, taste again - cooking is a conversation between you and the ingredients!',
        timing: 'Bene, bene! In Italy, we have a saying: "Il tempo giusto arriva sempre" - the right time always comes.'
      },
      mexican: {
        burnt: '¡Ay, no te preocupes, mijo! Even your abuela burned beans sometimes. It happens to the best of us!',
        oversalt: 'Como decimos, "La sal es buena sirvienta pero mala ama" - salt is a good servant but a bad master!',
        undersalt: 'Remember, mi amor, food without salt is like life without passion - it needs that spark!',
        overcooked: '¡No te desanimes! Sometimes the best tacos come from overcooked meat that\'s been shredded and re-seasoned!',
        undercooked: 'Paciencia, corazón. Good Mexican cooking is like a good relationship - it takes time to develop properly!',
        texture: 'Every dish has its own personality, mija. Sometimes we have to work with what we get!',
        flavor: 'Trust your taste buds, mi amor. They know what your heart wants to eat!',
        timing: 'In México, we say "La comida buena no tiene prisa" - good food is never in a hurry!'
      },
      thai: {
        burnt: 'Sabai sabai, dear. Even in Thailand, we sometimes get distracted by good conversation and burn rice!',
        oversalt: 'Balance, my child. Too much of anything disturbs the harmony. We find the middle way.',
        undersalt: 'Like life without joy, food without salt lacks the spark that makes everything come alive.',
        overcooked: 'In Thai cooking, we believe everything has purpose. Overcooked vegetables can become beautiful soup!',
        undercooked: 'Patience is the secret ingredient, little one. Good Thai curry cannot be rushed.',
        texture: 'Sometimes the texture we get is not what we planned, but it might be what we needed.',
        flavor: 'Trust your senses, dear. Your nose and tongue are the best teachers in the kitchen.',
        timing: 'Time flows like the river, child. We cannot control it, only move with it gracefully.'
      }
    };

    const accentWisdom = wisdom[accent.toLowerCase() as keyof typeof wisdom];
    return accentWisdom?.[emergencyType as keyof typeof accentWisdom] || 
           'Every challenge in the kitchen is a chance to learn something new!';
  }

  public generateEmergencyResponse(
    userInput: string,
    mama: Mama,
    recipe?: Recipe,
    currentStep?: number
  ): string | null {
    const emergency = this.detectEmergency(userInput, recipe);
    
    if (!emergency) return null;

    const solution = this.getEmergencySolution(emergency, mama, recipe, currentStep);
    
    // Create culturally appropriate emergency response
    let response = this.getCulturalEmergencyOpener(mama.accent);
    
    // Add immediate solutions
    response += ' Here\'s what to do right now: ';
    response += solution.immediate.slice(0, 2).join(', ') + '. ';
    
    // Add explanation
    response += solution.explanation + ' ';
    
    // Add cultural wisdom
    if (solution.culturalWisdom) {
      response += solution.culturalWisdom;
    }

    return response;
  }

  private getCulturalEmergencyOpener(accent: string): string {
    switch (accent.toLowerCase()) {
      case 'italian':
        return 'Madonna mia! Don\'t panic, tesoro - Nonna has seen this before!';
      case 'mexican':
        return '¡Órale! No te preocupes, mijo - Abuela will help you fix this!';
      case 'thai':
        return 'Mai pen rai! Don\'t worry, dear child - this can be fixed with mindfulness and patience.';
      default:
        return 'Don\'t worry! This can be fixed!';
    }
  }

  public getPreventiveTips(recipe: Recipe, currentStep: number): string[] {
    const tips: string[] = [];
    const instruction = recipe.instructions[currentStep - 1]?.toLowerCase() || '';

    // Add preventive tips based on current instruction
    if (instruction.includes('heat') || instruction.includes('cook')) {
      tips.push('Watch the heat level - when in doubt, go lower and slower');
    }

    if (instruction.includes('season') || instruction.includes('salt')) {
      tips.push('Season gradually and taste as you go');
    }

    if (instruction.includes('stir') || instruction.includes('mix')) {
      tips.push('Stir gently to avoid breaking ingredients');
    }

    if (instruction.includes('time') || instruction.includes('minute')) {
      tips.push('Set a timer and check a minute before it goes off');
    }

    return tips.length > 0 ? tips : ['Take your time and trust the process'];
  }
}
