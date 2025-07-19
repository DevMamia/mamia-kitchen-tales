import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, ChefHat } from 'lucide-react';
import { getRecipeWithMama } from '@/data/recipes';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { IngredientsList } from '@/components/IngredientsList';
import { TipValidationPanel } from '@/components/TipValidationPanel';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState(null);

  useEffect(() => {
    if (recipeId) {
      const data = getRecipeWithMama(recipeId);
      setRecipeData(data);
    }
  }, [recipeId]);

  if (!recipeData) {
    return <div>Loading...</div>;
  }

  const { recipe, mama } = recipeData;

  const handleEdit = () => {
    navigate(`/edit-recipe/${recipeId}`);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header Section */}
      <div className="bg-background border-b border-border p-4 flex items-center justify-between sticky top-16 z-40 backdrop-blur-sm bg-background/95">
        <Button variant="ghost" onClick={() => navigate('/')} className="hover:bg-accent/50 text-lg">
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Recipes
        </Button>
        <Button onClick={handleEdit} className="hover:bg-accent/50">
          <Edit className="mr-2 w-4 h-4" />
          Edit Recipe
        </Button>
      </div>

      {/* Image and Description Section */}
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-b-2xl"
        />
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background to-transparent text-white">
          <h1 className="text-3xl font-heading font-bold">{recipe.title}</h1>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              <span>{mama.name}</span>
            </div>
            <DifficultyBadge difficulty={recipe.difficulty} />
          </div>
          <p className="mt-2 text-sm">{recipe.description}</p>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="p-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Ingredients</h2>
        <IngredientsList ingredients={recipe.ingredients} />
      </div>

      {/* Instructions Section */}
      <div className="bg-card rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Instructions</h2>
        <div className="space-y-4">
          {recipe.instructions.map((instruction, index) => {
            const stepData = recipe.steps?.[index];
            return (
              <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-foreground leading-relaxed">{instruction}</p>
                  {stepData?.tips && stepData.tips.length > 0 && (
                    <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">
                        💡 {mama.name}'s tip:
                      </p>
                      {stepData.tips.map((tip, tipIndex) => (
                        <p key={tipIndex} className="text-sm text-orange-600 dark:text-orange-400">
                          {tip}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip Validation Panel */}
      <TipValidationPanel recipe={recipe} />

      {/* Buttons Section */}
      <div className="sticky bottom-0 left-0 w-full p-4 bg-background/95 backdrop-blur-sm border-t border-border z-50">
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-lg">
          Start Cooking
        </Button>
      </div>
    </div>
  );
};

export default RecipeDetail;
