
import React from 'react';

export const Header = () => {
  return (
    <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-background/95 backdrop-blur-sm border-b border-border z-50 shadow-paper">
      <div className="flex items-center justify-center h-16 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-warm">
            <img 
              src="/lovable-uploads/8a6cad47-4228-4cfb-bc36-6580877d3bb8.png" 
              alt="MAMIA Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground tracking-wide">
              MAMIA
            </h1>
            <p className="text-xs text-muted-foreground font-handwritten">
              recipes from the heart
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
