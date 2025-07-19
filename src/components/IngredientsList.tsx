
import React from 'react';

interface Ingredient {
  name: string;
  quantity: string;
  unit?: string;
  notes?: string;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
}

export const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients }) => {
  return (
    <div className="space-y-3">
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-foreground">
                {ingredient.quantity} {ingredient.unit && ingredient.unit} {ingredient.name}
              </span>
            </div>
            {ingredient.notes && (
              <p className="text-sm text-muted-foreground mt-1">{ingredient.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
