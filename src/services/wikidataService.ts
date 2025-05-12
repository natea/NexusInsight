// src/services/wikidataService.ts

import { SearchSuggestion, SearchResultsResponse, ItemDetail, ApiError } from '../types/wikidata';
export type { ApiError }; // Export ApiError type

const API_BASE_URL = import.meta.env.VITE_WIKIDATA_MCP_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_WIKIDATA_MCP_API_BASE_URL is not defined in environment variables.");
  // Depending on the application's error handling strategy, you might want to
  // throw an error here or handle it differently. For boilerplate, we'll log.
}

/**
 * Generic function to handle API requests and basic error checking.
 * @param endpoint - The API endpoint relative to the base URL.
 * @param options - Fetch API options.
 * @returns A promise resolving with the parsed JSON response.
 * @throws ApiError if the response is not OK or parsing fails.
 */
async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorDetails = `HTTP error! status: ${response.status}`;
      try {
        const errorBody = await response.json();
        errorDetails = errorBody.message || JSON.stringify(errorBody);
      } catch (parseError) {
        // If JSON parsing fails, use the status text
        errorDetails = response.statusText;
      }
      throw { message: `API request failed: ${errorDetails}`, code: response.status } as ApiError;
    }

    return response.json() as Promise<T>;

  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    // Re-throw a standardized error
    if ((error as ApiError).message) {
       throw error as ApiError;
    }
    throw { message: `Network or unexpected error: ${(error as Error).message}` } as ApiError;
  }
}

/**
 * Fetches search suggestions based on a query string.
 * @param query - The user's input query string.
 * @param limit - Maximum number of suggestions to return.
 * @returns A promise resolving with an array of SearchSuggestion.
 */
export async function fetchSearchSuggestions(query: string, limit: number = 10): Promise<SearchSuggestion[]> {
  if (!API_BASE_URL) {
    throw { message: "API base URL is not configured." } as ApiError;
  }
  const endpoint = `/api/search/suggest?q=${encodeURIComponent(query)}&limit=${limit}`;
  return fetchData<SearchSuggestion[]>(endpoint);
}

/**
 * Fetches search results based on a query string and pagination.
 * @param query - The search query string.
 * @param page - The page number for pagination.
 * @param limit - The number of items per page.
 * @returns A promise resolving with SearchResultsResponse.
 */
export async function fetchSearchResults(query: string, page: number = 1, limit: number = 20): Promise<SearchResultsResponse> {
   if (!API_BASE_URL) {
    throw { message: "API base URL is not configured." } as ApiError;
  }
  const endpoint = `/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
  return fetchData<SearchResultsResponse>(endpoint);
}

/**
 * Fetches detailed information for a specific Wikidata item.
 * @param itemId - The unique identifier of the item (e.g., "Q123").
 * @returns A promise resolving with ItemDetail.
 */
export async function fetchItemDetail(itemId: string): Promise<ItemDetail> {
   if (!API_BASE_URL) {
    throw { message: "API base URL is not configured." } as ApiError;
  }
  const endpoint = `/api/items/${encodeURIComponent(itemId)}`;
  return fetchData<ItemDetail>(endpoint);
}