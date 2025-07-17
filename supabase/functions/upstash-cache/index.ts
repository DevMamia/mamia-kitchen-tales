import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const upstashUrl = Deno.env.get('UPSTASH_REDIS_REST_URL');
const upstashToken = Deno.env.get('UPSTASH_REDIS_REST_TOKEN');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CacheRequest {
  action: 'get' | 'set' | 'append' | 'clear';
  key: string;
  value?: any;
  ttl?: number; // Time to live in seconds
}

interface ConversationEntry {
  timestamp: number;
  phase: 'pre-cooking' | 'cooking';
  mama: string;
  content: string;
  type: 'user' | 'mama';
}

const makeRedisRequest = async (command: string[]) => {
  const response = await fetch(`${upstashUrl}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${upstashToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Redis error:', errorText);
    throw new Error(`Redis error: ${response.status}`);
  }

  return await response.json();
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, key, value, ttl }: CacheRequest = await req.json();

    if (!action || !key) {
      throw new Error('Missing required fields: action and key');
    }

    console.log(`Redis ${action} operation for key:`, key);

    let result;

    switch (action) {
      case 'get':
        result = await makeRedisRequest(['GET', key]);
        return new Response(JSON.stringify({ 
          data: result.result ? JSON.parse(result.result) : null 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'set':
        if (value === undefined) {
          throw new Error('Value is required for set operation');
        }
        
        const setCommand = ttl 
          ? ['SETEX', key, ttl.toString(), JSON.stringify(value)]
          : ['SET', key, JSON.stringify(value)];
        
        result = await makeRedisRequest(setCommand);
        return new Response(JSON.stringify({ 
          success: result.result === 'OK' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'append':
        if (value === undefined) {
          throw new Error('Value is required for append operation');
        }

        // Get existing data
        const existing = await makeRedisRequest(['GET', key]);
        const currentData = existing.result ? JSON.parse(existing.result) : [];
        
        // Append new entry
        const newEntry: ConversationEntry = {
          timestamp: Date.now(),
          ...value
        };
        
        const updatedData = [...currentData, newEntry];
        
        // Keep only last 50 entries to prevent memory bloat
        const trimmedData = updatedData.slice(-50);
        
        // Save back to Redis with TTL (24 hours for conversation history)
        const appendCommand = ['SETEX', key, (ttl || 86400).toString(), JSON.stringify(trimmedData)];
        result = await makeRedisRequest(appendCommand);
        
        return new Response(JSON.stringify({ 
          success: result.result === 'OK',
          entries: trimmedData.length
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'clear':
        result = await makeRedisRequest(['DEL', key]);
        return new Response(JSON.stringify({ 
          success: result.result === 1 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Unsupported action: ${action}`);
    }

  } catch (error) {
    console.error('Error in upstash-cache function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
