import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Clock, Sparkles, Utensils, Fish, Leaf, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getRecipeOfWeek, getFeaturedRecipes, getRecipesByCategory, Recipe } from '@/data/recipes';
import { getMamaById } from '@/data/mamas';
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
  const recipeOfWeekMama = recipeOfWeek ? getMamaById(recipeOfWeek.mamaId) : null;

  // Cultural styling helper
  const getCulturalStyles = (mamaId: number) => {
    switch (mamaId) {
      case 1: // Italian
        return {
          bgClass: 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50',
          borderClass: 'border-l-4 border-l-orange-400',
          accentColor: 'text-orange-700',
          pattern: 'bg-italian-pattern',
          decorativeElement: '🍃'
        };
      case 2: // Mexican
        return {
          bgClass: 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50',
          borderClass: 'border-l-4 border-l-red-400',
          accentColor: 'text-red-700',
          pattern: 'bg-mexican-pattern',
          decorativeElement: '🌶️'
        };
      case 3: // Thai
        return {
          bgClass: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
          borderClass: 'border-l-4 border-l-green-400',
          accentColor: 'text-green-700',
          pattern: 'bg-thai-pattern',
          decorativeElement: '🌿'
        };
      default:
        return {
          bgClass: 'bg-gradient-to-br from-background to-muted/20',
          borderClass: 'border-l-4 border-l-primary',
          accentColor: 'text-primary',
          pattern: '',
          decorativeElement: '✨'
        };
    }
  };

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
      <div className="h-full flex flex-col space-y-6">
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

        {/* Enhanced Category Carousel */}
        {!searchQuery && (
          <div className="relative">
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
                  const isSelected = selectedCategory === category.id;
                  
                  return (
                    <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-auto">
                      <div
                        className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 border min-w-[100px] text-center transform hover:scale-105 ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                            : 'bg-card hover:bg-muted border-border/50 hover:border-border shadow-sm hover:shadow-md'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="mb-1 flex justify-center">
                          <IconComponent 
                            size={18} 
                            className={`transition-all duration-300 ${
                              isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                            }`} 
                          />
                        </div>
                        <div className={`font-medium text-xs transition-all duration-300 ${
                          isSelected ? 'text-primary-foreground' : 'text-foreground'
                        }`}>
                          {category.label}
                        </div>
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
            /* Category Browsing Mode - HERO: Tinder Stack */
            <div className="space-y-8">
              {/* HERO: Tinder Card Stack */}
              {stackRecipes.length > 0 ? (
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-6 flex items-center gap-2">
                    <span className="flex items-center justify-center">
                      {(() => {
                        const category = categories.find(cat => cat.id === selectedCategory);
                        if (category) {
                          const IconComponent = category.icon;
                          return <IconComponent size={20} className="text-primary" />;
                        }
                        return <Sparkles size={20} className="text-primary" />;
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

              {/* Cultural Recipe of the Week Card */}
              {recipeOfWeek && recipeOfWeekMama && (
                <div className="mt-8">
                  <div 
                    className={`relative rounded-2xl overflow-hidden shadow-cultural cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                      getCulturalStyles(recipeOfWeek.mamaId).bgClass
                    } ${getCulturalStyles(recipeOfWeek.mamaId).pattern} ${
                      getCulturalStyles(recipeOfWeek.mamaId).borderClass
                    }`}
                    onClick={() => handleRecipeClick(recipeOfWeek)}
                  >
                    {/* Decorative Cultural Elements */}
                    <div className="absolute top-4 right-4 text-2xl opacity-20">
                      {getCulturalStyles(recipeOfWeek.mamaId).decorativeElement}
                    </div>
                    <div className="absolute bottom-4 left-4 text-6xl opacity-5">
                      {getCulturalStyles(recipeOfWeek.mamaId).decorativeElement}
                    </div>

                    <div className="flex items-center p-6">
                      {/* Recipe Photo */}
                      <div className="w-24 h-24 bg-white/80 backdrop-blur-sm rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg mr-6">
                        <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                          <Utensils size={24} className="text-muted-foreground" />
                        </div>
                      </div>
                      
                      {/* Recipe Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="secondary" 
                            className="bg-white/90 backdrop-blur-sm text-xs font-medium"
                          >
                            Recipe of the Week
                          </Badge>
                        </div>
                        
                        <h3 className={`font-heading font-bold text-2xl mb-2 ${
                          getCulturalStyles(recipeOfWeek.mamaId).accentColor
                        }`}>
                          {recipeOfWeek.title}
                        </h3>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{recipeOfWeekMama.emoji}</span>
                          <p className="text-foreground/80 font-medium">
                            by {recipeOfWeek.mamaName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
