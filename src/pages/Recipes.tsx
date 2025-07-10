import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Clock, Star, Crown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getRecipeOfWeek, getFeaturedRecipes, getRecipesByCategory, Recipe } from '@/data/recipes';
import RecipeCardStack from '@/components/RecipeCardStack';
import LoadingSkeleton from '@/components/LoadingSkeleton';
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

  const categories = ['All', 'Meat', 'Fish', 'Rice/Pasta', 'Dessert'];

  useEffect(() => {
    // Simulate loading time
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let recipesToShow: Recipe[] = [];
    
    if (selectedCategory === 'All') {
      recipesToShow = getFeaturedRecipes();
    } else {
      recipesToShow = getRecipesByCategory(selectedCategory);
    }
    
    // Filter by search query if exists
    if (searchQuery) {
      recipesToShow = recipesToShow.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.mamaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    setStackRecipes(recipesToShow);
  }, [searchQuery, selectedCategory]);

  const handleLikeRecipe = (recipe: Recipe) => {
    const newLiked = new Set(likedRecipes);
    newLiked.add(recipe.id);
    setLikedRecipes(newLiked);
    
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
            <LoadingSkeleton variant="recipe" count={3} />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="h-full flex flex-col">
        {/* Compact Recipe of the Week Hero */}
        {recipeOfWeek && !searchQuery && (
          <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-primary shadow-glow">
            <div className="p-6 text-white relative">
              <div className="absolute top-4 right-4 opacity-20">
                <Star size={60} className="text-white" />
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={20} className="text-yellow-300" />
                  <span className="text-sm font-bold tracking-wider opacity-90">RECIPE OF THE WEEK</span>
                </div>
                <h3 className="font-heading font-bold text-2xl mb-2">{recipeOfWeek.title}</h3>
                <p className="text-sm opacity-90 mb-3">by {recipeOfWeek.mamaName}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{recipeOfWeek.cookingTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={16} />
                    <span>{recipeOfWeek.difficulty}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleRecipeClick(recipeOfWeek)}
                  className="mt-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-heading font-medium hover:bg-white/30 transition-all duration-200"
                >
                  Cook This Week's Special
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes, ingredients, or cooking guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/80 backdrop-blur-sm border-primary/20 focus:border-primary rounded-xl"
          />
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap transition-all duration-200 hover-scale ${
                selectedCategory === category
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'hover:bg-primary/10'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Main Content - 3D Card Stack */}
        <div className="flex-1">
          {searchQuery && (
            <div className="mb-4">
              <p className="text-muted-foreground">
                {stackRecipes.length} result{stackRecipes.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
          )}

          {stackRecipes.length > 0 ? (
            <div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                <span className="text-xl">
                  {selectedCategory === 'All' ? '✨' :
                   selectedCategory === 'Meat' ? '🥩' : 
                   selectedCategory === 'Fish' ? '🐟' : 
                   selectedCategory === 'Rice/Pasta' ? '🍝' : '🍰'}
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
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-sm">
                <span className="text-6xl mb-4 block">🍽️</span>
                <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                  No recipes found
                </h3>
                <p className="text-muted-foreground font-handwritten">
                  {searchQuery 
                    ? "No recipes found matching your search. Try different keywords!"
                    : selectedCategory === 'All' 
                      ? "No recipes available right now."
                      : `No ${selectedCategory.toLowerCase()} recipes available yet.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Recipes;