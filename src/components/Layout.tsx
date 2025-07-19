
import React from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
}

export const Layout = ({ children, pageTitle, pageSubtitle }: LayoutProps) => {
  return (
    <div className="max-w-sm mx-auto bg-background min-h-screen relative shadow-paper">
      <Header />
      
      <main className="pt-20 pb-20 px-4 min-h-screen">
        {(pageTitle || pageSubtitle) && (
          <div className="text-center mb-6 pt-2">
            {pageTitle && (
              <h2 className="font-heading font-bold text-2xl text-slate-800 mb-2">
                {pageTitle}
              </h2>
            )}
            {pageSubtitle && (
              <p className="text-slate-600 font-handwritten text-base">
                {pageSubtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};
