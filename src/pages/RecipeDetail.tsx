import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, Plus, Minus, ShoppingCart, Timer, Heart } from 'lucide-react';
import { recipes } from '@/data/recipes';
import { getMamaById } from '@/data/mamas';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import ShoppingListModal from '@/components/ShoppingListModal';
import { QuantityCalculationService } from '@/services/quantityCalculationService';
import { IngredientAnimation, CelebrationEffects } from '@/components/CelebrationEffects';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [ingredientAnimations, setIngredientAnimations] = useState<Array<{
    ingredient: string;
    category: string;
    position: { x: number; y: number };
    id: string;
  }>>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const { user } = useAuth();
  const { addIngredientsToShoppingList } = useShoppingList();

  const recipe = recipes.find(r => r.id === recipeId);
  const mama = recipe ? getMamaById(recipe.mamaId) : null;

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings);
    }
  }, [recipe]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!recipe) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl text-foreground mb-2">Recipe not found</h2>
          <p className="text-muted-foreground mb-4">The recipe you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/recipes')}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-heading font-bold"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  const adjustedIngredients = recipe.ingredients.map(ingredient => {
    // Check if this is a section header (ends with colon)
    const isSectionHeader = ingredient.trim().endsWith(':');
    if (isSectionHeader) {
      return ingredient; // Don't adjust section headers
    }
    
    // Enhanced quantity calculation using QuantityCalculationService
    try {
      const parsed = QuantityCalculationService.parseQuantity(ingredient);
      const scaled = QuantityCalculationService.scaleQuantity(parsed, servings / recipe.servings);
      const formatted = QuantityCalculationService.formatQuantity(scaled);
      
      // Replace the quantity part while preserving the ingredient name
      const quantityPattern = /^([^a-zA-Z]*)/;
      const match = ingredient.match(quantityPattern);
      if (match && match[1].trim()) {
        return ingredient.replace(match[1], formatted + ' ');
      }
      return formatted + ' ' + ingredient.replace(/^[^a-zA-Z]*/, '');
    } catch (error) {
      // Fallback to simple calculation if parsing fails
      const ratio = servings / recipe.servings;
      return ingredient.replace(/\d+/g, (match) => {
        const num = parseInt(match);
        return Math.round(num * ratio).toString();
      });
    }
  });

  const toggleIngredient = (index: number) => {
    // Check if this is a section header (ends with colon)
    const ingredient = adjustedIngredients[index];
    const isSectionHeader = ingredient.trim().endsWith(':');
    if (isSectionHeader) {
      return; // Don't toggle section headers
    }
    
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1500);
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

    // Create ingredient animations
    const animations = uncheckedIngredients.slice(0, 8).map((ingredient, index) => ({
      ingredient: ingredient.name,
      category: 'pantry', // Default category, would be determined by categorization service
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
    // Check if this is a section header (ends with colon)
    const isSectionHeader = instruction.trim().endsWith(':');
    
    // Use structured timer data if available, otherwise fall back to regex
    const stepTimer = recipe.stepTimers?.[index];
    const timerRegex = /(\d+\s*(?:minutes?|mins?|hours?|hrs?))/gi;
    const timerMatch = !stepTimer ? instruction.match(timerRegex) : null;
    
    if (isSectionHeader) {
      return (
        <div key={index} className="mb-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg px-4 py-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="font-heading font-bold text-primary text-sm uppercase tracking-wider">
              {instruction}
            </span>
          </div>
        </div>
      );
    }
    
    return (
      <div key={index} className="flex gap-4 mb-6">
        <div className="relative">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0 mt-1">
            {index + 1}
          </div>
          {(stepTimer || timerMatch) && (
            <div className="absolute -right-2 top-10 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md whitespace-nowrap">
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

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        
        {/* Header Controls */}
        <div className="absolute top-6 left-4 right-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors shadow-md"
          >
            <ArrowLeft size={20} />
          </button>
          
          <button 
            onClick={toggleFavorite}
            className={`w-10 h-10 ${isFavorited ? 'bg-red-500' : 'bg-white/30'} backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors shadow-md`}
          >
            <Heart size={20} className={isFavorited ? 'fill-white' : ''} />
          </button>
        </div>

        {/* Recipe Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/80 to-transparent pt-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-3xl">{recipe.mamaEmoji}</span>
            </div>
            <div>
              <span className="text-sm font-medium opacity-90">Recipe by</span>
              <h3 className="text-lg font-heading font-bold">{recipe.mamaName}</h3>
            </div>
          </div>
          <h1 className="font-heading font-bold text-3xl mb-4 drop-shadow-md">{recipe.title}</h1>
          
          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-white/30 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-md">
              <Clock size={16} />
              <span className="text-sm font-medium">{recipe.cookingTime}</span>
            </div>
            <div className="bg-white/30 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-md">
              <Users size={16} />
              <span className="text-sm font-medium">{recipe.servings} servings</span>
            </div>
            <div className="bg-white/30 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-md">
              <ChefHat size={16} />
              <span className="text-sm font-medium">{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 bg-white border-b border-muted/50">
        <p className="text-muted-foreground leading-relaxed font-handwritten text-lg italic">
          {recipe.description}
        </p>
      </div>

      {/* Start Cooking Button */}
      <div className="px-6 py-6 bg-white">
        <button
          onClick={handleStartCooking}
          className={`w-full ${
            recipe.mamaId === 1 ? 'bg-gradient-to-r from-italian-marble to-italian-marble-warm' : 
            recipe.mamaId === 2 ? 'bg-gradient-to-r from-mexican-tile to-mexican-tile-warm' :
            'bg-gradient-to-r from-thai-silk to-thai-silk-warm'
          } text-white font-heading font-bold py-5 px-6 rounded-xl shadow-warm hover:shadow-elegant transition-all duration-300 
          flex items-center justify-center gap-3 gentle-pulse`}
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-md">
            <span className="text-xl">{recipe.mamaEmoji}</span>
          </div>
          <span className="text-xl">Let's cook with {recipe.mamaName.split(' ')[0]}!</span>
        </button>
      </div>

      {/* Sticky Tab Navigation */}
      <div className={`sticky top-0 z-10 bg-white border-b transition-all duration-200 ${
        isSticky ? 'shadow-lg' : ''
      }`}>
        <div className="p-4">
          <div className="bg-muted/70 rounded-lg p-1 flex shadow-sm">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-2 px-4 rounded-md font-heading font-bold text-sm transition-all duration-200 ${
                activeTab === 'ingredients'
                  ? 'bg-white text-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex-1 py-2 px-4 rounded-md font-heading font-bold text-sm transition-all duration-200 ${
                activeTab === 'instructions'
                  ? 'bg-white text-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Instructions
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {activeTab === 'ingredients' && (
          <div className="space-y-6">
            {/* Serving Adjuster */}
            <div className="bg-white rounded-xl p-4 shadow-warm border border-muted/30">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-foreground flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  Servings
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors shadow-sm"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-heading font-bold text-xl w-8 text-center">{servings}</span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors shadow-sm"
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
                    <div key={index} className="mt-6 mb-3">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg px-4 py-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="font-heading font-bold text-primary text-sm uppercase tracking-wider">
                          {ingredient}
                        </span>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-muted/20 hover:border-muted/40 transition-colors">
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
              className="w-full font-heading font-bold py-3 h-12 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-warm"
              variant={getUncheckedIngredients().length > 0 ? "default" : "outline"}
            >
              <ShoppingCart size={20} />
              {!user 
                ? 'Sign In to Add to Shopping List'
                : getUncheckedIngredients().length === 0 
                  ? 'All Ingredients Checked'
                  : `Add ${getUncheckedIngredients().length} Items to Shopping List`
              }
            </Button>
          </div>
        )}

        {activeTab === 'instructions' && (
          <div className="space-y-6">
            {/* Display Tips */}
            {recipe.displayTips && recipe.displayTips.length > 0 ? (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-primary rounded-lg p-4 shadow-warm">
                <h3 className="font-handwritten text-lg text-primary font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">{recipe.mamaEmoji}</span>
                  {recipe.mamaName}'s Essential Tips
                </h3>
                <ul className="space-y-3 font-handwritten text-foreground">
                  {recipe.displayTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary mt-1 text-lg">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-primary rounded-lg p-4 shadow-warm">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{recipe.mamaEmoji}</div>
                  <div>
                    <h3 className="font-handwritten text-lg text-primary font-bold">
                      {recipe.mamaName}'s Cooking Wisdom
                    </h3>
                    <p className="text-foreground font-handwritten">
                      Start cooking to hear {recipe.mamaName.split(' ')[0]}'s voice guidance and cultural stories!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-6">
              {recipe.instructions.map((instruction, index) => 
                renderInstructions(instruction, index)
              )}
            </div>
          </div>
        )}
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
      
      {/* Favorite Animation */}
      <CelebrationEffects 
        trigger={showCelebration} 
        type="heart" 
        cultural={recipe.culture as 'italian' | 'mexican' | 'thai'} 
      />
    </div>
  );
};

export default RecipeDetail;