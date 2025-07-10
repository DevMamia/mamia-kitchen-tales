
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, Upload, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceStatusIndicator } from '@/components/VoiceStatusIndicator';
import { CookingTimer } from '@/components/CookingTimer';
import { recipes } from '@/data/recipes';

const Cook = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [voiceStatus, setVoiceStatus] = useState<'speaking' | 'listening' | 'processing' | 'idle'>('idle');
  const [timerExpanded, setTimerExpanded] = useState(false);

  // Find the recipe or use default
  const recipe = recipes.find(r => r.id === recipeId) || recipes[0];
  const totalSteps = recipe.instructions.length;
  
  // Create mama object from recipe data
  const mama = {
    name: recipe.mamaName,
    avatar: recipe.mamaEmoji
  };

  // Keep screen awake in cooking mode
  useEffect(() => {
    let wakeLock: any = null;

    if (cookingMode && 'wakeLock' in navigator) {
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
  }, [cookingMode]);

  if (!cookingMode) {
    // Page 1: Welcome Page
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{mama.avatar}</div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Ready to cook with {mama.name}?
          </h1>
          <p className="text-xl text-muted-foreground font-handwritten">
            {recipe.title}
          </p>
        </div>

        {/* Recipe Image */}
        <div className="w-64 h-48 bg-muted rounded-2xl mb-8 overflow-hidden shadow-lg">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
          <div className="bg-card rounded-xl p-4 text-center border border-border">
            <div className="text-2xl font-bold text-orange-500 mb-1">{recipe.cookingTime}</div>
            <div className="text-sm text-muted-foreground">Cook Time</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border border-border">
            <div className="text-2xl font-bold text-orange-500 mb-1">{totalSteps}</div>
            <div className="text-sm text-muted-foreground">Steps</div>
          </div>
        </div>

        {/* Start Cooking Button */}
        <Button
          onClick={() => setCookingMode(true)}
          className="w-full max-w-sm bg-orange-500 text-white hover:bg-orange-600 text-xl py-6 rounded-2xl font-heading font-bold min-h-[64px]"
        >
          Start Cooking with {mama.name}
        </Button>

        {/* Tips */}
        <div className="mt-8 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 max-w-sm">
          <p className="text-sm text-orange-700 dark:text-orange-300 text-center font-handwritten">
            💡 Make sure your ingredients are ready and your workspace is clear!
          </p>
        </div>
      </div>
    );
  }

  // Page 2: Full Cooking Interface
  const currentInstruction = recipe.instructions[currentStep - 1];

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
          
          {/* Highlighted timers and tips would be processed here */}
          {currentInstruction.includes('5 minutes') && (
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3 mb-4">
              <p className="text-orange-700 dark:text-orange-300 font-medium text-lg">
                ⏰ Timer: 5 minutes
              </p>
            </div>
          )}
        </div>

        {/* Mama's Tips */}
        {currentStep === 3 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 mx-4 mb-6 border-l-4 border-yellow-400">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{mama.avatar}</div>
              <div>
                <h3 className="font-handwritten text-lg text-yellow-800 dark:text-yellow-200 mb-1">
                  Tip from {mama.name}
                </h3>
                <p className="font-handwritten text-yellow-700 dark:text-yellow-300 text-lg leading-relaxed">
                  "Never add cream to carbonara, caro mio! The creaminess comes from the eggs and cheese."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voice Status Indicator */}
      <VoiceStatusIndicator 
        status={voiceStatus}
        mamaAvatar={mama.avatar}
        mamaName={mama.name}
      />

      {/* Controls */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            variant="outline"
            className="text-lg py-6 px-8 min-h-[56px]"
          >
            <ChevronLeft size={24} className="mr-2" />
            Previous
          </Button>

          <Button
            onClick={() => setVoiceStatus(voiceStatus === 'idle' ? 'speaking' : 'idle')}
            className="bg-orange-500 text-white hover:bg-orange-600 text-lg py-6 px-8 min-h-[56px] rounded-xl"
          >
            <Volume2 size={24} className="mr-2" />
            Repeat
          </Button>

          <Button
            onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
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
          Show {mama.name} your progress
        </Button>
        
        <p className="text-center text-sm text-muted-foreground font-handwritten">
          Upload a photo if you're stuck on a step or want to show {mama.name} how it looks!
        </p>
      </div>

      {/* Floating Timer */}
      <CookingTimer 
        isExpanded={timerExpanded}
        onToggle={() => setTimerExpanded(!timerExpanded)}
      />
    </div>
  );
};

export default Cook;
