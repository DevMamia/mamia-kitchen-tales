import { mamas, getMamaById } from './mamas';

export type Difficulty = 'EASY' | 'MEDIUM' | 'ADVANCED';
export type Category = 'QUICK' | 'EVERYDAY' | 'WEEKEND' | 'CELEBRATION';
export type ContentType = 'MEAT' | 'FISH' | 'VEGETARIAN' | 'VEGAN';

export interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  cookTimeMin: number;
  prepTimeMin?: number;
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
  // Production enhancement fields
  equipment?: string[];
  storageInstructions?: string;
  culturalContext?: string;
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
    cookingTime: '40 min',
    cookTimeMin: 40,
    prepTimeMin: 15,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: [
      '1 whole chicken (3-4 lbs/1.5-2kg), cut into 8 pieces, patted dry',
      '1/4 cup (60ml) extra virgin olive oil',
      '1 large yellow onion (8oz/225g), sliced into half-moons',
      '2 bell peppers (1 red, 1 yellow), cut into 1-inch strips',
      '8oz (225g) cremini mushrooms, quartered',
      '4 cloves garlic, minced',
      '1/2 cup (120ml) dry white wine (Pinot Grigio or Sauvignon Blanc)',
      '1 can (28oz/800g) San Marzano crushed tomatoes',
      '2 sprigs fresh rosemary',
      '4 fresh sage leaves',
      '2 bay leaves',
      '1 tsp kosher salt, plus more to taste',
      '1/2 tsp freshly ground black pepper',
      '1/4 cup fresh Italian parsley, chopped for garnish'
    ],
    instructions: [
      'Season chicken pieces generously with salt and pepper, let stand 10 minutes at room temperature',
      'Heat olive oil in a heavy-bottomed Dutch oven or braiser over medium-high heat until shimmering (about 350°F/175°C)',
      'Brown chicken pieces skin-side down first, 4-5 minutes per side until golden. Work in batches if needed. Transfer to a plate.',
      'Reduce heat to medium. Add onions to the same pan with the fond, cook 5-7 minutes until softened and beginning to caramelize',
      'Add bell peppers and mushrooms, cook 5-6 minutes until peppers soften and mushrooms release their moisture',
      'Add minced garlic, cook 30 seconds until fragrant (don\'t let it burn)',
      'Pour in white wine, scraping up any browned bits. Let simmer 2-3 minutes until alcohol evaporates',
      'Add crushed tomatoes, rosemary, sage, and bay leaves. Season with 1 tsp salt and 1/2 tsp pepper',
      'Return chicken to pot, nestling pieces into the sauce. Bring to a gentle simmer',
      'Cover and cook 25-30 minutes until chicken is fork-tender and internal temperature reaches 165°F (74°C)',
      'Remove bay leaves and herb sprigs. Taste and adjust seasoning with salt and pepper',
      'Garnish with fresh parsley and serve immediately with crusty bread or over creamy polenta'
    ],
    servings: 4,
    description: 'Hunter-style chicken braised with bell peppers, mushrooms, and aromatic herbs in a rich tomato sauce',
    equipment: ['Dutch oven or heavy braiser', 'Meat thermometer', 'Wooden spoon'],
    storageInstructions: 'Refrigerate up to 3 days. Reheat gently on stovetop with a splash of broth.',
    culturalContext: 'This rustic dish originated with Italian hunters who cooked whatever they caught with foraged mushrooms and vegetables.',
    voiceIntro: 'Eccolo! Today we hunt for flavor like the old hunters in Tuscany. Every bubble tells a story.',
    voiceTips: [
      'Listen, caro - the chicken must sing when it hits the hot oil. If it doesn\'t sizzle, the pan isn\'t ready!',
      'Don\'t move the chicken too soon - let it get that beautiful golden crust, like my papa\'s weathered hands',
      'When you add the wine, tilt the pan away from you - we want the aroma, not singed eyebrows!',
      'The vegetables should soften slowly, like hearts opening to love. Patience makes everything sweeter',
      'If the sauce gets too thick, add a splash of chicken broth - thin like friendship, rich like family',
      'Taste the sauce with a piece of bread - this is how we judge everything in my kitchen',
      'The herbs should smell like a walk through the hillside after rain. Fresh is everything, tesoro!'
    ],
    subsNote: 'No San Marzano tomatoes? Use the best canned tomatoes you can find. For mushrooms, try porcini if available. Bone-in thighs work wonderfully too.',
    voiceEnabled: true
  },
  {
    id: 'carbonara-1',
    title: 'Pasta Carbonara',
    cookingTime: '20 min',
    cookTimeMin: 20,
    prepTimeMin: 10,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: [
      '400g (14oz) spaghetti or tonnarelli pasta',
      '200g (7oz) guanciale (cured pork jowl), diced into 1/4-inch cubes',
      '4 large free-range egg yolks, room temperature',
      '100g (3.5oz) Pecorino Romano DOP, finely grated plus extra for serving',
      '2 tsp coarsely ground black pepper, plus more for garnish',
      '1 tsp kosher salt for pasta water'
    ],
    instructions: [
      'Bring a large pot of water to rolling boil. Add 1 tsp salt per liter of water - it should taste like mild seawater',
      'Meanwhile, place diced guanciale in a large cold pan. Cook over medium-low heat 8-10 minutes, stirring occasionally, until golden and crispy',
      'In a mixing bowl, whisk egg yolks with grated Pecorino Romano and black pepper until well combined. Set aside at room temperature',
      'Cook spaghetti according to package directions minus 1 minute for al dente texture. Reserve 1 cup hot pasta cooking water before draining',
      'Remove guanciale pan from heat. Immediately add drained hot pasta to the guanciale, tossing vigorously to coat with rendered fat',
      'Working quickly off heat, add egg-cheese mixture while tossing continuously. Gradually add pasta water, 2-3 tablespoons at a time, until sauce becomes silky and coats each strand',
      'Taste and adjust with more Pecorino, pepper, or pasta water as needed. Serve immediately with extra cheese and black pepper'
    ],
    servings: 4,
    description: 'Authentic Roman carbonara with crispy guanciale and silky egg-cheese sauce - no cream, just technique',
    equipment: ['Large pasta pot', 'Heavy-bottomed pan', 'Fine grater', 'Mixing bowl'],
    storageInstructions: 'Best enjoyed immediately. Leftovers don\'t reheat well due to egg-based sauce.',
    culturalContext: 'Born in Roman trattorie, carbonara represents the soul of Italian cooking - few perfect ingredients treated with respect.',
    featured: true,
    voiceIntro: 'Ascolta bene - no cream in my carbonara! Only eggs, cheese, guanciale, and amore. This is Roma on a plate.',
    voiceTips: [
      'Cold pan for guanciale - we want to render the fat slowly, like patience building character',
      'The pasta water is liquid gold - save it before you drain! It binds the sauce like magic',
      'Room temperature eggs won\'t scramble as easily - take them out 30 minutes before cooking',
      'Toss, toss, toss! Motion prevents scrambling and creates the silk we want',
      'If it gets too thick, more pasta water. Too thin? More cheese. Cooking is conversation, tesoro',
      'The pan must be off the heat when you add eggs - we\'re making carbonara, not scrambled eggs!',
      'Serve immediately in warmed bowls - carbonara waits for no one, not even the pope!'
    ],
    subsNote: 'No guanciale? Pancetta works but reduce cooking time. No Pecorino? Parmigiano-Reggiano is acceptable. The black pepper must be freshly ground - this is not optional!',
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
    prepTimeMin: 10,
    difficulty: 'EASY',
    category: 'QUICK',
    contentType: 'VEGETARIAN',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: [
      '4 large flour tortillas (8-10 inch diameter)',
      '2 cups (8oz/225g) Oaxaca cheese, shredded (or Monterey Jack)',
      '2 large poblano peppers, roasted and sliced',
      '1 medium white onion, thinly sliced',
      '2 tablespoons vegetable oil or lard',
      '1/2 teaspoon kosher salt',
      '1/4 cup Mexican crema or sour cream for serving',
      '1 lime, cut into wedges',
      'Fresh salsa verde or pico de gallo for serving'
    ],
    instructions: [
      'Roast poblano peppers directly over gas flame or under broiler until charred all over, about 8-10 minutes total',
      'Place charred peppers in a plastic bag for 10 minutes to steam. Peel away charred skin, remove seeds, and slice into strips',
      'Heat 1 tablespoon oil in a large skillet over medium heat. Sauté sliced onions with salt for 5-6 minutes until softened and lightly golden',
      'Lay tortillas flat. On half of each tortilla, sprinkle cheese, then add poblano strips and sautéed onions',
      'Fold tortillas in half, pressing gently to seal. Cook in the same skillet over medium heat, 2-3 minutes per side until golden and cheese melts',
      'Cut each quesadilla into triangles and serve immediately with crema, lime wedges, and salsa'
    ],
    servings: 4,
    description: 'Crispy flour tortillas filled with melted Oaxaca cheese and smoky roasted poblano peppers',
    equipment: ['Large skillet or comal', 'Gas burner or broiler for roasting', 'Pizza wheel or knife'],
    storageInstructions: 'Best eaten immediately. Can be reheated in a dry skillet for 1-2 minutes per side.',
    culturalContext: 'A beloved Mexican comfort food, quesadillas originated in central Mexico and showcase the magic of good cheese and chiles.',
    voiceIntro: 'Ay, mijo! Quick and delicious - my cheesy abrazo that warms the heart. Fire-roasted poblanos make all the difference.',
    voiceTips: [
      'The peppers must sing when they hit the flame - listen for that crackling, it means the skin is charring perfectly',
      'Don\'t rush the onions, let them caramelize slowly like sweet patience',
      'Fold the tortilla like tucking in a baby - gentle but secure, we don\'t want the cheese escaping',
      'Medium heat, mijo - too hot and the outside burns before the cheese melts',
      'Fresh lime juice brightens everything - squeeze it right before eating, like sunshine on your tongue',
      'The cheese should stretch when you pull apart the quesadilla - that\'s how you know it\'s perfect!'
    ],
    subsNote: 'No poblanos? Use Anaheim or bell peppers, but poblanos give the authentic smoky flavor. Oaxaca cheese is traditional, but Monterey Jack or mozzarella work fine.',
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
    prepTimeMin: 20,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: [
      '3-4 tablespoons Thai green curry paste (nam prik gaeng keow wan)',
      '1 can (400ml/14oz) premium coconut milk, chilled overnight',
      '1 lb (450g) boneless chicken thigh, cut into bite-sized pieces',
      '6-8 small Thai eggplants (makheua phuang), quartered, or 1 large eggplant cubed',
      '3-4 makrut lime leaves, torn into pieces',
      '2-3 Thai bird\'s eye chilies, sliced (optional for extra heat)',
      '2 tablespoons fish sauce (nam pla)',
      '1 tablespoon palm sugar or brown sugar',
      '1 red bell pepper, sliced into strips',
      '1 cup fresh Thai basil leaves (horapa)',
      '2 tablespoons vegetable oil',
      'Steamed jasmine rice for serving'
    ],
    instructions: [
      'Open chilled coconut milk can without shaking. Scoop out 3-4 tablespoons of thick cream from the top',
      'Heat oil in a wok or heavy pan over medium-high heat. Add coconut cream and fry for 2-3 minutes until oil separates',
      'Add green curry paste to the pan. Fry for 3-4 minutes, stirring constantly, until very fragrant and darker in color',
      'Add chicken pieces and stir to coat with curry paste. Cook for 5-6 minutes until chicken changes color',
      'Gradually add remaining coconut milk, stirring to combine. Bring to a gentle simmer',
      'Add eggplant pieces and torn lime leaves. Simmer for 8-10 minutes until eggplant is tender',
      'Season with fish sauce and palm sugar. Add bell pepper strips and simmer 2-3 minutes',
      'Taste and adjust seasoning - it should be rich, aromatic, with balanced sweet, salty, and spicy notes',
      'Remove from heat and stir in fresh Thai basil leaves until wilted',
      'Serve immediately over steamed jasmine rice with extra basil and sliced chilies on the side'
    ],
    servings: 4,
    description: 'Aromatic Thai green curry with tender chicken and vegetables in rich coconut sauce',
    equipment: ['Wok or heavy-bottomed pan', 'Rice cooker or pot for rice', 'Sharp knife'],
    storageInstructions: 'Refrigerate up to 3 days. Reheat gently, adding coconut milk if needed. Flavors improve overnight.',
    culturalContext: 'Green curry represents the heart of Thai cuisine - balancing sweet, salty, sour, and spicy in perfect harmony.',
    featured: true,
    voiceIntro: 'Ah, green curry - like the jungle after monsoon rain. Today we create balance, the soul of Thai cooking.',
    voiceTips: [
      'Listen to the curry paste when it fries - it should bubble and release its perfume like flowers blooming',
      'The coconut cream must be thick on top - this is the secret to proper oil separation',
      'Don\'t rush the paste - let it fry until it darkens and smells like heaven',
      'Add coconut milk slowly, like trust building between friends - gradual and gentle',
      'Thai eggplant should be tender but not mushy - they\'ll continue cooking in the hot curry',
      'Balance is everything - taste and adjust like tuning a beautiful song',
      'Basil goes in last moment - we want the fresh perfume, not cooked leaves'
    ],
    subsNote: 'No Thai eggplant? Use regular eggplant, salted and drained. Bottled curry paste works fine - Mae Pranom or Thai Kitchen brands are good. Sweet basil can substitute for Thai basil.',
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
    voiceTips: ['Taste as you go', 'Don\'t oversoak the noodles'],
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