import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, Plus, Minus, ShoppingCart, Timer, Sparkles, Heart } from 'lucide-react';
import { recipes } from '@/data/recipes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [isSticky, setIsSticky] = useState(false);

  const recipe = recipes.find(r => r.id === recipeId);

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
    <div className="min-h-screen bg-gradient-subtle">
      {/* Enhanced Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70"></div>
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        
        {/* Header Controls */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all duration-200 shadow-elegant"
          >
            <ArrowLeft size={22} />
          </button>
          <button className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all duration-200 shadow-elegant">
            <Heart size={20} />
          </button>
        </div>

        {/* Enhanced Recipe Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{recipe.mamaEmoji}</span>
            <div>
              <span className="text-sm font-medium opacity-90 block">by {recipe.mamaName}</span>
              {recipe.difficulty_explanation && (
                <span className="text-xs opacity-75">{recipe.difficulty}</span>
              )}
            </div>
          </div>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-6 leading-tight">{recipe.title}</h1>
          
          {/* Enhanced Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-2 shadow-glow">
              <Clock size={18} className="text-primary-glow" />
              <span className="text-sm font-semibold">{recipe.cookingTime}</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-2 shadow-glow">
              <Users size={18} className="text-primary-glow" />
              <span className="text-sm font-semibold">{recipe.servings} servings</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-2 shadow-glow">
              <ChefHat size={18} className="text-primary-glow" />
              <span className="text-sm font-semibold">{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Description Card */}
      <div className="mx-6 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-8 shadow-elegant">
          <p className="text-muted-foreground leading-relaxed text-lg font-medium mb-4">
            {recipe.description}
          </p>
          {recipe.difficulty_explanation && (
            <div className="flex items-start gap-3 p-4 bg-gradient-subtle rounded-2xl">
              <Sparkles size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Why {recipe.difficulty}?</p>
                <p className="text-sm text-muted-foreground">{recipe.difficulty_explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Tabs Section */}
      <div className="px-6 pt-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'ingredients' | 'instructions')}>
          <div className={`sticky top-0 z-20 bg-gradient-subtle py-4 transition-all duration-300 ${
            isSticky ? 'shadow-md backdrop-blur-md bg-white/95' : ''
          }`}>
            <TabsList className="w-full h-14 p-2 bg-white rounded-2xl shadow-elegant">
              <TabsTrigger 
                value="ingredients" 
                className="flex-1 h-10 rounded-xl font-heading font-bold text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all duration-200"
              >
                Ingredients
              </TabsTrigger>
              <TabsTrigger 
                value="instructions" 
                className="flex-1 h-10 rounded-xl font-heading font-bold text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all duration-200"
              >
                Instructions
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="pt-6 pb-32">
            <TabsContent value="ingredients" className="space-y-8 mt-0">
              {/* Enhanced Serving Adjuster */}
              <div className="bg-white rounded-3xl p-6 shadow-elegant">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-foreground">Adjust Servings</h3>
                    <p className="text-sm text-muted-foreground">Recipe serves {recipe.servings} by default</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="w-12 h-12 bg-gradient-subtle rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-elegant"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-heading font-bold text-2xl w-12 text-center text-primary">{servings}</span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      className="w-12 h-12 bg-gradient-subtle rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-elegant"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Ingredients List */}
              <div className="bg-white rounded-3xl p-6 shadow-elegant">
                <h3 className="font-heading font-bold text-xl text-foreground mb-6">Ingredients</h3>
                <div className="space-y-4">
                  {adjustedIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gradient-subtle rounded-2xl hover:shadow-sm transition-all duration-200">
                      <button
                        onClick={() => toggleIngredient(index)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                          checkedIngredients.has(index)
                            ? 'bg-primary border-primary text-primary-foreground shadow-glow'
                            : 'border-muted-foreground/30 hover:border-primary hover:shadow-sm'
                        }`}
                      >
                        {checkedIngredients.has(index) && (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12"></polyline>
                          </svg>
                        )}
                      </button>
                      <span className={`flex-1 font-medium transition-all duration-200 ${
                        checkedIngredients.has(index) 
                          ? 'text-muted-foreground line-through' 
                          : 'text-foreground'
                      }`}>
                        {ingredient}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Shopping List Button */}
              <button className="w-full bg-white border-2 border-primary text-primary font-heading font-bold py-4 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center gap-3 shadow-elegant hover:shadow-glow">
                <ShoppingCart size={22} />
                Add to Shopping List
              </button>
            </TabsContent>

            <TabsContent value="instructions" className="space-y-8 mt-0">
              {/* Enhanced Instructions */}
              <div className="bg-white rounded-3xl p-6 shadow-elegant">
                <h3 className="font-heading font-bold text-xl text-foreground mb-6">Cooking Steps</h3>
                <div className="space-y-8">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-6">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg flex-shrink-0 shadow-glow">
                        {index + 1}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-foreground leading-relaxed font-medium text-lg">
                          {instruction.split(/(\d+\s*(?:minutes?|mins?|hours?|hrs?))/gi).map((part, i) => 
                            /\d+\s*(?:minutes?|mins?|hours?|hrs?)/gi.test(part) ? (
                              <span key={i} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-semibold mx-1">
                                <Timer size={16} />
                                {part}
                              </span>
                            ) : part
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Mama's Tips */}
              {recipe.voiceTips && recipe.voiceTips.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-primary rounded-3xl p-8 shadow-elegant">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{recipe.mamaEmoji}</span>
                    <h3 className="font-heading text-xl text-primary font-bold">
                      {recipe.mamaName}'s Secret Tips
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {recipe.voiceTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Sparkles size={16} className="text-primary mt-1 flex-shrink-0" />
                        <p className="text-foreground font-medium leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-right mt-6 font-handwritten text-primary/70 italic text-lg">
                    — With love, {recipe.mamaName}
                  </p>
                </div>
              )}

              {/* Cooking Tips */}
              {recipe.cookingTips && recipe.cookingTips.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-elegant">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-4">Pro Tips</h3>
                  <div className="space-y-3">
                    {recipe.cookingTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gradient-subtle rounded-2xl">
                        <ChefHat size={16} className="text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Enhanced Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={handleStartCooking}
          className="w-full bg-gradient-primary text-primary-foreground font-heading font-bold py-5 rounded-2xl shadow-glow hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-4 gentle-pulse"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-xl">{recipe.mamaEmoji}</span>
          </div>
          <span className="text-lg">Start Cooking with {recipe.mamaName.split(' ')[0]}</span>
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;