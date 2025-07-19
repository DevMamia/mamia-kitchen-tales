
interface PhotoAnalysisResult {
  overallScore: number; // 1-10
  visualAppeal: number;
  techniqueAssessment: string;
  improvementSuggestions: string[];
  culturalAuthenticity: number;
  mamaPersonalizedFeedback: string;
  achievementUnlocked?: string;
  shareableQuote: string;
}

interface PhotoAnalysisRequest {
  imageBase64: string;
  recipeId: string;
  currentStep: number;
  mamaId: string;
  recipeName: string;
}

export class MamaPhotoAnalysisService {
  private static instance: MamaPhotoAnalysisService;
  
  static getInstance(): MamaPhotoAnalysisService {
    if (!MamaPhotoAnalysisService.instance) {
      MamaPhotoAnalysisService.instance = new MamaPhotoAnalysisService();
    }
    return MamaPhotoAnalysisService.instance;
  }

  async analyzePhoto(request: PhotoAnalysisRequest): Promise<PhotoAnalysisResult> {
    try {
      console.log('[MamaPhotoAnalysis] Analyzing photo for recipe:', request.recipeName);
      
      // Call OpenAI Vision API through Supabase edge function
      const response = await fetch('/functions/v1/analyze-cooking-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: request.imageBase64,
          recipeContext: {
            recipeName: request.recipeName,
            currentStep: request.currentStep,
            mamaId: request.mamaId,
            recipeId: request.recipeId
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze photo');
      }

      const analysis = await response.json();
      console.log('[MamaPhotoAnalysis] Analysis complete:', analysis);

      return this.formatAnalysisResult(analysis, request.mamaId);
    } catch (error) {
      console.error('[MamaPhotoAnalysis] Error analyzing photo:', error);
      return this.getFallbackAnalysis(request.mamaId, request.recipeName);
    }
  }

  private formatAnalysisResult(analysis: any, mamaId: string): PhotoAnalysisResult {
    const mamaPersonality = this.getMamaPersonality(mamaId);
    
    return {
      overallScore: analysis.overallScore || 7,
      visualAppeal: analysis.visualAppeal || 7,
      techniqueAssessment: analysis.techniqueAssessment || "Looking good so far!",
      improvementSuggestions: analysis.improvementSuggestions || [],
      culturalAuthenticity: analysis.culturalAuthenticity || 8,
      mamaPersonalizedFeedback: this.generatePersonalizedFeedback(analysis, mamaPersonality),
      achievementUnlocked: analysis.achievementUnlocked,
      shareableQuote: this.generateShareableQuote(analysis, mamaPersonality)
    };
  }

  private generatePersonalizedFeedback(analysis: any, mamaPersonality: any): string {
    const score = analysis.overallScore || 7;
    
    if (score >= 8) {
      return mamaPersonality.excellentFeedback[Math.floor(Math.random() * mamaPersonality.excellentFeedback.length)];
    } else if (score >= 6) {
      return mamaPersonality.goodFeedback[Math.floor(Math.random() * mamaPersonality.goodFeedback.length)];
    } else {
      return mamaPersonality.encouragingFeedback[Math.floor(Math.random() * mamaPersonality.encouragingFeedback.length)];
    }
  }

  private generateShareableQuote(analysis: any, mamaPersonality: any): string {
    const templates = mamaPersonality.shareableQuotes;
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace('{dish}', 'your beautiful creation');
  }

  private getMamaPersonality(mamaId: string) {
    const personalities = {
      'nonna_lucia': {
        excellentFeedback: [
          "Madonna mia! This looks absolutely perfetto, tesoro! You're cooking with such amore!",
          "Bravissimo! Even my nonna in Tuscany would be proud of this beautiful dish!",
          "Che bella! This is exactly how we make it in Italia - with passion and love!"
        ],
        goodFeedback: [
          "Molto bene! You're learning the Italian way, caro. Keep going with that passion!",
          "Good work, tesoro! I can see the amore you're putting into every step.",
          "Nice technique! Your nonna skills are developing beautifully!"
        ],
        encouragingFeedback: [
          "Don't worry, caro! Cooking is about learning. Let me show you a little secret...",
          "Every great cook starts somewhere! Your passion is what matters most, tesoro.",
          "Cooking with love is more important than perfection, mio caro!"
        ],
        shareableQuotes: [
          "Nonna Lucia says: 'Cooking with amore makes everything taste better!' 🍝❤️",
          "Just like Nonna always said: 'The secret ingredient is always love!' 🇮🇹✨",
          "Nonna Lucia approved! This dish has that special Italian magic! 👵🏻🍷"
        ]
      },
      'abuela_rosa': {
        excellentFeedback: [
          "¡Órale! This looks increíble, mijo! You're cooking like a true mexicano!",
          "¡Qué rico! This dish has that authentic sabor that makes Abuela so proud!",
          "¡Perfecto! You have the gift of good hands in the kitchen, mi amor!"
        ],
        goodFeedback: [
          "¡Muy bien! Your sazón is getting stronger with each dish, mijo!",
          "Good job, mi amor! I can taste the love you're putting into this comida.",
          "¡Órale! You're learning the Mexican way with such passion!"
        ],
        encouragingFeedback: [
          "No te preocupes, mijo! Every great cocinero learns from their mistakes.",
          "Keep going with your corazón, mi amor! The flavors will come together beautifully.",
          "Cooking is about love and patience, not perfection, mijo!"
        ],
        shareableQuotes: [
          "Abuela Rosa says: '¡La comida hecha con amor always tastes the best!' 🌶️❤️",
          "Just got Abuela's approval! This dish has that authentic Mexican soul! 🇲🇽✨",
          "Abuela Rosa approved! Cooking with corazón makes all the difference! 👵🏽🌮"
        ]
      },
      'yai_malee': {
        excellentFeedback: [
          "Sabai mak! This looks absolutely beautiful, dear! Your balance is perfect!",
          "Wonderful! You're cooking with such mindfulness and respect for the ingredients!",
          "Excellent! The colors and textures show you understand Thai harmony!"
        ],
        goodFeedback: [
          "Very good! Your patience and care show in every step, dear child.",
          "Nice work! You're finding the balance between flavors beautifully.",
          "Good technique! Your Thai cooking spirit is growing stronger!"
        ],
        encouragingFeedback: [
          "Take your time, dear! Thai cooking is about patience and understanding.",
          "Every step is a learning experience. Trust the process and your instincts!",
          "Cooking is meditation in motion. Let the flavors guide you, dear!"
        ],
        shareableQuotes: [
          "Yai Malee says: 'Cooking with mindfulness creates the most beautiful flavors!' 🌿✨",
          "Just got Yai's blessing! This dish has that perfect Thai harmony! 🇹🇭🙏",
          "Yai Malee approved! Balance and patience make the best Thai food! 👵🏼🌶️"
        ]
      }
    };

    return personalities[mamaId] || personalities['nonna_lucia'];
  }

  private getFallbackAnalysis(mamaId: string, recipeName: string): PhotoAnalysisResult {
    const mamaPersonality = this.getMamaPersonality(mamaId);
    
    return {
      overallScore: 7,
      visualAppeal: 7,
      techniqueAssessment: "Looking good! Keep up the great work!",
      improvementSuggestions: ["Take your time with each step", "Trust the process"],
      culturalAuthenticity: 8,
      mamaPersonalizedFeedback: mamaPersonality.goodFeedback[0],
      shareableQuote: mamaPersonality.shareableQuotes[0]
    };
  }
}

export const mamaPhotoAnalysisService = MamaPhotoAnalysisService.getInstance();
