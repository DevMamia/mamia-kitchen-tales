import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

interface CookingTimerProps {
  isExpanded: boolean;
  onToggle: () => void;
  suggestedTimer?: {
    display: string;
    duration: number;
    description?: string;
  };
  onTimerComplete?: () => void;
}

export const CookingTimer = ({ isExpanded, onToggle, suggestedTimer, onTimerComplete }: CookingTimerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [time, setTime] = useState(suggestedTimer?.duration || 300);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState(() => {
    const duration = suggestedTimer?.duration || 300;
    return formatTime(duration);
  });
  const [showSuggestion, setShowSuggestion] = useState(!!suggestedTimer);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      onTimerComplete?.();
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);


  const handleStart = () => {
    if (time === 0) {
      // Parse input time
      const [mins, secs] = inputTime.split(':').map(Number);
      setTime(mins * 60 + secs);
    }
    setIsRunning(!isRunning);
    setShowSuggestion(false);
  };

  const handleStartSuggested = () => {
    if (suggestedTimer) {
      setTime(suggestedTimer.duration);
      setInputTime(formatTime(suggestedTimer.duration));
      setIsRunning(true);
      setShowSuggestion(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    const [mins, secs] = inputTime.split(':').map(Number);
    setTime(mins * 60 + secs);
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
      >
        <Timer size={24} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 bg-card rounded-2xl p-4 shadow-lg border border-border min-w-[200px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg">Timer</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-muted-foreground"
        >
          ×
        </Button>
      </div>

      {/* Suggested Timer */}
      {showSuggestion && suggestedTimer && (
        <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
            Suggested for this step:
          </p>
          <p className="font-medium text-orange-800 dark:text-orange-200 mb-3">
            {suggestedTimer.display} - {suggestedTimer.description}
          </p>
          <Button
            onClick={handleStartSuggested}
            className="w-full bg-orange-500 text-white hover:bg-orange-600"
          >
            Start {suggestedTimer.display} Timer
          </Button>
        </div>
      )}

      <div className="text-center">
        <div className="text-3xl font-bold font-mono mb-4 text-foreground">
          {formatTime(time)}
        </div>

        {!isRunning && time === 0 && (
          <input
            type="text"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            className="text-center text-lg mb-4 bg-background border border-border rounded-lg p-2 w-full"
            placeholder="MM:SS"
          />
        )}

        <div className="flex gap-2 justify-center">
          <Button
            onClick={handleStart}
            className="bg-orange-500 text-white hover:bg-orange-600 min-h-[48px]"
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="min-h-[48px]"
          >
            <RotateCcw size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};