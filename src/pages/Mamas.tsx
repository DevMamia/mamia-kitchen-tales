
import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { Wine, Flower2, Leaf } from 'lucide-react';

const mamas = [
  {
    id: 1,
    name: "Nonna Lucia",
    cuisine: "Italian",
    background: "#FF8C42",
    signatureDish: "Classic Carbonara",
    quote: "From rolling pasta in nonna's eyes...",
    greeting: "Buongiorno, caro!",
    greetingTranslation: "Good morning, dear!",
    watermark: Wine,
    description: "With flour-dusted hands and stories of old Italy, Nonna Lucia brings generations of Roman tradition to every dish."
  },
  {
    id: 2,
    name: "Abuela Rosa",
    cuisine: "Mexican",
    background: "#FF6B6B",
    signatureDish: "Mole Negro",
    quote: "Every ingredient tells a story of our ancestors...",
    greeting: "¡Bienvenido, mijo!",
    greetingTranslation: "Welcome, my child!",
    watermark: Flower2,
    description: "Wrapped in her colorful rebozo, Abuela Rosa carries the secrets of Oaxacan cuisine and the warmth of Mexican hospitality."
  },
  {
    id: 3,
    name: "Mae Malai",
    cuisine: "Thai",
    background: "#7FB069",
    signatureDish: "Green Curry",
    quote: "Balance in cooking, balance in life - this is our way...",
    greeting: "สวัสดีค่ะ",
    greetingTranslation: "Hello, dear",
    watermark: Leaf,
    description: "In her traditional dress, Mae Malai embodies the gentle wisdom of Thai cuisine, where every spice has purpose and every meal brings harmony."
  }
];

const Mamas = () => {
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
    <div className="h-full flex flex-col">
      <div className="text-center mb-6">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
          Choose Your Cooking Guide
        </h2>
        <p className="text-muted-foreground font-handwritten text-base">
          Learn authentic recipes from traditional cooks
        </p>
      </div>

      <div className="flex-1 relative">
        <Carousel
          setApi={setApi}
          className="w-full h-full"
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="h-[70vh]">
            {mamas.map((mama) => {
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

                    <div className="relative h-full p-6 flex flex-col text-white">
                      {/* Character illustration placeholder */}
                      <div className="flex justify-center mb-6">
                        <div className="w-48 h-48 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
                          <div className="w-40 h-40 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-6xl">👵🏻</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center mb-6">
                        <p className="text-sm font-medium opacity-90 mb-1">{mama.cuisine.toUpperCase()}</p>
                        <h3 className="font-heading font-bold text-3xl mb-4">{mama.name}</h3>
                        <p className="font-handwritten text-lg leading-relaxed opacity-95 mb-4">
                          {mama.description}
                        </p>
                      </div>

                      {/* Signature dish */}
                      <div className="bg-white/20 rounded-2xl p-4 mb-6">
                        <p className="text-xs font-medium opacity-80 mb-1">SIGNATURE DISH</p>
                        <p className="font-heading font-bold text-xl">{mama.signatureDish}</p>
                      </div>

                      {/* Quote */}
                      <div className="mb-6">
                        <p className="font-handwritten text-base italic opacity-90">
                          "{mama.quote}"
                        </p>
                      </div>

                      {/* CTA Button */}
                      <button className="bg-white text-gray-800 font-heading font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 mb-4">
                        📖 Open {mama.name.split(' ')[0]}'s Cookbook
                      </button>

                      {/* Cultural greeting */}
                      <div className="text-center">
                        <p className="font-handwritten text-lg mb-1">{mama.greeting}</p>
                        <p className="text-xs opacity-75">"{mama.greetingTranslation}"</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {mamas.map((_, index) => (
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
