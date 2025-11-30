import type { Address } from '../types/address';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const REQUEST_TIMEOUT = 5000; // 5 seconds

/**
 * Custom error class for API errors
 */
export class AddressApiError extends Error {
  statusCode?: number;
  isNetworkError: boolean;

  constructor(message: string, statusCode?: number, isNetworkError = false) {
    super(message);
    this.name = 'AddressApiError';
    this.statusCode = statusCode;
    this.isNetworkError = isNetworkError;
  }
}

/**
 * Search for addresses using the autocomplete API
 * @param query - Search query (minimum 3 characters required by backend)
 * @param signal - AbortSignal for request cancellation
 * @returns Promise with array of matching addresses
 * @throws AddressApiError on API errors or network failures
 */
export async function searchAddresses(
  query: string,
  signal?: AbortSignal
): Promise<Address[]> {
  if (!query || query.trim().length < 3) {
    return [];
  }

  const encodedQuery = encodeURIComponent(query.trim());
  const url = `${API_BASE_URL}/search/${encodedQuery}`;

  try {
    // Create timeout controller
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(
      () => timeoutController.abort(),
      REQUEST_TIMEOUT
    );

    // Use provided signal or timeout signal
    // If signal is provided, also listen to its abort event
    if (signal) {
      signal.addEventListener('abort', () => {
        timeoutController.abort();
      });
    }

    const abortSignal = signal || timeoutController.signal;

    // Make the API request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortSignal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      throw new AddressApiError(
        `API request failed with status ${response.status}`,
        response.status
      );
    }

    const data = (await response.json()) as Address[];
    return data;
  } catch (error) {
    if (error instanceof AddressApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new AddressApiError('Request was cancelled', undefined, false);
      }
      if (error.message === 'Request timeout') {
        throw new AddressApiError(
          'Request timed out. Please try again.',
          undefined,
          true
        );
      }
      if (error.message.includes('fetch')) {
        throw new AddressApiError(
          'Network error. Please check your connection.',
          undefined,
          true
        );
      }
    }

    throw new AddressApiError(
      'An unexpected error occurred. Please try again.',
      undefined,
      true
    );
  }
}

