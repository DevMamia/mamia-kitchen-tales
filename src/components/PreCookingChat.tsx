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
      
      // Play greeting after a short delay
      setTimeout(() => {
        speak(finalGreeting, mama.id.toString());
        setHasPlayedGreeting(true);
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
        {isPlaying && (
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

      {/* Start Cooking Button */}
      <Button
        onClick={onStartCooking}
        className="w-full text-lg py-6 rounded-2xl font-heading font-bold"
        size="lg"
      >
        Start Cooking with {mama.name}
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