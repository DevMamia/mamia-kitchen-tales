
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { Wine, Flower2, Leaf, ChefHat, User, LogIn } from 'lucide-react';
import { mamas } from '@/data/mamas';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

// Using mamas from centralized data with character card images
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
  characterImage: mama.id === 1 ? "/lovable-uploads/Nonna.png" :
                 mama.id === 2 ? "/lovable-uploads/Abuela.png" :
                 "/lovable-uploads/Yai.png"
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
                    className="relative h-full rounded-3xl overflow-hidden shadow-warm cursor-pointer transition-transform duration-200 hover:scale-105 bg-cream"
                  >
                    {/* Character Card Image */}
                    <img 
                      src={mama.characterImage} 
                      alt={`${mama.name} character card`}
                      className="w-full h-full object-contain"
                    />
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
