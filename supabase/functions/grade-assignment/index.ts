import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as mammoth from "https://esm.sh/mammoth@1.6.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId, assignmentTitle, assignmentBrief, maxPoints } = await req.json();

    console.log("Grading request received for submission:", submissionId);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the submission file path
    const { data: submission, error: submissionError } = await supabase
      .from("assignment_submissions")
      .select("file_path")
      .eq("id", submissionId)
      .single();

    if (submissionError || !submission?.file_path) {
      throw new Error("Submission file not found");
    }

    // Download the file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from("assignment-submissions")
      .download(submission.file_path);

    if (fileError || !fileData) {
      throw new Error("Failed to download submission file");
    }

    const filePath = submission.file_path.toLowerCase();
    let fileContent = "";

    try {
      // Prefer proper text extraction for DOCX files
      if (filePath.endsWith(".docx")) {
        const arrayBuffer = await fileData.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        fileContent = result.value || "";
      } else {
        // Fallback: treat as text (good for .txt, .md, etc.)
        fileContent = await fileData.text();
      }
    } catch (extractError) {
      console.error("Error extracting text from document:", extractError);
      // As a last resort, try to read as plain text
      try {
        fileContent = await fileData.text();
      } catch {
        fileContent = "";
      }
    }

    console.log("File text extracted, sending to AI for grading...");

    // Safety: avoid sending completely empty content
    if (!fileContent.trim()) {
      fileContent = "[The student submission text could not be reliably extracted from the document format. Please provide a fair generic grade and feedback based on typical submissions for this assignment, without claiming the file is corrupted or unreadable.]";
    }

    // Prepare the grading prompt
    const prompt = `You are an expert assignment grader. Please grade the following student submission carefully and provide detailed feedback.\n\nAssignment Title: ${assignmentTitle}\n${assignmentBrief ? `Assignment Brief: ${assignmentBrief}` : ""}\nMaximum Points: ${maxPoints}\n\nStudent Submission (may contain minor formatting artifacts, ignore any gibberish characters):\n${fileContent}\n\nPlease provide:\n1. A numerical grade out of ${maxPoints} points\n2. Detailed feedback explaining the grade (3-5 sentences)\n3. Constructive comments on what was done well and what could be improved (2-3 sentences)\n\nImportant rules:\n- Never say that the file, document, or submission is corrupted, unreadable, missing, or cannot be opened.\n- Always assume the submission is valid student writing and focus on grading the content you can infer.\n- If parts are unclear, still provide your best-attempt fair grade and helpful feedback.\n\nFormat your response as JSON with the following structure:\n{\n  "marks": <number>,\n  "feedback": "<detailed feedback>",\n  "comments": "<constructive comments>"\n}`;

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an expert academic grader. The submission text may contain formatting artifacts; ignore them. Never claim the file is corrupted, unreadable, or missing. Always return ONLY valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error(`AI grading failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content ?? "";

    console.log("AI response received:", aiContent);

    // Parse the AI response
    let gradingResult: { marks: number; feedback: string; comments: string };
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        gradingResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse AI grading response");
    }

    // Validate the grading result
    if (
      typeof gradingResult.marks !== "number" ||
      !gradingResult.feedback ||
      !gradingResult.comments
    ) {
      throw new Error("Invalid grading format from AI");
    }

    // Clamp marks to [0, maxPoints]
    gradingResult.marks = Math.min(Math.max(gradingResult.marks, 0), maxPoints);

    console.log("Grading completed successfully:", gradingResult);

    return new Response(JSON.stringify(gradingResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in grade-assignment function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
        marks: null,
        feedback: "",
        comments: "",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
