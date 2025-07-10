export interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Meat' | 'Fish' | 'Rice/Pasta' | 'Dessert';
  image: string;
  mamaId: number;
  mamaName: string;
  mamaEmoji: string;
  ingredients: string[];
  instructions: string[];
  servings: number;
  description: string;
  featured?: boolean;
  recipeOfWeek?: boolean;
}

export const recipes: Recipe[] = [
  // Nonna Lucia's Recipes
  {
    id: 'carbonara-1',
    title: 'Classic Carbonara',
    cookingTime: '20 min',
    difficulty: 'Medium',
    category: 'Rice/Pasta',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: ['400g spaghetti', '200g guanciale', '4 egg yolks', '100g Pecorino Romano', 'Black pepper', 'Salt'],
    instructions: ['Boil pasta in salted water', 'Fry guanciale until crispy', 'Mix egg yolks with cheese', 'Combine all ingredients off heat'],
    servings: 4,
    description: 'Authentic Roman carbonara with crispy guanciale and creamy egg sauce.',
    featured: true
  },
  {
    id: 'risotto-1',
    title: 'Mushroom Risotto',
    cookingTime: '35 min',
    difficulty: 'Hard',
    category: 'Rice/Pasta',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: ['320g Arborio rice', '500g mixed mushrooms', '1.5L vegetable stock', '150ml white wine', 'Parmesan cheese'],
    instructions: ['Sauté mushrooms', 'Toast rice', 'Add wine and stock gradually', 'Finish with cheese'],
    servings: 4,
    description: 'Creamy risotto with wild mushrooms and aged Parmesan.',
    recipeOfWeek: true
  },
  {
    id: 'tiramisu-1',
    title: 'Traditional Tiramisu',
    cookingTime: '4 hours',
    difficulty: 'Medium',
    category: 'Dessert',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: ['Ladyfinger cookies', 'Mascarpone', 'Eggs', 'Sugar', 'Strong coffee', 'Cocoa powder'],
    instructions: ['Make coffee mixture', 'Prepare mascarpone cream', 'Layer cookies and cream', 'Chill for 4 hours'],
    servings: 8,
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone.',
  },

  // Abuela Rosa's Recipes
  {
    id: 'mole-1',
    title: 'Mole Negro',
    cookingTime: '3 hours',
    difficulty: 'Hard',
    category: 'Meat',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: ['6 chicken pieces', '30+ chiles', 'Chocolate', 'Tomatoes', 'Onions', 'Spices'],
    instructions: ['Toast chiles', 'Blend with tomatoes', 'Cook chicken', 'Simmer sauce for hours'],
    servings: 6,
    description: 'Complex Oaxacan sauce with over 20 ingredients including chocolate.',
    featured: true
  },
  {
    id: 'tacos-1',
    title: 'Carnitas Tacos',
    cookingTime: '2.5 hours',
    difficulty: 'Medium',
    category: 'Meat',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: ['2kg pork shoulder', 'Orange juice', 'Lard', 'Cumin', 'Bay leaves', 'Corn tortillas'],
    instructions: ['Season pork', 'Slow cook in lard', 'Shred meat', 'Serve in warm tortillas'],
    servings: 8,
    description: 'Tender, juicy pork slow-cooked until perfectly shreddable.',
  },
  {
    id: 'flan-1',
    title: 'Mexican Flan',
    cookingTime: '1 hour',
    difficulty: 'Medium',
    category: 'Dessert',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: ['6 eggs', '1 can condensed milk', '1 can evaporated milk', 'Vanilla', 'Sugar for caramel'],
    instructions: ['Make caramel', 'Blend custard ingredients', 'Bake in water bath', 'Cool and unmold'],
    servings: 8,
    description: 'Silky smooth custard with golden caramel sauce.',
  },

  // Mae Malai's Recipes
  {
    id: 'curry-1',
    title: 'Green Curry',
    cookingTime: '45 min',
    difficulty: 'Medium',
    category: 'Meat',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: ['Green curry paste', 'Coconut milk', 'Chicken', 'Thai eggplant', 'Basil leaves', 'Fish sauce'],
    instructions: ['Fry curry paste', 'Add coconut milk', 'Cook chicken', 'Add vegetables and seasonings'],
    servings: 4,
    description: 'Aromatic and spicy curry with fresh herbs and coconut milk.',
    featured: true
  },
  {
    id: 'pad-thai-1',
    title: 'Pad Thai',
    cookingTime: '25 min',
    difficulty: 'Medium',
    category: 'Rice/Pasta',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: ['Rice noodles', 'Shrimp', 'Eggs', 'Bean sprouts', 'Tamarind paste', 'Palm sugar', 'Peanuts'],
    instructions: ['Soak noodles', 'Stir-fry proteins', 'Add noodles and sauce', 'Garnish with peanuts'],
    servings: 2,
    description: 'Thailand\'s most famous noodle dish with sweet, sour, and salty flavors.',
  },
  {
    id: 'mango-sticky-rice-1',
    title: 'Mango Sticky Rice',
    cookingTime: '1.5 hours',
    difficulty: 'Easy',
    category: 'Dessert',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: ['Glutinous rice', 'Coconut milk', 'Palm sugar', 'Salt', 'Ripe mangoes'],
    instructions: ['Steam rice', 'Make coconut sauce', 'Mix rice with sauce', 'Serve with fresh mango'],
    servings: 4,
    description: 'Sweet and creamy coconut rice paired with fresh tropical mango.',
  }
];

export const getRecipesByMama = (mamaId: number) => {
  return recipes.filter(recipe => recipe.mamaId === mamaId);
};

export const getFeaturedRecipes = () => {
  return recipes.filter(recipe => recipe.featured);
};

export const getRecipeOfWeek = () => {
  return recipes.find(recipe => recipe.recipeOfWeek);
};

export const getRecipesByCategory = (category: string) => {
  if (category === 'All') return recipes;
  return recipes.filter(recipe => recipe.category === category);
};