import React from 'react';
import { Clock, Users } from 'lucide-react';
import { Recipe } from '@/data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
  variant?: 'default' | 'polaroid' | 'hero';
  className?: string;
  onClick?: () => void;
  cultural?: 'italian' | 'mexican' | 'thai';
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  variant = 'default', 
  className = '',
  onClick,
  cultural 
}) => {
  // Determine cultural styling based on recipe's mama ID
  const getCulturalStyling = () => {
    if (cultural) return cultural;
    
    // Auto-detect from recipe if not explicitly set
    if (recipe.mamaId === 1) return 'italian';
    if (recipe.mamaId === 2) return 'mexican';
    if (recipe.mamaId === 3) return 'thai';
    return undefined;
  };

  const culturalTheme = getCulturalStyling();
  const getRotation = () => {
    if (variant !== 'polaroid') return '';
    const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
    return rotations[Math.floor(Math.random() * rotations.length)];
  };

  if (variant === 'hero') {
    return (
      <div 
        className={`relative overflow-hidden rounded-2xl shadow-warm cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 h-48 ${className}`}
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary text-white">
          <div className="absolute top-4 left-4">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-wider">
              RECIPE OF THE WEEK
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{recipe.mamaEmoji}</span>
              <span className="text-sm opacity-90">by {recipe.mamaName}</span>
            </div>
            <h3 className="font-heading font-bold text-2xl mb-2">{recipe.title}</h3>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{recipe.cookingTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{recipe.servings} servings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'polaroid') {
    const culturalPattern = culturalTheme ? `bg-${culturalTheme}-pattern` : '';
    const culturalBorder = culturalTheme ? `border-${culturalTheme}` : '';
    
    return (
      <div 
        className={`bg-white rounded-lg shadow-warm border-4 border-white cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${getRotation()} ${culturalPattern} ${culturalBorder} ${className}`}
        onClick={onClick}
      >
        <div className="aspect-square bg-muted rounded-t overflow-hidden relative">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          {/* Cultural watermark */}
          {culturalTheme && (
            <div className="absolute bottom-2 right-2 opacity-10 text-2xl">
              {culturalTheme === 'italian' && '🍃'}
              {culturalTheme === 'mexican' && '🎀'}
              {culturalTheme === 'thai' && '🪷'}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{recipe.mamaEmoji}</span>
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              {recipe.difficulty}
            </span>
          </div>
          <h3 className="font-heading font-bold text-lg mb-1">{recipe.title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock size={14} />
            <span>{recipe.cookingTime}</span>
          </div>
        </div>
      </div>
    );
  }

  const culturalPattern = culturalTheme ? `bg-${culturalTheme}-pattern` : '';
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-warm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${culturalPattern} ${className}`}
      onClick={onClick}
    >
      <div className="aspect-video bg-muted relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        {/* Cultural texture overlay */}
        {culturalTheme && (
          <div className="absolute inset-0 opacity-5">
            <div className={`w-full h-full bg-${culturalTheme}-pattern`}></div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{recipe.mamaEmoji}</span>
            <span className="text-sm text-muted-foreground">by {recipe.mamaName}</span>
          </div>
          <span className="text-xs bg-muted px-2 py-1 rounded-full">
            {recipe.category}
          </span>
        </div>
        <h3 className="font-heading font-bold text-lg mb-2">{recipe.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {recipe.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{recipe.cookingTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;