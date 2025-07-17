import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ConversationEntry {
  timestamp: number;
  phase: 'pre-cooking' | 'cooking';
  mama: string;
  content: string;
  type: 'user' | 'mama';
}

interface UserPreferences {
  cooking_level?: string;
  dietary_preferences?: string[];
  favorite_techniques?: string[];
  cooking_achievements?: string[];
}

export const useConversationMemory = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const getConversationKey = useCallback((recipeId: string) => {
    return `conversation:${user?.id}:${recipeId}`;
  }, [user?.id]);

  const getUserKey = useCallback(() => {
    return `user_context:${user?.id}`;
  }, [user?.id]);

  const saveConversationEntry = useCallback(async (
    recipeId: string,
    entry: Omit<ConversationEntry, 'timestamp'>
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('upstash-cache', {
        body: {
          action: 'append',
          key: getConversationKey(recipeId),
          value: entry,
          ttl: 86400 // 24 hours
        }
      });

      if (error) {
        console.error('Failed to save conversation entry:', error);
      }
    } catch (error) {
      console.error('Error saving conversation entry:', error);
    }
  }, [user, getConversationKey]);

  const getConversationHistory = useCallback(async (recipeId: string): Promise<ConversationEntry[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase.functions.invoke('upstash-cache', {
        body: {
          action: 'get',
          key: getConversationKey(recipeId)
        }
      });

      if (error) {
        console.error('Failed to get conversation history:', error);
        return [];
      }

      return data?.data || [];
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return [];
    }
  }, [user, getConversationKey]);

  const saveUserPreferences = useCallback(async (preferences: UserPreferences) => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('upstash-cache', {
        body: {
          action: 'set',
          key: getUserKey(),
          value: preferences,
          ttl: 2592000 // 30 days
        }
      });

      if (error) {
        console.error('Failed to save user preferences:', error);
      }
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }, [user, getUserKey]);

  const getUserPreferences = useCallback(async (): Promise<UserPreferences | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('upstash-cache', {
        body: {
          action: 'get',
          key: getUserKey()
        }
      });

      if (error) {
        console.error('Failed to get user preferences:', error);
        return null;
      }

      return data?.data || null;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }, [user, getUserKey]);

  const clearConversationHistory = useCallback(async (recipeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('upstash-cache', {
        body: {
          action: 'clear',
          key: getConversationKey(recipeId)
        }
      });

      if (error) {
        console.error('Failed to clear conversation history:', error);
      }
    } catch (error) {
      console.error('Error clearing conversation history:', error);
    }
  }, [user, getConversationKey]);

  const getContextSummary = useCallback(async (recipeId: string) => {
    const history = await getConversationHistory(recipeId);
    const preferences = await getUserPreferences();

    // Get recent conversation context (last 10 entries)
    const recentContext = history.slice(-10).map(entry => ({
      type: entry.type,
      content: entry.content.substring(0, 200), // Truncate for context
      phase: entry.phase
    }));

    return {
      recentConversation: recentContext,
      userPreferences: preferences,
      conversationCount: history.length
    };
  }, [getConversationHistory, getUserPreferences]);

  // Cooking phase management
  const startCookingPhase = useCallback(async (initialStep: number) => {
    if (!user) return;
    
    await saveConversationEntry('cooking-session', {
      phase: 'cooking',
      mama: 'system',
      content: `Started cooking at step ${initialStep}`,
      type: 'mama'
    });
  }, [saveConversationEntry, user]);

  const markStepComplete = useCallback(async (stepNumber: number) => {
    if (!user) return;
    
    await saveConversationEntry('cooking-session', {
      phase: 'cooking',
      mama: 'system',
      content: `Completed step ${stepNumber}`,
      type: 'mama'
    });
  }, [saveConversationEntry, user]);

  const markStepStruggling = useCallback(async (stepNumber: number) => {
    if (!user) return;
    
    await saveConversationEntry('cooking-session', {
      phase: 'cooking',
      mama: 'system',
      content: `User needs help with step ${stepNumber}`,
      type: 'user'
    });
  }, [saveConversationEntry, user]);

  const addUserQuestion = useCallback(async (question: string) => {
    if (!user) return;
    
    await saveConversationEntry('cooking-session', {
      phase: 'cooking',
      mama: 'user',
      content: question,
      type: 'user'
    });
  }, [saveConversationEntry, user]);

  const handleInterruption = useCallback(async () => {
    if (!user) return;
    
    await saveConversationEntry('cooking-session', {
      phase: 'cooking',
      mama: 'system',
      content: 'Cooking interrupted by user',
      type: 'user'
    });
  }, [saveConversationEntry, user]);

  return {
    saveConversationEntry,
    getConversationHistory,
    saveUserPreferences,
    getUserPreferences,
    clearConversationHistory,
    getContextSummary,
    startCookingPhase,
    markStepComplete,
    markStepStruggling,
    addUserQuestion,
    handleInterruption,
    isLoading
  };
};