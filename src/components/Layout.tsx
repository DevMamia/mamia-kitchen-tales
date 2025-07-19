
import React from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
  cultural?: 'italian' | 'mexican' | 'thai';
  variant?: 'default' | 'cooking' | 'cultural';
}

export const Layout = ({ 
  children, 
  pageTitle, 
  pageSubtitle,
  cultural,
  variant = 'default'
}: LayoutProps) => {
  const getBackgroundClass = () => {
    if (variant === 'cooking') {
      return 'bg-gradient-to-b from-orange-50/30 via-background to-background';
    }
    
    if (cultural) {
      return `bg-${cultural}-pattern`;
    }
    
    return 'bg-warm-gradient';
  };

  const getCulturalAccent = () => {
    switch (cultural) {
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
    <div className={`max-w-sm mx-auto min-h-screen relative shadow-elevated ${getBackgroundClass()}`}>
      <Header />
      
      <main className="pt-20 pb-20 px-4 min-h-screen relative">
        {(pageTitle || pageSubtitle) && (
          <div className="text-center mb-8 pt-4 warm-fade-in">
            {pageTitle && (
              <h2 className={`font-heading font-bold text-3xl mb-3 ${getCulturalAccent()}`}>
                {pageTitle}
              </h2>
            )}
            {pageSubtitle && (
              <p className="text-muted-foreground font-handwritten text-lg leading-relaxed">
                {pageSubtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="warm-fade-in">
          {children}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};
