
import React from 'react';
import { ChefHat, Sparkles } from 'lucide-react';
import { Mama } from '@/data/mamas';

interface CharacterCardProps {
  mama: Mama;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  mama,
  isActive = false,
  onClick,
  className = ''
}) => {
  const getCulturalTheme = () => {
    switch (mama.accent.toLowerCase()) {
      case 'italian':
        return 'italian';
      case 'mexican':
        return 'mexican';
      case 'thai':
        return 'thai';
      default:
        return 'italian';
    }
  };

  const culturalTheme = getCulturalTheme();

  const getCulturalGradient = () => {
    switch (culturalTheme) {
      case 'italian':
        return 'bg-italian-gradient';
      case 'mexican':
        return 'bg-mexican-gradient';
      case 'thai':
        return 'bg-thai-gradient';
      default:
        return 'bg-gradient-to-br from-primary to-primary/80';
    }
  };

  const getCulturalPattern = () => {
    return `bg-${culturalTheme}-pattern`;
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

  return (
    <div 
      className={`
        cultural-card warm-card cursor-pointer transition-all duration-500 group
        ${isActive ? 'shadow-cultural scale-105 cultural-pulse' : 'hover:shadow-cultural hover:scale-105'}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header with cultural gradient */}
      <div className={`${getCulturalGradient()} p-6 rounded-t-xl relative overflow-hidden`}>
        {/* Cultural pattern overlay */}
        <div className={`absolute inset-0 opacity-15 ${getCulturalPattern()}`}></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="text-6xl mb-3 floating-elements">
            {mama.emoji}
          </div>
          <h3 className="font-heading font-bold text-2xl mb-2">
            {mama.name}
          </h3>
          <p className="text-white/90 font-handwritten text-lg">
            from {mama.country}
          </p>
          
          {isActive && (
            <div className="absolute top-3 right-3">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Cookbook title */}
        <div className="text-center">
          <h4 className={`font-heading font-semibold text-lg ${getCulturalAccent()} mb-2`}>
            "{mama.cookbookTitle}"
          </h4>
          <p className="text-sm text-muted-foreground font-handwritten leading-relaxed">
            {mama.philosophy}
          </p>
        </div>

        {/* Specialties */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className={`w-4 h-4 ${getCulturalAccent()}`} />
            <span className="text-sm font-semibold text-foreground">Specialties</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mama.specialties.map((specialty, index) => (
              <span 
                key={index}
                className="bg-muted/70 text-muted-foreground px-3 py-1 rounded-full text-xs font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Signature dish */}
        <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-current">
          <p className="text-sm text-muted-foreground mb-1">Signature Dish</p>
          <p className={`font-handwritten text-base ${getCulturalAccent()} font-semibold`}>
            {mama.signatureDish}
          </p>
        </div>

        {/* Action indicator */}
        <div className="text-center pt-2">
          <span className="text-xs text-muted-foreground font-handwritten">
            {isActive ? 'Currently selected' : 'Tap to explore recipes'}
          </span>
        </div>
      </div>
    </div>
  );
};
