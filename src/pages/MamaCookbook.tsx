import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getRecipesByMama, recipes } from '@/data/recipes';
import RecipeCard from '@/components/RecipeCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const mamasData = [
  { id: 1, name: "Nonna Lucia", emoji: "🍷", cuisine: "Italian" },
  { id: 2, name: "Abuela Rosa", emoji: "🌶️", cuisine: "Mexican" },
  { id: 3, name: "Mae Malai", emoji: "🌿", cuisine: "Thai" }
];

const MamaCookbook = () => {
  const { mamaId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mamaRecipes, setMamaRecipes] = useState<any[]>([]);
  
  const mama = mamasData.find(m => m.id === parseInt(mamaId || '1'));

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      const recipes = getRecipesByMama(parseInt(mamaId || '1'));
      setMamaRecipes(recipes);
      setLoading(false);
    }, 800);
  }, [mamaId]);

  if (!mama) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl text-foreground mb-2">Mama not found</h2>
          <p className="text-muted-foreground mb-4">The cooking guide you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/mamas')}
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
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/mamas')}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">{mama.emoji}</span>
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">
              {mama.name}'s Cookbook
            </h1>
            <p className="text-muted-foreground font-handwritten">
              Authentic {mama.cuisine} recipes from the heart
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
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
                {mama.name} is still preparing her collection. Check back soon for delicious {mama.cuisine.toLowerCase()} recipes!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                {mamaRecipes.length} recipe{mamaRecipes.length !== 1 ? 's' : ''} available
              </p>
              <div className="text-sm text-muted-foreground">
                Swipe for more recipes
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {mamaRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  variant="polaroid"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MamaCookbook;