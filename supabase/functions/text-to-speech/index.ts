import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TextToSpeechRequest {
  text: string;
  voiceId: string;
  model?: string;
  stability?: number;
  similarity_boost?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[TTS] Request received:', req.method);
    
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('[TTS] Request body parsed:', { 
        textLength: requestBody.text?.length, 
        voiceId: requestBody.voiceId,
        model: requestBody.model 
      });
    } catch (parseError) {
      console.error('[TTS] Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { text, voiceId, model = "eleven_multilingual_v2", stability = 0.5, similarity_boost = 0.75 }: TextToSpeechRequest = requestBody;

    // Validate required fields
    if (!text || !voiceId) {
      console.error('[TTS] Missing required fields:', { hasText: !!text, hasVoiceId: !!voiceId });
      return new Response(
        JSON.stringify({ error: 'Text and voiceId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate text length (ElevenLabs has limits)
    if (text.length > 5000) {
      console.error('[TTS] Text too long:', text.length);
      return new Response(
        JSON.stringify({ error: 'Text too long (max 5000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      console.error('[TTS] ElevenLabs API key not configured');
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[TTS] Generating speech for voice ${voiceId}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

    // Add timeout to ElevenLabs request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability,
            similarity_boost,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`[TTS] ElevenLabs response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[TTS] ElevenLabs API error:', response.status, errorText);
        return new Response(
          JSON.stringify({ 
            error: `ElevenLabs API error: ${response.status}`,
            details: errorText 
          }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const audioBuffer = await response.arrayBuffer();
      console.log(`[TTS] Audio buffer received: ${audioBuffer.byteLength} bytes`);

      if (audioBuffer.byteLength === 0) {
        console.error('[TTS] Empty audio buffer received');
        return new Response(
          JSON.stringify({ error: 'Empty audio buffer received from ElevenLabs' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
      console.log(`[TTS] Successfully generated ${audioBuffer.byteLength} bytes of audio, base64 length: ${base64Audio.length}`);

      return new Response(
        JSON.stringify({ 
          audioData: base64Audio,
          contentType: 'audio/mpeg'
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );

    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('[TTS] Request timeout');
        return new Response(
          JSON.stringify({ error: 'Request timeout' }),
          { status: 408, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Text-to-speech function error:', error);
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