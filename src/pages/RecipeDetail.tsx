
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, Plus, Minus, ShoppingCart, Timer } from 'lucide-react';
import { recipes } from '@/data/recipes';
import { getMamaById } from '@/data/mamas';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import ShoppingListModal from '@/components/ShoppingListModal';
import { QuantityCalculationService } from '@/services/quantityCalculationService';
import { IngredientAnimation, CelebrationEffects } from '@/components/CelebrationEffects';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [ingredientAnimations, setIngredientAnimations] = useState<Array<{
    ingredient: string;
    category: string;
    position: { x: number; y: number };
    id: string;
  }>>([]);
  const { user } = useAuth();
  const { addIngredientsToShoppingList } = useShoppingList();

  const recipe = recipes.find(r => r.id === recipeId);
  const mama = recipe ? getMamaById(recipe.mamaId) : null;

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings);
    }
  }, [recipe]);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="font-heading text-2xl text-foreground mb-3">Recipe not found</h2>
          <p className="text-muted-foreground mb-6 font-handwritten">The recipe you're looking for doesn't exist in our cookbook.</p>
          <Button onClick={() => navigate('/recipes')} className="shadow-classical">
            Back to Recipes
          </Button>
        </div>
      </div>
    );
  }

  const adjustedIngredients = recipe.ingredients.map(ingredient => {
    const isSectionHeader = ingredient.trim().endsWith(':');
    if (isSectionHeader) {
      return ingredient;
    }
    
    try {
      const parsed = QuantityCalculationService.parseQuantity(ingredient);
      const scaled = QuantityCalculationService.scaleQuantity(parsed, servings / recipe.servings);
      const formatted = QuantityCalculationService.formatQuantity(scaled);
      
      const quantityPattern = /^([^a-zA-Z]*)/;
      const match = ingredient.match(quantityPattern);
      if (match && match[1].trim()) {
        return ingredient.replace(match[1], formatted + ' ');
      }
      return formatted + ' ' + ingredient.replace(/^[^a-zA-Z]*/, '');
    } catch (error) {
      const ratio = servings / recipe.servings;
      return ingredient.replace(/\d+/g, (match) => {
        const num = parseInt(match);
        return Math.round(num * ratio).toString();
      });
    }
  });

  const toggleIngredient = (index: number) => {
    const ingredient = adjustedIngredients[index];
    const isSectionHeader = ingredient.trim().endsWith(':');
    if (isSectionHeader) return;
    
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const handleStartCooking = () => {
    navigate(`/cook/${recipe.id}`);
  };

  const getUncheckedIngredients = () => {
    return adjustedIngredients.filter((ingredient, index) => {
      const isSectionHeader = ingredient.trim().endsWith(':');
      return !isSectionHeader && !checkedIngredients.has(index);
    }).map(ingredient => {
      try {
        const parsed = QuantityCalculationService.parseQuantity(ingredient);
        return {
          name: ingredient.replace(/^[^a-zA-Z]*/, '').trim(),
          quantity: QuantityCalculationService.formatQuantity(parsed)
        };
      } catch (error) {
        return {
          name: ingredient,
          quantity: undefined
        };
      }
    });
  };

  const handleAddToShoppingList = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const uncheckedIngredients = getUncheckedIngredients();
    if (uncheckedIngredients.length === 0) return;

    const animations = uncheckedIngredients.slice(0, 8).map((ingredient, index) => ({
      ingredient: ingredient.name,
      category: 'pantry',
      position: { 
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100
      },
      id: `anim-${Date.now()}-${index}`
    }));
    
    setIngredientAnimations(animations);

    await addIngredientsToShoppingList({
      ingredients: uncheckedIngredients,
      recipeId: recipeId || '',
      recipeName: recipe?.title || 'Unknown Recipe'
    });

    setShowShoppingModal(true);
  };

  const renderInstructions = (instruction: string, index: number) => {
    const isSectionHeader = instruction.trim().endsWith(':');
    
    const stepTimer = recipe.stepTimers?.[index];
    const timerRegex = /(\d+\s*(?:minutes?|mins?|hours?|hrs?))/gi;
    const timerMatch = !stepTimer ? instruction.match(timerRegex) : null;
    
    if (isSectionHeader) {
      return (
        <div key={index} className="mb-6 first:mt-0">
          <h3 className="font-heading font-bold text-lg text-primary border-b border-border pb-2 mb-4">
            {instruction}
          </h3>
        </div>
      );
    }
    
    return (
      <div key={index} className="mb-6 flex gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading font-bold text-sm">
            {index + 1}
          </div>
          {(stepTimer || timerMatch) && (
            <div className="absolute -right-2 top-10 text-xs text-muted-foreground bg-card border border-border px-2 py-1 rounded shadow-paper whitespace-nowrap">
              <Timer size={12} className="inline mr-1" />
              {stepTimer?.display || timerMatch?.[0]}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-foreground leading-relaxed">
            {instruction}
          </p>
        </div>
      </div>
    );
  };

  const getCulturalAccent = () => {
    if (mama?.country === 'Italy') return 'italian';
    if (mama?.country === 'Mexico') return 'mexican';
    return 'thai';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-paper">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-heading font-bold text-lg text-foreground">Recipe</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Recipe Header Section */}
        <div className="text-center space-y-4">
          {/* Small Food Image */}
          <div className="mx-auto w-20 h-20 rounded-full overflow-hidden border-4 border-card shadow-classical">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title with Mama */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span className="text-2xl">{recipe.mamaEmoji}</span>
              <span className="font-handwritten text-base">by {recipe.mamaName}</span>
            </div>
            <h1 className="font-heading font-bold text-3xl text-foreground leading-tight">
              {recipe.title}
            </h1>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed font-handwritten text-lg max-w-md mx-auto">
            {recipe.description}
          </p>

          {/* Recipe Metadata */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Badge variant="secondary" className="shadow-paper">
              <Clock size={14} className="mr-1" />
              {recipe.cookingTime}
            </Badge>
            <Badge variant="secondary" className="shadow-paper">
              <Users size={14} className="mr-1" />
              {recipe.servings} servings
            </Badge>
            <Badge variant="secondary" className="shadow-paper">
              <ChefHat size={14} className="mr-1" />
              {recipe.difficulty}
            </Badge>
          </div>
        </div>

        {/* Start Cooking CTA */}
        <div className="text-center">
          <Button
            onClick={handleStartCooking}
            size="lg"
            className={`font-heading font-bold py-4 px-8 text-lg shadow-cookbook transition-all duration-200 hover:scale-105 ${
              getCulturalAccent() === 'italian' ? 'bg-italian hover:bg-italian/90' :
              getCulturalAccent() === 'mexican' ? 'bg-mexican hover:bg-mexican/90' :
              'bg-thai hover:bg-thai/90'
            }`}
          >
            <span className="text-xl mr-3">{recipe.mamaEmoji}</span>
            Start Cooking with {recipe.mamaName.split(' ')[0]}!
          </Button>
        </div>

        {/* Recipe Content Tabs */}
        <div className="bg-card border border-border rounded-lg shadow-classical overflow-hidden">
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 border-b border-border rounded-none h-12">
              <TabsTrigger value="ingredients" className="font-heading font-semibold">
                Ingredients
              </TabsTrigger>
              <TabsTrigger value="instructions" className="font-heading font-semibold">
                Instructions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="p-6 space-y-6">
              {/* Serving Adjuster */}
              <div className="bg-accent/30 rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-semibold text-foreground">Servings</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-heading font-bold text-xl w-8 text-center">{servings}</span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      className="w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="space-y-3">
                {adjustedIngredients.map((ingredient, index) => {
                  const isSectionHeader = ingredient.trim().endsWith(':');
                  
                  if (isSectionHeader) {
                    return (
                      <div key={index} className="pt-4 pb-2 border-b border-border first:pt-0">
                        <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wide">
                          {ingredient}
                        </h3>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg shadow-paper">
                      <button
                        onClick={() => toggleIngredient(index)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          checkedIngredients.has(index)
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground/30 hover:border-primary'
                        }`}
                      >
                        {checkedIngredients.has(index) && (
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12"></polyline>
                          </svg>
                        )}
                      </button>
                      <span className={`flex-1 transition-all duration-200 ${
                        checkedIngredients.has(index) 
                          ? 'text-muted-foreground line-through' 
                          : 'text-foreground'
                      }`}>
                        {ingredient}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Add to Shopping List */}
              <Button 
                onClick={handleAddToShoppingList}
                disabled={getUncheckedIngredients().length === 0}
                className="w-full font-heading font-semibold py-3 shadow-classical"
                variant={getUncheckedIngredients().length > 0 ? "default" : "outline"}
              >
                <ShoppingCart size={18} className="mr-2" />
                {!user 
                  ? 'Sign In to Add to Shopping List'
                  : getUncheckedIngredients().length === 0 
                    ? 'All Ingredients Checked'
                    : `Add ${getUncheckedIngredients().length} Items to Shopping List`
                }
              </Button>
            </TabsContent>

            <TabsContent value="instructions" className="p-6 space-y-6">
              {/* Display Tips */}
              {recipe.displayTips && recipe.displayTips.length > 0 && (
                <div className={`border-l-4 rounded-r-lg p-4 shadow-paper ${
                  getCulturalAccent() === 'italian' ? 'bg-italian-subtle border-italian' :
                  getCulturalAccent() === 'mexican' ? 'bg-mexican-subtle border-mexican' :
                  'bg-thai-subtle border-thai'
                }`}>
                  <h3 className={`font-handwritten text-lg font-bold mb-3 flex items-center gap-2 ${
                    getCulturalAccent() === 'italian' ? 'text-italian' :
                    getCulturalAccent() === 'mexican' ? 'text-mexican' :
                    'text-thai'
                  }`}>
                    <span className="text-xl">{recipe.mamaEmoji}</span>
                    {recipe.mamaName}'s Essential Tips
                  </h3>
                  <ul className="space-y-2 font-handwritten text-foreground">
                    {recipe.displayTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className={`mt-1 ${
                          getCulturalAccent() === 'italian' ? 'text-italian' :
                          getCulturalAccent() === 'mexican' ? 'text-mexican' :
                          'text-thai'
                        }`}>•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              <div className="space-y-6">
                {recipe.instructions.map((instruction, index) => 
                  renderInstructions(instruction, index)
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Ingredient Animations */}
      {ingredientAnimations.map((animation) => (
        <IngredientAnimation
          key={animation.id}
          ingredient={animation.ingredient}
          category={animation.category}
          startPosition={animation.position}
          onComplete={() => {
            setIngredientAnimations(prev => 
              prev.filter(a => a.id !== animation.id)
            );
          }}
        />
      ))}

      {/* Shopping List Modal */}
      <ShoppingListModal
        isOpen={showShoppingModal}
        onClose={() => setShowShoppingModal(false)}
        addedCount={getUncheckedIngredients().length}
        recipeName={recipe?.title || 'Unknown Recipe'}
        ingredientPositions={ingredientAnimations.map(a => a.position)}
      />
    </div>
  );
};

export default RecipeDetail;
