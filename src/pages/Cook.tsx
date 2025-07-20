import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, X, ChefHat } from 'lucide-react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { CookingTimer } from '@/components/CookingTimer';
import { PreCookingChat } from '@/components/PreCookingChat';
import { getRecipeWithMama, recipes } from '@/data/recipes';
import { getMamaById } from '@/data/mamas';
import { useEnhancedVoiceService } from '@/hooks/useEnhancedVoiceService';
import { useConversationMemory } from '@/hooks/useConversationMemory';
import { useUserTier } from '@/hooks/useUserTier';
import { useAuth } from '@/contexts/AuthContext';
import { ConversationAgentService } from '@/services/conversationAgentService';
import { TipAnalyzerService, TipPlacement } from '@/services/tipAnalyzerService';

const Cook = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [conversationPhase, setConversationPhase] = useState<'pre-cooking' | 'cooking'>('pre-cooking');
  const [currentStep, setCurrentStep] = useState(1);
  const [timerExpanded, setTimerExpanded] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [agentService] = useState(() => new ConversationAgentService());
  const [optimizedTips, setOptimizedTips] = useState<Record<number, TipPlacement>>({});
  const [hasSpokenCurrentStep, setHasSpokenCurrentStep] = useState(false);

  // Enhanced voice service
  const { 
    speak, 
    speakGreeting, 
    speakCookingInstruction, 
    setConversationPhase: setVoicePhase, 
    isPlaying, 
    voiceStatus: enhancedVoiceStatus,
    isInitialized: voiceInitialized,
    stopSpeaking,
    clearQueue
  } = useEnhancedVoiceService();

  const { user } = useAuth();
  const { isPremium, voiceMode, incrementUsage, hasUsageLeft } = useUserTier();
  const elevenlabsConversation = useConversation();

  // Memoize recipe data
  const recipeData = useMemo(() => {
    return recipeId ? getRecipeWithMama(recipeId) : null;
  }, [recipeId]);
  
  // Always call useConversationMemory hook
  const dummyRecipe = { id: '', title: '', instructions: [], stepVoiceTips: {}, voiceTips: [], stepTimers: [] } as any;
  const dummyMama = { id: 0, name: '', emoji: '', accent: '', voiceId: '' } as any;
  
  const conversationMemory = useConversationMemory(
    recipeData?.recipe || dummyRecipe,
    recipeData?.mama || dummyMama
  );
  
  // Optimize tip placements
  const memoizedOptimizedTips = useMemo(() => {
    if (recipeData?.recipe) {
      const optimized = TipAnalyzerService.optimizeTipPlacements(
        recipeData.recipe.stepVoiceTips,
        recipeData.recipe.instructions
      );
      return optimized;
    }
    return {};
  }, [recipeData]);

  // Callback functions
  const handleStartCooking = useCallback(async () => {
    if (!recipeData) return;
    
    setConversationPhase('cooking');
    setVoicePhase('cooking');
    conversationMemory?.startCookingPhase(currentStep);
    
    // Initialize agent service for premium users
    if (isPremium && voiceMode === 'conversational' && hasUsageLeft) {
      agentService.initialize(elevenlabsConversation);
      incrementUsage();
    }
    
    // Enhanced welcome message
    try {
      await speak("Let's begin our cooking journey together!", recipeData.mama.voiceId, {
        priority: 'high',
        source: 'instant'
      });
    } catch (error) {
      console.error('[Cook] Failed to speak cooking welcome:', error);
    }
  }, [conversationMemory, currentStep, isPremium, voiceMode, hasUsageLeft, agentService, elevenlabsConversation, incrementUsage, speak, setVoicePhase, recipeData]);

  const handleTimerComplete = useCallback(() => {
    setTimerCompleted(true);
  }, []);

  const handleVoiceCommand = useCallback((command: string) => {
    if (!recipeData) return;
    
    const lowerCommand = command.toLowerCase();
    const stepTip = optimizedTips[currentStep];
    const totalSteps = recipeData.recipe.instructions.length;
    
    if (lowerCommand.includes('next') || lowerCommand.includes('next step')) {
      if (currentStep < totalSteps) {
        conversationMemory?.markStepComplete(currentStep);
        setCurrentStep(currentStep + 1);
        setTimerCompleted(false);
      }
      return;
    }
    
    if (lowerCommand.includes('back') || lowerCommand.includes('previous') || lowerCommand.includes('go back')) {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        setTimerCompleted(false);
      }
      return;
    }
    
    if (lowerCommand.includes('repeat') || lowerCommand.includes('repeat that')) {
      const instruction = recipeData.recipe.instructions[currentStep - 1];
      speakCookingInstruction(instruction, recipeData.mama.voiceId, currentStep, stepTip?.tip);
      return;
    }
    
    if (lowerCommand.includes('help') || lowerCommand.includes('confused') || lowerCommand.includes('stuck')) {
      conversationMemory?.markStepStruggling(currentStep);
      
      if (!isPremium || voiceMode === 'tts') {
        let helpMessage = `Don't worry! Take your time with step ${currentStep}. Let me repeat: ${recipeData.recipe.instructions[currentStep - 1]}`;
        
        if (stepTip) {
          helpMessage += ` Here's my special tip: ${stepTip.tip}`;
        }
        
        speak(helpMessage, recipeData.mama.voiceId, {
          priority: 'high',
          source: 'instant'
        });
      }
      return;
    }
    
    if (isPremium && voiceMode === 'conversational') {
      console.log('[Cook] Conversational query handled by agent:', command);
    } else {
      conversationMemory?.addUserQuestion(command);
      console.log('[Cook] Voice command logged for basic user:', command);
    }
  }, [currentStep, conversationMemory, optimizedTips, speakCookingInstruction, speak, isPremium, voiceMode, recipeData]);

  // Update optimized tips state
  useEffect(() => {
    setOptimizedTips(memoizedOptimizedTips);
  }, [memoizedOptimizedTips]);

  // Store current recipe in localStorage
  useEffect(() => {
    if (recipeId && recipeData) {
      localStorage.setItem('lastCookingRecipe', recipeId);
    }
  }, [recipeId, recipeData]);

  // Enhanced voice current step with cooking instruction method
  useEffect(() => {
    if (conversationPhase === 'cooking' && recipeData && !hasSpokenCurrentStep && voiceInitialized) {
      const speakCurrentStep = async () => {
        const instruction = recipeData.recipe.instructions[currentStep - 1];
        const currentStepTip = optimizedTips[currentStep];
        
        try {
          await speakCookingInstruction(
            instruction,
            recipeData.mama.voiceId,
            currentStep,
            currentStepTip?.tip
          );
          setHasSpokenCurrentStep(true);
        } catch (error) {
          console.error('[Cook] Failed to speak current step:', error);
        }
      };

      const timer = setTimeout(speakCurrentStep, 800);
      return () => clearTimeout(timer);
    }
  }, [conversationPhase, currentStep, recipeData, optimizedTips, hasSpokenCurrentStep, voiceInitialized, speakCookingInstruction]);

  // Reset spoken flag when step changes
  useEffect(() => {
    setHasSpokenCurrentStep(false);
  }, [currentStep]);

  // Keep screen awake in cooking mode
  useEffect(() => {
    let wakeLock: any = null;

    if (conversationPhase === 'cooking' && 'wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then((lock) => {
        wakeLock = lock;
      }).catch(() => {
        // Wake lock failed, but continue anyway
      });
    }

    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [conversationPhase]);

  // Handle no recipe ID
  if (!recipeId) {
    return (
      <div className="min-h-[calc(100vh-8rem)] p-6">
        <div className="text-center mb-8">
          <ChefHat size={64} className="mx-auto mb-4 text-orange-500" />
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Choose a Recipe to Cook
          </h1>
          <p className="text-lg text-muted-foreground">
            Select from your collection to start cooking
          </p>
        </div>

        <div className="grid gap-4 max-w-2xl mx-auto">
          {recipes.map((recipe) => {
            const mama = getMamaById(recipe.mamaId);
            return (
              <div
                key={recipe.id}
                onClick={() => navigate(`/cook/${recipe.id}`)}
                className="bg-card rounded-xl p-4 border border-border hover:border-orange-500 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-foreground group-hover:text-orange-500 transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      with {mama?.name} • {recipe.cookingTime}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  if (!recipeData) {
    return <div>Recipe not found</div>;
  }
  
  const { recipe, mama } = recipeData;
  const totalSteps = recipe.instructions.length;

  if (conversationPhase === 'pre-cooking') {
    return (
      <div className="min-h-[calc(100vh-8rem)]">
        <PreCookingChat
          recipe={recipe}
          mama={mama}
          onStartCooking={handleStartCooking}
        />
      </div>
    );
  }

  // Simplified cooking interface
  const currentInstruction = recipe.instructions[currentStep - 1];
  const currentStepTimer = recipe.stepTimers?.[currentStep - 1];
  const currentStepTip = optimizedTips[currentStep];

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background">
      {/* Simplified Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background sticky top-16 z-40">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X size={20} className="mr-2" />
          Exit
        </Button>
        
        <h1 className="text-lg font-heading font-semibold text-foreground">
          {mama?.name}'s Kitchen
        </h1>
        
        <div className="w-16" />
      </div>

      {/* Simple Progress Bar */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-muted-foreground">{recipe.cookingTime}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Simple Instruction Card */}
      <div className="p-4">
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border max-w-md mx-auto mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            {currentInstruction}
          </h2>
          
          {currentStepTimer && (
            <div className="bg-orange-50 rounded-lg p-3 mb-4 border border-orange-200">
              <p className="text-orange-700 font-medium">
                ⏰ {currentStepTimer.display}
              </p>
              {currentStepTimer.description && (
                <p className="text-orange-600 text-sm mt-1">
                  {currentStepTimer.description}
                </p>
              )}
            </div>
          )}

          {timerCompleted && (
            <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
              <p className="text-green-700 font-medium">
                ✅ Timer finished!
              </p>
            </div>
          )}
        </div>

        {/* Simple Tips Display */}
        {currentStepTip && (
          <div className="bg-yellow-50 rounded-lg p-4 mx-4 mb-6 border border-yellow-200">
            <div className="flex items-start gap-3">
              <div className="text-xl">{mama?.emoji}</div>
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">
                  {mama?.name}'s tip
                </h3>
                <p className="text-yellow-700">
                  "{currentStepTip.tip}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simple Voice Status */}
      <div className="px-4 mb-6">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="text-sm text-muted-foreground mb-2">
            Voice Status: {isPlaying ? `${mama.name} speaking...` : 'Ready'}
          </div>
          <div className="text-xs text-muted-foreground">
            Say "next step", "repeat", or "help me"
          </div>
        </div>
      </div>

      {/* Simple Controls */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            variant="outline"
            size="lg"
          >
            <ChevronLeft size={20} className="mr-2" />
            Previous
          </Button>

          <Button
            onClick={() => {
              const instruction = recipeData.recipe.instructions[currentStep - 1];
              const stepTip = optimizedTips[currentStep];
              speakCookingInstruction(instruction, recipeData.mama.voiceId, currentStep, stepTip?.tip);
            }}
            className="bg-orange-500 text-white hover:bg-orange-600"
            size="lg"
          >
            <Volume2 size={20} className="mr-2" />
            Repeat
          </Button>

          <Button
            onClick={() => currentStep < totalSteps && (setCurrentStep(currentStep + 1), setTimerCompleted(false))}
            disabled={currentStep === totalSteps}
            variant="outline"
            size="lg"
          >
            Next
            <ChevronRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Floating Timer */}
      <CookingTimer 
        isExpanded={timerExpanded}
        onToggle={() => setTimerExpanded(!timerExpanded)}
        suggestedTimer={currentStepTimer}
        onTimerComplete={handleTimerComplete}
      />
    </div>
  );
};

export default Cook;
