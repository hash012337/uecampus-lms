import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";

// Declare Google Books Viewer
declare global {
  interface Window {
    google: any;
  }
}

interface BookResult {
  id: string;
  title: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  thumbnail?: string;
  categories?: string[];
  pageCount?: number;
  language?: string;
  previewLink?: string;
  source: "google" | "openlibrary";
}

export default function BookDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book as BookResult | undefined;
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!book || !book.previewLink || book.source !== "google") return;

    // Derive Google Books volume ID from preview link or id field
    let volumeId: string | null = null;

    try {
      const url = new URL(book.previewLink.replace("http:", "https:"));
      volumeId = url.searchParams.get("id");
    } catch {
      // ignore URL parsing issues
    }

    if (!volumeId && book.id.startsWith("google-")) {
      volumeId = book.id.replace("google-", "");
    }

    if (!volumeId) return;

    const script = document.createElement("script");
    script.src = "https://www.google.com/books/jsapi.js";
    script.async = true;

    script.onload = () => {
      if (window.google && window.google.books) {
        window.google.books.load();

        const initialize = () => {
          if (viewerRef.current) {
            const viewer = new window.google.books.DefaultViewer(viewerRef.current);
            viewer.load(volumeId!);
          }
        };

        if (window.google.books.setOnLoadCallback) {
          window.google.books.setOnLoadCallback(initialize);
        } else {
          initialize();
        }
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [book]);

  if (!book) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Book not found</h1>
          <Button onClick={() => navigate("/library")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/library")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>

          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          {book.authors && book.authors.length > 0 && (
            <p className="text-lg text-muted-foreground">
              by {book.authors.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[300px,1fr] gap-8">
          {/* Left Column - Book Info */}
          <div className="space-y-6">
            {/* Book Cover */}
            {book.thumbnail && (
              <div className="flex justify-center">
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-full max-w-[250px] rounded-lg shadow-xl"
                />
              </div>
            )}

            {/* Book Details */}
            <div className="space-y-4">
              {book.publisher && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Publisher
                  </h3>
                  <p className="text-base">{book.publisher}</p>
                </div>
              )}

              {book.publishedDate && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Published
                  </h3>
                  <p className="text-base">{book.publishedDate}</p>
                </div>
              )}

              {book.pageCount && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Pages
                  </h3>
                  <p className="text-base">{book.pageCount}</p>
                </div>
              )}

              {book.language && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Language
                  </h3>
                  <p className="text-base">{book.language.toUpperCase()}</p>
                </div>
              )}

              {book.categories && book.categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Categories
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {book.categories.map((cat, idx) => (
                      <Badge key={idx} variant="secondary">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Badge variant="outline" className="text-xs">
                Source: {book.source === "google" ? "Google Books" : "Open Library"}
              </Badge>
            </div>
          </div>

          {/* Right Column - Description and Preview */}
          <div className="space-y-8">
            {/* Description */}
            {book.description && (
              <div>
                <h2 className="text-2xl font-bold mb-4">About this book</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}

            {/* Google Book Preview */}
            {book.source === "google" && book.previewLink && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Book Preview</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        book.previewLink.replace("http:", "https:"),
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
                <div className="w-full h-[800px] border-2 border-border rounded-lg overflow-hidden bg-background">
                  <div
                    ref={viewerRef}
                    className="w-full h-full"
                    id="viewerCanvas"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Preview powered by Google Books
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
