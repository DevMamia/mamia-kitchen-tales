
import React from 'react';
import { Clock, Users, ChefHat, Star } from 'lucide-react';

const recipes = [
  {
    id: 1,
    title: "Nonna's Secret Carbonara",
    mama: "Nonna Maria",
    cuisine: "Italian",
    difficulty: "Medium",
    time: "30 mins",
    servings: 4,
    rating: 4.9,
    image: "🍝",
    accent: "italian"
  },
  {
    id: 2,
    title: "Authentic Mole Poblano",
    mama: "Abuela Carmen",
    cuisine: "Mexican", 
    difficulty: "Hard",
    time: "3 hours",
    servings: 8,
    rating: 4.8,
    image: "🌶️",
    accent: "mexican"
  },
  {
    id: 3,
    title: "Perfect Pad Thai",
    mama: "Mae Siriporn",
    cuisine: "Thai",
    difficulty: "Easy",
    time: "20 mins",
    servings: 2,
    rating: 4.9,
    image: "🍜",
    accent: "thai"
  }
];

const Recipes = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
          Family Recipes
        </h2>
        <p className="text-muted-foreground font-handwritten text-lg">
          Passed down through generations
        </p>
      </div>

      <div className="space-y-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-card rounded-2xl overflow-hidden shadow-paper border border-border hover:shadow-warm transition-all duration-200">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{recipe.image}</div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    by {recipe.mama}
                  </p>
                  <div className={`inline-block px-2 py-1 rounded-lg text-xs font-medium text-white bg-${recipe.accent}`}>
                    {recipe.cuisine}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{recipe.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{recipe.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChefHat size={16} />
                  <span>{recipe.difficulty}</span>
                </div>
              </div>
              
              <button className="w-full bg-primary text-primary-foreground font-heading font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors min-h-[48px]">
                Cook This Recipe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
