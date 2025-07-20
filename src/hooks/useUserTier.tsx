
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserTier = 'free' | 'premium' | 'family';
export type VoiceMode = 'tts' | 'conversational';

export interface UserTierData {
  tier: UserTier;
  isPremium: boolean;
  voiceMode: VoiceMode;
  usageCount: number;
  maxUsage: number;
  hasUsageLeft: boolean;
}

export const useUserTier = () => {
  const { user } = useAuth();
  const [tierData, setTierData] = useState<UserTierData>({
    tier: 'free',
    isPremium: false,
    voiceMode: 'tts',
    usageCount: 0,
    maxUsage: 5, // Premium users get 5 conversational sessions per day
    hasUsageLeft: true
  });

  useEffect(() => {
    const fetchUserTier = async () => {
      if (!user) {
        // Default to free tier for unauthenticated users
        setTierData(prev => ({ ...prev, tier: 'free', isPremium: false }));
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();

        const tier = (profile?.subscription_tier || 'free') as UserTier;
        const isPremium = tier === 'premium' || tier === 'family';
        
        // Get stored voice mode preference
        const storedMode = localStorage.getItem('voice_mode') as VoiceMode;
        const voiceMode = isPremium && storedMode ? storedMode : 'tts';
        
        // Get usage count for today (simplified - in production would track by date)
        const usageCount = parseInt(localStorage.getItem('daily_voice_usage') || '0');
        const maxUsage = isPremium ? 5 : 0;
        const hasUsageLeft = !isPremium || usageCount < maxUsage;

        setTierData({
          tier,
          isPremium,
          voiceMode,
          usageCount,
          maxUsage,
          hasUsageLeft
        });
      } catch (error) {
        console.error('Error fetching user tier:', error);
        setTierData(prev => ({ ...prev, tier: 'free', isPremium: false }));
      }
    };

    fetchUserTier();
  }, [user]);

  const setVoiceMode = (mode: VoiceMode) => {
    localStorage.setItem('voice_mode', mode);
    setTierData(prev => ({ ...prev, voiceMode: mode }));
  };

  const incrementUsage = () => {
    const newCount = tierData.usageCount + 1;
    localStorage.setItem('daily_voice_usage', newCount.toString());
    setTierData(prev => ({ 
      ...prev, 
      usageCount: newCount,
      hasUsageLeft: newCount < prev.maxUsage
    }));
  };

  return {
    ...tierData,
    setVoiceMode,
    incrementUsage
  };
};
