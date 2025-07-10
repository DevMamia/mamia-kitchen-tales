import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'recipe' | 'polaroid' | 'hero';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'recipe', 
  count = 1 
}) => {
  const SkeletonCard = () => {
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
      return (
        <div className="bg-white rounded-lg shadow-warm border-4 border-white animate-pulse">
          <div className="aspect-square bg-muted rounded-t"></div>
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

    return (
      <div className="bg-white rounded-xl shadow-warm overflow-hidden animate-pulse">
        <div className="aspect-video bg-muted"></div>
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