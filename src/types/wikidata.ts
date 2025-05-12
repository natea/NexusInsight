// src/types/wikidata.ts

// Basic type for a Wikidata item with minimal properties
export interface WikidataItem {
  id: string;
  label: string;
  description?: string;
  [key: string]: any; // Allow for additional properties
}

// Type for search suggestion results
export interface SearchSuggestion extends WikidataItem {}

// Type for search results item
export interface SearchResultItem extends WikidataItem {
  thumbnail_url?: string;
}

// Type for pagination metadata in search results
export interface SearchResultsPagination {
  total_results: number;
  current_page: number;
  per_page: number;
  total_pages: number;
}

// Type for the overall search results response
export interface SearchResultsResponse {
  query: string;
  results: SearchResultItem[];
  pagination: SearchResultsPagination;
}

// Type for detailed item information (illustrative - needs refinement based on actual API)
// This is a simplified representation. The actual type will be more complex
// and should be derived from the wikidata-mcp API documentation.
export interface ItemDetail extends WikidataItem {
  type?: string;
  labels?: Record<string, { language: string; value: string }>;
  descriptions?: Record<string, { language: string; value: string }>;
  aliases?: Record<string, Array<{ language: string; value: string }>>;
  statements?: Record<string, any>; // Statements can be complex, use 'any' or define specific types
  sitelinks?: Record<string, { site: string; title: string; badges: string[] }>;
  modified?: string;
  image_url?: string;
  // Add other potential fields from the API
}

// Type for API error responses (illustrative)
export interface ApiError {
  message: string;
  code?: number;
  details?: any;
}