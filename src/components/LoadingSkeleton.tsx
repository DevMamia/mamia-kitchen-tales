import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'recipe' | 'polaroid' | 'hero' | 'cooking';
  count?: number;
  cultural?: 'italian' | 'mexican' | 'thai';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'recipe', 
  count = 1,
  cultural 
}) => {
  const SkeletonCard = () => {
    if (variant === 'cooking') {
      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
          {/* Cooking Pot Animation */}
          <div className="relative">
            <div className="w-16 h-16 bg-primary/20 rounded-full cooking-pot flex items-center justify-center">
              <span className="text-2xl">🍲</span>
            </div>
            {/* Steam Animation */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="w-1 h-4 bg-muted-foreground/30 rounded-full steam-rise"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>
          
          {/* Cultural Notes Animation */}
          <div className="relative w-full flex justify-center">
            {cultural && (
              <div className="absolute flex space-x-8">
                {cultural === 'italian' && (
                  <>
                    <span className="text-lg cultural-notes" style={{ animationDelay: '0s' }}>🎵</span>
                    <span className="text-lg cultural-notes" style={{ animationDelay: '1s' }}>🍝</span>
                    <span className="text-lg cultural-notes" style={{ animationDelay: '2s' }}>🍷</span>
                  </>
                )}
                {cultural === 'mexican' && (
                  <>
                    <span className="text-lg cultural-notes" style={{ animationDelay: '0s' }}>🌶️</span>
                    <span className="text-lg cultural-notes" style={{ animationDelay: '1s' }}>🎺</span>
                    <span className="text-lg cultural-notes" style={{ animationDelay: '2s' }}>🌮</span>
                  </>
                )}
                {cultural === 'thai' && (
                  <>
                    <span className="text-lg cultural-notes" style={{ animationDelay: '0s' }}>🌿</span>
                    <span className="text-lg cultural-notes" style={{ animationDelay: '1s' }}>🥥</span>
                    <span className="text-lg cultural-notes" style={{ animationDelay: '2s' }}>🍛</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Loading Text */}
          <div className="text-center">
            <div className="w-48 h-6 bg-muted-foreground/20 rounded mb-2 animate-pulse"></div>
            <div className="w-32 h-4 bg-muted-foreground/15 rounded animate-pulse"></div>
          </div>
        </div>
      );
    }

    if (variant === 'hero') {
      return (
        <div className="h-48 bg-muted rounded-2xl animate-pulse">
          <div className="p-6 h-full flex flex-col justify-between">
            <div className="w-32 h-6 bg-muted-foreground/20 rounded-full"></div>
            <div>
              <div className="w-48 h-8 bg-muted-foreground/20 rounded mb-2"></div>
              <div className="flex gap-4">
                <div className="w-20 h-4 bg-muted-foreground/20 rounded"></div>
                <div className="w-24 h-4 bg-muted-foreground/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (variant === 'polaroid') {
      const culturalPattern = cultural 
        ? `bg-${cultural}-pattern` 
        : '';
      
      return (
        <div className={`bg-white rounded-lg shadow-warm border-4 border-white animate-pulse ${culturalPattern}`}>
          <div className="aspect-square bg-muted rounded-t overflow-hidden">
            <div className="w-full h-full bg-muted-foreground/10"></div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-muted-foreground/20 rounded"></div>
              <div className="w-12 h-5 bg-muted-foreground/20 rounded-full"></div>
            </div>
            <div className="w-32 h-6 bg-muted-foreground/20 rounded mb-1"></div>
            <div className="w-16 h-4 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>
      );
    }

    const culturalPattern = cultural 
      ? `bg-${cultural}-pattern` 
      : '';
    
    return (
      <div className={`bg-white rounded-xl shadow-warm overflow-hidden animate-pulse ${culturalPattern}`}>
        <div className="aspect-video bg-muted relative">
          {/* Subtle cooking utensil animation */}
          <div className="absolute top-2 right-2 opacity-30">
            <span className="text-lg spoon-stir">🥄</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted-foreground/20 rounded"></div>
              <div className="w-20 h-4 bg-muted-foreground/20 rounded"></div>
            </div>
            <div className="w-16 h-5 bg-muted-foreground/20 rounded-full"></div>
          </div>
          <div className="w-40 h-6 bg-muted-foreground/20 rounded mb-2"></div>
          <div className="space-y-2 mb-3">
            <div className="w-full h-4 bg-muted-foreground/20 rounded"></div>
            <div className="w-3/4 h-4 bg-muted-foreground/20 rounded"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-4 bg-muted-foreground/20 rounded"></div>
            <div className="w-20 h-4 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
};

export default LoadingSkeleton;