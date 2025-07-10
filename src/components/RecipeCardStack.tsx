import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Heart, ChefHat, Clock, Users } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RecipeCardStackProps {
  recipes: Recipe[];
  onLike: (recipe: Recipe) => void;
  onDislike: (recipe: Recipe) => void;
  onTap: (recipe: Recipe) => void;
}

const RecipeCardStack: React.FC<RecipeCardStackProps> = ({
  recipes,
  onLike,
  onDislike,
  onTap,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 150;
    const currentRecipe = recipes[currentIndex];

    if (info.offset.x > threshold) {
      // Swiped right - like
      setDragDirection('right');
      onLike(currentRecipe);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % recipes.length);
        setDragDirection(null);
      }, 300);
    } else if (info.offset.x < -threshold) {
      // Swiped left - dislike
      setDragDirection('left');
      onDislike(currentRecipe);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % recipes.length);
        setDragDirection(null);
      }, 300);
    }
  };

  const getCulturalStyles = (mamaId: number) => {
    switch (mamaId) {
      case 1: // Italian
        return {
          bgClass: 'bg-italian-gradient',
          textClass: 'text-italian-gold',
          fontClass: 'font-italian',
          accent: 'hsl(var(--italian-accent))'
        };
      case 2: // Mexican
        return {
          bgClass: 'bg-mexican-gradient',
          textClass: 'text-mexican-pink',
          fontClass: 'font-mexican',
          accent: 'hsl(var(--mexican-accent))'
        };
      case 3: // Thai
        return {
          bgClass: 'bg-thai-gradient',
          textClass: 'text-thai-gold',
          fontClass: 'font-thai',
          accent: 'hsl(var(--thai-accent))'
        };
      default:
        return {
          bgClass: 'bg-primary',
          textClass: 'text-primary',
          fontClass: 'font-heading',
          accent: 'hsl(var(--primary))'
        };
    }
  };

  const renderCard = (recipe: Recipe, index: number) => {
    const isActive = index === currentIndex;
    const isNext = index === (currentIndex + 1) % recipes.length;
    const isAfterNext = index === (currentIndex + 2) % recipes.length;
    
    if (index < currentIndex && index !== recipes.length - 1) return null;
    
    const cultural = getCulturalStyles(recipe.mamaId);
    
    let zIndex = 1;
    let scale = 0.9;
    let translateY = 20;
    let opacity = 0.7;

    if (isActive) {
      zIndex = 3;
      scale = 1;
      translateY = 0;
      opacity = 1;
    } else if (isNext) {
      zIndex = 2;
      scale = 0.95;
      translateY = 10;
      opacity = 0.8;
    } else if (isAfterNext) {
      zIndex = 1;
      scale = 0.9;
      translateY = 20;
      opacity = 0.6;
    }

    return (
      <motion.div
        key={`${recipe.id}-${index}`}
        className="absolute inset-0"
        style={{ zIndex }}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ 
          scale, 
          opacity, 
          y: translateY,
          rotateY: isActive ? 0 : 5,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.5
        }}
        drag={isActive ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={isActive ? handleDragEnd : undefined}
        whileDrag={{ 
          scale: 1.05, 
          rotateZ: 5,
          cursor: 'grabbing'
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { duration: 0.1 }
        }}
        onTap={() => isActive && onTap(recipe)}
      >
        <div className={`
          w-full h-full rounded-3xl overflow-hidden shadow-3d
          ${cultural.bgClass}
          relative transform-3d
        `}>
          {/* Recipe Image */}
          <div className="h-64 relative overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Mama Badge */}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                {recipe.mamaEmoji} {recipe.mamaName}
              </Badge>
            </div>

            {/* Difficulty Badge */}
            <div className="absolute top-4 right-4">
              <Badge 
                variant={recipe.difficulty === 'EASY' ? 'secondary' : 
                        recipe.difficulty === 'MEDIUM' ? 'outline' : 'destructive'}
              >
                <ChefHat className="w-3 h-3 mr-1" />
                {recipe.difficulty}
              </Badge>
            </div>
          </div>

          {/* Recipe Content */}
          <div className="p-6 space-y-4 text-white">
            <h3 className={`text-2xl font-bold leading-tight ${cultural.fontClass}`}>
              {recipe.title}
            </h3>
            
            <p className="text-white/90 text-sm line-clamp-2">
              {recipe.description}
            </p>

            {/* Recipe Stats */}
            <div className="flex items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {recipe.cookingTime}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {recipe.servings} servings
              </div>
            </div>

            {/* Action Hints */}
            {isActive && (
              <div className="flex justify-between items-center pt-4 border-t border-white/20">
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <span>←</span>
                  <span>Not interested</span>
                </div>
                <div className="text-white/70 text-xs">
                  Tap to view recipe
                </div>
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <span>Save</span>
                  <span>→</span>
                </div>
              </div>
            )}
          </div>

          {/* Swipe Indicators */}
          {isActive && dragDirection && (
            <div className={`
              absolute inset-0 flex items-center justify-center
              ${dragDirection === 'right' ? 'bg-green-500/20' : 'bg-red-500/20'}
              transition-all duration-300
            `}>
              <div className={`
                p-4 rounded-full
                ${dragDirection === 'right' ? 'bg-green-500' : 'bg-red-500'}
                text-white text-4xl
              `}>
                {dragDirection === 'right' ? '❤️' : '❌'}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative w-full max-w-sm mx-auto h-96 perspective-1000">
      {recipes.slice(currentIndex, currentIndex + 3).map((recipe, index) => 
        renderCard(recipe, currentIndex + index)
      )}
      
      {/* Stack continuation for seamless loop */}
      {recipes.slice(0, Math.min(3, currentIndex)).map((recipe, index) => 
        renderCard(recipe, recipes.length + index)
      )}

      {/* Manual Controls */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onDislike(recipes[currentIndex]);
            setCurrentIndex((prev) => (prev + 1) % recipes.length);
          }}
          className="bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-500/20"
        >
          Skip
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onLike(recipes[currentIndex]);
            setCurrentIndex((prev) => (prev + 1) % recipes.length);
          }}
          className="bg-green-500/10 border-green-500/20 text-green-600 hover:bg-green-500/20"
        >
          <Heart className="w-4 h-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default RecipeCardStack;