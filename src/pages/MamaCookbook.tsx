import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMamaById } from '@/data/mamas';
import { getRecipesByMama, Recipe, Difficulty, Category, ContentType } from '@/data/recipes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MamaHero } from '@/components/MamaHero';
import { MamaFilters } from '@/components/MamaFilters';
import { MamaAbout } from '@/components/MamaAbout';
import RecipeCard from '@/components/RecipeCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Badge } from '@/components/ui/badge';

const MamaCookbook = () => {
  const { mamaId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mamaRecipes, setMamaRecipes] = useState<Recipe[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [selectedContentType, setSelectedContentType] = useState<ContentType | 'ALL'>('ALL');
  
  const mama = getMamaById(parseInt(mamaId || '1'));

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      const recipes = getRecipesByMama(parseInt(mamaId || '1'));
      setMamaRecipes(recipes);
      setLoading(false);
    }, 800);
  }, [mamaId]);

  // Filter recipes based on search and filters
  const filteredRecipes = useMemo(() => {
    return mamaRecipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'ALL' || recipe.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === 'ALL' || recipe.category === selectedCategory;
      const matchesContentType = selectedContentType === 'ALL' || recipe.contentType === selectedContentType;
      
      return matchesSearch && matchesDifficulty && matchesCategory && matchesContentType;
    });
  }, [mamaRecipes, searchTerm, selectedDifficulty, selectedCategory, selectedContentType]);

  // Separate featured and regular recipes
  const featuredRecipes = filteredRecipes.filter(recipe => recipe.featured);
  const regularRecipes = filteredRecipes.filter(recipe => !recipe.featured);

  if (!mama) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl text-foreground mb-2">Mama not found</h2>
          <p className="text-muted-foreground mb-4">The cooking guide you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/app')}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-heading font-bold"
          >
            Back to Mamas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Hero Header */}
      <MamaHero 
        mama={mama}
        recipeCount={mamaRecipes.length}
        onBack={() => navigate('/app')}
      />

      {/* Tabs */}
      <Tabs defaultValue="recipes" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="recipes" className="font-heading">
            Recipes ({mamaRecipes.length})
          </TabsTrigger>
          <TabsTrigger value="about" className="font-heading">
            About {mama.name}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes" className="flex-1 mt-0">
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              <LoadingSkeleton variant="polaroid" count={6} />
            </div>
          ) : mamaRecipes.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-sm">
                <span className="text-6xl mb-4 block">{mama.emoji}</span>
                <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                  No recipes yet
                </h3>
                <p className="text-muted-foreground font-handwritten">
                  {mama.name} is still preparing her collection. Check back soon for delicious recipes!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Filters */}
              <MamaFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedDifficulty={selectedDifficulty}
                onDifficultyChange={setSelectedDifficulty}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedContentType={selectedContentType}
                onContentTypeChange={setSelectedContentType}
                resultCount={filteredRecipes.length}
              />

              {/* Featured Recipes */}
              {featuredRecipes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-lg">Featured Recipes</h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Chef's Choice
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {featuredRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        variant="polaroid"
                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Recipes */}
              {regularRecipes.length > 0 && (
                <div className="space-y-4">
                  {featuredRecipes.length > 0 && (
                    <h3 className="font-heading font-bold text-lg">All Recipes</h3>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {regularRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        variant="polaroid"
                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {filteredRecipes.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">{mama.emoji}</span>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    No recipes found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters to find more recipes.
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="about" className="mt-0">
          <MamaAbout mama={mama} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MamaCookbook;