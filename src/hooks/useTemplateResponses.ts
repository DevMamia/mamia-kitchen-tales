import { useCallback } from 'react';
import { Recipe } from '@/data/recipes';

interface TemplateResponse {
  pattern: RegExp;
  responses: string[];
}

export const useTemplateResponses = () => {
  const italianResponses: TemplateResponse[] = [
    {
      pattern: /hello|hi|ciao|hey/i,
      responses: [
        "Ciao bella! Welcome to my kitchen!",
        "Buongiorno tesoro! Ready to cook together?",
        "Ciao! Come here, let Nonna teach you something special!"
      ]
    },
    {
      pattern: /never|first time|beginner|new/i,
      responses: [
        "Perfetto! I love teaching new cooks. Don't worry, we'll take it piano piano.",
        "Magnifico! Everyone starts somewhere. My nonna taught me, now I teach you!",
        "Bene! First time is always special. Just follow Nonna's instructions, sì?"
      ]
    },
    {
      pattern: /difficult|hard|scared|worried/i,
      responses: [
        "Eh, no worries! This recipe is like riding a bicycle - once you know, you never forget!",
        "Madonna mia, don't be scared! I've been making this for 50 years, I guide you!",
        "Listen to me, cara - cooking is about amore, not perfection. We'll do it together!"
      ]
    },
    {
      pattern: /ingredients|what.*need|shopping/i,
      responses: [
        "Ah, bene! Let me tell you about the ingredients. Each one has a purpose, like musicians in an orchestra!",
        "The secret is good ingredients - I always say, garbage in, garbage out!",
        "Quality ingredients make all the difference. Find good olive oil, fresh herbs - your taste buds will thank you!"
      ]
    },
    {
      pattern: /why|story|family|tradition/i,
      responses: [
        "Ah, this recipe! It comes from my nonna's nonna. Every time I make it, I remember her hands teaching mine.",
        "This dish has history, cara. In our famiglia, we pass recipes like treasures from mother to daughter.",
        "You know, this recipe saved my family during hard times. Simple ingredients, but made with amore!"
      ]
    }
  ];

  const mexicanResponses: TemplateResponse[] = [
    {
      pattern: /hello|hi|hola|hey/i,
      responses: [
        "¡Hola mija! Welcome to Abuela's cocina!",
        "¡Buenos días mi amor! Ready to cook with your abuela?",
        "¡Órale! Come here, let me show you how we do it in our familia!"
      ]
    },
    {
      pattern: /never|first time|beginner|new/i,
      responses: [
        "¡Qué bueno! I love teaching mis nietos. Don't worry, we'll go poquito a poquito.",
        "Perfect! Everyone in our familia learns to cook. Today you become part of the tradition!",
        "¡Excelente! First time is special. Just listen to your abuela, ¿sí?"
      ]
    },
    {
      pattern: /spicy|hot|picante/i,
      responses: [
        "¡Ay, mija! Don't worry about the spice - we can adjust it to your taste. Start small!",
        "The chile gives life to the food! But if you're not ready, we use less. You'll build up tolerance!",
        "In our familia, we say 'sin chile no hay sabor' - but we start gentle with the newcomers!"
      ]
    },
    {
      pattern: /ingredients|what.*need|shopping/i,
      responses: [
        "¡Perfecto! The ingredients tell a story of our tierra. Each one brings tradition to your plate.",
        "Good ingredients are like good friends - they never let you down! Let me explain each one.",
        "Quality matters, mija. Find good chiles, fresh cilantro - these make the difference!"
      ]
    },
    {
      pattern: /family|tradition|story|why/i,
      responses: [
        "Ay, this recipe... it's from mi bisabuela. Every generation adds their own touch, but the heart stays the same.",
        "In our familia, food is love. When you cook this, you're connecting with generations of mujeres fuertes.",
        "This dish fed our family through celebrations and hard times. It's more than food - it's our historia!"
      ]
    }
  ];

  const thaiResponses: TemplateResponse[] = [
    {
      pattern: /hello|hi|sawasdee|hey/i,
      responses: [
        "Sawasdee ka! Welcome to my kitchen, darling!",
        "Hello dear! Come, let me teach you the way of Thai cooking!",
        "Sabai sabai! Relax and let's cook together with mindfulness!"
      ]
    },
    {
      pattern: /never|first time|beginner|new/i,
      responses: [
        "Beautiful! Like a lotus learning to bloom. We take our time, no rush.",
        "Perfect! In Thailand, we believe cooking is meditation. Let your heart guide your hands.",
        "Wonderful! Every master was once a student. Today we plant the seeds of knowledge!"
      ]
    },
    {
      pattern: /spicy|hot|balance/i,
      responses: [
        "Ah, balance! This is the heart of Thai cooking - sweet, sour, salty, spicy in harmony.",
        "Like life, darling - sometimes you need the heat to appreciate the sweet. We'll find your perfect balance.",
        "Thai food is like music - each flavor plays its part in the symphony. We'll tune it to your taste!"
      ]
    },
    {
      pattern: /ingredients|what.*need|herbs/i,
      responses: [
        "Each ingredient is chosen with purpose, like selecting the right word for a poem.",
        "Fresh herbs are the soul of Thai cooking. When you smell them, you understand Thailand.",
        "These ingredients have been friends in Thai kitchens for centuries. Let me introduce you!"
      ]
    },
    {
      pattern: /why|tradition|story|culture/i,
      responses: [
        "This recipe carries the wisdom of my grandmother's village. Each bite connects you to our beautiful land.",
        "In Thailand, we cook with gratitude - for the earth, the farmers, the hands that grew our food.",
        "Food is how we share love in Thai culture. When you cook this, you're creating happiness for others!"
      ]
    }
  ];

  const getCulturalGreeting = useCallback((accent: string, recipeName: string) => {
    switch (accent.toLowerCase()) {
      case 'italian':
        return `Ciao bella! Today we make my beautiful ${recipeName}. Come, sit with Nonna and let me tell you about this special dish from my famiglia!`;
      case 'mexican':
        return `¡Hola mija! Welcome to my cocina! Today we're making ${recipeName} - a recipe that's been in our familia for generations. ¿Estás lista?`;
      case 'thai':
        return `Sawasdee ka, darling! Today we create ${recipeName} together. In Thailand, we cook with love and mindfulness. Let's begin this beautiful journey!`;
      default:
        return `Hello! Ready to cook ${recipeName} together? Let me guide you through this wonderful recipe!`;
    }
  }, []);

  const getTemplateResponse = useCallback((input: string, accent: string, recipe: Recipe) => {
    const responses = accent.toLowerCase() === 'italian' ? italianResponses :
                     accent.toLowerCase() === 'mexican' ? mexicanResponses :
                     accent.toLowerCase() === 'thai' ? thaiResponses : 
                     italianResponses; // default

    for (const template of responses) {
      if (template.pattern.test(input)) {
        const randomResponse = template.responses[Math.floor(Math.random() * template.responses.length)];
        return randomResponse;
      }
    }

    // Default responses when no pattern matches
    const defaultResponses = {
      italian: [
        "Interessante! Tell me more about what you want to know, cara mia.",
        "Sì, sì! I understand. Let me think how to explain this best...",
        "Ah, good question! In my kitchen, we always say..."
      ],
      mexican: [
        "¡Órale! That's a good question, mija. Let me share what I know...",
        "¡Perfecto! I love when you ask questions. That's how we learn!",
        "¡Excelente! In our familia, we always say..."
      ],
      thai: [
        "Beautiful question, darling! Let me share some wisdom with you...",
        "Ah, I see! Like the river finding its way, understanding comes slowly but surely.",
        "Wonderful curiosity! In Thailand, we believe..."
      ]
    };

    const accentKey = accent.toLowerCase() as keyof typeof defaultResponses;
    const defaults = defaultResponses[accentKey] || defaultResponses.italian;
    return defaults[Math.floor(Math.random() * defaults.length)];
  }, []);

  return {
    getCulturalGreeting,
    getTemplateResponse
  };
};