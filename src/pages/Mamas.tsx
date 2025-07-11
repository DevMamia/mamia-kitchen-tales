
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { Wine, Flower2, Leaf, ChefHat, User, LogIn } from 'lucide-react';
import { mamas } from '@/data/mamas';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

// Using mamas from centralized data
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
  accent: mama.emoji
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
                    className="relative h-full rounded-3xl overflow-hidden shadow-warm"
                    style={{ backgroundColor: mama.background }}
                  >
                    {/* Watermark */}
                    <div className="absolute top-6 right-6 opacity-10">
                      <WatermarkIcon size={80} className="text-white" />
                    </div>

                    {/* Decorative pattern for Mexican card */}
                    {mama.id === 2 && (
                      <div className="absolute inset-0 opacity-5">
                        <div className="grid grid-cols-8 gap-4 p-4">
                          {Array.from({ length: 32 }).map((_, i) => (
                            <Flower2 key={i} size={16} className="text-white" />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="relative h-full p-5 flex text-white">
                      {/* Left Content Area */}
                      <div className="flex-1 flex flex-col justify-between pr-3">
                        {/* Top Section */}
                        <div>
                          <p className="text-xs font-bold tracking-widest opacity-90 mb-2">{mama.cuisine.toUpperCase()}</p>
                          <h3 className="font-heading font-bold text-3xl mb-2 leading-tight">{mama.name}</h3>
                          
                          {/* Cooking Action */}
                          <div className="flex items-center gap-2 mb-3">
                            <ChefHat size={16} className="opacity-80" />
                            <p className="text-xs opacity-80 font-medium">{mama.action}</p>
                          </div>
                        </div>

                        {/* Middle Section - Signature Dish */}
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{mama.accent}</span>
                            <p className="text-xs font-bold tracking-wider opacity-80">SIGNATURE DISH</p>
                          </div>
                          <p className="font-heading font-bold text-lg">{mama.signatureDish}</p>
                        </div>

                        {/* Philosophy Quote - Shortened */}
                        <div className="mb-3">
                          <p className="font-handwritten text-xs italic opacity-90 leading-relaxed">
                            "{mama.philosophy.split('.')[0]}."
                          </p>
                        </div>

                        {/* Bottom Section */}
                        <div>
                          {/* CTA Button */}
                          <button 
                            onClick={() => navigate(`/mama/${mama.id}`)}
                            className="w-full bg-white text-gray-800 font-heading font-bold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mb-2 flex items-center justify-center gap-2 text-sm"
                          >
                            <span>📖</span>
                            <span>Open {mama.name.split(' ')[0]}'s Cookbook</span>
                          </button>

                          {/* Cultural greeting */}
                          <div className="text-center">
                            <p className="font-handwritten text-sm mb-1">{mama.greeting}</p>
                            <p className="text-xs opacity-70">"{mama.greetingTranslation}"</p>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Character Illustration */}
                      <div className="w-28 flex flex-col items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-white/20 border-3 border-white/30 flex items-center justify-center mb-2">
                          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-3xl">👵🏻</span>
                          </div>
                        </div>
                        
                        {/* Small cooking illustration */}
                        <div className="bg-white/15 rounded-lg p-1.5">
                          <ChefHat size={18} className="text-white/80" />
                        </div>
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
