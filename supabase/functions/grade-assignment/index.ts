import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId, assignmentTitle, assignmentBrief, maxPoints } = await req.json();
    
    console.log('Grading request received for submission:', submissionId);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the submission file
    const { data: submission, error: submissionError } = await supabase
      .from('assignment_submissions')
      .select('file_path')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission?.file_path) {
      throw new Error('Submission file not found');
    }

    // Download the file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('assignment-submissions')
      .download(submission.file_path);

    if (fileError) {
      throw new Error('Failed to download submission file');
    }

    // Read file content
    const fileContent = await fileData.text();
    
    console.log('File downloaded, sending to AI for grading...');

    // Prepare the grading prompt
    const prompt = `You are an expert assignment grader. Please grade the following student submission carefully and provide detailed feedback.

Assignment Title: ${assignmentTitle}
${assignmentBrief ? `Assignment Brief: ${assignmentBrief}` : ''}
Maximum Points: ${maxPoints}

Student Submission:
${fileContent}

Please provide:
1. A numerical grade out of ${maxPoints} points
2. Detailed feedback explaining the grade (3-5 sentences)
3. Constructive comments on what was done well and what could be improved (2-3 sentences)

Format your response as JSON with the following structure:
{
  "marks": <number>,
  "feedback": "<detailed feedback>",
  "comments": "<constructive comments>"
}`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert assignment grader. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI grading failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    console.log('AI response received:', aiContent);

    // Parse the AI response
    let gradingResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        gradingResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI grading response');
    }

    // Validate the grading result
    if (typeof gradingResult.marks !== 'number' || 
        !gradingResult.feedback || 
        !gradingResult.comments) {
      throw new Error('Invalid grading format from AI');
    }

    // Ensure marks don't exceed max points
    gradingResult.marks = Math.min(gradingResult.marks, maxPoints);

    console.log('Grading completed successfully:', gradingResult);

    return new Response(
      JSON.stringify(gradingResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in grade-assignment function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        marks: null,
        feedback: '',
        comments: ''
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
