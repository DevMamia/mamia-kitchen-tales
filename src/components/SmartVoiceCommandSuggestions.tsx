
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, ArrowRight, HelpCircle, RotateCcw, Play } from 'lucide-react';
import { CookingContext } from '@/services/contextAwareVoiceService';
import { cn } from '@/lib/utils';

interface SmartVoiceCommandSuggestionsProps {
  cookingContext: CookingContext;
  currentStep: number;
  totalSteps: number;
  mamaName: string;
  userStruggling?: boolean;
  onCommandSuggested?: (command: string) => void;
  className?: string;
}

interface CommandSuggestion {
  command: string;
  icon: React.ReactNode;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export const SmartVoiceCommandSuggestions: React.FC<SmartVoiceCommandSuggestionsProps> = ({
  cookingContext,
  currentStep,
  totalSteps,
  mamaName,
  userStruggling = false,
  onCommandSuggested,
  className = ''
}) => {
  const getContextualCommands = (): CommandSuggestion[] => {
    const baseCommands: CommandSuggestion[] = [];

    switch (cookingContext) {
      case 'browsing':
        return [
          {
            command: `Hey ${mamaName}`,
            icon: <Mic className="h-4 w-4" />,
            description: 'Start voice cooking mode',
            priority: 'high'
          },
          {
            command: "What can we cook today?",
            icon: <HelpCircle className="h-4 w-4" />,
            description: 'Get recipe suggestions',
            priority: 'medium'
          }
        ];

      case 'pre_cooking':
        return [
          {
            command: "What ingredients do I need?",
            icon: <HelpCircle className="h-4 w-4" />,
            description: 'List all ingredients',
            priority: 'high'
          },
          {
            command: "Let's start cooking",
            icon: <Play className="h-4 w-4" />,
            description: 'Begin the recipe',
            priority: 'high'
          },
          {
            command: "Tell me about this dish",
            icon: <HelpCircle className="h-4 w-4" />,
            description: 'Learn cultural context',
            priority: 'medium'
          }
        ];

      case 'active_cooking':
        baseCommands.push(
          {
            command: "Next step",
            icon: <ArrowRight className="h-4 w-4" />,
            description: 'Move to next instruction',
            priority: 'high'
          },
          {
            command: "Repeat that",
            icon: <RotateCcw className="h-4 w-4" />,
            description: 'Hear instruction again',
            priority: 'high'
          }
        );

        if (userStruggling) {
          baseCommands.unshift({
            command: "Help me with this step",
            icon: <HelpCircle className="h-4 w-4" />,
            description: 'Get detailed help',
            priority: 'high'
          });
        }

        if (currentStep > 1) {
          baseCommands.push({
            command: "Go back",
            icon: <ArrowRight className="h-4 w-4 rotate-180" />,
            description: 'Previous step',
            priority: 'medium'
          });
        }

        baseCommands.push(
          {
            command: "How much time left?",
            icon: <HelpCircle className="h-4 w-4" />,
            description: 'Check remaining time',
            priority: 'medium'
          },
          {
            command: "What's the tip for this step?",
            icon: <HelpCircle className="h-4 w-4" />,
            description: 'Get cooking tips',
            priority: 'low'
          }
        );

        return baseCommands;

      case 'paused':
        return [
          {
            command: "Continue cooking",
            icon: <Play className="h-4 w-4" />,
            description: 'Resume where you left off',
            priority: 'high'
          },
          {
            command: "Where was I?",
            icon: <HelpCircle className="h-4 w-4" />,
            description: 'Remind me of current step',
            priority: 'medium'
          }
        ];

      case 'completed':
        return [
          {
            command: "How did I do?",
            icon: <HelpCircle className="h-4 w-4" />,
            description: 'Get feedback',
            priority: 'high'
          },
          {
            command: "What should I cook next?",
            icon: <HelpCircle className="h-4 w-4" />,
            description: 'Get new recipe suggestions',
            priority: 'medium'
          }
        ];

      default:
        return baseCommands;
    }
  };

  const commands = getContextualCommands();

  if (commands.length === 0) {
    return null;
  }

  const handleCommandClick = (command: string) => {
    console.log(`[SmartVoiceCommandSuggestions] Command suggested: ${command}`);
    onCommandSuggested?.(command);
  };

  return (
    <Card className={cn("p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800", className)}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Voice Commands
          </h3>
        </div>

        <div className="grid gap-2">
          {commands.slice(0, 4).map((cmd, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => handleCommandClick(cmd.command)}
              className={cn(
                "justify-start h-auto p-2 text-left transition-all duration-200 hover:bg-white/60 dark:hover:bg-white/10",
                cmd.priority === 'high' && "border border-blue-300 dark:border-blue-700 bg-white/40 dark:bg-white/5"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="text-blue-600 dark:text-blue-400">
                  {cmd.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-blue-900 dark:text-blue-100 font-handwritten text-sm">
                    "{cmd.command}"
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 opacity-75">
                    {cmd.description}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {cookingContext === 'active_cooking' && (
          <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-handwritten">
              💡 Step {currentStep} of {totalSteps} • Just speak naturally to {mamaName}!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
