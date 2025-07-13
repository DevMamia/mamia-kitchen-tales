import { useState, useCallback } from 'react';
import { Recipe } from '@/data/recipes';
import { Mama } from '@/data/mamas';

interface ConversationContext {
  recipe: Recipe;
  mama: Mama;
  currentStep: number;
  conversationPhase: 'pre-cooking' | 'cooking';
  interruptionCount: number;
  lastUserInput: string;
  cookingProgress: {
    completedSteps: number[];
    strugglingSteps: number[];
    userQuestions: string[];
  };
}

export const useConversationMemory = (recipe: Recipe, mama: Mama) => {
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
      userQuestions: []
    }
  });

  const updateContext = useCallback((updates: Partial<ConversationContext>) => {
    setContext(prev => ({ ...prev, ...updates }));
  }, []);

  const startCookingPhase = useCallback((step: number) => {
    updateContext({
      conversationPhase: 'cooking',
      currentStep: step,
      interruptionCount: 0
    });
  }, [updateContext]);

  const handleInterruption = useCallback(() => {
    setContext(prev => ({
      ...prev,
      interruptionCount: prev.interruptionCount + 1
    }));
  }, []);

  const addUserQuestion = useCallback((question: string) => {
    setContext(prev => ({
      ...prev,
      lastUserInput: question,
      cookingProgress: {
        ...prev.cookingProgress,
        userQuestions: [...prev.cookingProgress.userQuestions, question]
      }
    }));
  }, []);

  const markStepComplete = useCallback((stepNumber: number) => {
    setContext(prev => ({
      ...prev,
      cookingProgress: {
        ...prev.cookingProgress,
        completedSteps: [...prev.cookingProgress.completedSteps, stepNumber]
      }
    }));
  }, []);

  const markStepStruggling = useCallback((stepNumber: number) => {
    setContext(prev => ({
      ...prev,
      cookingProgress: {
        ...prev.cookingProgress,
        strugglingSteps: [...prev.cookingProgress.strugglingSteps, stepNumber]
      }
    }));
  }, []);

  const getContextualPrompt = useCallback(() => {
    const { conversationPhase, currentStep, interruptionCount, cookingProgress } = context;
    
    let prompt = `You are ${mama.name}, a ${mama.accent} cooking teacher. `;
    
    if (conversationPhase === 'pre-cooking') {
      prompt += `The user is asking about ${recipe.title} before cooking. Share cultural stories, explain ingredients, and build excitement. `;
    } else {
      prompt += `The user is cooking ${recipe.title}, currently on step ${currentStep}. `;
      
      if (interruptionCount > 2) {
        prompt += `The user has interrupted you ${interruptionCount} times - they might be struggling. Be extra encouraging. `;
      }
      
      if (cookingProgress.strugglingSteps.includes(currentStep)) {
        prompt += `The user previously struggled with this step. Provide extra guidance. `;
      }
    }
    
    prompt += `Respond in character with your ${mama.accent} personality and accent. Keep responses conversational and encouraging.`;
    
    return prompt;
  }, [context, mama, recipe]);

  return {
    context,
    updateContext,
    startCookingPhase,
    handleInterruption,
    addUserQuestion,
    markStepComplete,
    markStepStruggling,
    getContextualPrompt
  };
};