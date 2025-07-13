import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Return the voice IDs from environment variables
    const voiceIds = {
      ELEVENLABS_NONNA_VOICE_ID: Deno.env.get('ELEVENLABS_NONNA_VOICE_ID'),
      ELEVENLABS_ABUELA_VOICE_ID: Deno.env.get('ELEVENLABS_ABUELA_VOICE_ID'),
      ELEVENLABS_MAE_VOICE_ID: Deno.env.get('ELEVENLABS_MAE_VOICE_ID')
    };

    return new Response(
      JSON.stringify(voiceIds),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Get voice IDs function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});