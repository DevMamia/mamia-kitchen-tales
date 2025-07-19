
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Timer, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerConfig {
  display: string;
  duration: number;
  description?: string;
  voiceAlert?: string;
  autoNext?: boolean;
}

interface ActiveTimer {
  id: string;
  name: string;
  duration: number;
  remaining: number;
  isRunning: boolean;
  description?: string;
  voiceAlert?: string;
  autoNext?: boolean;
  stepNumber?: number;
}

interface EnhancedCookingTimerProps {
  suggestedTimers?: (TimerConfig | null)[];
  currentStep: number;
  mamaId: string;
  onTimerComplete?: (stepNumber: number, timerName: string) => void;
  onSpeakAlert?: (text: string, mamaId: string) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const EnhancedCookingTimer = ({
  suggestedTimers = [],
  currentStep,
  mamaId,
  onTimerComplete,
  onSpeakAlert,
  isExpanded = false,
  onToggle
}: EnhancedCookingTimerProps) => {
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);
  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState(true);
  const [customTimerMinutes, setCustomTimerMinutes] = useState(5);

  // Get current step timer
  const currentStepTimer = suggestedTimers[currentStep - 1];

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers(prevTimers => {
        return prevTimers.map(timer => {
          if (timer.isRunning && timer.remaining > 0) {
            const newRemaining = timer.remaining - 1;
            
            // Timer completed
            if (newRemaining === 0) {
              console.log(`[EnhancedCookingTimer] Timer "${timer.name}" completed`);
              
              // Voice alert
              if (voiceAlertsEnabled && timer.voiceAlert && onSpeakAlert) {
                onSpeakAlert(timer.voiceAlert, mamaId);
              }
              
              // Callback
              if (onTimerComplete && timer.stepNumber) {
                onTimerComplete(timer.stepNumber, timer.name);
              }
              
              // Auto-advance notification
              if (timer.autoNext) {
                setTimeout(() => {
                  if (onSpeakAlert) {
                    onSpeakAlert(getTimerCompletionMessage(timer.name, mamaId), mamaId);
                  }
                }, 2000);
              }
              
              return { ...timer, remaining: 0, isRunning: false };
            }
            
            return { ...timer, remaining: newRemaining };
          }
          return timer;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [voiceAlertsEnabled, mamaId, onSpeakAlert, onTimerComplete]);

  const startTimer = useCallback((config: TimerConfig, stepNumber?: number) => {
    const timerId = `timer_${Date.now()}`;
    const newTimer: ActiveTimer = {
      id: timerId,
      name: config.display,
      duration: config.duration,
      remaining: config.duration,
      isRunning: true,
      description: config.description,
      voiceAlert: config.voiceAlert || getDefaultVoiceAlert(config.display, mamaId),
      autoNext: config.autoNext,
      stepNumber: stepNumber || currentStep
    };

    setActiveTimers(prev => [...prev, newTimer]);
    
    console.log(`[EnhancedCookingTimer] Started timer: ${config.display} (${config.duration}s)`);
    
    if (voiceAlertsEnabled && onSpeakAlert) {
      onSpeakAlert(getTimerStartMessage(config.display, mamaId), mamaId);
    }
  }, [currentStep, mamaId, voiceAlertsEnabled, onSpeakAlert]);

  const startCustomTimer = useCallback(() => {
    const customConfig: TimerConfig = {
      display: `${customTimerMinutes} min`,
      duration: customTimerMinutes * 60,
      description: `Custom timer for ${customTimerMinutes} minutes`,
      voiceAlert: getDefaultVoiceAlert(`${customTimerMinutes} minutes`, mamaId),
      autoNext: false
    };
    
    startTimer(customConfig);
  }, [customTimerMinutes, mamaId, startTimer]);

  const toggleTimer = useCallback((timerId: string) => {
    setActiveTimers(prev => 
      prev.map(timer => 
        timer.id === timerId 
          ? { ...timer, isRunning: !timer.isRunning }
          : timer
      )
    );
  }, []);

  const resetTimer = useCallback((timerId: string) => {
    setActiveTimers(prev => 
      prev.map(timer => 
        timer.id === timerId 
          ? { ...timer, remaining: timer.duration, isRunning: false }
          : timer
      )
    );
  }, []);

  const removeTimer = useCallback((timerId: string) => {
    setActiveTimers(prev => prev.filter(timer => timer.id !== timerId));
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getCompletedTimersCount = () => {
    return activeTimers.filter(timer => timer.remaining === 0).length;
  };

  const getActiveTimersCount = () => {
    return activeTimers.filter(timer => timer.isRunning && timer.remaining > 0).length;
  };

  // Floating timer button when collapsed
  if (!isExpanded) {
    const activeCount = getActiveTimersCount();
    const completedCount = getCompletedTimersCount();
    
    return (
      <div className="fixed bottom-24 right-4 z-50">
        <Button
          onClick={onToggle}
          className={cn(
            "rounded-full w-14 h-14 shadow-lg transition-all duration-200",
            activeCount > 0 && "animate-pulse bg-orange-500 hover:bg-orange-600",
            completedCount > 0 && "bg-green-500 hover:bg-green-600"
          )}
        >
          <Timer className="w-6 h-6" />
          {(activeCount > 0 || completedCount > 0) && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {activeCount + completedCount}
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 max-w-sm mx-auto">
      <Card className="p-4 bg-background/95 backdrop-blur-sm border-orange-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Cooking Timers</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceAlertsEnabled(!voiceAlertsEnabled)}
            >
              {voiceAlertsEnabled ? (
                <Volume2 className="w-4 h-4 text-orange-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              ×
            </Button>
          </div>
        </div>

        {/* Suggested Timer for Current Step */}
        {currentStepTimer && (
          <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-orange-700 dark:text-orange-300">
                  Step {currentStep}: {currentStepTimer.display}
                </p>
                {currentStepTimer.description && (
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    {currentStepTimer.description}
                  </p>
                )}
              </div>
              <Button
                onClick={() => startTimer(currentStepTimer, currentStep)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                size="sm"
              >
                Start
              </Button>
            </div>
          </div>
        )}

        {/* Active Timers */}
        {activeTimers.length > 0 && (
          <div className="space-y-3 mb-4">
            {activeTimers.map(timer => (
              <div
                key={timer.id}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all duration-200",
                  timer.remaining === 0 
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : timer.isRunning 
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                      : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{timer.name}</span>
                      {timer.stepNumber && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          Step {timer.stepNumber}
                        </span>
                      )}
                    </div>
                    <p className={cn(
                      "text-2xl font-mono font-bold",
                      timer.remaining === 0 
                        ? "text-green-600 dark:text-green-400"
                        : timer.isRunning 
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400"
                    )}>
                      {timer.remaining === 0 ? "Done!" : formatTime(timer.remaining)}
                    </p>
                    {timer.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {timer.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    {timer.remaining > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTimer(timer.id)}
                      >
                        {timer.isRunning ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetTimer(timer.id)}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTimer(timer.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Timer */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="120"
              value={customTimerMinutes}
              onChange={(e) => setCustomTimerMinutes(parseInt(e.target.value) || 5)}
              className="w-16 px-2 py-1 text-sm border rounded"
            />
            <span className="text-sm text-muted-foreground">minutes</span>
            <Button
              onClick={startCustomTimer}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              Add Timer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Helper functions
function getDefaultVoiceAlert(timerName: string, mamaId: string): string {
  const alerts: Record<string, string[]> = {
    nonna_lucia: [
      `Ding! Your ${timerName} timer is finished, tesoro!`,
      `Ecco! The timer for ${timerName} is done, caro!`,
      `Perfetto! Your ${timerName} is ready, bambino!`
    ],
    abuela_rosa: [
      `¡Órale! Your ${timerName} timer is done, mijo!`,
      `¡Listo! The ${timerName} timer finished, corazón!`,
      `¡Perfecto! Your ${timerName} is ready, mi amor!`
    ],
    yai_malee: [
      `Your ${timerName} timer is complete, dear!`,
      `The ${timerName} timer has finished, child!`,
      `Time's up for ${timerName}, little one!`
    ]
  };

  const mamaAlerts = alerts[mamaId] || alerts.nonna_lucia;
  return mamaAlerts[Math.floor(Math.random() * mamaAlerts.length)];
}

function getTimerStartMessage(timerName: string, mamaId: string): string {
  const messages: Record<string, string[]> = {
    nonna_lucia: [
      `Timer started for ${timerName}, tesoro!`,
      `Bene! I'll let you know when ${timerName} is ready!`
    ],
    abuela_rosa: [
      `Timer set for ${timerName}, mijo!`,
      `¡Bueno! I'll tell you when ${timerName} is done!`
    ],
    yai_malee: [
      `Timer running for ${timerName}, dear!`,
      `I'll remind you when ${timerName} is ready!`
    ]
  };

  const mamaMessages = messages[mamaId] || messages.nonna_lucia;
  return mamaMessages[Math.floor(Math.random() * mamaMessages.length)];
}

function getTimerCompletionMessage(timerName: string, mamaId: string): string {
  const messages: Record<string, string[]> = {
    nonna_lucia: [
      `Perfect timing! Your ${timerName} looks wonderful, ready for the next step!`,
      `Bravissimo! The ${timerName} is perfect. Let's continue cooking!`
    ],
    abuela_rosa: [
      `¡Qué bueno! Your ${timerName} is just right. Ready to continue, mijo?`,
      `Perfect! The ${timerName} is done beautifully. Let's keep going!`
    ],
    yai_malee: [
      `Excellent! Your ${timerName} is ready. Shall we move to the next step?`,
      `Beautiful timing! The ${timerName} looks perfect. Ready to continue?`
    ]
  };

  const mamaMessages = messages[mamaId] || messages.nonna_lucia;
  return mamaMessages[Math.floor(Math.random() * mamaMessages.length)];
}
