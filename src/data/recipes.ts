import { mamas, getMamaById } from './mamas';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Category = 'Meat' | 'Fish' | 'Rice/Pasta' | 'Dessert' | 'Vegetarian' | 'Appetizer';

export interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  difficulty: Difficulty;
  category: Category;
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
  // Voice integration fields
  voiceIntro?: string;
  voiceTips?: string[];
  voiceEnabled?: boolean;
  // Cooking context
  cookingTips?: string[];
  difficulty_explanation?: string;
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
    instructions: [
      'Boil pasta in well-salted water until al dente',
      'Cut guanciale into small cubes and fry until golden and crispy',
      'In a bowl, whisk egg yolks with grated Pecorino Romano and black pepper',
      'Drain pasta, reserving some pasta water',
      'Remove guanciale pan from heat, add hot pasta and toss',
      'Add egg mixture and toss quickly, adding pasta water to create creamy sauce'
    ],
    servings: 4,
    description: 'Authentic Roman carbonara with crispy guanciale and creamy egg sauce.',
    featured: true,
    voiceIntro: 'Ah, mia cara! Today we make the real carbonara - no cream, no peas, just the way my nonna taught me in Roma!',
    voiceEnabled: true,
    voiceTips: [
      'The secret is to turn off the heat before adding the eggs, otherwise you get scrambled eggs!',
      'Use the starchy pasta water - it\'s liquid gold for making the sauce creamy!',
      'Guanciale is better than pancetta - it has more flavor from the jowl of the pig.'
    ],
    cookingTips: [
      'Never add cream to carbonara - it\'s not traditional',
      'The pasta water helps emulsify the egg and cheese mixture',
      'Work quickly when combining to prevent eggs from scrambling'
    ],
    difficulty_explanation: 'Medium difficulty due to timing - you must work quickly to create the creamy sauce without scrambling the eggs.'
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
    ingredients: ['320g Arborio rice', '500g mixed mushrooms', '1.5L vegetable stock', '150ml white wine', 'Parmesan cheese', 'Butter', 'Onion', 'Garlic'],
    instructions: [
      'Clean and slice mushrooms, sauté until golden',
      'Heat stock in a separate pot and keep warm',
      'In risotto pan, sauté minced onion and garlic in butter',
      'Add rice and toast for 2 minutes until translucent',
      'Pour in wine and stir until absorbed',
      'Add warm stock one ladle at a time, stirring constantly',
      'Continue for 18-20 minutes until rice is creamy but still has bite',
      'Stir in mushrooms and generous Parmesan cheese'
    ],
    servings: 4,
    description: 'Creamy risotto with wild mushrooms and aged Parmesan.',
    recipeOfWeek: true,
    voiceIntro: 'Bene! Risotto is like a meditation - you must be patient and stir with amore. No rushing!',
    voiceEnabled: true,
    voiceTips: [
      'Add the stock slowly, one ladle at a time - this releases the starch gradually',
      'The rice should move like lava when you shake the pan - this is mantecatura!',
      'Never stop stirring - it develops the creamy texture we want'
    ],
    difficulty_explanation: 'Hard because it requires constant attention and stirring for 20+ minutes, plus timing to get the perfect creamy texture.'
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
    ingredients: ['24 ladyfinger cookies', '500g mascarpone', '6 eggs', '150g sugar', '300ml strong coffee', 'Cocoa powder', 'Dark rum (optional)'],
    instructions: [
      'Brew strong coffee and let cool, add rum if using',
      'Separate eggs - yolks in one bowl, whites in another',
      'Whisk yolks with sugar until pale and thick',
      'Gently fold mascarpone into yolk mixture',
      'Whip egg whites to soft peaks and fold into mascarpone mixture',
      'Quickly dip each ladyfinger in coffee and layer in dish',
      'Spread half the mascarpone mixture over cookies',
      'Repeat layering and chill for at least 4 hours',
      'Dust with cocoa powder before serving'
    ],
    servings: 8,
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone.',
    voiceIntro: 'Tiramisu means "pick me up" - and this dessert will lift your spirits to heaven!',
    voiceEnabled: true,
    voiceTips: [
      'The coffee should be strong but not bitter - let it cool completely',
      'Don\'t over-soak the ladyfingers or they become mushy',
      'Chill overnight if possible - the flavors meld beautifully'
    ]
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
    ingredients: [
      '6 chicken pieces', 'Mulato chiles', 'Ancho chiles', 'Pasilla chiles', 'Chipotle chiles',
      'Mexican chocolate', 'Tomatoes', 'Tomatillos', 'White onion', 'Garlic', 'Sesame seeds',
      'Pumpkin seeds', 'Raisins', 'Bread', 'Tortilla', 'Cinnamon', 'Cloves', 'Black pepper'
    ],
    instructions: [
      'Toast all chiles in dry pan until fragrant, remove seeds and stems',
      'Soak chiles in hot water for 30 minutes',
      'Toast sesame seeds, pumpkin seeds, and spices separately',
      'Char tomatoes, tomatillos, onion, and garlic',
      'Fry bread and tortilla until golden',
      'Blend everything in batches with chile soaking liquid',
      'Strain mixture through fine sieve',
      'Cook sauce in large pot for 1-2 hours, stirring frequently',
      'Add chocolate and season to taste',
      'Simmer chicken in sauce until tender'
    ],
    servings: 6,
    description: 'Complex Oaxacan sauce with over 20 ingredients including chocolate.',
    featured: true,
    voiceIntro: '¡Órale! Mole negro is the queen of Mexican sauces - it takes time, but cada ingredient has its purpose, mija.',
    voiceEnabled: true,
    voiceTips: [
      'Don\'t rush the toasting - each chile needs to release its aroma but not burn',
      'The sauce should cook slowly, like a good relationship - with patience and attention',
      'When it\'s ready, the mole will coat the back of a spoon like velvet'
    ],
    difficulty_explanation: 'Very complex with 20+ ingredients that must be prepared in specific order and cooked for hours.'
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
    ingredients: ['2kg pork shoulder', 'Orange juice', 'Lime juice', 'Lard or oil', 'Cumin', 'Bay leaves', 'Garlic', 'Onion', 'Corn tortillas'],
    instructions: [
      'Cut pork shoulder into large chunks, season with salt and cumin',
      'Heat lard in large heavy pot over medium heat',
      'Brown pork pieces on all sides',
      'Add orange juice, garlic, bay leaves, and onion',
      'Cover and simmer for 2 hours until meat shreds easily',
      'Remove meat and shred with forks',
      'Return to pot and cook uncovered to crisp edges',
      'Warm tortillas and serve with lime, onion, and salsa'
    ],
    servings: 8,
    description: 'Tender, juicy pork slow-cooked until perfectly shreddable.',
    voiceIntro: 'Carnitas are the soul of Mexican cooking - low and slow until the meat falls apart with just a fork!',
    voiceEnabled: true,
    voiceTips: [
      'The orange juice makes the meat tender and adds a subtle sweetness',
      'At the end, let the edges get crispy - that\'s the best part!',
      'Warm your tortillas on the comal for the authentic experience'
    ]
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
    ingredients: ['6 large eggs', '1 can condensed milk', '1 can evaporated milk', 'Vanilla extract', '200g sugar for caramel'],
    instructions: [
      'Preheat oven to 350°F and prepare flan mold',
      'Make caramel by heating sugar until golden amber',
      'Pour caramel into mold and swirl to coat bottom',
      'Blend eggs, condensed milk, evaporated milk, and vanilla',
      'Strain mixture to remove any lumps',
      'Pour custard over caramel in mold',
      'Cover with foil and bake in water bath for 45-50 minutes',
      'Cool completely, then refrigerate for 4 hours',
      'Run knife around edges and invert onto serving plate'
    ],
    servings: 8,
    description: 'Silky smooth custard with golden caramel sauce.',
    voiceIntro: 'Flan is like a kiss from heaven - smooth, sweet, and it makes everyone smile, ¿verdad?',
    voiceEnabled: true,
    voiceTips: [
      'Watch the caramel carefully - it goes from perfect to burned very quickly',
      'The water bath keeps the custard gentle and prevents cracking',
      'Let it cool completely before unmolding - patience, mija!'
    ]
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
    ingredients: [
      '3 tbsp green curry paste', '400ml coconut milk', '500g chicken thigh', 'Thai eggplant',
      'Thai basil leaves', 'Fish sauce', 'Palm sugar', 'Kaffir lime leaves', 'Thai chilies'
    ],
    instructions: [
      'Heat thick coconut cream in wok until oil separates',
      'Add curry paste and fry until fragrant (2-3 minutes)',
      'Add chicken pieces and cook until sealed',
      'Pour in remaining coconut milk gradually',
      'Add palm sugar and fish sauce to taste',
      'Simmer for 15 minutes until chicken is tender',
      'Add eggplant and cook for 5 minutes',
      'Garnish with Thai basil and lime leaves'
    ],
    servings: 4,
    description: 'Aromatic and spicy curry with fresh herbs and coconut milk.',
    featured: true,
    voiceIntro: 'Ah, green curry! The smell of lemongrass and basil will transport you to Thailand, darling!',
    voiceEnabled: true,
    voiceTips: [
      'Fry the curry paste until the oil separates - this releases all the flavors',
      'Use the thick cream from the top of the coconut milk first',
      'Add the basil at the very end to keep it fresh and bright'
    ],
    difficulty_explanation: 'Medium due to balancing the complex flavors and getting the right consistency.'
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
    ingredients: [
      '200g rice noodles', '200g shrimp', '2 eggs', '100g bean sprouts', 'Tamarind paste',
      'Palm sugar', 'Fish sauce', 'Roasted peanuts', 'Lime wedges', 'Chives'
    ],
    instructions: [
      'Soak rice noodles in warm water until soft',
      'Mix tamarind paste, palm sugar, and fish sauce for sauce',
      'Heat wok over high heat with oil',
      'Scramble eggs and set aside',
      'Stir-fry shrimp until pink',
      'Add drained noodles and sauce, toss quickly',
      'Add bean sprouts and scrambled eggs',
      'Garnish with peanuts, lime, and chives'
    ],
    servings: 2,
    description: 'Thailand\'s most famous noodle dish with sweet, sour, and salty flavors.',
    voiceIntro: 'Pad Thai is all about the balance - sweet, sour, salty, and a little heat. Like life itself!',
    voiceEnabled: true,
    voiceTips: [
      'High heat is essential - the wok should be smoking hot',
      'Don\'t oversoak the noodles or they become mushy',
      'Taste and adjust - every tamarind is different in sourness'
    ]
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
    ingredients: ['1 cup glutinous rice', '400ml coconut milk', '100g palm sugar', 'Pinch of salt', '2 ripe mangoes'],
    instructions: [
      'Soak glutinous rice overnight in water',
      'Steam rice in cheesecloth for 25-30 minutes',
      'Heat coconut milk with palm sugar and salt',
      'Mix warm rice with half the coconut sauce',
      'Let rice absorb the sauce for 30 minutes',
      'Slice mangoes and arrange with rice',
      'Drizzle with remaining coconut sauce'
    ],
    servings: 4,
    description: 'Sweet and creamy coconut rice paired with fresh tropical mango.',
    voiceIntro: 'This dessert tastes like sunshine and happiness - perfect mangoes with sweet coconut rice!',
    voiceEnabled: true,
    voiceTips: [
      'The rice should be translucent when properly steamed',
      'Choose mangoes that are ripe but still firm - too soft and they fall apart',
      'Let the rice rest with the coconut milk - patience makes it perfect'
    ]
  }
];

// Utility functions
export const getRecipesByMama = (mamaId: number): Recipe[] => {
  return recipes.filter(recipe => recipe.mamaId === mamaId);
};

export const getFeaturedRecipes = (): Recipe[] => {
  return recipes.filter(recipe => recipe.featured);
};

export const getRecipeOfWeek = (): Recipe | undefined => {
  return recipes.find(recipe => recipe.recipeOfWeek);
};

export const getRecipesByCategory = (category: string): Recipe[] => {
  if (category === 'All') return recipes;
  return recipes.filter(recipe => recipe.category === category);
};

export const getRecipeById = (id: string): Recipe | undefined => {
  return recipes.find(recipe => recipe.id === id);
};

export const getVoiceEnabledRecipes = (): Recipe[] => {
  return recipes.filter(recipe => recipe.voiceEnabled);
};

export const getRecipeWithMama = (id: string) => {
  const recipe = getRecipeById(id);
  if (!recipe) return null;
  
  const mama = getMamaById(recipe.mamaId);
  return { recipe, mama };
};