
// Phrase caching service for optimized voice responses
export interface CachedPhrase {
  id: string;
  text: string;
  mamaId: string;
  audioUrl?: string;
  isPreGenerated: boolean;
  category: 'greeting' | 'instruction' | 'encouragement' | 'timer' | 'general';
  priority: number; // Higher priority phrases are cached first
}

export interface PhraseCacheConfig {
  maxCacheSize: number;
  preloadPriority: number;
  cacheExpiryHours: number;
}

// Enhanced phrase categories with more cooking-specific content
export const ENHANCED_CACHED_PHRASES: Record<string, Record<string, CachedPhrase>> = {
  'nonna_lucia': {
    // Greetings
    welcome: {
      id: 'nonna_lucia_welcome',
      text: "Benvenuti nella mia cucina, cari! Ready to cook with amore?",
      mamaId: 'nonna_lucia',
      category: 'greeting',
      priority: 10,
      isPreGenerated: false
    },
    start_cooking: {
      id: 'nonna_lucia_start',
      text: "Iniziamo a cucinare insieme! Let's make something beautiful!",
      mamaId: 'nonna_lucia', 
      category: 'greeting',
      priority: 9,
      isPreGenerated: false
    },
    
    // Instructions
    next_step: {
      id: 'nonna_lucia_next',
      text: "Ora, il prossimo passo... Now, the next step...",
      mamaId: 'nonna_lucia',
      category: 'instruction',
      priority: 8,
      isPreGenerated: false
    },
    prep_ingredients: {
      id: 'nonna_lucia_prep',
      text: "First, we prepare our ingredients with love and care, ecco!",
      mamaId: 'nonna_lucia',
      category: 'instruction', 
      priority: 7,
      isPreGenerated: false
    },
    
    // Encouragement
    well_done: {
      id: 'nonna_lucia_praise',
      text: "Bravissimi! Perfetto! You're doing wonderful, tesoro!",
      mamaId: 'nonna_lucia',
      category: 'encouragement',
      priority: 6,
      isPreGenerated: false
    },
    keep_going: {
      id: 'nonna_lucia_continue',
      text: "Continue, caro! You have the magic touch!",
      mamaId: 'nonna_lucia',
      category: 'encouragement',
      priority: 5,
      isPreGenerated: false
    },
    
    // Timer alerts
    timer_done: {
      id: 'nonna_lucia_timer',
      text: "Il tempo è finito, tesoro! Time is up, check your dish!",
      mamaId: 'nonna_lucia',
      category: 'timer',
      priority: 8,
      isPreGenerated: false
    },
    timer_halfway: {
      id: 'nonna_lucia_halfway',
      text: "We're halfway there, bene! Keep watching, amore!",
      mamaId: 'nonna_lucia',
      category: 'timer',
      priority: 4,
      isPreGenerated: false
    },
    
    // General cooking
    taste_check: {
      id: 'nonna_lucia_taste',
      text: "Assaggia e dimmi com'è! Taste and tell me how it is!",
      mamaId: 'nonna_lucia',
      category: 'general',
      priority: 6,
      isPreGenerated: false
    }
  },
  
  'abuela_rosa': {
    // Greetings  
    welcome: {
      id: 'abuela_rosa_welcome',
      text: "¡Bienvenidos a mi cocina, mis queridos! Welcome to my kitchen!",
      mamaId: 'abuela_rosa',
      category: 'greeting',
      priority: 10,
      isPreGenerated: false
    },
    start_cooking: {
      id: 'abuela_rosa_start',
      text: "¡Vamos a cocinar juntos! Let's cook together with passion!",
      mamaId: 'abuela_rosa',
      category: 'greeting',
      priority: 9,
      isPreGenerated: false
    },
    
    // Instructions
    next_step: {
      id: 'abuela_rosa_next',
      text: "Ahora, el siguiente paso... Now, the next step, mija!",
      mamaId: 'abuela_rosa',
      category: 'instruction',
      priority: 8,
      isPreGenerated: false
    },
    prep_ingredients: {
      id: 'abuela_rosa_prep',  
      text: "First, we prepare everything with love, ¡órale!",
      mamaId: 'abuela_rosa',
      category: 'instruction',
      priority: 7,
      isPreGenerated: false
    },
    
    // Encouragement
    well_done: {
      id: 'abuela_rosa_praise',
      text: "¡Muy bien! ¡Perfecto! You're cooking like mi abuela, amor!",
      mamaId: 'abuela_rosa',
      category: 'encouragement',
      priority: 6,
      isPreGenerated: false
    },
    keep_going: {
      id: 'abuela_rosa_continue',
      text: "¡Sigue así! Keep going, you're doing amazing!",
      mamaId: 'abuela_rosa',
      category: 'encouragement',
      priority: 5,
      isPreGenerated: false
    },
    
    // Timer alerts
    timer_done: {
      id: 'abuela_rosa_timer',
      text: "¡Se acabó el tiempo, mi amor! Time's up, check your food!",
      mamaId: 'abuela_rosa',
      category: 'timer',
      priority: 8,
      isPreGenerated: false
    },
    
    // General cooking
    taste_check: {
      id: 'abuela_rosa_taste',
      text: "¡Pruébalo y dime qué tal! Taste it and tell me how it is!",
      mamaId: 'abuela_rosa',
      category: 'general',
      priority: 6,
      isPreGenerated: false
    }
  },
  
  'yai_malee': {
    // Greetings
    welcome: {
      id: 'yai_malee_welcome',
      text: "Welcome to my kitchen, dear! Let's find balance in cooking today.",
      mamaId: 'yai_malee',
      category: 'greeting',
      priority: 10,
      isPreGenerated: false
    },
    start_cooking: {
      id: 'yai_malee_start',
      text: "Let's cook with mindfulness and joy, sweet pea!",
      mamaId: 'yai_malee',
      category: 'greeting',
      priority: 9,
      isPreGenerated: false
    },
    
    // Instructions
    next_step: {
      id: 'yai_malee_next',
      text: "Now honey, the next step... Take your time, no rush.",
      mamaId: 'yai_malee',
      category: 'instruction',
      priority: 8,
      isPreGenerated: false
    },
    prep_ingredients: {
      id: 'yai_malee_prep',
      text: "First, we prepare with patience and care, ka.",
      mamaId: 'yai_malee',
      category: 'instruction',
      priority: 7,
      isPreGenerated: false
    },
    
    // Encouragement
    well_done: {
      id: 'yai_malee_praise',
      text: "Well done, darlin'! Perfect balance, just like life!",
      mamaId: 'yai_malee',
      category: 'encouragement',
      priority: 6,
      isPreGenerated: false
    },
    keep_going: {
      id: 'yai_malee_continue',
      text: "Keep going with patience, sugar! You're finding your rhythm!",
      mamaId: 'yai_malee',
      category: 'encouragement',
      priority: 5,
      isPreGenerated: false
    },
    
    // Timer alerts
    timer_done: {
      id: 'yai_malee_timer',
      text: "Time's up, sweet pea! Check with your heart and eyes.",
      mamaId: 'yai_malee',
      category: 'timer',
      priority: 8,
      isPreGenerated: false
    },
    
    // General cooking
    taste_check: {
      id: 'yai_malee_taste',
      text: "Taste mindfully, dear. What does your heart tell you?",
      mamaId: 'yai_malee',
      category: 'general',
      priority: 6,
      isPreGenerated: false
    }
  }
};

export class PhraseCacheService {
  private cache = new Map<string, CachedPhrase>();
  private config: PhraseCacheConfig = {
    maxCacheSize: 100,
    preloadPriority: 7,
    cacheExpiryHours: 24
  };

  constructor(config?: Partial<PhraseCacheConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.initializeCache();
  }

  private initializeCache(): void {
    console.log('[PhraseCacheService] Initializing phrase cache...');
    
    // Load high-priority phrases into cache
    Object.values(ENHANCED_CACHED_PHRASES).forEach(mamasPhrases => {
      Object.values(mamasPhrases).forEach(phrase => {
        if (phrase.priority >= this.config.preloadPriority) {
          this.cache.set(phrase.id, phrase);
        }
      });
    });
    
    console.log(`[PhraseCacheService] Loaded ${this.cache.size} high-priority phrases`);
  }

  public findMatchingPhrase(text: string, mamaId: string): CachedPhrase | null {
    const mamasPhrases = ENHANCED_CACHED_PHRASES[mamaId];
    if (!mamasPhrases) return null;

    const lowerText = text.toLowerCase().trim();
    
    // Direct keyword matching with intelligent scoring
    const matches: Array<{ phrase: CachedPhrase; score: number }> = [];
    
    Object.values(mamasPhrases).forEach(phrase => {
      let score = 0;
      const phraseWords = phrase.text.toLowerCase().split(' ');
      const textWords = lowerText.split(' ');
      
      // Exact phrase match (highest score)
      if (lowerText.includes(phrase.text.toLowerCase())) {
        score += 100;
      }
      
      // Keyword matching with context awareness
      if (lowerText.includes('next') && phrase.id.includes('next')) score += 50;
      if (lowerText.includes('start') && phrase.id.includes('start')) score += 50;
      if (lowerText.includes('welcome') && phrase.id.includes('welcome')) score += 50;
      if (lowerText.includes('timer') && phrase.id.includes('timer')) score += 50;
      if (lowerText.includes('taste') && phrase.id.includes('taste')) score += 50;
      if (lowerText.includes('good') && phrase.id.includes('praise')) score += 40;
      if (lowerText.includes('well done') && phrase.id.includes('praise')) score += 60;
      if (lowerText.includes('continue') && phrase.id.includes('continue')) score += 45;
      
      // Common cooking instruction patterns
      if (lowerText.includes('step') && phrase.category === 'instruction') score += 30;
      if (lowerText.includes('prep') && phrase.id.includes('prep')) score += 40;
      if ((lowerText.includes('time') || lowerText.includes('done')) && phrase.category === 'timer') score += 45;
      
      // Boost score for high-priority phrases
      score += phrase.priority;
      
      if (score > 20) { // Minimum threshold for relevance
        matches.push({ phrase, score });
      }
    });
    
    // Return highest scoring match
    if (matches.length > 0) {
      matches.sort((a, b) => b.score - a.score);
      const bestMatch = matches[0];
      console.log(`[PhraseCacheService] Found match for "${text}": ${bestMatch.phrase.id} (score: ${bestMatch.score})`);
      return bestMatch.phrase;
    }
    
    return null;
  }

  public getCachedPhrase(phraseId: string): CachedPhrase | null {
    return this.cache.get(phraseId) || null;
  }

  public addToCache(phrase: CachedPhrase): void {
    // Implement LRU cache behavior
    if (this.cache.size >= this.config.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(phrase.id, phrase);
    console.log(`[PhraseCacheService] Added phrase to cache: ${phrase.id}`);
  }

  public preGenerateAudio(phrase: CachedPhrase, audioUrl: string): void {
    const updatedPhrase = { ...phrase, audioUrl, isPreGenerated: true };
    this.cache.set(phrase.id, updatedPhrase);
    console.log(`[PhraseCacheService] Pre-generated audio for: ${phrase.id}`);
  }

  public getCacheStats(): { size: number; preGenerated: number; categories: Record<string, number> } {
    const phrases = Array.from(this.cache.values());
    const preGenerated = phrases.filter(p => p.isPreGenerated).length;
    const categories = phrases.reduce((acc, phrase) => {
      acc[phrase.category] = (acc[phrase.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      size: this.cache.size,
      preGenerated,
      categories
    };
  }

  public clearCache(): void {
    this.cache.clear();
    this.initializeCache();
  }
}
