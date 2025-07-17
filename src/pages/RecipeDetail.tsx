import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, Plus, Minus, ShoppingCart, Timer, Heart, Share2 } from 'lucide-react';
import { recipes } from '@/data/recipes';
import { getMamaById } from '@/data/mamas';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import ShoppingListModal from '@/components/ShoppingListModal';
import { QuantityCalculationService } from '@/services/quantityCalculationService';
// Removed IngredientAnimation and CelebrationEffects imports
// import { IngredientAnimation, CelebrationEffects } from '@/components/CelebrationEffects';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [isFavorited, setIsFavorited] = useState(false);
  // Removed isSticky state as it's no longer used for sticky header
  // const [isSticky, setIsSticky] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  // Removed ingredientAnimations state as animations are removed
  // const [ingredientAnimations, setIngredientAnimations] = useState<Array<{
  //   ingredient: string;
  //   category: string;
  //   position: { x: number; y: number };
  //   id: string;
  // }>>([]);
  // Removed showCelebration state as animations are removed
  // const [showCelebration, setShowCelebration] = useState(false);
  const { user } = useAuth();
  const { addIngredientsToShoppingList } = useShoppingList();

  const recipe = recipes.find(r => r.id === recipeId);
  const mama = recipe ? getMamaById(recipe.mamaId) : null;

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings);
    }
  }, [recipe]);
  
  // Removed useEffect for sticky header as it's no longer needed for the new design
  /*
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  */

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
    // Removed CelebrationEffects trigger for simplicity
    // setShowCelebration(true);
    // setTimeout(() => setShowCelebration(false), 1500);
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

    // Removed ingredient animations for simplicity
    /*
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
    */

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
    <div className="min-h-screen bg-background pb-8">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden"> {/* Adjusted height */}
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content Area - This will contain the info card, tabs, etc. */}
      <div className="relative -mt-16 mx-4 z-10"> {/* Negative margin to overlap image */}
        {/* Recipe Info Card (matches the image) */}
        <div className="bg-card rounded-xl p-6 shadow-paper border border-border"> {/* Soft background, rounded, subtle shadow */}
          {/* Header Controls (moved here) */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="w-8 h-8 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <button 
              onClick={toggleFavorite}
              className={`w-8 h-8 ${isFavorited ? 'bg-red-500 text-white' : 'bg-muted/50 text-muted-foreground'} rounded-full flex items-center justify-center hover:bg-muted transition-colors`}
            >
              <Heart size={16} className={isFavorited ? 'fill-current' : ''} />
            </button>
            <button 
              className="w-8 h-8 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Recipe Title and Mama Info */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading font-bold text-2xl text-foreground">{recipe.title}</h1>
            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-xl">
              {recipe.mamaEmoji}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed font-handwritten text-base italic mb-4">
            {recipe.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-around text-sm text-muted-foreground border-t border-b border-border py-3 mb-4">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{servings} servings</span> {/* Use current servings state */}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{recipe.cookingTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat size={16} />
              <span>{recipe.difficulty}</span>
            </div>
          </div>

          {/* Start Cooking Button */}
          <button
            onClick={handleStartCooking}
            className="w-full bg-primary text-primary-foreground font-heading font-bold py-3 rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <ChefHat size={20} /> {/* Replaced mama emoji with ChefHat */}
            Let's cook with {recipe.mamaName.split(' ')[0]}
          </button>
        </div>

        {/* Tab Navigation (no sticky for now, simpler design) */}
        <div className="mt-6 p-1 bg-card rounded-lg shadow-paper border border-border flex">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-2 px-4 rounded-md font-heading font-bold text-sm transition-all duration-200 ${
                activeTab === 'ingredients'
                  ? 'bg-primary text-primary-foreground shadow-sm' // Solid background for active tab
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex-1 py-2 px-4 rounded-md font-heading font-bold text-sm transition-all duration-200 ${
                activeTab === 'instructions'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Instructions
            </button>
        </div>

        {/* Content */}
        <div className="px-2 py-4"> {/* Reduced padding */}
        {activeTab === 'ingredients' && (
          <div className="space-y-6">
            {/* Serving Adjuster */}
            <div className="bg-white rounded-xl p-4 shadow-warm border border-muted/30">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-foreground flex items-center gap-2">
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
                  <div key={index} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                    <button
                      onClick={() => toggleIngredient(index)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        checkedIngredients.has(index)
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-muted-foreground/30 hover:border-primary'
                      }`} {/* Simplified border color */}
                    >
                      {checkedIngredients.has(index) && (
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      )}
                    </button>
                    <span className={`flex-1 ${ // Removed transition-all duration-200
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
              className="w-full font-heading font-bold py-3 h-12 rounded-xl flex items-center justify-center gap-2 shadow-sm" // Simplified shadow
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
            {recipe.displayTips && recipe.displayTips.length > 0 && (
              <div className="bg-card rounded-xl p-4 shadow-paper border border-border"> {/* New card styling */}
                <h3 className="font-handwritten text-lg text-primary font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">{recipe.mamaEmoji}</span>
                  {recipe.mamaName}'s Tips
                </h3>
                <ul className="space-y-3 font-handwritten text-foreground">
                  {recipe.displayTips.slice(0, 2).map((tip, index) => ( // Limit to 2 tips
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary mt-1 text-lg">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Fallback for no tips */}
            {(!recipe.displayTips || recipe.displayTips.length === 0) && (
              <div className="bg-card rounded-xl p-4 shadow-paper border border-border">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{recipe.mamaEmoji}</div>
                  <div>
                    <h3 className="font-handwritten text-lg text-primary font-bold">
                      {recipe.mamaName}'s Tips
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
      </div>
      {/* Removed Ingredient Animations for simplicity */}
      {/*
      {ingredientAnimations.map((animation) => (
        <IngredientAnimation
          key={animation.id}
          ingredient={animation.ingredient}
          category={animation.category}
          startPosition={animation.position}
          onComplete={() => {
            setIngredientAnimations(prev => prev.filter(a => a.id !== animation.id));
          }}
        />
      ))}
      */}
      {/* Shopping List Modal */}
      <ShoppingListModal
        isOpen={showShoppingModal}
        onClose={() => setShowShoppingModal(false)}
        addedCount={getUncheckedIngredients().length}
        recipeName={recipe?.title || 'Unknown Recipe'}
        // Removed ingredientPositions to simplify animations
      />
      {/* Removed CelebrationEffects for simplicity */}
      {/*
      <CelebrationEffects 
        trigger={showCelebration} 
        type="heart" 
        cultural={recipe.culture as 'italian' | 'mexican' | 'thai'} 
      />
      */}
    </div>
  );
};

export default RecipeDetail;