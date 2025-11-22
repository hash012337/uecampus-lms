import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Youtube, FileText, Clock, Eye, Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface GuidesData {
  youtube: YouTubeVideo[];
  devto: DevToArticle[];
  total: number;
}

export default function Guides() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [guides, setGuides] = useState<GuidesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-guides", {
        body: { query: query.trim(), maxResults: 12 },
      });

      if (error) throw error;

      setGuides(data);
      toast({
        title: "Success",
        description: `Found ${data.total} learning resources`,
      });
    } catch (error) {
      console.error("Error fetching guides:", error);
      toast({
        title: "Error",
        description: "Failed to fetch learning guides. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoClick = (video: YouTubeVideo) => {
    navigate(`/guides/video/${video.id}`, { state: { video } });
  };

  const handleArticleClick = (article: DevToArticle) => {
    navigate(`/guides/article/${article.id}`, { state: { article } });
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "";
    const hours = (match[1] || "").replace("H", "");
    const minutes = (match[2] || "").replace("M", "");
    const seconds = (match[3] || "").replace("S", "");
    return `${hours ? hours + ":" : ""}${minutes || "0"}:${seconds.padStart(2, "0")}`;
  };

  const formatViewCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return count;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Learning Guides
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover educational videos and programming tutorials
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch}>
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for tutorials, courses, or topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </form>

        {guides && (
          <Tabs defaultValue="youtube" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="youtube" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                Videos ({guides.youtube.length})
              </TabsTrigger>
              <TabsTrigger value="devto" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Articles ({guides.devto.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="youtube" className="mt-6">
              {guides.youtube.length === 0 ? (
                <div className="text-center py-12">
                  <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No videos found for this topic</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {guides.youtube.map((video) => (
                    <Card 
                      key={video.id} 
                      className="border-border/50 hover:shadow-lg transition-all hover:scale-105 duration-300 overflow-hidden cursor-pointer"
                      onClick={() => handleVideoClick(video)}
                    >
                      <CardContent className="p-0">
                        <div className="relative w-full h-48 bg-muted">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          {video.duration && (
                            <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                              {formatDuration(video.duration)}
                            </Badge>
                          )}
                        </div>
                        <div className="p-4 space-y-2">
                          <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {video.channelTitle}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {formatViewCount(video.viewCount || "0")}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-primary pt-1">
                            <BookOpen className="h-3 w-3" />
                            <span>View Details</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="devto" className="mt-6">
              {guides.devto.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No articles found for this topic</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {guides.devto.map((article) => (
                    <Card 
                      key={article.id} 
                      className="border-border/50 hover:shadow-lg transition-all hover:scale-105 duration-300 overflow-hidden cursor-pointer"
                      onClick={() => handleArticleClick(article)}
                    >
                      <CardContent className="p-0">
                        {article.coverImage ? (
                          <div className="w-full h-48 bg-muted">
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-muted flex items-center justify-center">
                            <FileText className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="p-4 space-y-2">
                          <h3 className="font-semibold text-sm line-clamp-2">{article.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            by {article.user.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {article.readingTimeMinutes} min read
                          </div>
                          {article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {article.tags.slice(0, 2).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-primary pt-1">
                            <BookOpen className="h-3 w-3" />
                            <span>View Details</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {!guides && !isLoading && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Search for any topic to discover educational videos from YouTube and programming
              tutorials from Dev.to
            </p>
          </div>
        )}
    </div>
  );
}
