import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, X, ChefHat, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedCookingTimer } from '@/components/EnhancedCookingTimer';
import { PreCookingChat } from '@/components/PreCookingChat';
import { MamaPhotoCapture } from '@/components/MamaPhotoCapture';
import { getRecipeWithMama, recipes } from '@/data/recipes';
import { getMamaById } from '@/data/mamas';
import { useEnhancedVoiceService } from '@/hooks/useEnhancedVoiceService';
import { useEnhancedConversationMemory } from '@/hooks/useEnhancedConversationMemory';
import { useContextAwareVoice } from '@/hooks/useContextAwareVoice';
import { useUserTier } from '@/hooks/useUserTier';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedConversationService } from '@/services/unifiedConversationService';
import { SmartVoiceCommandService } from '@/services/smartVoiceCommandService';
import { TipAnalyzerService, TipPlacement } from '@/services/tipAnalyzerService';

const EnhancedCook = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [conversationPhase, setConversationPhase] = useState<'pre-cooking' | 'cooking' | 'post-cooking'>('pre-cooking');
  const [currentStep, setCurrentStep] = useState(1);
  const [timerExpanded, setTimerExpanded] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [optimizedTips, setOptimizedTips] = useState<Record<number, TipPlacement>>({});
  const [hasSpokenCurrentStep, setHasSpokenCurrentStep] = useState(false);

  // Services
  const [unifiedConversation] = useState(() => UnifiedConversationService.getInstance());
  const [voiceCommandService] = useState(() => SmartVoiceCommandService.getInstance());

  // Enhanced voice service
  const { 
    speak, 
    speakGreeting, 
    speakCookingInstruction, 
    setConversationPhase: setVoicePhase, 
    isPlaying: isEnhancedPlaying, 
    voiceStatus: enhancedVoiceStatus,
    isInitialized: voiceInitialized,
    stopSpeaking,
    clearQueue
  } = useEnhancedVoiceService();

  // Context-aware voice
  const {
    updateContext: updateVoiceContext,
    speakWithContext,
    speakCookingInstruction: speakContextualInstruction,
    listeningState,
    isPlaying,
    queueLength,
    serviceStatus
  } = useContextAwareVoice();

  const { user } = useAuth();
  const { isPremium, voiceMode, incrementUsage, hasUsageLeft } = useUserTier();

  // Memoize recipe data
  const recipeData = useMemo(() => {
    return recipeId ? getRecipeWithMama(recipeId) : null;
  }, [recipeId]);
  
  // Enhanced conversation memory
  const dummyRecipe = { id: '', title: '', instructions: [], stepVoiceTips: {}, voiceTips: [], stepTimers: [] } as any;
  const dummyMama = { id: 0, name: '', emoji: '', accent: '', voiceId: '' } as any;
  
  const conversationMemory = useEnhancedConversationMemory(
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
    conversationMemory?.startCookingSession();
    
    try {
      const welcomeMessage = `Let's create beautiful ${recipeData.recipe.title} together! I'll guide you with my special tips and stories.`;
      await speakWithContext(welcomeMessage, {
        priority: 'high',
        contextual: true
      });
    } catch (error) {
      console.error('[EnhancedCook] Failed to speak cooking welcome:', error);
    }
  }, [conversationMemory, speakWithContext, setVoicePhase, recipeData]);

  const handleVoiceCommand = useCallback(async (command: string) => {
    if (!recipeData) return;
    
    const commandResult = voiceCommandService.processVoiceInput(command);
    
    if (commandResult.command) {
      switch (commandResult.command) {
        case 'next_step':
          if (currentStep < recipeData.recipe.instructions.length) {
            conversationMemory?.markStepComplete(currentStep);
            setCurrentStep(currentStep + 1);
            setTimerCompleted(false);
          }
          break;
          
        case 'previous_step':
          if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setTimerCompleted(false);
          }
          break;
          
        case 'repeat':
          const instruction = recipeData.recipe.instructions[currentStep - 1];
          const stepTip = optimizedTips[currentStep];
          await speakContextualInstruction(instruction, currentStep, stepTip?.tip);
          break;
          
        default:
          const queryResponse = await unifiedConversation.handleUserInput(command, { priority: 'normal' });
          await speakWithContext(queryResponse, { priority: 'normal', contextual: true });
      }
    } else {
      conversationMemory?.requestHelp(command, currentStep);
      const conversationResponse = await unifiedConversation.handleUserInput(command);
      await speakWithContext(conversationResponse, { contextual: true });
    }
  }, [currentStep, conversationMemory, optimizedTips, speakContextualInstruction, speakWithContext, unifiedConversation, voiceCommandService, recipeData]);

  const handleTimerComplete = useCallback((stepNumber: number, timerName: string) => {
    setTimerCompleted(true);
    
    if (stepNumber === currentStep) {
      conversationMemory?.markStepComplete(stepNumber);
    }
  }, [currentStep, conversationMemory]);

  const handleTimerAlert = useCallback(async (alertText: string, mamaId: string) => {
    try {
      await speakWithContext(alertText, { priority: 'high', interruption: false });
    } catch (error) {
      console.error('[EnhancedCook] Failed to speak timer alert:', error);
    }
  }, [speakWithContext]);

  const handlePhotoShare = useCallback(async () => {
    setShowPhotoCapture(true);
  }, []);

  const handlePhotoCaptureClose = useCallback(() => {
    setShowPhotoCapture(false);
  }, []);

  // Initialize services
  useEffect(() => {
    if (recipeData) {
      unifiedConversation.updateConfig({
        mamaId: recipeData.mama.voiceId,
        recipeContext: recipeData.recipe.title,
        currentStep,
        userSkillLevel: 'intermediate',
        culturalContext: true
      });

      voiceCommandService.updateContext({
        currentStep,
        totalSteps: recipeData.recipe.instructions.length,
        cookingPhase: conversationPhase,
        mamaId: recipeData.mama.voiceId,
        strugglingSteps: conversationMemory?.context.cookingProgress.strugglingSteps || [],
        recentCommands: []
      });

      updateVoiceContext({
        cookingContext: conversationPhase === 'pre-cooking' ? 'pre_cooking' : 
                       conversationPhase === 'cooking' ? 'active_cooking' : 'completed',
        currentStep,
        totalSteps: recipeData.recipe.instructions.length,
        mamaId: recipeData.mama.voiceId,
        recipeId: recipeData.recipe.id,
        userStruggling: conversationMemory?.isUserStruggling() || false
      });
    }
  }, [recipeData, currentStep, conversationPhase, unifiedConversation, voiceCommandService, updateVoiceContext, conversationMemory]);

  // Update optimized tips state
  useEffect(() => {
    setOptimizedTips(memoizedOptimizedTips);
  }, [memoizedOptimizedTips]);

  // Enhanced voice current step with cooking instruction method
  useEffect(() => {
    if (conversationPhase === 'cooking' && recipeData && !hasSpokenCurrentStep && voiceInitialized) {
      const speakCurrentStep = async () => {
        const instruction = recipeData.recipe.instructions[currentStep - 1];
        const currentStepTip = optimizedTips[currentStep];
        
        try {
          await speakContextualInstruction(instruction, currentStep, currentStepTip?.tip);
          setHasSpokenCurrentStep(true);
        } catch (error) {
          console.error('[EnhancedCook] Failed to speak current step:', error);
        }
      };

      const timer = setTimeout(speakCurrentStep, 800);
      return () => clearTimeout(timer);
    }
  }, [conversationPhase, currentStep, recipeData, optimizedTips, hasSpokenCurrentStep, voiceInitialized, speakContextualInstruction]);

  // Reset spoken flag when step changes
  useEffect(() => {
    setHasSpokenCurrentStep(false);
  }, [currentStep]);

  // Handle no recipe ID
  if (!recipeId) {
    return (
      <div className="min-h-[calc(100vh-8rem)] p-6">
        <div className="text-center mb-8">
          <ChefHat size={64} className="mx-auto mb-4 text-orange-500" />
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Enhanced Cooking Experience
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose a recipe to start your enhanced cooking journey
          </p>
        </div>

        <div className="grid gap-4 max-w-2xl mx-auto">
          {recipes.map((recipe) => {
            const mama = getMamaById(recipe.mamaId);
            return (
              <div
                key={recipe.id}
                onClick={() => navigate(`/enhanced-cook/${recipe.id}`)}
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
                      Enhanced experience with {mama?.name} • {recipe.cookingTime}
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

  // Simplified enhanced cooking interface
  const currentInstruction = recipe.instructions[currentStep - 1];
  const currentStepTimer = recipe.stepTimers?.[currentStep - 1];
  const currentStepTip = optimizedTips[currentStep];

  const getAudioStatus = () => {
    if (isPlaying || isEnhancedPlaying) return 'Talking';
    if (listeningState === 'always_listening' || listeningState === 'processing') return 'Listening';
    return 'Waiting';
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background pb-20">
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
            Enhanced Voice: {getAudioStatus()}
          </div>
          <div className="text-xs text-muted-foreground">
            Natural conversation and smart commands available
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
            onClick={async () => {
              const instruction = recipeData.recipe.instructions[currentStep - 1];
              const stepTip = optimizedTips[currentStep];
              await speakContextualInstruction(instruction, currentStep, stepTip?.tip);
            }}
            className="bg-orange-500 text-white hover:bg-orange-600"
            size="lg"
          >
            <Volume2 size={20} className="mr-2" />
            Guide Me
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

      {/* Photo Share Button */}
      <div className="px-4 mb-6">
        <Button
          onClick={handlePhotoShare}
          className="w-full bg-orange-500 text-white hover:bg-orange-600"
          size="lg"
        >
          <Camera size={20} className="mr-2" />
          Share Progress with {mama?.name}
        </Button>
      </div>

      {/* Fixed Audio Control at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3">
            <div className="text-sm font-medium text-foreground">
              Status of Audio - {mama?.name} {getAudioStatus()}
            </div>
            <div className={`w-3 h-3 rounded-full ${
              getAudioStatus() === 'Talking' ? 'bg-green-500 animate-pulse' :
              getAudioStatus() === 'Listening' ? 'bg-blue-500 animate-pulse' :
              'bg-gray-400'
            }`} />
          </div>
        </div>
      </div>

      {/* Enhanced Floating Timer */}
      <EnhancedCookingTimer 
        suggestedTimers={recipe.stepTimers}
        currentStep={currentStep}
        mamaId={mama.voiceId}
        onTimerComplete={handleTimerComplete}
        onSpeakAlert={handleTimerAlert}
        isExpanded={timerExpanded}
        onToggle={() => setTimerExpanded(!timerExpanded)}
      />

      {/* Photo Capture Modal */}
      {showPhotoCapture && recipeData && (
        <MamaPhotoCapture
          isOpen={showPhotoCapture}
          onClose={handlePhotoCaptureClose}
          recipeId={recipeData.recipe.id}
          currentStep={currentStep}
          mamaId={recipeData.mama.id.toString()}
          recipeName={recipeData.recipe.title}
        />
      )}
    </div>
  );
};

export default EnhancedCook;
