import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChefHat, Clock, Users, MessageCircle, ChevronDown, Send } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { Mama } from '@/data/mamas';
import { useTemplateResponses } from '@/hooks/useTemplateResponses';
import { useVoice } from '@/hooks/useVoice';
import { useAuth } from '@/contexts/AuthContext';

interface PreCookingChatProps {
  recipe: Recipe;
  mama: Mama;
  onStartCooking: () => void;
}

export const PreCookingChat = ({ recipe, mama, onStartCooking }: PreCookingChatProps) => {
  // Safety check for required props
  if (!recipe || !mama || !onStartCooking) {
    console.error('PreCookingChat: Missing required props', { recipe, mama, onStartCooking });
    return null;
  }

  const [isTextChatOpen, setIsTextChatOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [hasPlayedGreeting, setHasPlayedGreeting] = useState(false);
  
  const { getTemplateResponse, getCulturalGreeting } = useTemplateResponses();
  const { speak, isPlaying } = useVoice();
  const { user } = useAuth();

  // Debug log to verify component version
  console.log('PreCookingChat loaded - current version with auto-greeting');

  // Auto-play voice greeting when component mounts
  useEffect(() => {
    if (!hasPlayedGreeting) {
      const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'friend';
      const greetingVariations = [
        `Welcome ${userName}! Today we cook my ${recipe.title}. I can't wait to teach you!`,
        `Ciao ${userName}! Ready to make the most delicious ${recipe.title}? I'm so excited!`,
        `Hello ${userName}! Let's create magic with my ${recipe.title} recipe together!`
      ];
      
      const randomGreeting = greetingVariations[Math.floor(Math.random() * greetingVariations.length)];
      const finalGreeting = `${randomGreeting} Tell me when you're ready to start cooking!`;
      
      console.log('[PreCookingChat] Attempting to play greeting:', finalGreeting);
      
      // Play greeting after a short delay
      setTimeout(async () => {
        try {
          await speak(finalGreeting, mama.id.toString());
          setHasPlayedGreeting(true);
          console.log('[PreCookingChat] Greeting played successfully');
        } catch (error) {
          console.error('[PreCookingChat] Failed to play greeting:', error);
          setHasPlayedGreeting(true); // Still mark as played to avoid retries
        }
      }, 500);
    }
  }, [speak, mama.id, recipe.title, user, hasPlayedGreeting]);

  const handleTextQuestion = async () => {
    if (!question.trim()) return;
    
    setIsAnswering(true);
    // Use template response for now
    const response = getTemplateResponse(question, mama.accent, recipe);
    setAnswer(response);
    setIsAnswering(false);
  };

  return (
    <div className="max-w-md mx-auto p-2 space-y-2">
      {/* Recipe Title & By Line */}
      <div className="space-y-1">
        <h1 className="text-xl font-heading font-bold text-foreground leading-tight">
          {recipe.title}
        </h1>
        <p className="text-xs text-muted-foreground">
          by <span className="font-medium text-primary">{mama.name}</span>
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {recipe.description}
        </p>
      </div>

      {/* Food Image - Further Reduced Height */}
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-32 object-cover rounded-xl shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl"></div>
      </div>

      {/* Start Cooking Button */}
      <Button
        onClick={onStartCooking}
        className="w-full text-base py-3 rounded-xl font-heading font-bold"
        size="lg"
      >
        Start Cooking
      </Button>

      {/* Optional Text Questions - Subtle Dropdown */}
      <Collapsible open={isTextChatOpen} onOpenChange={setIsTextChatOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground text-sm py-2"
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Text {mama.name}!
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-2 mt-2">
          <Card className="p-3">
            <div className="space-y-2">
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
                <div className="mt-2 p-2 bg-muted rounded-lg">
                  <p className="text-sm text-foreground">{answer}</p>
                </div>
              )}
            </div>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};