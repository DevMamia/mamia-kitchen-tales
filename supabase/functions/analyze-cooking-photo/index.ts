
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image, recipeContext } = await req.json()
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = generateAnalysisPrompt(recipeContext)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are ${getMamaPersonality(recipeContext.mamaId).name}, an experienced cooking instructor. Analyze cooking photos with cultural authenticity and provide encouraging, personalized feedback in your cultural style.`
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: image } }
            ]
          }
        ],
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const analysis = parseAnalysisResponse(data.choices[0].message.content, recipeContext)

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in analyze-cooking-photo:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      overallScore: 7,
      visualAppeal: 7,
      culturalAuthenticity: 8,
      techniqueAssessment: "Looking good! Keep up the great work!",
      improvementSuggestions: ["Continue with confidence!", "Trust the process"]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function generateAnalysisPrompt(recipeContext: any): string {
  return `Analyze this cooking photo for the recipe "${recipeContext.recipeName}" at step ${recipeContext.currentStep}.

Please evaluate:
1. Visual appeal (1-10)
2. Technique execution 
3. Cultural authenticity (1-10)
4. Overall impression (1-10)

Provide your response in this JSON format:
{
  "overallScore": number,
  "visualAppeal": number,
  "culturalAuthenticity": number,
  "techniqueAssessment": "brief assessment",
  "improvementSuggestions": ["tip1", "tip2"],
  "achievementUnlocked": "achievement name or null"
}

Be encouraging and culturally authentic in your assessment. Focus on progress and learning rather than perfection.`
}

function getMamaPersonality(mamaId: string) {
  const personalities = {
    'nonna_lucia': { name: 'Nonna Lucia', culture: 'Italian' },
    'abuela_rosa': { name: 'Abuela Rosa', culture: 'Mexican' },
    'yai_malee': { name: 'Yai Malee', culture: 'Thai' }
  }
  return personalities[mamaId] || personalities['nonna_lucia']
}

function parseAnalysisResponse(content: string, recipeContext: any) {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.error('Error parsing analysis response:', error)
  }

  // Fallback response
  return {
    overallScore: 7,
    visualAppeal: 7,
    culturalAuthenticity: 8,
    techniqueAssessment: "Looking great! You're making good progress.",
    improvementSuggestions: ["Keep up the excellent work!", "Trust your instincts"],
    achievementUnlocked: null
  }
}
