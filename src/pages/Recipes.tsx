
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Users, Utensils } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getRecipeOfWeek, getFeaturedRecipes, getRecipesByCategory, Recipe } from '@/data/recipes';
import RecipeCardStack from '@/components/RecipeCardStack';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import CulturalEmptyState from '@/components/CulturalEmptyState';
import { CelebrationEffects } from '@/components/CelebrationEffects';
import PageTransition from '@/components/PageTransition';
import { useToast } from '@/hooks/use-toast';

const Recipes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stackRecipes, setStackRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [celebrationTrigger, setCelebrationTrigger] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'heart' | 'confetti' | 'cultural'>('heart');
  const [culturalTheme, setCulturalTheme] = useState<'italian' | 'mexican' | 'thai' | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let recipesToShow: Recipe[] = [];
    
    if (searchQuery) {
      // Search all recipes including category terms
      const allRecipes = [...getFeaturedRecipes(), ...getRecipesByCategory('Meat'), ...getRecipesByCategory('Fish'), ...getRecipesByCategory('Rice/Pasta'), ...getRecipesByCategory('Dessert')];
      const uniqueRecipes = allRecipes.filter((recipe, index, self) => 
        index === self.findIndex(r => r.id === recipe.id)
      );
      
      recipesToShow = uniqueRecipes.filter(recipe => {
        const searchLower = searchQuery.toLowerCase();
        return (
          recipe.title.toLowerCase().includes(searchLower) ||
          recipe.mamaName.toLowerCase().includes(searchLower) ||
          recipe.category.toLowerCase().includes(searchLower) ||
          recipe.difficulty.toLowerCase().includes(searchLower) ||
          recipe.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(searchLower)
          )
        );
      });
    } else {
      // Show featured recipes by default
      recipesToShow = getFeaturedRecipes();
    }
    
    setStackRecipes(recipesToShow);
  }, [searchQuery]);

  const handleLikeRecipe = (recipe: Recipe) => {
    const newLiked = new Set(likedRecipes);
    newLiked.add(recipe.id);
    setLikedRecipes(newLiked);
    
    // Determine cultural theme and trigger celebration
    const cultural = recipe.mamaId === 1 ? 'italian' : recipe.mamaId === 2 ? 'mexican' : recipe.mamaId === 3 ? 'thai' : undefined;
    setCulturalTheme(cultural);
    setCelebrationType('heart');
    setCelebrationTrigger(true);
    
    // Reset celebration trigger
    setTimeout(() => setCelebrationTrigger(false), 100);
    
    toast({
      title: "Added to favorites! ❤️",
      description: `${recipe.title} has been saved to your favorites.`,
    });
  };

  const handleDislikeRecipe = (recipe: Recipe) => {
    toast({
      title: "Not interested",
      description: `We'll show you fewer recipes like ${recipe.title}.`,
    });
  };

  const handleRecipeClick = (recipe: Recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  const recipeOfWeek = getRecipeOfWeek();

  // Get cultural styling for Recipe of the Week
  const getCulturalStyling = (mamaId: number) => {
    switch (mamaId) {
      case 1: // Italian
        return {
          bgGradient: 'bg-gradient-to-br from-orange-50 to-amber-50',
          textColor: 'text-orange-900',
          accentColor: 'text-orange-700',
          borderColor: 'border-orange-200',
          pattern: 'bg-italian-pattern'
        };
      case 2: // Mexican
        return {
          bgGradient: 'bg-gradient-to-br from-red-50 to-orange-50',
          textColor: 'text-red-900',
          accentColor: 'text-red-700',
          borderColor: 'border-red-200',
          pattern: 'bg-mexican-pattern'
        };
      case 3: // Thai
        return {
          bgGradient: 'bg-gradient-to-br from-emerald-50 to-yellow-50',
          textColor: 'text-emerald-900',
          accentColor: 'text-emerald-700',
          borderColor: 'border-emerald-200',
          pattern: 'bg-thai-pattern'
        };
      default:
        return {
          bgGradient: 'bg-gradient-to-br from-primary/5 to-primary/10',
          textColor: 'text-primary',
          accentColor: 'text-primary/80',
          borderColor: 'border-primary/20',
          pattern: ''
        };
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="h-full flex flex-col">
          <LoadingSkeleton variant="hero" />
          <div className="flex-1 flex items-center justify-center">
            <LoadingSkeleton variant="cooking" />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="h-full flex flex-col space-y-8">
        {/* Enhanced Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search recipes, ingredients, cuisine, difficulty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg bg-card border-border focus:border-primary/30 focus:ring-2 focus:ring-primary/20 rounded-2xl shadow-sm"
          />
        </div>

        {/* Hero Tinder Card Stack */}
        {!searchQuery && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-heading font-bold text-3xl text-foreground">
                Discover Your Next Favorite
              </h2>
              <p className="text-muted-foreground text-lg">
                Swipe through authentic recipes from our mamas
              </p>
            </div>
            
            {stackRecipes.length > 0 ? (
              <RecipeCardStack
                recipes={stackRecipes}
                onLike={handleLikeRecipe}
                onDislike={handleDislikeRecipe}
                onTap={handleRecipeClick}
              />
            ) : (
              <CulturalEmptyState 
                message="No recipes available right now."
                className="py-12"
              />
            )}
          </div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
                Search Results
              </h3>
              <p className="text-muted-foreground text-lg">
                {stackRecipes.length} result{stackRecipes.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
            
            {stackRecipes.length > 0 ? (
              <div className="grid gap-4">
                {stackRecipes.map((recipe) => (
                  <div 
                    key={recipe.id}
                    onClick={() => handleRecipeClick(recipe)}
                    className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 border border-border hover:border-primary/20 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-muted rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Utensils size={24} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{recipe.mamaEmoji}</span>
                          <span className="text-sm text-muted-foreground">by {recipe.mamaName}</span>
                        </div>
                        <h4 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                          {recipe.title}
                        </h4>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{recipe.cookingTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>{recipe.servings} servings</span>
                          </div>
                          <span className="px-2 py-1 bg-muted rounded-full text-xs">
                            {recipe.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <CulturalEmptyState 
                message="No recipes found matching your search. Try different keywords!"
                className="py-12"
              />
            )}
          </div>
        )}

        {/* Featured Recipe of the Week - Cultural Themed */}
        {recipeOfWeek && !searchQuery && (
          <div className="mt-auto">
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Featured This Week
              </p>
            </div>
            
            <div 
              className={`
                relative rounded-3xl overflow-hidden shadow-warm border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group
                ${getCulturalStyling(recipeOfWeek.mamaId).bgGradient}
                ${getCulturalStyling(recipeOfWeek.mamaId).borderColor}
                ${getCulturalStyling(recipeOfWeek.mamaId).pattern}
              `}
              onClick={() => handleRecipeClick(recipeOfWeek)}
            >
              <div className="flex items-center p-6">
                {/* Recipe Photo Placeholder */}
                <div className="w-24 h-24 bg-white/50 backdrop-blur-sm rounded-2xl flex-shrink-0 flex items-center justify-center mr-6 group-hover:scale-105 transition-transform">
                  <Utensils size={28} className={getCulturalStyling(recipeOfWeek.mamaId).accentColor} />
                </div>
                
                {/* Recipe Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{recipeOfWeek.mamaEmoji}</span>
                    <span className={`text-sm font-medium ${getCulturalStyling(recipeOfWeek.mamaId).accentColor}`}>
                      by {recipeOfWeek.mamaName}
                    </span>
                  </div>
                  <h3 className={`font-heading font-bold text-2xl ${getCulturalStyling(recipeOfWeek.mamaId).textColor} group-hover:scale-[1.02] transition-transform origin-left`}>
                    {recipeOfWeek.title}
                  </h3>
                  <div className={`flex items-center gap-4 text-sm ${getCulturalStyling(recipeOfWeek.mamaId).accentColor}`}>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{recipeOfWeek.cookingTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{recipeOfWeek.servings} servings</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subtle cultural accent */}
              <div className="absolute top-4 right-4 opacity-20 text-4xl">
                {recipeOfWeek.mamaId === 1 && '🫒'}
                {recipeOfWeek.mamaId === 2 && '🌶️'}
                {recipeOfWeek.mamaId === 3 && '🌿'}
              </div>
            </div>
          </div>
        )}

        {/* Celebration Effects */}
        <CelebrationEffects
          type={celebrationType}
          cultural={culturalTheme}
          trigger={celebrationTrigger}
          onComplete={() => setCelebrationTrigger(false)}
        />
      </div>
    </PageTransition>
  );
};

export default Recipes;
