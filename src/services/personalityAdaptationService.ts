
import { Mama } from '@/data/mamas';

interface UserInteractionPattern {
  averageResponseTime: number;
  questionTypes: string[];
  strugglingAreas: string[];
  preferredGuidanceStyle: 'detailed' | 'concise' | 'encouraging';
  culturalReceptivity: number;
  voiceUsageFrequency: number;
  sessionsCompleted: number;
  lastActive: Date;
}

interface PersonalityAdaptation {
  warmthLevel: number; // 0-100
  detailLevel: number; // 0-100
  culturalIntensity: number; // 0-100
  encouragementFrequency: number; // 0-100
  storytellingTendency: number; // 0-100
  technicalDepth: number; // 0-100
}

export class PersonalityAdaptationService {
  private static instance: PersonalityAdaptationService;
  private userPatterns = new Map<string, UserInteractionPattern>();
  private adaptations = new Map<string, PersonalityAdaptation>();

  static getInstance(): PersonalityAdaptationService {
    if (!PersonalityAdaptationService.instance) {
      PersonalityAdaptationService.instance = new PersonalityAdaptationService();
    }
    return PersonalityAdaptationService.instance;
  }

  public recordUserInteraction(
    userId: string,
    interactionType: 'question' | 'command' | 'response',
    content: string,
    responseTime: number,
    strugglingArea?: string
  ): void {
    const pattern = this.userPatterns.get(userId) || this.createDefaultPattern();
    
    // Update response time average
    pattern.averageResponseTime = (pattern.averageResponseTime + responseTime) / 2;
    
    // Categorize interaction
    const questionType = this.categorizeInteraction(content);
    if (!pattern.questionTypes.includes(questionType)) {
      pattern.questionTypes.push(questionType);
    }
    
    // Track struggling areas
    if (strugglingArea && !pattern.strugglingAreas.includes(strugglingArea)) {
      pattern.strugglingAreas.push(strugglingArea);
    }
    
    // Update cultural receptivity based on response to cultural content
    if (this.isCulturalContent(content)) {
      pattern.culturalReceptivity += this.isPositiveResponse(content) ? 5 : -2;
      pattern.culturalReceptivity = Math.max(0, Math.min(100, pattern.culturalReceptivity));
    }
    
    pattern.lastActive = new Date();
    this.userPatterns.set(userId, pattern);
    
    // Update personality adaptation
    this.updatePersonalityAdaptation(userId, pattern);
  }

  public getAdaptedPersonality(userId: string, mama: Mama): PersonalityAdaptation {
    let adaptation = this.adaptations.get(userId);
    
    if (!adaptation) {
      adaptation = this.createBasePersonality(mama);
      this.adaptations.set(userId, adaptation);
    }
    
    return adaptation;
  }

  public generateAdaptedResponse(
    userId: string,
    mama: Mama,
    baseResponse: string,
    context: string
  ): string {
    const adaptation = this.getAdaptedPersonality(userId, mama);
    const pattern = this.userPatterns.get(userId);
    
    let adaptedResponse = baseResponse;
    
    // Adjust warmth level
    if (adaptation.warmthLevel > 70) {
      adaptedResponse = this.increaseWarmth(adaptedResponse, mama.accent);
    } else if (adaptation.warmthLevel < 30) {
      adaptedResponse = this.decreaseWarmth(adaptedResponse);
    }
    
    // Adjust detail level
    if (adaptation.detailLevel > 70 && pattern?.strugglingAreas.length > 2) {
      adaptedResponse = this.addDetailedExplanation(adaptedResponse, context);
    }
    
    // Add cultural elements based on intensity
    if (adaptation.culturalIntensity > 60) {
      adaptedResponse = this.enhanceCulturalExpression(adaptedResponse, mama);
    }
    
    // Add encouragement if needed
    if (adaptation.encouragementFrequency > 70 || pattern?.strugglingAreas.length > 1) {
      adaptedResponse = this.addEncouragement(adaptedResponse, mama.accent);
    }
    
    // Add storytelling elements
    if (adaptation.storytellingTendency > 60 && Math.random() > 0.7) {
      adaptedResponse = this.addCulturalStory(adaptedResponse, mama, context);
    }
    
    return adaptedResponse;
  }

  private createDefaultPattern(): UserInteractionPattern {
    return {
      averageResponseTime: 5000,
      questionTypes: [],
      strugglingAreas: [],
      preferredGuidanceStyle: 'detailed',
      culturalReceptivity: 50,
      voiceUsageFrequency: 0,
      sessionsCompleted: 0,
      lastActive: new Date()
    };
  }

  private createBasePersonality(mama: Mama): PersonalityAdaptation {
    // Base personality traits for each mama
    switch (mama.accent) {
      case 'Italian':
        return {
          warmthLevel: 80,
          detailLevel: 70,
          culturalIntensity: 75,
          encouragementFrequency: 65,
          storytellingTendency: 80,
          technicalDepth: 70
        };
      case 'Mexican':
        return {
          warmthLevel: 85,
          detailLevel: 65,
          culturalIntensity: 80,
          encouragementFrequency: 80,
          storytellingTendency: 75,
          technicalDepth: 60
        };
      case 'Thai':
        return {
          warmthLevel: 70,
          detailLevel: 80,
          culturalIntensity: 70,
          encouragementFrequency: 60,
          storytellingTendency: 65,
          technicalDepth: 85
        };
      default:
        return {
          warmthLevel: 70,
          detailLevel: 70,
          culturalIntensity: 70,
          encouragementFrequency: 70,
          storytellingTendency: 70,
          technicalDepth: 70
        };
    }
  }

  private updatePersonalityAdaptation(userId: string, pattern: UserInteractionPattern): void {
    const currentAdaptation = this.adaptations.get(userId);
    if (!currentAdaptation) return;

    // Adapt based on user patterns
    if (pattern.strugglingAreas.length > 2) {
      currentAdaptation.detailLevel = Math.min(100, currentAdaptation.detailLevel + 5);
      currentAdaptation.encouragementFrequency = Math.min(100, currentAdaptation.encouragementFrequency + 5);
    }

    if (pattern.culturalReceptivity > 70) {
      currentAdaptation.culturalIntensity = Math.min(100, currentAdaptation.culturalIntensity + 3);
      currentAdaptation.storytellingTendency = Math.min(100, currentAdaptation.storytellingTendency + 3);
    }

    if (pattern.averageResponseTime < 2000) {
      // User responds quickly - they might prefer concise guidance
      currentAdaptation.detailLevel = Math.max(30, currentAdaptation.detailLevel - 3);
    }

    this.adaptations.set(userId, currentAdaptation);
  }

  private categorizeInteraction(content: string): string {
    const lower = content.toLowerCase();
    
    if (lower.includes('how') || lower.includes('why')) return 'technique_question';
    if (lower.includes('substitute') || lower.includes('replace')) return 'substitution';
    if (lower.includes('time') || lower.includes('long')) return 'timing';
    if (lower.includes('wrong') || lower.includes('disaster')) return 'emergency';
    if (lower.includes('story') || lower.includes('family')) return 'cultural_interest';
    
    return 'general';
  }

  private isCulturalContent(content: string): boolean {
    const culturalKeywords = [
      'story', 'family', 'tradition', 'grandmother', 'nonna', 'abuela', 'yai',
      'culture', 'heritage', 'authentic', 'traditional'
    ];
    
    return culturalKeywords.some(keyword => content.toLowerCase().includes(keyword));
  }

  private isPositiveResponse(content: string): boolean {
    const positiveWords = [
      'love', 'amazing', 'wonderful', 'beautiful', 'thank', 'great',
      'fantastic', 'perfect', 'yes', 'please', 'more'
    ];
    
    return positiveWords.some(word => content.toLowerCase().includes(word));
  }

  private increaseWarmth(response: string, accent: string): string {
    const warmthPhrases = {
      Italian: ['tesoro mio', 'caro bambino', 'amore'],
      Mexican: ['mi corazón', 'mi vida', 'querido'],
      Thai: ['dear child', 'little one', 'my friend']
    };
    
    const phrases = warmthPhrases[accent as keyof typeof warmthPhrases] || ['dear'];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    return response.replace(/\b(you|dear)\b/i, phrase);
  }

  private decreaseWarmth(response: string): string {
    // Make response more direct and less emotional
    return response
      .replace(/!+/g, '.')
      .replace(/\b(oh|ah|ay|madonna)\b/gi, '')
      .trim();
  }

  private addDetailedExplanation(response: string, context: string): string {
    const explanations = [
      'Let me explain this step by step.',
      'Here\'s exactly what you need to do:',
      'The key is to understand why we do this:'
    ];
    
    const explanation = explanations[Math.floor(Math.random() * explanations.length)];
    return `${response} ${explanation}`;
  }

  private enhanceCulturalExpression(response: string, mama: Mama): string {
    const culturalExpressions = {
      Italian: ['Madonna mia!', 'Bene, bene!', 'Ecco!', 'Perfetto!'],
      Mexican: ['¡Órale!', '¡Qué rico!', '¡Perfecto!', '¡Así se hace!'],
      Thai: ['Sabai sabai', 'Very good!', 'Beautiful!', 'Perfect balance!']
    };
    
    const expressions = culturalExpressions[mama.accent as keyof typeof culturalExpressions] || ['Great!'];
    const expression = expressions[Math.floor(Math.random() * expressions.length)];
    
    return `${expression} ${response}`;
  }

  private addEncouragement(response: string, accent: string): string {
    const encouragements = {
      Italian: ['You\'re doing magnifico!', 'Bravissimo!', 'Like a true Italian!'],
      Mexican: ['¡Qué bueno, mijo!', 'You have good hands!', '¡Excelente trabajo!'],
      Thai: ['Your cooking spirit is beautiful!', 'Very mindful cooking!', 'Excellent balance!']
    };
    
    const encouragementList = encouragements[accent as keyof typeof encouragements] || ['Great job!'];
    const encouragement = encouragementList[Math.floor(Math.random() * encouragementList.length)];
    
    return `${encouragement} ${response}`;
  }

  private addCulturalStory(response: string, mama: Mama, context: string): string {
    const stories = {
      Italian: [
        'You know, my nonna used to say that cooking with love makes everything taste better.',
        'In my famiglia, we always gathered in the kitchen during Sunday preparations.',
        'This reminds me of harvest time in Tuscany, when the whole village would cook together.'
      ],
      Mexican: [
        'Mi abuela taught me that every dish carries the story of our ancestors.',
        'In our pueblo, the women would wake before dawn to prepare masa for the whole family.',
        'This recipe has been passed down through five generations of strong Mexican women.'
      ],
      Thai: [
        'In Thailand, we believe that cooking is a form of meditation and mindfulness.',
        'My grandmother taught me that each ingredient has its own spirit and energy.',
        'The balance in Thai cooking reflects the harmony we seek in all aspects of life.'
      ]
    };
    
    const storyList = stories[mama.accent as keyof typeof stories] || [];
    if (storyList.length === 0) return response;
    
    const story = storyList[Math.floor(Math.random() * storyList.length)];
    return `${response} ${story}`;
  }

  public getUserInsights(userId: string): {
    skillProgression: string;
    culturalEngagement: string;
    preferredStyle: string;
    recommendations: string[];
  } {
    const pattern = this.userPatterns.get(userId);
    const adaptation = this.adaptations.get(userId);
    
    if (!pattern || !adaptation) {
      return {
        skillProgression: 'New cook - just getting started!',
        culturalEngagement: 'Learning about cultural cooking traditions',
        preferredStyle: 'Balanced guidance',
        recommendations: ['Try more cultural recipes', 'Practice basic techniques']
      };
    }
    
    const skillProgression = pattern.strugglingAreas.length < 2 ? 'Progressing well' : 
                           pattern.strugglingAreas.length < 4 ? 'Building confidence' : 'Needs more practice';
    
    const culturalEngagement = pattern.culturalReceptivity > 70 ? 'Loves cultural stories' :
                              pattern.culturalReceptivity > 40 ? 'Appreciates cultural context' : 'Focuses on techniques';
    
    const preferredStyle = adaptation.detailLevel > 70 ? 'Detailed explanations' :
                          adaptation.encouragementFrequency > 70 ? 'Encouraging guidance' : 'Balanced approach';
    
    const recommendations = this.generateRecommendations(pattern, adaptation);
    
    return {
      skillProgression,
      culturalEngagement,
      preferredStyle,
      recommendations
    };
  }

  private generateRecommendations(pattern: UserInteractionPattern, adaptation: PersonalityAdaptation): string[] {
    const recommendations: string[] = [];
    
    if (pattern.culturalReceptivity > 60) {
      recommendations.push('Explore more traditional family recipes');
      recommendations.push('Learn about cultural cooking celebrations');
    }
    
    if (pattern.strugglingAreas.length > 2) {
      recommendations.push('Practice basic knife skills');
      recommendations.push('Focus on fundamental techniques');
    }
    
    if (adaptation.storytellingTendency > 70) {
      recommendations.push('Enjoy cooking documentaries');
      recommendations.push('Ask more about family cooking traditions');
    }
    
    return recommendations.length > 0 ? recommendations : ['Keep cooking with passion!'];
  }
}
