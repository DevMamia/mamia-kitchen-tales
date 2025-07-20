import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, Upload, X, Settings, ChefHat, Crown, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceStatusIndicator } from '@/components/VoiceStatusIndicator';
import { EnhancedCookingTimer } from '@/components/EnhancedCookingTimer';
import { PreCookingChat } from '@/components/PreCookingChat';
import { ContextAwareVoiceIndicator } from '@/components/ContextAwareVoiceIndicator';
import { SmartVoiceCommandSuggestions } from '@/components/SmartVoiceCommandSuggestions';
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
  const [photoMode, setPhotoMode] = useState(false);
  const [optimizedTips, setOptimizedTips] = useState<Record<number, TipPlacement>>({});
  const [hasSpokenCurrentStep, setHasSpokenCurrentStep] = useState(false);

  // Add new state for photo mode
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);

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
    showWakeWordPrompt,
    wakeWordPrompt,
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
      console.log('[EnhancedCook] Optimized tip placements:', optimized);
      return optimized;
    }
    return {};
  }, [recipeData]);

  // Initialize services
  useEffect(() => {
    if (recipeData) {
      // Configure unified conversation service
      unifiedConversation.updateConfig({
        mamaId: recipeData.mama.voiceId,
        recipeContext: recipeData.recipe.title,
        currentStep,
        userSkillLevel: 'intermediate',
        culturalContext: true
      });

      // Configure voice command service
      voiceCommandService.updateContext({
        currentStep,
        totalSteps: recipeData.recipe.instructions.length,
        cookingPhase: conversationPhase,
        mamaId: recipeData.mama.voiceId,
        strugglingSteps: conversationMemory?.context.cookingProgress.strugglingSteps || [],
        recentCommands: []
      });

      // Update context-aware voice
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

  // Callback functions
  const handleStartCooking = useCallback(async () => {
    if (!recipeData) return;
    
    console.log('[EnhancedCook] Starting enhanced cooking mode');
    setConversationPhase('cooking');
    setVoicePhase('cooking');
    conversationMemory?.startCookingSession();
    
    // Enhanced welcome message with cultural flair
    try {
      const welcomeMessage = getEnhancedWelcomeMessage(recipeData.mama.accent, recipeData.recipe.title);
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
    
    console.log('[EnhancedCook] Processing voice command:', command);
    
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
          
        case 'emergency_help':
          conversationMemory?.requestHelp(command, currentStep);
          const emergencyResponse = await unifiedConversation.handleUserInput(
            `Emergency help needed: ${command}`, 
            { priority: 'high' }
          );
          await speakWithContext(emergencyResponse, { priority: 'high', interruption: true });
          break;
          
        case 'timing_question':
        case 'temperature_question':
        case 'substitution_question':
          const queryResponse = await unifiedConversation.handleUserInput(command, { priority: 'normal' });
          await speakWithContext(queryResponse, { priority: 'normal', contextual: true });
          break;
          
        case 'positive_feedback':
          const encouragementResponse = getEncouragementResponse(recipeData.mama.accent);
          await speakWithContext(encouragementResponse, { priority: 'normal' });
          break;
          
        case 'cultural_story':
          const storyResponse = getCulturalStoryResponse(recipeData.mama.accent, recipeData.recipe.title);
          await speakWithContext(storyResponse, { priority: 'normal', contextual: true });
          break;
          
        default:
          // Handle as general conversation
          const generalResponse = await unifiedConversation.handleUserInput(command);
          await speakWithContext(generalResponse, { contextual: true });
      }
    } else {
      // No specific command found, handle as conversation
      conversationMemory?.requestHelp(command, currentStep);
      const conversationResponse = await unifiedConversation.handleUserInput(command);
      await speakWithContext(conversationResponse, { contextual: true });
    }
  }, [currentStep, conversationMemory, optimizedTips, speakContextualInstruction, speakWithContext, unifiedConversation, voiceCommandService, recipeData]);

  const handleTimerComplete = useCallback((stepNumber: number, timerName: string) => {
    console.log(`[EnhancedCook] Timer completed: ${timerName} for step ${stepNumber}`);
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

  // Update the existing handlePhotoShare callback
  const handlePhotoCaptureClose = useCallback(() => {
    setShowPhotoCapture(false);
  }, []);

  // Enhanced voice current step with cooking instruction method
  useEffect(() => {
    if (conversationPhase === 'cooking' && recipeData && !hasSpokenCurrentStep && voiceInitialized) {
      const speakCurrentStep = async () => {
        console.log(`[EnhancedCook] Speaking enhanced cooking instruction for step ${currentStep}`);
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

  // Update optimized tips state
  useEffect(() => {
    setOptimizedTips(memoizedOptimizedTips);
  }, [memoizedOptimizedTips]);

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
                      Enhanced experience with {mama?.name} {mama?.emoji} • {recipe.cookingTime}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Crown className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-orange-600">Enhanced Voice • Smart Tips • Cultural Stories</span>
                    </div>
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

  // Create cooking context after recipe data is available
  const cookingContext = conversationPhase === 'pre-cooking' ? 'pre_cooking' : 
                         conversationPhase === 'cooking' ? 'active_cooking' : 'completed';

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

  // Enhanced cooking interface
  const currentInstruction = recipe.instructions[currentStep - 1];
  const currentStepTimer = recipe.stepTimers?.[currentStep - 1];
  const currentStepTip = optimizedTips[currentStep];
  const fallbackTip = recipe.voiceTips && recipe.voiceTips.length > 0 && currentStep >= Math.ceil(totalSteps / 2)
    ? recipe.voiceTips[(currentStep - Math.ceil(totalSteps / 2)) % recipe.voiceTips.length]
    : null;

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
              onClick={() => {}}
            >
              Tap to interrupt
            </Button>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
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
            onClick={() => currentStep < totalSteps && setCurrentStep(currentStep + 1)}
            disabled={currentStep === totalSteps}
            variant="outline"
            size="lg"
          >
            Next
            <ChevronRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getEnhancedWelcomeMessage(accent: string, recipeName: string): string {
  switch (accent) {
    case 'Italian':
      return `Perfetto! Let's create beautiful ${recipeName} together, tesoro! I'll guide you every step of the way with my special tips and stories from Nonna's kitchen!`;
    case 'Mexican':
      return `¡Órale! We're going to make delicious ${recipeName}, mijo! I'll share all my secrets and help you cook like a true mexicana!`;
    case 'Thai':
      return `Wonderful! Let's prepare amazing ${recipeName} together, dear! I'll teach you the Thai way with mindfulness and beautiful flavors!`;
    default:
      return `Let's start cooking this wonderful ${recipeName} together! I'm here to guide you with love and wisdom!`;
  }
}

function getEncouragementResponse(accent: string): string {
  const responses = {
    Italian: [
      "Bravissimo! You're cooking with such passion, just like a true Italian!",
      "Madonna! Your cooking spirit is beautiful! Keep going, tesoro!",
      "Perfetto! I can feel the amore you're putting into every step!"
    ],
    Mexican: [
      "¡Qué bueno! You're cooking with your heart, just like Abuela taught you!",
      "¡Órale! Your sazón is getting stronger with every dish, mijo!",
      "¡Perfecto! You have the gift of good hands in the kitchen!"
    ],
    Thai: [
      "Sabai! Your cooking energy is so positive and mindful!",
      "Excellent! You're finding the balance and harmony in each step!",
      "Beautiful! Your patience and care show in every movement!"
    ]
  };

  const accentResponses = responses[accent as keyof typeof responses] || responses.Italian;
  return accentResponses[Math.floor(Math.random() * accentResponses.length)];
}

function getCulturalStoryResponse(accent: string, recipeName: string): string {
  switch (accent) {
    case 'Italian':
      return `Ah, ${recipeName}! This reminds me of my nonna in Tuscany. She used to say that every grain of pasta carries the love of the famiglia who makes it. This recipe has been passed down through generations of Italian mammas, each adding their own touch of amore!`;
    case 'Mexican':
      return `¡Ay, ${recipeName}! This takes me back to my pueblo in Michoacán. My abuela would wake up before dawn to prepare the masa, and the whole neighborhood would smell the magic happening in our cocina. Each family has their secret, but the love is always the same!`;
    case 'Thai':
      return `Ah, ${recipeName}! In Thailand, we believe that cooking is meditation in motion. My grandmother taught me that each ingredient has its own spirit, and when we cook with mindfulness and respect, the flavors dance together in perfect harmony. This recipe connects us to centuries of Thai wisdom!`;
    default:
      return `This ${recipeName} has such a wonderful story! It's been lovingly prepared by families for generations, each cook adding their own special touch while keeping the tradition alive!`;
  }
}

function getPhotoSharingResponse(accent: string): string {
  switch (accent) {
    case 'Italian':
      return "Madonna! Show me your beautiful creation, tesoro! I want to see how magnifico it looks! Maybe we can add a little extra touch to make it even more perfetto!";
    case 'Mexican':
      return "¡Órale! Let me see your masterpiece, mijo! I'm so excited to see how beautiful your dish looks! Maybe Abuela has some extra consejos to make it even better!";
    case 'Thai':
      return "Wonderful! Please show me your creation, dear! I'd love to see the colors and textures. Perhaps we can add some final touches to make it even more beautiful!";
    default:
      return "I'm so excited to see how your dish is coming along! Show me your progress and I'll help you make it even better!";
  }
}

export default EnhancedCook;
