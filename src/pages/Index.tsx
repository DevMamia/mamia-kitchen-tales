import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
import { useWindowSize } from '@uidotdev/usehooks';
import { Layout } from '@/components/Layout';
import RecipeCard from '@/components/RecipeCard';
import { CharacterCard } from '@/components/CharacterCard';
import { mamas } from '@/data/mamas';
import { recipes } from '@/data/recipes';
import { Mama } from '../data/mamas';

const Index = () => {
  const navigate = useNavigate();
  const [selectedMama, setSelectedMama] = useState<Mama | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const featuredRecipe = recipes[Math.floor(Math.random() * recipes.length)];
  const size = useWindowSize();
  const [plugins] = useState(() => [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  useEffect(() => {
    if (!api) return

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })

    return () => api.destroy()
  }, [api])

  useEffect(() => {
    if (size.width && size.width < 768) {
      api?.scrollTo(0)
    }
  }, [size.width, api])

  return (
    <Layout 
      pageTitle="Choose Your Cooking Companion" 
      pageSubtitle="Each mama brings authentic recipes and loving guidance from their homeland"
      variant="cultural"
    >
      <div className="space-y-8">
        {/* Enhanced Mama Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {mamas.map((mama, index) => (
                <CarouselItem key={mama.id} className="pl-2 md:pl-4 basis-[85%]">
                  <CharacterCard
                    mama={mama}
                    isActive={current === index}
                    onClick={() => {
                      setSelectedMama(mama);
                      navigate(`/mama/${mama.id}`);
                    }}
                    className="h-full"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Enhanced Progress Dots */}
          <div className="flex justify-center space-x-3 mt-6">
            {mamas.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  current === index 
                    ? 'bg-primary shadow-lg scale-125' 
                    : 'bg-muted hover:bg-muted-foreground/50'
                }`}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        </div>

        {/* Featured Recipe Section */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
              Recipe of the Week
            </h3>
            <p className="text-muted-foreground font-handwritten">
              Hand-picked by our mamas for you to try
            </p>
          </div>

          <RecipeCard
            recipe={featuredRecipe}
            variant="hero"
            onClick={() => navigate(`/recipe/${featuredRecipe.id}`)}
            className="mx-auto max-w-md"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/recipes')}
            className="warm-card p-6 text-center hover:shadow-cultural transition-all duration-300 group"
          >
            <div className="text-3xl mb-3 floating-elements">📚</div>
            <h4 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              Browse Recipes
            </h4>
            <p className="text-sm text-muted-foreground font-handwritten">
              Discover authentic dishes
            </p>
          </button>

          <button
            onClick={() => navigate('/kitchen')}
            className="warm-card p-6 text-center hover:shadow-cultural transition-all duration-300 group"
          >
            <div className="text-3xl mb-3 floating-elements">🛒</div>
            <h4 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              My Kitchen
            </h4>
            <p className="text-sm text-muted-foreground font-handwritten">
              Shopping & favorites
            </p>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
