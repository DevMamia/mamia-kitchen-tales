
import { useState, useCallback, useEffect } from 'react';
import { Recipe } from '@/data/recipes';
import { Mama } from '@/data/mamas';

interface CookingSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  recipe: Recipe;
  mama: Mama;
  totalSteps: number;
  completedSteps: number[];
  strugglingSteps: number[];
  interruptions: number;
  questionsAsked: string[];
  cookingDifficulty: 'easy' | 'normal' | 'challenging';
  userSkillLevel: 'beginner' | 'intermediate' | 'advanced';
}

interface ConversationContext {
  recipe: Recipe;
  mama: Mama;
  currentStep: number;
  conversationPhase: 'pre-cooking' | 'cooking' | 'post-cooking';
  interruptionCount: number;
  lastUserInput: string;
  cookingProgress: {
    completedSteps: number[];
    strugglingSteps: number[];
    userQuestions: string[];
    helpRequests: number;
    avgStepTime: number;
  };
  userPreferences: {
    preferredGuidanceLevel: 'minimal' | 'standard' | 'detailed';
    voiceSpeed: number;
    culturalContext: boolean;
  };
  sessionAnalytics: {
    totalCookingTime: number;
    pauseCount: number;
    mostAskedQuestions: string[];
    successfulSteps: number[];
  };
}

export const useEnhancedConversationMemory = (recipe: Recipe, mama: Mama) => {
  const [context, setContext] = useState<ConversationContext>({
    recipe,
    mama,
    currentStep: 1,
    conversationPhase: 'pre-cooking',
    interruptionCount: 0,
    lastUserInput: '',
    cookingProgress: {
      completedSteps: [],
      strugglingSteps: [],
      userQuestions: [],
      helpRequests: 0,
      avgStepTime: 0
    },
    userPreferences: {
      preferredGuidanceLevel: 'standard',
      voiceSpeed: 1.0,
      culturalContext: true
    },
    sessionAnalytics: {
      totalCookingTime: 0,
      pauseCount: 0,
      mostAskedQuestions: [],
      successfulSteps: []
    }
  });

  const [currentSession, setCurrentSession] = useState<CookingSession | null>(null);
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());

  // Initialize cooking session
  const startCookingSession = useCallback(() => {
    const session: CookingSession = {
      sessionId: `session_${Date.now()}`,
      startTime: Date.now(),
      recipe,
      mama,
      totalSteps: recipe.instructions.length,
      completedSteps: [],
      strugglingSteps: [],
      interruptions: 0,
      questionsAsked: [],
      cookingDifficulty: 'normal',
      userSkillLevel: 'intermediate'
    };
    
    setCurrentSession(session);
    setStepStartTime(Date.now());
    console.log('[EnhancedConversationMemory] Started cooking session:', session.sessionId);
  }, [recipe, mama]);

  // Enhanced context update with analytics
  const updateContext = useCallback((updates: Partial<ConversationContext>) => {
    setContext(prev => {
      const newContext = { ...prev, ...updates };
      
      // Auto-save context to localStorage
      localStorage.setItem('cooking_context', JSON.stringify(newContext));
      
      return newContext;
    });
  }, []);

  // Track step completion with timing
  const markStepComplete = useCallback((stepNumber: number) => {
    const stepTime = Date.now() - stepStartTime;
    
    setContext(prev => ({
      ...prev,
      cookingProgress: {
        ...prev.cookingProgress,
        completedSteps: [...prev.cookingProgress.completedSteps, stepNumber],
        avgStepTime: ((prev.cookingProgress.avgStepTime * prev.cookingProgress.completedSteps.length) + stepTime) / (prev.cookingProgress.completedSteps.length + 1)
      },
      sessionAnalytics: {
        ...prev.sessionAnalytics,
        successfulSteps: [...prev.sessionAnalytics.successfulSteps, stepNumber]
      }
    }));
    
    setStepStartTime(Date.now());
    console.log(`[EnhancedConversationMemory] Step ${stepNumber} completed in ${stepTime}ms`);
  }, [stepStartTime]);

  // Enhanced help request tracking
  const requestHelp = useCallback((question: string, stepNumber?: number) => {
    setContext(prev => ({
      ...prev,
      lastUserInput: question,
      cookingProgress: {
        ...prev.cookingProgress,
        userQuestions: [...prev.cookingProgress.userQuestions, question],
        helpRequests: prev.cookingProgress.helpRequests + 1
      }
    }));
    
    if (stepNumber) {
      setContext(prev => ({
        ...prev,
        cookingProgress: {
          ...prev.cookingProgress,
          strugglingSteps: prev.cookingProgress.strugglingSteps.includes(stepNumber) 
            ? prev.cookingProgress.strugglingSteps 
            : [...prev.cookingProgress.strugglingSteps, stepNumber]
        }
      }));
    }
    
    console.log('[EnhancedConversationMemory] Help requested:', question);
  }, []);

  // Adaptive guidance based on user performance
  const getAdaptiveGuidance = useCallback(() => {
    const { strugglingSteps, helpRequests, avgStepTime } = context.cookingProgress;
    const currentStepIndex = context.currentStep - 1;
    
    let guidanceLevel: 'minimal' | 'standard' | 'detailed' = 'standard';
    
    // If user struggles with current step type before
    if (strugglingSteps.includes(context.currentStep)) {
      guidanceLevel = 'detailed';
    }
    
    // If user asks for help frequently
    if (helpRequests > 3) {
      guidanceLevel = 'detailed';
    }
    
    // If user is moving quickly through steps
    if (avgStepTime > 0 && avgStepTime < 30000) { // Less than 30 seconds per step
      guidanceLevel = 'minimal';
    }
    
    return {
      guidanceLevel,
      shouldProvideExtraEncouragement: strugglingSteps.length > 2,
      shouldSlowDown: avgStepTime > 0 && avgStepTime > 180000, // More than 3 minutes per step
      recommendedVoiceSpeed: avgStepTime > 120000 ? 0.9 : 1.0
    };
  }, [context]);

  // Generate contextual prompt for AI responses
  const getContextualPrompt = useCallback(() => {
    const { conversationPhase, currentStep, interruptionCount, cookingProgress } = context;
    const adaptiveGuidance = getAdaptiveGuidance();
    
    let prompt = `You are ${mama.name}, a ${mama.accent} cooking teacher. `;
    
    // Phase-specific context
    if (conversationPhase === 'pre-cooking') {
      prompt += `The user is asking about ${recipe.title} before cooking. Share cultural stories, explain ingredients, and build excitement. `;
    } else if (conversationPhase === 'cooking') {
      prompt += `The user is cooking ${recipe.title}, currently on step ${currentStep} of ${recipe.instructions.length}. `;
      
      // Adaptive guidance integration
      if (adaptiveGuidance.guidanceLevel === 'detailed') {
        prompt += `Provide detailed, step-by-step guidance as the user needs extra help. `;
      } else if (adaptiveGuidance.guidanceLevel === 'minimal') {
        prompt += `Keep instructions concise as the user is experienced and moving quickly. `;
      }
      
      // Struggling context
      if (cookingProgress.strugglingSteps.includes(currentStep)) {
        prompt += `The user struggled with this step before. Be extra patient and provide detailed guidance. `;
      }
      
      // Encouragement context
      if (adaptiveGuidance.shouldProvideExtraEncouragement) {
        prompt += `The user seems to be having difficulty. Provide extra encouragement and reassurance. `;
      }
    }
    
    // Interruption handling
    if (interruptionCount > 2) {
      prompt += `The user has interrupted ${interruptionCount} times - they might be overwhelmed. Be calm and supportive. `;
    }
    
    prompt += `Respond in character with your ${mama.accent} personality and accent. Keep responses conversational and culturally authentic.`;
    
    return prompt;
  }, [context, mama, recipe, getAdaptiveGuidance]);

  // Load context from localStorage on component mount
  useEffect(() => {
    const savedContext = localStorage.getItem('cooking_context');
    if (savedContext) {
      try {
        const parsedContext = JSON.parse(savedContext);
        if (parsedContext.recipe.id === recipe.id) {
          setContext(parsedContext);
          console.log('[EnhancedConversationMemory] Restored saved context');
        }
      } catch (error) {
        console.warn('[EnhancedConversationMemory] Failed to restore context:', error);
      }
    }
  }, [recipe.id]);

  return {
    context,
    currentSession,
    updateContext,
    startCookingSession,
    markStepComplete,
    requestHelp,
    getAdaptiveGuidance,
    getContextualPrompt,
    
    // New convenience methods
    isUserStruggling: () => context.cookingProgress.strugglingSteps.length > 2,
    shouldProvideDetailedGuidance: () => getAdaptiveGuidance().guidanceLevel === 'detailed',
    getCookingSessionStats: () => currentSession,
    resetSession: () => {
      setCurrentSession(null);
      localStorage.removeItem('cooking_context');
    }
  };
};
