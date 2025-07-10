import { mamas, getMamaById } from './mamas';

export type Difficulty = 'EASY' | 'MEDIUM' | 'ADVANCED';
export type Category = 'QUICK' | 'EVERYDAY' | 'WEEKEND' | 'CELEBRATION';

export interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  cookTimeMin: number;
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
  // Additional fields
  subsNote?: string;
  // Cooking context
  cookingTips?: string[];
  difficulty_explanation?: string;
}

export const recipes: Recipe[] = [
  // Nonna Lucia's Recipes
  {
    id: 'penne-arrabbiata',
    title: 'Penne all\'Arrabbiata',
    cookingTime: '18 min',
    cookTimeMin: 18,
    difficulty: 'EASY',
    category: 'QUICK',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: ['400g penne pasta', '4 cloves garlic', '2 fresh chillies', '400g crushed tomatoes', 'Olive oil', 'Parsley', 'Salt'],
    instructions: [
      'Heat olive oil in large pan',
      'Add sliced garlic and chillies, cook until fragrant',
      'Add crushed tomatoes and season with salt',
      'Simmer sauce while pasta cooks',
      'Cook penne until al dente',
      'Toss pasta with sauce and pasta water',
      'Garnish with fresh parsley'
    ],
    servings: 4,
    description: 'Spicy tomato pasta with garlic and chillies',
    voiceIntro: 'Ciao bello! A quick kick of chilli to wake up your taste buds.',
    voiceTips: ['Splash pasta water so the sauce hugs the penne.', 'Arrabbiata means \'angry\'—let it blush!'],
    subsNote: 'No penne? Any short pasta works. No fresh chilli? Use 1/4 tsp flakes.',
    voiceEnabled: true
  },
  {
    id: 'chicken-cacciatore',
    title: 'Chicken Cacciatore',
    cookingTime: '40 min',
    cookTimeMin: 40,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: ['1 whole chicken cut up', 'Bell peppers', 'Mushrooms', 'Onions', 'Crushed tomatoes', 'White wine', 'Herbs'],
    instructions: [
      'Brown chicken pieces in olive oil',
      'Remove chicken and sauté vegetables',
      'Add wine and tomatoes',
      'Return chicken to pot',
      'Simmer until chicken is tender',
      'Season with herbs and serve'
    ],
    servings: 4,
    description: 'Hunter-style chicken with vegetables in tomato sauce',
    voiceIntro: 'We are hunting flavour today, my dear!',
    subsNote: 'Swap mushrooms for chicken for a vegetarian pot.',
    voiceEnabled: true
  },
  {
    id: 'carbonara-1',
    title: 'Pasta Carbonara',
    cookingTime: '30 min',
    cookTimeMin: 30,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
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
    voiceIntro: 'Remember—no cream! Just eggs and love.',
    subsNote: 'Pancetta instead of guanciale is okay; Parm if no Pecorino.',
    voiceEnabled: true
  },
  {
    id: 'lasagna-nonna',
    title: 'Lasagna alla Nonna',
    cookingTime: '2 hours',
    cookTimeMin: 120,
    difficulty: 'ADVANCED',
    category: 'WEEKEND',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: ['Lasagna sheets', 'Bolognese sauce', 'Béchamel sauce', 'Mozzarella', 'Parmesan', 'Fresh basil'],
    instructions: [
      'Prepare Bolognese sauce',
      'Make béchamel sauce',
      'Cook lasagna sheets',
      'Layer sauce, pasta, and cheese',
      'Repeat layers',
      'Top with cheese and bake'
    ],
    servings: 8,
    description: 'Traditional layered pasta with meat sauce and béchamel',
    voiceIntro: 'Clear your Sunday—this is a labour of love.',
    subsNote: 'Store‑bought sheets fine; soak 10 min if oven‑ready.',
    voiceEnabled: true
  },
  {
    id: 'osso-buco',
    title: 'Osso Buco con Gremolata',
    cookingTime: '3 hours',
    cookTimeMin: 180,
    difficulty: 'ADVANCED',
    category: 'CELEBRATION',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: ['Veal shanks', 'Carrots', 'Celery', 'Onions', 'White wine', 'Beef stock', 'Gremolata ingredients'],
    instructions: [
      'Brown veal shanks',
      'Sauté vegetables',
      'Add wine and stock',
      'Braise slowly for 2-3 hours',
      'Make gremolata',
      'Serve with gremolata'
    ],
    servings: 6,
    description: 'Braised veal shanks with aromatic vegetables',
    voiceIntro: 'A feast fit for famiglia reunions.',
    subsNote: 'Beef shank works if you can\'t find veal.',
    voiceEnabled: true
  },

  // Abuela Rosa's Recipes
  {
    id: 'quesadillas-poblano',
    title: 'Quesadillas de Queso y Poblano',
    cookingTime: '15 min',
    cookTimeMin: 15,
    difficulty: 'EASY',
    category: 'QUICK',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: ['Flour tortillas', 'Oaxaca cheese', 'Poblano peppers', 'Onions'],
    instructions: [
      'Roast poblano peppers',
      'Slice peppers and onions',
      'Fill tortillas with cheese and vegetables',
      'Cook until golden and cheese melts'
    ],
    servings: 4,
    description: 'Crispy cheese and poblano pepper quesadillas',
    voiceIntro: 'Rapidito y delicioso—my cheesy hug!',
    subsNote: 'Bell pepper for poblano; mozzarella if no Oaxaca cheese.',
    voiceEnabled: true
  },
  {
    id: 'chicken-tinga',
    title: 'Chicken Tinga Tacos',
    cookingTime: '35 min',
    cookTimeMin: 35,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: ['Chicken thighs', 'Chipotle peppers', 'Tomatoes', 'Onions', 'Corn tortillas'],
    instructions: [
      'Cook chicken until tender',
      'Shred chicken',
      'Make chipotle tomato sauce',
      'Combine chicken with sauce',
      'Serve in warm tortillas'
    ],
    servings: 6,
    description: 'Smoky shredded chicken in chipotle sauce',
    voiceIntro: 'Smoky chipotle memories from Puebla.',
    subsNote: 'Use rotisserie chicken to halve prep time.',
    voiceEnabled: true
  },
  {
    id: 'enchiladas-verdes',
    title: 'Enchiladas Verdes',
    cookingTime: '40 min',
    cookTimeMin: 40,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: ['Corn tortillas', 'Tomatillos', 'Green chiles', 'Chicken', 'Mexican cheese', 'Onions'],
    instructions: [
      'Make green salsa with tomatillos',
      'Warm tortillas',
      'Fill with chicken',
      'Roll and place in baking dish',
      'Cover with salsa and cheese',
      'Bake until bubbling'
    ],
    servings: 6,
    description: 'Chicken enchiladas in tangy green sauce',
    voiceIntro: 'Tomatillo brightness for your weeknight.',
    subsNote: 'Canned green salsa works in a pinch.',
    voiceEnabled: true
  },
  {
    id: 'pozole-rojo',
    title: 'Pozole Rojo',
    cookingTime: '2 hours',
    cookTimeMin: 120,
    difficulty: 'ADVANCED',
    category: 'WEEKEND',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: ['Pork shoulder', 'Hominy', 'Guajillo chiles', 'Ancho chiles', 'Garlic', 'Onions'],
    instructions: [
      'Simmer pork until tender',
      'Toast and blend chiles',
      'Add chile sauce to broth',
      'Add hominy',
      'Simmer until flavors meld',
      'Serve with garnishes'
    ],
    servings: 8,
    description: 'Traditional Mexican soup with hominy and pork',
    voiceIntro: 'Big pot, big love—listen for the hominy pop.',
    subsNote: 'Canned hominy cuts simmer time.',
    voiceEnabled: true
  },
  {
    id: 'mole-poblano',
    title: 'Mole Poblano',
    cookingTime: '3 hours',
    cookTimeMin: 180,
    difficulty: 'ADVANCED',
    category: 'CELEBRATION',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: ['Various chiles', 'Chocolate', 'Chicken', 'Tomatoes', 'Nuts', 'Seeds', 'Spices'],
    instructions: [
      'Toast all chiles',
      'Blend with other ingredients',
      'Cook sauce slowly',
      'Add chocolate',
      'Simmer chicken in sauce',
      'Serve with rice'
    ],
    servings: 8,
    description: 'Complex sauce with chiles and chocolate',
    voiceIntro: 'Many chiles, one heart.',
    subsNote: 'Shortcut: start with 1 cup jarred mole paste, thin with stock.',
    voiceEnabled: true
  },

  // Mae Malai's Recipes
  {
    id: 'pad-krapao',
    title: 'Pad Krapao Gai',
    cookingTime: '15 min',
    cookTimeMin: 15,
    difficulty: 'EASY',
    category: 'QUICK',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: ['Ground chicken', 'Thai holy basil', 'Chiles', 'Garlic', 'Fish sauce', 'Oyster sauce'],
    instructions: [
      'Heat wok until smoking',
      'Stir-fry garlic and chiles',
      'Add chicken and cook through',
      'Add sauces',
      'Toss in holy basil',
      'Serve over rice with fried egg'
    ],
    servings: 2,
    description: 'Spicy Thai basil chicken',
    voiceIntro: 'Hot wok, holy basil—don\'t blink.',
    subsNote: 'Use sweet basil + mint if Thai basil unavailable.',
    voiceEnabled: true
  },
  {
    id: 'green-curry',
    title: 'Green Curry',
    cookingTime: '35 min',
    cookTimeMin: 35,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: ['Green curry paste', 'Coconut milk', 'Chicken', 'Thai eggplant', 'Thai basil', 'Fish sauce'],
    instructions: [
      'Fry curry paste in coconut cream',
      'Add chicken and cook',
      'Add remaining coconut milk',
      'Simmer with eggplant',
      'Season to taste',
      'Garnish with basil'
    ],
    servings: 4,
    description: 'Aromatic coconut curry with chicken',
    featured: true,
    voiceIntro: 'Green like the jungle after rain.',
    subsNote: 'Jar curry paste is fine; add extra lime leaf for punch.',
    voiceEnabled: true
  },
  {
    id: 'pad-thai',
    title: 'Pad Thai',
    cookingTime: '35 min',
    cookTimeMin: 35,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: ['Rice noodles', 'Shrimp', 'Eggs', 'Bean sprouts', 'Tamarind paste', 'Palm sugar'],
    instructions: [
      'Soak noodles until soft',
      'Heat wok until smoking',
      'Scramble eggs',
      'Add noodles and sauce',
      'Toss with bean sprouts',
      'Garnish with peanuts and lime'
    ],
    servings: 2,
    description: 'Classic Thai stir-fried noodles',
    voiceIntro: 'Sweet, sour, salty—balance is everything.',
    subsNote: 'Lime + brown sugar works if tamarind missing.',
    voiceEnabled: true
  },
  {
    id: 'khao-soi',
    title: 'Khao Soi',
    cookingTime: '2 hours',
    cookTimeMin: 120,
    difficulty: 'ADVANCED',
    category: 'WEEKEND',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: ['Chicken', 'Curry paste', 'Coconut milk', 'Egg noodles', 'Shallots', 'Lime'],
    instructions: [
      'Make curry base',
      'Simmer chicken until tender',
      'Cook noodles',
      'Combine curry and noodles',
      'Fry noodles for topping',
      'Serve with garnishes'
    ],
    servings: 4,
    description: 'Northern Thai curry noodle soup',
    voiceIntro: 'Northern warmth in a bowl.',
    subsNote: 'Crispy noodle topping optional but magic.',
    voiceEnabled: true
  },
  {
    id: 'massaman-beef',
    title: 'Massaman Beef Curry',
    cookingTime: '3 hours',
    cookTimeMin: 180,
    difficulty: 'ADVANCED',
    category: 'CELEBRATION',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: ['Beef chuck', 'Massaman paste', 'Coconut milk', 'Potatoes', 'Peanuts', 'Tamarind'],
    instructions: [
      'Brown beef in batches',
      'Fry curry paste',
      'Add coconut milk gradually',
      'Braise beef until tender',
      'Add potatoes and peanuts',
      'Simmer until thick'
    ],
    servings: 6,
    description: 'Rich, aromatic curry with tender beef',
    voiceIntro: 'Spices from afar, comfort from home.',
    subsNote: 'Chicken thigh works too; cut cook to 90 min.',
    voiceEnabled: true
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