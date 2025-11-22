import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_BOOKS_API_KEY = Deno.env.get('GOOGLE_BOOKS_API_KEY');

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, maxResults = 20 } = await req.json();

    if (!query || query.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching for books: "${query}"`);

    // Fetch from both APIs in parallel
    const [googleBooks, openLibraryBooks] = await Promise.allSettled([
      fetchGoogleBooks(query, maxResults),
      fetchOpenLibraryBooks(query, maxResults)
    ]);

    const results: BookResult[] = [];

    // Process Google Books results
    if (googleBooks.status === 'fulfilled' && googleBooks.value) {
      results.push(...googleBooks.value);
    } else {
      console.error('Google Books API error:', googleBooks.status === 'rejected' ? googleBooks.reason : 'No results');
    }

    // Process Open Library results
    if (openLibraryBooks.status === 'fulfilled' && openLibraryBooks.value) {
      results.push(...openLibraryBooks.value);
    } else {
      console.error('Open Library API error:', openLibraryBooks.status === 'rejected' ? openLibraryBooks.reason : 'No results');
    }

    console.log(`Found ${results.length} total books`);

    return new Response(
      JSON.stringify({ books: results, total: results.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in search-books function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function fetchGoogleBooks(query: string, maxResults: number): Promise<BookResult[]> {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${GOOGLE_BOOKS_API_KEY}&orderBy=relevance&printType=books`;
    
    console.log('Fetching from Google Books API...');
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Google Books API returned status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.log('No results from Google Books');
      return [];
    }

    return data.items.map((item: any) => {
      const volumeInfo = item.volumeInfo || {};
      return {
        id: `google-${item.id}`,
        title: volumeInfo.title || 'Untitled',
        authors: volumeInfo.authors || [],
        publisher: volumeInfo.publisher,
        publishedDate: volumeInfo.publishedDate,
        description: volumeInfo.description,
        thumbnail: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail,
        categories: volumeInfo.categories || [],
        pageCount: volumeInfo.pageCount,
        language: volumeInfo.language,
        previewLink: volumeInfo.previewLink,
        source: 'google' as const
      };
    });
  } catch (error) {
    console.error('Error fetching from Google Books:', error);
    return [];
  }
}

async function fetchOpenLibraryBooks(query: string, maxResults: number): Promise<BookResult[]> {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${maxResults}`;
    
    console.log('Fetching from Open Library API...');
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Open Library API returned status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (!data.docs || data.docs.length === 0) {
      console.log('No results from Open Library');
      return [];
    }

    return data.docs.map((doc: any) => {
      const coverId = doc.cover_i;
      const thumbnail = coverId 
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : undefined;

      return {
        id: `openlibrary-${doc.key}`,
        title: doc.title || 'Untitled',
        authors: doc.author_name || [],
        publisher: doc.publisher?.[0],
        publishedDate: doc.first_publish_year?.toString(),
        description: doc.first_sentence?.[0],
        thumbnail,
        categories: doc.subject?.slice(0, 5) || [],
        pageCount: doc.number_of_pages_median,
        language: doc.language?.[0],
        previewLink: `https://openlibrary.org${doc.key}`,
        source: 'openlibrary' as const
      };
    });
  } catch (error) {
    console.error('Error fetching from Open Library:', error);
    return [];
  }
}
