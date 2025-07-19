import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Clock, Sparkles, Utensils, Fish, Leaf, Home } from 'lucide-react';
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
    { id: 'All', label: 'All Recipes', icon: Sparkles },
    { id: 'Meat', label: 'Meat', icon: Utensils },
    { id: 'Fish', label: 'Fish', icon: Fish },
    { id: 'Vegetarian', label: 'Vegetarian', icon: Leaf },
    { id: 'Quick', label: 'Quick Meals', icon: Clock },
    { id: 'Weekend', label: 'Weekend', icon: Home },
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
        {/* Simplified Recipe of the Week with Photo */}
        {recipeOfWeek && !searchQuery && (
          <div className="mb-6 relative rounded-lg bg-card border border-border shadow-sm overflow-hidden">
            <div 
              onClick={() => handleRecipeClick(recipeOfWeek)}
              className="cursor-pointer"
            >
              <div className="flex">
                {/* Recipe Photo Placeholder */}
                <div className="w-24 h-24 bg-muted flex-shrink-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                    <Utensils size={20} className="text-muted-foreground" />
                  </div>
                </div>
                
                {/* Recipe Info */}
                <div className="flex-1 p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Recipe of the Week
                  </p>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                    {recipeOfWeek.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    by {recipeOfWeek.mamaName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simplified Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border focus:border-border focus:ring-1 focus:ring-border"
          />
        </div>

        {/* Simplified Category Carousel with Icons */}
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
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-auto">
                      <div
                        className={`cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 border min-w-[100px] text-center ${
                          selectedCategory === category.id
                            ? 'bg-card text-foreground border-border shadow-sm'
                            : 'bg-background hover:bg-card border-border/50 hover:border-border'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="mb-1 flex justify-center">
                          <IconComponent size={16} className="text-muted-foreground" />
                        </div>
                        <div className="font-medium text-xs text-foreground">{category.label}</div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
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
                <div className="grid gap-3">
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
          ) : (
            /* Category Browsing Mode - 3D Card Stack */
            <div>
              {stackRecipes.length > 0 ? (
                <div>
                   <h3 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                     <span className="flex items-center justify-center">
                       {(() => {
                         const category = categories.find(cat => cat.id === selectedCategory);
                         if (category) {
                           const IconComponent = category.icon;
                           return <IconComponent size={18} className="text-muted-foreground" />;
                         }
                         return <Sparkles size={18} className="text-muted-foreground" />;
                       })()}
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
