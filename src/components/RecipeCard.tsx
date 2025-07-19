
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
  
  // Cultural color palettes
  const culturalColors = {
    italian: {
      primary: 'hsl(25, 82%, 65%)',
      secondary: 'hsl(45, 85%, 60%)',
      accent: 'hsl(14, 60%, 35%)',
      pattern: 'bg-italian-pattern',
      gradient: 'from-italian to-italian-gold'
    },
    mexican: {
      primary: 'hsl(350, 80%, 60%)',
      secondary: 'hsl(18, 90%, 55%)',
      accent: 'hsl(40, 85%, 50%)',
      pattern: 'bg-mexican-pattern',
      gradient: 'from-mexican to-mexican-pink'
    },
    thai: {
      primary: 'hsl(120, 60%, 50%)',
      secondary: 'hsl(50, 90%, 55%)',
      accent: 'hsl(140, 30%, 45%)',
      pattern: 'bg-thai-pattern',
      gradient: 'from-thai to-thai-gold'
    }
  };

  const colors = culturalTheme ? culturalColors[culturalTheme] : null;

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
        style={{
          background: colors 
            ? `linear-gradient(135deg, ${colors.primary}90, ${colors.secondary}80)`
            : 'linear-gradient(135deg, hsl(var(--primary)) 90%, hsl(var(--primary)) 80%)'
        }}
      >
        {colors && <div className={`absolute inset-0 opacity-20 ${colors.pattern}`}></div>}
        
        <div className="absolute inset-0 text-white">
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
    return (
      <div 
        className={`bg-white rounded-lg shadow-warm cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${getRotation()} ${className}`}
        onClick={onClick}
        style={{
          border: colors ? `4px solid ${colors.primary}20` : '4px solid hsl(var(--border))'
        }}
      >
        <div className="aspect-square bg-muted rounded-t overflow-hidden relative">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          {colors && <div className={`absolute inset-0 opacity-10 ${colors.pattern}`}></div>}
          
          {/* Cultural watermark */}
          {culturalTheme && (
            <div 
              className="absolute bottom-2 right-2 opacity-20 text-2xl"
              style={{ color: colors?.primary }}
            >
              {culturalTheme === 'italian' && '🍃'}
              {culturalTheme === 'mexican' && '🎀'}
              {culturalTheme === 'thai' && '🪷'}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{recipe.mamaEmoji}</span>
            <span 
              className="text-xs px-2 py-1 rounded-full text-white font-medium"
              style={{ backgroundColor: colors?.primary || 'hsl(var(--muted))' }}
            >
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

  return (
    <div 
      className={`bg-white rounded-xl shadow-warm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${className}`}
      onClick={onClick}
      style={{
        border: colors ? `1px solid ${colors.primary}20` : '1px solid hsl(var(--border))'
      }}
    >
      <div className="aspect-video bg-muted relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        {colors && <div className={`absolute inset-0 opacity-10 ${colors.pattern}`}></div>}
        
        {/* Cultural accent corner */}
        {colors && (
          <div 
            className="absolute top-0 right-0 w-8 h-8 opacity-30"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)'
            }}
          ></div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{recipe.mamaEmoji}</span>
            <span className="text-sm text-muted-foreground">by {recipe.mamaName}</span>
          </div>
          <span 
            className="text-xs px-2 py-1 rounded-full text-white font-medium"
            style={{ backgroundColor: colors?.accent || 'hsl(var(--muted))' }}
          >
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
