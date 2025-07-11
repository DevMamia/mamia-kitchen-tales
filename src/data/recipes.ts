import { mamas, getMamaById } from './mamas';

export type Difficulty = 'EASY' | 'MEDIUM' | 'ADVANCED';
export type Category = 'QUICK' | 'EVERYDAY' | 'WEEKEND' | 'CELEBRATION';
export type ContentType = 'MEAT' | 'FISH' | 'VEGETARIAN' | 'VEGAN';

export interface StepTimer {
  display: string;
  duration: number; // in seconds
  autoStart?: boolean;
  description?: string;
}

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
  // Timer integration
  stepTimers?: (StepTimer | null)[];
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
    voiceEnabled: true,
    stepTimers: [
      null, // Heat olive oil - no timer needed
      { display: '2 min', duration: 120, description: 'Until garlic is fragrant, not brown' }, // Cook garlic and chillies
      null, // Add tomatoes - no timer needed  
      { display: '8 min', duration: 480, description: 'Let sauce develop while pasta cooks' }, // Simmer sauce
      { display: '7 min', duration: 420, description: 'Cook pasta 1 minute less than package directions for al dente' }, // Cook pasta
      null, // Toss pasta - no timer needed
      null  // Garnish - no timer needed
    ]
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
      'Season chicken pieces generously with salt and pepper, let stand at room temperature',
      'Heat olive oil in a heavy-bottomed Dutch oven over medium-high heat until shimmering',
      'Brown chicken pieces skin-side down first until golden. Work in batches if needed. Transfer to a plate.',
      'Reduce heat to medium. Add onions to the same pan, cook until softened and beginning to caramelize',
      'Add bell peppers and mushrooms, cook until peppers soften and mushrooms release their moisture',
      'Add minced garlic, cook until fragrant',
      'Pour in white wine, scraping up any browned bits. Let simmer until alcohol evaporates',
      'Add crushed tomatoes, rosemary, sage, and bay leaves. Season with salt and pepper',
      'Return chicken to pot, nestling pieces into the sauce. Bring to a gentle simmer',
      'Cover and cook until chicken is fork-tender and internal temperature reaches 165°F',
      'Remove bay leaves and herb sprigs. Taste and adjust seasoning',
      'Garnish with fresh parsley and serve immediately with crusty bread or over creamy polenta'
    ],
    servings: 4,
    description: 'Hunter-style chicken braised with bell peppers, mushrooms, and aromatic herbs in a rich tomato sauce',
    equipment: ['Dutch oven or heavy braiser', 'Meat thermometer', 'Wooden spoon'],
    storageInstructions: 'Refrigerate up to 3 days. Reheat gently on stovetop with a splash of broth.',
    culturalContext: 'This rustic dish originated with Italian hunters who cooked whatever they caught with foraged mushrooms and vegetables.',
    voiceIntro: 'Eccolo! Today we hunt for flavor like the old hunters in Tuscany. Every bubble tells a story.',
    voiceTips: [
      'Hunters used to cook whatever they caught with foraged mushrooms and vegetables from the forest',
      'The key to cacciatore is patience - let each ingredient build flavor slowly, like a good story'
    ],
    subsNote: 'No San Marzano tomatoes? Use the best canned tomatoes you can find. For mushrooms, try porcini if available. Bone-in thighs work wonderfully too.',
    voiceEnabled: true,
    stepTimers: [
      null, // Season chicken - no timer
      null, // Heat oil - no timer
      { display: '~6 min', duration: 360, autoStart: true, description: 'Golden brown chicken' }, // Brown chicken
      { display: '~5 min', duration: 300, autoStart: true, description: 'Soft onions' }, // Cook onions
      { display: '~8 min', duration: 480, autoStart: true, description: 'Tender peppers' }, // Cook peppers & mushrooms
      { display: '~1 min', duration: 60, autoStart: true, description: 'Fragrant garlic' }, // Cook garlic
      { display: '~3 min', duration: 180, autoStart: true, description: 'Alcohol evaporates' }, // Simmer wine
      null, // Add tomatoes and herbs - no timer
      null, // Return chicken - no timer
      { display: '~20 min', duration: 1200, autoStart: true, description: 'Fork-tender chicken' }, // Braise chicken
      null, // Remove herbs - no timer
      null, // Garnish and serve - no timer
    ]
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
      'Bring a large pot of water to rolling boil. Add salt - it should taste like mild seawater',
      'Meanwhile, place diced guanciale in a large cold pan. Cook over medium-low heat, stirring occasionally, until golden and crispy',
      'In a mixing bowl, whisk egg yolks with grated Pecorino Romano and black pepper until well combined',
      'Cook spaghetti according to package directions minus 1 minute for al dente texture. Reserve hot pasta cooking water before draining',
      'Remove guanciale pan from heat. Add drained hot pasta to the guanciale, tossing vigorously to coat with rendered fat',
      'Working quickly off heat, add egg-cheese mixture while tossing continuously. Gradually add pasta water until sauce becomes silky',
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
      'True Roman carbonara never has cream - it was invented by charcoal workers using simple ingredients',
      'The secret is pasta water - it transforms eggs and cheese into silk without scrambling'
    ],
    subsNote: 'No guanciale? Pancetta works but reduce cooking time. No Pecorino? Parmigiano-Reggiano is acceptable. The black pepper must be freshly ground - this is not optional!',
    voiceEnabled: true,
    stepTimers: [
      null, // Bring water to boil - no timer needed
      { display: '8-10 min', duration: 540, description: 'Golden and crispy guanciale' }, // Cook guanciale
      null, // Mix eggs and cheese - no timer needed
      { display: '9-11 min', duration: 600, description: 'Al dente pasta (check package directions minus 1 min)' }, // Cook pasta
      null, // Remove from heat - no timer needed
      null, // Add egg mixture - no timer needed
      null  // Serve immediately - no timer needed
    ]
  },
  {
    id: 'lasagna-nonna',
    title: 'Lasagna alla Nonna',
    cookingTime: '2 hours',
    cookTimeMin: 120,
    prepTimeMin: 45,
    difficulty: 'ADVANCED',
    category: 'WEEKEND',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: [
      'FOR BOLOGNESE RAGÙ:',
      '2 lbs (900g) mixed ground meat (beef chuck and pork shoulder, 70/30 ratio)',
      '4oz (115g) pancetta, finely diced',
      '1 large carrot, finely diced (brunoise)',
      '1 large celery stalk, finely diced',
      '1 large yellow onion, finely diced',
      '3 cloves garlic, minced',
      '1 cup (240ml) whole milk',
      '1 cup (240ml) dry white wine',
      '1 can (28oz) San Marzano tomatoes, crushed by hand',
      '2 tablespoons tomato paste',
      '2 bay leaves',
      'FOR BÉCHAMEL:',
      '1/2 cup (115g) unsalted butter',
      '1/2 cup (60g) all-purpose flour',
      '4 cups (950ml) whole milk, warmed',
      '1/4 teaspoon freshly grated nutmeg',
      'FOR ASSEMBLY:',
      '1 lb (450g) fresh lasagna sheets or no-boil dried pasta',
      '1 lb (450g) whole milk mozzarella, coarsely grated',
      '1 cup (100g) Parmigiano-Reggiano DOP, finely grated',
      '2 tablespoons extra virgin olive oil',
      'Kosher salt and black pepper to taste'
    ],
    instructions: [
      'Begin ragù: Heat olive oil in heavy Dutch oven over medium heat. Add pancetta and cook until golden and crispy, about 6-8 minutes',
      'Add diced vegetables (soffritto) to pancetta. Cook slowly until very soft and caramelized, about 15 minutes. This is the foundation of flavor',
      'Add garlic, cook 1 minute until fragrant. Push vegetables to one side, increase heat to medium-high',
      'Add ground meat in batches, breaking apart with wooden spoon. Cook until deeply browned, about 12-15 minutes total',
      'Pour in white wine, scraping up any browned bits. Let alcohol cook off completely, about 5 minutes',
      'Add tomato paste, cook 2 minutes until darkened. Add crushed tomatoes, milk, and bay leaves',
      'Bring to gentle simmer, then reduce heat to lowest setting. Cover partially and simmer 3-4 hours, stirring occasionally. Ragù should be thick and rich',
      'For béchamel: In heavy saucepan, melt butter over medium heat. Whisk in flour, cook 3 minutes to eliminate raw flour taste',
      'Gradually whisk in warm milk, whisking constantly to prevent lumps. Cook until thick enough to coat spoon, about 10-12 minutes',
      'Season béchamel with salt, pepper, and nutmeg. Cover with plastic wrap directly on surface to prevent skin forming',
      'If using fresh pasta, blanch sheets in salted boiling water for 30 seconds. If using dried no-boil, soak in warm water 10 minutes',
      'Preheat oven to 375°F (190°C). Butter a 9x13-inch baking dish generously',
      'Assembly: Spread thin layer of béchamel in dish bottom. Layer pasta, then ragù, then béchamel, then cheeses. Repeat 3-4 times',
      'Top layer should be béchamel and cheese only. Cover tightly with foil and bake 45 minutes',
      'Remove foil, increase temperature to 425°F (220°C). Bake 15-20 minutes until golden and bubbling',
      'Rest lasagna 20-30 minutes before cutting. This allows layers to set and makes clean slices possible'
    ],
    servings: 8,
    description: 'Sunday masterpiece - layers of slow-cooked ragù, silky béchamel, and melted cheese between tender pasta sheets',
    equipment: ['Dutch oven or heavy pot', 'Heavy saucepan for béchamel', '9x13-inch baking dish', 'Wire whisk'],
    storageInstructions: 'Refrigerate up to 4 days or freeze up to 3 months. Reheat covered at 350°F until heated through.',
    culturalContext: 'Born in Emilia-Romagna, lasagna represents the pinnacle of Italian comfort food - a dish worth spending all Sunday creating.',
    voiceIntro: 'Ascolta bene - clear your Sunday, call your famiglia. Today we build layers of love, one by one, like our ancestors did.',
    voiceTips: [
      'The soffritto is everything - let those vegetables melt into pure sweetness, this is where the magic begins',
      'Never rush the ragù - it needs time to develop its soul, like a good marriage',
      'The milk in ragù makes it tender - this is the Bolognese secret my nonna whispered to me',
      'Béchamel must be smooth as silk - whisk with passion, no lumps allowed in my kitchen',
      'Each layer tells a story - pasta, ragù, béchamel, cheese - like chapters in a beautiful book',
      'The resting time is not optional - patience gives us perfect slices, not a collapsed mess',
      'Fresh pasta is traditional, but good dried pasta shows respect for the sauce too'
    ],
    subsNote: 'Fresh pasta sheets are traditional, but quality no-boil works fine. For ragù, ground lamb can substitute 25% of the meat. Make ragù day before - it tastes even better.',
    voiceEnabled: true,
    stepTimers: [
      { display: '6-8 min', duration: 420, description: 'Golden crispy pancetta' }, // Cook pancetta
      { display: '~15 min', duration: 900, description: 'Soft caramelized vegetables' }, // Cook soffritto
      null, // Add garlic - no timer
      { display: '12-15 min', duration: 810, description: 'Deeply browned meat' }, // Brown meat
      { display: '~5 min', duration: 300, description: 'Alcohol evaporated' }, // Cook wine
      null, // Add tomato paste - no timer
      { display: '3-4 hours', duration: 12600, description: 'Rich, thick ragù' }, // Simmer ragù
      { display: '~3 min', duration: 180, description: 'Cook flour roux' }, // Make béchamel roux
      { display: '10-12 min', duration: 660, description: 'Thick coating consistency' }, // Finish béchamel
      null, // Season béchamel - no timer
      null, // Prepare pasta - no timer
      null, // Butter dish - no timer
      null, // Assembly - no timer
      { display: '45 min', duration: 2700, description: 'Covered baking' }, // Bake covered
      { display: '15-20 min', duration: 1050, description: 'Golden bubbling top' }, // Bake uncovered
      { display: '20-30 min', duration: 1500, description: 'Layers set for clean cutting' } // Rest
    ]
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
    prepTimeMin: 15,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: [
      '2 lbs (900g) bone-in chicken thighs, skin removed',
      '1 large white onion, divided (half for poaching, half sliced)',
      '3 cloves garlic, divided',
      '1 bay leaf',
      '1 teaspoon kosher salt, plus more to taste',
      'FOR CHIPOTLE SAUCE:',
      '3-4 chipotle chiles in adobo sauce, plus 2 tablespoons adobo sauce',
      '4 large Roma tomatoes (about 2 lbs), cored',
      '1/4 white onion (from above)',
      '2 cloves garlic (from above)',
      '1 teaspoon dried Mexican oregano',
      '1/2 teaspoon ground cumin',
      '1/4 teaspoon black pepper',
      'FOR SERVING:',
      '18-24 small corn tortillas, warmed',
      '1 large white onion, finely diced',
      '1 cup fresh cilantro, chopped',
      'Mexican crema or sour cream',
      'Lime wedges',
      'Queso fresco, crumbled',
      'Salsa verde (optional)'
    ],
    instructions: [
      'Place chicken thighs in large pot with half the onion, 1 garlic clove, bay leaf, and salt. Cover with water by 2 inches',
      'Bring to boil, then reduce heat to gentle simmer. Cook 25-30 minutes until chicken is very tender and easily shredded',
      'Remove chicken and let cool. Reserve 1 cup of the flavorful poaching liquid. Shred chicken into bite-sized pieces, discarding bones',
      'Meanwhile, char tomatoes directly over gas flame or under broiler until blackened and blistered all over',
      'Place charred tomatoes, chipotles, adobo sauce, remaining onion quarter, and 2 garlic cloves in blender',
      'Add oregano, cumin, black pepper, and 1/2 cup reserved poaching liquid. Blend until smooth',
      'Heat 2 tablespoons oil in large skillet over medium-high heat. Add blended sauce (it will splatter - be careful!)',
      'Cook sauce, stirring frequently, for 10-12 minutes until thickened and darkened in color',
      'Add shredded chicken to sauce, tossing to coat completely. Add more poaching liquid if needed for proper consistency',
      'Simmer 5 minutes to meld flavors. Taste and adjust salt. The tinga should be moist but not soupy',
      'Warm tortillas on comal or dry skillet until pliable and slightly charred',
      'Serve tinga in warm tortillas with diced onion, cilantro, crema, lime wedges, and queso fresco'
    ],
    servings: 6,
    description: 'Smoky Pueblan classic - tender shredded chicken bathed in rich chipotle-tomato sauce, perfect for tacos',
    equipment: ['Large pot for poaching', 'Blender', 'Large skillet', 'Comal or heavy skillet'],
    storageInstructions: 'Refrigerate up to 4 days or freeze up to 3 months. Reheat gently, adding poaching liquid if dry.',
    culturalContext: 'Born in Puebla, tinga showcases the Mexican mastery of chiles - transforming humble chicken into smoky perfection.',
    voiceIntro: 'Ay, mijo! Today we make tinga like my abuela in Puebla - fire-kissed tomatoes and smoky chipotles dancing together.',
    voiceTips: [
      'The chicken must be so tender it falls apart at your touch - this is the foundation of good tinga',
      'Char those tomatoes until they\'re blackened like coal - this gives the sauce its deep, complex flavor',
      'Listen when the sauce hits the hot pan - it should sizzle and pop like tiny fireworks',
      'Save that poaching liquid, it\'s liquid gold - full of chicken flavor to thin your sauce',
      'The sauce should coat the chicken like a beautiful rebozo - not too wet, not too dry',
      'Warm those tortillas until they puff like little pillows - cold tortillas are sad tortillas',
      'Don\'t forget the lime, mijo - it brightens everything like sunshine after rain'
    ],
    subsNote: 'Rotisserie chicken works in a pinch - use 3 cups shredded meat and chicken broth instead of poaching liquid. Chipotle chiles in adobo are essential - find them in the international aisle.',
    voiceEnabled: true,
    stepTimers: [
      null, // Place chicken in pot - no timer
      { display: '25-30 min', duration: 1650, description: 'Tender easily shredded chicken' }, // Poach chicken
      null, // Remove and shred - no timer
      { display: '~8 min', duration: 480, description: 'Blackened and blistered all over' }, // Char tomatoes
      null, // Blend sauce ingredients - no timer
      null, // Heat oil - no timer
      { display: '10-12 min', duration: 660, description: 'Thickened and darkened sauce' }, // Cook sauce
      null, // Add chicken - no timer
      { display: '5 min', duration: 300, description: 'Flavors melded' }, // Simmer together
      null, // Warm tortillas - no timer
      null // Serve - no timer
    ]
  },
  {
    id: 'enchiladas-verdes',
    title: 'Enchiladas Verdes',
    cookingTime: '40 min',
    cookTimeMin: 40,
    prepTimeMin: 20,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: [
      'FOR SALSA VERDE:',
      '2 lbs (900g) fresh tomatillos, husks removed',
      '2-3 serrano chiles (adjust for heat preference)',
      '1/2 large white onion, quartered',
      '4 cloves garlic, unpeeled',
      '1/2 cup fresh cilantro stems and leaves',
      '1 teaspoon kosher salt, plus more to taste',
      'FOR ENCHILADAS:',
      '12 corn tortillas (6-inch, preferably day-old)',
      '3 cups cooked chicken, shredded (rotisserie works)',
      '1 cup vegetable oil for frying tortillas',
      '2 cups (8oz) Monterey Jack cheese, shredded',
      '1 cup (4oz) queso fresco, crumbled',
      '1/2 cup Mexican crema or sour cream',
      '1/4 cup white onion, finely diced',
      '1/4 cup fresh cilantro, chopped',
      'Lime wedges for serving'
    ],
    instructions: [
      'Preheat broiler. Place tomatillos, serranos, onion quarters, and unpeeled garlic on sheet pan',
      'Broil 5-8 minutes until tomatillos are charred and softened, turning vegetables once halfway through',
      'Remove charred skin from garlic. Place all roasted vegetables in blender with cilantro and salt',
      'Blend until smooth but still slightly chunky. Taste and adjust salt - should be bright and tangy',
      'Pour salsa into large saucepan, bring to simmer over medium heat. Cook 10 minutes to concentrate flavors',
      'Meanwhile, heat oil in small skillet over medium heat. Quickly fry each tortilla 30 seconds per side until pliable',
      'Drain tortillas on paper towels. This step is crucial - it prevents tortillas from dissolving in sauce',
      'Preheat oven to 350°F (175°C). Pour thin layer of salsa verde in bottom of 9x13-inch baking dish',
      'Working one at a time, dip each fried tortilla in warm salsa, fill with chicken and small amount of Monterey Jack',
      'Roll tightly and place seam-side down in baking dish. Repeat with remaining tortillas',
      'Pour remaining salsa over enchiladas, sprinkle with remaining Monterey Jack cheese',
      'Bake 20-25 minutes until cheese melts and sauce is bubbling around edges',
      'Remove from oven, immediately sprinkle with queso fresco, drizzle with crema, and garnish with diced onion and cilantro'
    ],
    servings: 6,
    description: 'Traditional Mexican comfort - corn tortillas filled with tender chicken, bathed in bright tomatillo salsa and melted cheese',
    equipment: ['Sheet pan for roasting', 'Blender', 'Large saucepan', 'Small skillet for frying', '9x13-inch baking dish'],
    storageInstructions: 'Best eaten immediately. Leftovers keep 2 days refrigerated - reheat covered in 350°F oven.',
    culturalContext: 'Enchiladas verdes represent the soul of Mexican home cooking - simple ingredients transformed into comfort through tradition.',
    voiceIntro: 'Mira, mi amor! Today we make enchiladas like the old country - tomatillos kissed by fire, corn tortillas blessed with oil.',
    voiceTips: [
      'The tomatillos must char until they blister - this gives the salsa its deep, smoky flavor',
      'Never skip frying the tortillas - this ancient technique keeps them from falling apart',
      'Day-old tortillas are perfect - too fresh and they\'ll tear, too old and they\'ll crumble',
      'The salsa should taste bright and alive - add more salt if it tastes flat',
      'Roll them tight like precious bundles - loose enchiladas fall apart in the oven',
      'Fresh crema at the end is like dewdrops on morning flowers - it cools and completes',
      'Serve immediately while the cheese still bubbles - enchiladas wait for no one'
    ],
    subsNote: 'No fresh tomatillos? Use 2 cans (28oz each) whole tomatillos, drained. For quicker prep, use rotisserie chicken. Serrano heat varies - start with 1 chile and add more to taste.',
    voiceEnabled: true,
    stepTimers: [
      null, // Preheat broiler - no timer
      { display: '5-8 min', duration: 390, description: 'Charred and softened vegetables' }, // Broil vegetables
      null, // Blend salsa - no timer
      { display: '10 min', duration: 600, description: 'Concentrated flavors' }, // Simmer salsa
      { display: '~8 min', duration: 480, description: 'Pliable fried tortillas' }, // Fry tortillas
      null, // Prep baking dish - no timer
      null, // Fill and roll enchiladas - no timer
      null, // Top with sauce and cheese - no timer
      { display: '20-25 min', duration: 1350, description: 'Melted cheese and bubbling sauce' }, // Bake
      null // Garnish and serve - no timer
    ]
  },
  {
    id: 'pozole-rojo',
    title: 'Pozole Rojo',
    cookingTime: '2 hours',
    cookTimeMin: 120,
    prepTimeMin: 30,
    difficulty: 'ADVANCED',
    category: 'WEEKEND',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: [
      'FOR THE BROTH:',
      '3 lbs (1.4kg) pork shoulder, cut into 2-inch chunks',
      '1 lb (450g) pork ribs (for extra flavor)',
      '1 large white onion, quartered',
      '6 cloves garlic, smashed',
      '2 bay leaves',
      '1 tablespoon kosher salt, plus more to taste',
      'FOR THE CHILE SAUCE:',
      '6 guajillo chiles, stemmed and seeded',
      '4 ancho chiles, stemmed and seeded',
      '2 chipotle chiles (optional, for smokiness)',
      '3 Roma tomatoes',
      '1/2 white onion',
      '4 cloves garlic',
      '1 teaspoon dried Mexican oregano',
      '1/2 teaspoon ground cumin',
      '1/4 teaspoon black pepper',
      'FOR ASSEMBLY:',
      '2 cans (30oz each) white hominy, drained and rinsed',
      'FOR GARNISHES:',
      'Shredded iceberg lettuce',
      'Sliced radishes',
      'Diced white onion',
      'Fresh cilantro, chopped',
      'Dried oregano for sprinkling',
      'Lime wedges',
      'Chile piquín or cayenne pepper',
      'Crispy pork chicharrón, crushed',
      'Tostadas or warm corn tortillas'
    ],
    instructions: [
      'Place pork shoulder and ribs in large stockpot with quartered onion, smashed garlic, bay leaves, and salt',
      'Cover with water by 3 inches, bring to boil. Reduce heat and simmer gently 1.5-2 hours until pork is fork-tender',
      'Remove meat and strain broth, discarding solids. Let meat cool, then shred into bite-sized pieces. Reserve 6-8 cups broth',
      'Meanwhile, heat dry skillet over medium heat. Toast guajillo and ancho chiles until fragrant and pliable, about 2 minutes per side',
      'Place toasted chiles in bowl, cover with hot water. Soak 20 minutes until softened',
      'Char tomatoes, onion half, and garlic cloves directly over gas flame or under broiler until blackened',
      'Drain chiles and place in blender with charred vegetables, oregano, cumin, and pepper',
      'Add 1 cup of the reserved pork broth and blend until completely smooth. Strain through fine-mesh sieve',
      'In the same stockpot, heat strained chile sauce over medium heat. Cook 15-20 minutes, stirring frequently, until thickened',
      'Add reserved pork broth and shredded meat. Bring to simmer and cook 30 minutes for flavors to meld',
      'Add hominy and simmer 15 more minutes. Taste and adjust salt - pozole should be rich and well-seasoned',
      'Serve hot in large bowls with garnishes arranged on platters for everyone to customize their bowl'
    ],
    servings: 8,
    description: 'Sacred Mexican celebration soup - tender pork and plump hominy in rich red chile broth, crowned with fresh garnishes',
    equipment: ['Large stockpot (8+ quarts)', 'Dry skillet for toasting', 'Blender', 'Fine-mesh strainer'],
    storageInstructions: 'Refrigerate up to 4 days or freeze up to 3 months. Store garnishes separately. Pozole tastes better the next day.',
    culturalContext: 'Ancient Aztec ceremonial dish, pozole connects us to pre-Hispanic Mexico - each kernel of hominy represents abundance and gratitude.',
    voiceIntro: 'Ay, mijo! Today we make pozole like the ancients - sacred corn, noble pork, and chiles that sing. This is Mexico in a bowl.',
    voiceTips: [
      'Listen for the hominy to pop and bloom - this tells you it\'s perfectly heated through',
      'Toast those chiles until they smell like heaven - but don\'t burn them or they\'ll taste bitter',
      'The broth should be rich enough to coat a spoon - this comes from the bones and long simmering',
      'Char those vegetables until they\'re blackened - this gives the sauce its deep, complex flavor',
      'Strain that chile sauce smooth as silk - no one wants chunks in their pozole',
      'Everyone builds their own bowl - this is part of the ceremony, the sharing, the love',
      'Save some broth for leftovers - pozole is even better the next day when flavors marry'
    ],
    subsNote: 'For quicker version, use rotisserie chicken and chicken broth - simmer 30 minutes total. Dried hominy is traditional but canned saves hours. Freeze leftover chile sauce for future batches.',
    voiceEnabled: true,
    stepTimers: [
      null, // Place meat in pot - no timer
      { display: '1.5-2 hours', duration: 6300, description: 'Fork-tender pork' }, // Simmer meat
      null, // Remove and shred meat - no timer
      { display: '~4 min', duration: 240, description: 'Fragrant and pliable chiles' }, // Toast chiles
      { display: '20 min', duration: 1200, description: 'Softened chiles' }, // Soak chiles
      { display: '~8 min', duration: 480, description: 'Blackened vegetables' }, // Char vegetables
      null, // Blend chile sauce - no timer
      { display: '15-20 min', duration: 1050, description: 'Thickened chile sauce' }, // Cook sauce
      { display: '30 min', duration: 1800, description: 'Flavors melded' }, // Simmer with broth
      { display: '15 min', duration: 900, description: 'Heated hominy' }, // Add hominy
      null // Serve with garnishes - no timer
    ]
  },
  {
    id: 'mole-poblano',
    title: 'Mole Poblano',
    cookingTime: '3 hours',
    cookTimeMin: 180,
    prepTimeMin: 45,
    difficulty: 'ADVANCED',
    category: 'CELEBRATION',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: [
      'FOR THE CHILES:',
      '6 mulato chiles, stemmed and seeded',
      '4 ancho chiles, stemmed and seeded',
      '4 pasilla chiles, stemmed and seeded',
      '2 chipotle chiles, stemmed and seeded',
      'FOR AROMATICS:',
      '3 Roma tomatoes',
      '1/4 white onion',
      '6 cloves garlic, unpeeled',
      '1 corn tortilla, torn into pieces',
      '2 slices day-old bread, crusts removed',
      'FOR NUTS AND SEEDS:',
      '1/4 cup almonds, blanched',
      '1/4 cup raisins',
      '2 tablespoons sesame seeds',
      '2 tablespoons pumpkin seeds (pepitas)',
      'FOR SPICES:',
      '1/4 teaspoon anise seeds',
      '1/4 teaspoon black peppercorns',
      '3 whole cloves',
      '1/2 cinnamon stick (Mexican canela)',
      '1/2 teaspoon dried Mexican oregano',
      'FOR THE MOLE:',
      '2 tablets (3oz each) Mexican chocolate, chopped',
      '2 tablespoons lard or vegetable oil',
      '2 teaspoons kosher salt, plus more to taste',
      '1 tablespoon brown sugar (adjust to taste)',
      '4-6 cups warm chicken broth',
      'FOR SERVING:',
      '1 whole chicken (4 lbs), cut into pieces, or 8 chicken thighs',
      'Warm corn tortillas',
      'Mexican rice',
      'Sesame seeds for garnish'
    ],
    instructions: [
      'Toast chiles in dry skillet over medium heat until fragrant and pliable, about 2 minutes per side. Don\'t burn!',
      'Place toasted chiles in large bowl, cover with hot water. Soak 30 minutes until completely softened',
      'Meanwhile, char tomatoes, onion, and unpeeled garlic over gas flame or under broiler until blackened all over',
      'In same dry skillet, toast tortilla pieces and bread until golden. Set aside to cool',
      'Toast almonds, sesame seeds, and pumpkin seeds until fragrant. Toast spices separately until aromatic',
      'Drain chiles, reserving soaking liquid. Working in batches, blend chiles with 1-2 cups soaking liquid until smooth',
      'Strain chile mixture through fine-mesh sieve, pressing solids. This is your chile base',
      'Peel charred garlic. Blend tomatoes, onion, garlic, toasted bread, tortilla, nuts, seeds, raisins, and spices with 1 cup broth',
      'Strain this mixture as well. You now have two bases that will become mole',
      'Heat lard in large heavy pot over medium heat. Fry chile base 20 minutes, stirring constantly to prevent burning',
      'Add the aromatics mixture and fry 15 more minutes, stirring frequently. Mixture should be thick and dark',
      'Add chopped chocolate, salt, and sugar. Stir until chocolate melts completely',
      'Gradually add warm broth, whisking constantly, until mole reaches coating consistency - like heavy cream',
      'Simmer 30-45 minutes, stirring occasionally. Taste and adjust salt, sugar, and chocolate',
      'Meanwhile, season chicken and poach in salted water until cooked through, about 25 minutes',
      'Add cooked chicken to mole and simmer 10 minutes. Mole should coat chicken pieces beautifully',
      'Serve immediately with warm tortillas, rice, and sesame seeds. Mole improves with age - make day ahead if possible'
    ],
    servings: 8,
    description: 'Mexico\'s national treasure - complex symphony of chiles, chocolate, and spices requiring patience, love, and 30+ ingredients',
    equipment: ['Large heavy pot or Dutch oven', 'Dry skillet for toasting', 'Blender', 'Fine-mesh strainer', 'Whisk'],
    storageInstructions: 'Refrigerate up to 1 week or freeze up to 6 months. Mole actually improves after a day. Thin with broth when reheating.',
    culturalContext: 'Born in Puebla convents, mole poblano represents the fusion of indigenous and Spanish ingredients - Mexico\'s culinary soul on a plate.',
    voiceIntro: 'Ay, Dios mío! Today we make mole - the soul of Mexico, thirty ingredients singing together. Clear your day, call your familia, this is sacred work.',
    voiceTips: [
      'Every chile must sing when it hits the hot pan - listen for that gentle sizzle, not harsh burning',
      'The soaking water is precious - it holds the chile\'s essence, use it in your blending',
      'Char those vegetables until they\'re black as midnight - this gives mole its deep, mysterious flavor',
      'Toast everything separately - each ingredient needs its own time to release perfume',
      'When you fry the bases, stir constantly like stirring love into the pot - mole burns easily',
      'The chocolate is the bridge between earth and heaven - it marries all the flavors',
      'Patience, mi amor - mole cannot be rushed, only coaxed into perfection',
      'Taste and adjust like tuning a mariachi band - every note must be in harmony'
    ],
    subsNote: 'For beginners, start with quality mole paste (Doña María or Masienda) - add chocolate, nuts, and broth to customize. This recipe makes extra sauce - freeze portions for future meals.',
    voiceEnabled: true,
    stepTimers: [
      { display: '~8 min', duration: 480, description: 'Fragrant pliable chiles' }, // Toast chiles
      { display: '30 min', duration: 1800, description: 'Completely softened chiles' }, // Soak chiles
      { display: '~10 min', duration: 600, description: 'Blackened vegetables' }, // Char vegetables
      { display: '~5 min', duration: 300, description: 'Golden toasted bread' }, // Toast bread/tortilla
      { display: '~6 min', duration: 360, description: 'Fragrant nuts, seeds, and spices' }, // Toast nuts/seeds
      null, // Blend chile base - no timer
      null, // Strain chile base - no timer
      null, // Blend aromatics mixture - no timer
      null, // Strain aromatics - no timer
      { display: '20 min', duration: 1200, description: 'Deep red bubbling chile base' }, // Fry chile base
      { display: '15 min', duration: 900, description: 'Thick dark aromatic mixture' }, // Fry aromatics
      null, // Add chocolate - no timer
      null, // Add broth gradually - no timer
      { display: '30-45 min', duration: 2250, description: 'Rich coating consistency' }, // Simmer mole
      { display: '25 min', duration: 1500, description: 'Cooked through chicken' }, // Poach chicken
      { display: '10 min', duration: 600, description: 'Chicken coated with mole' }, // Finish with chicken
      null // Serve - no timer
    ]
  },

  // Mae Malai's Recipes
  {
    id: 'pad-krapao',
    title: 'Pad Krapao Gai',
    cookingTime: '15 min',
    cookTimeMin: 15,
    prepTimeMin: 10,
    difficulty: 'EASY',
    category: 'QUICK',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: [
      '1 lb (450g) ground chicken or pork, coarsely ground',
      '4-6 cloves garlic, minced',
      '3-5 Thai bird\'s eye chilies, sliced (adjust for heat)',
      '2 tablespoons vegetable oil',
      '2 tablespoons fish sauce (nam pla)',
      '1 tablespoon oyster sauce',
      '1 tablespoon light soy sauce',
      '1 teaspoon dark soy sauce (for color)',
      '1 teaspoon brown sugar',
      '2 large handfuls fresh Thai holy basil leaves (bai krapao)',
      'FOR SERVING:',
      '2 cups steamed jasmine rice',
      '2 eggs for frying (optional but traditional)',
      'Cucumber slices',
      'Lime wedges',
      'Additional chilies for garnish'
    ],
    instructions: [
      'Heat wok or large skillet over highest heat until smoking hot - this is crucial for authentic wok hei flavor',
      'Add oil and immediately add minced garlic and sliced chilies. Stir-fry for 10-15 seconds until fragrant',
      'Add ground chicken, breaking it apart with spatula. Stir-fry vigorously for 3-4 minutes until chicken changes color',
      'Create well in center of wok. Add fish sauce, oyster sauce, both soy sauces, and brown sugar to the well',
      'Quickly stir sauces together in the well, then toss everything to combine. Cook 2-3 more minutes until chicken is cooked through',
      'Remove wok from heat. Immediately add Thai holy basil leaves and toss just until wilted - about 30 seconds',
      'Meanwhile, if making fried eggs, fry in separate pan until edges are crispy and yolks still runny',
      'Serve immediately over steamed rice topped with fried egg. Garnish with cucumber slices and lime wedges'
    ],
    servings: 2,
    description: 'Thailand\'s beloved street food - ground chicken stir-fried with holy basil, chilies, and aromatic sauces over rice',
    equipment: ['Wok or large skillet', 'Separate pan for eggs', 'Rice cooker or pot'],
    storageInstructions: 'Best eaten immediately while hot. Leftovers keep 2 days refrigerated - reheat in hot wok with splash of water.',
    culturalContext: 'Thailand\'s most popular one-plate meal, pad krapao represents the perfect balance of flavors that defines Thai cuisine.',
    voiceIntro: 'Sawadee ka! Today we cook with fire and holy basil - the flavor that makes every Thai person homesick. Fast cooking, big flavor!',
    voiceTips: [
      'Your wok must be smoking hot - this gives the dish its essential wok hei, the breath of the wok',
      'Holy basil is not sweet basil - it has a spicy, almost clove-like flavor that makes this dish special',
      'Don\'t overcook the basil - it should just wilt and release its perfume',
      'The chicken should have some caramelization - high heat creates those delicious crispy bits',
      'Taste your sauces before adding - balance sweet, salty, and umami like a symphony',
      'The fried egg is traditional - crispy edges, runny yolk mixing with rice is heaven',
      'Eat immediately while the basil is still bright - pad krapao waits for no one'
    ],
    subsNote: 'Holy basil (bai krapao) is essential but hard to find - substitute with Thai sweet basil plus a pinch of mint and black pepper. Ground pork is equally traditional.',
    voiceEnabled: true,
    stepTimers: [
      null, // Heat wok - no timer needed
      { display: '10-15 sec', duration: 13, description: 'Fragrant garlic and chilies' }, // Aromatics
      { display: '3-4 min', duration: 210, description: 'Chicken changes color' }, // Cook chicken
      null, // Add sauces - no timer needed
      { display: '2-3 min', duration: 150, description: 'Chicken cooked through' }, // Finish chicken
      { display: '~30 sec', duration: 30, description: 'Wilted holy basil' }, // Add basil
      { display: '2-3 min', duration: 150, description: 'Crispy edges, runny yolk' }, // Fry eggs
      null // Serve immediately - no timer needed
    ]
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
    prepTimeMin: 25,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    contentType: 'FISH',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: [
      'FOR THE NOODLES:',
      '8oz (225g) dried rice stick noodles (banh pho width)',
      'Warm water for soaking',
      'FOR THE SAUCE:',
      '3 tablespoons tamarind paste (or 2 tbsp lime juice + 1 tbsp rice vinegar)',
      '3 tablespoons fish sauce (nam pla)',
      '3 tablespoons palm sugar or brown sugar',
      '1 tablespoon vegetable oil',
      'FOR THE STIR-FRY:',
      '3 tablespoons vegetable oil, divided',
      '3 cloves garlic, minced',
      '1/2 lb (225g) medium shrimp, peeled and deveined',
      '2 large eggs, lightly beaten',
      '1 cup firm tofu, cubed (optional)',
      '3 green onions, cut into 2-inch pieces',
      '2 cups fresh bean sprouts',
      '2 tablespoons preserved turnip (chai po), chopped (optional)',
      'FOR GARNISH:',
      '1/4 cup roasted peanuts, roughly chopped',
      '2 limes, cut into wedges',
      '1/4 cup fresh cilantro, chopped',
      'Extra bean sprouts',
      'Sliced red chilies',
      'Thai chili flakes (optional)'
    ],
    instructions: [
      'Soak rice noodles in warm water 20-30 minutes until flexible but still firm. They should bend without breaking but not be mushy',
      'While noodles soak, whisk together tamarind paste, fish sauce, and palm sugar until sugar dissolves completely',
      'Heat wok or large skillet over high heat until smoking. Add 1 tablespoon oil and swirl to coat',
      'Add minced garlic and stir-fry 15 seconds until fragrant. Add shrimp and cook 1-2 minutes until pink',
      'Push shrimp to one side of wok. Add remaining oil to empty side, then pour in beaten eggs',
      'Let eggs set for 30 seconds, then scramble gently. When almost set, mix with shrimp',
      'Drain noodles well. Add noodles to wok and toss everything together for 1-2 minutes',
      'Pour sauce mixture over noodles. Toss continuously for 2-3 minutes until noodles absorb sauce and become glossy',
      'Add tofu (if using), green onions, half the bean sprouts, and preserved turnip. Toss for 1 minute',
      'Taste and adjust - should be balanced sweet, sour, and salty. Add more of any sauce component as needed',
      'Remove from heat. Serve immediately on plates garnished with peanuts, lime wedges, cilantro, and remaining bean sprouts',
      'Provide extra lime, chilies, and chili flakes on the side for individual customization'
    ],
    servings: 2,
    description: 'Thailand\'s national dish - silky rice noodles with shrimp, eggs, and bean sprouts in perfect sweet-sour-salty harmony',
    equipment: ['Large wok or skillet', 'Large bowl for soaking noodles', 'Small whisk'],
    storageInstructions: 'Best eaten immediately. Pad Thai doesn\'t reheat well - noodles become mushy. Make fresh each time.',
    culturalContext: 'Created in the 1930s to promote Thai nationalism, Pad Thai showcases the Thai mastery of balancing fundamental flavors.',
    voiceIntro: 'Ah, Pad Thai - our national treasure! Today we balance sweet, sour, salty like walking on silk thread. Every bite must sing harmony.',
    voiceTips: [
      'The noodles are like silk ribbons - soak until flexible but still with some bite',
      'Your wok must breathe fire - high heat gives Pad Thai its essential smoky flavor',
      'Don\'t scramble the eggs too much - let them stay in soft, silky curds',
      'The sauce should coat every noodle like morning dew on lotus leaves',
      'Taste and adjust - if too sweet add lime, too sour add sugar, too bland add fish sauce',
      'Bean sprouts add the essential crunch - some raw, some cooked, this is the texture dance',
      'Serve immediately while noodles still glisten - Pad Thai loses its soul when it waits'
    ],
    subsNote: 'No tamarind? Mix lime juice and rice vinegar. Dried shrimp can replace fresh. Vegetarian version: omit shrimp and fish sauce, use soy sauce and extra vegetables.',
    voiceEnabled: true,
    stepTimers: [
      { display: '20-30 min', duration: 1500, description: 'Flexible but firm noodles' }, // Soak noodles
      null, // Make sauce - no timer
      null, // Heat wok - no timer
      { display: '~15 sec', duration: 15, description: 'Fragrant garlic' }, // Cook garlic
      { display: '1-2 min', duration: 90, description: 'Pink cooked shrimp' }, // Cook shrimp
      { display: '~30 sec', duration: 30, description: 'Set eggs before scrambling' }, // Cook eggs
      { display: '1-2 min', duration: 90, description: 'Combined ingredients' }, // Toss noodles
      { display: '2-3 min', duration: 150, description: 'Glossy sauce-coated noodles' }, // Add sauce
      { display: '1 min', duration: 60, description: 'Heated through vegetables' }, // Add vegetables
      null, // Taste and adjust - no timer
      null, // Serve - no timer
      null // Provide garnishes - no timer
    ]
  },
  {
    id: 'khao-soi',
    title: 'Khao Soi',
    cookingTime: '2 hours',
    cookTimeMin: 120,
    prepTimeMin: 30,
    difficulty: 'ADVANCED',
    category: 'WEEKEND',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: [
      'FOR THE CURRY PASTE:',
      '6 dried New Mexico or guajillo chiles, stemmed and seeded',
      '3 dried red Fresno chiles (or 2 tsp chili flakes)',
      '4 shallots, sliced',
      '6 cloves garlic, sliced',
      '2-inch piece galangal or ginger, sliced',
      '3 lemongrass stalks, tender parts only, sliced',
      '1 tablespoon coriander seeds, toasted',
      '1 teaspoon turmeric powder',
      '1 teaspoon shrimp paste (optional)',
      'FOR THE CURRY:',
      '2 cans (14oz each) coconut milk, chilled overnight',
      '2 lbs (900g) bone-in chicken thighs and drumsticks',
      '2 cups chicken stock',
      '3 tablespoons fish sauce',
      '2 tablespoons palm sugar or brown sugar',
      '1 tablespoon tamarind paste',
      'FOR THE NOODLES:',
      '1 lb (450g) fresh egg noodles (or dried wheat noodles)',
      'Oil for deep frying',
      'FOR GARNISHES:',
      '4 shallots, thinly sliced',
      '4 green onions, sliced',
      '1/2 cup fresh cilantro, chopped',
      'Lime wedges',
      'Thai chili oil or chili flakes',
      'Pickled mustard greens (dong choi), chopped'
    ],
    instructions: [
      'Soak dried chiles in hot water 20 minutes until softened. Drain and roughly chop',
      'In mortar and pestle or food processor, pound/blend soaked chiles, shallots, garlic, galangal, lemongrass, coriander, turmeric, and shrimp paste into smooth paste',
      'Open chilled coconut milk without shaking. Scoop out 1 cup thick cream from top',
      'Heat thick coconut cream in large pot over medium heat. Fry until oil separates, about 5 minutes',
      'Add curry paste and fry for 8-10 minutes, stirring constantly, until very fragrant and darkened',
      'Add chicken pieces and brown on all sides, about 8 minutes total',
      'Add remaining coconut milk, chicken stock, fish sauce, palm sugar, and tamarind paste',
      'Bring to gentle simmer, cover partially, and cook 45 minutes until chicken is very tender',
      'Meanwhile, cook fresh noodles in boiling water according to package directions. Drain and divide among serving bowls',
      'Reserve a handful of cooked noodles. Heat oil to 350°F and deep fry reserved noodles until golden and crispy',
      'Remove chicken from curry, shred meat from bones, and return to pot. Simmer 10 more minutes',
      'Taste and adjust seasoning - should be rich, slightly sweet, with good depth of flavor',
      'Ladle hot curry over noodles in bowls. Top with crispy fried noodles and arrange garnishes alongside',
      'Serve immediately with pickled mustard greens, extra lime, and chili oil for each person to customize'
    ],
    servings: 4,
    description: 'Northern Thailand\'s iconic curry noodle soup - rich coconut curry with tender chicken over egg noodles, crowned with crispy noodles',
    equipment: ['Mortar and pestle or food processor', 'Large heavy pot', 'Deep fryer or heavy pot for frying', 'Fine-mesh strainer'],
    storageInstructions: 'Curry base keeps 4 days refrigerated. Store crispy noodles separately in airtight container. Assemble fresh for serving.',
    culturalContext: 'Born in Chiang Mai from Burmese influences, Khao Soi represents northern Thailand\'s unique culinary identity - rich, warming, complex.',
    voiceIntro: 'Sawadee ka! Today we travel north to Chiang Mai - where mountains meet curry in a bowl of golden comfort. This is soul food, Thai style.',
    voiceTips: [
      'The curry paste is the heart - pound until smooth as silk, this takes patience',
      'Listen for the coconut cream to sing when oil separates - this is the foundation',
      'Fry that paste until it\'s dark and fragrant like temple incense - don\'t rush this step',
      'The chicken should fall off the bone - northern style is tender and rich',
      'Crispy noodles are not optional - they add the textural magic that makes Khao Soi special',
      'Each bowl should have layers - soft noodles, rich curry, tender chicken, crispy topping',
      'Garnishes let everyone make it their own - this is part of the Khao Soi ceremony'
    ],
    subsNote: 'Simplified version: Use 1/4 cup red curry paste plus 1 tsp turmeric instead of making paste from scratch. Massaman curry paste works too. Fried wonton strips substitute for crispy noodles.',
    voiceEnabled: true,
    stepTimers: [
      { display: '20 min', duration: 1200, description: 'Softened chiles' }, // Soak chiles
      null, // Make curry paste - no timer
      null, // Separate coconut cream - no timer
      { display: '~5 min', duration: 300, description: 'Oil separated coconut cream' }, // Fry coconut cream
      { display: '8-10 min', duration: 540, description: 'Very fragrant darkened paste' }, // Fry curry paste
      { display: '~8 min', duration: 480, description: 'Browned chicken pieces' }, // Brown chicken
      null, // Add liquids - no timer
      { display: '45 min', duration: 2700, description: 'Very tender chicken' }, // Simmer curry
      null, // Cook noodles - no timer
      { display: '~3 min', duration: 180, description: 'Golden crispy noodles' }, // Fry noodles
      null, // Shred chicken - no timer
      { display: '10 min', duration: 600, description: 'Flavors melded' }, // Final simmer
      null, // Assemble bowls - no timer
      null // Serve with garnishes - no timer
    ]
  },
  {
    id: 'massaman-beef',
    title: 'Massaman Beef Curry',
    cookingTime: '3 hours',
    cookTimeMin: 180,
    prepTimeMin: 20,
    difficulty: 'ADVANCED',
    category: 'CELEBRATION',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Mae Malai',
    mamaEmoji: '🌿',
    ingredients: [
      'FOR THE CURRY:',
      '3 lbs (1.4kg) beef chuck roast, cut into 2-inch cubes',
      '1/4 cup massaman curry paste (store-bought or homemade)',
      '2 cans (14oz each) coconut milk, chilled overnight',
      '2 cups beef stock',
      '3 tablespoons fish sauce',
      '3 tablespoons palm sugar or brown sugar',
      '2 tablespoons tamarind paste',
      '6 whole green cardamom pods, lightly crushed',
      '1 cinnamon stick',
      '4 whole cloves',
      '2 star anise',
      '2 bay leaves',
      'FOR THE VEGETABLES:',
      '1.5 lbs (680g) waxy potatoes, peeled and cut into 2-inch chunks',
      '1 large yellow onion, cut into large wedges',
      '1/2 cup roasted peanuts, roughly chopped',
      'FOR SERVING:',
      'Steamed jasmine rice',
      'Fresh cilantro for garnish',
      'Sliced red chilies',
      'Extra roasted peanuts'
    ],
    instructions: [
      'Open chilled coconut milk without shaking. Scoop out 1/2 cup thick cream from top',
      'Heat thick coconut cream in heavy Dutch oven over medium heat until oil separates, about 5-6 minutes',
      'Add massaman curry paste and fry for 5-8 minutes, stirring constantly, until very fragrant and dark red',
      'Add beef cubes and brown on all sides, about 10 minutes total. The paste should coat the meat beautifully',
      'Add remaining coconut milk, beef stock, fish sauce, palm sugar, and tamarind paste',
      'Add whole spices (cardamom, cinnamon, cloves, star anise, bay leaves) tied in cheesecloth for easy removal',
      'Bring to gentle simmer, cover partially, and cook 1.5 hours, stirring occasionally',
      'Add potato chunks and onion wedges. Continue simmering 45 minutes until beef is fork-tender and potatoes are cooked',
      'Stir in chopped peanuts and simmer 15 more minutes. Curry should be thick enough to coat a spoon',
      'Remove spice bundle and taste for seasoning. Adjust with more palm sugar, fish sauce, or tamarind as needed',
      'The curry should be rich, slightly sweet, with warm spice notes and tender beef that falls apart',
      'Serve hot over jasmine rice, garnished with cilantro, sliced chilies, and extra peanuts'
    ],
    servings: 6,
    description: 'Thailand\'s royal curry - Persian-influenced beef braised until fork-tender in coconut milk with warm spices and peanuts',
    equipment: ['Heavy Dutch oven or large pot', 'Cheesecloth for spice bundle'],
    storageInstructions: 'Refrigerate up to 4 days or freeze up to 3 months. Flavors improve overnight. Reheat gently, adding coconut milk if needed.',
    culturalContext: 'Born from Persian traders in Thai royal courts, Massaman represents the sophisticated fusion of cultures that defines Thai cuisine.',
    voiceIntro: 'Sawadee ka! Today we make the curry of kings - Massaman from the royal palace. Spices from far lands, patience from old wisdom.',
    voiceTips: [
      'The coconut cream must separate its oil - this is the foundation of rich Massaman',
      'Fry that paste until it\'s dark as teak wood and smells like paradise',
      'Brown the beef with love - each piece should be kissed by the curry paste',
      'Low and slow like meditation - rushing ruins the tender beef',
      'Potatoes should hold their shape but be creamy inside - choose waxy varieties',
      'Peanuts add richness at the end - like gold coins in treasure chest',
      'Taste for balance - sweet, salty, sour, and warming spices in harmony',
      'This curry is even better tomorrow - flavors marry like old friends'
    ],
    subsNote: 'Chicken thighs work beautifully - reduce cooking time to 90 minutes total. No massaman paste? Mix red curry paste with ground cinnamon, cardamom, and nutmeg. Beef short ribs are also excellent.',
    voiceEnabled: true,
    stepTimers: [
      null, // Separate coconut cream - no timer
      { display: '5-6 min', duration: 330, description: 'Oil separated coconut cream' }, // Fry coconut cream
      { display: '5-8 min', duration: 390, description: 'Very fragrant dark red paste' }, // Fry curry paste
      { display: '~10 min', duration: 600, description: 'Browned beef coated with paste' }, // Brown beef
      null, // Add liquids and seasonings - no timer
      null, // Add spice bundle - no timer
      { display: '1.5 hours', duration: 5400, description: 'Beef starting to become tender' }, // Simmer beef
      { display: '45 min', duration: 2700, description: 'Fork-tender beef and cooked potatoes' }, // Add vegetables
      { display: '15 min', duration: 900, description: 'Rich thick curry with peanuts' }, // Add peanuts
      null, // Remove spices and adjust seasoning - no timer
      null, // Check final consistency - no timer
      null // Serve with garnishes - no timer
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