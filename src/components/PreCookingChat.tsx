
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChefHat, Sparkles, Play, MessageCircle } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { Mama } from '@/data/mamas';
import { useEnhancedVoiceService } from '@/hooks/useEnhancedVoiceService';

interface PreCookingChatProps {
  recipe: Recipe;
  mama: Mama;
  onStartCooking: () => void;
}

export const PreCookingChat = ({ recipe, mama, onStartCooking }: PreCookingChatProps) => {
  const [hasPlayedGreeting, setHasPlayedGreeting] = useState(false);
  const [isGreetingReady, setIsGreetingReady] = useState(false);
  
  const { 
    speakGreeting, 
    speak, 
    isPlaying, 
    voiceStatus, 
    isInitialized 
  } = useEnhancedVoiceService();

  // Play greeting when component mounts and voice is ready
  useEffect(() => {
    const playInitialGreeting = async () => {
      if (isInitialized && !hasPlayedGreeting && !isGreetingReady) {
        console.log('[PreCookingChat] Voice initialized, preparing greeting...');
        setIsGreetingReady(true);
        
        // Small delay to ensure everything is ready
        setTimeout(async () => {
          try {
            console.log(`[PreCookingChat] Playing greeting for ${mama.name} - ${recipe.title}`);
            await speakGreeting(mama.voiceId, recipe.title);
            setHasPlayedGreeting(true);
          } catch (error) {
            console.error('[PreCookingChat] Failed to play greeting:', error);
            // Fallback greeting
            try {
              await speak(`Welcome to ${mama.name}'s kitchen! Today we're making ${recipe.title}`, mama.voiceId, {
                priority: 'high',
                source: 'instant'
              });
              setHasPlayedGreeting(true);
            } catch (fallbackError) {
              console.error('[PreCookingChat] Fallback greeting also failed:', fallbackError);
            }
          }
        }, 1000);
      }
    };

    playInitialGreeting();
  }, [isInitialized, hasPlayedGreeting, isGreetingReady, speakGreeting, speak, mama, recipe]);

  const handlePlayGreeting = useCallback(async () => {
    try {
      console.log('[PreCookingChat] Manual greeting playback requested');
      await speakGreeting(mama.voiceId, recipe.title);
    } catch (error) {
      console.error('[PreCookingChat] Manual greeting failed:', error);
    }
  }, [speakGreeting, mama.voiceId, recipe.title]);

  const handleAskQuestion = useCallback(async (question: string) => {
    try {
      console.log(`[PreCookingChat] Asking question: ${question}`);
      
      // Generate contextual response based on the question
      let response = '';
      const lowerQuestion = question.toLowerCase();
      
      if (lowerQuestion.includes('ingredient') || lowerQuestion.includes('need')) {
        const ingredientCount = recipe.ingredients?.length || 0;
        response = `For this ${recipe.title}, you'll need ${ingredientCount} main ingredients. Let me tell you about the key ones: ${recipe.ingredients?.slice(0, 3).map(ing => ing.name).join(', ')}.`;
      } else if (lowerQuestion.includes('time') || lowerQuestion.includes('long')) {
        response = `This ${recipe.title} takes about ${recipe.cookingTime} total. It's perfect for ${recipe.category === 'QUICK' ? 'a quick meal' : recipe.category === 'WEEKEND' ? 'weekend cooking' : 'everyday cooking'}.`;
      } else if (lowerQuestion.includes('difficult') || lowerQuestion.includes('hard')) {
        response = `Don't worry, ${recipe.difficulty === 'EASY' ? "this recipe is very easy, perfect for beginners!" : recipe.difficulty === 'MEDIUM' ? "it's a medium difficulty recipe, but I'll guide you through each step!" : "it's a bit challenging, but together we can make something amazing!"}`;
      } else {
        // Generic encouraging response
        response = `That's a great question about ${recipe.title}! This is one of my favorite recipes to make. The secret is to cook with love and patience. Are you ready to start our cooking journey together?`;
      }
      
      await speak(response, mama.voiceId, {
        priority: 'high',
        source: 'instant'
      });
    } catch (error) {
      console.error('[PreCookingChat] Failed to answer question:', error);
    }
  }, [speak, mama.voiceId, recipe]);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-orange-50/30 to-background p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative mb-4">
          <div className="text-6xl mb-2">{mama.emoji}</div>
          <div className="absolute -top-2 -right-8">
            <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          {mama.name}'s Kitchen
        </h1>
        <p className="text-lg text-muted-foreground">
          Ready to cook {recipe.title} together?
        </p>
      </div>

      {/* Recipe Overview Card */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200">
        <div className="flex items-start gap-4">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="text-xl font-heading font-bold text-foreground mb-2">
              {recipe.title}
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium ml-2">{recipe.cookingTime}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Difficulty:</span>
                <span className="font-medium ml-2">{recipe.difficulty}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Serves:</span>
                <span className="font-medium ml-2">{recipe.servings}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium ml-2">{recipe.contentType}</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mt-4 font-handwritten text-lg leading-relaxed">
          "{recipe.description}"
        </p>
      </Card>

      {/* Voice Interaction Status */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${
            voiceStatus === 'ready' ? 'bg-green-500' :
            voiceStatus === 'fallback' ? 'bg-yellow-500' :
            voiceStatus === 'loading' ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'
          }`}></div>
          <span className="text-sm text-muted-foreground">
            {isPlaying ? `${mama.name} is speaking...` :
             voiceStatus === 'ready' ? `${mama.name} is ready to chat` :
             voiceStatus === 'fallback' ? 'Using backup voice system' :
             voiceStatus === 'loading' ? 'Loading voice system...' : 'Voice system unavailable'}
          </span>
        </div>

        {!hasPlayedGreeting && isInitialized && (
          <Button
            onClick={handlePlayGreeting}
            variant="outline"
            size="sm"
            className="mb-4"
          >
            <Play className="w-4 h-4 mr-2" />
            Play Greeting
          </Button>
        )}
      </div>

      {/* Quick Questions */}
      <Card className="p-4 mb-6">
        <h3 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Ask {mama.name}
        </h3>
        <div className="grid gap-2">
          <Button
            variant="ghost"
            className="justify-start h-auto p-3 text-left font-handwritten"
            onClick={() => handleAskQuestion("What ingredients do I need?")}
          >
            "What ingredients do I need?"
          </Button>
          <Button
            variant="ghost"
            className="justify-start h-auto p-3 text-left font-handwritten"
            onClick={() => handleAskQuestion("How long will this take?")}
          >
            "How long will this take?"
          </Button>
          <Button
            variant="ghost"
            className="justify-start h-auto p-3 text-left font-handwritten"
            onClick={() => handleAskQuestion("Is this recipe difficult?")}
          >
            "Is this recipe difficult?"
          </Button>
        </div>
      </Card>

      {/* Cultural Context */}
      {recipe.culturalContext && (
        <Card className="p-4 mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200">
          <h3 className="font-heading font-bold text-amber-800 dark:text-amber-200 mb-2">
            The Story Behind This Dish
          </h3>
          <p className="text-amber-700 dark:text-amber-300 font-handwritten text-lg leading-relaxed">
            {recipe.culturalContext}
          </p>
        </Card>
      )}

      {/* Start Cooking Button */}
      <div className="text-center">
        <Button
          onClick={onStartCooking}
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 text-white text-xl py-6 px-12 rounded-2xl font-heading font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <ChefHat className="w-6 h-6 mr-3" />
          Start Cooking with {mama.name}
        </Button>
        
        <p className="text-sm text-muted-foreground mt-4 font-handwritten">
          {mama.name} will guide you through every step with her voice!
        </p>
      </div>
    </div>
  );
};
