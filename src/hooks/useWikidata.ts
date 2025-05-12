// src/hooks/useWikidata.ts

import { useState, useEffect, useCallback } from 'react';
import { fetchSearchSuggestions, fetchSearchResults, fetchItemDetail, ApiError } from '../services/wikidataService';
import { SearchSuggestion, SearchResultsResponse, ItemDetail } from '../types/wikidata';

// Generic hook for handling data fetching with loading and error states
function useFetch<T, P extends any[]>(
  fetchFn: (...args: P) => Promise<T>,
  ...args: P
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchDataMemoized = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      setData(result);
    } catch (err) {
      setError(err as ApiError);
      setData(null); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, [fetchFn, ...args]); // Include args in dependency array

  useEffect(() => {
    fetchDataMemoized();
  }, [fetchDataMemoized]); // Depend on the memoized fetch function

  return { data, loading, error, refetch: fetchDataMemoized };
}

// Hook for fetching search suggestions
export function useSearchSuggestions(query: string, limit: number = 10) {
  // Only fetch if query is not empty
  const shouldFetch = query.trim().length > 0;
  const { data, loading, error, refetch } = useFetch(
    fetchSearchSuggestions,
    query,
    limit
  );

  // Return null data and no loading/error if query is empty
  if (!shouldFetch) {
    return { data: null, loading: false, error: null, refetch: () => {} };
  }

  return { data, loading, error, refetch };
}

// Hook for fetching search results
export function useSearchResults(query: string, page: number = 1, limit: number = 20) {
   // Only fetch if query is not empty
  const shouldFetch = query.trim().length > 0;
  const { data, loading, error, refetch } = useFetch(
    fetchSearchResults,
    query,
    page,
    limit
  );

   // Return null data and no loading/error if query is empty
  if (!shouldFetch) {
    return { data: null, loading: false, error: null, refetch: () => {} };
  }

  return { data, loading, error, refetch };
}

// Hook for fetching item details
export function useItemDetail(itemId: string | null) {
  // Only fetch if itemId is provided
  const shouldFetch = itemId !== null && itemId.trim().length > 0;
  const { data, loading, error, refetch } = useFetch(
    fetchItemDetail,
    itemId! // Use non-null assertion as we check shouldFetch
  );

  // Return null data and no loading/error if itemId is null or empty
  if (!shouldFetch) {
    return { data: null, loading: false, error: null, refetch: () => {} };
  }

  return { data, loading, error, refetch };
}