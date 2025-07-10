
import React from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="max-w-sm mx-auto bg-background min-h-screen relative shadow-paper">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};
