import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, ChefHat, Clock, Users } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { Mama } from '@/data/mamas';
import { useTemplateResponses } from '@/hooks/useTemplateResponses';

interface PreCookingChatProps {
  recipe: Recipe;
  mama: Mama;
  onStartCooking: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const PreCookingChat = ({ recipe, mama, onStartCooking }: PreCookingChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { getTemplateResponse, getCulturalGreeting } = useTemplateResponses();

  // Initialize with cultural greeting
  useEffect(() => {
    const greeting = getCulturalGreeting(mama.accent, recipe.title);
    setMessages([{
      id: '1',
      text: greeting,
      isUser: false,
      timestamp: new Date()
    }]);
  }, [mama.accent, recipe.title, getCulturalGreeting]);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message
    addMessage(userInput, true);
    const currentInput = userInput;
    setUserInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getTemplateResponse(currentInput, mama.accent, recipe);
      addMessage(response, false);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">{mama.emoji}</div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Chat with {mama.name}
        </h1>
        <p className="text-xl text-muted-foreground font-handwritten">
          {recipe.title}
        </p>
      </div>

      {/* Recipe Info Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-orange-500" />
          <div className="text-lg font-bold text-orange-500">{recipe.cookingTime}</div>
          <div className="text-xs text-muted-foreground">Cook Time</div>
        </Card>
        <Card className="p-4 text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-orange-500" />
          <div className="text-lg font-bold text-orange-500">{recipe.servings}</div>
          <div className="text-xs text-muted-foreground">Servings</div>
        </Card>
        <Card className="p-4 text-center">
          <ChefHat className="w-6 h-6 mx-auto mb-2 text-orange-500" />
          <div className="text-lg font-bold text-orange-500">{recipe.difficulty}</div>
          <div className="text-xs text-muted-foreground">Level</div>
        </Card>
      </div>

      {/* Chat Interface */}
      <Card className="p-4 min-h-[300px] flex flex-col">
        <div className="flex-1 space-y-3 mb-4 max-h-[250px] overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${mama.name} about the recipe...`}
            className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button 
            onClick={handleSendMessage}
            size="sm"
            disabled={!userInput.trim() || isTyping}
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Start Cooking Button */}
      <Button
        onClick={onStartCooking}
        className="w-full bg-orange-500 text-white hover:bg-orange-600 text-xl py-6 rounded-2xl font-heading font-bold"
      >
        Start Cooking with {mama.name}
      </Button>

      {/* Cultural Tip */}
      <Card className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200">
        <p className="text-sm text-orange-700 dark:text-orange-300 text-center font-handwritten">
          {mama.philosophy}
        </p>
      </Card>
    </div>
  );
};