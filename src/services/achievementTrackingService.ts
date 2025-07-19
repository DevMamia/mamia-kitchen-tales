
interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'recipe_mastery' | 'cultural_explorer' | 'cooking_streak' | 'mama_favorite' | 'technique_master';
  mamaId?: string;
  criteria: AchievementCriteria;
  rewards: AchievementReward;
  unlockedAt?: Date;
  progress: number; // 0-100
  icon: string;
  rarity: 'common' | 'rare' | 'legendary';
}

interface AchievementCriteria {
  recipesCompleted?: number;
  cuisineType?: string;
  perfectRatings?: number;
  consecutiveDays?: number;
  techniquesMastered?: string[];
  photoApprovalsReceived?: number;
}

interface AchievementReward {
  title?: string;
  badge: string;
  unlockedRecipes?: string[];
  specialFeatures?: string[];
  shareableMessage: string;
}

interface UserAchievementProgress {
  userId?: string;
  achievements: Achievement[];
  totalPoints: number;
  currentStreak: number;
  recipesCompleted: Record<string, Date>;
  mamaFavoritePoints: Record<string, number>;
  lastActivity: Date;
}

export class AchievementTrackingService {
  private static instance: AchievementTrackingService;
  private achievements: Achievement[];
  private userProgress: UserAchievementProgress;

  constructor() {
    this.initializeAchievements();
    this.loadUserProgress();
  }

  static getInstance(): AchievementTrackingService {
    if (!AchievementTrackingService.instance) {
      AchievementTrackingService.instance = new AchievementTrackingService();
    }
    return AchievementTrackingService.instance;
  }

  private initializeAchievements() {
    this.achievements = [
      // Nonna Lucia Achievements
      {
        id: 'nonna_first_pasta',
        name: 'Prima Pasta',
        description: 'Complete your first pasta recipe with Nonna Lucia',
        type: 'recipe_mastery',
        mamaId: 'nonna_lucia',
        criteria: { recipesCompleted: 1, cuisineType: 'Italian' },
        rewards: {
          badge: '🍝',
          shareableMessage: 'Just earned my Prima Pasta badge with Nonna Lucia! Cooking with amore! 🇮🇹❤️'
        },
        progress: 0,
        icon: '🍝',
        rarity: 'common'
      },
      {
        id: 'nonna_pasta_master',
        name: 'Pasta Perfetto',
        description: 'Master 5 pasta recipes to Nonna\'s standards',
        type: 'recipe_mastery',
        mamaId: 'nonna_lucia',
        criteria: { recipesCompleted: 5, cuisineType: 'Italian' },
        rewards: {
          title: 'Pasta Master',
          badge: '👑🍝',
          unlockedRecipes: ['advanced_carbonara', 'handmade_gnocchi'],
          shareableMessage: 'Nonna Lucia declared me a Pasta Master! 5 recipes perfected with amore! 👑🍝'
        },
        progress: 0,
        icon: '👑',
        rarity: 'rare'
      },

      // Abuela Rosa Achievements
      {
        id: 'abuela_first_mole',
        name: 'Primer Mole',
        description: 'Complete your first mole recipe with Abuela Rosa',
        type: 'recipe_mastery',
        mamaId: 'abuela_rosa',
        criteria: { recipesCompleted: 1, cuisineType: 'Mexican' },
        rewards: {
          badge: '🌶️',
          shareableMessage: 'Just made my first mole with Abuela Rosa! Cooking with mi corazón! 🇲🇽❤️'
        },
        progress: 0,
        icon: '🌶️',
        rarity: 'common'
      },
      {
        id: 'abuela_spice_master',
        name: 'Maestro de Especias',
        description: 'Master the art of Mexican spice blending',
        type: 'technique_master',
        mamaId: 'abuela_rosa',
        criteria: { techniquesMastered: ['chile_toasting', 'spice_grinding', 'mole_balancing'] },
        rewards: {
          title: 'Spice Master',
          badge: '🔥🌶️',
          specialFeatures: ['spice_blend_calculator'],
          shareableMessage: 'Abuela Rosa taught me the secrets of Mexican spices! ¡Soy un Maestro! 🔥'
        },
        progress: 0,
        icon: '🔥',
        rarity: 'legendary'
      },

      // Yai Malee Achievements
      {
        id: 'yai_first_curry',
        name: 'First Curry Harmony',
        description: 'Create your first balanced curry with Yai Malee',
        type: 'recipe_mastery',
        mamaId: 'yai_malee',
        criteria: { recipesCompleted: 1, cuisineType: 'Thai' },
        rewards: {
          badge: '🌿',
          shareableMessage: 'Just found curry harmony with Yai Malee! Balance in every spoonful! 🇹🇭✨'
        },
        progress: 0,
        icon: '🌿',
        rarity: 'common'
      },
      {
        id: 'yai_balance_master',
        name: 'Master of Balance',
        description: 'Perfect the four Thai flavor pillars: sweet, sour, salty, spicy',
        type: 'technique_master',
        mamaId: 'yai_malee',
        criteria: { techniquesMastered: ['flavor_balancing', 'curry_paste', 'thai_seasoning'] },
        rewards: {
          title: 'Balance Master',
          badge: '⚖️🌿',
          unlockedRecipes: ['royal_thai_curry', 'traditional_som_tam'],
          shareableMessage: 'Yai Malee declared me a Master of Balance! Thai flavors in perfect harmony! ⚖️'
        },
        progress: 0,
        icon: '⚖️',
        rarity: 'rare'
      },

      // Cross-Cultural Achievements
      {
        id: 'cultural_explorer',
        name: 'Cultural Explorer',
        description: 'Cook recipes from all three mama traditions',
        type: 'cultural_explorer',
        criteria: { recipesCompleted: 3 }, // One from each mama
        rewards: {
          title: 'Cultural Explorer',
          badge: '🌍',
          specialFeatures: ['fusion_recipe_suggestions'],
          shareableMessage: 'Explored three beautiful culinary traditions! Italian, Mexican, and Thai mastery! 🌍'
        },
        progress: 0,
        icon: '🌍',
        rarity: 'rare'
      },
      {
        id: 'photo_approved',
        name: 'Mama\'s Favorite',
        description: 'Receive 10 excellent photo approvals from the mamas',
        type: 'mama_favorite',
        criteria: { photoApprovalsReceived: 10 },
        rewards: {
          badge: '📸❤️',
          specialFeatures: ['priority_mama_feedback'],
          shareableMessage: 'The mamas love my cooking photos! 10 approvals and counting! 📸❤️'
        },
        progress: 0,
        icon: '📸',
        rarity: 'rare'
      },
      {
        id: 'streak_warrior',
        name: 'Cooking Streak Warrior',
        description: 'Cook with the mamas for 7 consecutive days',
        type: 'cooking_streak',
        criteria: { consecutiveDays: 7 },
        rewards: {
          title: 'Streak Warrior',
          badge: '🔥⚡',
          shareableMessage: 'Just hit a 7-day cooking streak! The mamas are proud! 🔥⚡'
        },
        progress: 0,
        icon: '⚡',
        rarity: 'common'
      }
    ];
  }

  private loadUserProgress() {
    const stored = localStorage.getItem('achievement_progress');
    this.userProgress = stored ? JSON.parse(stored) : {
      achievements: this.achievements.map(a => ({ ...a, progress: 0 })),
      totalPoints: 0,
      currentStreak: 0,
      recipesCompleted: {},
      mamaFavoritePoints: {},
      lastActivity: new Date()
    };
  }

  private saveUserProgress() {
    localStorage.setItem('achievement_progress', JSON.stringify(this.userProgress));
  }

  async trackRecipeCompletion(recipeId: string, mamaId: string, rating: number) {
    console.log('[Achievement] Tracking recipe completion:', recipeId, mamaId, rating);
    
    this.userProgress.recipesCompleted[recipeId] = new Date();
    this.updateCookingStreak();
    
    // Check recipe mastery achievements
    const newlyUnlocked = this.checkRecipeAchievements(mamaId, rating);
    
    this.saveUserProgress();
    return newlyUnlocked;
  }

  async trackPhotoApproval(rating: number, mamaId: string) {
    console.log('[Achievement] Tracking photo approval:', rating, mamaId);
    
    if (rating >= 8) {
      if (!this.userProgress.mamaFavoritePoints[mamaId]) {
        this.userProgress.mamaFavoritePoints[mamaId] = 0;
      }
      this.userProgress.mamaFavoritePoints[mamaId]++;
      
      const newlyUnlocked = this.checkPhotoAchievements();
      this.saveUserProgress();
      return newlyUnlocked;
    }
    
    return [];
  }

  async trackTechniqueMastery(technique: string, mamaId: string) {
    console.log('[Achievement] Tracking technique mastery:', technique, mamaId);
    
    const newlyUnlocked = this.checkTechniqueAchievements(technique, mamaId);
    this.saveUserProgress();
    return newlyUnlocked;
  }

  private checkRecipeAchievements(mamaId: string, rating: number): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    
    for (const achievement of this.userProgress.achievements) {
      if (achievement.unlockedAt || achievement.type !== 'recipe_mastery') continue;
      
      if (achievement.criteria.cuisineType) {
        const cuisine = this.getCuisineByMamaId(mamaId);
        if (achievement.criteria.cuisineType !== cuisine) continue;
      }
      
      if (achievement.mamaId && achievement.mamaId !== mamaId) continue;
      
      const completedCount = this.getCompletedRecipeCount(mamaId);
      const requiredCount = achievement.criteria.recipesCompleted || 1;
      
      achievement.progress = Math.min(100, (completedCount / requiredCount) * 100);
      
      if (completedCount >= requiredCount && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date();
        newlyUnlocked.push(achievement);
        this.userProgress.totalPoints += this.getAchievementPoints(achievement);
      }
    }
    
    return newlyUnlocked;
  }

  private checkPhotoAchievements(): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    const totalApprovals = Object.values(this.userProgress.mamaFavoritePoints).reduce((sum, count) => sum + count, 0);
    
    for (const achievement of this.userProgress.achievements) {
      if (achievement.unlockedAt || achievement.type !== 'mama_favorite') continue;
      
      const requiredApprovals = achievement.criteria.photoApprovalsReceived || 10;
      achievement.progress = Math.min(100, (totalApprovals / requiredApprovals) * 100);
      
      if (totalApprovals >= requiredApprovals && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date();
        newlyUnlocked.push(achievement);
        this.userProgress.totalPoints += this.getAchievementPoints(achievement);
      }
    }
    
    return newlyUnlocked;
  }

  private checkTechniqueAchievements(technique: string, mamaId: string): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    
    for (const achievement of this.userProgress.achievements) {
      if (achievement.unlockedAt || achievement.type !== 'technique_master') continue;
      if (achievement.mamaId && achievement.mamaId !== mamaId) continue;
      
      // This would track technique mastery - simplified for now
      if (achievement.criteria.techniquesMastered?.includes(technique)) {
        achievement.progress = Math.min(100, achievement.progress + 33.33); // Assuming 3 techniques per achievement
        
        if (achievement.progress >= 100 && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
          newlyUnlocked.push(achievement);
          this.userProgress.totalPoints += this.getAchievementPoints(achievement);
        }
      }
    }
    
    return newlyUnlocked;
  }

  private updateCookingStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const lastActivity = new Date(this.userProgress.lastActivity).toDateString();
    
    if (lastActivity === today) {
      // Already cooked today, no change
      return;
    } else if (lastActivity === yesterday) {
      // Consecutive day
      this.userProgress.currentStreak++;
    } else {
      // Streak broken
      this.userProgress.currentStreak = 1;
    }
    
    this.userProgress.lastActivity = new Date();
    this.checkStreakAchievements();
  }

  private checkStreakAchievements() {
    for (const achievement of this.userProgress.achievements) {
      if (achievement.unlockedAt || achievement.type !== 'cooking_streak') continue;
      
      const requiredDays = achievement.criteria.consecutiveDays || 7;
      achievement.progress = Math.min(100, (this.userProgress.currentStreak / requiredDays) * 100);
      
      if (this.userProgress.currentStreak >= requiredDays && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date();
        this.userProgress.totalPoints += this.getAchievementPoints(achievement);
      }
    }
  }

  private getCompletedRecipeCount(mamaId?: string): number {
    if (!mamaId) return Object.keys(this.userProgress.recipesCompleted).length;
    
    // This would need recipe data to filter by mama - simplified for now
    return Object.keys(this.userProgress.recipesCompleted).length;
  }

  private getCuisineByMamaId(mamaId: string): string {
    const cuisineMap = {
      'nonna_lucia': 'Italian',
      'abuela_rosa': 'Mexican',
      'yai_malee': 'Thai'
    };
    return cuisineMap[mamaId] || 'Unknown';
  }

  private getAchievementPoints(achievement: Achievement): number {
    const pointsMap = { common: 10, rare: 25, legendary: 50 };
    return pointsMap[achievement.rarity];
  }

  getUserProgress(): UserAchievementProgress {
    return this.userProgress;
  }

  getUnlockedAchievements(): Achievement[] {
    return this.userProgress.achievements.filter(a => a.unlockedAt);
  }

  getProgressAchievements(): Achievement[] {
    return this.userProgress.achievements.filter(a => !a.unlockedAt && a.progress > 0);
  }

  getAchievementsByMama(mamaId: string): Achievement[] {
    return this.userProgress.achievements.filter(a => a.mamaId === mamaId);
  }
}

export const achievementTrackingService = AchievementTrackingService.getInstance();
