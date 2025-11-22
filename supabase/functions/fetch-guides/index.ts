import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
  url: string;
}

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  coverImage?: string;
  url: string;
  publishedAt: string;
  tags: string[];
  readingTimeMinutes: number;
  user: {
    name: string;
    username: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, maxResults = 10 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Fetching guides for query: "${query}"`);

    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");

    // Fetch from both APIs concurrently
    const [youtubeResults, devToResults] = await Promise.all([
      fetchYouTubeVideos(query, maxResults, YOUTUBE_API_KEY),
      fetchDevToArticles(query, maxResults),
    ]);

    console.log(
      `Found ${youtubeResults.length} YouTube videos and ${devToResults.length} Dev.to articles`
    );

    return new Response(
      JSON.stringify({
        youtube: youtubeResults,
        devto: devToResults,
        total: youtubeResults.length + devToResults.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in fetch-guides function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function fetchYouTubeVideos(
  query: string,
  maxResults: number,
  apiKey: string | undefined
): Promise<YouTubeVideo[]> {
  if (!apiKey) {
    console.warn("YouTube API key not configured, skipping YouTube results");
    return [];
  }

  try {
    console.log("Fetching from YouTube Data API...");

    // Search for educational/tutorial videos
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set("q", `${query} tutorial education`);
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("maxResults", Math.min(maxResults, 25).toString());
    searchUrl.searchParams.set("order", "relevance");
    searchUrl.searchParams.set("videoDefinition", "high");
    searchUrl.searchParams.set("key", apiKey);

    const searchResponse = await fetch(searchUrl.toString());

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error("YouTube API error:", searchResponse.status, errorText);
      return [];
    }

    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    // Get video details (duration, views) for all videos
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",");
    const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    detailsUrl.searchParams.set("part", "contentDetails,statistics");
    detailsUrl.searchParams.set("id", videoIds);
    detailsUrl.searchParams.set("key", apiKey);

    const detailsResponse = await fetch(detailsUrl.toString());
    const detailsData = detailsResponse.ok ? await detailsResponse.json() : { items: [] };

    const detailsMap = new Map(
      detailsData.items?.map((item: any) => [item.id, item]) || []
    );

    return searchData.items.map((item: any) => {
      const details: any = detailsMap.get(item.id.videoId);
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: details?.contentDetails?.duration || "",
        viewCount: details?.statistics?.viewCount || "0",
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      };
    });
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}

async function fetchDevToArticles(
  query: string,
  maxResults: number
): Promise<DevToArticle[]> {
  try {
    console.log("Fetching from Dev.to API...");

    const url = new URL("https://dev.to/api/articles");
    url.searchParams.set("tag", query.toLowerCase().replace(/\s+/g, ""));
    url.searchParams.set("per_page", Math.min(maxResults, 30).toString());
    url.searchParams.set("top", "7"); // Get top articles from past week

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Dev.to API error:", response.status, errorText);
      return [];
    }

    const articles = await response.json();

    if (!Array.isArray(articles) || articles.length === 0) {
      return [];
    }

    return articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      description: article.description || "",
      coverImage: article.cover_image || article.social_image,
      url: article.url,
      publishedAt: article.published_at,
      tags: article.tag_list || [],
      readingTimeMinutes: article.reading_time_minutes || 5,
      user: {
        name: article.user?.name || "Unknown",
        username: article.user?.username || "",
      },
    }));
  } catch (error) {
    console.error("Error fetching Dev.to articles:", error);
    return [];
  }
}
