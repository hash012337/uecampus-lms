import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Upload, Download, FileText, Search, Trash2, File, BookOpen, ExternalLink } from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  file_path: string;
  file_type: string;
  file_size: number;
  category: string;
  tags: string[];
  downloads: number;
  created_at: string;
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
  source: 'google' | 'openlibrary';
}

const CATEGORIES = ["General", "Course Materials", "Assignments", "References", "Templates", "Other"];

export default function Library() {
  const { user } = useAuth();
  const { isAdmin } = useEditMode();
  const [loading, setLoading] = useState(true);

  // Book search state
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [books, setBooks] = useState<BookResult[]>([]);
  const [searchingBooks, setSearchingBooks] = useState(false);
  
  // Recommended books state
  const [recommendedBooks, setRecommendedBooks] = useState<BookResult[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Book preview state
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookResult | null>(null);

  useEffect(() => {
    if (user) {
      loadRecommendedBooks();
    }
  }, [user]);

  const loadRecommendedBooks = async () => {
    try {
      setLoadingRecommendations(true);
      
      // Fetch user's enrolled courses
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user?.id)
        .eq('status', 'active');

      if (enrollError) throw enrollError;

      let searchTerms: string[] = [];

      if (!enrollments || enrollments.length === 0) {
        // No enrollments - show default educational topics
        searchTerms = ['Computer Science', 'Mathematics', 'Business', 'Engineering'];
      } else {
        // Fetch course details
        const courseIds = enrollments.map(e => e.course_id);
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('title, category, subcategory')
          .in('id', courseIds);

        if (coursesError) throw coursesError;

        if (!courses || courses.length === 0) {
          // Fallback to default topics
          searchTerms = ['Computer Science', 'Mathematics', 'Business', 'Engineering'];
        } else {
          // Extract unique search terms from course titles and categories
          const termsSet = new Set<string>();
          courses.forEach(course => {
            if (course.category) termsSet.add(course.category);
            if (course.subcategory) termsSet.add(course.subcategory);
            // Add main topic from title (first few words)
            const titleWords = course.title.split(' ').slice(0, 3).join(' ');
            termsSet.add(titleWords);
          });
          searchTerms = Array.from(termsSet).slice(0, 4);
        }
      }

      // Search for books based on topics - limit to 3 books per topic for better variety
      const bookPromises = searchTerms.map(term => 
        supabase.functions.invoke('search-books', {
          body: { query: term, maxResults: 3 }
        })
      );

      const results = await Promise.all(bookPromises);
      
      // Combine books with round-robin to ensure variety
      const booksByTopic: BookResult[][] = [];
      const seenIds = new Set<string>();

      results.forEach(result => {
        if (result.data?.books) {
          const topicBooks: BookResult[] = [];
          result.data.books.forEach((book: BookResult) => {
            if (!seenIds.has(book.id)) {
              seenIds.add(book.id);
              topicBooks.push(book);
            }
          });
          if (topicBooks.length > 0) {
            booksByTopic.push(topicBooks);
          }
        }
      });

      // Round-robin distribution to ensure variety
      const mixedBooks: BookResult[] = [];
      let maxLength = Math.max(...booksByTopic.map(arr => arr.length));
      
      for (let i = 0; i < maxLength && mixedBooks.length < 12; i++) {
        for (let j = 0; j < booksByTopic.length && mixedBooks.length < 12; j++) {
          if (i < booksByTopic[j].length) {
            mixedBooks.push(booksByTopic[j][i]);
          }
        }
      }

      setRecommendedBooks(mixedBooks);
    } catch (error) {
      console.error('Error loading recommended books:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };


  const handleBookPreview = (book: BookResult) => {
    setSelectedBook(book);
    setPreviewDialogOpen(true);
  };

  const handleSearchBooks = async (query: string) => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    try {
      setSearchingBooks(true);
      const { data, error } = await supabase.functions.invoke('search-books', {
        body: { query, maxResults: 20 }
      });

      if (error) throw error;

      setBooks(data.books || []);
      toast.success(`Found ${data.books?.length || 0} books`);
    } catch (error: any) {
      console.error('Error searching books:', error);
      toast.error('Failed to search books');
      setBooks([]);
    } finally {
      setSearchingBooks(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            eLibrary
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover educational books and resources
          </p>
        </div>
      </div>

      {/* Tabs for Recommended Books and Book Search */}
      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="recommended">Recommended Books</TabsTrigger>
          <TabsTrigger value="search">Search Educational Books</TabsTrigger>
        </TabsList>

        {/* Recommended Books Tab */}
        <TabsContent value="recommended" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Recommended for You</h2>
              <p className="text-sm text-muted-foreground">Based on your enrolled courses</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadRecommendedBooks}
              disabled={loadingRecommendations}
            >
              {loadingRecommendations ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {loadingRecommendations ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : recommendedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedBooks.map((book) => (
                <Card 
                  key={book.id} 
                  className="border-border/50 hover:shadow-lg transition-all hover:scale-105 duration-300 overflow-hidden cursor-pointer"
                  onClick={() => handleBookPreview(book)}
                >
                  <CardContent className="p-0">
                    {book.thumbnail && (
                      <div className="w-full h-48 bg-muted flex items-center justify-center overflow-hidden">
                        <img 
                          src={book.thumbnail} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-2">{book.title}</h3>
                      
                      {book.authors.length > 0 && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          by {book.authors[0]}
                        </p>
                      )}

                      {book.categories && book.categories.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {book.categories[0]}
                        </Badge>
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
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recommendations available</p>
              <p className="text-sm text-muted-foreground mt-2">Enroll in courses to get personalized book recommendations</p>
            </div>
          )}
        </TabsContent>

        {/* Educational Books Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for educational books (e.g., 'Python programming', 'Mathematics', 'History')..."
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchBooks(bookSearchQuery)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={() => handleSearchBooks(bookSearchQuery)}
              disabled={searchingBooks || !bookSearchQuery.trim()}
            >
              {searchingBooks ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {searchingBooks && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {!searchingBooks && books.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <Card 
                  key={book.id} 
                  className="border-border/50 hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => handleBookPreview(book)}
                >
                  <CardContent className="p-0">
                    {book.thumbnail && (
                      <div className="w-full h-48 bg-muted flex items-center justify-center overflow-hidden">
                        <img 
                          src={book.thumbnail} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm line-clamp-2">{book.title}</h3>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {book.source === 'google' ? 'Google' : 'OpenLib'}
                        </Badge>
                      </div>
                      
                      {book.authors.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          by {book.authors.slice(0, 2).join(', ')}
                          {book.authors.length > 2 && ' et al.'}
                        </p>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {book.categories?.slice(0, 2).map((cat, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-primary pt-2">
                        <BookOpen className="h-3 w-3" />
                        <span>View Details</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!searchingBooks && books.length === 0 && bookSearchQuery && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No books found. Try a different search term.</p>
            </div>
          )}

          {!searchingBooks && books.length === 0 && !bookSearchQuery && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Search for educational books using Google Books and Open Library</p>
              <p className="text-sm text-muted-foreground mt-2">Try searching for topics like "Programming", "Mathematics", "Science", etc.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Book Detail Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl pr-8">{selectedBook?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Book Information Section */}
            <div className="grid md:grid-cols-[200px,1fr] gap-6">
              {selectedBook?.thumbnail && (
                <div className="flex justify-center md:justify-start">
                  <img 
                    src={selectedBook.thumbnail} 
                    alt={selectedBook.title}
                    className="w-48 h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
              
              <div className="space-y-4">
                {/* Authors */}
                {selectedBook?.authors && selectedBook.authors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Authors</h3>
                    <p className="text-base">{selectedBook.authors.join(', ')}</p>
                  </div>
                )}

                {/* Publisher & Date */}
                <div className="flex gap-6 flex-wrap">
                  {selectedBook?.publisher && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Publisher</h3>
                      <p className="text-base">{selectedBook.publisher}</p>
                    </div>
                  )}
                  {selectedBook?.publishedDate && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Published</h3>
                      <p className="text-base">{selectedBook.publishedDate}</p>
                    </div>
                  )}
                  {selectedBook?.pageCount && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Pages</h3>
                      <p className="text-base">{selectedBook.pageCount}</p>
                    </div>
                  )}
                </div>

                {/* Categories */}
                {selectedBook?.categories && selectedBook.categories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Categories</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedBook.categories.map((cat, idx) => (
                        <Badge key={idx} variant="secondary">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {selectedBook?.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">About this book</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedBook.description}
                </p>
              </div>
            )}

            {/* Google Books Preview */}
            {selectedBook?.previewLink && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Book Preview</h3>
                <div className="w-full h-[600px] border border-border rounded-lg overflow-hidden">
                  <iframe
                    src={selectedBook.previewLink.replace('http:', 'https:')}
                    className="w-full h-full"
                    title={`Preview of ${selectedBook.title}`}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
