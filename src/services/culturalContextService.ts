
import { Mama } from '@/data/mamas';
import { Recipe } from '@/data/recipes';

interface CulturalStory {
  id: string;
  title: string;
  content: string;
  context: 'ingredient' | 'technique' | 'tradition' | 'family' | 'celebration';
  emotionalTone: 'warm' | 'nostalgic' | 'educational' | 'inspiring';
  triggers: string[]; // Words or situations that trigger this story
}

interface RegionalVariation {
  region: string;
  modification: string;
  culturalReason: string;
  ingredients?: string[];
}

interface CulturalWisdom {
  wisdom: string;
  context: string;
  application: string;
}

export class CulturalContextService {
  private static instance: CulturalContextService;
  private culturalStories: Record<string, CulturalStory[]> = {};
  private regionalVariations: Record<string, RegionalVariation[]> = {};
  private culturalWisdom: Record<string, CulturalWisdom[]> = {};

  static getInstance(): CulturalContextService {
    if (!CulturalContextService.instance) {
      CulturalContextService.instance = new CulturalContextService();
      CulturalContextService.instance.initializeCulturalContent();
    }
    return CulturalContextService.instance;
  }

  private initializeCulturalContent(): void {
    this.initializeItalianContent();
    this.initializeMexicanContent();
    this.initializeThaiContent();
  }

  private initializeItalianContent(): void {
    this.culturalStories.italian = [
      {
        id: 'nonna_pasta_lesson',
        title: 'Nonna\'s First Pasta Lesson',
        content: 'I remember when my nonna first taught me to make pasta. She said, "Lucia, the dough will tell you what it needs - too dry, add water; too wet, add flour. But most important, you cook with your heart, not just your hands." She never measured anything, just felt the dough like it was alive.',
        context: 'technique',
        emotionalTone: 'nostalgic',
        triggers: ['pasta', 'dough', 'kneading', 'texture']
      },
      {
        id: 'sunday_sauce_tradition',
        title: 'Sunday Sauce Tradition',
        content: 'Every Sunday in our famiglia, the whole house would smell like tomatoes and basil by 7 AM. Nonna would start the sauce before church, letting it simmer for hours. She used to say, "The sauce is like love - it cannot be rushed, it must develop slowly with patience and care."',
        context: 'tradition',
        emotionalTone: 'warm',
        triggers: ['tomato', 'sauce', 'basil', 'sunday', 'simmer']
      },
      {
        id: 'olive_oil_gold',
        title: 'Liquid Gold from Tuscany',
        content: 'My zio had olive trees in Tuscany, and every harvest he would bring us the first pressing. He called it "oro liquido" - liquid gold. Good olive oil, tesoro, it\'s not just cooking oil - it\'s the soul of Italian cooking. You can taste the sunshine and the earth in every drop.',
        context: 'ingredient',
        emotionalTone: 'educational',
        triggers: ['olive oil', 'tuscany', 'harvest', 'quality']
      }
    ];

    this.regionalVariations.italian = [
      {
        region: 'Northern Italy',
        modification: 'Uses more butter and cream, less tomatoes',
        culturalReason: 'Cooler climate, dairy farming tradition',
        ingredients: ['butter', 'parmigiano', 'cream', 'rice']
      },
      {
        region: 'Southern Italy',
        modification: 'More tomatoes, olive oil, and seafood',
        culturalReason: 'Mediterranean climate, coastal access',
        ingredients: ['tomatoes', 'olive oil', 'seafood', 'citrus']
      },
      {
        region: 'Sicily',
        modification: 'Arab influences with sweet and savory combinations',
        culturalReason: 'Historical Arab occupation and trade routes',
        ingredients: ['almonds', 'citrus', 'capers', 'anchovies']
      }
    ];

    this.culturalWisdom.italian = [
      {
        wisdom: 'La cucina è il cuore della casa',
        context: 'The kitchen is the heart of the home',
        application: 'Cooking brings family together and creates lasting memories'
      },
      {
        wisdom: 'Non si butta via niente',
        context: 'Nothing gets thrown away',
        application: 'Use leftovers creatively and respect ingredients'
      },
      {
        wisdom: 'Mangia bene, ridi spesso, ama molto',
        context: 'Eat well, laugh often, love much',
        application: 'Food is about joy, connection, and celebration of life'
      }
    ];
  }

  private initializeMexicanContent(): void {
    this.culturalStories.mexican = [
      {
        id: 'mole_secrets',
        title: 'The Secret of Mole',
        content: 'Mi bisabuela used to say that mole is like life - many different ingredients that seem like they shouldn\'t work together, but when combined with patience and love, they create something magical. She would grind spices on the metate for hours, each one added at just the right moment.',
        context: 'technique',
        emotionalTone: 'inspiring',
        triggers: ['mole', 'spices', 'grind', 'patience', 'metate']
      },
      {
        id: 'masa_morning',
        title: 'Morning Masa Ritual',
        content: 'Every morning before dawn, las mujeres of our pueblo would gather to prepare masa. We would soak the corn overnight, then grind it together while sharing stories and gossip. The sound of the metate was like music, and the smell of fresh masa meant home.',
        context: 'tradition',
        emotionalTone: 'nostalgic',
        triggers: ['masa', 'corn', 'morning', 'metate', 'tortillas']
      },
      {
        id: 'chile_wisdom',
        title: 'Understanding Chile',
        content: 'My abuela taught me that each chile has its own personality. "The poblano is gentle and sweet," she would say, "but the habanero - ¡ay, Dios mío! - that one has fire and passion. You must respect each chile and use it with wisdom, not just heat."',
        context: 'ingredient',
        emotionalTone: 'educational',
        triggers: ['chile', 'spicy', 'poblano', 'habanero', 'heat']
      }
    ];

    this.regionalVariations.mexican = [
      {
        region: 'Oaxaca',
        modification: 'Complex moles with 20+ ingredients, chapulines (grasshoppers)',
        culturalReason: 'Indigenous Zapotec traditions and biodiversity',
        ingredients: ['chocolate', 'chiles', 'sesame', 'pumpkin seeds']
      },
      {
        region: 'Yucatan',
        modification: 'Achiote, citrus, and Mayan influences',
        culturalReason: 'Mayan heritage and tropical climate',
        ingredients: ['achiote', 'sour orange', 'habanero', 'banana leaves']
      },
      {
        region: 'Northern Mexico',
        modification: 'More meat-focused, flour tortillas, cheese',
        culturalReason: 'Cattle ranching and wheat farming tradition',
        ingredients: ['beef', 'flour', 'cheese', 'beans']
      }
    ];

    this.culturalWisdom.mexican = [
      {
        wisdom: 'El sazón se lleva en las manos',
        context: 'The seasoning is carried in the hands',
        application: 'Cooking skill comes from practice and intuition, not just recipes'
      },
      {
        wisdom: 'Barriga llena, corazón contento',
        context: 'Full belly, happy heart',
        application: 'Food nourishes both body and soul'
      },
      {
        wisdom: 'En la mesa y en el juego se conoce al caballero',
        context: 'At the table and in games, you know the gentleman',
        application: 'How someone behaves around food reveals their character'
      }
    ];
  }

  private initializeThaiContent(): void {
    this.culturalStories.thai = [
      {
        id: 'curry_paste_meditation',
        title: 'The Meditation of Curry Paste',
        content: 'My yai taught me that making curry paste is like meditation. Each ingredient must be pounded in the right order, with the right rhythm. "Listen to the mortar and pestle," she would say. "They will tell you when each spice is ready to join the others. Cooking is mindfulness in action."',
        context: 'technique',
        emotionalTone: 'educational',
        triggers: ['curry paste', 'mortar', 'pestle', 'meditation', 'mindfulness']
      },
      {
        id: 'floating_market_memories',
        title: 'Floating Market Mornings',
        content: 'As a child, I would wake before sunrise to go with yai to the floating market. The boats would arrive loaded with herbs so fresh they still had dew on them. She taught me to choose ingredients not just with my eyes, but with my nose and heart. "Fresh ingredients have good energy," she would whisper.',
        context: 'ingredient',
        emotionalTone: 'nostalgic',
        triggers: ['market', 'fresh', 'herbs', 'energy', 'morning']
      },
      {
        id: 'balance_philosophy',
        title: 'The Philosophy of Balance',
        content: 'Yai always said, "Thai cooking is like life - you need sweet for happiness, sour for excitement, salty for grounding, and spicy for passion. But most important is balance. Too much of any one thing, and the harmony is lost." This wisdom applies to cooking and to living.',
        context: 'tradition',
        emotionalTone: 'inspiring',
        triggers: ['balance', 'harmony', 'sweet', 'sour', 'salty', 'spicy']
      }
    ];

    this.regionalVariations.thai = [
      {
        region: 'Northern Thailand',
        modification: 'Milder flavors, more herbs, sticky rice',
        culturalReason: 'Mountain climate and Lanna kingdom heritage',
        ingredients: ['sticky rice', 'dill', 'northern herbs', 'river fish']
      },
      {
        region: 'Northeastern Thailand (Isaan)',
        modification: 'Very spicy, fermented flavors, grilled meats',
        culturalReason: 'Dry climate and Lao cultural influence',
        ingredients: ['padaek', 'jeow', 'grilled meats', 'som tam']
      },
      {
        region: 'Southern Thailand',
        modification: 'Coconut-based, very spicy, lots of seafood',
        culturalReason: 'Tropical climate and coastal geography',
        ingredients: ['coconut', 'turmeric', 'seafood', 'pineapple']
      }
    ];

    this.culturalWisdom.thai = [
      {
        wisdom: 'Gin kao rue yang?',
        context: 'Have you eaten rice yet?',
        application: 'Traditional greeting showing care for others\' well-being'
      },
      {
        wisdom: 'Sabai sabai',
        context: 'Relax, take it easy',
        application: 'Cooking should be peaceful and mindful, not stressful'
      },
      {
        wisdom: 'Jai yen yen',
        context: 'Cool heart',
        application: 'Stay calm and balanced, especially when cooking gets challenging'
      }
    ];
  }

  public getCulturalStory(mamaAccent: string, triggers: string[], context?: string): CulturalStory | null {
    const accent = mamaAccent.toLowerCase();
    const stories = this.culturalStories[accent] || [];
    
    // Find stories that match triggers
    const matchingStories = stories.filter(story => 
      story.triggers.some(trigger => 
        triggers.some(userTrigger => 
          userTrigger.toLowerCase().includes(trigger.toLowerCase())
        )
      )
    );
    
    if (matchingStories.length === 0) return null;
    
    // Prefer stories that match the current context
    if (context) {
      const contextMatches = matchingStories.filter(story => story.context === context);
      if (contextMatches.length > 0) {
        return contextMatches[Math.floor(Math.random() * contextMatches.length)];
      }
    }
    
    return matchingStories[Math.floor(Math.random() * matchingStories.length)];
  }

  public getRegionalVariation(mamaAccent: string, recipe: Recipe): RegionalVariation | null {
    const accent = mamaAccent.toLowerCase();
    const variations = this.regionalVariations[accent] || [];
    
    if (variations.length === 0) return null;
    
    return variations[Math.floor(Math.random() * variations.length)];
  }

  public getCulturalWisdom(mamaAccent: string, cookingContext?: string): CulturalWisdom | null {
    const accent = mamaAccent.toLowerCase();
    const wisdom = this.culturalWisdom[accent] || [];
    
    if (wisdom.length === 0) return null;
    
    return wisdom[Math.floor(Math.random() * wisdom.length)];
  }

  public generateCulturalResponse(
    mama: Mama,
    userInput: string,
    cookingContext: string,
    recipe?: Recipe
  ): string | null {
    const inputWords = userInput.toLowerCase().split(' ');
    
    // Check for cultural story triggers
    const story = this.getCulturalStory(mama.accent, inputWords, cookingContext);
    if (story) {
      return this.formatStoryResponse(story, mama);
    }
    
    // Check for regional variation interest
    if (recipe && (inputWords.includes('different') || inputWords.includes('variation') || inputWords.includes('region'))) {
      const variation = this.getRegionalVariation(mama.accent, recipe);
      if (variation) {
        return this.formatVariationResponse(variation, mama);
      }
    }
    
    // Share cultural wisdom
    if (inputWords.includes('why') || inputWords.includes('tradition') || inputWords.includes('culture')) {
      const wisdom = this.getCulturalWisdom(mama.accent, cookingContext);
      if (wisdom) {
        return this.formatWisdomResponse(wisdom, mama);
      }
    }
    
    return null;
  }

  private formatStoryResponse(story: CulturalStory, mama: Mama): string {
    const culturalGreeting = this.getCulturalGreeting(mama.accent);
    return `${culturalGreeting} ${story.content}`;
  }

  private formatVariationResponse(variation: RegionalVariation, mama: Mama): string {
    const culturalPhrase = this.getCulturalPhrase(mama.accent);
    return `${culturalPhrase} In ${variation.region}, they make this differently - ${variation.modification}. This is because ${variation.culturalReason}. It's beautiful how each region adds their own soul to the recipe!`;
  }

  private formatWisdomResponse(wisdom: CulturalWisdom, mama: Mama): string {
    const accent = mama.accent.toLowerCase();
    let response = '';
    
    if (accent === 'italian') {
      response = `Ah, tesoro, we have a saying: "${wisdom.wisdom}" - ${wisdom.context}. `;
    } else if (accent === 'mexican') {
      response = `Mi amor, como decimos en México: "${wisdom.wisdom}" - ${wisdom.context}. `;
    } else if (accent === 'thai') {
      response = `Dear child, in Thailand we say "${wisdom.wisdom}" - ${wisdom.context}. `;
    }
    
    response += wisdom.application;
    return response;
  }

  private getCulturalGreeting(accent: string): string {
    switch (accent.toLowerCase()) {
      case 'italian':
        return 'Ah, questo mi ricorda...'; // This reminds me...
      case 'mexican':
        return 'Ay, esto me recuerda...'; // This reminds me...
      case 'thai':
        return 'This brings back memories...';
      default:
        return 'This reminds me of...';
    }
  }

  private getCulturalPhrase(accent: string): string {
    switch (accent.toLowerCase()) {
      case 'italian':
        return 'Sai cosa, caro?'; // You know what, dear?
      case 'mexican':
        return '¿Sabes qué, mijo?'; // You know what, dear?
      case 'thai':
        return 'You know, darling,';
      default:
        return 'You know what?';
    }
  }

  public getCulturalCelebrations(accent: string, currentMonth: number): {
    celebration: string;
    description: string;
    traditionalFoods: string[];
  } | null {
    const celebrations = {
      italian: {
        11: { // December
          celebration: 'La Vigilia di Natale',
          description: 'Christmas Eve feast with seven fishes tradition',
          traditionalFoods: ['baccalà', 'calamari', 'pasta with clams', 'panettone']
        },
        7: { // August
          celebration: 'Ferragosto',
          description: 'Mid-August celebration with family gatherings',
          traditionalFoods: ['grilled meats', 'fresh pasta', 'gelato', 'watermelon']
        }
      },
      mexican: {
        10: { // November
          celebration: 'Día de los Muertos',
          description: 'Day of the Dead honoring ancestors through food',
          traditionalFoods: ['pan de muerto', 'mole', 'tamales', 'atole']
        },
        8: { // September
          celebration: 'Independence Day',
          description: 'Mexican Independence celebration with traditional foods',
          traditionalFoods: ['chiles en nogada', 'pozole', 'elote', 'horchata']
        }
      },
      thai: {
        3: { // April
          celebration: 'Songkran',
          description: 'Thai New Year with water festival and family meals',
          traditionalFoods: ['pad thai', 'som tam', 'mango sticky rice', 'thai iced tea']
        },
        10: { // November
          celebration: 'Loy Krathong',
          description: 'Festival of lights with floating offerings and feasts',
          traditionalFoods: ['coconut desserts', 'grilled fish', 'curry', 'thai sweets']
        }
      }
    };
    
    const accentCelebrations = celebrations[accent.toLowerCase() as keyof typeof celebrations];
    return accentCelebrations?.[currentMonth] || null;
  }
}
