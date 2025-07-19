import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceStatusIndicator } from '@/components/VoiceStatusIndicator';
import { CookingTimer } from '@/components/CookingTimer';
import { PreCookingChat } from '@/components/PreCookingChat';
import { getRecipeWithMama, recipes } from '@/data/recipes';
import { getMamaById } from '@/data/mamas';
import { useEnhancedVoiceService } from '@/hooks/useEnhancedVoiceService';
import { useConversationMemory } from '@/hooks/useConversationMemory';
import { useUserTier } from '@/hooks/useUserTier';
import { useAuth } from '@/contexts/AuthContext';
import { TipAnalyzerService, TipPlacement } from '@/services/tipAnalyzerService';

const Cook = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [conversationPhase, setConversationPhase] = useState<'pre-cooking' | 'cooking'>('pre-cooking');
  const [currentStep, setCurrentStep] = useState(1);
  const [hasSpokenCurrentStep, setHasSpokenCurrentStep] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [timerExpanded, setTimerExpanded] = useState(false);
  const [optimizedTips, setOptimizedTips] = useState<Record<number, TipPlacement>>({});

  // Enhanced voice service
  const { 
    speak, 
    speakGreeting, 
    speakCookingInstruction, 
    setConversationPhase: setVoicePhase, 
    isPlaying, 
    voiceStatus: enhancedVoiceStatus,
    isInitialized: voiceInitialized
  } = useEnhancedVoiceService();

  const { user } = useAuth();
  const { isPremium, voiceMode, incrementUsage, hasUsageLeft } = useUserTier();

  // Memoize recipe data
  const recipeData = useMemo(() => {
    return recipeId ? getRecipeWithMama(recipeId) : null;
  }, [recipeId]);
  
  // Conversation memory
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
      console.log('[Cook] Optimized tip placements:', optimized);
      return optimized;
    }
    return {};
  }, [recipeData]);

  const handleStartCooking = useCallback(async () => {
    if (!recipeData) return;
    
    console.log('[Cook] Starting cooking mode with enhanced voice');
    setConversationPhase('cooking');
    setVoicePhase('cooking');
    conversationMemory?.startCookingPhase(currentStep);
    
    // Enhanced welcome message
    try {
      const welcomeMessage = `Perfetto! Let's begin our cooking journey together!`;
      await speak(welcomeMessage, recipeData.mama.voiceId, {
        priority: 'high',
        source: 'instant'
      });
    } catch (error) {
      console.error('[Cook] Failed to speak cooking welcome:', error);
    }
  }, [conversationMemory, speak, setVoicePhase, recipeData, currentStep]);

  const handleVoiceCommand = useCallback(async (command: string) => {
    if (!recipeData) return;
    
    const stepTip = optimizedTips[currentStep];
    const instruction = recipeData.recipe.instructions[currentStep - 1];
    
    // Enhanced voice command handling
    if (command.toLowerCase().includes('next')) {
      if (currentStep < recipeData.recipe.instructions.length) {
        conversationMemory?.markStepComplete(currentStep);
        setCurrentStep(currentStep + 1);
        setTimerCompleted(false);
      }
    } else if (command.toLowerCase().includes('previous')) {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        setTimerCompleted(false);
      }
    } else if (command.toLowerCase().includes('repeat')) {
      speakCookingInstruction(instruction, recipeData.mama.voiceId, currentStep, stepTip?.tip);
    } else {
      // Handle as conversation
      console.log('[Cook] Voice command:', command);
    }
  }, [currentStep, conversationMemory, optimizedTips, speakCookingInstruction, recipeData]);

  const handleInterrupt = useCallback(() => {
    console.log('[Cook] Interrupt requested');
  }, []);

  const handleTimerComplete = useCallback(() => {
    setTimerCompleted(true);
    conversationMemory?.markStepComplete(currentStep);
  }, [conversationMemory, currentStep]);

  const handleSpeakAlert = useCallback(async (alertText: string) => {
    if (recipeData) {
      await speak(alertText, recipeData.mama.voiceId, {
        priority: 'high'
      });
    }
  }, [speak, recipeData]);

  const handleNavigatePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setTimerCompleted(false);
    }
  }, [currentStep]);

  const handleNavigateNext = useCallback(() => {
    if (currentStep < (recipeData?.recipe.instructions.length || 0)) {
      conversationMemory?.markStepComplete(currentStep);
      setCurrentStep(currentStep + 1);
      setTimerCompleted(false);
    }
  }, [currentStep, recipeData, conversationMemory]);

  const handleRepeat = useCallback(() => {
    if (!recipeData) return;
    const instruction = recipeData.recipe.instructions[currentStep - 1];
    const stepTip = optimizedTips[currentStep];
    console.log(`[Cook] Repeat button - Step ${currentStep}, has tip:`, !!stepTip);
    speakCookingInstruction(instruction, recipeData.mama.voiceId, currentStep, stepTip?.tip);
  }, [recipeData, currentStep, optimizedTips, speakCookingInstruction]);

  // Store current recipe for quick access
  useEffect(() => {
    if (recipeId) {
      localStorage.setItem('lastCookingRecipe', recipeId);
    }
  }, [recipeId]);

  // Enhanced voice current step with cooking instruction method
  useEffect(() => {
    if (conversationPhase === 'cooking' && recipeData && !hasSpokenCurrentStep && voiceInitialized) {
      const speakCurrentStep = async () => {
        console.log(`[Cook] Speaking cooking instruction for step ${currentStep}`);
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

  // Update optimized tips state
  useEffect(() => {
    setOptimizedTips(memoizedOptimizedTips);
  }, [memoizedOptimizedTips]);

  // Handle no recipe ID
  if (!recipeId) {
    return (
      <div className="min-h-[calc(100vh-8rem)] p-6">
        <div className="text-center mb-8">
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
                      with {mama?.name} {mama?.emoji} • {recipe.cookingTime}
                    </p>
                  </div>
                  <ChevronRight className="text-muted-foreground group-hover:text-orange-500 transition-colors" />
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

  // Clean cooking interface
  const currentInstruction = recipe.instructions[currentStep - 1];
  const currentStepTimer = recipe.stepTimers?.[currentStep - 1];

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background">
      {/* Simple Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          onClick={() => navigate('/recipes')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} className="mr-2" />
          {recipe.title}
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings size={20} />
        </Button>
      </div>

      {/* Simple Progress */}
      <div className="p-4">
        <div className="text-center mb-4">
          <h1 className="text-xl font-medium text-foreground">Cooking Mode</h1>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Step {currentStep} of {totalSteps}</p>
        </div>

        {/* Main Instruction */}
        <div className="bg-card rounded-lg p-4 mb-4 border border-border">
          <h2 className="text-lg font-medium text-foreground mb-2">
            {currentInstruction}
          </h2>
          
          {currentStepTimer && (
            <div className="bg-muted rounded-lg p-3 mb-3">
              <p className="text-sm text-foreground">
                ⏱️ {currentStepTimer.display} - {currentStepTimer.description}
              </p>
            </div>
          )}
        </div>

        {/* Voice Commands */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-700 dark:text-blue-300">Voice Commands</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">{mama?.name} speaking</p>
            </div>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleInterrupt}
            >
              Tap to interrupt
            </Button>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            onClick={handleNavigatePrevious}
            disabled={currentStep === 1}
            variant="outline"
            size="lg"
          >
            <ChevronLeft size={20} className="mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNavigateNext}
            disabled={currentStep === totalSteps}
            variant="outline"
            size="lg"
          >
            Next
            <ChevronRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Cooking Timer */}
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