import { Movie, UseFetchResult } from "@/interfaces/interfaces";
import { createApiError } from "@/utils/movieUtils";
import { useCallback, useEffect, useRef, useState } from "react";

export const useFetch = <T>(
  fetchFunction: () => Promise<T>,
  autoFetch = true,
  dependencies: any[] = []
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();

      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        const apiError =
          err instanceof Error
            ? err
            : createApiError("An unknown error occurred");
        setError(apiError);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFunction]);

  const reset = useCallback(() => {
    if (mountedRef.current) {
      setData(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, ...dependencies]); // Remove fetchData from dependencies to prevent infinite loop

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { data, loading, error, refetch: fetchData, reset };
};

// Specific hook for fetching movies with proper typing
export const useFetchMovies = (
  query: string = "",
  page: number = 1,
  autoFetch: boolean = true
) => {
  const { fetchMovies } = require("@/services/api");

  const fetchFunction = useCallback(() => {
    return fetchMovies({ query, numPage: page });
  }, [query, page]);

  return useFetch<Movie[]>(fetchFunction, autoFetch, [query, page]);
};

// Hook for paginated data fetching
export const usePaginatedFetch = <T>(
  fetchFunction: (page: number) => Promise<T[]>,
  initialPage: number = 1
) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [allData, setAllData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, error, refetch, reset } = useFetch(
    () => fetchFunction(currentPage),
    true,
    [currentPage]
  );

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        if (currentPage === initialPage) {
          setAllData(data);
        } else {
          setAllData((prev) => [...prev, ...data]);
        }

        // If we received less data than expected, assume there's no more data
        setHasMore(data.length > 0);
      }
    }
  }, [data, currentPage, initialPage]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage);
    setAllData([]);
    setHasMore(true);
    reset();
  }, [initialPage, reset]);

  return {
    data: allData,
    currentPage,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
    reset: resetPagination,
  };
};

// Hook for infinite scrolling with debounced search
export const useInfiniteMovies = (
  searchQuery: string,
  debounceMs: number = 300
) => {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  const {
    data,
    currentPage,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
    reset,
  } = usePaginatedFetch(async (page: number) => {
    const { fetchMovies } = require("@/services/api");
    return fetchMovies({ query: debouncedQuery, numPage: page });
  }, 1);

  // Reset pagination when search query changes
  useEffect(() => {
    reset();
  }, [debouncedQuery, reset]);

  return {
    data,
    currentPage,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
    reset,
    isSearching: searchQuery !== debouncedQuery,
  };
};
