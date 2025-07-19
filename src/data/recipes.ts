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
  // Enhanced tip structure
  displayTips?: string[]; // 1-2 key tips shown at top of instructions
  stepVoiceTips?: { [stepNumber: number]: string }; // Step-specific voice guidance
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
    voiceIntro: "Ciao! Today we make my beautiful Penne all'Arrabbiata. Very simple but you must do with passion!",
    stepVoiceTips: {
      1: "Make sure your garlic doesn't burn - burned garlic is bitter, no good!",
      3: "Don't put too much salt in the pasta water - the pasta will absorb it",
      4: "Listen for the sizzle when you add the chili - that's when you know it's ready!"
    },
    voiceTips: [
      "Make sure your garlic doesn't burn - burned garlic is bitter, no good!",
      "Use real San Marzano tomatoes if you can find them, they make all the difference",
      "Don't put too much salt in the pasta water - the pasta will absorb it"
    ],
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
    ingredients: ['1 whole chicken cut into pieces', '1 onion', '2 bell peppers', '400g crushed tomatoes', '200ml white wine', 'Olive oil', 'Herbs'],
    instructions: [
      'Season chicken pieces with salt and pepper',
      'Heat oil in large skillet, brown chicken on all sides',
      'Remove chicken, sauté onions and peppers until soft',
      'Add wine to deglaze pan',
      'Return chicken to pan with tomatoes and herbs',
      'Simmer covered for 20 minutes until chicken is tender',
      'Adjust seasoning and serve hot'
    ],
    servings: 4,
    description: 'Traditional Italian hunter\'s chicken with vegetables',
    voiceIntro: "Ciao mia cara! Today we cook my beautiful Chicken Cacciatore. Is like cooking with love for your famiglia!",
    stepVoiceTips: {
      1: "Pat the chicken very dry before seasoning - this gives you beautiful crispy skin when you brown it",
      2: "Don't move the chicken too much when browning - let it develop that golden color, tesoro",
      5: "Add a little wine if you have - makes everything more delicious, just like nonna used to do!"
    },
    voiceTips: [
      "Pat the chicken very dry before browning - this gives you beautiful crispy skin",
      "Don't move the chicken too much when browning - let it develop that golden color",
      "Add a little wine if you have - makes everything more delicious!"
    ],
    voiceEnabled: true
  },
  {
    id: 'classic-carbonara',
    title: 'Classic Carbonara',
    cookingTime: '15 min',
    cookTimeMin: 15,
    difficulty: 'MEDIUM',
    category: 'QUICK',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: [
      '400g spaghetti or tonnarelli',
      '200g guanciale or pancetta, diced',
      '4 large egg yolks',
      '100g Pecorino Romano cheese, grated',
      'Freshly ground black pepper',
      'Salt for pasta water'
    ],
    instructions: [
      'Bring large pot of salted water to boil for pasta',
      'Cook guanciale in large skillet over medium heat until crispy and golden',
      'Meanwhile, whisk egg yolks with grated Pecorino and plenty of black pepper',
      'Cook pasta until just shy of al dente, reserve 1 cup pasta cooking water',
      'Add drained hot pasta to skillet with guanciale and fat',
      'Remove from heat, quickly toss with egg mixture and pasta water',
      'Serve immediately with extra Pecorino and black pepper'
    ],
    servings: 4,
    description: 'Rome\'s iconic pasta dish with eggs, cheese, and guanciale - no cream!',
    voiceIntro: "Ah, Carbonara! The pride of Roma. Listen carefully - no cream, no peas, no nonsense. Just perfection!",
    stepVoiceTips: {
      3: "Save that pasta water - it's liquid gold for making the sauce creamy",
      4: "Use only Pecorino Romano cheese, not Parmesan - this is the Roman way",
      6: "Take the pan off the heat when mixing eggs - they must not scramble",
      7: "No cream! Real Carbonara never has cream - this is very important!"
    },
    voiceTips: [
      "No cream! Real Carbonara never has cream - this is very important!",
      "Take the pan off the heat when mixing eggs - they must not scramble",
      "Save that pasta water - it's liquid gold for making the sauce creamy",
      "Use only Pecorino Romano cheese, not Parmesan - this is the Roman way"
    ],
    featured: true,
    voiceEnabled: true,
    equipment: ['Large pot', 'Large skillet', 'Whisk', 'Cheese grater', 'Tongs'],
    culturalContext: "Carbonara was born in Rome, possibly created by charcoal workers (carbonari) who needed a hearty meal. The dish represents the essence of Roman cooking - transforming simple ingredients into something magical."
  },
  {
    id: 'homemade-lasagna',
    title: 'Nonna\'s Homemade Lasagna',
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
      'FOR THE RAGÙ:',
      '500g ground beef and pork mix',
      '1 large onion, finely chopped',
      '2 carrots, finely diced',
      '2 celery stalks, finely diced',
      '800g San Marzano tomatoes, crushed',
      '200ml red wine',
      'FOR THE BÉCHAMEL:',
      '80g butter',
      '80g plain flour',
      '800ml whole milk, warmed',
      'Pinch of nutmeg',
      'ASSEMBLY:',
      '500g fresh lasagna sheets',
      '300g Parmigiano-Reggiano, grated',
      '250g fresh mozzarella, torn'
    ],
    instructions: [
      'FOR THE RAGÙ:',
      'Make ragù by browning meat, then vegetables, add wine and tomatoes, simmer 1.5 hours',
      'FOR THE BÉCHAMEL:',
      'Make béchamel by melting butter, whisking in flour, gradually adding warm milk',
      'ASSEMBLY:',
      'Cook lasagna sheets until just shy of al dente, drain carefully',
      'Layer: béchamel, pasta, ragù, cheeses - repeat 4 times',
      'Cover with foil, bake at 180°C for 45 minutes',
      'Remove foil, bake 15 minutes more until golden',
      'Rest for 15 minutes before cutting - this is important!'
    ],
    servings: 8,
    description: 'Traditional Emilian lasagna with rich ragù Bolognese and creamy béchamel',
    voiceIntro: "Bene, mia cara! Today we make lasagna from my nonna's recipe. This takes time but is worth every minute!",
    stepVoiceTips: {
      1: "Use San Marzano tomatoes in your ragù - they're sweeter, more delicate",
      2: "Don't make your béchamel too thick - it should coat the spoon like cream",
      4: "Save some pasta water when cooking sheets - helps if they stick together",
      6: "Cover with foil if the top browns too quickly - we want golden, not burnt",
      7: "Let the lasagna rest after baking - I know it's hard but it cuts better this way"
    },
    voiceTips: [
      "Make your ragù the day before - it gets better with time, like good wine!",
      "Don't make your béchamel too thick - it should coat the spoon like cream",
      "Let the lasagna rest after baking - I know it's hard but it cuts better this way",
      "Save some pasta water when cooking sheets - helps if they stick together",
      "Cover with foil if the top browns too quickly - we want golden, not burnt",
      "Use San Marzano tomatoes in your ragù - they're sweeter, more delicate"
    ],
    voiceEnabled: true,
    equipment: ['Large heavy-bottomed pot', 'Large saucepan', 'Whisk', '33x23cm baking dish', 'Large pot for pasta', 'Fine grater'],
    storageInstructions: "Leftover lasagna keeps in refrigerator for 3-4 days. Reheat individual portions in microwave or covered in 160°C oven. Can be frozen for up to 3 months - thaw completely before reheating.",
    culturalContext: "This recipe represents the traditional Emilian style from Bologna, where layers of handmade pasta are dressed with ragù Bolognese and béchamel. Each family has their own secret touches passed down through generations."
  },
  {
    id: 'osso-buco',
    title: 'Osso Buco alla Milanese',
    cookingTime: '2.5 hours',
    cookTimeMin: 150,
    prepTimeMin: 30,
    difficulty: 'ADVANCED',
    category: 'CELEBRATION',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 1,
    mamaName: 'Nonna Lucia',
    mamaEmoji: '🍷',
    ingredients: [
      '4 large veal shanks (2 inches thick), tied with kitchen string',
      '1 cup all-purpose flour for dredging',
      '3 tablespoons olive oil',
      '3 tablespoons butter',
      '1 large onion, diced',
      '2 carrots, diced',
      '2 celery stalks, diced',
      '1 cup dry white wine',
      '400g San Marzano tomatoes, crushed',
      '500ml beef stock',
      'FOR GREMOLATA:',
      'Zest of 2 lemons',
      '3 garlic cloves, minced',
      '1/2 cup fresh parsley, chopped'
    ],
    instructions: [
      'Season veal shanks and dredge in flour, shaking off excess',
      'Heat oil and butter in heavy Dutch oven, brown shanks on all sides',
      'Remove shanks, sauté vegetables until softened',
      'Add wine to deglaze, scraping up browned bits',
      'Return shanks to pot, add tomatoes and enough stock to partially cover',
      'Cover and braise in 160°C oven for 2 hours until fork-tender',
      'Make gremolata by mixing lemon zest, garlic, and parsley',
      'Serve shanks with braising liquid, topped with fresh gremolata'
    ],
    servings: 4,
    description: 'Milanese braised veal shanks with aromatic vegetables and bright gremolata',
    voiceIntro: "Ah, Osso Buco! This is Sunday dinner, special occasion food. We cook with patience and amore!",
    stepVoiceTips: {
      1: "Tie the shanks with kitchen string so they don't fall apart during cooking",
      2: "Don't rush the browning - each side needs 4-5 minutes for beautiful color",
      4: "If you can't find veal, beef shanks work too, just cook a little longer",
      6: "The marrow is the treasure - use a small spoon to get every bit!",
      7: "Make gremolata fresh - don't prepare it too early or the lemon loses its punch"
    },
    voiceTips: [
      "Ask your butcher to cut the shanks 2 inches thick - this is molto importante!",
      "Tie the shanks with kitchen string so they don't fall apart during cooking",
      "Don't rush the browning - each side needs 4-5 minutes for beautiful color",
      "The marrow is the treasure - use a small spoon to get every bit!",
      "If you can't find veal, beef shanks work too, just cook a little longer",
      "Make gremolata fresh - don't prepare it too early or the lemon loses its punch"
    ],
    voiceEnabled: true,
    equipment: ['Heavy Dutch oven or braising pot', 'Kitchen string', 'Sharp knife', 'Large plate for dredging', 'Wooden spoon'],
    storageInstructions: "Osso buco actually improves after a day in the refrigerator. Store covered for up to 3 days. Reheat gently on stovetop, adding a splash of stock if needed. The marrow will set when cold but melts beautifully when reheated.",
    culturalContext: "This dish originated in Milan in the 19th century. The name means 'bone with a hole,' referring to the marrow-filled bone. Traditionally served with risotto alla milanese, the saffron rice perfectly complements the rich, wine-braised veal."
  },

  // Abuela Rosa's Recipes
  {
    id: 'quesadillas',
    title: 'Cheese Quesadillas',
    cookingTime: '10 min',
    cookTimeMin: 10,
    difficulty: 'EASY',
    category: 'QUICK',
    contentType: 'VEGETARIAN',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: ['4 flour tortillas', '200g cheese (Oaxaca or Monterey Jack)', 'Oil for cooking'],
    instructions: [
      'Grate cheese if using block cheese',
      'Place cheese on half of each tortilla, fold over',
      'Heat pan over medium heat, cook quesadilla until golden',
      'Flip and cook other side until cheese melts',
      'Cut into triangles and serve immediately'
    ],
    servings: 2,
    description: 'Simple and delicious melted cheese in warm tortillas',
    voiceIntro: "¡Órale! Let's make some delicious quesadillas, mi amor. Simple but so, so good when done right!",
    stepVoiceTips: {
      2: "Don't put too much filling or it will spill everywhere - less is more!",
      3: "Let the tortilla get golden brown before flipping - patience, mija!",
      4: "Always serve immediately while the cheese is still melty and perfect"
    },
    voiceTips: [
      "Don't put too much filling or it will spill everywhere - less is more!",
      "Let the tortilla get golden brown before flipping - patience, mija!",
      "Always serve immediately while the cheese is still melty and perfect"
    ],
    voiceEnabled: true
  },
  {
    id: 'chicken-tinga',
    title: 'Chicken Tinga',
    cookingTime: '45 min',
    cookTimeMin: 45,
    prepTimeMin: 15,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: [
      '1kg chicken breasts or thighs',
      '1 large white onion, halved',
      '4 garlic cloves',
      '2 bay leaves',
      'FOR THE SAUCE:',
      '3 chipotle chiles in adobo, plus 2 tbsp adobo sauce',
      '400g crushed tomatoes',
      '1 white onion, sliced',
      '2 garlic cloves, minced',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Poach chicken with onion, garlic, and bay leaves until tender',
      'Reserve cooking liquid, shred chicken when cool enough to handle',
      'Blend chipotles, adobo sauce, and tomatoes until smooth',
      'Sauté sliced onion and garlic until soft and golden',
      'Add chipotle sauce, simmer until reduced and thickened',
      'Add shredded chicken, mix well and simmer 10 minutes',
      'Season with salt and pepper, serve in tacos or tostadas'
    ],
    servings: 6,
    description: 'Smoky shredded chicken in chipotle tomato sauce - perfect for tacos',
    voiceIntro: "¡Ay, qué rico! Chicken Tinga is one of my favorites. Perfect for tacos, tostadas, anything you want!",
    stepVoiceTips: {
      2: "Save some cooking liquid - if it gets too dry, add a little back in",
      4: "Don't shred the chicken too fine - you want some texture, not chicken fluff!",
      5: "Let the chipotle sauce reduce well - this concentrates all those beautiful smoky flavors",
      6: "This tastes even better the next day - make extra for leftovers!"
    },
    voiceTips: [
      "Don't shred the chicken too fine - you want some texture, not chicken fluff!",
      "Let the chipotle sauce reduce well - this concentrates all those beautiful smoky flavors",
      "Save some cooking liquid - if it gets too dry, add a little back in",
      "This tastes even better the next day - make extra for leftovers!"
    ],
    voiceEnabled: true,
    equipment: ['Large pot', 'Blender', 'Large skillet', 'Two forks for shredding', 'Strainer'],
    storageInstructions: "Chicken tinga keeps in refrigerator for up to 5 days and actually improves in flavor. Can be frozen for up to 3 months. Reheat gently, adding a splash of the reserved cooking liquid if needed.",
    culturalContext: "Tinga originates from Puebla, Mexico. The word 'tinga' comes from the Nahuatl word meaning 'to mix' or 'to stir.' This dish showcases the Mexican love affair with chipotle chiles - jalapeños that have been smoked and dried, giving incredible depth of flavor."
  },
  {
    id: 'enchiladas-verdes',
    title: 'Enchiladas Verdes',
    cookingTime: '40 min',
    cookTimeMin: 40,
    prepTimeMin: 20,
    difficulty: 'MEDIUM',
    category: 'WEEKEND',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: [
      'FOR THE SALSA VERDE:',
      '1kg fresh tomatillos, husked',
      '2-3 serrano chiles',
      '1 white onion, quartered',
      '4 garlic cloves',
      '1/2 cup fresh cilantro',
      'FOR ASSEMBLY:',
      '12 corn tortillas',
      '500g cooked chicken, shredded',
      '200g Mexican crema or sour cream',
      '300g queso fresco or Monterey Jack, crumbled',
      '1/4 white onion, thinly sliced'
    ],
    instructions: [
      'Char tomatillos, chiles, onion, and garlic under broiler until blackened',
      'Blend charred vegetables with cilantro and salt until smooth',
      'Simmer salsa verde for 15 minutes until slightly thickened',
      'Warm tortillas in dry pan or microwave until pliable',
      'Fill tortillas with chicken, roll tightly, place seam-side down',
      'Pour salsa verde over enchiladas, add dollops of crema',
      'Sprinkle with cheese and onion slices',
      'Bake at 180°C for 15 minutes until heated through and bubbly'
    ],
    servings: 4,
    description: 'Corn tortillas filled with chicken and smothered in bright green tomatillo salsa',
    voiceIntro: "¡Mira! Enchiladas Verdes are pure comfort food. The green sauce is everything - bright, fresh, with just the right kick!",
    stepVoiceTips: {
      1: "Don't skip charring the tomatillos - this adds so much depth to your salsa verde",
      4: "Warm your tortillas well so they don't crack when rolling - nobody wants broken enchiladas!",
      5: "Don't roll them too tight - the filling needs room to expand when heated",
      6: "Use Mexican crema if you can find it - it's richer than sour cream",
      7: "Fresh cheese like queso fresco is traditional, but Monterey Jack melts beautifully too"
    },
    voiceTips: [
      "Don't skip charring the tomatillos - this adds so much depth to your salsa verde",
      "Warm your tortillas well so they don't crack when rolling - nobody wants broken enchiladas!",
      "Don't roll them too tight - the filling needs room to expand when heated",
      "Use Mexican crema if you can find it - it's richer than sour cream",
      "Fresh cheese like queso fresco is traditional, but Monterey Jack melts beautifully too"
    ],
    voiceEnabled: true,
    equipment: ['Baking sheet', 'Blender', 'Large saucepan', '23x33cm baking dish', 'Tongs'],
    storageInstructions: "Assembled enchiladas can be covered and refrigerated for up to 2 days before baking. Leftover baked enchiladas keep for 3-4 days. Reheat covered in oven to prevent drying out.",
    culturalContext: "Enchiladas verdes showcase the versatility of tomatillos, Mexico's ancient green tomato. The technique of charring vegetables before blending is fundamental to Mexican cooking, adding layers of smoky complexity that can't be achieved any other way."
  },
  {
    id: 'pozole-rojo',
    title: 'Pozole Rojo',
    cookingTime: '3 hours',
    cookTimeMin: 180,
    prepTimeMin: 30,
    difficulty: 'ADVANCED',
    category: 'CELEBRATION',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: [
      '2kg pork shoulder, cut in large chunks',
      '500g pork ribs',
      '1 white onion, quartered',
      '6 garlic cloves',
      '2 bay leaves',
      'FOR THE CHILE SAUCE:',
      '6 guajillo chiles, stemmed and seeded',
      '4 ancho chiles, stemmed and seeded',
      '2 chipotle chiles, stemmed and seeded',
      '3 Roma tomatoes',
      'GARNISHES:',
      '800g prepared hominy, drained',
      'Thinly sliced cabbage',
      'Diced onion',
      'Lime wedges',
      'Dried oregano',
      'Red pepper flakes'
    ],
    instructions: [
      'Simmer pork shoulder and ribs with onion, garlic, and bay leaves for 2 hours',
      'Toast dried chiles in dry pan until puffed and fragrant',
      'Soak toasted chiles in hot water for 20 minutes until softened',
      'Blend soaked chiles with tomatoes and soaking liquid until smooth',
      'Strain chile sauce to remove any remaining bits',
      'Add chile sauce and hominy to pork broth, simmer 30 minutes',
      'Shred pork when cool enough to handle, return to pot',
      'Serve hot with garnishes on the side for everyone to customize'
    ],
    servings: 8,
    description: 'Traditional Mexican soup with pork, hominy, and red chile broth - perfect for celebrations',
    voiceIntro: "¡Ay, Pozole! This is celebration food, weekend food. Takes time but fills the heart and belly with happiness!",
    stepVoiceTips: {
      2: "Toast your chiles until they puff but don't let them burn - bitter chiles ruin everything!",
      3: "Skim the foam from the pork broth - this keeps your pozole clear and clean",
      5: "Don't add the hominy too early - it can get mushy if overcooked",
      6: "If you can't find dried chiles, use chipotle in adobo but reduce the quantity",
      7: "Let people garnish their own bowls - everyone likes different amounts of everything",
      8: "Save some chile broth separately - some people like their pozole extra spicy!"
    },
    voiceTips: [
      "Toast your chiles until they puff but don't let them burn - bitter chiles ruin everything!",
      "Skim the foam from the pork broth - this keeps your pozole clear and clean",
      "Don't add the hominy too early - it can get mushy if overcooked",
      "Let people garnish their own bowls - everyone likes different amounts of everything",
      "If you can't find dried chiles, use chipotle in adobo but reduce the quantity",
      "Save some chile broth separately - some people like their pozole extra spicy!"
    ],
    voiceEnabled: true,
    equipment: ['Very large pot', 'Blender', 'Fine-mesh strainer', 'Ladle', 'Small bowls for garnishes', 'Comal or heavy skillet'],
    storageInstructions: "Pozole improves with time and keeps for up to 5 days refrigerated. Store garnishes separately. Can be frozen (without garnishes) for up to 3 months. The hominy may absorb more liquid when stored - add broth when reheating.",
    culturalContext: "Pozole has ancient Aztec origins and was considered sacred, traditionally served during religious ceremonies. The word comes from Nahuatl 'pozolli' meaning 'foam.' Red pozole represents one of the three traditional colors, along with white and green."
  },
  {
    id: 'mole-poblano',
    title: 'Mole Poblano',
    cookingTime: '4 hours',
    cookTimeMin: 240,
    prepTimeMin: 60,
    difficulty: 'ADVANCED',
    category: 'CELEBRATION',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 2,
    mamaName: 'Abuela Rosa',
    mamaEmoji: '🌶️',
    ingredients: [
      '1 whole turkey, cut into pieces (or large chicken)',
      'FOR THE MOLE SAUCE:',
      '6 ancho chiles',
      '4 mulato chiles',
      '2 pasilla chiles',
      '2 chipotle chiles',
      '4 tomatoes',
      '6 tomatillos',
      '1 white onion',
      '8 garlic cloves',
      '1/4 cup sesame seeds',
      '1/4 cup pumpkin seeds',
      '2 corn tortillas, torn',
      '2 slices bread, torn',
      '50g Mexican chocolate',
      '1 tsp cinnamon',
      '1/2 tsp anise seeds',
      '4 cloves',
      '1/2 tsp black peppercorns'
    ],
    instructions: [
      'Toast each type of chile separately until puffed, soak in hot water',
      'Char tomatoes, tomatillos, onion, and garlic until blackened',
      'Toast seeds, tortillas, bread, and spices until fragrant',
      'Blend everything in batches with chile soaking liquid until smooth',
      'Strain mixture through fine-mesh sieve for silky texture',
      'Fry mole paste in large pot for 30 minutes, stirring constantly',
      'Add chocolate and simmer with turkey pieces for 1 hour',
      'Adjust consistency with turkey broth as needed',
      'Serve with warm tortillas and Mexican rice'
    ],
    servings: 10,
    description: 'Mexico\'s national dish - complex sauce with chocolate, chiles, and spices over turkey',
    voiceIntro: "¡Órale! Mole Poblano - the crown jewel of Mexican cuisine. This is not quick food, this is love food that takes time and patience.",
    stepVoiceTips: {
      1: "Toast each chile type separately - they all have different timing and you don't want any burnt",
      4: "Save some turkey or chicken broth - you'll need it for consistency adjustments",
      5: "If your mole gets too thick, thin with warm chicken broth, not water",
      6: "Keep stirring when adding chocolate - it can seize if not mixed properly",
      7: "Don't let the chocolate overpower - mole should be complex, not a chocolate sauce",
      8: "Strain your mole if you want it completely smooth - traditional but optional",
      9: "Make this a day ahead - mole improves overnight like a good relationship!"
    },
    voiceTips: [
      "Toast each chile type separately - they all have different timing and you don't want any burnt",
      "Don't let the chocolate overpower - mole should be complex, not a chocolate sauce",
      "If your mole gets too thick, thin with warm chicken broth, not water",
      "Make this a day ahead - mole improves overnight like a good relationship!",
      "Strain your mole if you want it completely smooth - traditional but optional",
      "Save some turkey or chicken broth - you'll need it for consistency adjustments",
      "Keep stirring when adding chocolate - it can seize if not mixed properly"
    ],
    featured: true,
    voiceEnabled: true,
    equipment: ['Very large pot', 'Blender', 'Fine-mesh strainer', 'Comal or heavy skillet', 'Wooden spoon', 'Multiple bowls for ingredients'],
    storageInstructions: "Mole improves with age and can be refrigerated for up to 1 week or frozen for 6 months. Store separately from meat when possible. Reheat gently, thinning with broth as needed. The chocolate may separate slightly when reheated - just stir well.",
    culturalContext: "Legend says mole poblano was created by nuns at the Convent of Santa Rosa in Puebla to honor a visiting bishop. With over 20 ingredients, it represents the complexity and depth of Mexican cuisine. Each family guards their recipe secrets, passed down through generations."
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
    mamaName: 'Yai Malee',
    mamaEmoji: '🌿',
    ingredients: ['500g ground chicken', '4 cloves garlic', '2-3 bird\'s eye chilies', '2 tbsp vegetable oil', '2 tbsp fish sauce', '1 tbsp oyster sauce', '1 tbsp soy sauce', '1 tsp sugar', 'Thai holy basil leaves', 'Fried eggs for serving'],
    instructions: [
      'Heat oil in wok over high heat',
      'Add minced garlic and chilies, stir-fry until fragrant',
      'Add ground chicken, breaking it up as it cooks',
      'Season with fish sauce, oyster sauce, soy sauce, and sugar',
      'Add holy basil leaves and toss until wilted',
      'Serve over rice with fried egg on top'
    ],
    servings: 2,
    description: 'Spicy Thai stir-fry with holy basil - comfort food at its finest',
    voiceIntro: "Sawasdee kha! Today we make Pad Krapao - Thai comfort food that is spicy, aromatic, and so satisfying. Very popular street food!",
    stepVoiceTips: {
      2: "Don't be shy with the chilies - this dish should have some heat!",
      3: "Cook the ground meat on high heat so it gets nice and crispy in places",
      5: "Use Thai holy basil if you can find it - it has a different flavor than sweet basil"
    },
    voiceTips: [
      "Use Thai holy basil if you can find it - it has a different flavor than sweet basil",
      "Don't be shy with the chilies - this dish should have some heat!",
      "Cook the ground meat on high heat so it gets nice and crispy in places"
    ],
    voiceEnabled: true
  },
  {
    id: 'green-curry',
    title: 'Thai Green Curry',
    cookingTime: '30 min',
    cookTimeMin: 30,
    prepTimeMin: 15,
    difficulty: 'MEDIUM',
    category: 'EVERYDAY',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Yai Malee',
    mamaEmoji: '🌿',
    ingredients: [
      '500g chicken thigh, sliced',
      '400ml coconut milk',
      '2-3 tbsp green curry paste',
      '2 Thai eggplants, quartered',
      '100g Thai basil leaves',
      '2 kaffir lime leaves',
      '2 tbsp fish sauce',
      '1 tbsp palm sugar',
      '2-3 bird\'s eye chilies'
    ],
    instructions: [
      'Fry curry paste in thick coconut cream until fragrant',
      'Add chicken pieces and cook until sealed',
      'Add remaining coconut milk gradually, stirring constantly',
      'Add eggplant and simmer until tender',
      'Season with fish sauce and palm sugar',
      'Add basil leaves and lime leaves just before serving',
      'Serve with jasmine rice'
    ],
    servings: 4,
    description: 'Creamy coconut curry with chicken, eggplant, and aromatic herbs',
    voiceIntro: "Kha! Green curry is my specialty - creamy, spicy, and full of wonderful aromatics. The secret is in the paste!",
    stepVoiceTips: {
      1: "Make your own curry paste if you have time - the flavor is so much better!",
      2: "Don't add all coconut milk at once - add gradually for better texture",
      4: "Thai eggplant is traditional but regular eggplant works fine too",
      6: "Taste and adjust - some curry pastes vary in saltiness"
    },
    voiceTips: [
      "Make your own curry paste if you have time - the flavor is so much better!",
      "Don't add all the coconut milk at once - add gradually for better texture",
      "Thai eggplant is traditional but regular eggplant works fine too",
      "Taste and adjust - some curry pastes are saltier than others"
    ],
    featured: true,
    voiceEnabled: true,
    equipment: ['Wok or large pan', 'Wooden spoon', 'Mortar and pestle (for paste)', 'Sharp knife'],
    culturalContext: "Green curry (Gaeng Keow Wan) is one of Thailand's most beloved dishes. The green color comes from fresh green chilies, and the balance of sweet, salty, and spicy represents the harmony central to Thai cooking philosophy."
  },
  {
    id: 'pad-thai',
    title: 'Pad Thai',
    cookingTime: '20 min',
    cookTimeMin: 20,
    prepTimeMin: 25,
    difficulty: 'MEDIUM',
    category: 'QUICK',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Yai Malee',
    mamaEmoji: '🌿',
    ingredients: [
      '200g rice noodles (5mm wide)',
      '200g prawns or chicken, sliced',
      '2 eggs',
      '100g firm tofu, cubed',
      '2 tbsp vegetable oil',
      'FOR THE SAUCE:',
      '3 tbsp tamarind paste',
      '3 tbsp fish sauce',
      '3 tbsp palm sugar',
      '1 tbsp soy sauce',
      'GARNISHES:',
      '100g bean sprouts',
      '4 spring onions, cut in lengths',
      '50g roasted peanuts, crushed',
      'Lime wedges',
      'Thai basil leaves'
    ],
    instructions: [
      'Soak rice noodles in warm water until just flexible, drain',
      'Mix all sauce ingredients until sugar dissolves',
      'Heat oil in wok, scramble eggs and set aside',
      'Fry tofu until golden, add prawns/chicken and cook through',
      'Push everything to one side, add noodles and sauce',
      'Toss everything together, add cooked eggs back in',
      'Add half the bean sprouts and spring onions, toss briefly',
      'Serve immediately with remaining garnishes and lime'
    ],
    servings: 2,
    description: 'Thailand\'s national dish - sweet, sour, and salty stir-fried noodles',
    voiceIntro: "Sawasdee! Pad Thai is Thailand's most famous dish. Balance is everything - sweet, sour, salty, and just a little spicy!",
    stepVoiceTips: {
      1: "Soak your rice noodles in warm water until just flexible - don't overcook them in water!",
      2: "Have all ingredients prepped before you start - Pad Thai cooks very fast",
      5: "Push ingredients to one side of wok when adding eggs - this way they set properly",
      6: "Add tamarind paste gradually - some brands are more sour than others",
      7: "If you can't find tamarind, substitute with lime juice and a tiny bit of vinegar",
      8: "Bean sprouts should stay crunchy - add them at the very end"
    },
    voiceTips: [
      "Soak your rice noodles in warm water until just flexible - don't overcook them in water!",
      "Have all ingredients prepped before you start - Pad Thai cooks very fast",
      "Push ingredients to one side of wok when adding eggs - this way they set properly",
      "Add tamarind paste gradually - some brands are more sour than others",
      "If you can't find tamarind, substitute with lime juice and a tiny bit of vinegar",
      "Bean sprouts should stay crunchy - add them at the very end"
    ],
    voiceEnabled: true,
    equipment: ['Large wok or skillet', 'Large bowl for soaking noodles', 'Small bowl for sauce', 'Wok spatula or tongs', 'Multiple small bowls for prep'],
    storageInstructions: "Pad Thai is best served immediately but leftovers can be refrigerated for 1-2 days. Add a splash of water when reheating and stir gently. The noodles may clump together when cold - this is normal.",
    culturalContext: "Created in the 1930s as part of a nationalist campaign to promote Thai identity, Pad Thai literally means 'Thai-style stir-fried noodles.' The dish perfectly embodies the Thai principle of balancing sweet, sour, salty, and spicy flavors in every bite."
  },
  {
    id: 'khao-soi',
    title: 'Khao Soi Gai',
    cookingTime: '45 min',
    cookTimeMin: 45,
    prepTimeMin: 20,
    difficulty: 'MEDIUM',
    category: 'WEEKEND',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Yai Malee',
    mamaEmoji: '🌿',
    ingredients: [
      '600g chicken thighs, bone-in',
      '400ml coconut milk',
      '500ml chicken stock',
      '400g fresh egg noodles',
      '3 tbsp Khao Soi curry paste (or red curry paste)',
      '2 tbsp fish sauce',
      '1 tbsp palm sugar',
      '2 tbsp soy sauce',
      'FOR GARNISH:',
      '100g crispy fried noodles',
      'Pickled mustard greens',
      'Shallots, thinly sliced',
      'Lime wedges',
      'Chili oil',
      'Fresh cilantro'
    ],
    instructions: [
      'Deep fry some fresh noodles until golden and crispy, set aside',
      'Simmer chicken thighs in coconut milk and stock until tender',
      'Remove chicken, shred meat, discard bones and skin',
      'Fry curry paste in same pot until fragrant',
      'Add coconut milk mixture back, bring to gentle simmer',
      'Season with fish sauce, palm sugar, and soy sauce',
      'Cook fresh noodles separately until just tender',
      'Serve noodles in bowls, top with chicken, curry broth, and all garnishes'
    ],
    servings: 4,
    description: 'Northern Thai coconut curry noodle soup with crispy noodles on top',
    voiceIntro: "Sawasdee kha! Khao Soi is northern Thailand's treasure - rich coconut curry soup with crispy noodles on top. So comforting!",
    stepVoiceTips: {
      1: "Fry some noodles until crispy for topping - this adds wonderful texture contrast",
      3: "Don't let the coconut milk boil vigorously - it will separate and look broken",
      4: "Red curry paste works if you can't find Khao Soi paste, but add extra spices",
      5: "Chicken thighs are better than breast - they stay tender and juicy",
      7: "Pickle mustard greens are traditional but cabbage works as substitute",
      8: "Serve with lime, shallots, and pickled mustard greens on the side"
    },
    voiceTips: [
      "Fry some noodles until crispy for topping - this adds wonderful texture contrast",
      "Don't let the coconut milk boil vigorously - it will separate and look broken",
      "Red curry paste works if you can't find Khao Soi paste, but add extra spices",
      "Chicken thighs are better than breast - they stay tender and juicy",
      "Pickle mustard greens are traditional but cabbage works as substitute",
      "Serve with lime, shallots, and pickled mustard greens on the side"
    ],
    voiceEnabled: true,
    equipment: ['Large pot', 'Deep fryer or wok for noodles', 'Strainer', 'Ladle', 'Multiple bowls for garnishes'],
    storageInstructions: "Store components separately - broth can be refrigerated for 3 days, reheat gently. Cook fresh noodles when ready to serve. Crispy noodles stay crisp in airtight container for 2 days.",
    culturalContext: "Khao Soi originates from northern Thailand, influenced by Burmese cuisine through trade routes. The name means 'cut rice,' referring to the way noodles were traditionally cut by hand. It's comfort food for northern Thai families, especially during cooler months."
  },
  {
    id: 'massaman-beef',
    title: 'Massaman Beef Curry',
    cookingTime: '2 hours',
    cookTimeMin: 120,
    prepTimeMin: 20,
    difficulty: 'MEDIUM',
    category: 'WEEKEND',
    contentType: 'MEAT',
    image: '/placeholder.svg',
    mamaId: 3,
    mamaName: 'Yai Malee',
    mamaEmoji: '🌿',
    ingredients: [
      '1kg beef chuck roast, cut in chunks',
      '400ml coconut milk',
      '300ml beef stock',
      '3 tbsp Massaman curry paste',
      '3 medium potatoes, peeled and quartered',
      '1 large onion, cut in wedges',
      '3 tbsp tamarind paste',
      '3 tbsp palm sugar',
      '3 tbsp fish sauce',
      '100g roasted peanuts',
      '4 cardamom pods',
      '2 cinnamon sticks',
      '4 star anise'
    ],
    instructions: [
      'Brown beef chunks in heavy pot until golden on all sides',
      'Add thick coconut cream and Massaman paste, fry until fragrant',
      'Add remaining coconut milk, stock, and whole spices',
      'Simmer covered for 1.5 hours until beef is tender',
      'Add potatoes and onion, cook until vegetables are tender',
      'Stir in peanuts, tamarind paste, palm sugar, and fish sauce',
      'Adjust seasoning and consistency with more stock if needed',
      'Serve with jasmine rice and cucumber salad'
    ],
    servings: 6,
    description: 'Rich, fragrant Persian-influenced curry with tender beef and potatoes',
    voiceIntro: "Sawasdee! Massaman is the gentle curry - rich, fragrant, with Persian influences. Perfect for special occasions!",
    stepVoiceTips: {
      2: "Beef chuck roast is perfect for this - it becomes incredibly tender when slow-cooked",
      3: "Toast your peanuts lightly before adding - brings out more flavor",
      4: "Don't rush the cooking - low and slow makes the beef melt in your mouth",
      5: "Potatoes should be tender but not falling apart - add them later in cooking",
      6: "Tamarind paste adds the perfect sour note - don't skip it!",
      7: "If curry gets too thick, add more coconut milk or beef broth"
    },
    voiceTips: [
      "Beef chuck roast is perfect for this - it becomes incredibly tender when slow-cooked",
      "Toast your peanuts lightly before adding - brings out more flavor",
      "Don't rush the cooking - low and slow makes the beef melt in your mouth",
      "Tamarind paste adds the perfect sour note - don't skip it!",
      "If curry gets too thick, add more coconut milk or beef broth",
      "Potatoes should be tender but not falling apart - add them later in cooking"
    ],
    voiceEnabled: true,
    equipment: ['Heavy-bottomed pot or Dutch oven', 'Wooden spoon', 'Sharp knife', 'Cutting board'],
    storageInstructions: "Massaman curry improves with time and can be refrigerated for up to 5 days. The flavors meld and deepen overnight. Can be frozen for up to 3 months. Reheat gently, adding coconut milk or stock to adjust consistency.",
    culturalContext: "Massaman curry shows the Persian influence on Thai cuisine through ancient trade routes. The name derives from 'Mussulman' (Muslim), reflecting its origins. With warming spices like cardamom and cinnamon, it's considered the most aromatic of Thai curries."
  }
];

// Utility Functions
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
  return recipes.filter(recipe => recipe.category === category.toUpperCase());
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
