
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { Wine, Flower2, Leaf, ChefHat, User, LogIn } from 'lucide-react';
import { mamas } from '@/data/mamas';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

// Enhanced mamas display with cultural design elements
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
                 "/lovable-uploads/35c616ae-06a9-49cb-b3e3-287c89fb124d.png",
  // Cultural styling
  culturalTheme: mama.id === 1 ? 'italian' : mama.id === 2 ? 'mexican' : 'thai',
  culturalColors: mama.id === 1 ? {
    primary: 'hsl(25, 82%, 65%)',
    secondary: 'hsl(45, 85%, 60%)',
    accent: 'hsl(14, 60%, 35%)',
    pattern: 'bg-italian-pattern'
  } : mama.id === 2 ? {
    primary: 'hsl(350, 80%, 60%)',
    secondary: 'hsl(18, 90%, 55%)',
    accent: 'hsl(40, 85%, 50%)',
    pattern: 'bg-mexican-pattern'
  } : {
    primary: 'hsl(120, 60%, 50%)',
    secondary: 'hsl(50, 90%, 55%)',
    accent: 'hsl(140, 30%, 45%)',
    pattern: 'bg-thai-pattern'
  }
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
                    className="relative h-full rounded-3xl overflow-hidden shadow-warm cursor-pointer transition-all duration-300 hover:scale-105 group"
                    style={{
                      background: `linear-gradient(135deg, ${mama.culturalColors.primary}15, ${mama.culturalColors.secondary}10)`,
                      border: `2px solid ${mama.culturalColors.primary}20`
                    }}
                  >
                    {/* Cultural pattern overlay */}
                    <div className={`absolute inset-0 opacity-20 ${mama.culturalColors.pattern}`}></div>
                    
                    {/* Character Card Image with enhanced styling */}
                    <div className="relative w-full h-full">
                      <img 
                        src={mama.characterImage} 
                        alt={`${mama.name} character card`}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Cultural accent elements */}
                      <div 
                        className="absolute top-4 left-4 w-3 h-3 rounded-full opacity-60 animate-pulse"
                        style={{ backgroundColor: mama.culturalColors.primary }}
                      ></div>
                      <div 
                        className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-40"
                        style={{ backgroundColor: mama.culturalColors.secondary }}
                      ></div>
                      <div 
                        className="absolute bottom-4 left-4 w-2 h-2 rounded-full opacity-30"
                        style={{ backgroundColor: mama.culturalColors.accent }}
                      ></div>
                      
                      {/* Enhanced watermark with cultural styling */}
                      <div 
                        className="absolute bottom-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                        style={{ color: mama.culturalColors.primary }}
                      >
                        <WatermarkIcon size={48} />
                      </div>
                      
                      {/* Cultural name badge */}
                      <div 
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-sm text-xs font-semibold text-white shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, ${mama.culturalColors.primary}80, ${mama.culturalColors.secondary}60)`,
                          border: `1px solid ${mama.culturalColors.primary}40`
                        }}
                      >
                        {mama.name}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Enhanced progress dots with cultural theming */}
        <div className="flex justify-center gap-3 mt-6">
          {mamasDisplay.map((mama, index) => (
            <button
              key={index}
              className={`transition-all duration-300 rounded-full ${
                index === current 
                  ? 'w-8 h-3 shadow-lg' 
                  : 'w-3 h-3 hover:scale-110'
              }`}
              style={{
                backgroundColor: index === current 
                  ? mama.culturalColors.primary 
                  : `${mama.culturalColors.primary}40`
              }}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mamas;
