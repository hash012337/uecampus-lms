import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Article id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`Fetching Dev.to article with id: ${id}`);

    const apiUrl = `https://dev.to/api/articles/${id}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Dev.to article API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch article from Dev.to" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const article = await response.json();

    const payload = {
      id: article.id,
      title: article.title,
      description: article.description ?? "",
      url: article.url,
      body_html: article.body_html ?? "",
      published_at: article.published_at,
      tags: article.tag_list ?? [],
      reading_time_minutes: article.reading_time_minutes ?? 5,
      user: {
        name: article.user?.name ?? "Unknown",
        username: article.user?.username ?? "",
      },
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in fetch-devto-article function:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unexpected error fetching article",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
