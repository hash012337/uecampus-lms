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
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    tags: "",
    is_public: false,
    file: null as File | null,
  });

  // Book search state
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [books, setBooks] = useState<BookResult[]>([]);
  const [searchingBooks, setSearchingBooks] = useState(false);
  
  // Recommended books state
  const [recommendedBooks, setRecommendedBooks] = useState<BookResult[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    if (user) {
      loadLibraryItems();
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

      if (!enrollments || enrollments.length === 0) {
        setRecommendedBooks([]);
        return;
      }

      // Fetch course details
      const courseIds = enrollments.map(e => e.course_id);
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('title, category, subcategory')
        .in('id', courseIds);

      if (coursesError) throw coursesError;

      if (!courses || courses.length === 0) {
        setRecommendedBooks([]);
        return;
      }

      // Extract unique search terms from course titles and categories
      const searchTerms = new Set<string>();
      courses.forEach(course => {
        if (course.category) searchTerms.add(course.category);
        if (course.subcategory) searchTerms.add(course.subcategory);
        // Add main topic from title (first few words)
        const titleWords = course.title.split(' ').slice(0, 3).join(' ');
        searchTerms.add(titleWords);
      });

      // Search for books based on course topics (limit to 3 terms for performance)
      const termsArray = Array.from(searchTerms).slice(0, 3);
      const bookPromises = termsArray.map(term => 
        supabase.functions.invoke('search-books', {
          body: { query: term, maxResults: 5 }
        })
      );

      const results = await Promise.all(bookPromises);
      
      // Combine and deduplicate books
      const allBooks: BookResult[] = [];
      const seenIds = new Set<string>();

      results.forEach(result => {
        if (result.data?.books) {
          result.data.books.forEach((book: BookResult) => {
            if (!seenIds.has(book.id)) {
              seenIds.add(book.id);
              allBooks.push(book);
            }
          });
        }
      });

      // Limit to 12 recommendations
      setRecommendedBooks(allBooks.slice(0, 12));
    } catch (error) {
      console.error('Error loading recommended books:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const loadLibraryItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("library_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error loading library:", error);
      toast.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      toast.error("Please select a file");
      return;
    }

    try {
      setUploading(true);

      // Upload file to storage
      const fileExt = formData.file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `library/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("library")
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      // Create library item record
      const { error: insertError } = await supabase.from("library_items").insert({
        title: formData.title,
        description: formData.description,
        file_path: filePath,
        file_type: formData.file.type,
        file_size: formData.file.size,
        category: formData.category,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        is_public: formData.is_public,
        uploaded_by: user?.id,
      });

      if (insertError) throw insertError;

      toast.success("File uploaded successfully");
      setDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        category: "General",
        tags: "",
        is_public: false,
        file: null,
      });
      loadLibraryItems();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (item: LibraryItem) => {
    try {
      const { data, error } = await supabase.storage
        .from("library")
        .download(item.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update download count
      await supabase
        .from("library_items")
        .update({ downloads: item.downloads + 1 })
        .eq("id", item.id);

      toast.success("File downloaded");
      loadLibraryItems();
    } catch (error: any) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const handleDelete = async (item: LibraryItem) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("library")
        .remove([item.file_path]);

      if (storageError) throw storageError;

      // Delete record
      const { error: deleteError } = await supabase
        .from("library_items")
        .delete()
        .eq("id", item.id);

      if (deleteError) throw deleteError;

      toast.success("File deleted");
      loadLibraryItems();
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
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

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            eLibrary
          </h1>
          <p className="text-muted-foreground mt-1">
            Access course materials, resources, and educational books
          </p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload File to Library</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g., lecture, notes, pdf"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload File"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Recommended Books Section */}
      {recommendedBooks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Recommended for You</h2>
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
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedBooks.map((book) => (
                <Card key={book.id} className="border-border/50 hover:shadow-lg transition-all hover:scale-105 duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    {book.thumbnail && (
                      <div className="w-full h-40 bg-muted flex items-center justify-center overflow-hidden">
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
                    <div className="p-3 space-y-1.5">
                      <h3 className="font-semibold text-sm line-clamp-2">{book.title}</h3>
                      
                      {book.authors.length > 0 && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {book.authors[0]}
                        </p>
                      )}

                      {book.categories && book.categories.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {book.categories[0]}
                        </Badge>
                      )}

                      {book.previewLink && (
                        <a 
                          href={book.previewLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline pt-1"
                        >
                          <BookOpen className="h-3 w-3" />
                          <span>Preview</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabs for Library Items and Book Search */}
      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="files">Course Materials</TabsTrigger>
          <TabsTrigger value="books">Search Educational Books</TabsTrigger>
        </TabsList>

        {/* Course Materials Tab */}
        <TabsContent value="files" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {item.file_type.includes("pdf") ? (
                        <FileText className="h-6 w-6 text-primary" />
                      ) : (
                        <File className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="outline">{item.category}</Badge>
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {item.downloads} downloads • {(item.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleDownload(item)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No files found</p>
            </div>
          )}
        </TabsContent>

        {/* Educational Books Search Tab */}
        <TabsContent value="books" className="space-y-4">
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
                <Card key={book.id} className="border-border/50 hover:shadow-lg transition-shadow overflow-hidden">
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

                      {book.description && (
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {book.description}
                        </p>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {book.categories?.slice(0, 2).map((cat, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                        <div className="flex gap-3">
                          {book.publishedDate && <span>{book.publishedDate}</span>}
                          {book.pageCount && <span>{book.pageCount} pages</span>}
                        </div>
                        {book.previewLink && (
                          <a 
                            href={book.previewLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <BookOpen className="h-3 w-3" />
                            <span>View</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
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
    </div>
  );
}
