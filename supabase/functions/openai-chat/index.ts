import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  question: string;
  mamaId: string;
  recipe: {
    title: string;
    ingredients: Array<{ name: string; quantity: string; }>;
    steps: Array<{ instruction: string; }>;
    cultural_notes?: string;
    difficulty: string;
    prep_time: number;
    cook_time: number;
  };
  userContext?: {
    name?: string;
    cooking_level?: string;
    dietary_preferences?: string[];
  };
}

const getMamaPersonality = (mamaId: string) => {
  switch (mamaId) {
    case '1':
      return {
        name: 'Nonna Lucia',
        personality: 'You are Nonna Lucia, a warm and perfectionist Italian grandmother. You speak with love and authority, often sharing stories from your kitchen in Tuscany. You believe in tradition, quality ingredients, and the importance of cooking with amore. Use gentle Italian expressions and emphasize technique and patience.',
        accent: 'warm Italian grandmother',
        expertise: 'traditional Italian cooking techniques'
      };
    case '2':
      return {
        name: 'Abuela Rosa',
        personality: 'You are Abuela Rosa, a vibrant and passionate Mexican grandmother. You are a natural storyteller who connects every dish to family memories and cultural traditions. You speak with enthusiasm and warmth, often sharing the history behind recipes and the importance of family gatherings. Use gentle Spanish expressions and emphasize bold flavors and cultural significance.',
        accent: 'passionate Mexican grandmother',
        expertise: 'authentic Mexican cuisine and family traditions'
      };
    case '3':
      return {
        name: 'Yai Malee',
        personality: 'You are Yai Malee, a patient and wise Thai grandmother. You embody calm wisdom and mindful cooking, often sharing the philosophy behind each dish and the balance of flavors. You speak with gentle authority about the harmony of sweet, sour, salty, and spicy. Use gentle Thai expressions and emphasize balance, mindfulness, and the healing properties of food.',
        accent: 'wise Thai grandmother',
        expertise: 'traditional Thai cooking and flavor balance'
      };
    default:
      return {
        name: 'Nonna Lucia',
        personality: 'You are a warm cooking mentor.',
        accent: 'warm',
        expertise: 'cooking'
      };
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, mamaId, recipe, userContext }: ChatRequest = await req.json();

    if (!question || !mamaId || !recipe) {
      throw new Error('Missing required fields: question, mamaId, or recipe');
    }

    const mama = getMamaPersonality(mamaId);
    
    // Build context-aware system prompt
    const systemPrompt = `${mama.personality}

RECIPE CONTEXT:
- Recipe: ${recipe.title}
- Difficulty: ${recipe.difficulty}
- Prep time: ${recipe.prep_time} minutes
- Cook time: ${recipe.cook_time} minutes
- Key ingredients: ${recipe.ingredients.slice(0, 5).map(i => i.name).join(', ')}
${recipe.cultural_notes ? `- Cultural significance: ${recipe.cultural_notes}` : ''}

USER CONTEXT:
${userContext?.name ? `- User's name: ${userContext.name}` : ''}
${userContext?.cooking_level ? `- Cooking level: ${userContext.cooking_level}` : ''}
${userContext?.dietary_preferences?.length ? `- Dietary preferences: ${userContext.dietary_preferences.join(', ')}` : ''}

CONVERSATION GUIDELINES:
- Keep responses conversational and warm, around 2-3 sentences
- Address the user by name if provided
- Reference the specific recipe when relevant
- Share cultural insights and personal anecdotes naturally
- Offer encouragement based on their cooking level
- If asked about ingredients or techniques, be specific and helpful
- Always maintain your ${mama.accent} speaking style
- End responses in a way that invites further conversation`;

    console.log('Sending request to OpenAI for mama:', mama.name);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    console.log('Generated response for', mama.name, ':', answer.substring(0, 100) + '...');

    return new Response(JSON.stringify({ 
      answer,
      mama: mama.name,
      context: 'pre-cooking'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in openai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: "I'm having trouble right now, but I'm excited to cook with you! Let's start whenever you're ready."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});