import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mama } from '@/data/mamas';

interface MamaHeroProps {
  mama: Mama;
  recipeCount: number;
  onBack: () => void;
}

export const MamaHero = ({ mama, recipeCount, onBack }: MamaHeroProps) => {
  const themeGradient = `linear-gradient(135deg, ${mama.themeColor} 0%, ${mama.themeColor}88 100%)`;
  
  return (
    <div 
      className="relative h-64 rounded-2xl overflow-hidden mb-6"
      style={{ background: themeGradient }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 text-6xl">{mama.emoji}</div>
        <div className="absolute top-12 right-8 text-4xl rotate-12">{mama.emoji}</div>
        <div className="absolute bottom-8 left-12 text-5xl -rotate-12">{mama.emoji}</div>
      </div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
            Back
          </Button>
        </div>
        
        {/* Mama info */}
        <div className="flex-1 flex items-center">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden border-2 border-white/30">
              <img 
                src={mama.avatar} 
                alt={mama.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Info */}
            <div className="text-white">
              <h1 className="font-heading font-bold text-3xl mb-1">
                {mama.name}
              </h1>
              <p className="text-white/90 font-handwritten text-lg mb-2">
                {mama.cookbookTitle}
              </p>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <span>{recipeCount} recipes</span>
                <span>•</span>
                <span>{mama.country}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quote */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <p className="text-white/90 font-handwritten text-center italic">
            "{mama.philosophy}"
          </p>
        </div>
      </div>
    </div>
  );
};