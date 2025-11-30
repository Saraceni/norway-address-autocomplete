import { useState, useEffect, useCallback, useRef } from 'react';
import { searchAddresses, AddressApiError } from '../services/addressApi';
import type { Address } from '../types/address';
import { useDebounce } from './useDebounce';

interface UseAddressSearchReturn {
  results: Address[];
  loading: boolean;
  error: string | null;
  search: (query: string) => void;
  clearError: () => void;
}

/**
 * Custom hook to manage address search state and API calls
 * @returns Search state and control functions
 */
export function useAddressSearch(): UseAddressSearchReturn {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  const performSearch = useCallback(async (searchQuery: string) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Clear previous error
    setError(null);

    // If query is less than 3 characters, clear results
    if (!searchQuery || searchQuery.trim().length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await searchAddresses(searchQuery, abortController.signal);
      // Only update if request wasn't cancelled
      if (!abortController.signal.aborted) {
        setResults(data);
        setError(null);
      }
    } catch (err) {
      // Don't set error if request was cancelled
      if (!abortController.signal.aborted) {
        if (err instanceof AddressApiError) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        setResults([]);
      }
    } finally {
      // Only update loading state if request wasn't cancelled
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  // Perform search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const search = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearError
  };
}

