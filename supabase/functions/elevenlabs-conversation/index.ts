import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');

// Voice IDs for each mama - support both numeric and string IDs
const VOICE_IDS = {
  '1': Deno.env.get('ELEVENLABS_NONNA_VOICE_ID'), // Nonna Lucia
  '2': Deno.env.get('ELEVENLABS_ABUELA_VOICE_ID'), // Abuela Rosa  
  '3': Deno.env.get('ELEVENLABS_YAI_VOICE_ID'), // Yai Malee
  // String ID aliases
  'nonna_lucia': Deno.env.get('ELEVENLABS_NONNA_VOICE_ID'),
  'abuela_rosa': Deno.env.get('ELEVENLABS_ABUELA_VOICE_ID'),
  'yai_malee': Deno.env.get('ELEVENLABS_YAI_VOICE_ID'),
};

// Helper function to resolve mama ID to numeric format
const resolveMamaId = (mamaId: string): string => {
  // Map string IDs to numeric IDs for configuration
  const stringToNumeric: Record<string, string> = {
    'nonna_lucia': '1',
    'abuela_rosa': '2', 
    'yai_malee': '3'
  };
  
  return stringToNumeric[mamaId] || mamaId;
};

interface ConversationRequest {
  action: 'create-agent' | 'generate-url';
  mamaId: string;
  recipe?: {
    title: string;
    steps: Array<{ instruction: string; }>;
    ingredients: Array<{ name: string; quantity: string; }>;
    cultural_notes?: string;
  };
  currentStep?: number;
  userContext?: {
    name?: string;
    cooking_level?: string;
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getMamaAgentConfig = (mamaId: string, recipe?: any, userContext?: any) => {
  // First try to get voice ID directly, then try resolved ID
  let voiceId = VOICE_IDS[mamaId as keyof typeof VOICE_IDS];
  
  if (!voiceId) {
    const resolvedId = resolveMamaId(mamaId);
    voiceId = VOICE_IDS[resolvedId as keyof typeof VOICE_IDS];
  }
  
  if (!voiceId) {
    throw new Error(`Voice ID not found for mama ${mamaId} (resolved: ${resolveMamaId(mamaId)})`);
  }

  // Use resolved numeric ID for configuration lookup
  const configId = resolveMamaId(mamaId);

  const baseConfigs = {
    '1': { // Nonna Lucia
      name: 'Nonna Lucia - Italian Cooking Guide',
      system_prompt: `You are Nonna Lucia, a warm and perfectionist Italian grandmother guiding someone through cooking. You speak with love and gentle authority, using occasional Italian expressions. You emphasize technique, patience, and cooking with amore.

COOKING GUIDANCE RULES:
- Give clear, step-by-step instructions
- Offer encouragement and gentle corrections
- Share brief Italian cooking wisdom when relevant
- Help with timing, technique questions, and ingredient substitutions
- Use phrases like "Bene bene!" for encouragement
- Always maintain your warm, nurturing Italian grandmother personality

VOICE COMMANDS TO RECOGNIZE:
- "next step" or "avanti" → move to next cooking step
- "repeat" or "ripeti" → repeat current instruction
- "help" or "aiuto" → offer cooking assistance
- "timer" → help with timing
- "how much" → clarify quantities

Keep responses conversational, warm, and focused on cooking guidance.`,
      first_message: "Ciao bella! Nonna Lucia is here to cook with you. I'm so excited to guide you through this beautiful recipe!"
    },
    '2': { // Abuela Rosa  
      name: 'Abuela Rosa - Mexican Cooking Guide',
      system_prompt: `You are Abuela Rosa, a vibrant and passionate Mexican grandmother guiding someone through cooking. You speak with enthusiasm and warmth, sharing the cultural significance of dishes and using gentle Spanish expressions.

COOKING GUIDANCE RULES:
- Give clear, step-by-step instructions with passion
- Share the cultural story behind techniques when relevant  
- Offer encouragement with phrases like "¡Muy bien!" and "¡Perfecto!"
- Help with timing, spice levels, and traditional techniques
- Connect cooking to family and tradition
- Always maintain your vibrant, storytelling Mexican grandmother personality

VOICE COMMANDS TO RECOGNIZE:
- "next step" or "siguiente" → move to next cooking step
- "repeat" or "repite" → repeat current instruction  
- "help" or "ayuda" → offer cooking assistance
- "timer" → help with timing
- "how much" → clarify quantities

Keep responses enthusiastic, warm, and rich with cultural connection.`,
      first_message: "¡Hola mi amor! Abuela Rosa is here to cook with you. Let's create something delicious together with love and tradition!"
    },
    '3': { // Yai Malee
      name: 'Yai Malee - Thai Cooking Guide', 
      system_prompt: `You are Yai Malee, a patient and wise Thai grandmother guiding someone through cooking. You embody calm wisdom and mindful cooking, emphasizing the balance of flavors and the healing properties of food.

COOKING GUIDANCE RULES:
- Give clear, mindful step-by-step instructions
- Emphasize the balance of sweet, sour, salty, and spicy
- Share wisdom about ingredient harmony when relevant
- Offer gentle encouragement and guidance
- Help with timing, flavor balance, and traditional techniques  
- Use gentle Thai expressions like "dee maak" (very good)
- Always maintain your wise, patient Thai grandmother personality

VOICE COMMANDS TO RECOGNIZE:
- "next step" → move to next cooking step
- "repeat" → repeat current instruction
- "help" → offer cooking assistance  
- "timer" → help with timing
- "how much" → clarify quantities
- "taste" → guidance on flavor balance

Keep responses calm, wise, and focused on mindful cooking.`,
      first_message: "Sawasdee ka! Yai Malee is here to guide you through this beautiful recipe. Let's cook together with mindfulness and joy!"
    }
  };

  const config = baseConfigs[configId as keyof typeof baseConfigs];
  if (!config) {
    throw new Error(`Configuration not found for mama ${mamaId} (resolved: ${configId})`);
  }

  // Add recipe context if provided
  let enhancedPrompt = config.system_prompt;
  if (recipe) {
    enhancedPrompt += `\n\nRECIPE CONTEXT:
- Recipe: ${recipe.title}
- Steps: ${recipe.steps.length} total steps
- Key ingredients: ${recipe.ingredients.slice(0, 5).map((i: any) => i.name).join(', ')}
${recipe.cultural_notes ? `- Cultural notes: ${recipe.cultural_notes}` : ''}

Focus on guiding through this specific recipe with your expertise.`;
  }

  // Add user context if provided
  if (userContext?.name) {
    enhancedPrompt += `\n\nUSER: You're cooking with ${userContext.name}${userContext.cooking_level ? `, who is a ${userContext.cooking_level} cook` : ''}.`;
  }

  return {
    name: config.name,
    system_prompt: enhancedPrompt,
    first_message: config.first_message,
    voice_id: voiceId,
    language: 'en'
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, mamaId, recipe, userContext }: ConversationRequest = await req.json();

    if (!action || !mamaId) {
      throw new Error('Missing required fields: action and mamaId');
    }

    console.log(`ElevenLabs conversation ${action} for mama:`, mamaId);

    if (action === 'create-agent') {
      const agentConfig = getMamaAgentConfig(mamaId, recipe, userContext);
      
      const response = await fetch('https://api.elevenlabs.io/v1/convai/agents', {
        method: 'POST',
        headers: {
          'xi-api-key': elevenLabsApiKey!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: agentConfig.name,
          prompt: {
            prompt: agentConfig.system_prompt
          },
          first_message: agentConfig.first_message,
          language: agentConfig.language,
          tts: {
            voice_id: agentConfig.voice_id
          },
          conversation_config: {
            turn_detection: {
              type: 'server_vad'
            }
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs agent creation error:', errorText);
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const agent = await response.json();
      console.log('Created ElevenLabs agent:', agent.agent_id);

      return new Response(JSON.stringify({ 
        agentId: agent.agent_id,
        name: agentConfig.name
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'generate-url') {
      const { agentId } = await req.json();
      
      if (!agentId) {
        throw new Error('Agent ID is required for URL generation');
      }

      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': elevenLabsApiKey!,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs URL generation error:', errorText);
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const urlData = await response.json();
      console.log('Generated conversation URL for agent:', agentId);

      return new Response(JSON.stringify({ 
        signedUrl: urlData.signed_url
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unsupported action: ${action}`);

  } catch (error) {
    console.error('Error in elevenlabs-conversation function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});