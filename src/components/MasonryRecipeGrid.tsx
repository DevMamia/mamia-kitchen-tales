import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Recipe } from '@/data/recipes';
import RecipeCard from '@/components/RecipeCard';

interface MasonryRecipeGridProps {
  recipes: Recipe[];
  onRecipeClick: (recipeId: string) => void;
}

const MasonryRecipeGrid: React.FC<MasonryRecipeGridProps> = ({
  recipes,
  onRecipeClick
}) => {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) setColumns(1);
      else if (window.innerWidth < 768) setColumns(2);
      else setColumns(3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const distributeRecipes = () => {
    const columnArrays: Recipe[][] = Array.from({ length: columns }, () => []);
    
    recipes.forEach((recipe, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push(recipe);
    });

    return columnArrays;
  };

  const getCulturalGradient = (mamaId: number) => {
    switch (mamaId) {
      case 1: // Italian
        return 'from-red-500/20 via-white/10 to-green-500/20';
      case 2: // Mexican
        return 'from-orange-500/20 via-yellow-500/10 to-pink-500/20';
      case 3: // Thai
        return 'from-green-500/20 via-yellow-500/10 to-blue-500/20';
      default:
        return 'from-primary/10 to-secondary/10';
    }
  };

  const distributedRecipes = distributeRecipes();

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {distributedRecipes.map((columnRecipes, columnIndex) => (
        <div key={columnIndex} className="space-y-4">
          {columnRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: (columnIndex * 0.1) + (index * 0.2),
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                rotateZ: Math.random() > 0.5 ? 1 : -1,
                transition: { duration: 0.2 }
              }}
              className="relative"
            >
              {/* Cultural background glow */}
              <div 
                className={`
                  absolute inset-0 rounded-lg bg-gradient-to-br opacity-30 blur-sm
                  ${getCulturalGradient(recipe.mamaId)}
                `}
                style={{ 
                  transform: 'scale(1.05)',
                  zIndex: -1
                }}
              />
              
              <RecipeCard
                recipe={recipe}
                onClick={() => onRecipeClick(recipe.id)}
                className="relative z-10 shadow-cultural hover:shadow-3d transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryRecipeGrid;