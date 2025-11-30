import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchAddresses, AddressApiError } from '../../services/addressApi';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('addressApi', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('searchAddresses', () => {
    it('should return empty array for query less than 3 characters', async () => {
      const result = await searchAddresses('ab');
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return empty array for empty query', async () => {
      const result = await searchAddresses('');
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should make API request and return addresses', async () => {
      const mockAddresses = [
        {
          postNumber: 501,
          city: 'OSLO',
          street: 'Test Street',
          typeCode: 6,
          type: 'Gate-/veg-adresse',
          district: 'Test',
          municipalityNumber: 301,
          municipality: 'Oslo',
          county: 'Oslo',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAddresses,
      });

      const result = await searchAddresses('test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/search/test'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockAddresses);
    });

    it('should URL encode special characters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await searchAddresses('østen');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/search/%C3%B8sten'),
        expect.any(Object)
      );
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(searchAddresses('test')).rejects.toThrow(AddressApiError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(searchAddresses('test')).rejects.toThrow(AddressApiError);
    });

    it('should handle request cancellation', async () => {
      const abortController = new AbortController();
      abortController.abort();

      await expect(
        searchAddresses('test', abortController.signal)
      ).rejects.toThrow(AddressApiError);
    });

    it('should trim whitespace from query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await searchAddresses('  test  ');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/search/test'),
        expect.any(Object)
      );
    });
  });
});

