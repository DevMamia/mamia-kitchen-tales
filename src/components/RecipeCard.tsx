
import React from 'react';
import { Clock, Users, Sparkles } from 'lucide-react';
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

  const getCulturalEmoji = () => {
    switch (culturalTheme) {
      case 'italian':
        return '🍃';
      case 'mexican':
        return '🌶️';
      case 'thai':
        return '🌿';
      default:
        return '✨';
    }
  };

  const getCulturalAccent = () => {
    switch (culturalTheme) {
      case 'italian':
        return 'text-italian';
      case 'mexican':
        return 'text-mexican';
      case 'thai':
        return 'text-thai';
      default:
        return 'text-primary';
    }
  };

  const getCulturalGradient = () => {
    switch (culturalTheme) {
      case 'italian':
        return 'bg-italian-gradient';
      case 'mexican':
        return 'bg-mexican-gradient';
      case 'thai':
        return 'bg-thai-gradient';
      default:
        return 'bg-gradient-to-br from-primary/90 to-primary';
    }
  };

  if (variant === 'hero') {
    return (
      <div 
        className={`cultural-card warm-card hover:shadow-cultural transition-all duration-500 hover:scale-105 h-52 cursor-pointer floating-elements ${className}`}
        onClick={onClick}
      >
        <div className={`absolute inset-0 ${getCulturalGradient()} text-white rounded-xl overflow-hidden`}>
          <div className="absolute top-4 left-4">
            <span className="bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-1">
              <Sparkles size={12} />
              FEATURED RECIPE
            </span>
          </div>
          
          {/* Cultural pattern overlay */}
          <div className={`absolute inset-0 opacity-10 ${culturalTheme ? `bg-${culturalTheme}-pattern` : ''}`}></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/20 to-transparent">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl floating-elements">{recipe.mamaEmoji}</span>
              <div>
                <span className="text-sm opacity-90 font-handwritten">from</span>
                <br />
                <span className="font-heading font-semibold">{recipe.mamaName}</span>
              </div>
            </div>
            <h3 className="font-heading font-bold text-2xl mb-3 leading-tight">{recipe.title}</h3>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                <span>{recipe.cookingTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={16} />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="ml-auto">
                <span className="text-lg">{getCulturalEmoji()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'polaroid') {
    return (
      <div 
        className={`cultural-card warm-card hover:shadow-cultural transition-all duration-500 hover:scale-105 cursor-pointer group ${className}`}
        onClick={onClick}
      >
        <div className="aspect-square bg-muted/50 rounded-t-xl overflow-hidden relative">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Cultural watermark */}
          <div className="absolute bottom-3 right-3 opacity-20 text-3xl floating-elements">
            {getCulturalEmoji()}
          </div>
          
          {/* Difficulty badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-foreground">
              {recipe.difficulty}
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl floating-elements">{recipe.mamaEmoji}</span>
              <span className={`text-sm font-handwritten ${getCulturalAccent()}`}>
                {recipe.mamaName}
              </span>
            </div>
            <span className="text-lg opacity-50">{getCulturalEmoji()}</span>
          </div>
          
          <h3 className="font-heading font-bold text-lg mb-2 leading-tight group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock size={14} />
            <span>{recipe.cookingTime}</span>
            <span className="mx-2 opacity-50">•</span>
            <Users size={14} />
            <span>{recipe.servings}</span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div 
      className={`cultural-card warm-card hover:shadow-cultural transition-all duration-500 hover:scale-105 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className="aspect-video bg-muted/30 rounded-t-xl overflow-hidden relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Cultural texture overlay */}
        <div className={`absolute inset-0 opacity-5 ${culturalTheme ? `bg-${culturalTheme}-pattern` : ''}`}></div>
        
        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-foreground">
            {recipe.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl floating-elements">{recipe.mamaEmoji}</span>
            <span className={`text-sm font-handwritten ${getCulturalAccent()}`}>
              by {recipe.mamaName}
            </span>
          </div>
          <span className="text-lg opacity-30">{getCulturalEmoji()}</span>
        </div>
        
        <h3 className="font-heading font-bold text-xl mb-3 leading-tight group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock size={16} />
            <span>{recipe.cookingTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="ml-auto opacity-50">
            <span className="text-xs bg-muted/50 px-2 py-1 rounded-full">
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
