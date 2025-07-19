
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Clock, Star, Crown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stackRecipes, setStackRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [celebrationTrigger, setCelebrationTrigger] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'heart' | 'confetti' | 'cultural'>('heart');
  const [culturalTheme, setCulturalTheme] = useState<'italian' | 'mexican' | 'thai' | undefined>(undefined);

  const categories = [
    { id: 'All', label: 'All Recipes', emoji: '📖' },
    { id: 'Meat', label: 'Meat Dishes', emoji: '🥩' },
    { id: 'Fish', label: 'Seafood', emoji: '🐟' },
    { id: 'Vegetarian', label: 'Vegetarian', emoji: '🥬' },
    { id: 'Quick', label: 'Quick Meals', emoji: '⚡' },
    { id: 'Weekend', label: 'Weekend', emoji: '🏠' },
  ];

  useEffect(() => {
    // Simulate loading time
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let recipesToShow: Recipe[] = [];
    
    if (searchQuery) {
      // Independent search - search all recipes
      const allRecipes = [...getFeaturedRecipes(), ...getRecipesByCategory('Meat'), ...getRecipesByCategory('Fish'), ...getRecipesByCategory('Rice/Pasta'), ...getRecipesByCategory('Dessert')];
      const uniqueRecipes = allRecipes.filter((recipe, index, self) => 
        index === self.findIndex(r => r.id === recipe.id)
      );
      
      recipesToShow = uniqueRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.mamaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      // Category browsing with 3D stack
      if (selectedCategory === 'All') {
        recipesToShow = getFeaturedRecipes();
      } else {
        recipesToShow = getRecipesByCategory(selectedCategory);
      }
    }
    
    setStackRecipes(recipesToShow);
  }, [searchQuery, selectedCategory]);

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

  if (loading) {
    return (
      <PageTransition>
        <div className="h-full flex flex-col">
          <LoadingSkeleton variant="hero" />
          <div className="flex-1 flex items-center justify-center">
            <LoadingSkeleton 
              variant="cooking" 
              cultural={selectedCategory === 'All' ? undefined : 
                selectedCategory === 'Meat' ? 'italian' :
                selectedCategory === 'Fish' ? 'thai' :
                selectedCategory === 'Vegetarian' ? 'mexican' : undefined
              }
            />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="h-full flex flex-col">
        {/* Classical Recipe of the Week Hero */}
        {recipeOfWeek && !searchQuery && (
          <div className="mb-6 relative overflow-hidden rounded-xl bg-card shadow-classical border border-classical">
            <div className="p-4 relative bg-paper-texture">
              <div className="absolute top-4 right-4 opacity-20">
                <Crown size={32} className="text-primary" />
              </div>
              <div className="relative max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={14} className="text-primary" />
                  <span className="text-xs font-heading font-semibold tracking-wider uppercase text-muted-foreground">
                    Recipe of the Week
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl mb-1 text-foreground">
                  {recipeOfWeek.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 font-handwritten">
                  by {recipeOfWeek.mamaName}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{recipeOfWeek.cookingTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={14} />
                    <span>{recipeOfWeek.difficulty}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleRecipeClick(recipeOfWeek)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-heading font-medium hover:bg-primary/90 transition-colors shadow-paper border border-primary/20"
                >
                  Cook This Week's Special
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Classical Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes, ingredients, or cooking guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-classical focus:border-primary rounded-lg shadow-paper transition-all duration-200"
          />
        </div>

        {/* Classical Category Carousel */}
        {!searchQuery && (
          <div className="mb-6 relative">
            <Carousel
              opts={{
                align: "start",
                dragFree: true,
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {categories.map((category) => (
                  <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-auto">
                    <button
                      className={`cursor-pointer p-4 rounded-xl transition-all duration-300 min-w-[140px] text-center border ${
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground shadow-classical border-primary scale-105'
                          : 'bg-card hover:bg-muted/50 hover:shadow-paper border-classical hover:border-primary/30'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="text-xl mb-2">{category.emoji}</div>
                      <div className="font-heading font-medium text-sm">{category.label}</div>
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex shadow-paper" />
              <CarouselNext className="hidden md:flex shadow-paper" />
            </Carousel>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {searchQuery ? (
            /* Search Results Mode */
            <div>
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
                      className="bg-card rounded-xl p-4 shadow-paper hover:shadow-classical cursor-pointer transition-all duration-200 border border-classical"
                    >
                      <h4 className="font-heading font-bold text-lg text-foreground mb-1">{recipe.title}</h4>
                      <p className="text-muted-foreground text-sm mb-2 font-handwritten">by {recipe.mamaName}</p>
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
          ) : (
            /* Category Browsing Mode - 3D Card Stack */
            <div>
              {stackRecipes.length > 0 ? (
                <div>
                   <h3 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                     <span className="text-xl">
                       {categories.find(cat => cat.id === selectedCategory)?.emoji || '📖'}
                     </span>
                     {selectedCategory === 'All' ? 'Featured' : selectedCategory} Recipes
                     <span className="text-sm text-muted-foreground font-normal">
                       ({stackRecipes.length})
                     </span>
                   </h3>
                  <RecipeCardStack
                    recipes={stackRecipes}
                    onLike={handleLikeRecipe}
                    onDislike={handleDislikeRecipe}
                    onTap={handleRecipeClick}
                  />
                </div>
              ) : (
                <CulturalEmptyState 
                  cultural={
                    selectedCategory === 'Meat' ? 'italian' :
                    selectedCategory === 'Fish' ? 'thai' :
                    selectedCategory === 'Vegetarian' ? 'mexican' : undefined
                  }
                  message={
                    selectedCategory === 'All' 
                      ? "No recipes available right now."
                      : `No ${selectedCategory.toLowerCase()} recipes available yet.`
                  }
                />
              )}
            </div>
          )}
        </div>

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
