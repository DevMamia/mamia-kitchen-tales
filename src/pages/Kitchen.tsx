
import React from 'react';
import { BookmarkCheck, Clock, Star, Plus } from 'lucide-react';

const Kitchen = () => {
  return (
    <div className="space-y-6">

      <div className="grid gap-4">
        <div className="bg-card rounded-2xl p-6 shadow-paper border border-border">
          <div className="flex items-center gap-3 mb-4">
            <BookmarkCheck className="text-primary" size={24} />
            <h3 className="font-heading font-bold text-lg text-foreground">
              Saved Recipes
            </h3>
          </div>
          <p className="text-muted-foreground mb-4">
            You have 12 recipes saved from your favorite mamas
          </p>
          <button className="w-full bg-primary text-primary-foreground font-heading font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors min-h-[48px]">
            View All Saved
          </button>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-paper border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-mexican" size={24} />
            <h3 className="font-heading font-bold text-lg text-foreground">
              Cooking History
            </h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Track your cooking journey and favorite dishes
          </p>
          <button className="w-full bg-mexican text-white font-heading font-semibold py-3 rounded-xl hover:bg-mexican/90 transition-colors min-h-[48px]">
            View History
          </button>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-paper border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Star className="text-thai" size={24} />
            <h3 className="font-heading font-bold text-lg text-foreground">
              My Reviews
            </h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Share your cooking experiences with the community
          </p>
          <button className="w-full bg-thai text-white font-heading font-semibold py-3 rounded-xl hover:bg-thai/90 transition-colors min-h-[48px]">
            Write Review
          </button>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-paper border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Plus className="text-primary" size={24} />
            <h3 className="font-heading font-bold text-lg text-foreground">
              Family Recipe
            </h3>
          </div>
          <p className="text-muted-foreground mb-4 font-handwritten">
            Share your own family recipes with the MAMIA community
          </p>
          <button className="w-full bg-primary text-primary-foreground font-heading font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors min-h-[48px]">
            Add Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Kitchen;
