
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, Upload, X, Settings, ChefHat, Crown } from 'lucide-react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { VoiceStatusIndicator } from '@/components/VoiceStatusIndicator';
import { CookingTimer } from '@/components/CookingTimer';
import { ConversationInterface } from '@/components/ConversationInterface';
import { PreCookingChat } from '@/components/PreCookingChat';
import { EnhancedVoiceInterface } from '@/components/EnhancedVoiceInterface';
import { getRecipeWithMama, recipes } from '@/data/recipes';
import { getMamaById } from '@/data/mamas';
import { useVoice } from '@/hooks/useVoice';
import { useConversationMemory } from '@/hooks/useConversationMemory';
import { useUserTier } from '@/hooks/useUserTier';
import { useAuth } from '@/contexts/AuthContext';
import { ConversationAgentService } from '@/services/conversationAgentService';

const Cook = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [conversationPhase, setConversationPhase] = useState<'pre-cooking' | 'cooking'>('pre-cooking');
  const [currentStep, setCurrentStep] = useState(1);
  const [voiceStatus, setVoiceStatus] = useState<'speaking' | 'listening' | 'processing' | 'idle'>('idle');
  const [timerExpanded, setTimerExpanded] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [agentService] = useState(() => new ConversationAgentService());

  const { speak, isPlaying, config } = useVoice();
  const { user } = useAuth();
  const { isPremium, voiceMode, incrementUsage, hasUsageLeft } = useUserTier();
  const elevenlabsConversation = useConversation();

  // Find the recipe with mama info
  const recipeData = recipeId ? getRecipeWithMama(recipeId) : null;
  
  // Initialize conversation memory
  const conversationMemory = recipeData ? useConversationMemory(recipeData.recipe, recipeData.mama) : null;
  
  // Store current recipe in localStorage when entering cooking mode
  useEffect(() => {
    if (recipeId && recipeData) {
      localStorage.setItem('lastCookingRecipe', recipeId);
    }
  }, [recipeId, recipeData]);
  
  // If no recipe ID provided, show recipe selection
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

  const handleStartCooking = async () => {
    setConversationPhase('cooking');
    conversationMemory?.startCookingPhase(currentStep);
    
    // Initialize agent service for premium users with conversational mode
    if (isPremium && voiceMode === 'conversational' && hasUsageLeft) {
      agentService.initialize(elevenlabsConversation);
      incrementUsage();
    }
    
    // Play soft landing TTS for all users
    const instruction = recipe.instructions[0];
    const softLanding = `Ok let's begin! ${instruction}`;
    await speak(softLanding, mama.voiceId);
  };

  if (conversationPhase === 'pre-cooking') {
    // Phase 1: Pre-Cooking Chat Interface
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

  // Page 2: Full Cooking Interface
  const currentInstruction = recipe.instructions[currentStep - 1];
  const currentStepTimer = recipe.stepTimers?.[currentStep - 1];

  const handleTimerComplete = () => {
    setTimerCompleted(true);
    // Could add notification sound here
  };

  const handleStartConversation = async () => {
    if (!recipe || !mama) return;
    
    // For premium users with conversational mode
    if (isPremium && voiceMode === 'conversational' && hasUsageLeft) {
      const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'friend';
      const agentConfig = {
        mama,
        recipe,
        currentStep,
        userContext: {
          name: userName,
          cookingLevel: 'intermediate', // Could be fetched from user profile
        }
      };
      
      // Use a placeholder agent ID - in production this would be fetched from ElevenLabs
      const agentId = 'agent-' + mama.voiceId;
      await agentService.startConversation(agentConfig, agentId);
    }
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Universal voice commands for both tiers
    if (lowerCommand.includes('next') || lowerCommand.includes('next step')) {
      if (currentStep < totalSteps) {
        conversationMemory?.markStepComplete(currentStep);
        setCurrentStep(currentStep + 1);
        setTimerCompleted(false);
        
        // Update agent context for premium users
        if (isPremium && voiceMode === 'conversational') {
          agentService.updateCookingContext(currentStep + 1, recipe.instructions[currentStep]);
        }
        
        // Speak next step instruction
        setTimeout(() => {
          speak(recipe.instructions[currentStep], mama.voiceId);
        }, 500);
      }
      return;
    }
    
    if (lowerCommand.includes('back') || lowerCommand.includes('previous') || lowerCommand.includes('go back')) {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        setTimerCompleted(false);
        
        // Update agent context and speak previous step
        if (isPremium && voiceMode === 'conversational') {
          agentService.updateCookingContext(currentStep - 1, recipe.instructions[currentStep - 2]);
        }
        
        setTimeout(() => {
          speak(recipe.instructions[currentStep - 2], mama.voiceId);
        }, 500);
      }
      return;
    }
    
    if (lowerCommand.includes('repeat') || lowerCommand.includes('repeat that')) {
      speak(recipe.instructions[currentStep - 1], mama.voiceId);
      return;
    }
    
    if (lowerCommand.includes('help') || lowerCommand.includes('confused') || lowerCommand.includes('stuck')) {
      conversationMemory?.markStepStruggling(currentStep);
      
      // For basic users, provide helpful TTS
      if (!isPremium || voiceMode === 'tts') {
        const helpMessage = `Don't worry! Take your time with step ${currentStep}. ${recipe.instructions[currentStep - 1]} If you need more help, try asking a specific question.`;
        speak(helpMessage, mama.voiceId);
      }
      return;
    }
    
    // For premium conversational mode, let the agent handle the query
    if (isPremium && voiceMode === 'conversational') {
      // The ElevenLabs agent will handle this automatically
      console.log('[Cook] Conversational query handled by agent:', command);
    } else {
      // For basic users, store the question for conversation memory
      conversationMemory?.addUserQuestion(command);
      console.log('[Cook] Voice command logged for basic user:', command);
    }
  };

  const handleInterrupt = async () => {
    conversationMemory?.handleInterruption();
    
    // Stop both TTS and conversational AI
    if (isPremium && voiceMode === 'conversational') {
      await agentService.endConversation();
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-orange-50/20 to-background">
      {/* Header with Exit */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-16 z-40">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 text-lg"
        >
          <X size={20} className="mr-2" />
          Exit Cooking
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings size={20} />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="p-4 bg-background/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium text-foreground">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-muted-foreground">~{Math.ceil(totalSteps * 3 - currentStep * 3)} min left</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-orange-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Instruction Card */}
      <div className="p-4">
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border w-full max-w-md mx-auto mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-4 leading-tight">
            {currentInstruction}
          </h2>
          
          {/* Timer suggestion for current step */}
          {currentStepTimer && (
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3 mb-4">
              <p className="text-orange-700 dark:text-orange-300 font-medium text-lg">
                ⏰ This step takes {currentStepTimer.display}
              </p>
              <p className="text-orange-600 dark:text-orange-400 text-sm mt-1">
                {currentStepTimer.description}
              </p>
            </div>
          )}

          {/* Timer completion notification */}
          {timerCompleted && (
            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-green-700 dark:text-green-300 font-medium text-lg">
                ✅ Timer finished! Ready for the next step?
              </p>
            </div>
          )}
        </div>

        {/* Mama's Tips */}
        {recipe.voiceTips && recipe.voiceTips.length > 0 && currentStep >= Math.ceil(totalSteps / 2) && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 mx-4 mb-6 border-l-4 border-yellow-400">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{mama?.emoji}</div>
              <div>
                <h3 className="font-handwritten text-lg text-yellow-800 dark:text-yellow-200 mb-1">
                  Tip from {mama?.name}
                </h3>
                <p className="font-handwritten text-yellow-700 dark:text-yellow-300 text-lg leading-relaxed">
                  "{recipe.voiceTips[(currentStep - Math.ceil(totalSteps / 2)) % recipe.voiceTips.length]}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Enhanced Voice Interface */}
        <div className="px-4 mb-6">
          {isPremium && voiceMode === 'conversational' && hasUsageLeft ? (
            // Premium Conversational AI Interface
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Premium Voice Chat Active</span>
              </div>
              
              <div className="text-center">
                {agentService.getConversationStatus() === 'connected' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-foreground">
                        {agentService.isAgentSpeaking() ? `${mama.name} is speaking...` : 'Listening...'}
                      </span>
                    </div>
                    <Button
                      onClick={handleInterrupt}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      End Conversation
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleStartConversation}
                    className="w-full"
                  >
                    Start Conversation with {mama.name}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            // Basic TTS Interface  
            <div className="bg-muted/50 rounded-xl p-4 border">
              <div className="text-center">
                <div className="text-lg font-medium text-foreground mb-2">Voice Commands</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Say "next step", "repeat", "previous", or "help"
                </div>
                <div className="flex items-center justify-center gap-2">
                  {isPlaying ? (
                    <>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-sm text-primary">{mama.name} speaking...</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Ready to listen</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Voice Status Indicator */}
        <VoiceStatusIndicator className="justify-center" />

      {/* Controls */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => {
              const prevStep = Math.max(1, currentStep - 1);
              if (prevStep < currentStep) {
                setCurrentStep(prevStep);
                setTimerCompleted(false);
                // Speak the previous step instruction
                setTimeout(() => {
                  speak(recipe.instructions[prevStep - 1], mama.voiceId);
                }, 500);
              }
            }}
            disabled={currentStep === 1}
            variant="outline"
            className="text-lg py-6 px-8 min-h-[56px]"
          >
            <ChevronLeft size={24} className="mr-2" />
            Previous
          </Button>

          <Button
            onClick={() => speak(recipe.instructions[currentStep - 1], mama.voiceId)}
            className="bg-orange-500 text-white hover:bg-orange-600 text-lg py-6 px-8 min-h-[56px] rounded-xl"
          >
            <Volume2 size={24} className="mr-2" />
            Repeat
          </Button>

          <Button
            onClick={() => {
              const nextStep = Math.min(totalSteps, currentStep + 1);
              if (nextStep > currentStep) {
                setCurrentStep(nextStep);
                setTimerCompleted(false);
                // Speak the next step instruction
                setTimeout(() => {
                  speak(recipe.instructions[nextStep - 1], mama.voiceId);
                }, 500);
              }
            }}
            disabled={currentStep === totalSteps}
            variant="outline"
            className="text-lg py-6 px-8 min-h-[56px]"
          >
            Next
            <ChevronRight size={24} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-4 pb-6">
        <Button
          className="w-full bg-orange-500 text-white hover:bg-orange-600 text-xl py-6 rounded-2xl font-heading font-bold mb-4 min-h-[64px]"
        >
          <Upload size={24} className="mr-3" />
          Show {mama?.name} your progress
        </Button>
        
        <p className="text-center text-sm text-muted-foreground font-handwritten">
          Upload a photo if you're stuck on a step or want to show {mama?.name} how it looks!
        </p>
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
