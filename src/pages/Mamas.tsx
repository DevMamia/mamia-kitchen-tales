
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { mamas } from '@/data/mamas';
import { useAuth } from '@/contexts/AuthContext';

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
            {mamas.map((mama) => (
              <CarouselItem key={mama.id} className="basis-[85%] pl-4">
                <div 
                  onClick={() => navigate(`/mama/${mama.id}`)}
                  className="relative h-full rounded-3xl overflow-hidden shadow-warm cursor-pointer transition-transform duration-200 hover:scale-105"
                >
                  {/* Full character card image */}
                  <img 
                    src={mama.avatar} 
                    alt={`${mama.name} Character Card`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-4">
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
