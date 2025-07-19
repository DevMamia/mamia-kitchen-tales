
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Clock, Utensils } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getRecipeOfWeek, getFeaturedRecipes, getRecipesByCategory, Recipe } from '@/data/recipes';
import { getMamaById } from '@/data/mamas';
import RecipeCardStack from '@/components/RecipeCardStack';
import CulturalEmptyState from '@/components/CulturalEmptyState';
import { CelebrationEffects } from '@/components/CelebrationEffects';
import PageTransition from '@/components/PageTransition';
import { useToast } from '@/hooks/use-toast';

const Recipes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [stackRecipes, setStackRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [celebrationTrigger, setCelebrationTrigger] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'heart' | 'confetti' | 'cultural'>('heart');
  const [culturalTheme, setCulturalTheme] = useState<'italian' | 'mexican' | 'thai' | undefined>(undefined);

  useEffect(() => {
    let recipesToShow: Recipe[] = [];
    
    if (searchQuery) {
      // Search functionality - includes category searching
      const allRecipes = [...getFeaturedRecipes(), ...getRecipesByCategory('Meat'), ...getRecipesByCategory('Fish'), ...getRecipesByCategory('Rice/Pasta'), ...getRecipesByCategory('Dessert')];
      const uniqueRecipes = allRecipes.filter((recipe, index, self) => 
        index === self.findIndex(r => r.id === recipe.id)
      );
      
      recipesToShow = uniqueRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.mamaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      // Default: Show featured recipes for swiping
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
  const recipeOfWeekMama = recipeOfWeek ? getMamaById(recipeOfWeek.mamaId) : null;

  // Cultural styling helper
  const getCulturalAccent = (mamaId: number) => {
    switch (mamaId) {
      case 1: return 'hsl(25, 82%, 65%)'; // Italian orange
      case 2: return 'hsl(350, 80%, 60%)'; // Mexican red
      case 3: return 'hsl(120, 60%, 50%)'; // Thai green
      default: return 'hsl(var(--primary))';
    }
  };

  return (
    <PageTransition>
      <div className="h-full flex flex-col space-y-6">
        {/* HERO: Tinder Card Stack */}
        {!searchQuery && stackRecipes.length > 0 && (
          <RecipeCardStack
            recipes={stackRecipes}
            onLike={handleLikeRecipe}
            onDislike={handleDislikeRecipe}
            onTap={handleRecipeClick}
          />
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border focus:border-border focus:ring-1 focus:ring-border"
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                Search Results
              </h3>
              <p className="text-muted-foreground">
                {stackRecipes.length} result{stackRecipes.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
            
            {stackRecipes.length > 0 ? (
              <div className="grid gap-4">
                {stackRecipes.map((recipe) => (
                  <div 
                    key={recipe.id}
                    onClick={() => handleRecipeClick(recipe)}
                    className="bg-card rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 border border-border hover:border-border"
                  >
                    <h4 className="font-heading font-bold text-lg text-foreground mb-1">{recipe.title}</h4>
                    <p className="text-muted-foreground text-sm mb-2">by {recipe.mamaName}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{recipe.cookingTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{recipe.difficulty}</span>
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

        {/* Recipe of the Week - Bottom when not searching */}
        {!searchQuery && recipeOfWeek && recipeOfWeekMama && (
          <div className="mt-8">
            <div 
              className="relative rounded-xl overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] bg-card border"
              style={{ borderColor: getCulturalAccent(recipeOfWeek.mamaId) }}
              onClick={() => handleRecipeClick(recipeOfWeek)}
            >
              <div className="flex items-center p-4">
                {/* Recipe placeholder image */}
                <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center mr-4">
                  <Utensils size={20} className="text-muted-foreground" />
                </div>
                
                {/* Recipe Info */}
                <div className="flex-1">
                  <Badge 
                    variant="secondary" 
                    className="mb-2 text-xs"
                    style={{ backgroundColor: `${getCulturalAccent(recipeOfWeek.mamaId)}20` }}
                  >
                    Recipe of the Week
                  </Badge>
                  
                  <h3 className="font-heading font-bold text-lg mb-1" style={{ color: getCulturalAccent(recipeOfWeek.mamaId) }}>
                    {recipeOfWeek.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <span>{recipeOfWeekMama.emoji}</span>
                    <p className="text-muted-foreground text-sm">
                      by {recipeOfWeek.mamaName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state for no recipes when not searching */}
        {!searchQuery && stackRecipes.length === 0 && (
          <CulturalEmptyState 
            message="No recipes available right now."
            className="flex-1 flex items-center justify-center"
          />
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
