
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Heart, X } from 'lucide-react';
import { recipes, getFeaturedRecipes, getRecipeOfWeek, getRecipesByCategory } from '@/data/recipes';
import RecipeCard from '@/components/RecipeCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import RecipeCardStack from '@/components/RecipeCardStack';
import MasonryRecipeGrid from '@/components/MasonryRecipeGrid';
import PageTransition from '@/components/PageTransition';
import { useToast } from '@/hooks/use-toast';

const categories = ['All', 'Meat', 'Fish', 'Rice/Pasta', 'Dessert'];

const Recipes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [viewMode, setViewMode] = useState<'discover' | 'browse'>('discover');
  const [likedRecipes, setLikedRecipes] = useState<string[]>([]);
  
  const recipeOfWeek = getRecipeOfWeek();
  const featuredRecipes = getFeaturedRecipes();

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, []);

  useEffect(() => {
    let filtered = getRecipesByCategory(selectedCategory);
    
    if (searchQuery) {
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.mamaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredRecipes(filtered);
  }, [searchQuery, selectedCategory]);

  const handleLikeRecipe = (recipe: any) => {
    setLikedRecipes(prev => [...prev, recipe.id]);
    toast({
      title: "Recipe saved!",
      description: `${recipe.title} has been added to your favorites.`,
    });
  };

  const handleDislikeRecipe = (recipe: any) => {
    toast({
      title: "Recipe skipped",
      description: "We'll find you something else delicious!",
    });
  };

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <PageTransition>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
            Discover Recipes
          </h1>
          <p className="text-muted-foreground font-handwritten">
            Swipe through delicious dishes from our authentic mamas
          </p>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setViewMode('discover')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'discover' 
                  ? 'bg-primary text-primary-foreground shadow-warm' 
                  : 'bg-white text-foreground shadow-sm hover:shadow-warm'
              }`}
            >
              🎯 Discover
            </button>
            <button
              onClick={() => setViewMode('browse')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'browse' 
                  ? 'bg-primary text-primary-foreground shadow-warm' 
                  : 'bg-white text-foreground shadow-sm hover:shadow-warm'
              }`}
            >
              📚 Browse All
            </button>
          </div>
        </div>

        {/* Search Bar (only in browse mode) */}
        {viewMode === 'browse' && (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search recipes, mamas, or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-0 shadow-warm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-warm'
                      : 'bg-white text-foreground shadow-sm hover:shadow-warm'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-6">
              <LoadingSkeleton variant="hero" />
              <div>
                <div className="w-32 h-6 bg-muted rounded mb-3"></div>
                <div className="grid grid-cols-1 gap-4">
                  <LoadingSkeleton variant="recipe" count={3} />
                </div>
              </div>
            </div>
          ) : viewMode === 'discover' ? (
            /* DISCOVER MODE - 3D Card Stack */
            <div className="space-y-8">
              {/* Featured Recipes Stack */}
              {featuredRecipes.length > 0 && (
                <div className="text-center space-y-6">
                  <div>
                    <h2 className="font-heading font-bold text-xl text-foreground mb-2">
                      🔥 Hot Right Now
                    </h2>
                    <p className="text-muted-foreground font-handwritten text-sm">
                      Swipe right to save, left to skip, tap to view
                    </p>
                  </div>
                  
                  <RecipeCardStack
                    recipes={featuredRecipes}
                    onLike={handleLikeRecipe}
                    onDislike={handleDislikeRecipe}
                    onTap={(recipe) => navigate(`/recipe/${recipe.id}`)}
                  />
                </div>
              )}

              {/* Category Stacks */}
              <div className="space-y-8">
                {categories.filter(cat => cat !== 'All').map((category) => {
                  const categoryRecipes = getRecipesByCategory(category);
                  if (categoryRecipes.length === 0) return null;
                  
                  return (
                    <div key={category} className="text-center space-y-4">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                          {category === 'Rice/Pasta' ? '🍝' : 
                           category === 'Meat' ? '🥩' :
                           category === 'Fish' ? '🐟' : '🍰'} {category} Recipes
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {categoryRecipes.length} delicious options
                        </p>
                      </div>
                      
                      <RecipeCardStack
                        recipes={categoryRecipes}
                        onLike={handleLikeRecipe}
                        onDislike={handleDislikeRecipe}
                        onTap={(recipe) => navigate(`/recipe/${recipe.id}`)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* BROWSE MODE - Enhanced Grid */
            <>
              {/* Recipe of the Week */}
              {recipeOfWeek && selectedCategory === 'All' && !searchQuery && (
                <div className="mb-8">
                  <RecipeCard
                    recipe={recipeOfWeek}
                    variant="hero"
                    onClick={() => navigate(`/recipe/${recipeOfWeek.id}`)}
                  />
                </div>
              )}

              {/* Recipe Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-bold text-xl text-foreground">
                    {searchQuery 
                      ? `Search Results (${filteredRecipes.length})` 
                      : selectedCategory === 'All' 
                        ? 'All Recipes' 
                        : `${selectedCategory} Recipes`
                    }
                  </h2>
                  {filteredRecipes.length > 0 && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Filter size={16} />
                      <span className="text-sm">{filteredRecipes.length}</span>
                    </div>
                  )}
                </div>
                
                {filteredRecipes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                      No recipes found
                    </h3>
                    <p className="text-muted-foreground text-center max-w-sm font-handwritten">
                      {searchQuery 
                        ? `No recipes match "${searchQuery}". Try different keywords or browse categories.`
                        : `No ${selectedCategory.toLowerCase()} recipes available yet. Our mamas are working on it!`
                      }
                    </p>
                    {(searchQuery || selectedCategory !== 'All') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All');
                        }}
                        className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-heading font-bold"
                      >
                        Show all recipes
                      </button>
                    )}
                  </div>
                ) : (
                  <MasonryRecipeGrid
                    recipes={filteredRecipes}
                    onRecipeClick={handleRecipeClick}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Recipes;
