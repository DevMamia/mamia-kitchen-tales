import React from 'react';

interface CulturalEmptyStateProps {
  cultural?: 'italian' | 'mexican' | 'thai';
  message?: string;
  className?: string;
}

const CulturalEmptyState: React.FC<CulturalEmptyStateProps> = ({ 
  cultural, 
  message,
  className = '' 
}) => {
  const getEmptyStateContent = () => {
    switch (cultural) {
      case 'italian':
        return {
          emoji: '👵🏻',
          grandma: 'Nonna',
          message: message || "Nonna is still preparing her secret recipes...",
          accent: 'text-italian',
          pattern: 'bg-italian-pattern',
          culturalEmojis: ['🍝', '🍷', '🧄', '🫒']
        };
      case 'mexican':
        return {
          emoji: '👵🏽',
          grandma: 'Abuela',
          message: message || "Abuela is gathering her special ingredients...",
          accent: 'text-mexican',
          pattern: 'bg-mexican-pattern',
          culturalEmojis: ['🌶️', '🌮', '🥑', '🌽']
        };
      case 'thai':
        return {
          emoji: '👵🏻',
          grandma: 'Mae',
          message: message || "Mae is selecting the freshest herbs...",
          accent: 'text-thai',
          pattern: 'bg-thai-pattern',
          culturalEmojis: ['🌿', '🥥', '🍛', '🌸']
        };
      default:
        return {
          emoji: '👵',
          grandma: 'Grandma',
          message: message || "No recipes available right now. Let's cook something!",
          accent: 'text-primary',
          pattern: '',
          culturalEmojis: ['🍽️', '👨‍🍳', '❤️', '✨']
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className={`h-full flex items-center justify-center ${className}`}>
      <div className={`text-center max-w-sm p-8 rounded-2xl ${content.pattern}`}>
        {/* Floating cultural elements */}
        <div className="relative mb-6">
          <div className="absolute -top-4 -left-4 opacity-20">
            {content.culturalEmojis.map((emoji, index) => (
              <span 
                key={index}
                className="absolute text-2xl cultural-notes"
                style={{ 
                  animationDelay: `${index * 0.5}s`,
                  left: `${index * 20}px`,
                  top: `${index * 10}px`
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
          
          {/* Grandmother character with gentle bounce */}
          <div className="text-8xl mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
            {content.emoji}
          </div>
        </div>
        
        <h3 className={`font-heading font-bold text-xl mb-2 ${content.accent}`}>
          Where are the recipes?
        </h3>
        
        <p className={`font-handwritten text-lg mb-4 ${content.accent} opacity-80`}>
          {content.message}
        </p>
        
        <div className="flex justify-center space-x-2 opacity-50">
          <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default CulturalEmptyState;