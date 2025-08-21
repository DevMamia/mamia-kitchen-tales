import React from 'react';
import { Mama } from '@/data/mamas';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MamaAboutProps {
  mama: Mama;
}

export const MamaAbout = ({ mama }: MamaAboutProps) => {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-none bg-background/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img 
                src={mama.avatar} 
                alt={mama.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-foreground">
                Meet {mama.name}
              </h3>
              <p className="text-muted-foreground">
                From {mama.country}
              </p>
            </div>
          </div>
          
          <blockquote className="italic text-foreground/80 font-handwritten text-lg border-l-4 border-primary pl-4">
            "{mama.philosophy}"
          </blockquote>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card className="border-none bg-background/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h4 className="font-heading font-semibold text-lg mb-4">
            Cooking Specialties
          </h4>
          <div className="flex flex-wrap gap-2">
            {mama.specialties.map((specialty) => (
              <Badge 
                key={specialty}
                variant="secondary"
                className="text-sm px-3 py-1"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Signature Dish */}
      <Card className="border-none bg-background/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h4 className="font-heading font-semibold text-lg mb-2">
            Signature Dish
          </h4>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{mama.emoji}</span>
            <p className="font-handwritten text-lg text-foreground">
              {mama.signatureDish}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cultural Background */}
      <Card className="border-none bg-background/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h4 className="font-heading font-semibold text-lg mb-4">
            Cultural Heritage
          </h4>
          <div className="space-y-3 text-muted-foreground">
            <p>
              {mama.name} brings authentic {mama.accent} flavors to your kitchen, 
              sharing recipes that have been passed down through generations.
            </p>
            <p>
              Each dish tells a story of tradition, family gatherings, 
              and the love that goes into every meal. From {mama.country}, 
              these recipes represent the heart of {mama.accent} home cooking.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};