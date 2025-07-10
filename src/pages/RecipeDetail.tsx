import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, Plus, Minus, ShoppingCart, Timer } from 'lucide-react';
import { recipes } from '@/data/recipes';
import { getMamaById } from '@/data/mamas';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [isSticky, setIsSticky] = useState(false);

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
    // Simple ingredient adjustment - in real app this would be more sophisticated
    const ratio = servings / recipe.servings;
    return ingredient.replace(/\d+/g, (match) => {
      const num = parseInt(match);
      return Math.round(num * ratio).toString();
    });
  });

  const toggleIngredient = (index: number) => {
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

  const renderInstructions = (instruction: string, index: number) => {
    // Highlight timer text in instructions
    const timerRegex = /(\d+\s*(?:minutes?|mins?|hours?|hrs?))/gi;
    const parts = instruction.split(timerRegex);
    
    return (
      <div key={index} className="flex gap-4 mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0 mt-1">
          {index + 1}
        </div>
        <div className="flex-1">
          <p className="text-foreground leading-relaxed">
            {parts.map((part, i) => 
              timerRegex.test(part) ? (
                <span key={i} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                  <Timer size={14} />
                  {part}
                </span>
              ) : part
            )}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        
        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Recipe Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{recipe.mamaEmoji}</span>
            <span className="text-sm opacity-90">by {recipe.mamaName}</span>
          </div>
          <h1 className="font-heading font-bold text-3xl mb-4">{recipe.title}</h1>
          
          {/* Stats */}
          <div className="flex gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-1">
              <Clock size={16} />
              <span className="text-sm font-medium">{recipe.cookingTime}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-1">
              <Users size={16} />
              <span className="text-sm font-medium">{recipe.servings} servings</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-1">
              <ChefHat size={16} />
              <span className="text-sm font-medium">{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 bg-white">
        <p className="text-muted-foreground leading-relaxed font-handwritten text-lg">
          {recipe.description}
        </p>
      </div>

      {/* Start Cooking Button */}
      <div className="px-6 pb-6 bg-white">
        <button
          onClick={handleStartCooking}
          className={`w-full ${mama?.country === 'Italy' ? 'bg-gradient-to-r from-italian-marble to-italian-marble-warm' : 
                     mama?.country === 'Mexico' ? 'bg-gradient-to-r from-mexican-tile to-mexican-tile-warm' :
                     'bg-gradient-to-r from-thai-silk to-thai-silk-warm'} 
                   text-white font-heading font-bold py-4 px-6 rounded-xl shadow-warm hover:shadow-elegant transition-all duration-300 
                   flex items-center justify-center gap-3`}
        >
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xl">{recipe.mamaEmoji}</span>
          </div>
          <span className="text-lg">Let's cook together with {recipe.mamaName.split(' ')[0]}!</span>
        </button>
      </div>

      {/* Sticky Tab Navigation */}
      <div className={`sticky top-0 z-10 bg-white border-b transition-all duration-200 ${
        isSticky ? 'shadow-md' : ''
      }`}>
        <div className="p-4">
          <div className="bg-muted rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-2 px-4 rounded-md font-heading font-bold text-sm transition-all duration-200 ${
                activeTab === 'ingredients'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex-1 py-2 px-4 rounded-md font-heading font-bold text-sm transition-all duration-200 ${
                activeTab === 'instructions'
                  ? 'bg-white text-foreground shadow-sm'
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
            <div className="bg-white rounded-xl p-4 shadow-warm">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-foreground">Servings</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-heading font-bold text-xl w-8 text-center">{servings}</span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="space-y-3">
              {adjustedIngredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
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
              ))}
            </div>

            {/* Add to Shopping List */}
            <button className="w-full bg-white border-2 border-primary text-primary font-heading font-bold py-3 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center gap-2">
              <ShoppingCart size={20} />
              Add to Shopping List
            </button>
          </div>
        )}

        {activeTab === 'instructions' && (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="space-y-6">
              {recipe.instructions.map((instruction, index) => 
                renderInstructions(instruction, index)
              )}
            </div>

            {/* Mama's Tips */}
            {recipe.voiceTips && recipe.voiceTips.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-primary rounded-lg p-4 mt-8">
                <h3 className="font-handwritten text-lg text-primary font-bold mb-2">
                  {recipe.mamaName}'s Tips
                </h3>
                <ul className="space-y-2 font-handwritten text-foreground">
                  {recipe.voiceTips.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
                <p className="text-right mt-3 font-handwritten text-primary/70 italic">
                  — With love, {recipe.mamaName}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default RecipeDetail;