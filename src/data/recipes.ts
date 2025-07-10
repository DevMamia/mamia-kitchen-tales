import { mamas, getMamaById } from './mamas';

export type Difficulty = 'EASY' | 'MEDIUM' | 'ADVANCED';
export type Category = 'QUICK' | 'EVERYDAY' | 'WEEKEND' | 'CELEBRATION';
export type ContentType = 'MEAT' | 'FISH' | 'VEGETARIAN' | 'VEGAN';

export interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  cookTimeMin: number;
  difficulty: Difficulty;
  category: Category;
  contentType: ContentType;
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
    contentType: 'VEGETARIAN',
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
    recipeOfWeek: true,
    voiceIntro: 'Ciao bello! A quick kick of chilli to wake up your taste buds.',
    voiceTips: ['Splash pasta water so the sauce hugs the penne.', 'Arrabbiata means \'angry\'—let it blush!'],
    subsNote: 'No penne? Any short pasta works. No fresh chilli? Use 1/4 tsp flakes.',
    voiceEnabled: true
  },
  {
    id: 'chicken-cacciatore',
    title: 'Chicken Cacciatore',
    cookingTime: '1 hour 15 min',
    cookTimeMin: 75,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: [
      '1.5kg whole chicken, cut into 8 pieces',
      '60ml extra virgin olive oil',
      '1 large yellow onion (200g), sliced',
      '2 red bell peppers (300g), cut into strips',
      '250g button mushrooms, quartered',
      '4 cloves garlic, minced',
      '250ml dry white wine',
      '400g can crushed San Marzano tomatoes',
      '2 sprigs fresh rosemary',
      '4 sprigs fresh thyme',
      '2 bay leaves',
      '60g pitted Kalamata olives',
      '2 tbsp fresh parsley, chopped',
      'Sea salt and black pepper to taste',
      '250ml chicken stock'
    ],
    instructions: [
      'Season chicken pieces generously with salt and pepper. Let rest at room temperature for 15 minutes.',
      'Heat olive oil in a heavy-bottomed casserole over medium-high heat. Brown chicken pieces skin-side down for 4-5 minutes until golden.',
      'Turn chicken and brown other side for 3-4 minutes. Remove to a plate and set aside.',
      'In the same pot, add onions and cook for 5 minutes until softened. Add bell peppers and cook 5 more minutes.',
      'Add mushrooms and garlic, cook for 3 minutes until mushrooms release their liquid.',
      'Pour in white wine, scraping up any browned bits. Let wine reduce by half, about 4 minutes.',
      'Add crushed tomatoes, herbs, and chicken stock. Stir in olives and return chicken to pot.',
      'Bring to a gentle simmer, cover partially, and cook for 35-40 minutes until chicken is tender.',
      'Remove bay leaves, taste for seasoning. Garnish with fresh parsley and serve with crusty bread or polenta.'
    ],
    servings: 4,
    description: 'Traditional Italian hunter-style chicken braised with peppers, mushrooms, and herbs in rich tomato sauce',
    voiceIntro: 'Ciao bello! Today we hunt like the old days - but the only thing we catch is incredible flavor.',
    voiceTips: [
      'Don\'t crowd the chicken when browning - do it in batches if needed',
      'The fond on the bottom of the pot is liquid gold - scrape it all up with the wine',
      'Let the vegetables caramelize properly - this builds the flavor foundation',
      'If the sauce seems thin, simmer uncovered for the last 10 minutes'
    ],
    subsNote: 'No white wine? Use chicken stock. For vegetarian: use 500g mixed mushrooms instead of chicken.',
    voiceEnabled: true,
    cookingTips: [
      'San Marzano tomatoes make a real difference in authentic Italian cooking',
      'The dish tastes even better the next day as flavors meld',
      'Traditional cacciatore was made with whatever vegetables the hunter could forage'
    ],
    difficulty_explanation: 'Simple braising technique, but requires patience for proper browning and layering of flavors'
  },
  {
    id: 'carbonara-1',
    title: 'Pasta Carbonara',
    cookingTime: '30 min',
    cookTimeMin: 30,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    contentType: 'MEAT',
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
    voiceTips: ['Work quickly when adding eggs to prevent scrambling', 'Save some pasta water - it\'s the secret to perfect sauce'],
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
    contentType: 'MEAT',
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
    voiceTips: ['Let each layer cool slightly before adding the next', 'Rest the lasagna for 15 minutes before cutting'],
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
    contentType: 'MEAT',
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
    voiceTips: ['Low and slow is the secret', 'The marrow makes the dish special'],
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
    contentType: 'VEGETARIAN',
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
    voiceTips: ['Don\'t overfill or they\'ll leak', 'Medium heat keeps the cheese creamy'],
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
    contentType: 'MEAT',
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
    voiceTips: ['Let the chicken rest before shredding', 'The sauce should coat each strand'],
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
    contentType: 'MEAT',
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
    voiceTips: ['Warm tortillas make rolling easier', 'Don\'t skip the cheese on top'],
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
    contentType: 'MEAT',
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
    voiceTips: ['Toast the chiles until fragrant', 'Skim the foam for clear broth'],
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
    contentType: 'MEAT',
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
    voiceTips: ['Patience with the chocolate', 'Taste and adjust sweetness gradually'],
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
    contentType: 'MEAT',
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
    voiceTips: ['High heat is essential', 'Add basil at the very end'],
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
    contentType: 'MEAT',
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
    voiceTips: ['Fry the paste until fragrant', 'Add coconut milk gradually'],
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
    contentType: 'FISH',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: [
      '200g dried rice noodles (sen lek, 5mm wide)',
      '300g medium shrimp, peeled and deveined',
      '3 large eggs, lightly beaten',
      '100g fresh bean sprouts',
      '3 tbsp tamarind paste',
      '2 tbsp palm sugar (or brown sugar)',
      '3 tbsp fish sauce',
      '2 tbsp vegetable oil',
      '3 spring onions, cut into 2cm pieces',
      '60g roasted peanuts, roughly chopped',
      '2 lime wedges',
      '1 tsp dried chili flakes (optional)',
      '2 cloves garlic, minced'
    ],
    instructions: [
      'Soak rice noodles in warm water for 20-25 minutes until soft but still firm. Drain and set aside.',
      'Mix tamarind paste, palm sugar, and fish sauce in a small bowl to make the sauce. Taste and adjust - it should be sweet, sour, and salty.',
      'Heat wok over highest heat for 2-3 minutes until smoking. Add 1 tbsp oil and swirl to coat.',
      'Add garlic and stir-fry for 10 seconds until fragrant, then add shrimp. Cook for 1-2 minutes until pink.',
      'Push shrimp to one side, add remaining oil. Pour in beaten eggs and scramble gently for 30 seconds.',
      'Add drained noodles and sauce mixture. Toss everything together for 2-3 minutes until noodles are heated through.',
      'Add bean sprouts and spring onions. Stir-fry for another minute until sprouts are slightly wilted but still crunchy.',
      'Remove from heat. Garnish with chopped peanuts, chili flakes, and serve immediately with lime wedges.'
    ],
    servings: 2,
    description: 'Authentic Thai street-style stir-fried noodles with the perfect balance of sweet, sour, and salty flavors',
    voiceIntro: 'Khun, listen carefully - real Pad Thai is about balance. Sweet, sour, salty dancing together.',
    voiceTips: [
      'The wok must be smoking hot - this is the secret to authentic wok hei flavor',
      'Never oversoak the noodles - they should still have bite when you drain them',
      'Taste the sauce before adding - every tamarind paste is different',
      'Work fast once you start cooking - Pad Thai waits for no one!'
    ],
    subsNote: 'No tamarind? Mix 2 tbsp lime juice + 1 tbsp brown sugar. No palm sugar? Brown sugar works.',
    voiceEnabled: true,
    cookingTips: [
      'Use sen lek noodles (5mm wide) for authentic texture',
      'Fresh tamarind paste gives the best flavor, but concentrate works too',
      'The key is high heat throughout - don\'t turn it down'
    ],
    difficulty_explanation: 'Requires quick timing and high heat technique, but ingredients are simple'
  },
  {
    id: 'khao-soi',
    title: 'Khao Soi',
    cookingTime: '2 hours',
    cookTimeMin: 120,
    difficulty: 'ADVANCED',
    category: 'WEEKEND',
    contentType: 'MEAT',
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
    voiceTips: ['Crispy noodles add texture', 'Garnish right before serving'],
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
    contentType: 'MEAT',
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
    voiceTips: ['Low heat for tender beef', 'Peanuts add richness at the end'],
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
  
  // Handle content-based categories (old system)
  const contentTypeMap: { [key: string]: ContentType } = {
    'Meat': 'MEAT',
    'Fish': 'FISH', 
    'Vegetarian': 'VEGETARIAN',
    'Rice/Pasta': 'VEGETARIAN' // Most rice/pasta recipes are vegetarian
  };
  
  if (contentTypeMap[category]) {
    return recipes.filter(recipe => recipe.contentType === contentTypeMap[category]);
  }
  
  // Handle time-based categories (new system)
  const timeBasedCategories: Category[] = ['QUICK', 'EVERYDAY', 'WEEKEND', 'CELEBRATION'];
  if (timeBasedCategories.includes(category as Category)) {
    return recipes.filter(recipe => recipe.category === category);
  }
  
  // Handle aliases
  if (category === 'Quick') {
    return recipes.filter(recipe => recipe.category === 'QUICK');
  }
  if (category === 'Weekend') {
    return recipes.filter(recipe => recipe.category === 'WEEKEND');
  }
  
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