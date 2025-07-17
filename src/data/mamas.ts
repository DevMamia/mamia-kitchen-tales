export interface Mama {
  id: number;
  name: string;
  emoji: string;
  accent: string;
  voiceId: string;
  themeColor: string;
  country: string;
  specialties: string[];
  philosophy: string;
  signatureDish: string;
  cookbookTitle: string;
  avatar: string;
}

export const mamas: Mama[] = [
  {
    id: 1,
    name: 'Nonna Lucia',
    emoji: '🍷',
    accent: 'Italian',
    voiceId: 'nonna_lucia', // Will map to VITE_NONNA_VOICE_ID
    themeColor: 'hsl(25, 82%, 65%)', // Warm Italian orange
    country: 'Italy',
    specialties: ['Pasta', 'Risotto', 'Tiramisu'],
    philosophy: 'Cooking is an act of love, passed down through generations.',
    signatureDish: 'Carbonara della Nonna',
    cookbookTitle: 'Nonna\'s Kitchen Secrets',
    avatar: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Abuela Rosa',
    emoji: '🌶️',
    accent: 'Mexican',
    voiceId: 'abuela_rosa', // Will map to VITE_ABUELA_VOICE_ID
    themeColor: 'hsl(350, 80%, 60%)', // Vibrant Mexican red
    country: 'Mexico',
    specialties: ['Mole', 'Tamales', 'Chiles Rellenos'],
    philosophy: 'Each spice tells a story, each dish carries our history.',
    signatureDish: 'Mole Negro Oaxaqueño',
    cookbookTitle: 'Sabores de Mi Tierra',
    avatar: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Yai Malee',
    emoji: '🌿',
    accent: 'Thai',
    voiceId: 'yai_malee', // Will map to ELEVENLABS_YAI_VOICE_ID
    themeColor: 'hsl(120, 60%, 50%)', // Fresh Thai green
    country: 'Thailand',
    specialties: ['Curry', 'Pad Thai', 'Som Tam'],
    philosophy: 'Balance is everything - sweet, sour, salty, spicy in harmony.',
    signatureDish: 'Green Curry with Thai Basil',
    cookbookTitle: 'Flavors of Siam',
    avatar: '/placeholder.svg'
  }
];

export const getMamaById = (id: number): Mama | undefined => {
  return mamas.find(mama => mama.id === id);
};

export const getMamaByVoiceId = (voiceId: string): Mama | undefined => {
  return mamas.find(mama => mama.voiceId === voiceId);
};