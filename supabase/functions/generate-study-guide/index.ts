import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { topic, difficulty, includeExamples } = await req.json();
    
    console.log(`Generating study guide for topic: ${topic}, difficulty: ${difficulty}`);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const systemPrompt = `You are an expert educational content creator. Generate comprehensive study guides that are well-structured, clear, and educational.`;
    
    const userPrompt = `Create a detailed study guide for the topic: "${topic}".

Difficulty level: ${difficulty || 'intermediate'}
${includeExamples ? 'Include practical examples and exercises.' : 'Focus on theoretical concepts.'}

Please structure the guide with:
1. Overview and Learning Objectives
2. Key Concepts (with explanations)
3. Important Terms and Definitions
${includeExamples ? '4. Practical Examples\n5. Practice Exercises' : '4. Summary'}

Make it comprehensive but easy to understand.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const studyGuide = data.choices[0].message.content;

    console.log('Study guide generated successfully');

    return new Response(JSON.stringify({ 
      studyGuide,
      topic,
      difficulty,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-study-guide function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
