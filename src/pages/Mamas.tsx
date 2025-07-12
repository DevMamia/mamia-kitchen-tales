
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
  characterImage: mama.id === 1 ? "/lovable-uploads/f93a6daa-6445-4c83-aaf2-c75c2b4824bc.png" :
                 mama.id === 2 ? "/lovable-uploads/95d2de88-6de2-4a87-b5e5-deda3096c455.png" :
                 "/lovable-uploads/35c616ae-06a9-49cb-b3e3-287c89fb124d.png"
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
                  <div className="relative h-full rounded-3xl overflow-hidden shadow-warm">
                    {/* Character Card Image as Background */}
                    <img 
                      src={mama.characterImage} 
                      alt={`${mama.name} character card`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* Overlay for interaction button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Interactive Button Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <button 
                        onClick={() => navigate(`/mama/${mama.id}`)}
                        className="w-full bg-white/95 backdrop-blur-sm text-gray-800 font-heading font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm hover:bg-white"
                      >
                        <span>📖</span>
                        <span>Open {mama.name.split(' ')[0]}'s Cookbook</span>
                      </button>
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
