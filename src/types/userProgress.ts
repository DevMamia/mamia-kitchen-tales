export interface UserProgress {
  id: string;
  userId?: string; // For future user authentication
  recipeId: string;
  currentStep: number;
  totalSteps: number;
  startedAt: Date;
  lastUpdatedAt: Date;
  completedAt?: Date;
  cookingTimer?: {
    startTime: Date;
    duration: number; // in minutes
    isActive: boolean;
  };
  notes?: string[];
  rating?: number;
  difficulty_experienced?: 'Easy' | 'Medium' | 'Hard';
  // Voice-related progress
  voiceSettings?: {
    mode: 'full' | 'essential' | 'text';
    volume: number;
    speed: number;
    enabled: boolean;
    preferredVoice?: string;
  };
}

export interface CookingSession {
  recipeId: string;
  currentStep: number;
  isActive: boolean;
  startTime: Date;
  voiceEnabled: boolean;
  notes: string[];
}

// Local storage helpers for offline functionality
export const saveUserProgress = (progress: UserProgress): void => {
  const existing = getUserProgress();
  const updated = existing.filter(p => p.id !== progress.id);
  updated.push(progress);
  localStorage.setItem('cooking_progress', JSON.stringify(updated));
};

export const getUserProgress = (): UserProgress[] => {
  const stored = localStorage.getItem('cooking_progress');
  return stored ? JSON.parse(stored) : [];
};

export const getProgressByRecipe = (recipeId: string): UserProgress | undefined => {
  const progress = getUserProgress();
  return progress.find(p => p.recipeId === recipeId);
};

export const createNewProgress = (recipeId: string, totalSteps: number): UserProgress => {
  return {
    id: `${recipeId}_${Date.now()}`,
    recipeId,
    currentStep: 0,
    totalSteps,
    startedAt: new Date(),
    lastUpdatedAt: new Date(),
    notes: []
  };
};