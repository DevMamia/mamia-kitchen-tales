
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { Wine, Flower2, Leaf, ChefHat, User, LogIn } from 'lucide-react';
import { mamas } from '@/data/mamas';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

// Using mamas from centralized data with proper character representations
const mamasDisplay = mamas.map(mama => ({
  id: mama.id,
  name: mama.name,
  cuisine: `${mama.country} Cuisine`,
  background: mama.themeColor,
  signatureDish: mama.signatureDish,
  description: `Authentic ${mama.country} cooking with traditional family recipes.`,
  philosophy: mama.philosophy,
  greeting: mama.emoji === '🍷' ? "Ciao, bambino!" : 
           mama.emoji === '🌶️' ? "¡Hola, mi nieto!" : "สวัสดีค่ะ ลูกรัก",
  greetingTranslation: mama.emoji === '🍷' ? "Hello, little one!" :
                      mama.emoji === '🌶️' ? "Hello, my grandchild!" : "Hello, my dear child",
  action: mama.emoji === '🍷' ? "stirring risotto" :
          mama.emoji === '🌶️' ? "grinding spices" : "pounding curry paste",
  watermark: mama.emoji === '🍷' ? Wine : mama.emoji === '🌶️' ? Flower2 : Leaf,
  accent: mama.emoji,
  // Use actual uploaded images or fallback to placeholders
  characterImage: mama.id === 1 ? "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=600&fit=crop" :
                 mama.id === 2 ? "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=600&fit=crop" :
                 "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=600&fit=crop",
  culturalColor: mama.id === 1 ? 'hsl(25, 82%, 65%)' : // Italian orange
                mama.id === 2 ? 'hsl(350, 80%, 60%)' : // Mexican red  
                'hsl(120, 60%, 50%)' // Thai green
}));

const Mamas = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="h-full flex flex-col pb-4">
      <div className="flex-1 relative">
        <Carousel
          setApi={setApi}
          className="w-full h-full"
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="h-[55vh] max-h-[480px] min-h-[400px]">
            {mamasDisplay.map((mama) => {
              const WatermarkIcon = mama.watermark;
              return (
                <CarouselItem key={mama.id} className="basis-[85%] pl-4">
                  <div 
                    onClick={() => navigate(`/mama/${mama.id}`)}
                    className="relative h-full rounded-3xl overflow-hidden shadow-warm cursor-pointer transition-transform duration-200 hover:scale-105 bg-card"
                    style={{ borderColor: mama.culturalColor, borderWidth: '3px' }}
                  >
                    {/* Character Card with cultural styling */}
                    <div className="w-full h-full relative bg-gradient-to-br from-background to-muted/30">
                      {/* Cultural watermark */}
                      <div className="absolute top-6 right-6 opacity-10" style={{ color: mama.culturalColor }}>
                        <WatermarkIcon size={48} />
                      </div>
                      
                      {/* Character image placeholder */}
                      <div className="w-full h-full flex flex-col items-center justify-center p-8">
                        <div 
                          className="w-32 h-32 rounded-full mb-6 flex items-center justify-center text-6xl shadow-lg"
                          style={{ backgroundColor: `${mama.culturalColor}20` }}
                        >
                          {mama.accent}
                        </div>
                        
                        <h2 className="text-2xl font-heading font-bold mb-2" style={{ color: mama.culturalColor }}>
                          {mama.name}
                        </h2>
                        
                        <p className="text-muted-foreground text-center mb-4">
                          {mama.cuisine}
                        </p>
                        
                        <p className="text-sm text-center italic text-muted-foreground/80">
                          "{mama.greeting}"
                        </p>
                        <p className="text-xs text-center text-muted-foreground/60 mt-1">
                          {mama.greetingTranslation}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-4">
          {mamasDisplay.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === current ? 'bg-primary w-6' : 'bg-muted-foreground/30'
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mamas;
