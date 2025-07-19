
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { ChefHat, Clock, Users, MessageCircle, ChevronDown, Send, Crown } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { Mama } from '@/data/mamas';
import { useTemplateResponses } from '@/hooks/useTemplateResponses';
import { useVoice } from '@/hooks/useVoice';
import { useAuth } from '@/contexts/AuthContext';
import { useUserTier } from '@/hooks/useUserTier';

interface PreCookingChatProps {
  recipe: Recipe;
  mama: Mama;
  onStartCooking: () => void;
}

export const PreCookingChat = ({ recipe, mama, onStartCooking }: PreCookingChatProps) => {
  const [isTextChatOpen, setIsTextChatOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [hasPlayedGreeting, setHasPlayedGreeting] = useState(false);
  
  const { getTemplateResponse, getCulturalGreeting } = useTemplateResponses();
  const { speak, setConversationPhase, isPlaying, serviceStatus } = useVoice();
  const { user } = useAuth();
  const { isPremium, voiceMode, setVoiceMode, usageCount, maxUsage, hasUsageLeft } = useUserTier();

  // Enhanced personalized greeting with direct message mode
  useEffect(() => {
    if (!hasPlayedGreeting && serviceStatus === 'ready') {
      console.log('[PreCookingChat] Voice service ready, preparing personalized greeting...');
      
      // Set conversation phase to pre-cooking
      setConversationPhase('pre-cooking');
      
      const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'friend';
      
      // Create deeply personalized greetings using direct message mode
      const createPersonalizedGreeting = (mamaVoiceId: string, userName: string, recipeTitle: string) => {
        switch (mamaVoiceId) {
          case 'nonna_lucia':
            return `Ciao ${userName}! Welcome to Nonna's kitchen! Today we cook my beautiful ${recipeTitle} together. I'm so excited to share this special recipe with you, caro mio! Are you ready to start our cooking adventure?`;
          case 'abuela_rosa':
            return `¡Hola ${userName}! Bienvenido to Abuela's cocina! Today we're making my special ${recipeTitle}. Ay, I'm so excited to cook with you, mi corazón! This recipe has been in our family for generations. ¿Estás listo to start cooking?`;
          case 'yai_malee':
            return `Sawadee ka ${userName}! Welcome to my kitchen, dear one! Today we find balance and harmony with my ${recipeTitle}. I'm so excited to share this peaceful cooking journey with you! Let your heart be calm and ready. Are you prepared to begin?`;
          default:
            return `Welcome ${userName}! Today we cook ${recipeTitle} together. I'm excited to guide you through this wonderful recipe! Tell me when you're ready to start cooking.`;
        }
      };
      
      const personalizedGreeting = createPersonalizedGreeting(mama.voiceId, userName, recipe.title);
      
      console.log('[PreCookingChat] Playing personalized greeting with direct message mode:', {
        mamaId: mama.voiceId,
        text: personalizedGreeting.substring(0, 100) + '...'
      });
      
      // Use direct message mode for exact personalized greeting
      setTimeout(() => {
        speak(personalizedGreeting, mama.voiceId, {
          isDirectMessage: true,
          priority: 'high',
          source: 'instant'
        }).then(() => {
          console.log('[PreCookingChat] Personalized greeting played successfully');
        }).catch(error => {
          console.error('[PreCookingChat] Failed to play personalized greeting:', error);
        });
        setHasPlayedGreeting(true);
      }, 1000);
    } else if (!hasPlayedGreeting) {
      console.log(`[PreCookingChat] Waiting for voice service, current status: ${serviceStatus}`);
    }
  }, [speak, setConversationPhase, mama.voiceId, recipe.title, user, hasPlayedGreeting, serviceStatus]);

  const handleTextQuestion = async () => {
    if (!question.trim()) return;
    
    setIsAnswering(true);
    // Use template response for now
    const response = getTemplateResponse(question, mama.accent, recipe);
    setAnswer(response);
    setIsAnswering(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      {/* Mama Portrait & Greeting */}
      <div className="text-center space-y-4">
        <div className="text-8xl mb-4">{mama.emoji}</div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          {mama.name}
        </h1>
        <p className="text-lg text-muted-foreground font-handwritten">
          {recipe.title}
        </p>
        
        {/* Voice Status */}
        {serviceStatus === 'loading' && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
            <span className="text-sm">Loading voice...</span>
          </div>
        )}
        
        {serviceStatus === 'error' && (
          <div className="flex items-center justify-center gap-2 text-destructive">
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            <span className="text-sm">Voice unavailable</span>
          </div>
        )}
        
        {isPlaying && serviceStatus === 'ready' && (
          <div className="flex items-center justify-center gap-2 text-primary">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{mama.name} speaking...</span>
          </div>
        )}
      </div>

      {/* Recipe Info */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-sm font-bold text-primary">{recipe.cookingTime}</div>
          <div className="text-xs text-muted-foreground">Time</div>
        </Card>
        <Card className="p-3 text-center">
          <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-sm font-bold text-primary">{recipe.servings}</div>
          <div className="text-xs text-muted-foreground">Serves</div>
        </Card>
        <Card className="p-3 text-center">
          <ChefHat className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-sm font-bold text-primary">{recipe.difficulty}</div>
          <div className="text-xs text-muted-foreground">Level</div>
        </Card>
      </div>

      {/* Food Image */}
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-2xl shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
      </div>

      {/* Premium Voice Mode Toggle */}
      {isPremium && (
        <Card className="p-4 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Premium Voice Experience</span>
            </div>
            <Switch
              checked={voiceMode === 'conversational'}
              onCheckedChange={(checked) => setVoiceMode(checked ? 'conversational' : 'tts')}
              disabled={!hasUsageLeft}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {voiceMode === 'conversational' 
              ? `Voice Chat Mode • ${maxUsage - usageCount} sessions left today`
              : 'Simple Voice Mode'
            }
          </div>
          {!hasUsageLeft && (
            <div className="text-xs text-orange-600 mt-1">
              Daily voice chat limit reached. Upgrade to Family plan for unlimited conversations.
            </div>
          )}
        </Card>
      )}

      {/* Start Cooking Button */}
      <Button
        onClick={onStartCooking}
        className="w-full text-lg py-6 rounded-2xl font-heading font-bold"
        size="lg"
      >
        Start Cooking with {mama.name}
        {isPremium && voiceMode === 'conversational' && hasUsageLeft && (
          <span className="ml-2 text-sm opacity-75">• Voice Chat</span>
        )}
      </Button>

      {/* Optional Text Questions */}
      <Collapsible open={isTextChatOpen} onOpenChange={setIsTextChatOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full"
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Text {mama.name}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          <Card className="p-4">
            <div className="space-y-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={`Ask ${mama.name} about the recipe...`}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleTextQuestion()}
              />
              
              <Button 
                onClick={handleTextQuestion}
                disabled={!question.trim() || isAnswering}
                className="w-full"
                size="sm"
              >
                <Send className="w-3 h-3 mr-2" />
                {isAnswering ? 'Thinking...' : 'Ask'}
              </Button>
              
              {answer && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-foreground">{answer}</p>
                </div>
              )}
            </div>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Cultural Philosophy */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <p className="text-sm text-muted-foreground text-center font-handwritten italic">
          {mama.philosophy}
        </p>
      </Card>
    </div>
  );
};
