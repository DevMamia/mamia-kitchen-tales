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

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log('Client WebSocket connected, setting up ElevenLabs relay...');

  let elevenLabsSocket: WebSocket | null = null;
  let isConnected = false;

  // Setup ping interval to keep connection alive
  const pingInterval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' }));
    }
  }, 25000);

  socket.onopen = () => {
    console.log('Client socket opened');
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Received from client:', message.type);

      if (message.type === 'init') {
        // Initialize connection to ElevenLabs
        const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
        if (!apiKey) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'ElevenLabs API key not configured'
          }));
          return;
        }

        // Connect to ElevenLabs Conversational AI
        elevenLabsSocket = new WebSocket('wss://api.elevenlabs.io/v1/convai/conversation', {
          headers: {
            'xi-api-key': apiKey
          }
        });

        elevenLabsSocket.onopen = () => {
          console.log('Connected to ElevenLabs');
          isConnected = true;
          
          // Send initialization message to ElevenLabs
          elevenLabsSocket?.send(JSON.stringify({
            type: 'conversation_initiation_metadata',
            conversation_config_override: {
              agent: {
                prompt: {
                  prompt: `You are ${message.mamaId === 'nonna' ? 'Nonna Lucia' : message.mamaId === 'abuela' ? 'Abuela Rosa' : 'Mae Malai'}, an experienced cooking mentor helping with recipe: \"${message.stepText}\". Be warm, encouraging, and give helpful cooking advice. Keep responses concise and natural.`
                },
                language: 'en'
              },
              tts: {
                voice_id: message.voiceId
              }
            }
          }));

          socket.send(JSON.stringify({
            type: 'connected'
          }));
        };

        elevenLabsSocket.onmessage = (elevenEvent) => {
          try {
            const data = JSON.parse(elevenEvent.data);
            console.log('ElevenLabs message type:', data.type);
            
            // Forward all messages to client
            socket.send(elevenEvent.data);
          } catch (error) {
            console.error('Error parsing ElevenLabs message:', error);
          }
        };

        elevenLabsSocket.onerror = (error) => {
          console.error('ElevenLabs WebSocket error:', error);
          socket.send(JSON.stringify({
            type: 'error',
            message: 'ElevenLabs connection failed'
          }));
        };

        elevenLabsSocket.onclose = () => {
          console.log('ElevenLabs connection closed');
          isConnected = false;
          socket.send(JSON.stringify({
            type: 'disconnected'
          }));
        };

      } else if (message.type === 'user_message' && elevenLabsSocket && isConnected) {
        // Forward user messages to ElevenLabs
        elevenLabsSocket.send(JSON.stringify({
          type: 'user_message',
          message: message.text
        }));
      }

    } catch (error) {
      console.error('Error processing client message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  };

  socket.onclose = () => {
    console.log('Client disconnected');
    clearInterval(pingInterval);
    if (elevenLabsSocket) {
      elevenLabsSocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error('Client WebSocket error:', error);
    clearInterval(pingInterval);
    if (elevenLabsSocket) {
      elevenLabsSocket.close();
    }
  };

  return response;
});
