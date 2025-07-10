
import React from 'react';
import { Star, MapPin, Clock } from 'lucide-react';

const mamas = [
  {
    id: 1,
    name: "Nonna Maria",
    cuisine: "Italian",
    rating: 4.9,
    location: "Bologna, Italy",
    specialties: ["Handmade Pasta", "Tiramisu", "Risotto"],
    cookingTime: "2-3 hours",
    accent: "italian"
  },
  {
    id: 2,
    name: "Abuela Carmen",
    cuisine: "Mexican",
    rating: 4.8,
    location: "Guadalajara, Mexico",
    specialties: ["Mole", "Tamales", "Churros"],
    cookingTime: "1-2 hours",
    accent: "mexican"
  },
  {
    id: 3,
    name: "Mae Siriporn",
    cuisine: "Thai",
    rating: 4.9,
    location: "Bangkok, Thailand",
    specialties: ["Pad Thai", "Green Curry", "Mango Sticky Rice"],
    cookingTime: "30-45 mins",
    accent: "thai"
  }
];

const Mamas = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
          Meet Our Mamas
        </h2>
        <p className="text-muted-foreground font-handwritten text-lg">
          Learn from the best grandmothers around the world
        </p>
      </div>

      <div className="space-y-4">
        {mamas.map((mama) => (
          <div key={mama.id} className="bg-card rounded-2xl p-6 shadow-paper border border-border hover:shadow-warm transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                  {mama.name}
                </h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-${mama.accent} mb-2`}>
                  {mama.cuisine}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span>{mama.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{mama.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{mama.cookingTime}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Specialties:</p>
              <div className="flex flex-wrap gap-2">
                {mama.specialties.map((specialty, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-handwritten"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            
            <button className="w-full mt-4 bg-primary text-primary-foreground font-heading font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors min-h-[48px]">
              Learn from {mama.name.split(' ')[0]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mamas;
